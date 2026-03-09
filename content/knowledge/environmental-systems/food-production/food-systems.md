---
id: "environmental-systems/food-production/food-systems"
title: "Food Production at Arcology Scale"
domain: "environmental-systems"
subdomain: "food-production"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-25"
updated: "2026-03-08"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["food-production", "vertical-farming", "cellular-agriculture", "aquaponics", "precision-fermentation", "insect-protein", "closed-loop", "caloric-budget", "energy-intensive", "partial-self-sufficiency"]
summary: "Feeding 10 million people requires 20 billion kcal daily — the agricultural output of a small country. Full food self-sufficiency is physically impossible with current technology; staple grain production indoors costs 100x market prices in energy alone. A portfolio approach targeting 30-50% caloric self-sufficiency through vertical farming (leafy greens), cellular agriculture (protein), and precision fermentation is achievable. External agricultural partnerships for bulk calories are structurally necessary, not a design compromise."
citations:
  - id: "asseng-wheat-pnas-2020"
    type: "peer-reviewed"
    title: "Indoor Vertical Farms Could Achieve Wheat Yields of 220-600x Conventional"
    source: "Proceedings of the National Academy of Sciences"
    year: 2020
  - id: "vertical-farming-review-2025"
    type: "peer-reviewed"
    title: "Vertical Farming Productivity, Environmental Impact, and Resource Use"
    source: "Agronomy for Sustainable Development"
    year: 2025
  - id: "cultivated-meat-scaling-2025"
    type: "peer-reviewed"
    title: "Scaling Cultured Meat: Challenges and Solutions"
    source: "Comprehensive Reviews in Food Science and Food Safety"
    year: 2025
  - id: "precision-fermentation-2025"
    type: "peer-reviewed"
    title: "Precision Fermentation for Food Ingredients"
    source: "Current Opinion in Food Science"
    year: 2025
  - id: "insect-protein-food-security-2024"
    type: "peer-reviewed"
    title: "Insect-Based Proteins for Global Food Security"
    source: "Nutrition Reviews"
    year: 2024
  - id: "bustanica-dubai-2024"
    type: "project-data"
    title: "Bustanica: World's Largest Vertical Farm"
    source: "Emirates Flight Catering"
    year: 2024
  - id: "singapore-30by30-2024"
    type: "project-data"
    title: "Singapore 30 by 30: National Food Security Strategy"
    source: "Singapore Food Agency"
    year: 2024
  - id: "biosphere2-lessons-1994"
    type: "project-data"
    title: "Biosphere 2: Food Production in Closed Systems"
    source: "University of Arizona"
    year: 1994
  - id: "mawea-energy-benchmark-2024"
    type: "peer-reviewed"
    title: "Benchmarking Energy Efficiency in Vertical Farming: Status and Prospects"
    source: "Thermal Science and Engineering Progress"
    year: 2024
  - id: "cea-energy-demand-npj-2025"
    type: "peer-reviewed"
    title: "The Emergence of Indoor Agriculture as a Driver of Global Energy Demand"
    source: "npj Sustainable Agriculture"
    year: 2025
  - id: "gourmey-adl-validation-2025"
    type: "industry-report"
    title: "Gourmey Cultivated Meat Cost Benchmark: Arthur D. Little Independent Validation"
    source: "Arthur D. Little / Gourmey"
    year: 2025
  - id: "believer-meats-nature-food-2024"
    type: "peer-reviewed"
    title: "Continuous Manufacturing Process for Cultivated Meat via Tangential Flow Filtration"
    source: "Nature Food"
    year: 2024
  - id: "singapore-food-story2-2025"
    type: "government-report"
    title: "Singapore Food Story 2.0: Revised Food Security Strategy"
    source: "Singapore Food Agency"
    year: 2025
  - id: "plant-physiology-vf-limits-2025"
    type: "peer-reviewed"
    title: "Vertical Farming Limitations and Potential Demonstrated by Back-of-the-Envelope Calculations"
    source: "Plant Physiology (Oxford Academic)"
    year: 2025
cross_references:
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "depends-on"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "depends-on"
  - slug: "environmental-systems/waste/waste-processing"
    relationship: "parallel"
  - slug: "environmental-systems/hvac/atmospheric-control"
    relationship: "parallel"
  - slug: "energy-systems/district-energy/district-thermal"
    relationship: "parallel"
