"""Runs under the locked simulation environment; consumes the shared study model."""
from __future__ import annotations
import argparse
import json
import math
import shutil
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent
SIM=ROOT.parent/"simulation"
sys.path.insert(0,str(SIM))
import run as runner
from runtime import executable, environment, digest

def cache_signature(case,p):
    files=[ROOT/"solve.py",ROOT/"freecad_section.py",SIM/"run.py",SIM/"models.py",SIM/"runtime.py",SIM/"uv.lock",SIM/"native-tools.lock.json",SIM/"workers/opensees_worker.py"]
    return dict(input=runner.content_hash(dict(case=case,parameters=p)),sources={f.relative_to(ROOT.parent).as_posix():digest(f,text=True) for f in files})


def structural_job(case,p):
    q=case["program"]; s=p["supports"]
    width,inner=s["reservation_outer_m"],s["reservation_outer_m"]-2*s["illustrative_wall_thickness_m"]
    area=width**2-inner**2; inertia=(width**4-inner**4)/12
    job=dict(schema_version=1,type="elastic_frame_2d",units="N,m,Pa",nodes={},supports={},elements=[],loads={},
             status="Independent axial support lines only; global X,Z mapped to 2D X,Y. No beams/lateral ties or buckling/capacity check. Floor loads include lumped dead and imposed load; no explicit self-weight.")
    mapping={}; node_id=0; total_load=0
    byblock={b["id"]:b for b in case["blocks"]}
    for support in case["supports"]:
        loads={}
        for bid in support["blocks"]:
            block=byblock[bid]
            for floor in range(27):
                z=block["center"][2]+floor*q["floor_height_m"]
                area_per_floor=(q["podium_m"]**2-q["court_m"]**2) if floor<3 else (q["outer_m"]**2-q["court_m"]**2)
                load=area_per_floor*s["combined_gravity_pressure_pa"]/8
                loads[round(z,6)]=loads.get(round(z,6),0)+load
                total_load+=load
        heights=sorted({0.,round(support["top_z"],6),*loads})
        previous=None
        for z in heights:
            node_id+=1; tag=str(node_id)
            job["nodes"][tag]=[support["xy"][0],z]
            if previous is None:
                job["supports"][tag]=[1,1,1]
                mapping[support["id"]]={"base":tag}
            else:
                job["elements"].append(dict(id=len(job["elements"])+1,nodes=[previous,node_id],area_m2=area,
                                             elastic_modulus_pa=s["illustrative_elastic_modulus_pa"],inertia_m4=inertia))
            if z in loads:
                job["loads"][tag]=[0,-loads[z],0]
            previous=node_id
        mapping[support["id"]]["top"]=str(node_id)
        # Independent analytical axial shortening: sum(P_i*z_i)/(EA).
        mapping[support["id"]]["expected_shortening_m"]=sum(z*force for z,force in loads.items())/(s["illustrative_elastic_modulus_pa"]*area)
        mapping[support["id"]]["expected_reaction_N"]=sum(loads.values())
    return job,mapping,area,total_load


