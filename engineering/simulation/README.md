# Arcology simulation tools

This is the repo-local integration layer for **FreeCAD 1.1.3, OpenSeesPy 3.8.0.0 / OpenSees 3.8.0, Radiance 6.0.2, and EnergyPlus 26.1.0**. Each adapter runs the actual solver, preserves its input and diagnostics, and has a small analytical benchmark. It is separate from the massing environment so a solver upgrade does not silently change an existing massing study.

The initial four-tool benchmark suite has been executed on Windows x86-64. These checks validate the adapters against simple known answers; they do not establish the Arcology's feasibility. See [saved benchmark evidence](benchmarks/results/windows-x86_64.json) and the [next structural-section study brief](section-study-brief.md).

## Set up another computer

Install Git and the free [uv](https://docs.astral.sh/uv/getting-started/installation/) manager. Clone/pull the repository, then run from its root:

```bash
uv sync --project engineering/simulation --locked
uv run --project engineering/simulation --locked python engineering/simulation/run.py install
uv run --project engineering/simulation --locked python engineering/simulation/run.py doctor
uv run --project engineering/simulation --locked python engineering/simulation/run.py benchmark
```

Python 3.12.12 and OpenSeesPy are resolved by this directory's `uv.lock`. Native installers come from official GitHub releases, with platform, release version, archive size and SHA-256 recorded in [native-tools.lock.json](native-tools.lock.json). Downloads are verified **before** extraction. Windows FreeCAD needs the pinned, portable 7zr extractor because its archive uses BCJ2 compression. FreeCAD runs with its own bundled Python; it is not imported into the simulation virtual environment.

No system-wide solver installation, paid connector, API key, proprietary CAD license or cloud service is needed. The first Windows download is about 694 MB, plus Python/OpenSees. Allow several GB of local disk for extracted tools and caches. Setup can take several minutes. After installation, the examples and benchmarks run offline.

Git carries code, parameters, dependency locks, documentation and selected benchmark evidence. `.tools/`, `.cache/`, `.venv/` and `runs/` are ignored and recreated locally. An installed-runtime receipt records the verified archive; `doctor` actually executes version discovery. A missing or unusable tool fails visibly. Binaries are not copied into Git, and uncommitted study edits do not travel to another computer automatically.

| Platform | Status and requirements |
|---|---|
| Windows x86-64 | All four tools executed locally; portable setup, no administrator installation. |
| Ubuntu 24.04 x86-64 | Pinned releases and installer implemented; GitHub Actions exercises setup and all benchmarks. Linux needs the GUI shared libraries listed in the workflow even for headless FreeCAD. Check the workflow result for execution evidence. |
| macOS 13+ Apple Silicon | Pinned releases and read-only DMG extraction implemented, but not executed here. OpenSeesPy's locked macOS wheel is arm64. Normal macOS application security requirements still apply. |
| Intel macOS / Linux ARM / Windows ARM | Not supported by the complete locked suite. Some individual native releases are listed, but OpenSeesPy/platform availability is incomplete. Do not assume a successful install from asset availability alone. |

The [CI workflow](../../.github/workflows/engineering-simulation.yml) runs on changes to this package and can also be triggered manually. It uses standard Windows/Ubuntu GitHub-hosted runners and saves seven-day diagnostic artifacts. The repository is public; no paid runner or hosted solver is configured.

## Commands and reusable inputs

```bash
# A single tool or benchmark
uv run --project engineering/simulation --locked python engineering/simulation/run.py install freecad
uv run --project engineering/simulation --locked python engineering/simulation/run.py benchmark radiance

# Your own supported inputs; start by copying the benchmark input
uv run --project engineering/simulation --locked python engineering/simulation/run.py run freecad --input engineering/simulation/benchmarks/courtyard.json
uv run --project engineering/simulation --locked python engineering/simulation/run.py run opensees --input engineering/simulation/benchmarks/cantilever.json
uv run --project engineering/simulation --locked python engineering/simulation/run.py run radiance --input engineering/simulation/benchmarks/sky-closed.json

# A self-contained EnergyPlus 26.1 model: design-day is the default
uv run --project engineering/simulation --locked python engineering/simulation/run.py run energyplus --input path/to/model.epJSON
# Annual mode requires a site/weather file and an appropriate annual model
uv run --project engineering/simulation --locked python engineering/simulation/run.py run energyplus --input path/to/model.epJSON --annual --weather path/to/site.epw

# Save evidence explicitly when preparing a reviewed change
uv run --project engineering/simulation --locked python engineering/simulation/run.py benchmark --save engineering/simulation/benchmarks/results/windows-x86_64.json
python engineering/simulation/run.py check engineering/simulation/benchmarks/results/windows-x86_64.json
python -m unittest discover -s engineering/simulation -p test_simulation.py -v
```

Each run gets a unique directory under `runs/`, with the exact input, solver stdout/stderr, commands, result JSON, artifacts and manifest. The manifest records actual solver/Python/platform versions, normalized source hashes, original input/output byte hashes, and native executable hash or locked OpenSeesPy package version. Failed solver calls also leave a failed manifest; they cannot be mistaken for completed benchmarks. `check` verifies saved evidence freshness and embedded result hashes without executing the solvers; rerun `benchmark` to test another computer. Normal Git LF/CRLF conversion is ignored for source hashes.

### FreeCAD: parametric construction geometry

[courtyard.json](benchmarks/courtyard.json) defines a slab and a centered, through-opening in **metres**. The worker explicitly converts to FreeCAD's native millimetres. It saves `courtyard.FCStd` with editable `Part::Box` and `Part::Cut` history, exports `courtyard.step`, and reopens both. Results include bounds, volume, shape validity and solid count. No mesh approximation is used to calculate the solid volume.

The current adapter supports this slab family only. Extend its input contract and benchmark before introducing beams, cores, joints or multiple districts. Geometric validity is not a reinforcement, strength or construction-sequence check.

### OpenSees: structural response

[cantilever.json](benchmarks/cantilever.json) is a **2D, linear elastic, small-displacement frame**. Coordinates use metres; loads use N and Nm; modulus uses Pa; section area uses m2; second moment uses m4. In this adapter, X is horizontal and Y vertical. Each node has X translation, Y translation and rotation. Supports specify three 0/1 restraints; elements reference node IDs. The worker returns nodal displacements, support reactions and a global force/moment residual.

Only static nodal loads are applied. Self-weight must be calculated and supplied deliberately. The present model excludes shear deformation, torsion, P-delta effects, member instability, nonlinear material behavior, foundations, wind dynamics, earthquakes and strength checks. Its benchmark is a supported analytical problem, not an Arcology member proposal. A real support model needs agreed material laws, spans, load combinations and boundary conditions.

### Radiance: daylight visibility and obstruction

[sky-open.json](benchmarks/sky-open.json) and [sky-closed.json](benchmarks/sky-closed.json) use metres and a uniform hemispherical sky radiance in W/m2/sr, with Z up. Each sensor has an ID, position and unit normal. Opaque boxes have position, dimensions and diffuse reflectance. The adapter generates `.rad` geometry and a binary octree, executes `rtrace`, and records RGB irradiance and photopic illuminance using `179 * (0.265 R + 0.670 G + 0.065 B)`.

This first input contract supports uniform skies and opaque boxes. It is useful for obstruction experiments, but contains no annual climate, direct sun, glazing or daylight-compliance thresholds. Two ambient bounces and 4,096 ambient divisions are explicit initial settings; complex reflective courts will require convergence studies and an expanded model. Sensor IDs are metadata and are never interpolated as Radiance commands.

### EnergyPlus: thermal loads and building systems

The adapter runs a **self-contained 26.1 epJSON** model in design-day or annual mode. The benchmark generator is [thermal.py](thermal.py); its generated input is saved with each run. Annual runs require an explicit EPW file, which is copied and hashed. The solver checks the native model schema; the runner requires successful completion and zero severe/fatal errors, and preserves warnings. If SQLite reporting is requested, hourly outputs retain their keys, units and aggregation type; average quantities are not incorrectly summed into energy totals.

External schedule files, Python plugins, co-simulation and external file references are currently rejected so unrecorded dependencies cannot silently enter a result. Annual mode is available but is not validated by the synthetic design-day benchmark. A site, envelope, glazing, occupancy, ventilation, equipment and HVAC choices are still needed for district energy studies. Ideal-load thermal demand is distinct from equipment electricity and upstream generation.

## Benchmarks and acceptance criteria

| Tool | Geometry, loads and boundaries | Independently expected result | Acceptance |
|---|---|---|---|
| FreeCAD | 12 x 12 x 0.3 m slab; 6 x 6 m through-court | `(144 - 36) * 0.3 = 32.4 m3` | Volume and dimensions within 1e-6 relative; native and STEP reopen as one valid solid |
| OpenSees | 6 m cantilever, fixed root, downward 10 kN tip load; E=200 GPa, A=0.15 m2, I=0.003125 m4 | `PL^3/(3EI) = 0.001152 m` downward; 10 kN shear and 60 kNm moment at root | 1e-6 relative; force/moment residual below 1e-6 in N/Nm |
| Radiance | Uniform upper-hemisphere radiance 1; horizontal sensor, with and without closed black enclosure | Open sky: `179*pi = 562.345 lux`; enclosed: zero | Open sky within 1%; enclosure below 0.01 lux |
| EnergyPlus | 4 x 3 x 3 m adiabatic zone, all-convective 1,000 W source, 24 C cooling setpoint, ideal unlimited cooling, no outdoor air, one day after warmup; repeated at zero gain | `1,000 * 86,400 = 86.4 MJ` of source heat and sensible cooling; zero-load control near zero | 24 hourly samples; energy within 1%, zero control below 100 J, temperature within 0.05 C; zero severe/fatal errors |

The EnergyPlus benchmark intentionally uses a massless envelope and a synthetic equatorial sea-level location. Version 26.1 emits two warnings for these choices, preserved in the results. These boundaries isolate the analytical heat balance; they are not a site or construction specification. The test is not an ASHRAE 140 suite or a validation of a realistic envelope/HVAC system.

## Sources, licenses and maintenance

- [FreeCAD release](https://github.com/FreeCAD/FreeCAD/releases/tag/1.1.3) and [source/license](https://github.com/FreeCAD/FreeCAD): LGPL; bundled dependencies retain their own licenses.
- [OpenSeesPy package](https://pypi.org/project/openseespy/3.8.0.0/) and [elasticBeamColumn documentation](https://openseespydoc.readthedocs.io/en/latest/src/elasticBeamColumn.html). Its installed `LICENSE.md` permits research, education and internal use; commercial redistribution has separate licensing terms. This repo installs the upstream wheel for local research and does not redistribute that runtime.
- [Radiance release](https://github.com/LBNL-ETA/Radiance/releases/tag/rad6R0P2) and [manuals](https://www.radiance-online.org/learning/documentation/manual-pages): retain upstream copyright and license notices in the extracted distribution.
- [EnergyPlus release](https://github.com/NatLabRockies/EnergyPlus/releases/tag/v26.1.0), [source/license](https://github.com/NatLabRockies/EnergyPlus) and its bundled `Energy+.schema.epJSON` define the native input contract.
- [7-Zip release](https://github.com/ip7z/7zip/releases/tag/26.03): portable 7zr is used only to extract the official Windows FreeCAD archive; upstream notices stay with the downloaded package.

Upgrade pins deliberately, regenerate `uv.lock` where relevant, rerun tests and benchmarks, and review numerical/output differences. Do not replace the committed success report with a failed or partial run. Keep large runs local; publish only reviewed inputs, selected outputs and their provenance. The existing massing brief and its 100-million-human housing requirements remain authoritative.
