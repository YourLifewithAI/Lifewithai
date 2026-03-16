---
id: "structural-engineering/foundation-systems/foundation-systems"
title: "Foundation Systems at Arcology Scale"
domain: "structural-engineering"
subdomain: "foundation-systems"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-24"
updated: "2026-03-07"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["foundation", "piles", "piled-raft", "settlement", "subsidence", "bearing-capacity", "gulf-coastal-plain", "geotechnical", "clay", "ground-improvement", "compensated-foundation", "growth-faults"]
summary: "Foundation systems for a 5,000-foot arcology on the Texas Gulf Coastal Plain. The structure's estimated 37.5 billion tonnes must be transferred to expansive clay with no accessible bedrock — basement rock lies approximately 6,000+ meters deep beneath kilometers of unconsolidated sediment. Individual pile and raft technology is mature; the site geology is the fundamental constraint. The deepest proven building piles (150m at KLCC Lot L&M, 2024) remain far short of reaching competent strata. Compensated foundation principles and distributed modular approaches offer partial mitigation but do not resolve the core load-transfer problem at this scale."
citations:
  - id: "poulos-bunce-2008"
    type: "peer-reviewed"
    title: "Foundation Design for the Burj Khalifa"
    source: "CTBUH / Coffey Geotechnics"
    year: 2008
  - id: "jeddah-tower-piled-raft-2014"
    type: "peer-reviewed"
    title: "From Supertall to Megatall: Analysis of the Kingdom Tower Piled Raft"
    source: "CTBUH"
    year: 2014
  - id: "shanghai-tower-foundation-2012"
    type: "peer-reviewed"
    title: "Shanghai Tower Foundation Design and Pile Load Tests"
    source: "Advanced Materials Research"
    year: 2012
  - id: "twdb-yegua-jackson"
    type: "project-data"
    title: "Yegua-Jackson Aquifer: Structure and Hydrogeology"
    source: "Texas Water Development Board"
    year: 2010
  - id: "usgs-houston-subsidence"
    type: "project-data"
    title: "Houston-Galveston Subsidence Interactive Data"
    source: "USGS"
    year: 2024
  - id: "pmc-houston-subsidence-2024"
    type: "peer-reviewed"
    title: "A Century of Houston Subsidence Studies: Compaction, Creep, and Irreversibility"
    source: "PMC / Environmental Earth Sciences"
    year: 2024
  - id: "sciencedirect-large-pile-groups-2022"
    type: "peer-reviewed"
    title: "Numerical Analysis of Large Pile Group Lateral Effects"
    source: "Computers and Geotechnics"
    year: 2022
  - id: "kansai-airport-settlement"
    type: "project-data"
    title: "Kansai International Airport: Settlement Management on Soft Marine Clay"
    source: "Kansai International Airport Co."
    year: 1994
  - id: "klcc-lot-lm-deepest-pile-2025"
    type: "peer-reviewed"
    title: "Bored Pile Foundation for KLCC Lot L&M: KLCC Breaks Its Own World Record in Pile Depth"
    source: "Springer / International Conference on Geotechnical Engineering"
    year: 2025
  - id: "kansai-airports-settlement-2024"
    type: "project-data"
    title: "Condition of the Settlement — KIX Technical Information"
    source: "Kansai Airports"
    year: 2024
  - id: "uh-houston-subsidence-insar-2022"
    type: "peer-reviewed"
    title: "Significant Rates of Sinking Ground in Houston Suburbs (InSAR Analysis)"
    source: "University of Houston"
    year: 2022
  - id: "usgs-coastal-plain-sediment-2022"
    type: "project-data"
    title: "Atlantic and Gulf Coastal Plains Sediment Thickness"
    source: "USGS"
    year: 2022
  - id: "fhwa-deep-mixing-2013"
    type: "project-data"
    title: "Design Manual: Deep Mixing for Embankment and Foundation Support"
    source: "Federal Highway Administration"
    year: 2013
  - id: "torre-latinoamericana-ice"
    type: "project-data"
    title: "Torre Latinoamericana: Seismic Engineering in Mexico"
    source: "Institution of Civil Engineers"
    year: 2020
  - id: "nrc-epz-smr-2023"
    type: "government-report"
    title: "Emergency Preparedness for Small Modular Reactors and Other New Technologies — Final Rule"
    source: "Federal Register / NRC"
    year: 2023
