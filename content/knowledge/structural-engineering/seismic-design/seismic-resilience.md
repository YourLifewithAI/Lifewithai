---
id: "structural-engineering/seismic-design/seismic-resilience"
title: "Seismic Resilience at Arcology Scale"
domain: "structural-engineering"
subdomain: "seismic-design"
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
tags: ["seismic", "earthquake", "PBSD", "damping", "isolation", "TMD", "viscous-dampers", "base-isolation", "soil-structure-interaction", "induced-seismicity", "fundamental-period", "performance-based-design", "BRB", "MSCSS", "NSHM"]
summary: "Seismic design for a 5,000-foot terraced ziggurat in a low-seismicity Texas site. KEDL 300 upgrade grounds the fundamental period estimate in empirical data from 414 Chinese tall buildings, corrects the site PGA downward based on USGS ASCE 7-22 values (0.037g, SDC A), updates Burleson County seismicity to 14 events, and adds regulatory context from Texas RRC and Oklahoma analog. The structure's estimated 12-18 second fundamental period, billions of tons of mass, and 5.6 km foundation footprint place the design entirely outside existing codes, ground motion models, and computational validation — but the site hazard is even lower than originally estimated."
citations:
  - id: "peer-tbi-2017"
    type: "peer-reviewed"
    title: "Guidelines for Performance-Based Seismic Design of Tall Buildings, v2.03"
    source: "Pacific Earthquake Engineering Research Center (PEER)"
    year: 2017
  - id: "ctbuh-seismic-supertall"
    type: "peer-reviewed"
    title: "Performance of Seismic Protective Systems for Supertall Buildings and Their Contents"
    source: "Council on Tall Buildings and Urban Habitat"
    year: 2023
  - id: "nature-triple-isolation-2023"
    type: "peer-reviewed"
    title: "Seismic response analysis of super-high-rise building structures with three-layer isolation systems"
    source: "Nature Scientific Reports 13, 46207"
    year: 2023
  - id: "japan-seismic-control-2019"
    type: "peer-reviewed"
    title: "Review of Seismic Isolation and Response Control in Japan"
    source: "Geoenvironmental Disasters"
    year: 2019
  - id: "ssi-review-2023"
    type: "peer-reviewed"
    title: "Soil-Structure Interaction: State-of-the-Art Review"
    source: "Frontiers in Built Environment"
    year: 2023
  - id: "texnet-monitoring"
    type: "project-data"
    title: "Texas Seismological Network: Induced Seismicity Monitoring"
    source: "Bureau of Economic Geology, UT Austin"
    year: 2025
  - id: "burj-khalifa-structural-2014"
    type: "peer-reviewed"
    title: "Validating the Structural Behavior and Response of Burj Khalifa"
    source: "CTBUH"
    year: 2014
  - id: "ml-earthquake-engineering-2025"
    type: "peer-reviewed"
    title: "Machine Learning in Earthquake Engineering: A Comprehensive Review"
    source: "ScienceDirect"
    year: 2025
  - id: "xiao-period-height-2014"
    type: "peer-reviewed"
    title: "Research on Relationship between Natural Vibration Periods and Structural Heights for High-rise Buildings and Its Reference Range in China"
    source: "International Journal of High-Rise Buildings (CTBUH), 3(4)"
    year: 2014
  - id: "petersen-nshm-2023"
    type: "peer-reviewed"
    title: "The 2023 US 50-State National Seismic Hazard Model"
    source: "Earthquake Spectra, DOI: 10.1177/87552930231215428"
    year: 2023
  - id: "usgs-asce7-22-values"
    type: "project-data"
    title: "USGS ASCE 7-22 Design Ground Motions for Burleson County, TX"
    source: "USGS Design Ground Motions Portal (lat 30.499, lon -96.621)"
    year: 2024
  - id: "oklahoma-induced-reduction-2024"
    type: "peer-reviewed"
    title: "Reduced Injection Rates and Shallower Depths Mitigated Induced Seismicity in Oklahoma"
    source: "USGS / Seismological Society of America"
    year: 2024
  - id: "shahzad-mscss-2022"
    type: "peer-reviewed"
    title: "Response control analysis of a new mega-subcontrolled structural system (MSCSS) under seismic excitation"
    source: "The Structural Design of Tall and Special Buildings (Wiley)"
    year: 2022
  - id: "rrc-seismicity-response-2025"
    type: "government"
    title: "Seismicity Review and Response: Disposal Well Permitting"
    source: "Texas Railroad Commission"
    year: 2025
  - id: "wu-shanghai-monitoring-2021"
    type: "peer-reviewed"
    title: "Monitoring dynamic characteristics of 600 m+ Shanghai Tower during two consecutive typhoons"
    source: "Structural Control and Health Monitoring (Wiley)"
    year: 2021
  - id: "nist-brb-2015"
    type: "government"
    title: "Seismic Design of Steel Buckling-Restrained Braced Frames"
    source: "NIST GCR 15-917-34"
    year: 2015
