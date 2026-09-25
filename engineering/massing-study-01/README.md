# Arcology massing study 01

25 September 2026. A reproducible concept study, not a construction design or a feasibility certification.

## Findings and recommended direction

The housing-led case remains the lead. It needs **267.857 billion sqft of constructed gross floor area** for 100 million humans, including 75 billion sqft of private homes. In this particular geometry, explicit large openings and a separate allowance for district courtyards and streets produce a **25.87 km / 16.08 mile wing-to-wing span**. The shared-city comparison reaches **27.66 km / 17.19 miles** with 357.143 billion sqft gross. Both have a 1,536 m central height and a large flat public summit.

These dimensions are **outputs of the current assumptions**, not new fixed requirements. The study has not proved that all 5,000 districts can be arranged inside either envelope with acceptable daylight and continuous supports. The next design gate is an actual three-dimensional arrangement of several adjacent and vertically related districts, tied to a ground-reaching structural section.

Changing only the number of main tiers from 8 to 16, while holding 360 floors and the other shape ratios fixed, changes the housing-led span by about 0.16%. Tier count alone does little to resolve the space requirement in this family of forms. Height, usable-to-gross efficiency, the public program, district form, and the treatment of open space deserve more attention.

The proposed construction concept is a **city of service districts carried by larger structural sections**. A district should be capable of isolating a fault and maintaining specified essential services for a defined duration. That does not make it structurally detachable or independent of regional generation, heat rejection, food production, or heavy industry. Neither the district size nor structural section size is fixed by this study.

## Files to review

- `../output/pdf/arcology-massing-study-01.pdf`: eight-page illustrated study, including area, access, compute, material and electricity schedules.
- `output/massing-viewer.html`: self-contained browser model; select A or B and drag to rotate. No hosted service is required. It shows envelope volumes; the smaller district voids are not drawn in this model.
- `output/01-massing-comparison.png`: paired massing alternatives at true proportions.
- `output/02-plans-and-sections.png`: coordinated city plans and sections at true scale.
- `output/03-district-plan-section.png`: dimensioned representative district.
- `output/04-program-and-tier-sensitivity.png`: program and tier-count comparison.
- `output/case-A-massing.glb` and `output/case-B-massing.glb`: meter-based, Y-up 3D mesh exports, with one node per vertical band. The calculations, plan drawings and browser viewer use X/Y horizontal coordinates and Z for height.
- `output/case-A-plans.dxf`, `output/case-B-plans.dxf`, and `output/district-plan.dxf`: meter-based CAD plans. City band outlines are on separate layers at the same plan origin; toggle layers to inspect each band. These are polylines, not a BIM model or structural analysis model.
- `output/study-results.json`: unrounded results and check status.
- `parameters.json` and `build_study.py`: inputs and generator. SVG copies of the diagrams are also included; the shaded 3D view contains an embedded raster rendering.

## Confirmed brief and study choices

**Confirmed:** 100 million human residents; 100 million paired AI plus unquantified logistical and independent AI; at least 750 sqft of private dwelling space per human; a large flat public summit open regardless of wealth or residential address; flexible main-tier count; housing-led lead case and shared-city comparison; equipment-based compute accounting.

**Visual direction:** a broad terraced, faceted or rounded central mass with six subsidiary wings. This study is a geometric interpretation, not a reconstruction of the approved landing-page illustration. Its large central court, six other courts, and radial openings are proposed additions. The illustration alone cannot determine their dimensions or establish internal capacity.

**Iteration choices:** 12 main tiers containing 360 floors; 4.2672 m nominal floor-to-floor height; six three-tier wings, each 90 floors high; 12-sided plan outlines; summit radius 42% of central base radius. All floors are above grade in this iteration. The legacy 30 basements have not been carried into it. Floor heights are a common volume-accounting increment; actual plant, transit and assembly spaces may require multiple increments.

**Open:** site, geology, foundation system, height, final shape, district placement, compartmentation, support spacing, structural materials, generation mix, cooling system, AI fleet, water and food balances, transport network, construction rate, and cost.

## Area ledger

All figures below are **billion square feet of usable program** unless marked gross. Indoor program is counted once; open roof landscape and unbuilt voids are separate. Category allocations are planning choices, not validated service standards.