open_questions:
  - "Can cultivated meat achieve taste and texture parity with structured whole-muscle cuts at commodity scale, or will it remain limited to ground, processed, and undifferentiated biomass forms through the 2030s?"
  - "What is the psychological threshold for recycled nutrient acceptance — can digestate from human waste systems feed crops that humans then consume?"
  - "How should food production capacity phase with population during construction — can vertical farms be among the first operational systems?"
  - "What agricultural partnerships in Burleson County could supply staple calories, and what infrastructure connects the Arcology to regional farms?"
  - "At what point does LED photosynthetic efficiency improvement fundamentally change the economics of indoor staple crops — and is that a 10-year or 50-year horizon?"
assumptions:
  - "Target population of 10 million permanent residents"
  - "Per-capita caloric requirement of 2,000 kcal/day"
  - "Total daily caloric demand of 20 billion kcal"
  - "Burleson County, Texas location with access to surrounding agricultural land"
  - "Nuclear SMR baseload provides dedicated energy allocation for food production"
  - "Waste-to-fertilizer loop operational with appropriate pathogen management"
  - "Full food self-sufficiency is not a design goal; partial self-sufficiency (30-50%) is the target"
parameters:
  - name: "population"
    value: 10000000
    unit: "people"
    confidence: 3
  - name: "daily_caloric_requirement_kcal"
    value: 2000
    unit: "kcal/person/day"
    confidence: 2
  - name: "total_daily_kcal"
    value: 20000000000
    unit: "kcal/day"
    confidence: 2
  - name: "leafy_green_yield_kg_m2_year"
    value: 100
    unit: "kg/m²/year (multi-layer vertical)"
    confidence: 2
  - name: "energy_per_kg_lettuce_kwh"
    value: 14
    unit: "kWh/kg (current best practice: 10-18)"
    confidence: 3
  - name: "optimized_energy_per_kg_lettuce_kwh"
    value: 5
    unit: "kWh/kg (technical benchmark: 3.1-7.4)"
    confidence: 2
  - name: "cultivated_meat_achieved_cost_kg"
    value: 7.50
    unit: "$/kg (Gourmey €7/kg, validated 2025)"
    confidence: 3
  - name: "cultivated_meat_target_cost_kg"
    value: 5
    unit: "$/kg (commodity target, projected ~2030)"
    confidence: 2
  - name: "insect_protein_content_pct"
    value: 60
    unit: "percent dry weight (crickets; BSF larvae ~42%)"
    confidence: 2
  - name: "insect_feed_conversion_vs_cattle"
    value: 12
    unit: "x better than cattle"
    confidence: 2
  - name: "water_per_kg_hydroponic_lettuce_liters"
    value: 2
    unit: "liters/kg (range: 1-3)"
    confidence: 2
  - name: "growing_area_hectares_floor_plate"
    value: 7.5
    unit: "hectares (range: 5-10, multi-layer)"
    confidence: 1
  - name: "caloric_self_sufficiency_target_pct"
    value: 40
    unit: "percent (range: 30-50)"
    confidence: 2
  - name: "fresh_produce_self_sufficiency_target_pct"
    value: 90
    unit: "percent"
    confidence: 2
  - name: "food_production_power_mw"
    value: 250
    unit: "MW continuous (range: 150-350)"
    confidence: 2
  - name: "indoor_staple_energy_penalty_vs_field"
    value: 1000
    unit: "x field production energy intensity"
    confidence: 2
---

## The Calorie Problem

Ten million people consuming 2,000 kilocalories per day require 20 billion kcal daily — roughly the agricultural output of a small country. For context, this equals the annual production of 4,000-5,000 square kilometers of conventional farmland, an area larger than Rhode Island. No vertical farming technology comes close to replacing this.

The mismatch is fundamental. Leafy greens and vegetables — the crops vertical farming handles best — contain 10-20 kcal per 100 grams. To feed the Arcology on lettuce alone would require producing 100,000 tons daily, a physical impossibility within any building. Staple calories must come from grains, proteins, and energy-dense foods — precisely the crops where indoor production fails economically.

The honest answer: full food self-sufficiency for 10 million people is not achievable with current technology. What is achievable is substantial partial self-sufficiency — 30-50% of calories from internal production, 80-90% of fresh produce, and near-complete protein independence through a portfolio of emerging technologies.

## Vertical Farming: The Leafy Green Success Story

