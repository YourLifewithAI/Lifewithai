---
id: "institutional-design/security/security-architecture"
title: "Security Architecture for a Vertical City"
domain: "institutional-design"
subdomain: "security"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-26"
updated: "2026-03-08"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["security", "access-control", "cybersecurity", "surveillance", "evacuation", "resilience", "cascading-failure", "physical-security", "BMS", "IoT-security", "CPTED"]
summary: "Security architecture for Arcology One must address physical security, cybersecurity, emergency response, and cascading failure resilience simultaneously — at a scale where every existing assumption breaks. The hardest challenges are not technological but architectural: no reference design exists for securing a 10-million-person, 5,000-foot structure with 50-100 million networked devices."
citations:
  - id: "burj-khalifa-security-2010"
    type: "project-data"
    title: "Integrated Security System Helps Protect Burj Khalifa"
    source: "Security Advisor Middle East"
    year: 2010
  - id: "forescout-2025"
    type: "industry"
    title: "2025 Report: Device Vulnerabilities Across IT, IoT, OT, and IoMT"
    source: "Forescout Technologies"
    year: 2025
  - id: "nozomi-niagara-2024"
    type: "industry"
    title: "Critical Vulnerabilities Found in Tridium Niagara Framework"
    source: "Nozomi Networks"
    year: 2024
  - id: "nist-elevator-evac-2013"
    type: "peer-reviewed"
    title: "Use of Elevators for Evacuation in Fire Emergencies"
    source: "NIST Technical Note 1825"
    year: 2013
  - id: "chester-resilience-2026"
    type: "peer-reviewed"
    title: "Ramping Up Resilience for Critical Infrastructure"
    source: "Arizona State University"
    year: 2026
  - id: "jewel-changi-mozart-2023"
    type: "project-data"
    title: "Mozart Smart Operations Centre: Integrated Building Management"
    source: "Jewel Changi Airport"
    year: 2023
  - id: "neom-cybersecurity-2024"
    type: "news"
    title: "How Saudi Arabia is Securing its $500 Billion Smart City NEOM"
    source: "CIO"
    year: 2024
  - id: "simoes-bacs-security-2021"
    type: "peer-reviewed"
    title: "Security of Building Automation and Control Systems: Survey and Future Research Directions"
    source: "Computers & Security"
    year: 2021
  - id: "dhs-bips-2012"
    type: "project-data"
    title: "Building and Infrastructure Protection Series"
    source: "Department of Homeland Security"
    year: 2012
  - id: "cpted-atlas-2023"
    type: "peer-reviewed"
    title: "21st Century Security and CPTED: Designing for Critical Infrastructure Protection"
    source: "Atlas Publications"
    year: 2023
  - id: "memoori-iot-buildings-2025"
    type: "industry"
    title: "IoT Devices in Smart Commercial Buildings 2025 to 2030"
    source: "Memoori"
    year: 2025
  - id: "comparitech-surveillance-2024"
    type: "industry"
    title: "Surveillance Camera Statistics: Which City has the Most CCTV?"
    source: "Comparitech"
    year: 2024
  - id: "hoff-cascading-asce-2025"
    type: "peer-reviewed"
    title: "Cascading Failure Propagation and Perfect Storms in Interdependent Infrastructures"
    source: "ASCE OPEN: Multidisciplinary Journal of Civil Engineering"
    year: 2025
  - id: "dod-zt-ot-2025"
    type: "government"
    title: "Zero Trust for Operational Technology Activities and Outcomes"
    source: "Department of Defense Chief Information Office"
    year: 2025
  - id: "fbi-police-employment-2022"
    type: "government"
    title: "Police Employment, Officers Per Capita Rates for U.S. Cities"
    source: "FBI Uniform Crime Reporting / Governing.com"
    year: 2022
  - id: "eu-ai-act-biometrics-2024"
    type: "government"
    title: "EU AI Act: Regulation on Artificial Intelligence — Article 5 Prohibited Practices"
    source: "European Parliament"
    year: 2024
