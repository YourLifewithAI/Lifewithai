"""Build, solve and publish a reproducible four-district comparison."""
from __future__ import annotations
import argparse
import csv
import datetime as dt
import hashlib
import json
import math
import os
import platform
import subprocess
import sys
from pathlib import Path

import numpy as np
from shapely.geometry import box, Point
from shapely.ops import unary_union
from model import ROOT, SQFT, read_inputs, build_case, ledger

OUTPUT=ROOT/"output"

def write_json(path,value):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(value,indent=2,allow_nan=False)+"\n",encoding="utf-8")


def footprint(block,q,level="housing"):
    x,y,_=block["center"];s=q["outer_m"] if level=="housing" else q["podium_m"];c=q["court_m"]
    return box(x-s/2,y-s/2,x+s/2,y+s/2).difference(box(x-c/2,y-c/2,x+c/2,y+c/2))


def geometric_checks(case,p):
    q=case["program"]
    for d in case["districts"]:
        x,y,z=d["center"];half=q["district_pitch_m"]/2
        if x-half < -655 or x+half > 655 or y-half < -300 or y+half > 480 or z+q["height_m"]>260:
            raise ValueError("Extend the coordinated drawing limits before testing this larger placement")
    for level in (0,1):
        group=[b for b in case["blocks"] if b["district"].startswith("L" if level==0 else "U")]
        for kind,floors,expected in (("housing",24,2*q["residential_gross_m2"]),("civic",3,2*q["civic_gross_m2"])):
            shapes=[footprint(b,q,kind) for b in group]
            total=sum(s.area for s in shapes);union=unary_union(shapes)
            if not math.isclose(total,union.area,abs_tol=.001) or not math.isclose(total*floors,expected,rel_tol=1e-10):
                raise ValueError("Floor overlap or program mismatch")
    for s in case["supports"]:
        w=p["supports"]["reservation_outer_m"]
        reservation=box(s["xy"][0]-w/2,s["xy"][1]-w/2,s["xy"][0]+w/2,s["xy"][1]+w/2)
        for b in case["blocks"]:
            if b["id"] in s["blocks"] and not footprint(b,q).buffer(1e-8).covers(reservation):
                raise ValueError("Support envelope intrudes into the court or outside the floor")
    # Rooms are reservations within civic gross floor area, not additions to the program.
    for r in case["plant_rooms"]:
        x,y,z=r["origin"];w,d,h=r["size"]
        candidates=[footprint(b,q,"civic") for b in case["blocks"] if b["district"]==r["district"]]
        if not unary_union(candidates).covers(box(x,y,x+w,y+d)) or h>q["floor_height_m"]:
            raise ValueError("Plant-room reservation does not fit a civic floor")
    for s in case["sensors"]:
        for b in case["obstruction_boxes"]:
            if all(o+1e-7<v<o+d-1e-7 for v,o,d in zip(s["position"],b["origin"],b["size"])):
                raise ValueError(f"Sensor {s['id']} lies inside {b['id']}")
    decks=case["service_decks"]
    deck_union_area=0
    for z in {b["origin"][2] for b in decks}:
        deck_union_area+=unary_union([box(b["origin"][0],b["origin"][1],b["origin"][0]+b["size"][0],b["origin"][1]+b["size"][1])
                                     for b in decks if b["origin"][2]==z]).area
    lower=unary_union([footprint(b,q) for b in case["blocks"] if b["district"].startswith("L")])
    upper=unary_union([footprint(b,q,"civic") for b in case["blocks"] if b["district"].startswith("U")])
    return dict(floor_area_and_overlap="passed",support_reservations_in_floor="passed",plant_reservations="passed",sensors_outside_solids="passed",
                uncovered_lower_roof_footprint_m2=lower.difference(upper).area,
                service_deck_union_area_m2=deck_union_area,plant_reserved_gross_m2=sum(r["size"][0]*r["size"][1] for r in case["plant_rooms"]))


