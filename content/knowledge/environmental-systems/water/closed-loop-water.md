---
id: "environmental-systems/water/closed-loop-water"
title: "Closed-Loop Water Systems"
domain: "environmental-systems"
subdomain: "water"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-16"
updated: "2026-03-09"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["water", "closed-loop", "recycling", "treatment", "pumping", "gray-water", "black-water", "elevation", "mbr", "direct-potable-reuse", "energy-recovery"]
summary: "Water management for 10 million residents targeting near-zero discharge. Per-capita consumption targets grounded in international benchmarks, gray/black water separation, recycling rates validated against ISS, Singapore NEWater, and Orange County GWRS precedents. Pumping energy analysis incorporating real-world system efficiency data from supertall buildings. Treatment energy validated against peer-reviewed facility-level data. Cross-references to energy (pumping power), structural (weight of water storage), HVAC (cooling water demand), and waste processing (biogas recovery)."
citations:
  - id: "nasa-eclss-2024"
    type: "project-data"
    title: "Environmental Control and Life Support System: ISS Water Recovery"
    source: "NASA"
    year: 2024
  - id: "singapore-newater-2023"
    type: "project-data"
    title: "NEWater: Singapore's Closed-Loop Water Reclamation"
    source: "PUB Singapore"
    year: 2023
  - id: "arcology-manifesto-2026"
    type: "internal"
    title: "All Boats Rise with the Tide: A Manifesto for Building the Future Together"
    source: "Life with AI"
    year: 2026
  - id: "nasa-eclss-98pct-2023"
    type: "project-data"
    title: "NASA Achieves Water Recovery Milestone on International Space Station"
    source: "NASA"
    year: 2023
    url: "https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/"
  - id: "ocwd-gwrs-2023"
    type: "project-data"
    title: "Orange County Water District Groundwater Replenishment System Final Expansion"
    source: "California State Water Resources Control Board"
    year: 2023
    url: "https://www.waterboards.ca.gov/press_room/press_releases/2023/pr20230414-orange-county-replenishment.html"
  - id: "rodriguez-garcia-2021"
    type: "peer-reviewed"
    title: "Modeling the energy consumption of potable water reuse schemes"
    source: "Resources, Conservation and Recycling Advances"
    year: 2021
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8640112/"
  - id: "wong-pump-efficiency-2014"
    type: "peer-reviewed"
    title: "Pump Efficiency of Water Supply Systems in Buildings of Hong Kong"
    source: "Energy Procedia, Vol. 61, pp. 335-338"
    year: 2014
    url: "https://core.ac.uk/display/202476698"
  - id: "du-pat-recovery-2017"
    type: "peer-reviewed"
    title: "Micro hydro power generation from water supply system in high rise buildings using pump as turbines"
    source: "Energy (Elsevier), Vol. 137, pp. 431-440"
    year: 2017
    url: "https://www.sciencedirect.com/science/article/abs/pii/S036054421730381X"
  - id: "strass-energy-positive-2005"
    type: "project-data"
    title: "Strass im Zillertal WWTP: Net Energy Producer"
    source: "Blower & Vacuum Best Practices / IWA Publishing"
    year: 2005
    url: "https://www.blowervacuumbestpractices.com/industries/wastewater/wastewater-best-practices-austrian-wastewater-plant-net-producer-energy"
  - id: "nfpa-820-ventilation"
    type: "standard"
    title: "NFPA 820: Standard for Fire Protection in Wastewater Treatment and Collection Facilities"
    source: "National Fire Protection Association"
    year: 2020
  - id: "changi-newater-energy-2020"
    type: "peer-reviewed"
    title: "Long-term performance and economic evaluation of full-scale MF and RO process: Changi NEWater Project Phase 2"
    source: "Water Cycle (ScienceDirect)"
    year: 2020
    url: "https://www.sciencedirect.com/article/pii/S2666445320300155"
cross_references:
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "depends-on"
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "urban-design-livability/residential/space-allocation"
    relationship: "informs"
  - slug: "environmental-systems/hvac/atmospheric-control"
    relationship: "informs"
  - slug: "environmental-systems/waste/waste-processing"
    relationship: "informs"
  - slug: "mechanical-electrical/plumbing/plumbing-distribution"
    relationship: "informs"