cross_references:
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "structural-engineering/foundation-systems/foundation-systems"
    relationship: "depends-on"
  - slug: "structural-engineering/materials/materials-at-scale"
    relationship: "depends-on"
  - slug: "mechanical-electrical/elevators/vertical-transport"
    relationship: "informs"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "informs"
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "informs"
  - slug: "institutional-design/governance/binding-hierarchy"
    relationship: "informs"
open_questions:
  - "Can distributed mid-story isolation between major tiers outperform passive damping for a terraced ziggurat, and what displacement capacities are needed at isolation interfaces given that current bearing technology maxes out at approximately ±572 mm?"
  - "What active control architecture — sensor redundancy, power independence, failsafe modes — would be needed to provide acceptable fallback behavior during simultaneous earthquake and infrastructure disruption?"
  - "What computational framework can model soil-structure interaction for a 5.6 km foundation footprint where the structure is comparable in size to the seismic wavelengths?"
  - "Should the Arcology's seismic hazard characterization incorporate induced seismicity explicitly, given the USGS NSHM policy of excluding it from long-term probabilistic models?"
assumptions:
  - "Target population of approximately 10 million residents"
  - "Terraced ziggurat form with 3.5-mile base and ~5,000 ft peak height"
  - "Structure located in Burleson County, Texas — USGS ASCE 7-22 classifies as Seismic Design Category A (lowest), PGA 0.037g for 2,475-year return period"
  - "Structural segmentation with seismic joints between major zones is assumed necessary"
  - "Distributed damping approach rather than single concentrated TMD"
  - "Design governed by Performance-Based Seismic Design framework, not prescriptive code"
  - "Induced seismicity hazard must be considered as supplementary to tectonic hazard, despite USGS NSHM exclusion"
parameters:
  - name: "fundamental_period_s"
    value: 14
    unit: "seconds (estimated range 12-18, extrapolated from CTBUH empirical formula)"
    confidence: 2
  - name: "site_pga_2475yr_g"
    value: 0.037
    unit: "g (USGS ASCE 7-22, 2,475-year return period, excludes induced seismicity)"
    confidence: 3
  - name: "site_sds_g"
    value: 0.055
    unit: "g (USGS ASCE 7-22 design short-period spectral acceleration)"
    confidence: 3
  - name: "site_sd1_g"
    value: 0.043
    unit: "g (USGS ASCE 7-22 design 1-second spectral acceleration)"
    confidence: 3
  - name: "seismic_design_category"
    value: "A"
    unit: "(lowest classification under ASCE 7-22)"
    confidence: 3
  - name: "interstory_drift_limit_mce_pct"
    value: 3.0
    unit: "% (PEER TBI standard for MCE)"
    confidence: 2
  - name: "peak_floor_acceleration_target_g"
    value: 0.15
    unit: "g (SLE target, current tall building standard)"
    confidence: 2
  - name: "seismic_joint_displacement_mm"
    value: 750
    unit: "mm (estimated range 500-1000; exceeds current bearing technology at ±572 mm)"
    confidence: 2
  - name: "wave_traverse_time_s"
    value: 2
    unit: "seconds (range 1-3 across 5.6 km footprint)"
    confidence: 2
  - name: "tallest_seismic_designed_m"
    value: 632
    unit: "meters (Shanghai Tower, current record)"
    confidence: 3
  - name: "height_scale_factor"
    value: 2.4
    unit: "x (Arcology height / tallest seismically designed)"
    confidence: 2
  - name: "burleson_county_max_magnitude"
    value: 3.8
    unit: "M (strongest recorded, November 2022)"
    confidence: 3
  - name: "burleson_county_quake_count"
    value: 14
    unit: "events above M2.0 since 1970 (updated April 2024)"
    confidence: 3
  - name: "largest_tmd_mass_tonnes"
    value: 660
    unit: "metric tonnes (Taipei 101)"
    confidence: 3
  - name: "torre_mayor_damper_count"
    value: 98
    unit: "viscous fluid dampers"
    confidence: 3
  - name: "japan_base_isolated_buildings"
    value: 4100
    unit: "buildings (as of 2015)"
    confidence: 3
  - name: "mscss_acceleration_reduction_pct"
    value: 49.7
    unit: "% (average structural acceleration reduction under El Centro earthquake)"
    confidence: 2
  - name: "oklahoma_regulation_reduction_factor"
    value: 4.4
    unit: "x (reduction in M3+ earthquake rates from well plug-backs)"
    confidence: 3
