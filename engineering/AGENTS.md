# Engineering workspace

Read `README.md`, the relevant study README, and its input file before changing a model. The author-confirmed population, minimum private housing area and public-summit purpose are recorded in `massing-study-01/parameters.json`. Keep requirements distinct from study assumptions and unresolved engineering questions.

Use `uv run --project engineering --locked python engineering/run.py build` from the repository root. This validates supported inputs, rebuilds the study, checks the results and records provenance. `python engineering/run.py check` verifies checked-in results and source/output hashes without installing third-party libraries.

Change source parameters or code, then regenerate; do not hand-edit generated quantities, DXFs or model meshes. Update the study narrative when assumptions or results change. Review rendered drawings when their layout changes.

Keep tools and models under this directory. The website publishes separately; a new engineering result is not automatically approved narrative canon. Do not count overlapping floor area, unbuilt volume, cooling electricity or district/citywide services twice.

Tests of geometric consistency are not evidence of structural safety or code compliance. When adding a solver, include units, boundary conditions, load cases, a benchmark, version information and a clear statement of what was actually checked. Label illustrative scenarios accordingly.

Never commit virtual environments, dependency caches or credentials. Use the locked toolchain rather than machine-specific interpreter paths or a globally installed CAD application. Large solver outputs can be regenerated; preserve the inputs, selected review outputs and their provenance.