open_questions:
  - "What is the optimal number and vertical spacing of intermediate treatment/storage floors to minimize total system energy (pumping + treatment + redundancy overhead)?"
  - "Can anaerobic MBR technology scale to full municipal capacity for enclosed building applications, given the dissolved methane off-gassing hazard in indoor plumbing?"
  - "What is the appropriate water storage reserve duration for an autonomous enclosed structure in a semi-arid climate — and what regulatory framework should govern it?"
assumptions:
  - "Target population of 10 million residents"
  - "Per-capita water consumption of 200 liters/day (validated against Germany 124 L/day, Singapore 141 L/day, US indoor-only 197 L/day — achievable with efficient fixtures and behavioral design)"
  - "95% water recycling target (ISS achieves 98% at micro-scale; Singapore NEWater + OCWD demonstrate the treatment technology at urban scale)"
  - "Structure height requires pumping against significant head pressure through 25-38 pressure zones"
  - "Burleson County, Texas location — semi-arid climate, limited natural water supply"
  - "Near-zero discharge policy: minimal water leaves the structure as waste"
  - "Real-world pumping system efficiency of 50-65% (field data from supertall buildings shows 25% baseline; optimized design targets 50-65%)"
parameters:
  - name: "population"
    value: 10000000
    unit: "people"
    confidence: 2
  - name: "per_capita_water_liters_day"
    value: 200
    unit: "liters/day"
    confidence: 3
  - name: "total_daily_water_ML"
    value: 2000
    unit: "megalitres/day"
    confidence: 2
  - name: "recycling_target_pct"
    value: 95
    unit: "percent"
    confidence: 2
  - name: "pumping_power_mw"
    value: 250
    unit: "MW (estimate range: 200-350)"
    confidence: 2
  - name: "water_storage_reserve_days"
    value: 7
    unit: "days"
    confidence: 2
  - name: "treatment_energy_kwh_per_m3"
    value: 1.0
    unit: "kWh/m3 (weighted gray/black blend)"
    confidence: 2
  - name: "gray_water_fraction_pct"
    value: 65
    unit: "percent of total wastewater"
    confidence: 2
  - name: "pressure_zones"
    value: 30
    unit: "zones (range: 25-38)"
    confidence: 2
  - name: "fresh_water_intake_ML_day"
    value: 100
    unit: "megalitres/day (5% makeup)"
    confidence: 2
  - name: "biogas_energy_recovery_mw"
    value: 15
    unit: "MW electrical (from wastewater biogas)"
    confidence: 1
---

## The Water Budget

Ten million people consuming 200 liters per day each require 2,000 megalitres (2 billion liters) of water daily. For comparison, New York City consumes approximately 3,800 megalitres per day for 8.3 million people — about 460 liters per capita. The arcology's 200 L/day target is aggressive but well-grounded in international precedent: Germany averages 124 L/day per capita, Singapore achieves 141 L/day, and the US indoor-only average (excluding outdoor irrigation) is approximately 197 L/day [rodriguez-garcia-2021]. The arcology's 200 L/day target sits between these benchmarks — achievable through high-efficiency fixtures, closed-loop gray water recycling, and the absence of outdoor irrigation or private landscaping.

Germany achieves its low per-capita consumption through volumetric metering, rising-block tariffs, and EU Ecodesign regulations mandating efficient appliances — without greywater recycling. Singapore gets to 141 L/day through mandatory water efficiency labeling, rising-block tariffs, and predominantly high-rise living without private gardens. The arcology combines both approaches: structural enforcement of efficiency (no gardens, no outdoor use, efficient fixtures throughout) plus greywater capture that Singapore does not yet deploy at building scale.

At 95% recycling, the daily fresh water intake requirement drops to 100 megalitres — 5% makeup water to replace losses from evaporation, biological processes, and the small fraction of wastewater too contaminated for economical recovery. This is roughly the output of a mid-sized municipal water treatment plant, a manageable external dependency for a structure that otherwise operates as a closed system.

## Separation Strategy: Gray and Black

The water system separates flows into two streams from the point of use:

**Gray water** includes sink drainage, shower water, laundry effluent, and condensate from HVAC systems. This water is lightly contaminated — soap, skin cells, food particles, detergents — and can be treated to potable standard with relatively simple processes. Gray water constitutes approximately 60-70% of total residential wastewater volume.