cross_references:
  - slug: "structural-engineering/site-selection/site-selection"
    relationship: "depends-on"
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "parallel"
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "informs"
  - slug: "construction-logistics/construction-sequence/construction-sequence"
    relationship: "informs"
open_questions:
  - "Can the Gulf Coastal Plain subsurface support 37+ billion tonnes without meters of differential settlement over the structure's lifetime?"
  - "What pile group settlement behavior emerges at scales of hundreds of thousands of piles, given no validated design methodology for groups beyond ~25?"
  - "Would a distributed foundation model — many independent systems across the 3.5-mile footprint — change the feasibility picture compared to a single integrated foundation?"
  - "What is the optimal balance between compensated (buoyancy) excavation and pile-supported load transfer for a structure of this mass on Gulf Coastal Plain clay?"
  - "Can active jacking systems scale from Kansai Airport's 900-jack network to the thousands of independent adjustment points an arcology footprint would require?"
  - "How would hundreds of thousands of concrete piles alter regional groundwater flow patterns and what second-order subsidence effects would that create?"
assumptions:
  - "Target population of approximately 10 million residents"
  - "Terraced ziggurat form with 3.5-mile base footprint (~24.6 km²)"
  - "Total structural dead load of approximately 37.5 billion tonnes (order-of-magnitude estimate: 46M m² inhabitable area at 8 kN/m² average)"
  - "Structure located in Burleson County, Texas on Gulf Coastal Plain geology"
  - "Basement rock lies approximately 6,000+ meters below surface — far beyond any pile technology"
  - "Shallow groundwater table with active confined aquifer at depth"
parameters:
  - name: "total_structural_load_tonnes"
    value: 37500000000
    unit: "tonnes (estimated dead load)"
    confidence: 1
  - name: "foundation_footprint_sqkm"
    value: 24.6
    unit: "km²"
    confidence: 2
  - name: "surface_bearing_capacity_kpa"
    value: 96
    unit: "kPa (range: 72-120)"
    confidence: 2
  - name: "max_pile_depth_proven_m"
    value: 150
    unit: "meters (KLCC Lot L&M, 2024 — current world record)"
    confidence: 3
  - name: "target_pile_depth_m"
    value: 175
    unit: "meters (estimated minimum for Gulf Coastal Plain)"
    confidence: 2
  - name: "largest_raft_current_sqm"
    value: 8945
    unit: "m² (Shanghai Tower, current record)"
    confidence: 3
  - name: "max_pile_working_load_mn"
    value: 70
    unit: "MN (limestone-socketed, current best)"
    confidence: 3
  - name: "estimated_pile_load_gcp_mn"
    value: 20
    unit: "MN (estimated achievable in Gulf Coastal Plain clays, range 15-25)"
    confidence: 2
  - name: "historical_subsidence_max_m"
    value: 3.0
    unit: "meters (Harris County, 20th century cumulative)"
    confidence: 3
  - name: "subsidence_rate_recent_cm_yr"
    value: 2.0
    unit: "cm/year (suburban Houston analog — Katy, Spring, The Woodlands)"
    confidence: 2
  - name: "max_concrete_pour_current_m3"
    value: 61000
    unit: "m³ (Shanghai Tower, single pour over 63 hours)"
    confidence: 3
  - name: "stiff_clay_depth_m"
    value: 10
    unit: "meters (typical depth to stiff CL/SM, Houston-area analog)"
    confidence: 2
  - name: "beaumont_formation_thickness_m"
    value: 30
    unit: "meters (approximate, Burleson County regional estimate; USGS range 7.6-122m regionally)"
    confidence: 1
  - name: "load_ratio_to_burj_khalifa"
    value: 83333
    unit: "× (arcology load / Burj Khalifa load, based on 450,000 tonnes)"
    confidence: 2
  - name: "depth_to_basement_rock_m"
    value: 6000
    unit: "meters (minimum estimate — Gulf Coastal Plain sediment wedge)"
    confidence: 2
  - name: "deep_soil_mixing_max_depth_m"
    value: 30
    unit: "meters (current technology limit for ground improvement)"
    confidence: 3
  - name: "kansai_cumulative_settlement_m"
    value: 13.66
    unit: "meters (total since construction began, as of 2024)"
    confidence: 3
  - name: "kansai_current_rate_cm_yr"
    value: 6
    unit: "cm/year (2024, down from 50 cm/year at opening in 1994)"
    confidence: 3