def analyze_daylight(case,records,p):
    raw={s["id"]:s for s in records["daylight"]["sensors"]}
    fine={s["id"]:s for s in records["daylight"]["convergence_sensors"]}
    rows=[]
    for sensor in case["sensors"]:
        baseline=179*math.pi*p["daylight"]["sky_radiance_w_m2_sr"]*(1 if sensor["kind"]=="court" else .5)
        a=raw[sensor["id"]]["illuminance_lux"]/baseline;b=fine[sensor["id"]]["illuminance_lux"]/baseline
        if not -1e-6<=a<=1.01 or not -1e-6<=b<=1.01:raise ValueError("Normalized sky fraction out of range")
        rows.append(dict(**sensor,sky_fraction=b,coarse_sky_fraction=a,convergence_difference=abs(a-b)))
    groups={}
    for tier in ("L","U"):
        for kind in ("court","inner","outer"):
            subset=[s for s in rows if s["district"].startswith(tier) and s["kind"]==kind]
            values=[s["sky_fraction"] for s in subset]
            groups[tier+"-"+kind]=dict(n=len(values),mean=float(np.mean(values)),median=float(np.median(values)),minimum=min(values),p10=float(np.quantile(values,.1)),
                                       fraction_below_diagnostic_20pct=sum(v<.2 for v in values)/len(values))
    diffs=[s["convergence_difference"] for s in rows]
    converged=float(np.quantile(diffs,.95))<=.01 and max(diffs)<=.03
    if not converged:raise RuntimeError(f"Sky integration needs more rays: p95={np.quantile(diffs,.95)} max={max(diffs)}")
    return dict(groups=groups,convergence_max_abs_fraction=max(diffs),convergence_p95_abs_fraction=float(np.quantile(diffs,.95)),
                converged=converged,sensors=rows,
                metric="Cosine-weighted visible uniform sky divided by unobstructed sky on the same sensor orientation. Black surfaces, no sun, glass, weather or room light levels.")


def hashes():
    sources=[*ROOT.glob("*.py"),ROOT/"parameters.json",ROOT.parent/"massing-study-01/parameters.json",
             ROOT.parent/"pyproject.toml",ROOT.parent/"uv.lock",ROOT.parent/".python-version"]
    sim=ROOT.parent/"simulation"
    sources += [*sim.glob("*.py"),*sim.glob("*.toml"),*sim.glob("*.lock"),sim/"native-tools.lock.json",*sim.glob("workers/*.py")]
    return {p.relative_to(ROOT.parent).as_posix():hashlib.sha256(p.read_bytes().replace(b"\r\n",b"\n")).hexdigest() for p in sorted(sources)}


