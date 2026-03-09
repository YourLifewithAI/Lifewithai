---
id: "energy-systems/nuclear-smr/nuclear-smr-baseload"
title: "Nuclear SMR Baseload Generation"
domain: "energy-systems"
subdomain: "nuclear-smr"
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
tags: ["nuclear", "SMR", "baseload", "power-generation", "NuScale", "BWRX-300", "cogeneration", "waste-heat", "EPZ", "reactor-fleet", "seismic-isolation", "Kairos", "Deep-Fission", "Rolls-Royce"]
summary: "Small modular reactors provide the arcology's 5.0 GW nuclear baseload through a fleet of 17-65 reactor modules, depending on design selection. SMR technology is real and advancing — NuScale holds NRC standard design approval for 77 MWe, BWRX-300 is under construction at Darlington (Ontario), Kairos Power's Hermes is the first non-LWR approved for construction in the US in 50 years, and Deep Fission broke ground on a borehole reactor pilot in Kansas in December 2025. Siting reactors within or beneath an inhabited megastructure requires regulatory frameworks that do not yet exist, though the NRC's 2023 performance-based EPZ rule opens a pathway."
citations:
  - id: "nuscale-voygr-2025"
    type: "project-data"
    title: "NuScale VOYGR SMR: Design Certification and Deployment Status"
    source: "NuScale Power"
    year: 2025
  - id: "gehitachi-bwrx300-2025"
    type: "project-data"
    title: "BWRX-300 Small Modular Reactor: Darlington Construction Status"
    source: "GE Vernova Hitachi Nuclear"
    year: 2025
  - id: "xenergy-xe100-2025"
    type: "project-data"
    title: "Xe-100 High-Temperature Gas-Cooled Reactor Specifications"
    source: "X-energy"
    year: 2025
  - id: "deep-fission-borehole-2025"
    type: "project-data"
    title: "Deep Fission Gravity Borehole Reactor: DOE Pilot Program"
    source: "Deep Fission"
    year: 2025
  - id: "nrc-epz-framework-2023"
    type: "peer-reviewed"
    title: "Performance-Based Emergency Planning Zone Framework for Advanced Reactors"
    source: "US Nuclear Regulatory Commission"
    year: 2023
  - id: "stanford-smr-waste-2022"
    type: "peer-reviewed"
    title: "Nuclear Waste from Small Modular Reactors"
    source: "PNAS (Stanford/UBC)"
    year: 2022
  - id: "argonne-smr-waste-2023"
    type: "peer-reviewed"
    title: "Small Modular Reactor Waste Management Analysis"
    source: "Argonne National Laboratory"
    year: 2023
  - id: "ieee-deep-fission-2025"
    type: "industry"
    title: "Underground Nuclear Reactor: Deep Fission Borehole Concept"
    source: "IEEE Spectrum"
    year: 2025
  - id: "nrc-10cfr50-epz-rule-2023"
    type: "peer-reviewed"
    title: "Emergency Preparedness for Small Modular Reactors and Other New Technologies (10 CFR 50.33)"
    source: "US Nuclear Regulatory Commission, Federal Register"
    year: 2023
  - id: "jaea-fsis-seismic-2024"
    type: "peer-reviewed"
    title: "Floating Seismic Isolation System for SMRs: Large-Scale Demonstration Tests"
    source: "Japan Atomic Energy Agency (JAEA)"
    year: 2024
  - id: "kairos-hermes-2025"
    type: "project-data"
    title: "Kairos Power Hermes Low-Power Demonstration Reactor: Construction Start"
    source: "Kairos Power / US DOE"
    year: 2025
  - id: "nuscale-sda-77mwe-2025"
    type: "project-data"
    title: "NuScale Power Module Standard Design Approval for 77 MWe"
    source: "NuScale Power / US NRC"
    year: 2025
  - id: "doe-reactor-pilot-2025"
    type: "project-data"
    title: "DOE Reactor Pilot Program Selections and Progress Update"
    source: "US Department of Energy"
    year: 2025
  - id: "iaea-smr-catalogue-2024"
    type: "industry"
    title: "IAEA Advanced Reactors Information System: SMR Catalogue 2024"
    source: "International Atomic Energy Agency"
    year: 2024
  - id: "inl-smr-waste-2024"
    type: "peer-reviewed"
    title: "Nuclear Fuel Cycle and Supply Chain: SMR Waste Attributes Report"
    source: "Idaho National Laboratory"
    year: 2024
  - id: "mceer-seismic-isolation-2025"
    type: "peer-reviewed"
    title: "Guidelines for Implementing Seismic Base Isolation in Advanced Nuclear Reactors"
    source: "MCEER / University at Buffalo"
    year: 2025
