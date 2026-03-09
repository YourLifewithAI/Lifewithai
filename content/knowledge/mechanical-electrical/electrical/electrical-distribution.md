---
id: "mechanical-electrical/electrical/electrical-distribution"
title: "Electrical Distribution at City Scale"
domain: "mechanical-electrical"
subdomain: "electrical"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-25"
updated: "2026-03-09"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["electrical", "power-distribution", "substations", "voltage-drop", "busway", "medium-voltage", "solid-state-transformers", "dc-distribution", "lightning-protection", "microgrid", "upward-lightning", "sic-power-electronics"]
summary: "The arcology requires delivering ~9.5 GW across 1,524 meters of vertical height — a utility-scale power distribution challenge compressed into a single structure, unprecedented at any existing facility. Current supertall practice extends to this scale with significant engineering, but solid-state transformers and DC distribution technologies — now reaching commercial deployment at MW scale — could reshape the architecture within the construction timeline."
citations:
  - id: "abb-burj-khalifa-2024"
    type: "project-data"
    title: "ABB Smart Grid Implementation at Burj Khalifa"
    source: "ABB"
    year: 2024
  - id: "siemens-high-rise-electrical-2023"
    type: "industry"
    title: "Application Model for High-Rise Buildings: Electrical Design Manual"
    source: "Siemens"
    year: 2023
  - id: "freedm-sst-2024"
    type: "peer-reviewed"
    title: "Solid-State Transformer Research and Development"
    source: "NC State FREEDM Systems Center"
    year: 2024
  - id: "lbnl-dc-distribution-2024"
    type: "peer-reviewed"
    title: "Direct Current Power in Data Centers"
    source: "Lawrence Berkeley National Laboratory"
    year: 2024
  - id: "eaton-busway-guide-2023"
    type: "industry"
    title: "Pow-R-Way Busway Design Guide"
    source: "Eaton"
    year: 2023
  - id: "hk-emsd-energy-2024"
    type: "government"
    title: "Hong Kong Energy End-Use Data 2024"
    source: "Hong Kong Electrical and Mechanical Services Department"
    year: 2024
  - id: "singapore-ema-statistics-2024"
    type: "government"
    title: "Singapore Energy Statistics Chapter 3: Energy Consumption"
    source: "Singapore Energy Market Authority"
    year: 2024
  - id: "wwf-singapore-cooling-2022"
    type: "industry"
    title: "Decarbonising Singapore's Energy System in the Context of Cooling"
    source: "WWF Singapore / National Climate Change Secretariat"
    year: 2022
  - id: "bca-energy-benchmarking-2021"
    type: "government"
    title: "Building Energy Benchmarking Report 2021"
    source: "Singapore Building and Construction Authority"
    year: 2021
  - id: "wolfspeed-10kv-sic-2026"
    type: "industry"
    title: "Industry's First Commercially Available 10,000V Silicon Carbide Power MOSFET"
    source: "Wolfspeed"
    year: 2026
  - id: "amperesand-sst-2026"
    type: "industry"
    title: "Gen III Solid-State Transformer for AI Data Centers and EV Charging"
    source: "Amperesand"
    year: 2026
  - id: "ucsd-microgrid-2024"
    type: "project-data"
    title: "UC San Diego Campus Microgrid: 42 MW Generation, 55 MW Peak Load"
    source: "UC San Diego Center for Energy Storage"
    year: 2024
  - id: "tokyo-skytree-lightning-2017"
    type: "peer-reviewed"
    title: "Lightning Observation Results at Tokyo Skytree 2012-2022"
    source: "Government of Japan / NTT Research"
    year: 2017
  - id: "iec-62305-lightning-2024"
    type: "standard"
    title: "IEC 62305: Protection Against Lightning (Parts 1-4)"
    source: "International Electrotechnical Commission"
    year: 2024
  - id: "springer-elevator-energy-2024"
    type: "peer-reviewed"
    title: "Optimization of Energy Consumption in Vertical Mobility Systems of High-Rise Office Buildings"
    source: "Energy Efficiency (Springer)"
    year: 2024
  - id: "sciencedirect-vertical-farming-2024"
    type: "peer-reviewed"
    title: "Benchmarking Energy Efficiency in Vertical Farming: Status and Prospects"
    source: "Smart Agricultural Technology (Elsevier)"
    year: 2024
  - id: "freedm-annual-report-2025"
    type: "peer-reviewed"
    title: "FREEDM Systems Center Annual Report 2024-2025"
    source: "NC State University"
    year: 2025