def report(cases,results,p):
    q=cases[0]["program"]
    rows=[]
    for c in cases:
        r=results[c["id"]];l=r["ledger"];d=r["daylight"]["groups"];s=r["structural"]
        rows.append(f"| {c['label']} | {l['footprint_envelope_m2']/1e6:.3f} | {d['L-court']['mean']:.1%} | {d['L-inner']['mean']:.1%} | {l['support_axes']} / {l['upper_only_axes']} | {l['longest_bridge_span_m']:.1f} | {l['routed_service_corridor_length_m']/1000:.2f} |")
    text=f"""# Four districts: placement comparison

Generated {dt.date.today().isoformat()}. Concept screening, not a construction design.

All three arrangements contain **80,000 humans, 80,000 paired AI plus unquantified other AI, and 60 million sqft of private homes**. Each has 64 courtyard blocks, 24 housing floors and three civic/service floors per block. Private housing stays at 750 sqft per human. The local civic program also stays constant. This is one two-tier section, **{q['tier_pitch_m']+q['height_m']:.1f} m high**, not the entire Arcology or the full load from everything above it.

## Comparison

| Arrangement | Cell envelope footprint, km2 | Lower court sky fraction | Lower inner-facade sky fraction | Ground-reaching support axes / upper-only axes | Boundary bridge clear span, m | A+B service-route length, km |
|---|---:|---:|---:|---:|---:|---:|
{chr(10).join(rows)}

Sky fractions compare irradiance with unobstructed sky on the same horizontal or vertical orientation. They are not daylight factors, room illuminance, annual sunlight hours or compliance scores. The model has a uniform sky, black opaque surfaces and no glazing. Court means average 32 lower-court sensors; inner-facade means average 384 lower sensors across four directions and three housing elevations. Every case uses the same local sensor locations and program.

## Interpretation

Aligned preserves a compact footprint and shared support axes, but doubling the surrounding building height reduces the amount of sky visible from lower courts. A court can remain vertically open and still be heavily enclosed.

Stepped moves the upper districts by exactly one 140 m block pitch. Three of four block rows retain aligned supports; the exposed fourth lower row gains sky and uncovered roof footprint. The upper edge row needs additional ground-reaching supports below it. This avoids an invented transfer floor, but leaves tall exposed support segments requiring a braced frame/core solution. The service routes also acquire upper-level jogs.

Separated widens the district boundary by 140 m. The local courtyard geometry within each stacked pair is unchanged, so the major benefit should be sought at outward-facing edges. It creates a much longer boundary crossing. The illustrative two-metre-deep bridge beam is a deliberately simple diagnostic, not a selected system: its displacement and span sensitivity show why the crossing needs a dedicated long-span design or a different support arrangement.

**Carry the stepped arrangement forward as the leading hypothesis, with aligned as the compact control, but do not freeze the courtyard geometry yet.** Its lower court mean remains only about 4% of unobstructed horizontal sky, and the median remains near 2% because most rows still sit below upper blocks. The inward-facade mean improves to about 8.6%, but its median is only about 1.7%; the gain is uneven. The next iteration should compare wider/shallower courts, shorter inhabited stacks and openings to larger sky corridors while keeping the private-home program fixed. Indoor daylight and annual/site conditions must then be evaluated explicitly.

Stepping increases the planning-cell footprint by 25%, adds 64 upper-only support axes with 128 m of unoccupied height beneath their district, and produces about {results['stepped']['geometry']['uncovered_lower_roof_footprint_m2']:,.0f} m2 of lower roof footprint without an upper building directly above it. That roof area is an opportunity, not a usable public-park area certification. Grid alignment retains 192 of 256 upper support axes over lower supports. Resolve the exposed edge frame and street/deck supports before describing this as a viable structural system. The separated option improves outward-facing lower facade sky access from about 21.4% to 23.9%, but does little for the inner courts; reserve such openings for places where that edge/public-space benefit warrants the crossing cost.

## Equal-program ledger

Per arrangement: {4*q['residential_gross_m2']:,.0f} m2 residential gross, including {4*q['private_m2']:,.0f} m2 private homes; {4*q['civic_gross_m2']:,.0f} m2 local civic/service gross, containing {4*q['civic_usable_m2']:,.0f} m2 usable program. Courtyards are cut out on every floor and are not counted as housing. Support/core envelopes sit inside the inherited 30% gross allowance. Plant rooms reserve 512 m2 per district within civic gross area; this is a placeholder, not equipment sizing. Service decks outside the building rings are additional circulation/utility area, reported separately with overlap removed.

The earlier citywide program still assigns another {4*q['case_A_citywide_usable_share_m2']:,.0f} m2 usable area to these residents outside the four cells. This study does not claim those regional/shared facilities have been fitted here. The shared-city case's 75% private/residential-usable ratio alone would require {4*q['case_B_additional_residential_gross_m2']:,.0f} m2 more residential gross area for the same residents, before its larger shared-city program. That remains a program-demand comparison; these placements use the housing-led district.

The center-of-court sensors are virtual probes at the housing-entry elevation plus 1.5 m. In the stacked cases the courts remain vertically continuous; these probes do not imply a floor or suspended garden across the opening. Facade sensors lie 50 mm outside the opaque faces. The same 1,600 locations relative to their districts are evaluated in every arrangement; repeating at four times the ray count changed no sensor by more than one percentage point. Results are distributions, not guarantees that every resident receives the mean.

## Structural screen

Eight illustrative hollow support/core envelopes per block, each 8 m square with 1 m walls, reserve {results['aligned']['ledger']['support_reserved_floor_fraction']:.1%} of a residential floor. These are spatial and stiffness assumptions, not approved concrete/steel member sizes. OpenSees uses E=30 GPa and a common 12 kPa lumped gravity pressure on housing and civic floor area. The load includes a provisional allowance for structure, finishes, services and occupancy; explicit self-weight is not added again. Deck/bridge loads are assessed separately and are not transferred into the support-line model.

Each vertical axis is an independent linear elastic line with a fixed base. No horizontal frame action, foundation settlement, lateral loads, buckling, creep, cracking, load factors, overburden or strength checks are included. Every axial result is checked against sum(P*z)/(EA), and total reactions balance the floor loads. Results indicate movements to resolve at cross-connections, not allowable deformations. A full three-dimensional structural model needs a selected system and load brief.

| Arrangement | Gravity load, GN | Peak nominal axial stress, MPa | Peak shortening, mm | Boundary-bridge linear deflection, mm | Unoccupied height below upper-only supports, m |
|---|---:|---:|---:|---:|---:|
"""
    for c in cases:
        r=results[c["id"]];s=r["structural"]
        text+=f"| {c['label']} | {s['gravity_load_N']/1e9:.2f} | {s['max_nominal_axial_stress_pa']/1e6:.1f} | {s['max_shortening_m']*1000:.1f} | {r['bridge']['elastic_deflection_m']*1000:.1f} | {r['ledger']['unbraced_edge_height_to_upper_district_m']:.1f} |\n"
    text+="\nThe identical peak axial response comes from the fully stacked support lines present in every case. It does not imply equal lateral stability or equal foundation cost. In the linear pressure sensitivity, the peak response scales as follows (same section/stiffness assumptions):\n\n| Lumped floor pressure, kPa | Peak nominal axial stress, MPa | Peak axial shortening, mm |\n|---|---:|---:|\n"
    for row in results["aligned"]["linear_pressure_sensitivity"]:
        text+=f"| {row['pressure_pa']/1000:.0f} | {row['max_nominal_axial_stress_pa']/1e6:.1f} | {row['max_shortening_m']*1000:.1f} |\n"
    text+="""
Bridge checks use a simply supported solid rectangular 8 m by 2 m elastic section and the same illustrative area pressure; this is not a truss or optimized bridge. Twenty load subdivisions agree with the uniform-load beam formula within 0.3%. Large predicted movement is evidence that this assumed section/model is unsuitable, not a prediction of the behavior of a properly designed bridge.

## Utilities and independence

All variants have two separated A/B street spines, local plant interfaces and section-entry boundaries. The graph checks loss of each edge, each local plant interface, the entire A spine, and all section supply boundaries. Each single modeled edge/interface loss and A-spine loss leaves all four districts connected through another path. Losing all section entries disconnects all four. Connectivity is not spare capacity, supply independence or guaranteed continuity of service. A and B may share an upstream source; common structural/fire/flood faults are not yet modeled.

Electricity, potable water, cooling supply/return and data are tagged on the routes. Cooling supply and return are separate services, not interchangeable redundancy. Potable water needs pressure breaks/boosting; the provisional 40 m pressure-zone increment gives seven vertical zones through this section (about 0.39 MPa static head per 40 m, before losses). Pump sizing, pressure transients, electrical protection, sewage routing, water storage, thermal storage, heat rejection and autonomy duration remain unresolved. Compute capacity and AI heat rejection need equipment workloads; no floor-area percentage is used as a compute requirement.

The room/plant reservations and service-deck paths have not established evacuation, fire compartments, service access, transport capacity or natural ventilation. High sky access does not prove adequate airflow. EnergyPlus is installed, but no district energy ranking is manufactured without site weather, envelope and operating schedules.

## Files and reproduction

- `comparison.png`, `plans.png`, `sections.png`, `sky-maps.png`, `utilities.png`: coordinated review graphics.
- `viewer.html`: offline interactive 3D geometry, sensors and service routes for all three cases.
- `results.json`, `comparison.csv`, per-case `model.json` and `solver-results.json`: exact inputs, results and solver provenance.
- Per-case `cad/*.FCStd`: editable slab prototypes with placed floor/core links. STEP is generated locally and kept outside Git because it is much larger. CAD body volumes include intentional intersections and are not a concrete takeoff.

Run `uv run --project engineering --locked python engineering/section-study-01/build.py build` after installing the simulation toolchain. Use `check` to verify the saved source and artifact hashes without rerunning solvers. `render` reuses current solver records to regenerate graphics only; source changes still require a full rebuild for current evidence.

The source brief, input assumptions and solver limitations are versioned with the study. These plans are schematic engineering drawings, not new approved Arcology artwork or a final structural scheme.

Methods: [Radiance rtrace manual](https://www.radiance-online.org/learning/documentation/manual-pages/pdfs/rtrace.pdf), [OpenSees elastic beam-column API](https://openseespydoc.readthedocs.io/en/latest/src/elasticBeamColumn.html). Analytical checks and thresholds are explicitly defined in the local code; the 20% sky band is a diagnostic marker, not a regulatory threshold.
"""
    (OUTPUT/"report.md").write_text(text,encoding="utf-8")