cross_references:
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "depends-on"
  - slug: "structural-engineering/foundation-systems/foundation-systems"
    relationship: "depends-on"
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "structural-engineering/seismic-design/seismic-resilience"
    relationship: "depends-on"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "informs"
  - slug: "energy-systems/district-energy/district-thermal"
    relationship: "informs"
open_questions:
  - "Can the NRC's 10 CFR 50.33 performance-based EPZ framework be extended to approve reactors sited beneath an inhabited megastructure — where evacuation is impractical and the 'site boundary' is the building itself — or does this require a fundamentally new regulatory category beyond what site-boundary EPZ provides?"
  - "What is the realistic deployment timeline for 17+ SMR modules at a single site, given that no nation has deployed more than 4 simultaneously and the largest planned multi-unit SMR site (Ontario) targets only 4 BWRX-300 units by 2035?"
  - "How should seismic isolation for sub-foundation reactor modules interface with the arcology's own seismic isolation system, given that Japan's FSIS technology validates floating isolation for standalone SMRs but has not been tested for reactors coupled to a 1,500-meter structure?"
  - "What is the appropriate on-site spent fuel storage capacity for a 60-year operating lifetime generating 100-150 tonnes HM/year, and can sub-foundation geological formations suitable for borehole reactors also serve as permanent dry cask storage?"
assumptions:
  - "Target baseload capacity of 5.0 GW from nuclear sources (per power-budget entry)"
  - "Next-generation SMR units range from 77 MWe (NuScale) to 470 MWe (Rolls-Royce), with fleet composition to be determined"
  - "Reactor siting is beneath the foundation or in adjacent exclusion zones, not within the inhabited superstructure"
  - "Cogeneration captures waste heat for district heating, absorption cooling, and desalination"
  - "Regulatory pathway exists or can be created for sub-foundation or adjacent EPZ approval"
  - "NuScale Power Module thermal efficiency is approximately 31% (77 MWe from 250 MWt)"
parameters:
  - name: "nuclear_baseload_gw"
    value: 5.0
    unit: "GW"
    confidence: 2
  - name: "smr_unit_count_range"
    value: "17-65"
    unit: "reactors (depending on unit size: 11 at 470 MW to 65 at 77 MW)"
    confidence: 2
  - name: "nuscale_module_capacity_mw"
    value: 77
    unit: "MWe (from 250 MWt)"
    confidence: 3
  - name: "nuscale_thermal_efficiency_pct"
    value: 30.8
    unit: "percent"
    confidence: 3
  - name: "bwrx300_capacity_mw"
    value: 300
    unit: "MWe"
    confidence: 3
  - name: "rolls_royce_smr_capacity_mw"
    value: 470
    unit: "MWe"
    confidence: 3
  - name: "voygr12_plant_capacity_mw"
    value: 924
    unit: "MWe (12 modules)"
    confidence: 3
  - name: "voygr12_footprint_acres"
    value: 35
    unit: "acres"
    confidence: 2
  - name: "nuclear_thermal_rejection_pct"
    value: 67
    unit: "percent of thermal input (LWR-type SMRs at ~33% efficiency)"
    confidence: 2
  - name: "total_waste_heat_gw"
    value: 10.0
    unit: "GW (at 5 GW electric, ~33% thermal efficiency)"
    confidence: 2
  - name: "xe100_outlet_temp_c"
    value: 750
    unit: "degrees Celsius"
    confidence: 3
  - name: "nuscale_refueling_months"
    value: 24
    unit: "months per module (maximum cycle length)"
    confidence: 3
  - name: "spent_fuel_tonnes_gwe_year"
    value: 20
    unit: "tonnes heavy metal per GWe-year (conventional LWR baseline)"
    confidence: 2
  - name: "annual_spent_fuel_tonnes"
    value: 100
    unit: "tonnes HM/year at 5 GWe (LWR baseline; SMR-specific rates may be 1.5-2x higher)"
    confidence: 2
  - name: "deep_fission_gravity_mwe"
    value: 15
    unit: "MWe per borehole reactor unit"
    confidence: 2
  - name: "smr_foak_overnight_cost_usd_kw"
    value: "5,000-10,000"
    unit: "USD per kW (first-of-a-kind, design-dependent)"
    confidence: 1
