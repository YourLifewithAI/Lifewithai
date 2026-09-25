# Arcology research evaluation
Reviewed September 25, 2026

Repository: [YourLifewithAI/Lifewithai](https://github.com/YourLifewithAI/Lifewithai)
Snapshot: `ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c`

**Requirements clarification:** The author subsequently confirmed the intended target is **100 million humans, 100 million paired AI, plus additional logistical and independent AI**, with **at least 750 sqft of private dwelling space per human** (3,000 sqft for a family of four). The findings below audit the repository's existing 10-million-human assumptions; those are legacy assumptions, not the intended target. See `arcology-construction-and-sections.md` for the revised concept study and `arcology-scale-model.py` for reproducible scenario arithmetic.

## Assessment and scope

The repository is accessible. Its Arcology knowledge base is a useful research agenda and speculative design resource, but it does not yet establish engineering or financial feasibility. The principal weakness is that independently written chapters use incompatible numerical baselines. Several explicit calculations contain large unit errors.

I inventoried all 32 research entries across eight domains, screened their metadata and scope, and examined selected passages in the geometry, structures, construction, energy, compute, environmental, transport, safety, and economics material. I independently recalculated the findings below and spot-checked external sources. This is a targeted consistency and evidence review, not exhaustive verification of every statement or reference. The repository was not changed.

The strongest qualities are broad systems coverage, explicit assumptions and open questions, and attention to genuine integration problems: pressure zoning, compartmentation, maintenance, phased occupancy, cooling, governance, and external food supply. Those are valuable foundations for further work. However, phrases such as “validated,” “confirmed,” and “definitively answered” sometimes exceed the evidence presented.

## Findings requiring correction

### 1. Foundation load: a factor-of-1,000 error in the stated derivation

The foundation assumptions derive 37.5 billion tonnes from 46 million m² at 8 kN/m².

Calculation:
- 46 million m² × 8 kN/m² = 368 million kN.
- Dividing by 9.80665 kN per metric tonne gives approximately **37.5 million tonnes**, not billion.

This is a dimensional conversion error, independent of whether the loading assumption is appropriate. Furthermore, 46 million m² is inconsistent with the geometry chapter's approximately 5.184 billion m² of usable floor area. Correcting the conversion alone does not produce a usable foundation design: the floor areas and loads must first be reconciled, then structural and foundation mass included consistently.

The subsequent pile, bearing, and settlement arguments cannot be accepted quantitatively until that is done. Source: [foundation-systems.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/foundation-systems/foundation-systems.md#L117).

### 2. HVAC: a factor-of-100 multiplication error

The HVAC chapter applies 150 W/m² to 1.5–2 billion m² and reports 2.25–3 GW. The product is **225–300 GW**.

That does not prove the Arcology actually needs 225–300 GW of cooling. It proves that the cited calculation does not validate its 3–5 GW estimate. Conditioned area, diversity, envelope gains, ventilation, internal loads, and heat recovery need an explicit model; benchmarks must not be combined with separate internal loads if that double-counts them.

Other chapters use different areas and cooling requirements: district thermal uses 400–500 million m² and 8–12 GW, while geometry implies roughly 5.184 billion m² usable. Sources: [atmospheric-control.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/environmental-systems/hvac/atmospheric-control.md#L289), [district-thermal.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/energy-systems/district-energy/district-thermal.md), [primary-geometry.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/superstructure/primary-geometry.md).

### 3. Electrical demand is not reconciled with the generation plan

The power budget assigns 6.175 GW of its 9.5 GW total to compute, leaving 3.325 GW for everything else. The electrical-distribution load table separately lists **7.45–11.2 GW of average loads without an explicit compute row**, then says its approximately 9.5 GW total agrees with the overall budget.

The tables need a shared accounting boundary, including IT power versus facility power and thermal versus electrical demand.

The generation portfolio also adds solar average output, nuclear nameplate output, grid imports, and speculative fusion as if they were interchangeable firm supply. Without fusion and with solar at zero, the listed nuclear plus grid supply is only **6.6 GW**, before outages or reserve requirements. Even with 1.9 GW of fusion, that nighttime total is 8.5 GW. The chapter discusses substitutes for fusion, but does not demonstrate an hourly reliable supply plan. Sources: [electrical-distribution.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/mechanical-electrical/electrical/electrical-distribution.md#L211), [power-budget.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/energy-systems/grid-architecture/power-budget.md).

### 4. Construction economics differ by more than an order of magnitude

The economic model proposes an $800 billion central construction estimate. Applied to the geometry chapter's 79.7 billion gross square feet, that is approximately **$10 per gross square foot**.

The robotics chapter itself starts at $150/sqft, yielding approximately **$12 trillion**, and presents much higher alternatives. These estimates describe incompatible project costs unless their scope or geometry differs substantially; that distinction is not reconciled.

The robotics savings calculation also applies a 30–50% labor reduction to the entire construction budget. Savings should instead be calculated from the labor share, with robot capital, maintenance, supervision, and financing accounted for separately. These are internal arithmetic and scope findings, not an independent construction appraisal. Sources: [economic-model.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/institutional-design/economics/economic-model.md#L172), [robotics-factory.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/construction-logistics/robotics/robotics-factory.md#L141), [robotics-factory.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/construction-logistics/robotics/robotics-factory.md#L168).

### 5. Geometry is partly sound, but its baseline does not propagate

The tier calculation checks out: 36 floors in each of ten square tiers, with side length 18,480 − 1,100i feet, gives **69.496 billion sqft above ground**. Adding the basement floors reasonably supports the rounded 79.7 billion gross total.

Other statements need correction:
- 55.8 billion sqft equals approximately **2,002 square miles**, not 24,500.
- Total usable space is **5,580 sqft/person** at 10 million residents; **1,395** is the residential allocation only.
- The allocation percentages sum to **99%**, leaving 1% unassigned.
- A 3.5-mile-square footprint is **31.73 km²**; foundation and public-space entries instead use 24.6 and 16 km².
- Multi-story atrium voids need explicit treatment: lost upper floors and actual accessible park surfaces cannot both be counted as ordinary usable floor area.

Sources: [primary-geometry.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/superstructure/primary-geometry.md#L176), [space-allocation.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/urban-design-livability/residential/space-allocation.md#L152), [foundation-systems.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/foundation-systems/foundation-systems.md#L196), [public-space-design.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/urban-design-livability/public-space/public-space-design.md).

### 6. Materials estimates describe a much smaller building

Supply-chain estimates use 200–500 million m² and 0.3–0.5 m³ of concrete per m². Geometry supplies approximately **5.184 billion m² usable**.

Applying that chapter's own concrete intensity to the geometry baseline yields approximately **1.56–2.59 billion m³**, rather than the central estimate of 100 million m³. This is a consistency check, not an endorsed material quantity. It shows why construction logistics cannot be evaluated independently of the structural quantity model. Source: [supply-chain-logistics.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/construction-logistics/supply-chain/supply-chain-logistics.md#L218).

### 7. Food self-sufficiency claims exceed the presented balance

The food entry claims 100,000–150,000 tonnes of annual produce could supply 80–100% of vegetables for 10 million residents. That works out to only **27–41 grams per person per day**. The claim needs a defined diet and commodity breakdown.

Producing that output from 5–10 hectares implies approximately **1,000–3,000 kg per footprint m² per year**. The text needs an explicit growing-layer count, crop cycle, yield, and lighting model to support it.

The broader 30–50% internal calorie target is also not demonstrated by percentages of protein and fresh produce. Fermentation substrates, animal or insect feed, electricity, water, losses, and imported calories must be included. The acknowledgement that staple crops need external supply is a strength. Source: [food-systems.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/environmental-systems/food-production/food-systems.md#L199).

### 8. Compute comparisons contain another factor-of-1,000 error

The chapter's approximately 96.7 zettaFLOPS divided by its stated global estimate of 200 exaFLOPS equals **483,500**, not 483.

The answer is not to replace the headline with 483,500×. The denominator and performance definitions also require verification. FP4 advertised inference throughput cannot be interpreted as a direct multiple of FP64 Linpack performance or unspecified global AI compute. Use the same precision, sparsity convention, workload, and date.

Epoch's current research expresses global capacity in H100-equivalents and reports approximately 20.3 million at year-end 2025; the repository's denominator needs a traceable derivation. Sources: [compute-overview.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/ai-compute-infrastructure/data-centers/compute-overview.md#L229), [Epoch methodology update](https://epoch.ai/latest/scaling-ai-data-centers-research).

### 9. Citation traceability needs a systematic audit

I counted **462 citation records**, not necessarily unique publications. Twenty-nine of the 32 entries have no HTTP URL in their frontmatter, making source verification unnecessarily difficult.

A confirmed example: geometry attributes “Examining Space Efficiency in Supertall Towers through an Analysis of 135 Case Studies” to Buildings 14(5), 1295 (2024). The author's university records it as Hüseyin Emre Ilgın, **International Journal of Architectural Engineering Technology, volume 10, pages 140–157 (2023)**, DOI **10.15377/2409-9821.2023.10.10**. The elevator entry identifies the study more accurately, another indication that reference records are not synchronized.

This establishes a bibliographic error; it does not establish that all citations are unreliable. Require DOI/URL, author, publication date, supporting page or table, and a claim-to-source relationship. Sources: [primary-geometry.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/superstructure/primary-geometry.md), [Tampere University publication record](https://researchportal.tuni.fi/en/publications/examining-space-efficiency-in-supertall-towers-through-an-analysi/).

### 10. Site conclusions and safety conclusions need narrower wording

The foundation entry treats Houston-area analogs and regional sediment thickness as definitive evidence for the Burleson County site's bearing conditions. Depth to crystalline basement is not interchangeable with depth to competent bearing material. Texas Water Development Board material provides Burleson-specific Yegua-Jackson information, underscoring the need to establish the actual parcel's stratigraphy before adopting a Beaumont Formation/Houston profile.

That does not demonstrate that the site is suitable. It means neither suitability nor impossibility has been demonstrated from the cited regional analogs.

Similarly, fire safety's linear scaling of evacuation time by population does not establish evacuation duration without exit capacity, routing, refuge, and incident scenarios. Compartmentation is a sensible direction; the proposed safety performance still needs modeling.

Sources: [foundation-systems.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/structural-engineering/foundation-systems/foundation-systems.md#L198), [TWDB Yegua-Jackson aquifer](https://www.twdb.texas.gov/groundwater/aquifer/minors/yegua-jackson.asp), [fire-life-safety.md](https://github.com/YourLifewithAI/Lifewithai/blob/ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c/content/knowledge/mechanical-electrical/fire-life-safety/fire-life-safety.md).

## Recommended research sequence

1. **Freeze one dimensional baseline.** Define gross, net, conditioned, planted, and void areas; population; footprint; heights; construction phases; and scenario identifiers.
2. **Create executable calculations.** Generate chapter tables from shared inputs, with unit checks, percentage totals, and cross-domain reconciliation. Keep observed evidence separate from design assumptions and calculated outputs.
3. **Close the physical balances.** Reconcile mass, electrical energy, heat rejection, water, calories, material flows, and transport demand, including hourly and seasonal peaks and degraded operation.
4. **Establish feasibility gates.** Investigate the actual site's geotechnics, structural load paths and quantities, fire/refuge strategy, dependable power and cooling, and the economics of the first occupied phase.
5. **Audit high-impact citations first.** Prioritize evidence supporting geometry efficiency, foundation conditions, HVAC sizing, robotics productivity, food production, and financing.
6. **Demonstrate a smaller integrated district.** Test the operational relationships among housing, compute, heat recovery, water reuse, food imports, and governance before extrapolating to ten million residents.

The research is worth developing. Its next milestone should be a consistent, reproducible baseline with clearly bounded uncertainties. More narrative detail or additional references alone will not resolve the contradictions above.
