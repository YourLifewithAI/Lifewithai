"""Run in a separate process: OpenSees owns global model state."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from models import validate
import openseespy.opensees as ops


def run(job):
    validate("opensees", job)
    ops.wipe()
    try:
        ops.model("basic", "-ndm", 2, "-ndf", 3)
        for tag, xy in job["nodes"].items():
            ops.node(int(tag), *xy)
        for tag, fix in job["supports"].items():
            ops.fix(int(tag), *fix)
        ops.geomTransf("Linear", 1)
        for e in job["elements"]:
            ops.element("elasticBeamColumn", e["id"], *e["nodes"], e["area_m2"],
                        e["elastic_modulus_pa"], e["inertia_m4"], 1)
        ops.timeSeries("Linear", 1)
        ops.pattern("Plain", 1, 1)
        for tag, load in job["loads"].items():
            ops.load(int(tag), *load)
        ops.constraints("Plain")
        ops.numberer("RCM")
        ops.system("BandGeneral")
        ops.algorithm("Linear")
        ops.integrator("LoadControl", 1.0)
        ops.analysis("Static")
        status = ops.analyze(1)
        if status != 0:
            raise RuntimeError(f"OpenSees analysis failed with code {status}")
        ops.reactions()
        displacement = {tag: ops.nodeDisp(int(tag)) for tag in job["nodes"]}
        reactions = {tag: ops.nodeReaction(int(tag)) for tag in job["supports"]}
        equilibrium = [0.0, 0.0, 0.0]
        for source in (job["loads"], reactions):
            for tag, (fx, fy, moment) in source.items():
                x, y = job["nodes"][tag]
                equilibrium[0] += fx
                equilibrium[1] += fy
                equilibrium[2] += moment + x * fy - y * fx
        return {"solver_version": ops.version(), "analysis_code": status,
                "displacements_m_m_rad": displacement, "reactions_N_N_Nm": reactions,
                "equilibrium_residual_N_N_Nm": equilibrium,
                "assumptions": "2D, small displacement, linear elastic Euler-Bernoulli members; nodal loads only; no self-weight, dynamics, buckling or strength check"}
    finally:
        ops.wipe()


if __name__ == "__main__":
    result = run(json.loads(Path(sys.argv[1]).read_text()))
    Path(sys.argv[2]).write_text(json.dumps(result, indent=2, allow_nan=False) + "\n")