def bridge_job(span,p):
    w=p["utilities"]["bridge_width_m"]; h=p["utilities"]["bridge_depth_m"]
    pressure=p["supports"]["combined_gravity_pressure_pa"]; modulus=p["supports"]["illustrative_elastic_modulus_pa"]
    segments=20
    job=dict(schema_version=1,type="elastic_frame_2d",units="N,m,Pa",nodes={},supports={"1":[1,1,0],str(segments+1):[0,1,0]},elements=[],loads={})
    for i in range(segments+1):
        job["nodes"][str(i+1)]=[i*span/segments,0]
        job["loads"][str(i+1)]=[0,-w*pressure*span/segments*(.5 if i in (0,segments) else 1),0]
        if i:
            job["elements"].append(dict(id=i,nodes=[i,i+1],area_m2=w*h,elastic_modulus_pa=modulus,inertia_m4=w*h**3/12))
    expected=5*w*pressure*span**4/(384*modulus*w*h**3/12)
    return job,expected,str(segments//2+1)


def solve(case,p,out):
    out.mkdir(parents=True,exist_ok=True)
    signature=cache_signature(case,p)
    records={}
    for suffix,(job,mapping,area,total) in [("support",structural_job(case,p))]:
        path=out/f"{suffix}-input.json";runner.write_json(path,job)
        folder,result=runner.run_case("opensees",path)
        values=[]
        for s in case["supports"]:
            m=mapping[s["id"]]
            shortening=-result["displacements_m_m_rad"][m["top"]][1]
            reaction=result["reactions_N_N_Nm"][m["base"]][1]
            runner.require_close(shortening,m["expected_shortening_m"],"axial shortening",rel=1e-7)
            runner.require_close(reaction,m["expected_reaction_N"],"reaction",rel=1e-7)
            values.append(dict(id=s["id"],shortening_m=shortening,reaction_N=reaction,nominal_axial_stress_pa=reaction/area))
        runner.require_close(sum(v["reaction_N"] for v in values),total,"section gravity equilibrium",rel=1e-8)
        records["support"]=dict(solver_version=result["solver_version"],mapping="Global Z maps to frame Y; each support line independent, no lateral response claimed",
                                gravity_load_N=total,nominal_support_material_area_m2=area,
                                max_shortening_m=max(v["shortening_m"] for v in values),min_shortening_m=min(v["shortening_m"] for v in values),
                                max_nominal_axial_stress_pa=max(v["nominal_axial_stress_pa"] for v in values),supports=values,
                                checks="Each axial line matches sum(P*z)/(EA); summed base reactions balance applied gravity",
                                manifest=json.loads((folder/"manifest.json").read_text()))
    span=max(b["size"][0] for b in case["bridges"])
    job,expected,mid=bridge_job(span,p)
    path=out/"bridge-input.json";runner.write_json(path,job)
    folder,result=runner.run_case("opensees",path)
    actual=-result["displacements_m_m_rad"][mid][1]
    runner.require_close(actual,expected,"simply supported uniform load",rel=.003)
    records["bridge"]=dict(solver_version=result["solver_version"],span_m=span,elastic_deflection_m=actual,
                            analytical_deflection_m=expected,span_to_deflection=span/actual,
                            assumptions="Solid rectangular 8 m wide x 2 m deep illustrative elastic beam, simply supported, 12 kPa lumped area load. Diagnostic only, no strength/creep/reinforcement check.",
                            manifest=json.loads((folder/"manifest.json").read_text()))
    # Black surfaces isolate geometry: irradiance equals cosine-weighted visible sky.
    job=dict(schema_version=1,units="m,W/m2/sr",sky_radiance=p["daylight"]["sky_radiance_w_m2_sr"],
             sensors=case["sensors"],opaque_boxes=case["obstruction_boxes"])
    path=out/"daylight-input.json";runner.write_json(path,job)
    folder,result=runner.run_case("radiance",path)
    records["daylight"]=dict(solver_version=result["solver_version"],sensors=result["sensors"],
                              manifest=json.loads((folder/"manifest.json").read_text()))
    # Repeat all sensors at 4x rays, identical scene and deterministic sampling.
    raw=runner.command([executable("radiance"),"-I+","-h","-ab","2","-ad",str(p["daylight"]["convergence_ambient_divisions"]),
                        "-as","0","-aa","0","-av","0","0","0","-lw","1e-8","-n","1",folder/"scene.oct"],
                       folder,"rtrace-convergence",environment("radiance"),stdin=(folder/"sensors.pts").read_bytes(),timeout=600)
    rgb=[list(map(float,row.split())) for row in raw.splitlines() if row.strip()]
    if len(rgb)!=len(case["sensors"]): raise RuntimeError("Convergence run returned wrong sensor count")
    records["daylight"]["convergence_sensors"]=[dict(id=s["id"],illuminance_lux=179*sum(a*b for a,b in zip(v,[.265,.670,.065]))) for s,v in zip(case["sensors"],rgb)]
    records["daylight"]["convergence_divisions"]=p["daylight"]["convergence_ambient_divisions"]
    records["daylight"]["convergence_stdout_sha256"]=digest(folder/"rtrace-convergence.stdout.log")
    # Reusable, editable CAD: courtyard slab prototypes and placed native links.
    cad=out/"cad";cad.mkdir(exist_ok=True)
    worker=ROOT/"freecad_section.py"
    cad_input=out/"cad-input.json";runner.write_json(cad_input,dict(case=case,parameters=p))
    env=environment("freecad");env.update(ARCOLOGY_INPUT=str(cad_input),ARCOLOGY_OUTPUT=str(cad))
    runner.command([executable("freecad"),worker],cad,"freecad",env,timeout=900)
    records["cad"]=json.loads((cad/"result.json").read_text())
    if not records["cad"]["native_valid"] or not records["cad"]["step_valid"]:
        raise RuntimeError("Invalid native/exchange section model")
    if signature!=cache_signature(case,p):
        raise RuntimeError("Solver sources changed during execution; rerun with stable sources")
    records["cache_signature"]=signature
    runner.write_json(out/"solver-results.json",records)
    files=[out/"solver-results.json",cad/"result.json",cad/(case["id"]+".FCStd")]
    runner.write_json(out/"solver-cache.json",{f.relative_to(out).as_posix():digest(f,text=f.suffix==".json") for f in files})
    return records


if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("case",type=Path);parser.add_argument("output",type=Path)
    args=parser.parse_args()
    payload=json.loads(args.case.read_text())
    solve(payload["case"],payload["parameters"],args.output.resolve())