cross_references:
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "depends-on"
  - slug: "energy-systems/nuclear-smr/nuclear-smr-baseload"
    relationship: "depends-on"
  - slug: "mechanical-electrical/elevators/vertical-transport"
    relationship: "parallel"
  - slug: "ai-compute-infrastructure/data-centers/compute-overview"
    relationship: "informs"
  - slug: "environmental-systems/hvac/atmospheric-control"
    relationship: "informs"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "informs"
open_questions:
  - "What is the optimal riser technology for 1,500m+ vertical distribution — extended busway, cable, or a hybrid approach?"
  - "Will SST efficiency reach parity with conventional transformers (>99%) to justify full arcology-scale deployment, or will they remain limited to AC/DC interface nodes?"
  - "How do 50+ zone microgrids coordinate in real-time without creating protection and control complexity that exceeds current software tools?"
  - "What is the peak-to-average load ratio for a 10M-person arcology, and how does Texas summer cooling demand affect infrastructure sizing versus average utilization?"
assumptions:
  - "Total average electrical load of ~9.5 GW based on 10 million residents at ~800-1,000W per capita, consistent with dense-city benchmarks (Singapore, Hong Kong)"
  - "Primary distribution at 11-33 kV (medium voltage) with secondary distribution at 415/480V"
  - "On-site generation (nuclear + solar) provides primary power; diesel backup is impractical at this scale"
  - "Lightning strikes will be frequent at 1,524m elevation (estimated 30-100+/year); protection is a continuous operating condition"
  - "Load categories are non-overlapping: residential excludes central HVAC; HVAC covers all centralized cooling"
parameters:
  - name: "total_average_load_gw"
    value: 9.5
    unit: "GW"
    confidence: 2
  - name: "vertical_distribution_height_m"
    value: 1524
    unit: "meters"
    confidence: 3
  - name: "residential_load_mw"
    value: 2000
    unit: "MW average (non-cooling; 200W/capita)"
    confidence: 2
  - name: "hvac_load_mw"
    value: 3500
    unit: "MW average (range: 3000-5000; peak 5000-8000)"
    confidence: 2
  - name: "vertical_transport_load_mw"
    value: 600
    unit: "MW net (after 25% regenerative recovery)"
    confidence: 2
  - name: "food_production_load_mw"
    value: 450
    unit: "MW (range: 300-600; leafy greens and produce only)"
    confidence: 2
  - name: "substation_floor_interval_m"
    value: 100
    unit: "meters (primary substations)"
    confidence: 2
  - name: "primary_substation_count"
    value: 15
    unit: "floors (range: 15-18)"
    confidence: 2
  - name: "secondary_substation_count"
    value: 45
    unit: "floors (range: 40-50)"
    confidence: 2
  - name: "voltage_drop_limit_total_pct"
    value: 5
    unit: "percent (3% branch + 2% feeder)"
    confidence: 3
  - name: "max_busway_segment_m"
    value: 100
    unit: "meters (between substation floors)"
    confidence: 2
  - name: "burj_khalifa_height_m"
    value: 828
    unit: "meters"
    confidence: 3
  - name: "burj_khalifa_transformer_count"
    value: 74
    unit: "transformers"
    confidence: 3
  - name: "thermal_expansion_copper_full_height_mm"
    value: 1265
    unit: "mm (at 50°C delta-T)"
    confidence: 3
  - name: "lightning_strikes_per_year"
    value: 50
    unit: "strikes/year (range: 30-100+ in Texas climate)"
    confidence: 2
  - name: "busway_expansion_joint_interval_m"
    value: 91
    unit: "meters (copper, per Eaton specification)"
    confidence: 3
---

## The Distribution Challenge

The arcology requires approximately 9.5 GW of average electrical power — consistent with the overall power budget — delivered across 1,524 meters of vertical height. No single facility in history has operated at this scale. The largest operational data center campus (Stargate Abilene) reached 1.2 GW in 2025; the largest announced single-site campus (Amazon Project Rainier) targets 2.2 GW. The arcology is 4-8x beyond even these frontier facilities, and serves a fundamentally different mixed-use load profile.