def build(run_solvers=True,reuse=False):
    initial_sources=hashes()
    p,source=read_inputs()
    if p["daylight"]["primary_ambient_divisions"]!=4096 or p["daylight"]["opaque_reflectance"]!=0:
        raise ValueError("This first study uses the verified 4096-ray black-obstruction adapter")
    cases=[build_case(p,source,v) for v in p["variants"]]
    results={}
    for case in cases:
        out=OUTPUT/case["id"];out.mkdir(parents=True,exist_ok=True)
        geometry=geometric_checks(case,p)
        write_json(out/"model.json",dict(case=case,parameters=p))
        cached=False
        if reuse and (out/"solver-results.json").exists():
            from solve import cache_signature
            cached=json.loads((out/"solver-results.json").read_text()).get("cache_signature")==cache_signature(case,p)
            if not (out/"solver-cache.json").exists():cached=False
            elif cached:
                for name,expected in json.loads((out/"solver-cache.json").read_text()).items():
                    f=out/name
                    if not f.exists():cached=False;break
                    data=f.read_bytes().replace(b"\r\n",b"\n") if f.suffix==".json" else f.read_bytes()
                    if hashlib.sha256(data).hexdigest()!=expected:cached=False;break
        if run_solvers and not cached:
            print(f"Solving {case['id']}: support paths, bridge, daylight, CAD",flush=True)
            child_env=os.environ.copy();child_env.pop("VIRTUAL_ENV",None)
            subprocess.run(["uv","run","--project",str(ROOT.parent/"simulation"),"--locked","python",str(ROOT/"solve.py"),str(out/"model.json"),str(out)],check=True,env=child_env)
        raw=json.loads((out/"solver-results.json").read_text())
        sky=analyze_daylight(case,raw,p)
        pressure=p["supports"]["combined_gravity_pressure_pa"]
        sensitivity=[dict(pressure_pa=v,max_nominal_axial_stress_pa=raw["support"]["max_nominal_axial_stress_pa"]*v/pressure,max_shortening_m=raw["support"]["max_shortening_m"]*v/pressure) for v in p["supports"]["pressure_sensitivity_pa"]]
        results[case["id"]]=dict(ledger=ledger(case,p),geometry=geometry,daylight=sky,structural=raw["support"],bridge=raw["bridge"],cad=raw["cad"],linear_pressure_sensitivity=sensitivity)
        print(f"{case['id']}: lower court sky {sky['groups']['L-court']['mean']:.1%}; geometry checks passed",flush=True)
    write_json(OUTPUT/"results.json",results)
    with (OUTPUT/"comparison.csv").open("w",newline="",encoding="utf-8") as f:
        writer=csv.DictWriter(f,fieldnames=["case","humans","private_home_sqft","footprint_envelope_m2","support_axes","upper_only_axes","longest_bridge_span_m","routed_service_corridor_length_m","lower_court_sky_fraction","lower_inner_facade_sky_fraction"])
        writer.writeheader()
        for c in cases:
            r=results[c["id"]];row={k:r["ledger"][k] for k in writer.fieldnames if k in r["ledger"]}
            row.update(case=c["id"],lower_court_sky_fraction=r["daylight"]["groups"]["L-court"]["mean"],lower_inner_facade_sky_fraction=r["daylight"]["groups"]["L-inner"]["mean"]);writer.writerow(row)
    from render import render
    render(cases,results,p,OUTPUT)
    report(cases,results,p)
    if run_solvers:
        if hashes()!=initial_sources:raise RuntimeError("Study source changed during build; rebuild with stable sources")
        artifacts={f.relative_to(OUTPUT).as_posix():hashlib.sha256(f.read_bytes().replace(b"\r\n",b"\n") if f.suffix in (".json",".csv",".md",".html",".svg") else f.read_bytes()).hexdigest()
                   for f in OUTPUT.rglob("*") if f.is_file() and f.name!="provenance.json" and f.suffix not in (".step",".log",".FCBak",".FCStd1") and not f.name.endswith(".command.json") and f.name not in ("support-input.json","cad-input.json")}
        write_json(OUTPUT/"provenance.json",dict(created_utc=dt.datetime.now(dt.timezone.utc).isoformat(),platform=platform.platform(),sources=initial_sources,artifacts=artifacts))


def check():
    saved=json.loads((OUTPUT/"provenance.json").read_text())
    if saved["sources"]!=hashes():raise RuntimeError("Study source changed; rebuild results")
    for name,expected in saved["artifacts"].items():
        f=OUTPUT/name;data=f.read_bytes()
        if f.suffix in (".json",".csv",".md",".html",".svg"):data=data.replace(b"\r\n",b"\n")
        if hashlib.sha256(data).hexdigest()!=expected:raise RuntimeError(f"Artifact changed: {name}")
    print("Section study source and artifact hashes match. This does not rerun engineering solvers.")


if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("command",choices=["build","render","check"]);parser.add_argument("--reuse-solvers",action="store_true")
    args=parser.parse_args()
    if args.command=="check":check()
    else:build(args.command=="build",args.reuse_solvers)