---

Burleson County, Texas has recorded 14 earthquakes above M2.0 since 1970, the strongest a M3.8 in November 2022 — likely induced by oil and gas wastewater injection. The most recent event, a M2.8 on April 1, 2024, occurred at 30 km depth south of Carmine — consistent with basement fault reactivation patterns seen in induced seismicity elsewhere. By any seismic hazard measure, this is quiet ground. The USGS ASCE 7-22 web service returns a peak ground acceleration of 0.037g for the 2,475-year return period at the Burleson County site (lat 30.499, lon -96.621), classifying it as Seismic Design Category A — the lowest possible classification under the current building code (usgs-asce7-22-values). This is substantially lower than the earlier estimate of 0.05-0.10g: the site is even quieter than originally characterized. For a conventional building, the seismic design requirements would be essentially negligible.

Arcology One is not a conventional building. A terraced ziggurat reaching 5,000 feet (1,524m) with a 3.5-mile base will have a fundamental period estimated between 12 and 18 seconds — a range derived from extrapolating the empirical period-height formula T₁ = 0.3√H to 0.4√H, validated against 414 Chinese tall buildings (xiao-period-height-2014) and confirmed against measured data from the Burj Khalifa (11.3 seconds at 828m) and Shanghai Tower (approximately 9 seconds at 632m, measured during typhoon monitoring; wu-shanghai-monitoring-2021). At H = 1,524m, the formula yields 11.7-15.6 seconds, but the Arcology's terraced form — wider and stiffer at the base, narrowing through upper tiers — introduces structural dynamics that no empirical formula captures. The upper bound of 18 seconds accounts for the structure's extraordinary mass and the uncertainty inherent in extrapolating 2.4x beyond the tallest validated data point. The structure's mass will be measured in billions of tons. Even at 0.037g, the inertial forces are staggering: a simplified estimate puts the equivalent static base shear at hundreds of millions of tons-force. No seismic code, no ground motion model, and no computational framework has been validated for a structure at this scale. The low site hazard is the design's greatest asset. The fundamental uncertainty is whether the engineering tools developed for 600-meter buildings can be extended to a structure 2.4 times taller, orders of magnitude more massive, and qualitatively different in its dynamic behavior.

## A Building with a 14-Second Heartbeat

A structure's fundamental period — the time it takes to complete one full oscillation — scales roughly with the square root of height. A study of 414 tall buildings in China established empirical reference ranges: T₁ = 0.3√H to 0.4√H for structures above 250m (xiao-period-height-2014). This formula accurately predicts measured periods for every supertall building with published data: the Burj Khalifa at 828m measures 11.3 seconds (mode 1) against a predicted range of 8.6-11.5 seconds (burj-khalifa-structural-2014); the Shanghai Tower at 632m measures approximately 9 seconds against a predicted 7.5-10.1 seconds (wu-shanghai-monitoring-2021). Extrapolating to 1,524m yields 11.7-15.6 seconds, but this extrapolation is 2.4x beyond any validated data point and assumes conventional tower geometry. The Arcology's terraced ziggurat distributes mass differently — enormous base stiffness but progressively more flexible upper tiers — making the effective period uncertain. An estimated range of 12-18 seconds, centered at 14 seconds, reflects both the empirical extrapolation and the structural uncertainty.

This range creates three problems that compound each other.

