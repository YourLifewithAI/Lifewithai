"""Repo-local CLI for real solver runs and analytical integration benchmarks."""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import importlib.metadata
import json
import math
import platform
import re
import shutil
import sqlite3
import subprocess
import sys
import uuid
from pathlib import Path

from models import validate, radiance_scene
from runtime import ROOT, LOCK, digest, environment, executable, install, platform_key
from thermal import thermal_box

TOOLS = ("freecad", "opensees", "radiance", "energyplus")


def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2, allow_nan=False) + "\n", encoding="utf-8")


def source_hashes():
    paths = [*ROOT.glob("*.py"), *ROOT.glob("*.toml"), LOCK, ROOT/"uv.lock", ROOT/".python-version",
             *ROOT.glob("workers/*.py"), *ROOT.glob("benchmarks/*.json")]
    return {p.relative_to(ROOT).as_posix(): digest(p, text=True) for p in sorted(paths)}


def content_hash(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, allow_nan=False).encode()).hexdigest()


def external_file_fields(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if (key == "file_name" or key.endswith(("_file_name", "_file_path"))) and child:
                yield key
            yield from external_file_fields(child)
    elif isinstance(value, list):
        for child in value:
            yield from external_file_fields(child)


def command(args, folder, name, env=None, stdin=None, binary_output=None, timeout=300):
    args = [str(a) for a in args]
    write_json(folder / f"{name}.command.json", {"argv": args, "timeout_seconds": timeout})
    with (folder / f"{name}.stderr.log").open("wb") as err, \
            (binary_output or folder / f"{name}.stdout.log").open("wb") as out:
        result = subprocess.run(args, cwd=folder, env=env, input=stdin,
                                stdout=out, stderr=err, timeout=timeout)
    if result.returncode != 0:
        raise RuntimeError(f"{name} failed ({result.returncode}); inspect {folder}")
    return (folder / f"{name}.stdout.log").read_text(errors="replace") if binary_output is None else ""


def solver_version(tool):
    if tool == "opensees":
        result = subprocess.run([sys.executable, "-c", "import openseespy.opensees as o; print(o.version())"],
                                capture_output=True, text=True, check=True, timeout=30)
        return result.stdout.strip()
    flag = "-version" if tool == "radiance" else "--version"
    result = subprocess.run([str(executable(tool)), flag], capture_output=True, text=True,
                            env=environment(tool), timeout=30, check=True)
    return (result.stdout + result.stderr).strip()


def radiance(job, folder):
    scene = folder / "scene.rad"
    scene.write_text(radiance_scene(job))
    env = environment("radiance")
    octree = folder / "scene.oct"
    command([executable("radiance", "oconv"), scene], folder, "oconv", env, binary_output=octree)
    sensors = "\n".join(" ".join(map(str, s["position"] + s["normal"])) for s in job["sensors"]) + "\n"
    (folder / "sensors.pts").write_text(sensors)
    raw = command([executable("radiance"), "-I+", "-h", "-ab", "2", "-ad", "4096", "-as", "0",
                   "-aa", "0", "-av", "0", "0", "0", "-lw", "1e-8", "-n", "1", octree],
                  folder, "rtrace", env, stdin=sensors.encode())
    values = [list(map(float, line.split())) for line in raw.splitlines() if line.strip()]
    if len(values) != len(job["sensors"]) or any(len(v) != 3 or not all(math.isfinite(x) for x in v) for v in values):
        raise RuntimeError("Radiance returned missing or non-finite sensor values")
    return {"solver_version": solver_version("radiance"), "sky_radiance_W_m2_sr": job["sky_radiance"],
            "sensors": [{"id": sensor["id"], "irradiance_rgb_W_m2": rgb,
                         "illuminance_lux": 179 * sum(a*b for a,b in zip(rgb, [0.265,0.670,0.065]))}
                        for sensor, rgb in zip(job["sensors"], values)],
            "assumptions": "Uniform hemispherical sky; no sun, ground glow, glazing or climate; diffuse opaque boxes; two ambient bounces"}


def energyplus(input_path, folder, weather=None, annual=False):
    model = json.loads(input_path.read_text())
    versions = [v.get("version_identifier") for v in model.get("Version", {}).values()]
    if versions != ["26.1"]:
        raise ValueError("EnergyPlus adapter requires a Version 26.1 epJSON model")
    # Restrict this first adapter to self-contained models. External schedules,
    # Python plugins and co-simulation would otherwise escape input provenance.
    external = [k for k in model if k.startswith(("ExternalInterface", "PythonPlugin")) or k in
                ("Schedule:File", "Schedule:File:Shading", "Construction:ComplexFenestrationState")]
    if external:
        raise ValueError(f"External-data/plugin objects are not supported yet: {external}")
    if fields := list(external_file_fields(model)):
        raise ValueError(f"External file references must be made self-contained first: {fields}")
    if annual and weather is None:
        raise ValueError("An annual run requires --weather path/to/site.epw")
    if not annual and not model.get("SizingPeriod:DesignDay"):
        raise ValueError("Design-day mode requires SizingPeriod:DesignDay in the input")
    exe = executable("energyplus")
    args = [exe, "--annual" if annual else "--design-day", "--output-directory", folder / "energyplus"]
    if weather:
        weather_copy = folder / "weather.epw"
        shutil.copyfile(weather, weather_copy)
        args += ["--weather", weather_copy]
    command([*args, input_path], folder, "energyplus", timeout=1800 if annual else 300)
    out = folder / "energyplus"
    errors = (out / "eplusout.err").read_text(errors="replace")
    severe = len(re.findall(r"\*\*\s*(?:Severe|Fatal)\s*\*\*", errors, re.I))
    if severe or "EnergyPlus Completed Successfully" not in (out / "eplusout.end").read_text():
        raise RuntimeError(f"EnergyPlus did not complete cleanly; inspect {out / 'eplusout.err'}")
    result = {"solver_version": solver_version("energyplus"), "severe_or_fatal_errors": severe,
              "warnings": len(re.findall(r"\*\*\s*Warning\s*\*\*", errors, re.I)),
              "mode": "annual" if annual else "design-day", "weather_sha256": digest(weather) if weather else None}
    sql = out / "eplusout.sql"
    if sql.exists():
        with sqlite3.connect(f"{sql.as_uri()}?mode=ro", uri=True) as db:
            rows = db.execute("""SELECT d.Name, d.KeyValue, d.Units, d.Type, COUNT(*), SUM(r.Value), MIN(r.Value), MAX(r.Value)
                FROM ReportData r JOIN ReportDataDictionary d USING (ReportDataDictionaryIndex)
                JOIN Time t USING (TimeIndex) WHERE COALESCE(t.WarmupFlag,0)=0 AND d.ReportingFrequency='Hourly'
                GROUP BY d.ReportDataDictionaryIndex""").fetchall()
        result["hourly_outputs"] = [{"name": r[0], "key": r[1], "units": r[2], "aggregation": r[3],
                                     "samples": r[4], "sum": r[5] if r[3] == "Sum" else None,
                                     "min": r[6], "max": r[7]} for r in rows]
    return result


def run_case(tool, input_path, weather=None, annual=False):
    input_path = Path(input_path).resolve()
    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    folder = ROOT / "runs" / f"{stamp}-{tool}-{uuid.uuid4().hex[:8]}"
    folder.mkdir(parents=True)
    copied = folder / ("input.epJSON" if tool == "energyplus" else "input.json")
    shutil.copyfile(input_path, copied)
    manifest = {"schema_version": 1, "tool": tool, "started_utc": stamp, "platform": platform_key(),
                "python_version": platform.python_version(), "sources_sha256_lf": source_hashes(),
                "input_sha256": digest(copied), "status": "running"}
    write_json(folder / "manifest.json", manifest)
    try:
        job = json.loads(copied.read_text())
        if tool != "energyplus":
            validate(tool, job)
        if tool == "freecad":
            env = environment(tool)
            env.update(ARCOLOGY_INPUT=str(copied), ARCOLOGY_OUTPUT=str(folder))
            command([executable(tool), ROOT / "workers/freecad_worker.py"], folder, "freecad", env)
            result = json.loads((folder / "result.json").read_text())
            if not result["native_valid"] or not result["step_valid"] or result["solids"] != 1:
                raise RuntimeError("CAD round-trip is invalid or not one solid")
        elif tool == "opensees":
            command([sys.executable, ROOT / "workers/opensees_worker.py", copied, folder / "result.json"],
                    folder, "opensees")
            result = json.loads((folder / "result.json").read_text())
        elif tool == "radiance":
            result = radiance(job, folder)
        else:
            result = energyplus(copied, folder, Path(weather).resolve() if weather else None, annual)
        write_json(folder / "result.json", result)
        manifest.update(status="completed", solver_version=result["solver_version"],
                        result_sha256=digest(folder / "result.json"), result_content_sha256=content_hash(result))
        if tool != "opensees":
            manifest["executable_sha256"] = digest(executable(tool))
            manifest["native_release"] = json.loads(LOCK.read_text())["tools"][tool]["version"]
        else:
            manifest["openseespy_package"] = importlib.metadata.version("openseespy")
        manifest["artifacts_sha256"] = {p.relative_to(folder).as_posix(): digest(p) for p in folder.rglob("*")
                                         if p.is_file() and p.name != "manifest.json"}
    except Exception as error:
        manifest.update(status="failed", error=str(error))
        raise
    finally:
        write_json(folder / "manifest.json", manifest)
        print(f"{tool}: {manifest['status']} - {folder.relative_to(ROOT)}", flush=True)
    return folder, result


def require_close(actual, expected, label, rel=1e-6, absolute=1e-8):
    if not math.isfinite(actual) or not math.isclose(actual, expected, rel_tol=rel, abs_tol=absolute):
        raise AssertionError(f"{label}: {actual} differs from expected {expected}")


def benchmark(tool):
    runs, checks = [], []

    def case(filename):
        folder, result = run_case(tool, ROOT / "benchmarks" / filename)
        runs.append({"input": filename, "result": result,
                     "manifest": json.loads((folder / "manifest.json").read_text())})
        return result

    if tool == "freecad":
        r = case("courtyard.json")
        expected = (12*12-6*6)*0.3
        for key in ("volume_m3", "native_reopened_volume_m3", "step_reopened_volume_m3"):
            require_close(r[key], expected, key)
        for a,b in zip(r["dimensions_m"], [12,12,0.3]):
            require_close(a, b, "bounding box")
        checks = ["32.4 m3 analytical volume", "12 x 12 x 0.3 m bounds", "native and STEP valid solid round-trips"]
    elif tool == "opensees":
        r = case("cantilever.json")
        require_close(r["displacements_m_m_rad"]["2"][1], -10000*6**3/(3*200e9*0.003125), "tip displacement")
        for actual, expected in zip(r["reactions_N_N_Nm"]["1"], [0,10000,60000]):
            require_close(actual, expected, "root reaction")
        for residual in r["equilibrium_residual_N_N_Nm"]:
            require_close(residual, 0, "global equilibrium", absolute=1e-6)
        checks = ["-0.001152 m analytical tip deflection", "10 kN shear and 60 kNm root moment", "global force/moment equilibrium"]
    elif tool == "radiance":
        opened, closed = case("sky-open.json"), case("sky-closed.json")
        require_close(opened["sensors"][0]["illuminance_lux"], 179*math.pi, "uniform sky illuminance", rel=0.01)
        require_close(closed["sensors"][0]["illuminance_lux"], 0, "closed black box", absolute=0.01)
        checks = ["Unobstructed horizontal illuminance = 179*pi lux within 1%", "closed opaque box below 0.01 lux"]
    else:
        generated = ROOT / "runs" / "benchmark-inputs"
        generated.mkdir(parents=True, exist_ok=True)
        for gain in (1000, 0):
            path = generated / f"adiabatic-{gain}W.epJSON"
            write_json(path, thermal_box(gain))
            folder, r = run_case(tool, path)
            runs.append({"input": f"thermal_box({gain}) generated by thermal.py", "result": r,
                         "manifest": json.loads((folder / "manifest.json").read_text())})
            outputs = {v["name"]: v for v in r["hourly_outputs"]}
            for name in ("Zone Lights Electricity Energy", "Zone Ideal Loads Zone Sensible Cooling Energy"):
                series = outputs[name]
                if series["samples"] != 24 or series["units"] != "J" or series["aggregation"] != "Sum":
                    raise AssertionError(f"Expected 24 hourly summed J samples for {name}")
                require_close(series["sum"], gain*86400, name, rel=0.01, absolute=100)
            if gain:
                temperatures = outputs["Zone Mean Air Temperature"]
                require_close(temperatures["min"], 24, "minimum temperature", absolute=0.05)
                require_close(temperatures["max"], 24, "maximum temperature", absolute=0.05)
        checks = ["1000 W x 24 h = 86.4 MJ lights and sensible cooling within 1%",
                  "zero-gain control below 100 J", "24 C maintained within 0.05 C", "zero severe/fatal errors"]
    return {"tool": tool, "status": "passed", "checks": checks, "runs": runs}


def check_report(report):
    if report.get("status") != "passed" or report.get("sources_sha256_lf") != source_hashes():
        raise RuntimeError("Report failed or is stale: rerun benchmarks using current source")
    if not report.get("benchmarks"):
        raise RuntimeError("No solver benchmarks in the report")
    for item in report["benchmarks"]:
        if item["status"] != "passed" or not item["runs"]:
            raise RuntimeError("A solver benchmark did not pass")
        for case in item["runs"]:
            manifest = case["manifest"]
            if (manifest["status"] != "completed" or manifest["sources_sha256_lf"] != source_hashes()
                    or manifest["result_content_sha256"] != content_hash(case["result"])):
                raise RuntimeError("Embedded result/provenance does not match the completed run")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("install", "doctor", "benchmark"):
        p = sub.add_parser(name)
        p.add_argument("tool", choices=["all", *TOOLS], default="all", nargs="?")
        if name == "benchmark":
            p.add_argument("--save", type=Path, help="Save a compact, reviewable benchmark evidence report")
    p = sub.add_parser("run")
    p.add_argument("tool", choices=TOOLS)
    p.add_argument("--input", required=True, type=Path)
    p.add_argument("--weather", type=Path)
    p.add_argument("--annual", action="store_true")
    p = sub.add_parser("check")
    p.add_argument("report", type=Path)
    args = parser.parse_args()
    if args.command == "check":
        report = json.loads(args.report.read_text())
        check_report(report)
        print("Saved benchmark source hashes match. This checks evidence freshness; it does not rerun solvers.")
        return
    if args.command == "run":
        if args.tool != "energyplus" and (args.weather or args.annual):
            parser.error("--weather and --annual apply only to EnergyPlus")
        run_case(args.tool, args.input, args.weather, args.annual)
        return
    selected = TOOLS if args.tool == "all" else (args.tool,)
    if args.command == "install":
        for tool in selected:
            if tool != "opensees":
                install(tool)
        print("OpenSeesPy is installed by uv sync/run using the simulation uv.lock.")
    elif args.command == "doctor":
        failed = False
        for tool in selected:
            try:
                print(f"{tool}: {solver_version(tool)}")
            except Exception as error:
                failed = True
                print(f"{tool}: UNAVAILABLE: {error}")
        if failed:
            raise SystemExit(1)
    else:
        report = {"schema_version": 1, "created_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
                  "platform": platform_key(), "sources_sha256_lf": source_hashes(),
                  "scope": "Integration benchmarks only; no Arcology structural/daylight/energy design validation",
                  "status": "running", "benchmarks": []}
        try:
            for tool in selected:
                print(f"Benchmarking {tool}...", flush=True)
                report["benchmarks"].append(benchmark(tool))
            report["status"] = "passed"
        except Exception as error:
            report.update(status="failed", error=str(error))
            raise
        finally:
            path = args.save or ROOT / "runs" / f"benchmarks-{uuid.uuid4().hex[:8]}.json"
            path.parent.mkdir(parents=True, exist_ok=True)
            write_json(path, report)
            print(f"Benchmark evidence: {path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