Vertical farming is a proven commercial technology for leafy greens and herbs. Dubai's Bustanica facility spans 330,000 square feet (approximately 3 hectares), producing over 1 million kilograms of leafy greens annually with 95% less water than conventional farming. Saudi Arabia's largest vertical farm in Riyadh operates 19 layers across 20,000 m² producing 2,200 kg daily. Plenty's Richmond facility targets 1.8 million kg of strawberries per year. 80 Acres Farms operates seven U.S. vertical farms with an estimated combined output of up to 9,000 tonnes per year.

The numbers are real: 10x to 400x yield improvements per unit area, 90-95% water reduction, year-round production independent of weather or season. For crops that the technology suits, vertical farming works.

The energy picture is now better characterized. A 2024 peer-reviewed benchmarking study in *Thermal Science and Engineering Progress* established current specific energy consumption for lettuce at 10-18 kWh/kg, corresponding to an energy use intensity of 850-1,150 kWh/m²/year [mawea-energy-benchmark-2024]. The same study derived a technical energy benchmark of 3.1-7.4 kWh/kg based on theoretical crop energy requirements combined with expected advances in LED efficiency, HVAC optimization, and operational control strategies. At Texas commercial electricity rates (~$0.12/kWh), current systems cost $1.20-2.16 per kilogram in energy alone — acceptable for premium produce, problematic at commodity scale. At the technical benchmark floor of 3.1 kWh/kg, energy cost drops to $0.37/kg.

For the Arcology, dedicating 5-10 hectares of floor plate to multi-layer vertical farming could produce 100,000-150,000 tons of fresh produce annually — enough to supply 80-100% of vegetable consumption for 10 million people. At the optimized benchmark of 5 kWh/kg, that's 500-750 GWh/year, or roughly 60-85 MW continuous. Substantial but manageable within the power budget.

## Staple Crops: The Physics Don't Close

Research published in PNAS by Asseng et al. demonstrated theoretical wheat yields of 700-1,940 tons per hectare per year in a 10-layer vertical facility — 220-600x conventional yields [asseng-wheat-pnas-2020]. Infarm trials achieved 117 tons/ha/year, 26x open-field production.

These numbers are real. They are also economically irrelevant.

A 2025 meta-analysis spanning 116 studies across 40 countries, published in *npj Sustainable Agriculture*, quantified the scale of the problem: energy intensity for indoor staple crop production (soybeans, grains) runs 1,000 to 2,000 times greater than open-field production, even with energy-efficient LED lighting [cea-energy-demand-npj-2025]. The same study found that controlled environment agriculture currently provides less than 1% of U.S. food crops while consuming more energy than all open-field cultivation combined — and scaling it tenfold would consume approximately 7% of national energy use.

The lighting energy cost to grow wheat indoors is roughly 100x the market price of the wheat produced. At $180/ton for commodity wheat and energy requirements approaching 100 kWh/kg, the economics simply don't work. LED efficiency would need to improve 5-10x AND electricity costs would need to drop 5-10x to make indoor grain production competitive. A 2025 analysis in *Plant Physiology* confirmed that even optimistic projections for LED and photosynthetic efficiency gains leave indoor staple production orders of magnitude from viability [plant-physiology-vf-limits-2025].

The break-even electricity price for indoor wheat — roughly $0.002/kWh — is approximately 1/50th of current U.S. wholesale electricity rates. Even with dedicated nuclear SMR capacity at marginal cost, this threshold is not achievable. The Arcology's power budget (9.5 GW total) cannot accommodate indoor grain production at meaningful scale. The physics aren't wrong; the economics are impossible. Staple calories — wheat, rice, corn, and other grains — must come from external agricultural partnerships.

This isn't a failure of vision; it's an honest assessment of thermodynamics. Growing grain indoors fights photosynthesis efficiency limits that sunlight solves for free.

## Cellular Agriculture: Protein Without Animals

Cultivated meat grown from animal cells in bioreactors has progressed from lab curiosity ($437,000/kg in early demonstrations) to commercially validated production. The cost trajectory has accelerated dramatically:

- **Gourmey** (France) achieved €7/kg (~$7.50/kg) for cultivated foie gras using a continuous manufacturing process, independently validated by Arthur D. Little in May 2025 [gourmey-adl-validation-2025]. Their process uses only six 5,000-liter bioreactors per facility, producing 1,700 tonnes annually at under €35M capital expenditure. This represents the lowest third-party-validated production cost in the industry.