cross_references:
  - slug: "institutional-design/governance/binding-hierarchy"
    relationship: "depends-on"
  - slug: "ai-compute-infrastructure/ai-governance/ai-governance-framework"
    relationship: "depends-on"
  - slug: "ai-compute-infrastructure/network/network-backbone"
    relationship: "depends-on"
  - slug: "ai-compute-infrastructure/data-centers/compute-overview"
    relationship: "depends-on"
  - slug: "mechanical-electrical/fire-life-safety/fire-life-safety"
    relationship: "extends"
  - slug: "mechanical-electrical/elevators/vertical-transport"
    relationship: "informs"
  - slug: "environmental-systems/hvac/atmospheric-control"
    relationship: "informs"
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "informs"
open_questions:
  - "How do you design access control for millions of zone-transition events per hour without creating bottlenecks?"
  - "What governance structure balances comprehensive surveillance with civil liberties for 10 million permanent residents?"
  - "What simulation fidelity and domain model resolution is required for pre-construction validation of cascading failure resilience, given that real interdependency patterns emerge only in operation?"
  - "How should security AI systems make autonomous decisions in life-safety emergencies?"
  - "What regulatory framework certifies security architecture with no precedent?"
  - "How should the Arcology's privacy-security framework navigate jurisdictional conflicts between EU-style biometric restrictions and the operational requirements of ambient identity verification?"
assumptions:
  - "Population of 10 million permanent residents"
  - "Structure height of 5,000 feet (1,524 meters) with 400+ effective floors"
  - "50-100 million networked IoT devices (5-10 devices per person)"
  - "Full evacuation is infeasible; defend-in-place is the governing emergency philosophy"
  - "Security architecture must be designed from scratch, not retrofitted"
  - "Both human and AI agents participate in security operations"
parameters:
  - name: "population"
    value: 10000000
    unit: "permanent residents"
    confidence: 2
  - name: "building_height_m"
    value: 1524
    unit: "meters (5,000 feet)"
    confidence: 2
  - name: "iot_devices_estimated"
    value: 75000000
    unit: "devices (range: 50-150 million)"
    confidence: 2
  - name: "access_events_per_hour_peak"
    value: 10000000
    unit: "zone-transition events (estimated peak, based on 10 transitions/person/day)"
    confidence: 1
  - name: "surveillance_cameras_estimated"
    value: 500000
    unit: "cameras (range: 300,000-750,000)"
    confidence: 2
  - name: "bms_vulnerability_rate_industry"
    value: 75
    unit: "percent with known vulnerabilities"
    confidence: 3
  - name: "bms_vulnerability_rate_target"
    value: 1
    unit: "percent (clean-sheet zero-trust design)"
    confidence: 2
  - name: "stair_evacuation_time_full_height"
    value: 180
    unit: "minutes per person (no congestion)"
    confidence: 2
  - name: "security_operations_centers"
    value: 13
    unit: "distributed centers (10 tier-level + 1 subterranean + 1 central GSOC + 1 backup)"
    confidence: 2
  - name: "internal_security_personnel"
    value: 25000
    unit: "personnel (2.5 per 1,000 residents, consistent with U.S. national average)"
    confidence: 2
---

## The Scale Problem

The Arcology's security challenge is not primarily technological — it is architectural. Every component technology exists: AI video analytics, biometric access control, building automation cybersecurity, evacuation modeling, unified security platforms. The problem is that no existing design integrates these components at anything approaching the required scale.

The Burj Khalifa — the world's tallest building — manages integrated security for approximately 25,000 daily occupants across 160 floors. The Arcology requires security for 10 million permanent residents across 400+ effective floors. This is not 400x the scale. It is a different category of problem, where assumptions that work for single buildings fail systematically.

Consider access control. The Burj Khalifa uses card-controlled elevator access from the parking garage and integrated surveillance that activates automatically when unauthorized persons enter secure areas. At 25,000 people, this works. At 10 million people, with potentially millions of zone transitions per hour across residential, commercial, restricted, and public spaces, the same approach creates impossible bottlenecks. The Arcology needs frictionless continuous identity verification — not checkpoints but ambient awareness of who is where, validated without requiring people to stop.