---

Foundation systems are the load-transfer interface between a structure and the earth — the piles, rafts, and ground improvement that distribute building weight into competent bearing strata. For Arcology One — a 5,000-foot terraced ziggurat housing 10 million people — this interface must handle approximately 37.5 billion tonnes of dead load across a 24.6 km² footprint in Burleson County, Texas. That load is roughly 83,000 times the Burj Khalifa's foundation load. The site is Gulf Coastal Plain clay — expansive Vertisols over Beaumont Formation deposits, with a shallow water table, no bedrock within thousands of meters, and an active subsidence history that has already permanently deformed the regional landscape. This is not an engineering optimization problem. It is a feasibility question, and the honest answer is that it is unsolved at multiple levels simultaneously.

The bedrock question is now definitively answered: USGS sediment thickness mapping confirms that the Gulf Coastal Plain sedimentary wedge at Burleson County's latitude is approximately 6,000 meters deep at minimum, thickening to 12,000–18,000 meters toward the coast (usgs-coastal-plain-sediment-2022). Basement rock — Precambrian and Paleozoic crystalline formations — lies beneath kilometers of Mesozoic and Cenozoic sediment. Deep rock anchors are not feasible. There is no competent bedrock to reach. The foundation system must work entirely within unconsolidated to semi-consolidated sedimentary deposits.

## What Supertall Foundations Look Like Today

The dominant foundation system for supertall buildings is the piled raft: a thick reinforced concrete slab connected to an array of bored piles. The raft distributes load broadly while piles reach competent bearing strata below soft surface soils. Four projects now define the current frontier.

The **Burj Khalifa** (828m, Dubai) sits on 192 bored piles, 1.5m diameter, 43m long, connected to a 3.7m-thick raft covering 3,305 m². Total load: approximately 450,000 tonnes. Per-pile working load: ~3,000 tonnes. The design was governed by settlement tolerance (predicted 45–62mm), not bearing capacity — the piles tip into calcareous siltstone, a competent rock analog that Gulf Coastal Plain geology does not offer (poulos-bunce-2008).

The **Jeddah Tower** (planned 1,000m+, Saudi Arabia) pushed the frontier with 270 bored piles extending to **105 meters depth** at the tower center — among the deepest Kelly-drilled building piles at the time of design. Raft thickness: 4.5–5.0m. Total load: 860,000 tonnes. Foundation pressure: 2.65 MPa. This project proved that extreme pile depths are achievable in reasonable geology (jeddah-tower-piled-raft-2014).

The **Shanghai Tower** (632m, Shanghai) is the closest structural analog to Gulf Coastal Plain conditions. Its 955 bored piles, 1.0m diameter, extend 52–56m into deep Yangtze River delta soft alluvium — friction piles, not end-bearing. The raft is 6.0m thick (the thickest on record) covering 8,945 m² (the largest single-building raft footprint). A single foundation pour consumed 61,000 m³ of concrete over 63 hours, requiring embedded coolant pipes to manage hydration heat (shanghai-tower-foundation-2012). Shanghai Tower demonstrates that large pile counts in soft clay are buildable. But its total foundation area is **2,750 times smaller** than the arcology's footprint.

The **KLCC Lot L&M development** (Kuala Lumpur, 2024) now holds the world record for deepest building piles. Bored piles for this project reached approximately **150 meters** below ground level, surpassing the KLCC Twin Towers' previous record of ~125m and the Jeddah Tower's 105m (klcc-lot-lm-deepest-pile-2025). This confirms that 150m pile depths are achievable with current technology in suitable geology. The arcology's estimated minimum requirement of 175m is 17% beyond this proven frontier — a significant but not unprecedented extrapolation, given that the jump from 105m (Jeddah) to 150m (KLCC) was itself a 43% increase over roughly a decade.

Current pile technology limits: maximum proven building pile depth of 150m (KLCC Lot L&M), with the previous record at 105m (Jeddah). Maximum machine-drilled shaft diameter ~3.65m. Maximum working load per pile: 40–70 MN in limestone-socketed bored piles. In Gulf Coastal Plain clays, achievable working loads are likely 15–25 MN — reduced 3–5× by geology, with the central estimate of 20 MN based on typical friction pile capacity calculations for stiff overconsolidated clay at depths of 100–175m.