For context: the Burj Khalifa (828m) uses 74 transformers, 5,300 km of electrical cabling, and a sophisticated ABB smart grid monitoring 400+ electrical loads. The arcology is nearly twice as tall and serves 1,000x the population. The electrical infrastructure must deliver reliable power to residential units, commercial spaces, data centers, HVAC systems, vertical transport, and internal agriculture — with voltage regulation, fault isolation, and emergency backup capability at every level.

The core challenge is achievable with current technology. Modern supertall practice provides a template that can be extended with additional engineering. But emerging technologies — particularly solid-state transformers now reaching commercial deployment at MW scale, and DC distribution gaining traction beyond data centers — could fundamentally reshape the optimal architecture if they continue maturing on the construction timeline.

## Load Magnitude

A 10-million-person vertical city presents utility-scale electrical demand distributed across multiple categories. The load model below separates cooling from residential to avoid double-counting — residential covers appliances, lighting, and in-unit equipment; HVAC covers all centralized cooling and ventilation.

| Load Category | Average Demand (MW) | Notes |
|--------------|---------------------|-------|
| Residential (non-cooling) | 2,000 | 200W/capita; validated against Hong Kong (196W) and Singapore (164W) residential benchmarks |
| Commercial/Industrial | 1,500-2,500 | Internal economy, manufacturing, services |
| HVAC/Cooling (centralized) | 3,000-5,000 | Largest single load; Texas summer peaks drive 5,000-8,000 MW design capacity |
| Vertical transport | 500-800 | All mechanical transport; net after ~25% regenerative recovery |
| Food production | 300-600 | LED vertical farming for leafy greens and produce; caloric staples are energetically impractical |
| Water/waste systems | 150-300 | Pumping to 1,524m elevation; treatment and recycling |

The total estimated average of ~9.5 GW aligns with the overall power budget and is consistent with dense-city per-capita benchmarks. Singapore's all-sector electricity consumption of 1,121W per capita continuous provides the closest analog for a dense, air-conditioned, high-rise city. Hong Kong runs at approximately 685W per capita. The arcology's ~950W per capita falls between these benchmarks, reflecting Texas cooling loads offset by the absence of heavy industry.

A critical distinction the load model must address: **peak demand during Texas summers could reach 12-14 GW** — 1.3-1.5x average — driven primarily by cooling. The 9.5 GW figure represents average demand, not the infrastructure design capacity. Singapore's cooling sector alone consumes 30% of national electricity; in a hotter Texas climate with higher design-day temperatures, cooling could represent 35-45% of the arcology's peak load.

## Vertical Distribution Architecture

### Current Supertall Practice

Modern supertall buildings receive utility power at 11-66 kV and step down through multiple distribution tiers:

- **Primary substations** at basement/podium level receive the utility feed and distribute at 11-33 kV medium voltage (MV)
- **Secondary substations** every 25-35 floors transform MV to 415V/480V for floor distribution
- **Busway risers** carry power vertically using copper or aluminum bus duct, rated up to 6,300A

The Burj Khalifa exemplifies this approach with substations at floors 17, 40, 73, 109, 136, and 155 — an average spacing of approximately 83 meters with a maximum gap of 108 meters between floors 73 and 109. The 155th-floor substation, supplied by ABB, is the world's highest. Shanghai Tower (632m) uses an even tighter zone-based model with mechanical/electrical floors every 12-15 floors (~42-52m), each designed as an independent MEP unit.

### The Height Problem

At 1,524 meters, several physics problems compound:

**Voltage drop** accumulates with distance. Standard practice limits total drop to 5% (3% on branch circuits, 2% on feeders per NEC). Achieving this across 5x the height of the Burj Khalifa requires either higher distribution voltages, lower-impedance conductors, or more frequent substations — likely all three.

**Conductor weight** becomes a structural consideration. Copper weighs 8.96 g/cm³. A vertical busway running the full height carries significant mass that must be supported at intervals, with expansion joints accommodating thermal movement.

**Thermal expansion** is more severe than commonly recognized. Copper's linear thermal expansion coefficient is 16.6 ppm/°C; aluminum is 23.1 ppm/°C (39% higher). A 1,524m copper conductor experiencing a 50°C temperature swing expands by approximately **1,265 mm — over 1.25 meters**. Standard expansion joints accommodate 38mm each. At Eaton's recommended 91-meter spacing for copper busway, a full-height run gets 17 joints providing only 646mm of travel — roughly half the required 1,265mm. This thermal expansion calculation is the strongest quantitative argument against continuous full-height busway and in favor of segmented runs between substation floors, where each 100m segment requires only ~83mm of accommodation — easily handled by 2-3 standard joints.

