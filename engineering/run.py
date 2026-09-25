"""Portable entry point. Input/output checking uses only Python's standard library."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import os
import platform
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
STUDY = ROOT / "massing-study-01"
OUT = STUDY / "output"
MANIFEST = OUT / "provenance.json"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path):
    data = path.read_bytes()
    if path.suffix in {".py", ".json", ".toml", ".lock", ".txt", ".html", ".svg"} or path.name == ".python-version":
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def validate_inputs():
    p = read(STUDY / "parameters.json")
    req, g, d = p["requirements"], p["geometry"], p["district"]
    require(req["humans"] > 0 and req["paired_ai"] >= 0, "Population must be explicit and positive.")
    require(req["private_home_sqft_per_human"] >= 750, "The confirmed private-home minimum is 750 sqft/person.")
    require(d["humans"] > 0 and req["humans"] % d["humans"] == 0, "Use a whole number of district population allocations.")
    require([c["id"] for c in p["cases"]] == ["A", "B"], "This comparison expects cases A and B in order.")
    for c in p["cases"]:
        for key in ("residential_private_efficiency", "residential_share_of_usable", "usable_to_gross"):
            require(0 < c[key] <= 1, f"{c['id']}.{key} must be within (0, 1].")
    require(d["residential_blocks"] == 16 and d["housing_floors_per_block"] == 24,
            "This prototype draws 16 blocks and 24 housing floors; change its topology in the generator first.")
    require(d["private_fraction_of_residential_usable"] == p["cases"][0]["residential_private_efficiency"], "District private-area factor must match A.")
    require(d["residential_usable_to_gross"] == p["cases"][0]["usable_to_gross"] == .7, "The current district drawing uses a 70% usable/gross factor.")
    require(d["district_pitch_m"] == 4 * d["block_spacing_m"], "District cell must contain its four-by-four block grid.")
    require(d["block_spacing_m"] == 140 and d["block_outer_side_m"] == 100,
            "Update the drawing extents and section geometry before changing the 140 m grid or 100 m block.")
    require(g["wing_count"] == 6 and len(g["wing_radii_ratios"]) == 3, "This study uses six three-tier wings.")
    require(2 <= g["main_tiers"] <= g["total_main_floors"], "Main tier count must be between 2 and the floor count.")
    require(0 < g["summit_radius_ratio"] < 1 and g["floor_height_m"] > 0, "Invalid height or summit ratio.")
    require(g["plan_facets"] >= 3 and g["total_main_floors"] >= 3 * g["wing_tier_floors"], "Invalid facets or wing height.")
    require(all(v >= 0 for values in p["program_per_human_sqft"].values() for v in values), "Program areas cannot be negative.")
    require(p["compute"]["ledger_active_racks"] in p["compute"]["active_rack_cases"], "Ledger rack fleet must appear in the sensitivity cases.")
    return p


def check_outputs(p):
    r = read(OUT / "study-results.json")
    for c in r["cases"]:
        require(math.isclose(c["private_home_m2"], p["requirements"]["humans"] * p["requirements"]["private_home_sqft_per_human"] * .09290304, rel_tol=1e-10), "Home area does not match the brief.")
        require(math.isclose(sum(c["program_usable_m2"].values()), c["usable_m2"], rel_tol=1e-10), "Program ledger does not reconcile.")
        require(math.isclose(c["post_macro_void_floor_slots_m2"] - c["local_district_void_floor_equivalent_m2"], c["gross_m2"], rel_tol=1e-10), "Empty volume was not reconciled with constructed area.")
    require(all(r["checks"].values()), "One or more generator checks failed.")
    require("complete spatial packing of 5000 districts" in r["not_checked"], "The unresolved district placement must remain explicit.")
    require((ROOT / "output/pdf/arcology-massing-study-01.pdf").read_bytes().startswith(b"%PDF-"), "Missing PDF output.")
    return r


def provenance_sources():
    return [ROOT / "pyproject.toml", ROOT / "uv.lock", ROOT / ".python-version", ROOT / "run.py",
            STUDY / "parameters.json", STUDY / "build_study.py"]


def outputs():
    return sorted([p for p in OUT.iterdir() if p.is_file() and p != MANIFEST] + [ROOT / "output/pdf/arcology-massing-study-01.pdf"])


def write_manifest(r):
    try:
        revision = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    except (FileNotFoundError, subprocess.CalledProcessError):
        revision = None
    manifest = {
        "format_version": 1,
        "hash_convention": "SHA-256; source/text result line endings normalized to LF; CAD DXF and binary files hashed as bytes.",
        "status": "Concept study; geometric verification only",
        "python": platform.python_version(),
        "platform": platform.system(),
        "repository_head_at_build": revision,
        "revision_note": "HEAD may precede local changes. Source hashes below identify the actual model inputs and generator.",
        "tool_versions": r["tool_versions"],
        "source_sha256": {p.relative_to(ROOT).as_posix(): digest(p) for p in provenance_sources()},
        "output_sha256": {p.relative_to(ROOT).as_posix(): digest(p) for p in outputs()},
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def verify_manifest():
    m = read(MANIFEST)
    for group in ("source_sha256", "output_sha256"):
        for name, expected in m[group].items():
            path = ROOT / name
            require(path.is_file() and digest(path) == expected, f"Stale or modified artifact: {name}. Rebuild the study.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["build", "validate", "check"])
    args = parser.parse_args()
    p = validate_inputs()
    if args.command == "build":
        require(sys.version_info[:2] == (3, 12), "Use the locked Python 3.12 environment.")
        env = dict(os.environ)
        env["MPLCONFIGDIR"] = str(ROOT / ".cache/matplotlib")
        subprocess.run([sys.executable, str(STUDY / "build_study.py")], cwd=ROOT, env=env, check=True)
        write_manifest(check_outputs(p))
        verify_manifest()
    elif args.command == "check":
        check_outputs(p)
        verify_manifest()
    print(f"Arcology engineering: {args.command} passed. Engineering feasibility remains unverified.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, FileNotFoundError) as exc:
        sys.exit(str(exc))