First, the codes stop working. ASCE 7's seismic provisions, the PEER TBI Guidelines (peer-tbi-2017), and every ground motion prediction equation in the NGA-West2 and NGA-East databases were developed for and validated against structures with periods below roughly 10 seconds. At 14 seconds, the spectral shape — the relationship between period and expected ground acceleration — is poorly constrained. The 2023 USGS National Seismic Hazard Model (petersen-nshm-2023) updated ground motion models for the central and eastern US using NGA-East GMMs, but noted systematic misfit in the Texas-Oklahoma-Kansas region specifically, with overprediction at short periods compared to observed data. For the low-seismicity Central Texas tectonic environment, there is essentially no empirical data at very long periods. Designing for a ground motion you cannot characterize is not engineering. It is estimation.

Second, the higher modes dominate the lived experience. While the fundamental mode controls overall structural drift, higher vibration modes — with periods in the 1-5 second range — control the accelerations that occupants feel and that nonstructural systems must survive. These shorter periods fall squarely in the peak amplification range for most earthquakes. A resident on Tier 8 could experience floor accelerations of 0.5-1.0g during a moderate earthquake even if the ground-level PGA is a modest 0.037g. The current performance target for tall buildings is a peak floor acceleration below 0.15g at the Service Level Earthquake, with interstory drift limited to 3.0% at the Maximum Considered Earthquake level per PEER TBI guidelines. Achieving both targets throughout the Arcology — controlling accelerations in upper tiers while keeping drift within limits across hundreds of floors — would require damping at a scale that has never been attempted (ctbuh-seismic-supertall).

Third, near-field pulse motions from any induced seismicity could deliver significant energy content at very long periods. An induced earthquake directly beneath the structure — shallow, close — could produce velocity pulses that couple efficiently with the Arcology's fundamental mode in ways that a distant tectonic earthquake would not.

## What Seismic Engineering Has Proven

The tallest seismically designed structure on Earth is the Shanghai Tower at 632 meters, built in a moderate seismic zone (PGA ~0.07g). Its mega-frame — eight composite mega-columns connected to a reinforced concrete core by outrigger trusses — was validated through full nonlinear time-history analysis using 14+ ground motion records and designed for three-level seismic performance: frequent, moderate, and rare earthquakes. Field monitoring during Typhoons Jongdari and Yagi in August 2018 confirmed the first two modal frequencies at approximately 0.11 Hz and 0.15 Hz (periods of ~9.1 and ~6.7 seconds), validating the computational models (wu-shanghai-monitoring-2021). The mega-frame concept with outrigger trusses represents one plausible starting point for the Arcology's lateral system, though the Arcology's terraced form (structural-engineering/superstructure/primary-geometry) demands a fundamentally different structural topology.

The Burj Khalifa (828m, Dubai) sits in a seismic zone comparable to Burleson County — UBC Zone 2A, roughly Z=0.15. Its Y-shaped buttressed core system on 194 piles was designed for a M7.0 event and includes the OASIS real-time structural health monitoring system for earthquake detection (burj-khalifa-structural-2014). The measured fundamental period of 11.3 seconds (mode 1 lateral sway) and 10.2 seconds (mode 2 perpendicular lateral) provide the best empirical data point for extrapolating to Arcology scale. The Burj demonstrates that supertall construction in moderate-seismic zones is proven. But the Arcology is 1.8 times taller, its mass is not meaningfully comparable, and the Burj's design methodology assumed a single coherent structural system — an assumption that may not hold across a 5.6 km footprint.

Taipei 101 (508m) sits in one of the most seismically active zones on Earth and has survived multiple M6+ earthquakes. Its 660-metric-ton pendulum tuned mass damper — the largest in the world — reduces peak accelerations by approximately 40%. But a single TMD targets a single mode. The Arcology's distributed mass and multiple critical modes demand a fundamentally different damping philosophy.

Torre Mayor (225m, Mexico City) is perhaps the most instructive precedent. Its 98 viscous fluid dampers, integrated directly into the structural frame, allowed the building to survive a M7.6 earthquake in 2003 with zero structural damage and no disruption to occupants. The dampers converted earthquake energy to heat. This distributed, passive approach — many dampers embedded throughout the structure rather than one massive device at the top — is the conceptual model for Arcology-scale seismic protection.