**Stack effect** creates air pressure differentials in electrical rooms. The natural chimney effect in a 1,500m structure pulls air upward, affecting equipment cooling and requiring HVAC coordination in every electrical room.

### Scaling the Substation Model

Extrapolating current practice to arcology scale, validated against Burj Khalifa and Shanghai Tower data:

- **Primary substations** every ~100m vertical = approximately 15-18 major transformer floors
- **Secondary substations** every 30-35 floors = 40-50 electrical riser rooms per vertical stack
- **Multiple parallel stacks** across the footprint to limit horizontal distribution distance

Industry guidance recommends a maximum 200m supply radius for substations. The Burj Khalifa's actual 83-108m spacing provides comfortable margin within this limit and validates the 100m assumption used here.

Each substation floor removes habitable space from the structure. At 15 primary and 45+ secondary substation floors, the electrical infrastructure consumes a meaningful fraction of the 30% non-usable allocation shared with structural columns, mechanical systems, and elevator shafts.

## Fault Protection at Scale

With hundreds of thousands of circuits spanning five or more voltage levels, protection coordination becomes a software-scale engineering problem:

**Selectivity** requires that the protective device closest to a fault trips first, isolating the problem without affecting upstream systems. Coordinating thousands of breakers, fuses, and relays across the voltage cascade requires sophisticated modeling tools (ETAP, SKM Power Tools, or equivalent).

**Arc flash energy** in MV switchgear presents serious safety hazards. Incident energy calculations must inform equipment ratings, PPE requirements, and approach boundaries throughout the structure.

**Ground fault protection** in a mixed MV/LV system requires careful design to prevent both nuisance trips and undetected faults. The arcology's ground fault strategy must account for multiple grounding configurations across different zones.

The good news: current protection coordination tools can model networks of this complexity, though they may need extension for the node count involved. The engineering is demanding but not unprecedented — utility networks manage comparable coordination challenges, just distributed horizontally rather than vertically.

## The Riser Question

Vertical power distribution traditionally uses busway (bus duct) — prefabricated enclosures containing copper or aluminum busbars with plug-in connection points at each floor. Busway offers easier maintenance, simpler modifications, and lower installation labor than equivalent cable systems.

No manufacturer publishes an absolute height limit for vertical busway. The commonly cited ~600m practical limit is an engineering inference from compounding factors — weight, thermal expansion, and support requirements — rather than a hard specification. NEC 368.30 requires supports at every floor penetration for vertical runs, meaning a 1,524m installation needs approximately 311 floor hangers plus structural support.

The thermal expansion analysis settles the riser architecture question for the arcology: continuous full-height busway is impractical at 1,524m. The optimal approach is **segmented distribution** — MV cable risers for express runs between substation floors (each segment ~100m, well within manageable expansion range), with local busway distribution within each zone for floor-by-floor plug-in connections. This hybrid leverages the reliability of cable for long vertical runs and the maintainability of busway for local distribution.

## AC vs. DC Distribution

The conventional AC approach is proven and standardized. Equipment ecosystems are mature. Codes and standards are established. Electricians know how to work with it.

But AC distribution for buildings with significant modern loads is increasingly inefficient. Computers, LED lighting, EV charging, and battery storage are all natively DC. Each AC-DC conversion loses 5-10% efficiency. A building where 60%+ of end-use loads are electronic loses substantial energy in unnecessary power conversion.

**DC distribution advantages:**
- Direct connection to solar PV, batteries, and DC loads eliminates conversion losses
- 10-20% efficiency gains versus equivalent AC systems, confirmed by LBNL simulation studies
- Data centers are already adopting 380V DC as standard; 800V DC is emerging for highest-density AI compute zones
- Simpler power electronics for variable-speed drives (HVAC, elevators)

**DC distribution barriers:**
- Limited equipment availability outside data center applications — essentially zero commercial building deployments as of 2026
- Standards exist (NEC Article 712 since 2017; IEC 60364-8-82 since 2022) but the equipment ecosystem lags
- LBNL techno-economic analysis shows DC distribution is cost-effective only in buildings with significant on-site generation and battery storage — which the arcology has
- Protection devices less mature than AC equivalents

The arcology's on-site nuclear and solar generation makes the DC case substantially stronger than for a typical building. With primary generation already on-site, the efficiency argument for native DC distribution to compute zones, EV infrastructure, and LED farming operations becomes compelling. The emerging 800V DC standard — driven by convergence between AI data center density and EV charging — is particularly relevant for the arcology's internal compute zones.