---

## The 5 GW Nuclear Question

The arcology's power budget allocates 5.0 GW to nuclear baseload generation. This is not a speculative figure — it is the foundation of the entire energy strategy. Compute infrastructure demands 24/7 power with no interruptions. Solar is intermittent. Grid connections fail during Texas weather events. Fusion is aspirational. Nuclear is the only generation technology that can deliver gigawatt-scale baseload power with the reliability that AI data centers require.

But 5.0 GW from SMRs is an unprecedented deployment. The world's largest nuclear installation — Kashiwazaki-Kariwa in Japan — operates 7 reactors totaling 8.0 GW. The arcology's nuclear capacity would be roughly 60% of that, concentrated at a single site, sited within or beneath an inhabited structure housing 10 million people.

The fleet size depends entirely on which SMR design is selected. At 77 MWe per NuScale module, reaching 5.0 GW requires approximately 65 modules — more reactor modules than currently exist in any single nuclear installation on Earth. At 300 MWe per BWRX-300 unit, the count drops to 17. At 470 MWe per Rolls-Royce SMR, just 11 units suffice. A mixed fleet is also plausible, optimizing different reactor types for different roles: LWR SMRs for reliable baseload, HTGRs for process heat, borehole reactors for geological siting advantages.

The technology is real. The engineering is achievable. The regulatory pathway does not exist.

## Certified and Near-Deployable Designs

Four SMR designs are closest to commercial deployment as of early 2026:

**NuScale VOYGR.** Each Power Module produces 77 MWe from 250 MWt — a thermal efficiency of approximately 31% [nuscale-sda-77mwe-2025]. The module weighs approximately 700 tons and ships in three segments. A VOYGR-12 plant combines 12 modules for 924 MWe total. NuScale holds the first NRC-certified SMR design (2023) and achieved Standard Design Approval for the uprated 77 MWe design in 2025 [nuscale-sda-77mwe-2025]. NuScale also secured approval for a site-boundary emergency planning zone — meaning the EPZ ends at the plant fence rather than extending 10 miles. The first US commercial units are expected operational around 2029-2030 (multiple sites under development). Romania signed an investment decision for a 6-module plant in February 2026 [nuscale-voygr-2025].

At 77 MWe per module, reaching 5.0 GW requires approximately 65 NuScale modules — roughly 5.5 VOYGR-12 plants. The modular approach allows phased deployment: NuScale claims a 12-module plant can be operational in under six years from site preparation, with individual modules generating revenue while the rest are completed [nuscale-voygr-2025]. Each module has a refueling cycle of up to 24 months with a 10-day refueling outage, enabling fleet capacity factors above 95% when modules are staggered [nuscale-sda-77mwe-2025].

**GE Vernova Hitachi BWRX-300.** A 300 MWe boiling water reactor with natural circulation cooling (no electrical pumps required) and passive safety — no operator action or external power needed for safe shutdown. Construction began at Ontario Power Generation's Darlington site in May 2025, with commercial operation expected around 2029-2030 [gehitachi-bwrx300-2025]. Ontario plans four BWRX-300 units by 2035. TVA plans to deploy a BWRX-300 at the Clinch River Nuclear site in Tennessee, with DOE cost-sharing of up to $400 million announced in 2025 [doe-reactor-pilot-2025]. The design completed Step 2 of the UK's Generic Design Assessment in December 2025.

At 300 MWe per unit, 5.0 GW requires approximately 17 BWRX-300 units — a more manageable fleet size than NuScale, though the individual units are larger and less modular.

