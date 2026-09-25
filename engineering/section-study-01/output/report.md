# Four districts: placement comparison

Generated 2026-09-25. Concept screening, not a construction design.

All three arrangements contain **80,000 humans, 80,000 paired AI plus unquantified other AI, and 60 million sqft of private homes**. Each has 64 courtyard blocks, 24 housing floors and three civic/service floors per block. Private housing stays at 750 sqft per human. The local civic program also stays constant. This is one two-tier section, **243.2 m high**, not the entire Arcology or the full load from everything above it.

## Comparison

| Arrangement | Cell envelope footprint, km2 | Lower court sky fraction | Lower inner-facade sky fraction | Ground-reaching support axes / upper-only axes | Boundary bridge clear span, m | A+B service-route length, km |
|---|---:|---:|---:|---:|---:|---:|
| Aligned | 0.627 | 2.1% | 2.1% | 256 / 0 | 19.3 | 3.69 |
| Stepped | 0.784 | 4.0% | 8.6% | 320 / 64 | 19.3 | 4.25 |
| Separated | 0.706 | 2.1% | 2.2% | 256 / 0 | 159.3 | 4.25 |

Sky fractions compare irradiance with unobstructed sky on the same horizontal or vertical orientation. They are not daylight factors, room illuminance, annual sunlight hours or compliance scores. The model has a uniform sky, black opaque surfaces and no glazing. Court means average 32 lower-court sensors; inner-facade means average 384 lower sensors across four directions and three housing elevations. Every case uses the same local sensor locations and program.

## Interpretation

Aligned preserves a compact footprint and shared support axes, but doubling the surrounding building height reduces the amount of sky visible from lower courts. A court can remain vertically open and still be heavily enclosed.

Stepped moves the upper districts by exactly one 140 m block pitch. Three of four block rows retain aligned supports; the exposed fourth lower row gains sky and uncovered roof footprint. The upper edge row needs additional ground-reaching supports below it. This avoids an invented transfer floor, but leaves tall exposed support segments requiring a braced frame/core solution. The service routes also acquire upper-level jogs.

Separated widens the district boundary by 140 m. The local courtyard geometry within each stacked pair is unchanged, so the major benefit should be sought at outward-facing edges. It creates a much longer boundary crossing. The illustrative two-metre-deep bridge beam is a deliberately simple diagnostic, not a selected system: its displacement and span sensitivity show why the crossing needs a dedicated long-span design or a different support arrangement.

**Carry the stepped arrangement forward as the leading hypothesis, with aligned as the compact control, but do not freeze the courtyard geometry yet.** Its lower court mean remains only about 4% of unobstructed horizontal sky, and the median remains near 2% because most rows still sit below upper blocks. The inward-facade mean improves to about 8.6%, but its median is only about 1.7%; the gain is uneven. The next iteration should compare wider/shallower courts, shorter inhabited stacks and openings to larger sky corridors while keeping the private-home program fixed. Indoor daylight and annual/site conditions must then be evaluated explicitly.

Stepping increases the planning-cell footprint by 25%, adds 64 upper-only support axes with 128 m of unoccupied height beneath their district, and produces about 51,843 m2 of lower roof footprint without an upper building directly above it. That roof area is an opportunity, not a usable public-park area certification. Grid alignment retains 192 of 256 upper support axes over lower supports. Resolve the exposed edge frame and street/deck supports before describing this as a viable structural system. The separated option improves outward-facing lower facade sky access from about 21.4% to 23.9%, but does little for the inner courts; reserve such openings for places where that edge/public-space benefit warrants the crossing cost.

## Equal-program ledger

Per arrangement: 9,953,897 m2 residential gross, including 5,574,182 m2 private homes; 2,123,498 m2 local civic/service gross, containing 1,486,449 m2 usable program. Courtyards are cut out on every floor and are not counted as housing. Support/core envelopes sit inside the inherited 30% gross allowance. Plant rooms reserve 512 m2 per district within civic gross area; this is a placeholder, not equipment sizing. Service decks outside the building rings are additional circulation/utility area, reported separately with overlap removed.

The earlier citywide program still assigns another 5,481,279 m2 usable area to these residents outside the four cells. This study does not claim those regional/shared facilities have been fitted here. The shared-city case's 75% private/residential-usable ratio alone would require 663,593 m2 more residential gross area for the same residents, before its larger shared-city program. That remains a program-demand comparison; these placements use the housing-led district.

The center-of-court sensors are virtual probes at the housing-entry elevation plus 1.5 m. In the stacked cases the courts remain vertically continuous; these probes do not imply a floor or suspended garden across the opening. Facade sensors lie 50 mm outside the opaque faces. The same 1,600 locations relative to their districts are evaluated in every arrangement; repeating at four times the ray count changed no sensor by more than one percentage point. Results are distributions, not guarantees that every resident receives the mean.