## Solid-State Transformers

Solid-state transformers (SSTs) use power electronics rather than magnetic cores to transform voltage. The landscape changed significantly in 2025-2026, with multiple companies moving from research to commercial deployment:

| Company | Product | Rating | Status (March 2026) |
|---------|---------|--------|---------------------|
| Amperesand | Gen III SST | 500kW-1.5MW | First commercial units shipping Q1 2026 |
| WattEV | MV-PCS | 1.2-3.8 MW | Production-ready for megawatt EV truck charging |
| DG Matrix | Interport Platform | MW-scale | Early deployments in AI data centers |
| Eaton (via acquisition) | SST-based systems | MV to DC | Commercializing for EV and data center |

The NC State FREEDM Systems Center — which demonstrated the first SST in 2010 — has a 1 MW fast-charging SST under development with 98.25% efficiency achieved at low voltage. Their modular design approach (multiple power cells stacked in series and parallel) enables scaling to any desired voltage and power level.

The critical enabling component arrived in March 2026: Wolfspeed's first commercially available 10,000V silicon carbide (SiC) MOSFET (CPM3-10000-0300A). This device allows direct switching at medium voltage, eliminating the need to cascade lower-voltage switches. It enables ~30% system cost reduction and 16x switching frequency improvement versus silicon IGBTs, with conversion efficiency approaching 99%. Production modules are expected within 2-4 years.

**The efficiency gap remains the key commercial barrier at arcology scale.** Current best-in-class SST efficiency is 98.25-98.5%, versus >99.5% for conventional transformers. At 9.5 GW total load, a 1% efficiency difference represents 95 MW of additional waste heat and ~$100M/year in additional electricity cost. Until SSTs reach 99%+ efficiency, conventional transformers remain cost-advantaged for pure power delivery. SSTs are best positioned for zones where their unique capabilities — real-time voltage regulation, DC output, fault isolation, bidirectional power flow — justify the efficiency penalty: specifically AC/DC interface nodes, renewable/battery integration points, and zones requiring tight voltage regulation.

The arcology should design its infrastructure to accommodate SST integration, even if the initial build uses conventional transformers. This means electrical room sizes, cooling provisions, and control system architecture that can support either technology. Grid-scale SST viability (10+ MW per unit) is realistic by 2028-2032, well within the construction timeline.

## Microgrid Architecture

The choice between centralized and distributed electrical architecture has significant implications for reliability and control complexity:

**Centralized approach:** Traditional utility model with single point of common coupling. Simpler protection coordination, easier to manage, but vulnerable to single points of failure. A fault in the primary substation affects the entire structure.

**Microgrid approach:** Multiple semi-autonomous zones capable of islanding from the main grid during disturbances. Better resilience — localized faults don't cascade. More complex protection and control, but enables peer-to-peer energy trading between zones.

The optimal architecture is likely hybrid: a centralized MV backbone providing primary distribution, with zone-level microgrids (perhaps one per tier) capable of operating independently. During normal operation, the microgrids draw from the backbone. During disturbances, affected zones island while the backbone maintains service to healthy zones.

The best operational reference is UC San Diego's campus microgrid: 42 MW generation capacity, 55 MW peak load, 450 buildings across 1,200 acres, managed by a "Paladin" controller processing 260,000 data inputs per second. This demonstrates the control complexity achievable at a single site — but it is one integrated microgrid, not a networked multi-microgrid system. The consensus control architecture uses three levels (primary/local, secondary/zone, tertiary/system) with a fourth inter-zone coordination level emerging in research. No deployed system coordinates 20+ island-capable microgrids — making the arcology's proposed ~50-zone architecture genuinely unprecedented. The algorithms exist; the system integration at this scale does not.

This architecture aligns with the tiered residential structure. Each tier becomes an electrically semi-autonomous neighborhood — drawing from shared infrastructure but capable of brief independent operation during outages. The regenerative braking energy from descending elevators becomes a local power source within each tier's microgrid, with modern regenerative drives recovering 20-36% of elevator energy consumption.

## Emergency Power

Diesel backup at this scale is impractical. Providing 96-hour operation (per NFPA 110 for critical facilities) at 9.5 GW would require over 40,000 tons of diesel fuel, with associated fire risk and logistics complexity that exceeds any reasonable design envelope.

