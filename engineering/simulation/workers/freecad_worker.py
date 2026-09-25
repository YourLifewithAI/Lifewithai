"""Executed by FreeCADCmd's Python, not the simulation virtual environment."""
import json
import os
import sys
import traceback
from pathlib import Path

import FreeCAD as App
import Part


def run():
    job = json.loads(Path(os.environ["ARCOLOGY_INPUT"]).read_text())
    output = Path(os.environ["ARCOLOGY_OUTPUT"])
    # FreeCAD lengths are mm; the adapter contract and results use metres.
    scale = 1000.0
    doc = App.newDocument("CourtyardSlab")
    outer = doc.addObject("Part::Box", "SlabBlank")
    outer.Length, outer.Width, outer.Height = [job[k] * scale for k in ("width", "depth", "thickness")]
    opening = doc.addObject("Part::Box", "CourtyardVoid")
    opening.Length, opening.Width = job["court_width"] * scale, job["court_depth"] * scale
    opening.Height = outer.Height.Value + 2.0
    opening.Placement.Base = App.Vector((outer.Length.Value-opening.Length.Value)/2,
                                      (outer.Width.Value-opening.Width.Value)/2, -1)
    slab = doc.addObject("Part::Cut", "CourtyardSlab")
    slab.Base, slab.Tool = outer, opening
    doc.recompute()
    if not slab.Shape.isValid():
        raise RuntimeError("FreeCAD generated invalid geometry")
    volume = slab.Shape.Volume / scale**3
    dimensions = [slab.Shape.BoundBox.XLength/scale, slab.Shape.BoundBox.YLength/scale,
                  slab.Shape.BoundBox.ZLength/scale]
    native, step = output / "courtyard.FCStd", output / "courtyard.step"
    doc.saveAs(str(native))
    Part.export([slab], str(step))
    App.closeDocument(doc.Name)
    reopened = App.openDocument(str(native))
    native_shape = reopened.getObject("CourtyardSlab").Shape
    exchange = Part.read(str(step))
    result = {"solver_version": ".".join(App.Version()[:3]), "cad_units": "mm",
              "result_units": "m,m3", "volume_m3": volume, "dimensions_m": dimensions,
              "native_reopened_volume_m3": native_shape.Volume/scale**3,
              "step_reopened_volume_m3": exchange.Volume/scale**3,
              "native_valid": native_shape.isValid(), "step_valid": exchange.isValid(),
              "solids": len(exchange.Solids),
              "assumptions": "Single centered through-court in a uniform slab; geometry only, no reinforcement or load capacity"}
    App.closeDocument(reopened.Name)
    (output / "result.json").write_text(json.dumps(result, indent=2, allow_nan=False) + "\n")


try:
    run()
except Exception:
    # Some FreeCADCmd versions return zero after a Python exception. Parent also
    # requires a newly-created result.json and valid round-trip solids.
    traceback.print_exc()
    sys.exit(1)