| Use | A: housing-led | B: shared-city |
|---|---:|---:|
| Private homes | 75.000 | 75.000 |
| Shared residential | 18.750 | 25.000 |
| Education | 6.000 | 10.000 |
| Healthcare | 3.000 | 5.000 |
| Workplaces and commerce | 18.000 | 28.000 |
| Indoor public landscape | 10.000 | 18.000 |
| Passenger and freight facilities | 7.000 | 10.000 |
| Food production and distribution | 4.000 | 6.000 |
| Municipal utility facilities | 5.000 | 7.000 |
| Industry and repair | 9.000 | 14.000 |
| Civic and cultural facilities | 5.000 | 8.000 |
| Compute facilities, illustrative equipment case | 0.071 | 0.071 |
| Unassigned program reserve | 26.679 | 43.929 |
| **Total usable** | **187.500** | **250.000** |
| **Constructed gross at 70% usable/gross** | **267.857** | **357.143** |

The 70% factor reserves gross area for structure, shafts and general circulation. Shared residential usable space means resident amenities and common rooms, not a second allowance for those shafts and corridors. Transit program means actual stations, freight facilities and related operations, not all building circulation. Detailed design must maintain these boundaries.

The reserve is unassigned usable program, not a budget contingency, spare generation, or proof that a service is adequate. Food floor area does not demonstrate calorie self-sufficiency. AI residents do not each receive an invented human-sized dwelling or a fixed rack entitlement; embodied AI space and additional infrastructure remain to be specified.

## Geometry and the empty-volume correction

At each elevation band the program unions the central polygon and six wing polygons, removing overlap. It then subtracts the explicit large courts and radial openings. Multiplying each remaining plate by its number of nominal floor increments gives its potential floor-slot capacity. This is not yet constructed floor area.

The district prototype occupies a 560 m by 560 m cell over 27 nominal floor increments. Its cell contains **8.4672 million m2 of floor-slot capacity**, but only **3.01935 million m2 of actual local gross floor area**. The difference, **5.44785 million m2 per district**, is a floor-equivalent measure of empty court and street volume. For 5,000 districts, the housing-led case must reserve **27.23926 billion m2** of this additional empty capacity.

The common floor-height increment converts each of these measures to volume by multiplication by 4.2672 m. This conversion is an accounting device; it does not create extra floors or usable roof space.

| Reconciliation, billion m2 of floor-equivalent capacity | A | B |
|---|---:|---:|
| Central mass plus wings after overlap removal, before openings | 58.44576 | 66.81662 |
| Explicit large court/street deductions | -6.32176 | -7.22719 |
| Capacity after those explicit deductions | 52.12400 | 59.58942 |
| Additional local district empty-volume reserve | -27.23926 | -26.40976 |
| **Actual constructed gross floor area** | **24.88474** | **33.17966** |

Overlap removal accounts for a further 2.48807 billion m2 in A and 2.84443 billion m2 in B before the first row. It is not subtracted again. The local reserve is in addition to the explicit large openings; future spatial placement must replace that aggregate allowance with actual non-overlapping void geometry.

The massing generator scales the horizontal radius until this ledger matches the program requirement. Without the local district void reserve, the same form would have spans of 17.88 km and 20.64 km. Those smaller envelopes would fail to budget for the illustrated district's open spaces. Earlier square-plate width equivalents used another shape and void treatment; they should remain historical comparisons.

Only 47.7% of A's post-large-opening floor-slot capacity becomes actual gross floor area. Solid-colored 3D bands therefore represent an envelope to distribute uses and local voids within, **not fully built floor plates or concrete solids**. The city sections likewise show envelope boundaries, not the final internal structure.

For B, the numerical local reserve changes with its larger shared residential allowance. The detailed district drawing is for A; a separate B block plan has not been designed. Neither case demonstrates complete spatial packing, sky exposure, or adequate street connectivity. Deeply stacked courtyards could become enclosed atria unless they align to a genuine exterior opening; an empty-volume total cannot settle that question.

## Representative district and location strategy

The housing-led prototype comprises 20,000 humans and 20,000 paired AI, with additional AI demand unresolved. There would be 5,000 such population allocations citywide; this is not a count of structurally independent buildings.