The alternative: treat on-site generation as primary power, not backup. The nuclear SMRs provide 5.0 GW of baseload that is independent of external grid conditions. Solar and battery storage provide additional resilience. The grid interconnection becomes a supplemental and backup source, not the other way around.

This inverts the traditional relationship between building and utility. The arcology is not a large building that depends on the grid; it is a generation source that happens to interconnect with the grid. Emergency power becomes "what happens if SMRs trip" — a scenario addressed by load shedding, battery storage, and grid import rather than diesel generators.

## Lightning Protection

At 1,524 meters, the structure will intercept lightning regularly — an estimated 30-100+ strikes per year in a Texas climate (ground flash density Ng ~6-8/km²/year), with rates of several per hour during active storm cells. For comparison, measured strike rates at instrumented structures:

| Structure | Height | Strikes/Year | Key Finding |
|-----------|--------|-------------|-------------|
| Empire State Building | 443m | 20-25 avg | Downward strikes dominate |
| CN Tower | 553m | 36-75 | Record: 52 flashes in 84 minutes |
| Tokyo Skytree | 634m | ~10.7 | **65% upward-initiated** (69 of 107 over 10 years) |
| Burj Khalifa | 828m | ~10 | Lower rate reflects Dubai's low Ng |

A critical insight from the Tokyo Skytree data: at 634m, **upward-initiated lightning dominates** — the building generates lightning upward toward storm clouds rather than passively attracting downward strikes. At 1,524m, well into cloud-base elevation during many storms, this effect would be extreme. The structure would interact with storm cells at or near roof level during major events, potentially experiencing continuous upward discharge activity. No instrumented structure above 700m exists, so extrapolation carries significant uncertainty. The downward-strike collection area saturates at approximately 450-500m radius regardless of further height increase, per IEC-adjacent engineering literature.

The protection strategy:

- **Air termination network** at the crown and upper tiers captures strikes. Per IEC 62305-3, side-strike protection is required on the top 20% of structure height — the top ~305m requires air terminal systems on facades, not just the roof
- **Down conductor system** — likely the structural steel itself acting as a Faraday cage, as proven at the Burj Khalifa
- **Grounding system** with bonding at multiple levels, not just the base, to manage ground potential rise — at 1,524m, resistive drop in down conductors becomes non-trivial
- **Surge protection** on all critical circuits — at 30-100+ strikes per year, induced transients are a continuous operating condition, not an exceptional event. Fiber optic communications where possible (immune to conducted surges), coordinated SPD cascades from MV service entrance through LV distribution to device level

The lightning protection system must be coordinated with the electrical distribution from the earliest design phase. A strike on the structure is not an exceptional event — it is a routine operating condition that the electrical infrastructure must tolerate without damage or disruption.

## The Path Forward

The arcology's electrical distribution system is achievable with current technology, but it requires unprecedented integration of utility-scale and building-scale electrical engineering.

**What works with current technology:**
- MV distribution backbone extending proven supertall practice
- Segmented riser design (MV cable between substations, local busway within zones)
- Voltage regulation via tap-changing transformers and power factor correction
- Protection coordination using existing software tools, extended for scale
- On-site generation eliminating diesel backup constraints
- Smart monitoring platforms (ABB, Siemens, Schneider) managing real-time load balancing

**What requires engineering advances:**
- Protection selectivity software for 100,000+ node networks
- Control algorithms for 50+ zone microgrids coordinating in real-time — no system of this scale has been deployed
- Peak demand management for Texas summer cooling loads (12-14 GW peak vs 9.5 GW average)

**What benefits from technology maturation (now on a commercial trajectory):**
- Solid-state transformers enabling DC distribution backbone — MW-scale commercial products now shipping; 10+ MW grid-scale expected 2028-2032
- 10 kV SiC MOSFETs (Wolfspeed, March 2026) enabling direct medium-voltage switching — production modules expected ~2028-2030
- Commercial DC distribution equipment ecosystems, particularly at 380V and emerging 800V DC for compute and EV zones

The electrical infrastructure is demanding but not speculative. The hardest engineering question has shifted: it is no longer whether the emerging technologies will work, but whether their efficiency penalty (SSTs at 98.5% vs conventional at 99.5%) justifies their functional advantages at arcology scale — and whether the ~50-zone microgrid coordination challenge can be solved through hierarchical control architectures that have been demonstrated in research but never deployed at this scale.