**Rolls-Royce SMR (UK).** A 470 MWe close-coupled three-loop PWR with a footprint of two football pitches per station and a 60-year design life. The Generic Design Assessment Step 3 (Detailed Assessment) is underway, planned for completion by late 2026 [iaea-smr-catalogue-2024]. The UK government selected Wylfa, Anglesey as the launch site, with three units approved and potential for up to eight. If licensing completes on schedule, first concrete could be poured as early as 2027, with first power by the early 2030s.

At 470 MWe, 5.0 GW requires approximately 11 Rolls-Royce units — the smallest fleet size of the proven designs.

**Holtec SMR-300.** A 300 MWe integral PWR. Holtec plans to deploy two units (Pioneer 1 and 2) at the Palisades Nuclear Generating Station site in Michigan, with $400 million in DOE cost-sharing under the Tier 1 program [doe-reactor-pilot-2025]. Holtec's proposal establishes a repeatable, fleet-scale deployment model — a core requirement of the DOE program intended to drive down costs through standardization and manufacturing efficiency. The Pioneer reactors target online dates in the early 2030s.

## Advanced Designs Worth Watching

Several Gen IV designs offer advantages that matter specifically for arcology integration:

**X-energy Xe-100.** An 80 MWe high-temperature gas-cooled reactor (HTGR) using TRISO pebble fuel with 15.5% enrichment and helium coolant. The outlet temperature of 750°C enables process heat applications: hydrogen production, desalination, industrial chemistry [xenergy-xe100-2025]. The demo project at Dow's Seadrift, Texas targets construction start in 2026 and operation by 2030.

The Xe-100's high temperature is the key differentiator. LWR designs (NuScale, BWRX-300) produce steam at 300-320°C — useful for electricity and low-grade heating, but not for industrial processes. The Xe-100's 750°C output enables thermochemical hydrogen production and high-efficiency absorption cooling, both valuable for arcology operations.

**Kairos Power Hermes.** A fluoride-salt-cooled high-temperature reactor using molten fluoride salt as coolant with TRISO pebble fuel. Hermes is the first non-light-water reactor approved by the NRC for construction in over 50 years [kairos-hermes-2025]. Nuclear safety-related concrete was poured at Oak Ridge, Tennessee in May 2025, with the reactor vessel for the third Engineering Test Unit (ETU 3.0) installed in July 2025. The low-power demonstration reactor targets operation in 2027, with a larger Hermes 2 plant to follow before the end of the decade [kairos-hermes-2025]. Online refueling (pebbles added and removed during operation) eliminates scheduled refueling shutdowns.

**Deep Fission Gravity.** A borehole reactor concept: 15 MWe units installed 1 mile underground in 30-inch boreholes [deep-fission-borehole-2025]. The PWR core operates at approximately 160 atmospheres natural hydrostatic pressure. Each unit has a 10-20 year fuel cycle. A site of 100 borehole reactors produces 1.5 GWe. Deep Fission claims 70-80% cost advantages over conventional nuclear through simplified construction and elimination of above-ground containment structures [ieee-deep-fission-2025].

Deep Fission broke ground on its DOE Reactor Pilot Program site at Great Plains Industrial Park in Parsons, Kansas in December 2025, targeting first criticality by July 4, 2026 [doe-reactor-pilot-2025]. The NRC has begun pre-application engagement. If the technology proves out, it solves the siting problem that surface-mounted LWR SMRs cannot: reactors one mile beneath the foundation provide natural geological containment, eliminate surface emergency planning concerns, and physically separate the reactor from the inhabited structure.

## The Emergency Planning Zone Problem

Every nuclear reactor in the United States operates with an emergency planning zone — a radius around the plant within which emergency evacuation plans must exist. Conventional reactors require a 10-mile EPZ. In November 2023, the NRC finalized a landmark rule amending 10 CFR 50.33 to provide a performance-based, consequence-oriented approach to EPZ sizing for SMRs and advanced reactors [nrc-10cfr50-epz-rule-2023]. Rather than a predetermined 10-mile radius, the EPZ boundary is now determined by the area within which public dose could exceed 10 millisieverts over 96 hours after a release — accounting for accident likelihood, source term, accident timing, and meteorology [nrc-epz-framework-2023].