## Five Security Domains

Security architecture for the Arcology spans five interlocking domains, each with distinct challenges:

**Physical security** encompasses access control, perimeter defense, surveillance, and blast protection. Crime Prevention Through Environmental Design (CPTED) provides the conceptual framework — natural surveillance, territorial reinforcement, access control through spatial design. First-generation CPTED demonstrated 17-76% crime reductions depending on intervention mix. Third-generation CPTED (SafeGrowth) adds community governance and social cohesion, recognizing that purely technological security creates backlash. At Arcology scale, both are necessary: technology for coverage, community design for legitimacy.

**Cybersecurity** addresses the convergence of IT networks and operational technology (OT) building systems. Traditional buildings separate these domains — data networks in one silo, HVAC and elevators in another. The Arcology's systems are too interdependent for this separation. HVAC depends on power distribution, which depends on water cooling, which depends on AI control systems. A successful attack on any leg can cascade across all of them. Current industry reality is uncomfortable: 75% of organizations have building management system (BMS) devices with known exploited vulnerabilities. Protocols like BACnet and KNX were designed for reliability, not security. BACnet Secure Connect addresses this, but legacy assumptions pervade the ecosystem.

**Emergency response** at this scale cannot mean evacuation. A healthy person descends roughly one floor per 30 seconds by stairs; 400+ floors would take over 3 hours per person assuming zero congestion. With 10 million people, stairwell capacity is orders of magnitude insufficient. The 2009 International Building Code introduced mandatory evacuation elevators above 420 feet, but even elevator-assisted evacuation assumes a building that can be emptied. The Arcology's emergency philosophy must be compartmentalized shelter-in-place — the same paradigm governing fire safety extends to security incidents.

**Resilience** addresses cascading failures — the interconnected collapse that occurs when one system's failure triggers others. Research at ASU shows infrastructure failures "rarely affect a single system in isolation." A power failure in the Arcology affects HVAC, water pumping, elevators, communications, and security systems simultaneously. There is no surrounding city to absorb refugees or provide backup services. Resilience requires not just redundancy but graceful degradation — systems designed to lose capability incrementally rather than catastrophically.

**Governance** is the non-technical domain that may be hardest. Heavy surveillance and access control in a permanent residential community can create an oppressive environment. The NEOM megaproject has drawn criticism for surveillance overreach. Research on high-density housing shows security issues increase with building height — 5.3% of crime occurs in interior spaces for 3-story buildings versus 37.3% for buildings 13-30 stories. At 400+ stories, these dynamics are unexplored. The Arcology cannot function as a panopticon; security architecture must balance safety with freedom of movement and privacy.

## The Cyber-Physical Convergence Problem

The most technically challenging security domain is the convergence of cyber and physical systems. In a conventional building, hacking the HVAC system is an inconvenience. In the Arcology, compromising HVAC means compromising life support for 10 million people. The attack surface is enormous: at 5-10 IoT devices per person — environmental sensors, smart home systems, building controls — the Arcology could have 50-150 million networked endpoints. Each is a potential entry point. Memoori projects that IoT devices in commercial buildings alone will reach 4.12 billion globally by 2030, growing at 13% CAGR from ~2 billion in 2024. The Arcology's per-area density will far exceed this average: its 79.7 billion gross square feet of instrumented space requires HVAC sensors every 500-1,000 sqft, fire detectors per code every 400-1,000 sqft, environmental monitors, structural health sensors, and lighting controls — yielding 50-100 million building-managed devices before counting personal devices.

Nozomi Networks discovered 13 vulnerabilities in Tridium's Niagara Framework, which powers over 1 million building automation installations globally. These vulnerabilities could allow attackers to alter building processes, disable critical systems, or trigger outages. The Niagara Framework is considered best-in-class. The underlying problem is not any single product but the protocol ecosystem: BACnet, KNX, Modbus, and similar industrial protocols were designed when building systems were air-gapped. The assumption of physical isolation baked into these protocols is now false.

