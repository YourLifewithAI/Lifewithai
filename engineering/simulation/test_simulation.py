"""Input and provenance failure tests; actual solver benchmarks run separately."""
import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import models
import run
import runtime
from thermal import thermal_box


class Contracts(unittest.TestCase):
    def job(self, name):
        return json.loads((runtime.ROOT / "benchmarks" / name).read_text())

    def test_hole_cannot_consume_slab(self):
        job = self.job("courtyard.json")
        job["court_width"] = job["width"]
        with self.assertRaisesRegex(ValueError, "inside"):
            models.validate("freecad", job)

    def test_reject_unit_mismatch_and_nonfinite_dimensions(self):
        job = self.job("courtyard.json")
        job["units"] = "ft"
        with self.assertRaisesRegex(ValueError, "units"):
            models.validate("freecad", job)
        job["units"] = "m"
        job["thickness"] = float("nan")
        with self.assertRaisesRegex(ValueError, "finite"):
            models.validate("freecad", job)

    def test_zero_length_beam_and_unknown_load_node(self):
        job = self.job("cantilever.json")
        other = copy.deepcopy(job)
        other["nodes"]["2"] = other["nodes"]["1"]
        with self.assertRaisesRegex(ValueError, "nonzero"):
            models.validate("opensees", other)
        job["loads"] = {"99": [0, -10, 0]}
        with self.assertRaisesRegex(ValueError, "unknown node"):
            models.validate("opensees", job)

    def test_sensor_direction_and_geometry_are_validated(self):
        job = self.job("sky-open.json")
        job["sensors"][0]["normal"] = [0, 0, 0]
        with self.assertRaisesRegex(ValueError, "unit vectors"):
            models.radiance_scene(job)
        job = self.job("sky-closed.json")
        job["opaque_boxes"][0]["reflectance"] = float("nan")
        with self.assertRaisesRegex(ValueError, "reflectance"):
            models.radiance_scene(job)

    def test_scene_does_not_interpolate_sensor_ids_as_commands(self):
        job = self.job("sky-open.json")
        job["sensors"][0]["id"] = "\n!not-a-command\n"
        self.assertNotIn("!", models.radiance_scene(job))

    def test_extraction_cannot_escape_destination(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "escapes"):
                runtime.safe_member(Path(tmp), "../escape")

    def test_source_hashes_normalize_line_endings(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "source.py"
            p.write_bytes(b"x = 1\n")
            expected = runtime.digest(p, text=True)
            p.write_bytes(b"x = 1\r\n")
            self.assertEqual(runtime.digest(p, text=True), expected)
            p.write_bytes(b"x = 2\r\n")
            self.assertNotEqual(runtime.digest(p, text=True), expected)

    def test_solver_failure_is_recorded_and_cannot_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            with patch.object(run, "ROOT", Path(tmp)), patch.object(run, "source_hashes", return_value={}), \
                    patch.object(run, "command", side_effect=RuntimeError("intentional solver failure")):
                with self.assertRaisesRegex(RuntimeError, "solver failure"):
                    run.run_case("opensees", runtime.ROOT / "benchmarks/cantilever.json")
            manifest = json.loads(next(Path(tmp).glob("runs/*/manifest.json")).read_text())
            self.assertEqual(manifest["status"], "failed")
            self.assertNotIn("result_sha256", manifest)

    def test_thermal_negative_control_changes_gain_only(self):
        loaded, empty = thermal_box(1000), thermal_box(0)
        empty["Lights"]["Convective test source"]["lighting_level"] = 1000
        self.assertEqual(loaded, empty)
        with self.assertRaises(ValueError):
            thermal_box(-1)

    def test_annual_energy_requires_weather(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "case.epJSON"
            run.write_json(p, thermal_box())
            with self.assertRaisesRegex(ValueError, "requires --weather"):
                run.energyplus(p, Path(tmp), annual=True)

    def test_external_schedules_cannot_escape_provenance(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "case.epJSON"
            model = thermal_box()
            model["Schedule:File"] = {"untracked": {"file_name": "elsewhere.csv"}}
            run.write_json(p, model)
            with self.assertRaisesRegex(ValueError, "External-data"):
                run.energyplus(p, Path(tmp))

    def test_table_file_references_cannot_escape_provenance(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "case.epJSON"
            model = thermal_box()
            model["Table:IndependentVariable"] = {"untracked": {"external_file_name": "elsewhere.csv"}}
            run.write_json(p, model)
            with self.assertRaisesRegex(ValueError, "External file"):
                run.energyplus(p, Path(tmp))

    def test_stale_report_and_modified_result_are_rejected(self):
        sources = run.source_hashes()
        result = {"value": 1}
        report = {"status": "passed", "sources_sha256_lf": sources, "benchmarks": [
            {"status": "passed", "runs": [{"result": result, "manifest": {"status": "completed",
             "sources_sha256_lf": sources, "result_content_sha256": run.content_hash(result)}}]}]}
        run.check_report(report)
        result["value"] = 2
        with self.assertRaisesRegex(RuntimeError, "does not match"):
            run.check_report(report)
        result["value"] = 1
        report["sources_sha256_lf"] = {}
        with self.assertRaisesRegex(RuntimeError, "stale"):
            run.check_report(report)


if __name__ == "__main__":
    unittest.main()