## From One Pendulum to a Thousand Dampers

The shift from Taipei 101's single 660-tonne pendulum to something that works for the Arcology is not incremental. It is a concept change. The Arcology needs a distributed damping system: hundreds or thousands of viscous fluid dampers, buckling-restrained braces (BRBs), and possibly distributed fluid harmonic devices installed throughout the structural frame.

Viscous fluid dampers are mature technology. Taylor Devices has installed them in 50+ tall buildings worldwide. They are velocity-dependent — they produce force proportional to how fast they are deforming — which means they are most effective at the velocities and story drifts produced by earthquake loading. BRBs provide a complementary mechanism: steel braces encased in concrete-filled sleeves that yield in both tension and compression without buckling, dissipating energy through controlled plastic deformation. Both technologies are commercially available and have decades of field validation (nist-brb-2015). The Wilshire Grand Center in Los Angeles (335m, 1,100 feet) — the tallest structure in a high-seismic zone — uses the largest BRBs ever installed for seismic protection, arranged in three rings of multi-story buckle-resistant braces around a massive rectangular core. The first BRB installation was completed in Tokyo in 1989; thousands are now deployed globally.

The engineering question is integration at city scale. A conventional tall building might use 50-200 dampers. The Arcology might need 5,000-50,000, distributed across structural zones, tuned for different modal contributions, and maintained over a 200-year service life. The damper replacement and maintenance program alone becomes a permanent infrastructure operation. The power budget (energy-systems/grid-architecture/power-budget) must account for the monitoring systems that keep this network functional.

Research on the Mega-Sub Controlled Structural System (MSCSS) offers a direct conceptual model. The MSCSS subdivides a mega-structure into mega-frame and sub-structures that move relative to each other, using the mass differential as a tuning mechanism. Analytical studies show 42-70% reduction in structural accelerations at the mega-frame level and 20-65% at the substructural level, with an average acceleration reduction of 49.7% under El Centro earthquake loading (shahzad-mscss-2022). The concept maps naturally to the Arcology's tiered form: each major tier could function as a sub-structure with controlled relative motion against the primary mega-frame.

Japan provides the closest model for thinking about seismic protection as a system rather than a building feature. As of 2015, Japan had 4,100+ base-isolated buildings and 1,300+ buildings with response control systems (japan-seismic-control-2019). The 2011 Tohoku M9.0 earthquake — felt as far as Tokyo, 170 km away — provided real-world validation: buildings with passive control systems performed significantly better than conventional construction. Japan's national approach to damper deployment, monitoring, and maintenance at portfolio scale is the closest existing model for how the Arcology would need to manage its seismic protection infrastructure.

## Isolation Between the Tiers

The Arcology's terraced ziggurat form creates a structural opportunity that a straight tower does not: natural interfaces for isolation layers.

Base isolation — placing the entire building on flexible bearings — is proven for structures up to roughly 20 stories. Japan leads with thousands of isolated buildings. The largest isolated structure is the Sabiha Gokcen Airport terminal (300 isolators, designed for M8.0). But base isolation for the Arcology is almost certainly impractical: the structure's weight would require isolators supporting millions of tons per bearing, far beyond any existing technology.

Mid-story isolation is more promising. Research published in Nature Scientific Reports demonstrates that triple-layer isolation devices placed at multiple heights in super-high-rise buildings outperform both single-story and double-layer isolation under rare earthquake conditions, with the isolated structure's natural frequency reduced to as little as 12.5% of the non-isolated structure (nature-triple-isolation-2023). A 2024 composite isolation study showed no obvious structural damage under PGA = 0.82g, and minimal frequency degradation even under PGA = 1.27g. The concept of mega-sub control systems — where the building is subdivided into mega-structure and sub-structures that move relative to each other — has shown 42-70% reduction in peak accelerations in analytical testing (shahzad-mscss-2022).