The Arcology's advantage is clean-sheet design. Retrofitting security onto legacy systems is far harder than building secure from the start. Zero-trust architecture — where no device, user, or system is inherently trusted — must be foundational, not layered on. This means microsegmentation: every device class, every control system, every data flow operates in its own security domain with explicit policy governing cross-domain communication. An HVAC controller compromised in Sector 7 cannot see, much less attack, water systems in Sector 12.

Current tools make this achievable. Platforms like Nozomi Networks and Darktrace apply AI-powered monitoring to OT environments, detecting anomalous behavior patterns that signature-based security misses. The challenge is scale: monitoring 50-150 million devices requires hierarchical AI systems with edge processing in each sector feeding into distributed security operations centers.

The DoD's November 2025 guidance on zero trust for operational technology — covering industrial control systems, building automation, and physical access control — defines 105 zero-trust activities across seven pillars (users, devices, applications, data, networks, automation, and visibility), with 84 activities at the minimum "target level." This framework, while designed for military installations, provides the most comprehensive blueprint for clean-sheet OT security architecture available. The Arcology's advantage is that it can implement all 105 activities from day one rather than retrofitting legacy systems — the primary obstacle the DoD guidance was designed to address.

## Access Control at Population Scale

The checkpoint model of access control — badge readers at doors, turnstiles at entries — works when access events number in thousands per hour. At millions of events per hour, it creates congestion that undermines the building's function.

The alternative is continuous ambient verification. Instead of authenticating at checkpoints, the system maintains persistent awareness of identity and location. Biometric systems evolve from touch-based (fingerprint readers) to contactless (facial recognition, gait analysis). Combined with device-based identity (personal devices serving as continuous tokens), the system knows who is where without requiring people to stop.

This raises immediate governance concerns. A facial recognition database of 10 million residents is both a high-value attack target and a civil liberties concern. The EU AI Act, effective February 2025, specifically prohibits real-time remote biometric identification in public spaces, with narrow exemptions only for law enforcement searching for missing persons, preventing imminent threats, or investigating serious crimes — and even these require prior judicial authorization and fundamental rights impact assessments. Illinois BIPA requires explicit consent for biometric data collection. The Arcology's ambient verification system — continuous, building-wide, covering all residents — falls outside every existing regulatory exemption. It will need its own privacy-security framework, and it will be politically contentious regardless of technical elegance.

Current biometric gate systems achieve throughput of approximately 500 travelers per hour per kiosk, with facial verification completing in under 2 seconds. But the Arcology requires not gate-based verification but ambient continuous monitoring — an approach that eliminates throughput bottlenecks entirely at the cost of requiring vastly more sensors and raising proportionally greater privacy concerns. At an estimated 10 million peak zone-transition events per hour (10 million residents averaging 10 zone transitions per day, with 2x peak-to-average ratio during morning and evening rushes), no checkpoint-based system is viable.

The Jewel Changi Airport's Mozart platform offers a partial precedent: 5,000+ IoT sensors, 700 CCTV cameras, and 500 mobile devices unified into a single operations center for a facility handling 85 million passengers annually. But those passengers are transient — fundamentally different from permanent residents who cannot opt out.

## Vertical Evacuation Physics

Emergency security response assumes the ability to move people away from danger. At 5,000 feet, this assumption breaks.

The pinch point problem dominates: as evacuees from upper floors descend, lower floors become impossibly congested. This is not unique to the Arcology — it affects every supertall building — but the Arcology concentrates the problem at unprecedented scale. The Burj Khalifa addresses this with transfer floors at levels 43, 76, and 123 where evacuees stage for elevator transport. The Arcology needs dozens of such transfer zones, operating simultaneously, with routing algorithms that prevent convergence congestion.

The deeper question is whether full evacuation is a reasonable design target at all. For most security scenarios — intrusion, localized violence, system failures — compartmentalized lockdown may be more appropriate than mass movement. The fire safety entry establishes defend-in-place as the governing philosophy; security architecture must align with this. Each tier functions as an independent security zone that can be isolated without cascading across the structure.

## Cascading Failure Resilience

