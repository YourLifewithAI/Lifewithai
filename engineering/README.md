# Arcology engineering workspace

This directory makes the Arcology studies portable with the repository. It holds the model inputs, generator, research review, selected outputs and dependency lock. A new computer can recreate the calculation environment and rebuild the drawings from the same sources.

The current implementation produces **concept geometry and resource sensitivities**, with a separate [simulation workspace](simulation/README.md) that integrates FreeCAD, OpenSees, Radiance and EnergyPlus. The solvers have small analytical integration benchmarks; Arcology structural, daylight, thermal and wind performance has not yet been established.

## Start here

- [Open on another computer](OPEN-ON-ANOTHER-COMPUTER.md): download the correct branch and explore the saved viewer without installing the simulation tools.
- [Massing study 01](massing-study-01/README.md): results, assumptions, district section, area/dependency schedule and next design gate.
- [Construction and sections](arcology-construction-and-sections.md): confirmed requirements and proposed construction approach.
- [Research evaluation](arcology-research-evaluation.md): review of the existing research and its numerical inconsistencies.
- [Illustrated report](output/pdf/arcology-massing-study-01.pdf).
- [Interactive model](massing-study-01/output/massing-viewer.html): open the file in a browser, choose A/B, and rotate. It is self-contained.
- [Parameters](massing-study-01/parameters.json) and [generated results](massing-study-01/output/study-results.json).
- [Simulation setup and benchmarks](simulation/README.md) and [next structural-section study](simulation/section-study-brief.md).
- [Four-district section comparison](section-study-01/README.md): aligned, stepped and separated placements with matched housing, actual sky-access calculations, support screens, service graphs and editable CAD.

## One command on each computer