## The Ground Beneath Burleson County

Burleson County sits in the transition zone between the Texas inland and the Gulf Coastal Plain, underlain by the Yegua-Jackson Aquifer system (twdb-yegua-jackson). The subsurface profile presents problems at every depth.

**Surface (0–3m):** Expansive Vertisols and Alfisols — shrink-swell clays that produce constant foundation movement under normal conditions. These are the soils that crack Texas slab-on-grade houses.

**Shallow (3–12m):** Loose to medium soils with poor bearing capacity. Stiff clay (CL) and medium-dense silty sand (SM) typically appear at 8–12m depth (central estimate: 10m) at Houston-area analog sites. Bearing capacity in this zone: 72–120 kPa (mean ~96 kPa) — or 1,500–2,500 psf. For comparison, the Jeddah Tower foundation operates at 2,650 kPa. The Gulf Coastal Plain surface is 22–37× weaker.

**Mid-depth (12–40m):** Beaumont Formation — Pleistocene clay, silt, and sand from fluvial and deltaic deposition. USGS data indicates the formation ranges from 25 to 400 feet (7.6–122m) in thickness across the region; the estimated ~30m at the Burleson County site remains unconfirmed without site-specific borehole data (usgs-coastal-plain-sediment-2022). This is where conventional Houston-area piles terminate, at 60–150+ feet (18–46m). Adequate for houses and low-rises. Inadequate for arcology-scale loads.

**Deep (40m+):** More clay and interbedded sands, extending thousands of meters. USGS sediment thickness mapping shows the Gulf Coastal Plain sedimentary wedge is approximately 6,000 meters deep at this latitude, thickening to 12,000–18,000 meters toward the coastline (usgs-coastal-plain-sediment-2022). There is no competent bedrock within any conceivable drilling range. The estimated minimum pile depth of 175m would penetrate less than 3% of the total sediment column. Even at that depth, the piles would remain in unconsolidated to semi-consolidated sedimentary material — friction capacity only, no end-bearing on rock.

**Groundwater:** Shallow water table with an active confined aquifer at depth. This matters for construction: excavating any meaningful foundation depth requires aggressive dewatering. For a 24.6 km² site, dewatering would depressurize the regional aquifer for miles, inducing the same irreversible clay compaction that caused Houston's historical subsidence crisis — before a single pile is installed.

## Subsidence: A Geological Constraint

This is the critical site-specific problem, and it is not primarily an engineering problem. It is a geological one.

Harris and Galveston Counties experienced up to **3 meters (10 feet)** of cumulative land subsidence over the 20th century from groundwater pumping (usgs-houston-subsidence). Peak historical rates reached 5 cm/year. Recent InSAR analysis by the University of Houston found ongoing subsidence of up to 9 cm over a 4-year period (2016–2020) in fast-growing suburbs including Katy, Spring, and The Woodlands, with sustained rates of approximately 2 cm/year driven by continued groundwater and hydrocarbon extraction (uh-houston-subsidence-insar-2022). More than 90% of this compaction is **permanent inelastic deformation** — the clay grains rearrange irreversibly, and the ground never comes back (pmc-houston-subsidence-2024).

The arcology's relationship to subsidence operates at three scales:

**Construction-induced:** Dewatering a 24.6 km² excavation would draw down the regional aquifer, inducing meters of subsidence across a wide area during the construction phase itself.

**Load-induced:** A structure of 37.5 billion tonnes would generate pore pressure changes propagating kilometers laterally and hundreds of meters vertically. This is not local soil consolidation under a foundation — it is a regional hydrogeological disturbance. Standard geotechnical consolidation models do not apply at this scale.

**Time-dependent:** Gulf Coastal Plain clays exhibit secondary consolidation (creep) — ongoing settlement independent of pore pressure dissipation. For a 100+ year structure, these contributions are poorly constrained. Houston subsidence studies document ongoing creep even decades after water levels recover (pmc-houston-subsidence-2024).