Chester's research at ASU developed the ReFIT toolkit for modeling interdependent infrastructure failures. Applied to the Arcology, this means analyzing how failures propagate across 8+ infrastructure domains: power, water, HVAC, communications, transport, security, waste processing, and food systems.

The analysis is tractable at design time, and recent work demonstrates that simulation-based validation is more powerful than previously assumed. Hoff, Sparks, Chester et al. (2025) ran 120,000 simulations of cascading failures across interdependent power and water infrastructure networks, finding that 89% of initial transmission line outages did not cascade to substations or water systems, and power failures did not lead to water outages in 96% of simulations. But 3.69% of simulations triggered large cascading failures across both domains — low-likelihood, high-consequence "perfect storm" scenarios where the worst case showed 25% of water system nodes with insufficient pressure. This methodology — synthetic network models with real engineering properties, stochastic rebalancing, and massive simulation counts — is directly applicable to the Arcology's 8+ infrastructure domains. Graph Neural Networks and HLA-based co-simulation frameworks now enable multi-domain interdependency modeling that was computationally infeasible five years ago.

The harder question is not whether simulation can validate resilience — it can, for known interdependencies — but whether the simulation captures the interdependencies that actually matter. Simulations embed assumptions that may not match reality. The Arcology's resilience strategy must include mechanisms for learning from partial failures — treating every incident as a test that reveals dependency chains not captured in models.

Extreme redundancy is the brute-force solution: dual systems for everything critical, triple for life safety, autonomous failover that doesn't wait for human decisions. This is expensive and complex, but the alternative — single points of failure in a structure housing 10 million people — is unacceptable.

Power failure deserves special attention as the most dangerous cascading trigger. A grid failure affects nearly every security system simultaneously: surveillance cameras, access control, communications, elevator transport. The grid architecture entry addresses power resilience; security architecture must assume 72-hour autonomous operation of all security-critical systems during grid events.

## The Surveillance-Liberty Tension

NEOM plans city-wide AI surveillance, biometric access control, and cybersecurity-by-design for all vendor systems. This is technologically coherent but socially untested. NEOM's residents will be largely transient workers and tourists, not permanent citizens with political expectations. The Arcology houses 10 million permanent residents who vote, raise families, and expect privacy in their homes.

Research on intentional communities and dense urban housing consistently shows that perceived overreach in security and surveillance erodes community trust, which in turn increases the very behaviors (crime, rule-breaking, non-cooperation) that surveillance is meant to address. SafeGrowth and third-generation CPTED emphasize community governance not as a soft alternative to technology but as a necessary complement.

The binding hierarchy governance framework establishes principles for AI autonomy and human oversight. Security AI systems must operate within this framework — Tier 3 (bounded autonomy) for routine monitoring, with escalation to human decision-makers for actions affecting residents' liberty. The EU AI Act's Article 5 makes this explicit: no decision producing an adverse legal effect on a person may be taken based solely on the output of a real-time biometric identification system. A facial recognition system that automatically denies building access operates differently than one that flags anomalies for human review — and the regulatory trajectory globally is toward requiring the latter.

## Security Operations Architecture

The Arcology requires not a security operations center but a distributed security operations network. Current best practice — unified platforms like Genetec Security Center or the Mozart system — scales to thousands of devices. The Arcology needs an estimated 500,000 cameras, millions of sensors, and personnel distributed across 13 operations centers coordinated in real time. The camera estimate is grounded in comparative data: London operates approximately 942,000 cameras for 9.4 million people (~100 per 1,000 residents), while Singapore runs 113,000 for 6.2 million (~18 per 1,000). The Arcology's 50-per-1,000 ratio (500,000 cameras) reflects the assumption that AI video analytics — edge processing, automated anomaly detection, multi-camera tracking — reduces the camera count needed compared to London's largely traditional CCTV infrastructure, while the enclosed structure demands significantly higher coverage density than Singapore's open-air urban environment.