| District quantity | Value |
|---|---:|
| Blocks | 16, in a four-by-four arrangement |
| Housing floors per block | 24 |
| Local civic/service floors beneath housing | 3 |
| Housing block outside dimension | 100 m square |
| Clear internal court | 59.33 m square |
| Housing ring depth | 20.34 m, including gross-area allowance |
| Civic podium outside dimension | 120.75 m square |
| Block center spacing | 140 m |
| District cell dimension | 560 m square |
| Total district segment height | 115.21 m |
| Private homes | 1.394 million m2 / 15 million sqft |
| Residential gross | 2.488 million m2 |
| Local civic usable | 0.372 million m2 |
| Total local gross drawn | 3.019 million m2 |
| Additional share of citywide facilities, gross | 1.958 million m2 |
| **Total district allocation, gross** | **4.977 million m2** |

Local civic usable area is 200 sqft per human: education 50, healthcare 20, workplaces/markets 70, indoor commons 30, and utility/transit rooms 30. These are subsets of the city ledger, not added to it. The utility/transit split and exact room assignments remain to be designed. Regional hospitals, universities, large production facilities and major interchanges occupy the separate citywide share.

The ring establishes area capacity, not actual apartments. Core sizes, corridors, kitchens, accessible layouts, apartment subdivisions, fire compartments, daylight, and local plant access remain unresolved. The support marks in the section are schematic corridors; they do not specify member sizes or prove a load path through a mile-high city. The crossing passenger and freight lines describe network intent; grade separation and conflict-free crossings need design.

Working placement proposals:

| Part | Proposed location and reason | Decision still required |
|---|---|---|
| Homes, schools, local commons | Terraces, perimeter and genuine exterior courts for daylight and everyday access | Prove light access at lower levels and acceptable travel distances |
| Neighborhood services | Distributed below and alongside housing, rather than one distant central hub | Assign rooms, capacity, access and isolation boundaries |
| Major compute campuses | Several lower/peripheral locations with direct power, freight and heat-rejection connections | Flood exposure, cooling, resident continuity and independent failure zones |
| Heavy industry and bulk logistics | Accessible lower/peripheral sections or regional sites | Loads, nuisance, hazardous processes and material flows |
| Public summit | Broad uppermost landscape with multiple public access routes | Visitor flows, weather protection, soil/water loads, accessible routes and emergency strategy |
| Generation, large heat rejection, staple agriculture | A regional infrastructure plan extending beyond the inhabited mass | Real site, resource supply, environmental constraints and reserves |

## Area and dependency schedule

No isolation duration or redundancy target is established yet. Each must be defined as an explicit service requirement before equipment can be sized.

| System and area assignment | Local provision to develop | Shared dependency | Failure test for the next study |
|---|---|---|---|
| Structural support: gross-area allowance, not extra program | Repeated supports and defined movement/structural boundaries | Lower supports, foundations and any shared lateral system | Trace gravity and lateral loads to ground; test differential movement and a lost element |
| Electrical rooms: utility program; compute rooms within compute allocation | Local protection, switchgear and stored energy for defined essential loads | Generation, substations, feeder routes and fuel/storage supply | Lose one feeder or substation; confirm protected load and duration |
| AI continuity: compute allocation, including its own power/cooling rooms | Local edge capacity and explicitly protected resident services | Separate compute sites, replicated state, networks and heat rejection | Lose a hall or network path without relying on a replica in the same failure zone |
| Cooling and ventilation: utility program outside compute | Zoned air systems, heat exchangers, control and maintainable isolation | Heat-rejection capacity and makeup water/energy | Lose a chiller, loop or air zone; trace the resulting heat and service limit |
| Water and sanitation: utility program | Pressure zones, break tanks, local isolation and specified reserves | Intake, bulk treatment, wastewater and discharge/reuse | Lose a main or pump train; quantify gravity/backup service and sanitation duration |
| Passenger movement: transit program and ordinary circulation allowance | Multiple usable local routes and accessible connections | Interdistrict routes, express access and summit interchanges | Close one link or interchange; check travel, queuing and emergency access |
| Freight, food and materials: logistics/food/industry program | Receiving, local stocks, waste holding and maintenance access | Regional food, fabrication, material and waste processing networks | Disrupt a corridor or supplier; quantify remaining service days |
| Summit: outdoor roof area, access rooms in the program | Distributed entrances, shelters and maintainable public routes | Support structure, vertical transport and citywide emergency services | Reduce access capacity while maintaining safe public operation |