The structure would also span areas of increasing induced seismicity from oil and gas wastewater injection. Growth faults are present in the Texas Coastal Plain and have been reactivated by groundwater withdrawal in suburban Houston areas. University of Houston research indicates that if current pumping trends continue, faults in Katy and The Woodlands will likely see increased reactivation over time — the faults sole out into detachment surfaces at depth, and pore pressure changes from withdrawal or injection shift the stress state toward failure (uh-houston-subsidence-insar-2022). A 3.5-mile foundation footprint would almost certainly span multiple growth faults. No building code addresses rigid structures spanning active faults.

## Compensated Foundation: Partial Mitigation

Compensated (buoyancy) foundation design offsets structural load by excavating soil — the removed weight reduces net bearing pressure on the subsurface. The principle is proven at building scale: Mexico City's **Torre Latinoamericana** (1956, 44 stories) uses a compensated piled raft with a foundation slab at 13.5m depth supported by 361 point-bearing piles reaching a hard sand layer at 33m. The excavation offsets enough dead load that the tower has survived multiple major earthquakes on some of the world's softest clay without structural damage (torre-latinoamericana-ice).

For the arcology, the arithmetic is sobering. Soil density in the Gulf Coastal Plain averages approximately 1,800–2,000 kg/m³. A 10-meter-deep excavation across the full 24.6 km² footprint would remove roughly 440–490 million tonnes — about 1.2–1.3% of the total structural load. Even a 30-meter excavation (the approximate limit of Beaumont Formation thickness) would offset only 3.5–4%. Compensated design helps at the margins but cannot meaningfully address a load of this magnitude.

The excavation itself creates problems. A 10m-deep cut across 24.6 km² removes 246 million m³ of material — requiring disposal of roughly 450 million tonnes of spoil. That volume exceeds the entire Three Gorges Dam excavation. And at any depth below 2–3m, aggressive dewatering would be required, triggering the subsidence effects described above.

Compensated foundation design is worth incorporating as one component of a hybrid system, but it cannot serve as the primary load-offset mechanism. The load-to-excavation ratio is simply too extreme.

## Differential Settlement Across Miles

No structure approaches a 3.5-mile (5.6 km) integrated foundation footprint. The Shanghai Tower's record-setting raft (8,945 m²) is 2,750 times smaller than the arcology's ~24.6 km². The scaling problem is not just load — it is heterogeneity.

Over 5.6 km, even 0.1% differential settlement variation produces **5.6 meters** of vertical displacement across the footprint. That is catastrophic for any rigid structural system. The subsurface of the Gulf Coastal Plain is not uniform — it contains paleochannels (ancient buried river courses), sand lenses of varying thickness, growth fault offsets, and Beaumont Formation thickness variations that change across distances much shorter than 5.6 km. Predicting uniform settlement across this footprint is not possible with current subsurface modeling.

The **Kansai International Airport** offers the most instructive precedent (kansai-airport-settlement). Built as an artificial island on soft marine clay in Osaka Bay, it has experienced **13.66 meters of cumulative settlement** since construction began — far beyond the original design predictions of approximately 5–6 meters (kansai-airports-settlement-2024). The settlement rate has decreased from 50 cm/year at opening in 1994 to approximately 6 cm/year in 2024, but it continues. The terminal building is supported by a network of **900 adjustable hydraulic jacks** that are manually recalibrated every three years to maintain level floors and functioning infrastructure. This approach works for a flat infrastructure platform — but not for a vertically integrated rigid structure with 360 floors of interconnected systems.

The Kansai precedent is both cautionary and instructive. The 13.66m of actual settlement — more than double the predicted amount — demonstrates the limits of settlement prediction in soft clay. The 900-jack active management system demonstrates that adaptive approaches can maintain functionality through ongoing settlement. But the scale gap is immense: Kansai's two islands total approximately 5.1 km² of footprint with relatively uniform loading from runways and terminal buildings. The arcology would require managing differential settlement across 24.6 km² under highly non-uniform load distributions from a tiered megastructure. The number of adjustment points would scale into the thousands, and the precision requirements would be far more demanding.

The implication is uncomfortable: a rigid arcology on this footprint would need to either achieve nearly perfect settlement uniformity (not achievable with current prediction) or incorporate structural articulation — expansion joints, settlement-tolerant connections, independent foundation zones — that would fragment the monolithic structural concept. The geometry described in the primary geometry entry (structural-engineering/superstructure/primary-geometry) assumes an integrated structural system. Foundation realities may force that system toward a collection of structurally independent modules.