NuScale achieved site-boundary EPZ approval under this framework, demonstrating through passive safety and source term analysis that no credible accident scenario requires protective action beyond the plant fence [nuscale-voygr-2025]. For facilities with an EPZ that does not extend beyond the site boundary, the rule eliminates requirements for local first responders to participate in radiological drills [nrc-10cfr50-epz-rule-2023].

For the arcology, even a site-boundary EPZ is problematic. If the reactor is beneath the foundation, the "site boundary" is the building itself — which contains 10 million people. Evacuating the arcology is not a meaningful emergency response; it would take days and cause chaos exceeding any plausible reactor incident.

The regulatory question is whether a reactor can be licensed with essentially zero external EPZ — where the containment and safety systems are designed such that no accident scenario requires action outside the reactor building, because the reactor building is inside the inhabited structure. The 2023 rule opens the door by making EPZ sizing consequence-based rather than prescriptive, but it does not explicitly address the case where the "public" lives directly above the reactor. This likely requires a purpose-built regulatory framework — potentially extending the naval reactor precedent (aircraft carriers operate two reactors totaling approximately 600 MWt within a hull containing 5,000+ crew, with no evacuation option) into civilian licensing territory [nrc-10cfr50-epz-rule-2023].

The NRC has no framework for this. Neither does the IAEA. Creating the regulatory pathway for arcology-integrated reactors is a prerequisite for everything else. Without it, the nuclear baseload strategy is theoretical.

## Siting Beneath vs. Adjacent

Two siting philosophies are feasible:

**Underground/subterranean (Deep Fission model).** Reactors are placed in boreholes or caverns beneath the arcology foundation, one mile or more below grade. The geological mass provides containment. Cooling water and electrical connections run vertically to the surface. The reactor modules are physically separated from the inhabited structure by hundreds of meters of rock.

This approach has historical precedent. The Lucens reactor in Switzerland (1968) was built inside a rock cavern. It suffered a partial meltdown in 1969 — but the underground containment successfully prevented any release to the surface, validating geological containment. Chooz A in France operated as a cavern-sited PWR from 1967-1991. Deep Fission's December 2025 groundbreaking in Kansas represents the first modern attempt to demonstrate borehole-sited reactor technology [doe-reactor-pilot-2025].

**Adjacent surface siting with enhanced EPZ.** Reactors are placed on adjacent land outside the arcology footprint, using the smallest achievable EPZ. Heat and power are transmitted into the structure via district energy pipes and electrical cables. This is the conventional approach scaled up — multiple SMR plants surrounding the arcology rather than integrated with it.

Adjacent siting is more compatible with existing regulatory frameworks but requires substantial land area. A VOYGR-12 plant has a 35-acre footprint. Five such plants require 175+ acres — nearly a square mile of reactor infrastructure. At a 3.5-mile base diameter, the arcology footprint itself is approximately 6,000 acres. Adding 200+ acres of adjacent nuclear plants increases land requirements by 3%.

The pragmatic path is underground siting using borehole or cavern reactors if the technology proves out, with fallback to adjacent surface siting if it does not. Underground siting enables the "building IS the EPZ" concept that surface reactors cannot achieve.

## Seismic Isolation for Reactor Integration

Siting reactors beneath a 1,500-meter structure introduces a seismic coupling problem: the reactor modules need isolation from ground motion, but they are physically connected to a superstructure that itself responds dynamically to seismic events.

Recent developments in seismic isolation technology are directly relevant. In January-February 2024, the Japan Atomic Energy Agency (JAEA) conducted large-scale demonstration tests of a Floating Seismic Isolation System (FSIS) for SMRs, using a 1/15-scale mockup on the world's largest shaking table at E-Defense [jaea-fsis-seismic-2024]. The FSIS uses a water-filled tank in which the reactor plant floats, providing omnidirectional seismic isolation. JAEA reported that the system provides effective isolation with "increases in design margin and enhanced design standardization" — potentially allowing a single reactor/isolation design to be deployed at sites with varying seismic conditions. JAEA has begun pre-application engagement with the US NRC, with NRC staff observing tests and auditing quality assurance programs [jaea-fsis-seismic-2024].