Two cables, pipes or data paths in the same vulnerable shaft do not establish independent routes. Shared cooling, foundations, switchgear, controls or network state can create co-dependencies even when the districts look separate on a plan.

Construction should begin with a finite, occupiable structural section and its complete service network. Subsequent work must preserve occupied access and avoid depending on unfinished future sections. A 24-floor housing district is an occupancy unit; it cannot simply be placed on another district without a continuous, sized support system.

## Compute and the public summit

The legacy 10% compute-area allowance is particularly worth replacing with rack, cooling, power-room, maintenance, and redundancy requirements; compute demand and floor demand need not grow together.

The illustrative compute model uses 26,800 / 100,000 / 300,000 active racks, with 20% additional equipped spare capacity. Each equipped rack receives 55 m2 of usable campus allocation: rack footprint 3, aisles 9, cooling plant 20, power rooms 15, and maintenance/logistics 8 m2. The common 70% usable/gross factor adds building structure and general circulation, not a second rack-aisle allowance. Campus envelope, outdoor switchyards and remote heat-rejection plant need separate siting.

At an assumed active IT load of 230 kW/rack and PUE 1.2, the three facility-power scenarios are 7.4 / 27.6 / 82.8 GW. Those are sensitivities, not a forecast or a demonstration of AI service capacity. Spare installed racks are not charged as fully active IT loads. Workload, memory, latency, embodied AI, state replication and failure recovery must determine the actual fleet.

PUE relates total data-center facility energy to IT energy; it includes overhead such as cooling and power distribution. The model uses a constant-load approximation for the power scenarios. See the [US Department of Energy definition](https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers). PUE does not establish water use, generation capacity or adequacy of a cooling system.

The summit model tests 100,000 and 1 million human visits/day, a ten-hour arrival window, peak factor 1.5 and three-hour stay. These give 15,000 / 150,000 peak arrivals per hour and 45,000 / 450,000 simultaneous visitors. At an illustrative 80 people/car, twelve-minute round trip, 80% loading and 20% unavailable capacity, the demand is 59 / 586 express-car equivalents. This is capacity arithmetic, not a workable elevator topology, emergency egress design or journey-time prediction.

A has 39.82 km2 of summit roof after the explicit large openings, of which 27.87 km2 is provisionally public after a 30% access/service allowance. Access can constrain visits well before this provisional surface area is occupied. Public entitlement does not mean all 100 million humans must fit there simultaneously. Accessibility, embodied AI, staff, events, wind, weather protection and real shafts/lobbies require separate design. Future local voids reaching the summit may also reduce the stated roof surface.

## Materials and energy

These are deliberately broad input sensitivities. They do not select a structural material or prove that a slab thickness works over any span.

Multiplying actual constructed gross area by an equivalent 0.20 / 0.30 / 0.40 m concrete floor thickness, at an assumed 2,400 kg/m3, gives:

| Floor proxy | A: billion tonnes | B: billion tonnes |
|---|---:|---:|
| 0.20 m | 11.94 | 15.93 |
| 0.30 m | 17.92 | 23.89 |
| 0.40 m | 23.89 | 31.85 |

This uniform-area proxy excludes columns, walls, reinforcement, foundations, facade, fit-out and landscape. It also lacks the detailed floor penetrations and varying systems of a takeoff. It is not total construction mass, and envelope mesh volume must never be substituted for concrete volume. The next material comparison should use a designed repeated bay and its full support path to compare at least a concrete scheme with a lighter hybrid floor system. Embodied energy, carbon and regional supply need separate quantities and sources.

Applying hypothetical noncompute electricity intensities of 100 / 200 / 400 kWh per gross m2 per year, excluding the compute campus before adding it back once at 27.6 GW continuously, produces:

| Electricity intensity sensitivity | A: annual TWh | A: average GW | B: average GW |
|---|---:|---:|---:|
| 100 kWh/m2/year | 2,729 | 312 | 406 |
| 200 kWh/m2/year | 5,217 | 596 | 785 |
| 400 kWh/m2/year | 10,192 | 1,163 | 1,542 |