## Pile Groups at a Scale Nobody Has Modeled

Published pile group design guidance covers groups of up to approximately 25 piles (sciencedirect-large-pile-groups-2022). The Shanghai Tower — with 955 piles — was designed through extensive site-specific testing and numerical modeling, not standard codes. The arcology would require **hundreds of thousands of piles**.

Pile-soil-pile interaction in large groups produces two competing effects: **shadowing** (reduced soil resistance from overlapping stress zones between adjacent piles, reducing capacity) and **reinforcement** (soil stiffening from confinement between closely spaced piles, reducing settlement). In small groups, these effects are characterized. In groups of thousands, they are not. The 2022 study in Computers and Geotechnics was among the first to examine lateral effects for groups of 100+ piles and explicitly noted the absence of published guidance. A 2023 numerical study found that group efficiency decreases with increasing pile count and decreasing spacing — but only modeled configurations up to 6×6 (36 piles), leaving the behavior at 1,000+ piles entirely uncharacterized (sciencedirect-large-pile-groups-2022).

At arcology scale, the piles would interact not just with each other but with the regional groundwater system. Hundreds of thousands of concrete elements driven into the aquifer would alter permeability patterns, redirect groundwater flow, and create a subsurface structure that fundamentally changes the hydrogeological behavior of the site. This interaction is wholly uncharacterized.

Ground improvement technologies — deep soil mixing (reliable to 25–30m per FHWA guidance), stone columns, rigid inclusions — can improve near-surface bearing capacity and reduce settlement by 60%+ in treated zones (fhwa-deep-mixing-2013). But these methods operate in the top 25–30 meters, which is less than 0.5% of the depth to basement rock. The arcology's load would stress soils to depths far beyond that range. Ground improvement helps the surface problem but does not address the deep consolidation and subsidence problems.

## The Site Is the Problem

Individual foundation elements are mature technology. Bored piles to 150m (now proven at KLCC Lot L&M), large piled rafts to ~9,000 m², high-capacity pile groups of hundreds to a few thousand piles — all proven. Ground improvement for near-surface preparation is well-developed to 25–30m depth. The Jeddah Tower demonstrates that 860,000-tonne total loads are engineerable in difficult ground.

What does not exist:

1. **A load distribution system** for 37.5+ billion tonnes that avoids impossible local bearing pressures. The ziggurat form may help — more mass at lower elevations with wider footprint available — but the engineering system to transfer these loads to Gulf Coastal Plain clay has not been designed or theorized.

2. **A subsidence management strategy** for a structure that would induce geological-scale consolidation on a site already prone to irreversible subsidence. Current technology cannot prevent meters of differential settlement over decades on inelastic compressible clays at this loading. Kansai Airport's 13.66m of cumulative settlement — on a much lighter, flatter structure — illustrates the challenge at a smaller scale.

3. **A geotechnical model** validated at this scale. Characterizing the subsurface across 24.6 km² to the standard required for a safety-critical foundation would be a decade-scale investigation program. The heterogeneity of Gulf Coastal Plain deposits means model uncertainty at this scale would remain enormous even after that investigation.

4. **A path to competent bearing strata.** With basement rock at 6,000+ meters depth, end-bearing piles are not an option. The entire foundation must rely on friction capacity in unconsolidated sediment — a fundamentally different (and weaker) load-transfer mechanism than the rock-socketed piles used at Burj Khalifa or Jeddah Tower.

A different geology would transform this picture. Hard rock, minimal clay, stable groundwater, and accessible bedrock would make foundation systems a significant but solvable engineering challenge. On the Texas Coastal Plain, foundation systems represent a fundamental feasibility barrier — not an engineering challenge waiting for optimization, but an open question about whether this site can physically support this structure. The water systems analysis (environmental-systems/water/closed-loop-water) identifies pumping energy as a major cost of height; here, the cost of height is compounded by the cost of the ground itself. The power budget (energy-systems/grid-architecture/power-budget) must eventually account for whatever active settlement management system the foundation demands — if one can be designed at all. The construction sequence (construction-logistics/construction-sequence/construction-sequence) must account for the foundation as the single longest-lead critical path item.

The single largest lever is site selection. Everything else — pile depth, raft design, ground improvement, structural articulation — is optimization within a problem space that may not contain a feasible solution for this particular patch of Gulf Coastal Plain.