## Structural screen

Eight illustrative hollow support/core envelopes per block, each 8 m square with 1 m walls, reserve 7.9% of a residential floor. These are spatial and stiffness assumptions, not approved concrete/steel member sizes. OpenSees uses E=30 GPa and a common 12 kPa lumped gravity pressure on housing and civic floor area. The load includes a provisional allowance for structure, finishes, services and occupancy; explicit self-weight is not added again. Deck/bridge loads are assessed separately and are not transferred into the support-line model.

Each vertical axis is an independent linear elastic line with a fixed base. No horizontal frame action, foundation settlement, lateral loads, buckling, creep, cracking, load factors, overburden or strength checks are included. Every axial result is checked against sum(P*z)/(EA), and total reactions balance the floor loads. Results indicate movements to resolve at cross-connections, not allowable deformations. A full three-dimensional structural model needs a selected system and load brief.

| Arrangement | Gravity load, GN | Peak nominal axial stress, MPa | Peak shortening, mm | Boundary-bridge linear deflection, mm | Unoccupied height below upper-only supports, m |
|---|---:|---:|---:|---:|---:|
| Aligned | 144.93 | 20.2 | 78.0 | 1.1 | 0.0 |
| Stepped | 144.93 | 20.2 | 78.0 | 1.1 | 128.0 |
| Separated | 144.93 | 20.2 | 78.0 | 5015.2 | 0.0 |

The identical peak axial response comes from the fully stacked support lines present in every case. It does not imply equal lateral stability or equal foundation cost. In the linear pressure sensitivity, the peak response scales as follows (same section/stiffness assumptions):

| Lumped floor pressure, kPa | Peak nominal axial stress, MPa | Peak axial shortening, mm |
|---|---:|---:|
| 8 | 13.5 | 52.0 |
| 12 | 20.2 | 78.0 |
| 16 | 27.0 | 104.0 |

Bridge checks use a simply supported solid rectangular 8 m by 2 m elastic section and the same illustrative area pressure; this is not a truss or optimized bridge. Twenty load subdivisions agree with the uniform-load beam formula within 0.3%. Large predicted movement is evidence that this assumed section/model is unsuitable, not a prediction of the behavior of a properly designed bridge.

## Utilities and independence

All variants have two separated A/B street spines, local plant interfaces and section-entry boundaries. The graph checks loss of each edge, each local plant interface, the entire A spine, and all section supply boundaries. Each single modeled edge/interface loss and A-spine loss leaves all four districts connected through another path. Losing all section entries disconnects all four. Connectivity is not spare capacity, supply independence or guaranteed continuity of service. A and B may share an upstream source; common structural/fire/flood faults are not yet modeled.

Electricity, potable water, cooling supply/return and data are tagged on the routes. Cooling supply and return are separate services, not interchangeable redundancy. Potable water needs pressure breaks/boosting; the provisional 40 m pressure-zone increment gives seven vertical zones through this section (about 0.39 MPa static head per 40 m, before losses). Pump sizing, pressure transients, electrical protection, sewage routing, water storage, thermal storage, heat rejection and autonomy duration remain unresolved. Compute capacity and AI heat rejection need equipment workloads; no floor-area percentage is used as a compute requirement.

The room/plant reservations and service-deck paths have not established evacuation, fire compartments, service access, transport capacity or natural ventilation. High sky access does not prove adequate airflow. EnergyPlus is installed, but no district energy ranking is manufactured without site weather, envelope and operating schedules.

## Files and reproduction

- `comparison.png`, `plans.png`, `sections.png`, `sky-maps.png`, `utilities.png`: coordinated review graphics.
- `viewer.html`: offline interactive 3D geometry, sensors and service routes for all three cases.
- `results.json`, `comparison.csv`, per-case `model.json` and `solver-results.json`: exact inputs, results and solver provenance.
- Per-case `cad/*.FCStd`: editable slab prototypes with placed floor/core links. STEP is generated locally and kept outside Git because it is much larger. CAD body volumes include intentional intersections and are not a concrete takeoff.

Run `uv run --project engineering --locked python engineering/section-study-01/build.py build` after installing the simulation toolchain. Use `check` to verify the saved source and artifact hashes without rerunning solvers. `render` reuses current solver records to regenerate graphics only; source changes still require a full rebuild for current evidence.

The source brief, input assumptions and solver limitations are versioned with the study. These plans are schematic engineering drawings, not new approved Arcology artwork or a final structural scheme.

Methods: [Radiance rtrace manual](https://www.radiance-online.org/learning/documentation/manual-pages/pdfs/rtrace.pdf), [OpenSees elastic beam-column API](https://openseespydoc.readthedocs.io/en/latest/src/elasticBeamColumn.html). Analytical checks and thresholds are explicitly defined in the local code; the 20% sky band is a diagnostic marker, not a regulatory threshold.