Separately, the Rolls-Royce SMR design incorporates conventional base isolation for key safety zones [iaea-smr-catalogue-2024]. Revised guidelines for implementing seismic base isolation in advanced nuclear reactors were published by MCEER/University at Buffalo in March 2025 [mceer-seismic-isolation-2025].

For the arcology, the challenge is more complex than standalone SMR isolation. Sub-foundation reactors in boreholes would be isolated by the geological medium itself — at one mile depth, surface seismic accelerations are substantially attenuated. But reactor cooling connections, power cables, and fuel handling infrastructure must traverse the interface between bedrock and the superstructure's foundation, requiring flexible coupling designed for differential displacement during seismic events.

## Cogeneration: Converting Waste to Asset

LWR-type SMRs operate at approximately 31-33% thermal efficiency [nuscale-sda-77mwe-2025]. For every 3 units of heat generated, roughly 1 unit becomes electricity and 2 units are rejected as waste heat. At 5.0 GW electric output, the thermal input is approximately 15 GW, meaning approximately 10 GW of waste heat to manage.

This is either a massive thermal rejection problem or a massive thermal resource, depending on design. Research demonstrates that nuclear cogeneration can raise overall plant efficiency from 33% to over 57%, and dedicated heat extraction can push total energy utilization to nearly 80% [nrc-epz-framework-2023].

Cogeneration converts waste heat to useful purposes:
- **District heating:** Steam or hot water loops serve residential and commercial heating loads throughout the structure. Nuclear district heating is operational at Haiyang, China (serving 200,000+ residents) and Beznau, Switzerland (operating since 1983).
- **Absorption cooling:** Heat-driven chillers produce cooling without electrical compressors, serving HVAC loads. At the arcology's scale, waste-heat-driven absorption cooling could offset substantial electrical cooling loads.
- **Desalination:** Thermal desalination (multi-effect distillation) produces fresh water using waste heat as the energy input.
- **Industrial process heat:** High-temperature reactors (Xe-100 at 750°C) can supply process heat for hydrogen production, materials processing, and chemical synthesis.

Not all 10 GW of waste heat is practically recoverable. Condenser losses, cooling tower rejection, and thermodynamic limits reduce the usable fraction. A realistic recovery target is 50-75% of total waste heat — yielding 5-7.5 GW of usable thermal energy for district heating, absorption cooling, and industrial processes. This represents a significant fraction of the 1.14 GW allocated to agriculture, HVAC, and transit (per power-budget). The thermal cascade — from high-grade nuclear heat to progressively lower-grade applications — maximizes the value extracted from each unit of fission energy.

## Spent Fuel and Waste Logistics

Light-water reactors produce approximately 20 tonnes of heavy metal (HM) in spent fuel per GWe-year as a conventional baseline. At 5 GWe, this yields approximately 100 tonnes per year — 6,000 tonnes over a 60-year operating lifetime.

However, the spent fuel picture for SMRs is more nuanced than simple scaling from large-reactor data. The Stanford/UBC study (2022) found that SMRs may produce approximately 1.7 times more spent fuel per unit of electricity than conventional large PWRs, due to enhanced neutron leakage in small cores and lower average burnup [stanford-smr-waste-2022]. If this ratio holds, annual spent fuel generation could be 150-170 tonnes HM/year rather than 100. The INL/Argonne waste attributes analysis (2024) concluded that while volumetric waste quantities may be higher per MWh, the waste management challenges are "roughly comparable" to conventional plants in terms of radiological characteristics and storage requirements [inl-smr-waste-2024, argonne-smr-waste-2023]. For arcology planning, the conservative assumption is that SMR waste volumes are at least comparable to — and potentially 1.5-2x higher than — conventional nuclear on a per-MWh basis.

Spent fuel management at this scale is a continuous industrial operation, not an occasional event. With NuScale modules on 24-month refueling cycles [nuscale-sda-77mwe-2025], a 65-module fleet would average one module refueling every 11 days. Pebble-bed designs (Xe-100, Kairos) offer online refueling — fuel continuously added and removed during operation — eliminating scheduled outages but requiring continuous fuel handling infrastructure.