The intensities are not calibrated forecasts. The proxy applies uniformly across the noncompute gross program, including reserve, and should be replaced by use-specific loads and occupancy. Heavy processes and food systems need explicit checks against the aggregate allowance. Annual average electrical demand is not peak demand, generation nameplate capacity, storage power or stored energy. Fuel-based heating, construction energy, imported goods/food, storage losses and backup arrangements are outside this operational electricity illustration. Compute cooling electricity is already included through PUE; do not add it again. Heat rejection remains a distinct physical constraint even after electrical energy has been counted.

The earlier construction-and-sections document used a narrower electricity sensitivity for 75% of usable area and a 150-250 mm floor-material proxy. This iteration explores broader inputs and a different electricity boundary. The two electricity tables must not be added or treated as forecasts for an identical scope; neither has a calibrated operating model. The earlier construction-energy example is also separate from this operational electricity account.

## Free tools and reproducibility

Used locally: [Shapely](https://shapely.readthedocs.io/en/stable/manual.html) for planar unions, differences and area; [trimesh](https://trimesh.org/) for extrusion, mesh checks and GLB export; [ezdxf](https://ezdxf.readthedocs.io/en/stable/) for CAD drawings; NumPy for calculations; Matplotlib for drawings; Plotly for the offline 3D viewer; ReportLab for the PDF. No paid API, subscription or cloud CAD service is required. The repository edition installs its dependencies into the isolated `engineering/.venv` environment using `engineering/uv.lock`.

These tools improve geometric consistency and reproducibility. They do not perform structural, daylight, fire, wind or energy simulation in this study. A full CAD/BIM application becomes useful when we start assigning real rooms, components, structural sections and service interfaces; the current outputs provide exchange geometry for that work.

To reproduce from the repository root after installing uv:

```powershell
uv run --project engineering --locked python engineering/run.py build
```

The study's `requirements-resolved.txt` records top-level versions for reference; the engineering workspace's `uv.lock` resolves transitive dependencies and is the installation authority. The browser model embeds its Plotly runtime and geometry and can be opened directly from disk. See `../README.md` for the portable entry point and provenance checks.

The district prototype currently uses a four-by-four block layout and 24 housing floors; those architectural choices also appear in the drawing code. The JSON exposes the principal study inputs, but the generator is not a general CAD application for arbitrary block arrangements. Update the code and rerun the assertions when changing that topology.

## Verification and limits

The generator checks program sums, the dwelling-area minimum, positive reserves, valid polygon geometry, overlap/large-void accounting, district local area, non-overlapping podiums, contained upper plates, mesh closure/winding/volume and re-opened GLB/DXF files. Final PDF pages were rendered for visual inspection; the browser viewer was checked in both cases.

These checks establish consistency within the concept model. They do not establish structural strength, lateral stability, foundation settlement, progressive-collapse resistance, code compliance, evacuation, daylight sufficiency, comfort, regional resource sufficiency or economic feasibility. Contained upper plates are only a necessary geometric condition for the proposed support logic. The human home minimum is verified as total capacity, not as a completed apartment plan for every household.

## Next study: prove one inhabited structural section

1. **Place several districts in three dimensions.** Include one terrace edge, an interior court and an upper/lower relationship. Identify which outdoor spaces have open sky and which would be enclosed atria. Replace their aggregate void allowances with exact geometry and update the city ledger.
2. **Trace weight to ground.** Choose repeated bays, vertical support corridors and movement boundaries. Compare floor systems with the accumulated loads from upper districts, the summit landscape and plant. Bring in site/geotechnical assumptions before foundation dimensions are claimed.
3. **Draw one apartment floor and its cores.** Demonstrate the 750 sqft/person minimum, shared area, corridors, access, daylight and maintenance space within the gross factor.
4. **Place two utility interfaces.** Show electrical, water, cooling and data routes, their isolation points, and what continues after a selected failure. Establish essential loads and continuity durations before selecting equipment.
5. **Resolve public access.** Connect district passenger routes to a distributed express/local summit system, with station/lobby areas and a credible journey model. Coordinate freight separately.
6. **Then prepare an explainer cutaway.** Show a home, district, structural section, city network and regional supply together, using established dimensions and explicitly distinguishing remaining proposals.

Source basis: the author's confirmed brief; `../arcology-construction-and-sections.md`; `../arcology-research-evaluation.md`; and repository snapshot `ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c` of `YourLifewithAI/Lifewithai`. New shape ratios, category splits and equipment/resource sensitivities are study assumptions, not claims established by the older repository research. This study does not revise the legacy knowledge entries or website content.
