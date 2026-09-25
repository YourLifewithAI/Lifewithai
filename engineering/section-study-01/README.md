# Four-district section study 01

Three placements of the same housing-led district program: aligned, stepped by one block pitch, and separated by an additional 140 m slot. This is a 243 m tall two-tier concept section, not a complete Arcology structural module or a construction-ready design.

Start with the [generated findings](output/report.md), [comparison](output/comparison.png), [coordinated sections](output/sections.png), and [offline interactive model](output/viewer.html). The model menu selects an arrangement; the legend hides upper buildings to reveal lower courts. Numerical evidence is in [results.json](output/results.json) and [comparison.csv](output/comparison.csv).

The private housing requirement stays fixed at **60 million sqft for 80,000 humans**, with 80,000 paired AI plus other unquantified AI. All cases keep the same 64 courtyard blocks, 24 housing floors and three civic/service floors. This study carries the housing-led prototype forward and quantifies the additional shared-city housing-area demand separately. The citywide 100-million-human brief and universally public summit remain unchanged.

## What was modeled

- **Geometry:** actual courtyard floor footprints, upper/lower placement, service decks, support/core reservations, two plant-room reservations per district, and stable IDs shared by the ledgers, drawings and solver inputs. Overlap, court openings, reservation fit and sensor locations are checked. Support envelopes occupy part of the inherited 30% gross allowance; usable housing is not counted twice or quietly reduced.
- **Daylight:** real Radiance calculations at 1,600 matched sensors per case, repeated at 4,096 and 16,384 ambient divisions. Black obstructions and a uniform sky isolate cosine-weighted sky access. Horizontal court probes and vertical facade probes have separate unobstructed baselines. These are exterior geometric measures, not interior daylight, direct sunlight, climate, or ventilation results.
- **Structure:** OpenSees checks independent ground-reaching axial lines against `sum(P*z)/(EA)`. A separate simply supported bridge diagnostic agrees with the uniform-load beam formula. Eight illustrative hollow support/core envelopes per block, E=30 GPa and a lumped 12 kPa floor load are assumptions. No lateral, buckling, strength, foundation, fire, overburden or construction-sequence validation is claimed. The 8/12/16 kPa sensitivity uses linear scaling of the verified linear model.
- **Utilities:** separate A/B route graphs, local interfaces and explicit section supply boundaries. Single-edge and interface-loss tests establish graph reachability only. Source independence, spare capacity, autonomy, hydraulics, electrical protection, sewage and district heat rejection remain unresolved.
- **CAD:** native editable FreeCAD slab prototypes and placed links for 27 occupied levels plus the roof; hollow support/core envelopes and service decks. Each case is saved as FCStd and STEP, reopened, and checked for analytic component-volume sum, solid count, placement bounds and shape validity. Intentional component intersections remain, so summed CAD volumes are not a material takeoff.

The [generated report](output/report.md) explains why stepping is the more useful starting hypothesis but the deep stacked courts still need redesign. No district energy ranking is asserted: EnergyPlus is available, but weather, glazing, envelope, schedules, HVAC and AI workloads have not been selected.

## Reproduce and inspect

From the repository root, after [installing the simulation tools](../simulation/README.md):

```bash
uv sync --project engineering/simulation --locked
uv run --project engineering --locked python engineering/section-study-01/build.py build
uv run --project engineering --locked python engineering/section-study-01/build.py check
uv run --project engineering --locked python -m unittest discover -s engineering/section-study-01 -p test_study.py -v
```

`build` executes the real solvers and regenerates graphics, tables, CAD and provenance. `build --reuse-solvers` reuses a run only when its complete model/parameter content and solver/worker source signature match; it still rechecks geometry and rebuilds the report. This is useful for refining review graphics without repeating identical solver calls. `render` writes review files from existing records but does not refresh provenance; finish with a full build or a verified reuse build. `check` verifies saved source and artifact hashes, not physical feasibility.

The current placements completed full solver/CAD builds on local Windows and on clean Windows and Ubuntu runners; [the first full section-study CI run](https://github.com/YourLifewithAI/Lifewithai/actions/runs/36173485476) records both successful builds. Python/geometry dependencies use `engineering/uv.lock`; structural/native execution uses `engineering/simulation/uv.lock` and its official-release checksums. The CLI bridges those environments rather than requiring a global CAD Python installation. macOS execution remains unverified.

## Inputs, outputs and boundaries

[parameters.json](parameters.json) records study assumptions. The authoritative human/population/housing brief and inherited district program are read from [massing parameters](../massing-study-01/parameters.json), not copied into an independent editable brief. Unsupported prototype/topology changes and placements outside the coordinated drawing bounds fail explicitly; update geometry, drawings and checks together when extending the study.

Each case's `model.json` is the shared geometric/ID model. `daylight-input.json`, `bridge-input.json` and `solver-results.json` preserve the compact inputs and actual solver results/provenance. The larger generated axial job and duplicate CAD input remain local and can be regenerated from the shared model. Native files are in `output/<case>/cad/<case>.FCStd`; STEP files are generated alongside them and ignored by Git. Logs, archives, environments and backups also stay local. Selected native CAD, source, numerical evidence and review graphics travel with the repository.

The service drawings include two shared street spines and branches to local plant rooms; they do not yet distribute every service to every floor or apartment. Pressure-zone counts are planning arithmetic. All route lengths include vertical and horizontal segments and are counted as shared corridor centerlines, not multiplied into an invented pipe/cable bill of quantities. Cooling supply and return are distinct required paths. Service decks add floor area outside the fixed residential/civic program and are reported separately after unioning overlaps.

Courts continue through both tiers where blocks align. The center-of-court probes at housing-entry elevation are virtual measurement positions, not suspended platforms across those courts. Lower roof footprint exposed by stepping is an opportunity for public space; access, capacity, landscape loads, safety and wind comfort still require design.

The massing study's citywide facility share remains outside these four cells. A successful local placement is not evidence that all 5,000 districts fit inside the current whole-city envelope. Materials, construction logistics and EnergyPlus district models should follow a revised inhabited section and an explicit structural/environmental brief.