The ziggurat form makes this natural. Each major tier transition is a candidate location for an isolation layer. Ten tiers means up to nine potential isolation interfaces, each allowing controlled relative motion between the structural zones above and below. The materials at each interface would need to accommodate the expected displacements — an estimated 500-1000 mm of seismic joint travel, with 750 mm as the current planning midpoint (structural-engineering/materials/materials-at-scale). Current bearing technology falls short: MAURER SIP-D double-concave sliding isolation pendulum bearings — among the most advanced available — were tested to ±572 mm displacement at 1 m/s velocity for the Portland International Airport expansion in 2024, the largest displacement test documented for building isolation bearings. The Arcology's 750 mm midpoint estimate exceeds current tested capacity by approximately 30%, requiring either new bearing designs or distributed isolation strategies that reduce per-bearing displacement demands.

This is the most architecturally distinctive seismic strategy available to the Arcology. But it is also the least validated. No full-scale multi-story isolation system has been built. The displacement demands at isolation layers — particularly for utility crossings serving millions of people — are an unsolved interface engineering problem. Every water pipe, electrical conduit, elevator shaft, and fire stair that crosses a seismic isolation joint must accommodate hundreds of millimeters of relative motion without rupture. The water systems (environmental-systems/water/closed-loop-water) and vertical transport (mechanical-electrical/elevators/vertical-transport) entries both inherit this constraint directly.

## When the Foundation Is the Wavelength

Conventional seismic analysis assumes uniform ground motion at the base of the structure — the entire foundation moves together. For a building with a 50-meter footprint, this is reasonable. For the Arcology's 5.6 km footprint, it is physically wrong.

Seismic waves in rock travel at 2-5 km/s. At the slower end, a wave takes approximately 2-3 seconds to traverse the Arcology's base. At the faster end, roughly 1 second. During those 1-3 seconds, different points of the foundation are experiencing different ground accelerations simultaneously — the east side might be moving up while the west side is moving down. This is called spatially variable ground motion, and it is typically a concern only for long-span bridges and nuclear power plants. For the Arcology, it is a defining design condition.

Standard soil-structure interaction (SSI) methods — impedance functions, substructure approaches — model the foundation as a rigid body interacting with a deformable soil half-space (ssi-review-2023). When the foundation is comparable in size to the seismic wavelengths, this assumption breaks. The foundation itself deforms. The structure's mass alters local seismic wave propagation — it becomes a geological feature that scatters and diffracts incoming waves. The foundation systems entry (structural-engineering/foundation-systems/foundation-systems) documents the challenges of transmitting gravity loads through Gulf Coastal Plain clay. Seismic base shear adds a lateral load component that couples directly with those challenges: every ton of lateral force must be resisted by the same pile-soil system already strained by billions of tons of gravity load.

Multi-support excitation methods from bridge engineering provide a theoretical framework, but they have never been applied to a structure of this geometry or mass. New computational approaches — likely combining finite element and spectral element methods on high-performance computing clusters — would be needed. The simulation tools exist. OpenSees and PERFORM-3D can model nonlinear structural response. But a full nonlinear time-history analysis of a model this large, with spatially variable input motion and realistic SSI, would be among the largest structural simulations ever attempted.

## Induced Seismicity: A Hazard That Moves

The 14 earthquakes recorded near Burleson County since 1970 are almost certainly linked to oil and gas wastewater injection. TexNet — the Texas Seismological Network operated by the Bureau of Economic Geology at UT Austin — monitors this actively (texnet-monitoring). The M3.8 event in November 2022 was the strongest. The most recent event, a M2.8 on April 1, 2024, occurred at 30 km depth — consistent with basement fault reactivation, the same mechanism driving larger induced earthquakes in the Permian Basin. These are small earthquakes. But they represent a hazard category that natural tectonic seismicity does not: one that changes over time as human activity evolves.

The regulatory landscape is actively shifting. The Texas Railroad Commission has designated three Seismic Response Areas — Northern Culberson-Reeves, Stanton, and Gardendale — all in the Permian Basin (rrc-seismicity-response-2025). No SRA exists for Central Texas despite the recorded seismicity near Burleson County. In June 2025, the RRC released its most significant regulatory expansion to date: new Permian Basin disposal well guidelines requiring expanded areas of review (quarter-mile to half-mile radius), injection pressure limits, and daily volume caps. A $1.3 million Underground Injection Well Investigation Team was established to support enforcement.