**Black water** includes toilet waste, kitchen disposal waste, and medical facility effluent. This water carries biological pathogens, pharmaceuticals, and higher organic loads. Treatment is more energy-intensive and requires more sophisticated processes.

The separation matters because mixing gray and black water (as conventional plumbing does) contaminates the entire volume to the higher treatment standard. By keeping them separate from the fixture to the treatment plant, the system treats 60-70% of its water at lower energy cost and reserves the intensive processes for the 30-40% that requires them.

This requires dual plumbing throughout the structure — a significant infrastructure cost, but one that pays back continuously through reduced treatment energy over the structure's lifetime. Salesforce Tower in San Francisco provides a contemporary precedent: its Epic OneWater system processes 113.5 m3/day of blackwater, rainwater, and HVAC condensate through an onsite MBR system, recovering up to 95% for non-potable reuse. It is currently the largest onsite blackwater system in a US commercial high-rise [ocwd-gwrs-2023].

## The Treatment Chain

Water treatment in the arcology follows a multi-stage cascade, with energy costs validated against the Orange County Groundwater Replenishment System (GWRS) — the world's largest advanced water purification facility for indirect potable reuse at 492 ML/day [ocwd-gwrs-2023] — and the peer-reviewed process energy model by Rodriguez-Garcia et al. [rodriguez-garcia-2021]:

**Stage 1 — Physical separation.** Screens, settling tanks, and membrane filtration (microfiltration or ultrafiltration) remove particulates. MF energy: approximately 0.18 kWh/m3; UF energy: approximately 0.20 kWh/m3 [rodriguez-garcia-2021]. Well-proven at municipal scale.

**Stage 2 — Biological treatment.** Membrane bioreactor (MBR) technology combines biological treatment with ultrafiltration in a single compact process. MBR pore size of 0.04 micrometers physically excludes bacteria and most pathogens from the permeate. At scale, optimized MBR plants achieve 0.4-0.5 kWh/m3; the Nordkanal plant in Germany (45,000 m3/day) achieved 0.65 kWh/m3 after optimization from an initial 0.93 kWh/m3 [rodriguez-garcia-2021]. MBR technology is specifically suited to enclosed building environments: external tubular modules are closed systems with no odor release or operator exposure to wastewater, and they produce 50-80% less sludge than conventional activated sludge processes.

In an enclosed structure, biological treatment gas management must comply with NFPA 820, which requires minimum 6 air changes per hour (ACH) continuous ventilation to reduce hazard classification, with 12 ACH for further classification reduction. Supply and exhaust must be on opposite walls, with exhaust pickups within 12 inches of the floor (for H2S, which is heavier than air). All electrical equipment in classified zones must be explosion-proof per NFPA 70 Section 500.7 [nfpa-820-ventilation]. Aerobic MBR is strongly preferred over anaerobic treatment in sealed environments — maritime engineering experience consistently favors aerobic systems because anaerobic bacteria generate H2S and methane, both toxic and explosive in enclosed spaces.

**Stage 3 — Advanced oxidation and disinfection.** UV treatment combined with hydrogen peroxide (UV/H2O2) destroys remaining pathogens and trace pharmaceuticals. Energy cost: 0.07-0.15 kWh/m3 [rodriguez-garcia-2021]. The OCWD GWRS uses this as its final barrier.

**Stage 4 — Reverse osmosis (for black water stream).** The black water stream passes through RO membranes to remove dissolved solids, salts, and residual contaminants. For municipal wastewater (TDS 500-1,000 mg/L, far lower osmotic pressure than seawater at 35,000 mg/L), RO energy is approximately 0.54-0.60 kWh/m3 — roughly one-sixth the energy of seawater desalination [rodriguez-garcia-2021]. The OCWD GWRS achieves 0.92 kWh/m3 total across its full MF+RO+UV/H2O2 train.

**Stage 5 — Remineralization and blending.** Treated water is remineralized to appropriate hardness and pH, then blended with the gray water stream for distribution. The blended product meets or exceeds EPA drinking water standards.

