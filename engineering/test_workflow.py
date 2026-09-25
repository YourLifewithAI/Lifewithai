"""Regression checks for stale outputs and unsupported parameter edits."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("workflow", Path(__file__).with_name("run.py"))
workflow = importlib.util.module_from_spec(spec)
spec.loader.exec_module(workflow)


class WorkflowTests(unittest.TestCase):
    def test_saved_study_is_current(self):
        workflow.check_outputs(workflow.validate_inputs())
        workflow.verify_manifest()

    def test_changed_input_invalidates_saved_results(self):
        # Build a tiny independent fixture; never mutate the real study.
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "parameters.json"
            source.write_text('{"humans": 100000000}', encoding="utf-8")
            manifest = root / "provenance.json"
            manifest.write_text(json.dumps({"source_sha256": {"parameters.json": workflow.digest(source)}, "output_sha256": {}}), encoding="utf-8")
            with patch.object(workflow, "ROOT", root), patch.object(workflow, "MANIFEST", manifest):
                workflow.verify_manifest()
                source.write_text('{"humans": 200000000}', encoding="utf-8")
                with self.assertRaisesRegex(ValueError, "Stale or modified artifact"):
                    workflow.verify_manifest()

    def test_unsupported_block_topology_fails_before_render(self):
        inputs = workflow.read(workflow.STUDY / "parameters.json")
        inputs["district"]["residential_blocks"] = 25
        with patch.object(workflow, "read", return_value=inputs):
            with self.assertRaisesRegex(ValueError, "16 blocks"):
                workflow.validate_inputs()

    def test_text_hash_survives_git_line_ending_conversion(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "parameters.json"
            source.write_bytes(b'{\n  "humans": 100000000\n}\n')
            expected = workflow.digest(source)
            source.write_bytes(b'{\r\n  "humans": 100000000\r\n}\r\n')
            self.assertEqual(workflow.digest(source), expected)

    def test_private_home_minimum_cannot_silently_shrink(self):
        inputs = workflow.read(workflow.STUDY / "parameters.json")
        inputs["requirements"]["private_home_sqft_per_human"] = 500
        with patch.object(workflow, "read", return_value=inputs):
            with self.assertRaisesRegex(ValueError, "750 sqft/person"):
                workflow.validate_inputs()


if __name__ == "__main__":
    unittest.main()