The 13 SOCs follow the structure's physical geometry: one tier-level center embedded in each of the 10 major tiers, one for the 30 subterranean levels, one central Global Security Operations Center (GSOC) for coordination and strategic oversight, and one hot backup GSOC for continuity. This mirrors enterprise security architecture trends where hybrid GSOC-plus-regional models are favored by 47% of organizations and adopted as the standard for large distributed operations.

Each tier requires embedded security presence with response capability measured in minutes, not external response that must stage, enter, and navigate. Personnel requirements are estimated at 25,000 at a ratio of 2.5 per 1,000 residents. FBI data shows U.S. cities average 2.4 sworn officers per 1,000 residents, with large cities ranging from 1.6 (Western U.S.) to 3.1 (Mid-Atlantic). The Arcology's ratio falls squarely within this range, though the enclosed vertical environment — faster response times within a tier, no vehicle patrol, AI augmentation — may ultimately require fewer personnel per capita than a comparable ground-level city. Training, command structure, and internal transport for rapid response are design requirements, not afterthoughts.

AI augments human capacity but doesn't replace human judgment for decisions affecting liberty. Video analytics can identify crowd flow anomalies, loitering patterns, and potential intrusions faster than human operators. But the decision to detain someone, restrict access, or escalate force remains with humans operating under governance frameworks with accountability.

## What Current Technology Provides

Physical security components are mature. AI video analytics achieved a $6.51 billion market in 2024, projected to reach $28.76 billion by 2030. Edge computing enables AI processing inside cameras, reducing bandwidth and latency. Autonomous surveillance drones patrol large areas. Unified platforms integrate video, access control, and vehicle recognition into single command interfaces.

Building automation cybersecurity tools exist for clean-sheet design. Zero-trust OT architectures, microsegmentation, and AI-powered behavioral monitoring can achieve sub-1% vulnerability rates if designed from the ground up rather than retrofitted. The DoD's 2025 zero-trust OT guidance — 105 activities across seven security pillars — provides the most detailed implementation roadmap for new-build OT environments, and the Arcology can adopt it wholesale rather than contorting legacy systems to fit.

Evacuation modeling tools like buildingEXODUS can simulate vertical evacuation scenarios, validated against 9/11 survivor data. The model can be extended to Arcology geometry, though validation at this scale is inherently limited.

## What Requires Innovation

**Security operations integration** at 500,000+ cameras and millions of devices exceeds any current installation by an order of magnitude. Hierarchical AI processing with edge, sector, and central tiers is necessary; no reference architecture exists.

**Frictionless access control** at millions of events per hour requires continuous ambient verification rather than checkpoint models. The technology components exist but have not been integrated at population scale.

**Cascading failure modeling** across 8+ interdependent domains is analytically tractable but unvalidated. Testing resilience at Arcology scale cannot be done before construction.

**Governance frameworks** balancing surveillance capability with civil liberties for permanent residents have no precedent. Existing models serve either transient populations (airports) or authoritarian contexts (NEOM). A democratic residential city at this density is unexplored territory.

**Regulatory certification** for security architecture without precedent requires engagement with federal agencies (DHS, NIST, FEMA) beyond local authority. The regulatory pathway itself must be developed alongside the technical design.

## The Hardest Question

Security architecture for the Arcology can address individual attack vectors: intrusion, cyberattack, fire, evacuation. The harder challenge is the coordinated scenario — a cyberattack that disables power and communications during a fire, or a physical intrusion that exploits a cascading infrastructure failure.

The system must be designed assuming that attackers understand the interdependencies better than defenders do. Adversarial red-teaming during design, not just after deployment, is essential. But red teams operate within the boundaries of what designers imagine; true adversaries may find vulnerabilities that no one anticipated.

The deepest security comes not from technological sophistication but from system architecture that limits the impact of any single failure. If compartmentalization works — if each tier can function independently, if cascading failures are truly contained — then even successful attacks have bounded consequences. If compartmentalization fails under stress, no amount of surveillance or access control compensates.

The Arcology's security is only as strong as its weakest interdependency. The design must proceed assuming that interdependencies will be discovered in operation that weren't visible in planning — and that the system must survive those discoveries without catastrophic failure.