Oklahoma provides the most relevant regulatory analog. In 2015, the Oklahoma Corporation Commission mandated plug-back of wells injecting into the lower Arbuckle formation — cement backfill preventing fluid from reaching basement rock. A 2024 USGS peer-reviewed study quantified the result: without the plug-backs, Oklahoma's 2024 seismicity rate would be approximately 4.4 times larger than observed (oklahoma-induced-reduction-2024). The peak of 888 M3+ earthquakes in 2015 has been dramatically reduced. Researchers explicitly note this strategy "could be an effective strategy elsewhere," citing the Permian Basin specifically.

For the Arcology, these regulatory developments matter in two ways. First, the USGS 2023 National Seismic Hazard Model explicitly excludes induced earthquakes from its long-term probabilistic model, treating them as "transient" (petersen-nshm-2023). This is a deliberate policy choice: "induced earthquakes are not included in these policy-based models because they are generally transient features of the seismicity, and mitigation actions can translate into rapid changes in earthquake rates." The ASCE 7-22 building code uses the 2018 NSHM — which also excludes induced seismicity — and returns a PGA of 0.037g for Burleson County (usgs-asce7-22-values). This means the code-basis hazard value understates the realistic site hazard by an unquantified margin for any location near active disposal wells.

Second, the Oklahoma experience demonstrates that induced seismicity is manageable through regulation — but the regulation must exist. Burleson County has no designated SRA, no formal investigation of the injection-seismicity connection, and the April 2024 M2.8 event has not triggered regulatory attention. For a structure intended to last centuries, housing 10 million people, the design must accommodate a hazard that is not fixed by geology but influenced by regulation, economics, and energy policy. The hazard characterization must either be conservative enough to envelope any plausible future scenario or the structure must be designed for adaptive capacity — structural margins and monitoring systems that allow the seismic protection to be upgraded if the hazard evolves. The latter approach has no precedent in building design, though it has parallels in nuclear safety philosophy.

Machine learning approaches to earthquake engineering are advancing rapidly (ml-earthquake-engineering-2025). Real-time structural control — magnetorheological dampers whose properties can be adjusted in milliseconds based on incoming ground motion data — could theoretically optimize the Arcology's seismic response during an earthquake. The question is whether active systems are acceptable for a city of 10 million people. If the control algorithm fails, or if the power supply is interrupted during the earthquake, or if the sensor network produces corrupted data, the consequences are catastrophic. For the Arcology, the baseline seismic protection must be purely passive — systems that work without power, computation, or human intervention. Active systems can supplement but never replace passive resilience.

## Writing the Code for a Structure That Has No Code

No building code addresses structures above approximately 1,000 meters. The CTBUH Seismic Design Working Group is developing guidance for supertall buildings, but fundamentally, every megatall building designed today is a bespoke engineering exercise governed by Performance-Based Seismic Design principles (peer-tbi-2017). The design team defines performance objectives, develops site-specific hazard analyses, selects ground motions, performs nonlinear analyses, and establishes acceptance criteria. For the Burj Khalifa, this was a major but bounded effort. For the Arcology, it means writing an entire structural design code for a single structure.

The PBSD framework assumes you can model the structure's nonlinear response with sufficient fidelity to predict performance. For a 600-meter building, decades of research, shake-table testing, and post-earthquake reconnaissance have validated this assumption. For a 1,524-meter terraced ziggurat with distributed isolation layers, spatially variable ground motion, and soil-structure interaction at geological scales, the assumption is untested. You cannot validate the model against field data because no field data exists. You cannot run a shake-table test because no table can accommodate even a scaled model of this complexity. You are left with computational prediction — enormous, expensive, state-of-the-art computational prediction — with no empirical anchor.

This is the honest engineering position: the seismic design of the Arcology is feasible in the sense that the physics is understood, the tools conceptually exist, and the site hazard is genuinely low — lower than originally estimated, at 0.037g PGA per the USGS rather than the earlier 0.05-0.10g range. It is not feasible in the sense that anyone can currently demonstrate, to the standard of confidence required for a 10-million-person structure, that the design will perform as intended. The gap between those two statements is where the hardest work lives. Closing it would require a site-specific probabilistic seismic hazard analysis extended to 20+ second periods (with induced seismicity explicitly included, contrary to current NSHM practice), a new generation of SSI models validated against the only available analog — geological features that scatter seismic waves — and a design philosophy that treats seismic resilience not as a static engineering deliverable but as a continuously monitored, potentially upgradable system capability that evolves with the structure over centuries.