Total treatment energy for the blended system: approximately 0.8-1.2 kWh/m3 weighted average, depending on the gray/black ratio. The gray water stream (65% of volume) requires only MF + MBR + UV at approximately 0.5-0.7 kWh/m3. The black water stream (35% of volume) requires the full MF + MBR + RO + UV/H2O2 train at approximately 0.9-1.5 kWh/m3. Weighted across both streams, the treatment energy demand is approximately 1.0 kWh/m3. At 2,000 ML/day (2 million m3/day), treatment requires approximately 2 GWh/day, or roughly 83 MW continuous.

## Pumping Energy at Elevation

This is where the physics gets uncomfortable — and where real-world data diverges sharply from textbook calculations.

Water weighs 1 kg per liter. The theoretical minimum energy to lift 1 m3 of water by 1 meter is 9.81 kJ (0.00272 kWh). This is exact physics, not an estimate. At the arcology's peak height of approximately 1,524 meters, assuming the average delivery point is at tier 5 (roughly 750 meters), the theoretical minimum pumping energy is:

- 750m x 0.00272 kWh/m3/m = 2.04 kWh/m3 (theoretical ideal, 100% efficiency)

Real pump efficiency is where textbook and field measurements diverge. Pump manufacturers specify 70-85% efficiency at the best efficiency point (BEP). But field measurements from high-rise buildings tell a different story. Wong et al. (2014) measured 20 buildings in Hong Kong and found overall system efficiency below 25% — more than 75% of input energy was lost to pumps operating off-BEP, pipe friction, pressure reducing valve (PRV) throttling, and system mismatches [wong-pump-efficiency-2014]. Roughly half the losses were attributable to pumps themselves (oversized, cycling, aging) and half to the distribution system.

For comparison, the A.D. Edmonston Pumping Plant in California — the world's highest single pump lift for water supply at 587m — achieves approximately 86% pump-and-motor efficiency with its 14 units rated at 60 MW each. But Edmonston runs continuously at a single consistent operating point with massive industrial equipment. Residential and mixed-use buildings cycle on and off at highly variable demand, which is why their efficiency plummets.

For arcology design, a well-engineered system with variable speed drives (VSDs), optimized intermediate tank placement, and pumps sized to actual demand profiles should target 50-65% combined system efficiency — far better than the Hong Kong baseline but realistic about the gap between nameplate and field performance. VSDs alone provide a consistent 30% energy reduction versus fixed-speed systems, as demonstrated at the Burj Khalifa's water system [wong-pump-efficiency-2014].

At 55% system efficiency and 750m average lift:

- 750m x 0.00272 / 0.55 = 3.71 kWh/m3 to the average floor

At 2 million m3/day, this implies roughly 7.4 GWh/day, or approximately 310 MW continuous — just for vertical pumping. However, the hybrid distributed treatment strategy (see below) reduces the volume that must be pumped the full height. With distributed gray water treatment, only the black water concentrate (35% of volume) and makeup water traverse the full vertical distance. Adjusting for this:

- Full-height pumping: ~700,000 m3/day at 3.71 kWh/m3 = 2.6 GWh/day (108 MW)
- Tier-local gray water circulation: ~1,300,000 m3/day at ~0.5 kWh/m3 = 0.65 GWh/day (27 MW)
- Horizontal distribution and losses: ~50-80 MW
- **Total pumping estimate: 200-350 MW, central estimate 250 MW**

This is a significant fraction of the arcology's non-compute power budget (3.325 GW). Water pumping could consume 6-10% of non-compute power.

## Pressure Zones and Cascade Architecture

The arcology cannot pump water directly from grade to 1,524 meters. A single pump delivering water to the top would require approximately 149 bar delivery pressure — far beyond standard centrifugal pump casing ratings. More critically, PRV throttling at lower floors would destroy the energy invested: a ground-floor PRV would waste ~95% of the energy put into lifting water intended for upper floors.

Standard plumbing codes limit fixture pressure to 80 psi (5.5 bar) maximum with a 40 psi minimum, creating a maximum vertical span of approximately 21 meters per pressure zone. At 1,524 meters total height, this requires 25-38 pressure zones — each served by intermediate mechanical floors with gravity distribution tanks and booster pump stations.

This cascade architecture is industry-standard in supertall buildings. The Burj Khalifa (828m) uses 6 transfer sets plus 7 pressure booster sets with gravity tanks at intermediate mechanical floors. The Shanghai Tower (632m) uses a similar cascading system with greywater treatment at multiple levels, achieving a 38% reduction in imported water.

