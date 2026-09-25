# Open the Arcology study on another computer

The four-district study, interactive viewer, drawings, results and editable FreeCAD files are saved in the repository. The current work is on **`codex/arcology-modeling-workspace`**, reviewed in [PR #4](https://github.com/YourLifewithAI/Lifewithai/pull/4). Use this branch while the PR remains unmerged.

## Explore without installing anything

1. [Download the study branch as a ZIP](https://github.com/YourLifewithAI/Lifewithai/archive/refs/heads/codex/arcology-modeling-workspace.zip) and extract it, or clone the branch using the command below.
2. Inside the extracted repository, open `engineering/section-study-01/output/viewer.html` in a desktop browser with WebGL enabled.
3. Select **Aligned**, **Stepped** or **Separated**. Drag to rotate, scroll to zoom, and click legend entries to hide upper housing/civic volumes and reveal the lower courts.

The viewer includes its JavaScript and model data. Reviewing it needs no Python, CAD installation, local server or internet connection after downloading. The `127.0.0.1:8766` address from the original review only belongs to that computer; open the saved HTML file on the new machine instead.

For Git users, a fresh checkout is:

```bash
git clone --branch codex/arcology-modeling-workspace --single-branch https://github.com/YourLifewithAI/Lifewithai.git
cd Lifewithai
```

If already cloned, fetch the repository, switch to `codex/arcology-modeling-workspace`, and pull its latest changes.

## Files to explore

- [Interactive comparison](section-study-01/output/viewer.html).
- [Findings and assumptions](section-study-01/output/report.md).
- [Comparison figure](section-study-01/output/comparison.png), [plans](section-study-01/output/plans.png), [sections](section-study-01/output/sections.png), [sky-access maps](section-study-01/output/sky-maps.png), and [utility routes](section-study-01/output/utilities.png).
- Editable FreeCAD models: [aligned](section-study-01/output/aligned/cad/aligned.FCStd), [stepped](section-study-01/output/stepped/cad/stepped.FCStd), and [separated](section-study-01/output/separated/cad/separated.FCStd). Opening these requires FreeCAD; the HTML viewer does not.
- [Inputs](section-study-01/parameters.json) and [study instructions](section-study-01/README.md).

## Change the design and recalculate

The viewer controls inspection of saved arrangements. Changing dimensions or assumptions requires editing the model sources and rebuilding; changing a CAD file alone does not update the analysis or viewer.

Follow [simulation setup](simulation/README.md#set-up-another-computer) to recreate the free, locked toolchain. Then, from the repository root:

```bash
uv run --project engineering --locked python engineering/section-study-01/build.py build
uv run --project engineering --locked python engineering/section-study-01/build.py check
```

The full toolchain and study have been executed on Windows x86-64 and Ubuntu 24.04 x86-64. macOS solver execution remains unverified; reviewing the self-contained HTML does not require those solvers. Initial tool installation needs internet access. Native runtimes, caches and large STEP exports are recreated locally; source, locks, selected results and native CAD travel with Git.

Commit and push any source/output changes you want to bring back to another computer. Local edits do not sync automatically.