Underground waste storage beneath the foundation — leveraging the same geological formations used for borehole reactors — is a theoretical possibility. The rock formations suitable for borehole reactor installation at one-mile depth are also suitable for dry cask spent fuel storage. This could create a vertically integrated nuclear fuel cycle: fresh fuel enters from above, electricity and heat flow upward, spent fuel descends into long-term geological storage. At 100-170 tonnes HM/year, a 60-year accumulation of 6,000-10,000 tonnes would require substantial underground storage volume, but the borehole geometry could accommodate it — spent fuel assemblies lowered into exhausted reactor boreholes after a sufficient cooling period.

## Fleet Management and Autonomous Operations

Managing 17-65 reactor modules requires automation beyond current nuclear industry practice. Today's nuclear plants operate with large staffs and intensive human oversight. An arcology with 65 NuScale modules operating three-shift coverage would require hundreds of licensed reactor operators — assuming no efficiency gains from automation.

Digital twin technology is advancing toward this challenge. Argonne National Laboratory's GNN-based digital twins model reactor physics in real time. Oak Ridge's risk-informed digital twins for the BWRX-300 integrate safety analysis with operational decision-making. The ExaSMR project (Department of Energy Exascale Computing) is developing high-fidelity reactor simulations at scales previously impossible.

Fully autonomous nuclear reactor operation has never been demonstrated and faces regulatory barriers. But the arcology's AI governance infrastructure — the same systems managing building operations, transportation, and life safety — could extend to reactor oversight. The question is whether regulators will permit AI control of nuclear systems, and on what timeline.

## Economics and Cost Uncertainty

SMR economics remain the largest non-regulatory risk. The NuScale CFPP cancellation in 2023 (costs escalated from $5.3B to $9.3B) demonstrated that factory fabrication has not yet delivered the cost reductions SMR proponents promised [nuscale-voygr-2025].

Current cost estimates span a wide range. First-of-a-kind (FOAK) overnight capital costs for LWR-type SMRs are estimated at $5,000-10,000 per kW — compared to approximately $6,600/kW for conventional large reactors [iaea-smr-catalogue-2024]. Nth-of-a-kind (NOAK) projections are more favorable, with techno-economic analyses suggesting SMR LCOE targets of $80-120/MWh are achievable with fleet standardization and factory learning curves. However, the IEA's 2025 assessment projects that even under optimistic scenarios, SMR capital costs in Western countries will remain roughly one-third higher than conventional nuclear through 2050.

The arcology's economics differ from merchant power plants in important ways. Captive load eliminates market risk. Vertical integration of cogeneration, waste heat recovery, and process heat applications improves revenue per unit of fission energy. A 60-year operating lifetime amortizes capital costs over a longer period than typical utility planning horizons. And the scale of deployment — 17-65 modules at a single site — provides manufacturing learning curve benefits that no current SMR project approaches.

Deep Fission's borehole concept, if validated, could disrupt the cost picture entirely. Their claimed 70-80% cost advantage over conventional nuclear construction [ieee-deep-fission-2025] — driven by elimination of above-ground containment structures and simplified installation — would bring overnight capital costs to $1,000-2,000/kW, competitive with combined-cycle gas. This claim is unverified.

## What Must Be True

For the nuclear baseload strategy to succeed:

**Technically:** SMR designs must achieve their promised cost and schedule targets. Factory fabrication must deliver actual cost reductions, not theoretical ones. The first wave of commercial deployments (2029-2032) will provide the data needed to assess this.

**Regulatorily:** The NRC must approve either underground siting with geological containment, or an EPZ framework compatible with inhabited-structure proximity. The 2023 performance-based EPZ rule [nrc-10cfr50-epz-rule-2023] is a necessary but insufficient step. This is the critical path constraint — no amount of engineering solves it.

**Operationally:** Fleet management of 17+ reactor modules at a single site must be achievable with automation-augmented staffing. Current nuclear industry staffing models do not scale to this fleet size.

**Economically:** Nuclear generation costs (including fuel, waste, and decommissioning) must be financeable over a 60-year operating lifetime. FOAK costs of $5,000-10,000/kW imply $25-50 billion for the 5 GW nuclear fleet alone — a substantial fraction of total arcology construction cost [iaea-smr-catalogue-2024].

None of these are physics breakthroughs. All of them are hard.