A significant but underexplored opportunity exists at pressure zone boundaries: pump-as-turbine (PAT) energy recovery. Du et al. (2017) measured that 494 kWh/day was wasted through PRVs in a single studied building, and PAT installation recovered 182 kWh/day — a 37% recovery rate [du-pat-recovery-2017]. Across 25-38 pressure zone boundaries in the arcology, with far larger flow volumes, PAT recovery could offset 10-20 MW of the total pumping energy.

## Distributed vs. Centralized Treatment

The pumping energy calculation creates a design tension:

**Centralized treatment** (in subterranean levels) offers economies of scale, easier maintenance, and simpler process control. But it requires pumping treated water to the highest tiers — a continuous energy penalty.

**Distributed treatment** (treatment plants on each tier or every 2-3 tiers) reduces vertical pumping by treating gray water locally. But it requires 10-30 smaller treatment plants instead of 1-2 large ones, with correspondingly more complex maintenance, more points of failure, and more floor area consumed.

The likely solution is a hybrid. Heavy treatment (RO, advanced oxidation) is centralized in the subterranean levels where space and structural capacity are abundant. Light treatment (gray water MBR filtration and disinfection) is distributed at the tier level, with compact MBR units on each tier processing the 65% gray water fraction locally. Only the relatively small volume of black water concentrate is pumped vertically.

This approach is validated by building-scale precedent. The Salesforce Tower in San Francisco operates a 113.5 m3/day onsite MBR system processing blackwater, rainwater, and HVAC condensate — achieving 95% recovery for non-potable reuse. Singapore's Changi Water Reclamation Plant demonstrates enclosed treatment at 800,000 m3/day capacity on a 32-hectare covered site with integrated odor control — the closest operational analogue to arcology-scale enclosed treatment.

The critical constraint for distributed biological treatment is NFPA 820 compliance. Each tier-level treatment plant requires 6-12 ACH continuous ventilation with 100% outside supply air (no recirculation), exhaust pickups at both high and low positions, 0.1 inches water column differential pressure relative to adjacent spaces, and explosion-proof electrical equipment in classified zones [nfpa-820-ventilation]. These requirements add HVAC load and floor area at each treatment location — costs that must be weighed against the pumping energy savings.

## Comparison to Existing Closed-Loop Systems

**ISS Environmental Control and Life Support System (ECLSS):** Achieves 98% water recovery as of 2023, up from the earlier 90-93% baseline, following the commissioning of the Brine Processor Assembly (BPA) in 2021. The BPA uses specialized membrane technology with warm dry air circulation to extract water from urine processor brine [nasa-eclss-98pct-2023]. The system processes approximately 9 kg/day of urine wastewater for 6 crew members using entirely physicochemical treatment (distillation, catalytic oxidation, ion exchange, filtration) — no biological processes. Energy cost is 90-160 Wh per kg of recovered water (0.09-0.16 kWh/liter), roughly 100-170x more energy-intensive per liter than terrestrial treatment. The ISS proves that 95%+ recovery is physically achievable but at an energy cost that cannot scale terrestrially.

**Orange County GWRS:** The world's largest advanced water purification system for indirect potable reuse, expanded to 492 ML/day (130 MGD) capacity in April 2023 [ocwd-gwrs-2023]. The system processes 100% of the Orange County Sanitation District's reclaimable flows through microfiltration, reverse osmosis, and UV/H2O2 advanced oxidation at a total energy cost of 0.92 kWh/m3 [rodriguez-garcia-2021]. Treated water percolates into the groundwater basin for indirect potable reuse. At approximately one-quarter the arcology's daily volume, the GWRS is the most relevant large-scale precedent for treatment technology and energy cost.

**Singapore NEWater:** Five operational factories processing approximately 760 ML/day, supplying roughly 40% of Singapore's total water demand (with a 2060 target of 55%). The Changi NEWater Phase 2 facility achieves 0.6-0.8 kWh/m3 total energy cost, with RO accounting for 43% of energy consumption [changi-newater-energy-2020]. The Tuas Water Reclamation Plant, under construction with 800 ML/day capacity, will be the world's largest MBR facility. Singapore's system is not fully closed-loop — it supplements rather than replaces conventional supply — but it demonstrates the treatment technology at a scale comparable to the arcology's requirements.