- **Believer Meats** demonstrated cultivated chicken at $6.20/lb (~$13.67/kg) in a techno-economic analysis of a hypothetical 50,000-liter production facility, using an animal-component-free culture medium at $0.63/liter [believer-meats-nature-food-2024]. Their North Carolina facility — the world's largest cultivated meat factory — received USDA approval in 2025.

The challenge is scale and form factor. Current commercial bioreactors operate at 1,000-10,000 liter capacity. Feeding 10 million people would require millions of liters of bioreactor volume — a 100-1,000x scale-up from anything currently operating. The unit operations are proven; the industrial multiplication is not.

Market projections show cultivated meat growing from $270 million (2025) to $23 billion (2035) to $229 billion (2050). If these trajectories hold, the Arcology's construction timeline aligns with cultivated meat's transition from novelty to commodity.

Structured whole-muscle cuts remain the major frontier. As of 2025-2026, cultivated meat excels at ground and processed forms and undifferentiated cell biomass (Gourmey's approach). Aleph Farms holds regulatory clearance for whole-cut products but has not entered the market. 3D bioprinting (Steakholder Foods) can control muscle-to-fat ratios in structured formats, but producing and combining muscle, fat, and connective tissue at scale remains costly and technically immature. Full texture parity with conventional steaks is likely a late-2030s achievement. For the Arcology, cultivated meat could provide 10-20% of protein needs initially, scaling as the technology matures.

## Precision Fermentation: Dairy Without Cows

Precision fermentation uses engineered microorganisms to produce animal proteins — casein, whey, albumin — without animals. Perfect Day produces dairy proteins indistinguishable from cow-derived versions. EVERY has demonstrated metric-ton production of fermentation-derived proteins. Standing Ovation validated industrial casein production using cheese whey as feedstock.

With 186 companies active globally and €120 million raised in Europe alone in 2024, precision fermentation is transitioning from research to industry. The proteins produced are identical to their animal counterparts at the molecular level — not analogs or substitutes. Unit costs for precision-fermented dairy molecules are projected to drop to $8-13/kg — the range needed to compete with conventional dairy proteins — with a trajectory from ~$100/kg currently toward below $10/kg by 2030 [precision-fermentation-2025].

For the Arcology, precision fermentation could supply 5-15% of protein needs through dairy alternatives, egg proteins, and specialty ingredients. These aren't staple calories — they're high-value nutritional components that enhance a diverse diet.

## Insect Protein: The Efficient Alternative

Insects convert feed to protein roughly 12x more efficiently than cattle, 4x more efficiently than pigs, and 2x more efficiently than chickens. Cricket protein contains up to 60% protein by dry weight with all essential amino acids; black soldier fly larvae average 42% crude protein with 29% fat content [insect-protein-food-security-2024]. Production generates 80x less methane than cattle per kilogram of protein.

The market is growing: $834 million (2025) projected to reach $4 billion by 2035. Commercial scale is materializing — a major French insect protein facility targets 15,000 tonnes of protein meal per year by end of 2025, and European producers have collectively commercialized over 5,000 tonnes of insect protein since regulatory authorization. Cricket farming operations achieve feed conversion ratios of 2.2 with food-conversion efficiency of 44.4% in optimized conditions.

Insect farming is inherently vertical — stackable, modular units produce protein in minimal floor space. For the Arcology, insect protein could provide 5-15% of total protein needs in a form that integrates seamlessly with the closed-loop waste system. Food waste and organic processing residues become insect feed; insect frass becomes fertilizer for vertical farms.

Consumer acceptance varies by culture. The Arcology's diverse population will include both enthusiastic adopters and those who prefer indirect consumption (insect protein in processed foods rather than whole insects). Both markets can be served.

## Aquaponics: Fish and Plants Together

Aquaponics combines fish cultivation with hydroponic plant growing in a symbiotic loop: fish waste provides nutrients for plants; plants filter water for fish. The system uses 90% less water than conventional agriculture and produces both protein and produce from integrated infrastructure.

The global market is growing at 10.9% annually, reaching $1.28 billion by 2034. Academic research has intensified, with 578 journal publications in the past five years — up from 50 in the preceding decade.

Scale limitations constrain aquaponics' role. The largest commercial systems remain relatively small; no mega-scale facilities exist. For the Arcology, aquaponics could supplement the food system with fresh fish and integrated produce, but cannot serve as a primary protein source for 10 million people. A reasonable allocation: 2-5% of protein needs, with significant fresh produce contribution to the vegetable supply.

## The Portfolio Approach

No single technology feeds 10 million people. The realistic food system combines:

**Internal production (30-50% of calories):**
- Vertical farming: 80-100% of fresh produce (leafy greens, herbs, microgreens, some fruiting vegetables)
- Cellular agriculture: 10-20% of protein (cultivated meat, scaling with technology)
- Precision fermentation: 5-15% of protein (dairy proteins, egg proteins)
- Insect farming: 5-15% of protein (direct consumption and processed ingredients)
- Aquaponics: 2-5% of protein plus produce contribution
- Mushroom cultivation: supplemental production from waste substrates

**External supply (50-70% of calories):**
- Staple grains: wheat, rice, corn from regional agriculture
- Bulk proteins: conventional meat, dairy, eggs during transition period
- Cooking oils, sweeteners, and processed ingredients

This isn't a compromise; it's an honest assessment. The precedent is instructive: Singapore — with strong government support, existential food security motivation, and substantial investment — abandoned its "30 by 30" target (30% domestic production by 2030) in November 2025, replacing it with a more modest Food Story 2.0 strategy targeting 20% of fiber and 30% of protein from domestic sources by 2035 [singapore-food-story2-2025]. As of 2025, Singapore's food self-production remained below 10% overall, with only eggs (>30%) and beansprouts (>50%) meeting meaningful domestic supply thresholds. If a wealthy, motivated city-state of 6 million struggles at these levels, the Arcology's 10 million faces harder constraints at higher density.

## Energy Budget for Food

Food production competes for power within the Arcology's 9.5 GW total generation and 3.325 GW non-compute allocation. The energy demand is substantial but bounded:

**Vertical farming (fresh produce):**
- At 5 kWh/kg optimized and 150,000 tons/year: ~85 MW continuous
- At current 14 kWh/kg: ~240 MW continuous

**Cellular agriculture and precision fermentation:**
- Bioreactor heating, mixing, sterilization: 20-50 MW continuous (estimate)

**Climate control for growing zones:**
- Temperature, humidity, CO2 management: 30-60 MW continuous

**Total food production energy:** 150-350 MW continuous, or roughly 3.6-8.4 GWh/day.

This represents 5-10% of non-compute power allocation — significant but manageable if dedicated capacity is planned from the outset. The nuclear SMR baseload provides the consistent power supply that indoor agriculture requires. For comparison, the npj Sustainable Agriculture meta-analysis found that commercial CEA already consumes more total energy than all U.S. open-field agriculture despite producing less than 1% of food crops [cea-energy-demand-npj-2025] — a reminder that energy efficiency is the central design constraint for indoor food production at any scale.

## Water and Nutrient Integration

Hydroponic systems consume 1-3 liters per kilogram of produce — 90-95% less than field agriculture. At 150,000 tons/year of vertical farm production, water demand is roughly 150-450 million liters annually, or 400,000-1.2 million liters daily.

This is a fraction of the Arcology's total 2 billion liter daily water budget. The food system's water consumption, while substantial in absolute terms, is manageable within the closed-loop water infrastructure.

The nutrient loop is more complex. Growing plants requires nitrogen, phosphorus, and potassium — traditionally supplied by synthetic fertilizers. The Arcology's closed-loop ambition suggests recycling these nutrients from waste streams.

Anaerobic digestion of organic waste produces digestate rich in plant nutrients. Human waste processing yields biosolids with similar composition. In principle, the waste-to-fertilizer loop closes the nutrient cycle. In practice, heavy metals, pharmaceuticals, and pathogen management create technical and psychological barriers.

The technical challenges are solvable: heavy metals can be monitored and removed; pathogens can be eliminated through proper processing; pharmaceutical residues can be managed through advanced treatment. The psychological challenge — will 10 million people eat food grown from processed human waste? — is harder to predict. Transparency about processes, demonstrable safety, and gradual normalization may make this acceptable. Or cultural resistance may require maintaining some synthetic nutrient inputs.

## Growing Zone Integration

Growing zones must integrate with the Arcology's broader environmental systems:

**Climate control:** Plants require 18-25°C temperature, 60-80% relative humidity, and elevated CO2 (800-1200 ppm). These requirements may conflict with adjacent residential zones, requiring dedicated atmospheric management for growing areas.

**Heat capture:** LED lighting in vertical farms generates significant waste heat. Proper integration with the district thermal system converts this from problem to resource — growing zone waste heat supplements building heating in cooler months.

**CO2 routing:** Human-occupied zones exhale CO2; growing zones absorb it. Routing atmospheric flows from residential to agricultural areas creates a beneficial loop that reduces both CO2 removal requirements and CO2 enrichment costs.

The HVAC integration isn't optional — it's a key efficiency gain. Growing zones positioned to receive residential atmospheric exhaust reduce the building's overall CO2 management burden while accelerating plant growth.

## Food Safety at Scale

Centralized food production for 10 million people creates catastrophic risk from contamination events. A single pathogen outbreak could affect millions before detection. No precedent exists for managing food safety at this scale from a single production system.

The architecture must build in redundancy:

**Zone isolation:** Multiple independent growing zones, each capable of quarantine without affecting others. A contamination event shuts down one zone, not all production.

**Rapid detection:** AI-monitored pathogen detection at every stage of production. Lab-on-chip sensors can identify contamination in minutes rather than days.

**Traceability:** Complete tracking from seed to consumption. If contamination is detected, affected batches can be identified and recalled within hours.

**Distributed processing:** Food processing distributed across multiple facilities reduces single-point-of-failure risk.

The system must be designed to fail gracefully. A contamination event is a matter of when, not if. The question is whether it affects hundreds, thousands, or millions.

## Precedents and Their Limits

**Bustanica (Dubai):** The world's largest vertical farm at 3 hectares produces food for 20,000-40,000 people — 0.4% of the Arcology's population. Demonstrates operational viability for leafy greens in hostile climates. The scale gap: 250x.

**Singapore Food Story 2.0:** A wealthy nation with existential food security motivation abandoned its 30% domestic production target by 2030 after self-production remained below 10% despite years of intensive investment. The revised 2035 targets (20% fiber, 30% protein) acknowledge structural constraints — tight labor, price competition from imports, and limited land [singapore-food-story2-2025]. If Singapore struggles at 6 million people, the Arcology's 10 million is harder.

**Biosphere 2:** Eight crew members for two years in a sealed 3.14-acre enclosure. Agriculture occupied 0.5 acres. Result: chronic hunger and calorie deficit despite meticulous planning. The lesson: closed-system food production at full caloric sufficiency is extraordinarily difficult.

**NASA Bioregenerative Life Support:** Decades of research with essentially unlimited funding produces supplemental fresh food on ISS. Full caloric closure remains a research goal, not operational reality.

**NSF South Pole Station:** Fresh produce for 150 people in a sealed hostile environment. The closest terrestrial analog to Arcology conditions. The scale gap to 10 million: 66,000x.

**Gourmey (France):** First cultivated meat company to achieve independently validated production costs below €10/kg, with a facility architecture (six 5,000L bioreactors, 1,700 tonnes/year) that demonstrates a scalable unit economics template for the Arcology's protein production [gourmey-adl-validation-2025].

Every precedent points the same direction: partial self-sufficiency is achievable; total self-sufficiency is not.

## The Hardest Question

The hardest problem isn't technological — it's thermodynamic. Sunlight is free. LED lighting costs money and consumes power. Every calorie grown indoors competes with the energy budget for everything else the Arcology does.

The 2025 meta-analysis in npj Sustainable Agriculture put numbers to this: indoor staple crop energy intensity runs 1,000-2,000x field production even with optimized LEDs [cea-energy-demand-npj-2025]. The break-even electricity price for indoor wheat — approximately $0.002/kWh — is roughly 1/50th of current U.S. wholesale electricity rates. Even massive nuclear overcapacity dedicated solely to food cannot reach this threshold. Whether future breakthroughs in LED photosynthetic efficiency or direct photon-to-calorie conversion could fundamentally change this equation is an open question on a multi-decade horizon.

The second hardest problem is trust. Can 10 million people accept food grown from recycled nutrients, protein cultured in bioreactors, and insects ground into flour? Technology can produce these foods safely and nutritiously. Whether culture accepts them determines the practical ceiling on internal food production.

The realistic path: build the infrastructure for 30-50% caloric self-sufficiency, focus on fresh produce where vertical farming excels, develop protein alternatives as technology matures, and maintain robust external agricultural partnerships for everything else. Design for scaling up if economics improve; don't promise self-sufficiency the physics can't deliver.