Install the free [uv Python environment manager](https://docs.astral.sh/uv/getting-started/installation/) once. From the repository root, run:

```bash
uv run --project engineering --locked python engineering/run.py build
```

uv uses `.python-version` and `uv.lock` to select Python and install the same resolved library versions in `engineering/.venv`. The first setup requires network access; cached libraries and Python can subsequently be used offline. Git clone/pull carries the inputs and selected outputs between machines. Local uncommitted files are not shared automatically.

The command validates the supported input layout, regenerates the diagrams, GLB meshes, DXF plans, offline viewer, numerical results and PDF, checks their consistency, and writes a provenance manifest. It has no website deployment step and needs no paid API or hosted service.

Two lightweight commands need only an existing Python interpreter and the checked-out files:

```bash
python engineering/run.py validate
python engineering/run.py check
python -m unittest discover -s engineering -p "test_*.py"
```

`validate` rejects unsupported input combinations. `check` verifies the numerical accounting and the saved source/output hashes, flagging stale results after an input or generator change. The regression tests exercise stale-input detection and prevent unsupported topology edits or an accidental reduction of the housing minimum. The JSON provenance records the actual Python/platform, tool versions and hashes. A repository HEAD recorded during a build may precede local changes; source hashes identify the actual calculation.

The initial locked build is tested on Windows. The source and lock are intended for Windows, macOS and Linux; the other platforms still require an execution check. Provenance hashes normalize text line endings to LF so ordinary Git checkout conversion does not invalidate the saved study; DXF and binary outputs retain byte hashes. Numerical consistency should be compared with tolerances; different renderers/platforms can produce different bytes or text rendering even with matching model results.

## What lives in Git

| Keep with the repository | Recreate locally |
|---|---|
| Confirmed brief, scenario inputs and unit conventions | Python runtime and installed libraries |
| Geometry/calculation code and dependency lock | Virtual environment and caches |
| Research references and source provenance | Temporary rendering and solver scratch files |
| Selected review drawings, CAD exports, result JSON and report | Large optional solver runs derived from saved inputs |
| Benchmark/validation instructions and limitations | GUI application installations |

This keeps the tools available through a documented, versioned setup. Full CAD executables contain platform-specific binaries and belong in the installation process. An offline distribution can later bundle official installers or wheels with checksums and licenses if disconnected operation becomes a requirement. The current setup promises reproducible source and dependencies, not permanent offline availability of every third-party download.

## Tool choices

| Layer | Existing free software | Current status and role |
|---|---|---|
| Geometry and accounting | [Shapely](https://shapely.readthedocs.io/en/stable/manual.html), NumPy | Included and used for polygon unions, void deductions, dimensions and schedules |
| Meshes and CAD exchange | [trimesh](https://trimesh.org/), [ezdxf](https://ezdxf.readthedocs.io/en/stable/) | Included and used for GLB solids and editable DXF plans |
| Review outputs | Matplotlib, Plotly, ReportLab | Included and used for diagrams, offline 3D review and PDF |
| Detailed parametric CAD | [FreeCAD](https://github.com/FreeCAD/FreeCAD) | Integrated: parametric courtyard slab, native FCStd and STEP, solid-volume and reopen checks |
| Structural response | [OpenSees](https://opensees.berkeley.edu/) | Integrated: linear 2D frame inputs, reactions/deflections, analytical cantilever benchmark |
| Daylight | [Radiance](https://www.radiance-online.org/) | Integrated: uniform-sky sensor/obstruction models, open/closed sky benchmark |
| Building energy | [EnergyPlus](https://github.com/NatLabRockies/EnergyPlus) | Integrated: self-contained epJSON runs, weather-file handling, analytical thermal-load benchmark |

The simulation tools use their own locked environment and checksum-pinned native releases. See the simulation README for setup commands, platform execution status, units, benchmarks and current adapter limits. Native runtimes and large outputs stay outside Git; the setup code, model inputs and selected evidence travel with the repository. The workflow runs locally without a paid connector or hosted solver.

## Extending the workspace

Use a separate study or adapter per analysis, while sharing confirmed requirements. For each solver, save:

1. Inputs with units, status, source and date: distinguish author requirements, measured/site data, literature values and illustrative assumptions.
2. Geometry and mappings: which rooms, surfaces, supports or districts an input applies to, including coordinate conventions.
3. Model assumptions and boundary conditions: spans/supports/loads for structure; weather and schedules for energy; sky/materials/sensors for daylight.
4. A pinned solver version and reproducible command, with a benchmark that has an independently known answer.
5. Results linked to source hashes, a short interpretation, and explicit unresolved questions.

The next useful model is an inhabited structural section with multiple adjacent and vertically related districts. It should place actual open-sky courts and continuous supports before a solver is asked to size members. For CAD, preserve native parametric sources plus exchange formats; a GLB visual mesh alone does not retain a design's constraints or component semantics.

The repository already has a read-only knowledge MCP server under `mcp/`. Later, a small adapter could expose approved model parameters, results and artifact locations through that server. Model calculations should remain available through the local CLI so their portability does not depend on a particular assistant connector or hosted account. The existing MCP server and website have not been changed by this initial integration.

## Model boundaries

The first study uses 100 million humans, 100 million paired AI plus additional AI, at least 750 sqft of private homes per human, and a universally public summit. The main tier count remains a study variable. Its detailed district drawing currently supports the documented four-by-four block topology; the input checker rejects unsupported topology changes that would leave fixed drawing coordinates inconsistent.

The massing envelope includes an arithmetic reserve for district empty volume; it does not spatially arrange all 5,000 districts. None of the exported solids is a concrete quantity model. Geometry checks, mesh closure and successful CAD re-import do not validate structural safety, daylight, evacuation, thermal behavior, AI service capacity or regional resource supply.

## Maintenance

Use `--locked` for ordinary builds. Update `pyproject.toml` and regenerate `uv.lock` deliberately when upgrading tools, then rebuild and review the output differences. `massing-study-01/requirements-resolved.txt` is informational; `uv.lock` is the installation authority for this workspace and includes transitive dependencies.

Selected generated files are kept with the study so another computer can inspect them immediately. Rebuild after source changes, review the result, then commit inputs and outputs together. The package does not publish research or rewrite the older knowledge entries automatically; those revisions need to be reconciled with the chosen design.