**Windhoek, Namibia (Goreangab):** The world's oldest direct potable reuse system, operating continuously since 1968. The New Goreangab Reclamation Plant (2002) processes 21 ML/day, supplying approximately 35% of Windhoek's drinking water. Critically, it uses no reverse osmosis — relying instead on ozonation and biological activated carbon filtration. This demonstrates that non-RO pathways to direct potable reuse exist and have been proven over decades, though they are source-water-quality-dependent [rodriguez-garcia-2021].

**Submarine systems:** Nuclear submarines operate closed-loop water systems for crews of 100-150, but they do not use biological treatment. Waste goes into pressurized sanitary tanks and is discharged overboard. Fresh water is produced from seawater via RO; wastewater is not recycled. The arcology cannot use external discharge — it must accomplish what submarines avoid.

The scale gap between any existing closed-loop system and the arcology's 2,000 ML/day requirement is real but narrowing. The GWRS at 492 ML/day and Singapore NEWater at 760 ML/day demonstrate the treatment technology at roughly one-quarter to one-half the required scale. The arcology's requirement is approximately 2.5x Singapore's current NEWater capacity — ambitious, but within the range of purpose-built infrastructure.

## Biogas Energy Recovery

Wastewater treatment produces biogas through anaerobic digestion of sewage sludge — a potential energy offset. The Strass im Zillertal WWTP in Austria achieved 108% energy self-sufficiency in 2005, producing 8,490 kWh/day of biogas electricity against a plant consumption of 7,860 kWh/day. With food waste co-digestion, self-sufficiency increased to approximately 180% [strass-energy-positive-2005]. The plant uses a two-stage A/B process that maximizes organic capture for digestion, with 38% electrical efficiency in its co-generation engine.

At arcology scale, the energy recovery potential depends on organic loading. Using the Strass benchmark of approximately 0.22 kWh of electricity per m3 of wastewater treated, with 2 million m3/day throughput and co-digestion of food waste from the arcology's food production systems, biogas energy recovery could reach 10-20 MW of continuous electrical output. DC Water's Blue Plains facility in Washington, D.C. provides a larger-scale reference: its Cambi thermal hydrolysis system generates 10-14 MW from biogas, covering approximately 30% of plant power demand.

This recovery would offset roughly 10-20% of the treatment plant's own energy consumption. Against the arcology's total power budget, it is less than 0.5% — useful for plant self-sufficiency but not a significant contributor to the overall energy balance. The greater value may be in the thermal energy: combined heat and power (CHP) systems capture waste heat from biogas combustion for district heating applications, linking the water system to the thermal cascade analyzed in the district energy entry.

## Water Storage and Emergency Reserve

Seven days of storage reserve at 2,000 ML/day requires 14,000 ML (14 billion liters) of stored water. Water weighs 1 kg per liter, so this reserve weighs 14 million metric tons — approximately the weight of 70 large aircraft carriers, distributed across storage tanks throughout the structure.

The increase from 3 days to 7 days reflects the arcology's unique vulnerability profile. No US or international building code mandates a potable water storage duration for autonomous enclosed structures — the closest precedents are hospital codes (8 hours for roof tank reserves), US military planning benchmarks (72 hours for base self-sufficiency), and critical infrastructure resilience frameworks [nfpa-820-ventilation]. The arcology cannot call the municipal water department during a supply disruption. In the semi-arid climate of central Texas, drought conditions could extend the self-sufficiency requirement to weeks, making the 95% recycling rate not just an efficiency target but a survival parameter.

The weight of water storage is a non-trivial structural consideration. Placing large reserves on upper tiers increases the structural load at elevation, where the structure is already most stressed. Mui et al. (2012) demonstrated that optimizing tank placement in Hong Kong high-rises improved pumping system efficiency from 25% to 26-37% and saved 160-410 TJ of annual electricity across the studied buildings [wong-pump-efficiency-2014]. The arcology's likely approach is distributed storage — smaller tanks on each tier (serving as both operational buffer and local emergency reserve) with a larger strategic reserve in the subterranean levels, gravity-fed upward only during emergency pump failures.

The seven-day reserve, combined with 95% recycling, provides effective self-sufficiency of approximately 140 days before depletion — assuming recycling systems remain operational. The true emergency scenario is simultaneous external supply disruption and partial recycling system failure, which drives the reserve sizing toward the higher end of the range.
