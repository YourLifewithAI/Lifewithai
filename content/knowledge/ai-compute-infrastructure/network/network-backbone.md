---
id: "ai-compute-infrastructure/network/network-backbone"
title: "Network Backbone Architecture"
domain: "ai-compute-infrastructure"
subdomain: "network"
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
tags: ["network", "fiber", "wireless", "SDN", "Wi-Fi", "5G", "infrastructure", "backbone", "connectivity", "CBRS", "spectrum", "PoE"]
summary: "The arcology's network infrastructure serves 10 million residents with a fiber backbone exceeding 50,000 miles of internal cabling, 500,000-1,000,000 wireless access points, and AI-driven network management at a scale 20-100x beyond any current single-cluster deployment. The core challenge is not any single technology gap but integration complexity at city scale within a single vertical structure."
citations:
  - id: "mckeown-sdn-2025"
    type: "industry"
    title: "Nick McKeown Named 2025 Marconi Fellow for SDN"
    source: "Marconi Society"
    year: 2025
  - id: "marvell-teralynx-2025"
    type: "industry"
    title: "Marvell Teralynx 51.2T Switch Production Announcement"
    source: "Marvell"
    year: 2025
  - id: "broadcom-tomahawk6-2025"
    type: "industry"
    title: "Tomahawk 6: First 100-Terabit Switch Chip"
    source: "Gazettabyte"
    year: 2025
  - id: "corning-fiber-backbone"
    type: "industry"
    title: "Types of Fiber Optic Backbone Networks"
    source: "Corning"
    year: 2024
  - id: "ruckus-wifi7-2025"
    type: "industry"
    title: "Wi-Fi 7 for Packed Stadiums"
    source: "RUCKUS Networks"
    year: 2025
  - id: "meta-backbone-2025"
    type: "project-data"
    title: "10X Backbone: How Meta is Scaling Backbone Connectivity for AI"
    source: "Meta Engineering"
    year: 2025
  - id: "parks-associates-2024"
    type: "industry"
    title: "Average Number of Connected Devices Per US Internet Household Reached 17 in 2023"
    source: "Parks Associates"
    year: 2024
  - id: "aws-fiber-infrastructure-2025"
    type: "project-data"
    title: "Building Resilience: Inside AWS's Nine Million Kilometers of Fiber-Optic Cabling"
    source: "Amazon Web Services"
    year: 2025
  - id: "meta-corning-fiber-2026"
    type: "project-data"
    title: "Meta Inks Deal to Pay Corning Up to $6 Billion for Fiber-Optic Cables in AI Data Centers"
    source: "CNBC"
    year: 2026
  - id: "cisco-catalyst-center-2025"
    type: "industry"
    title: "Catalyst Center 2.3.7 Data Sheet"
    source: "Cisco Systems"
    year: 2025
  - id: "ongoalliance-cbrs-2024"
    type: "industry"
    title: "CBRS Takes Flight: 2024 Groundbreaking Achievements in the Innovation Band"
    source: "OnGo Alliance"
    year: 2024
  - id: "federated-wireless-sas-2026"
    type: "industry"
    title: "Federated Wireless Launches CBRS Active DAS Support to Expand Indoor 5G"
    source: "Federated Wireless"
    year: 2026
  - id: "ieee-802-3dj-2026"
    type: "standard"
    title: "IEEE P802.3dj: 200 Gb/s, 400 Gb/s, 800 Gb/s, and 1.6 Tb/s Ethernet"
    source: "IEEE Standards Association"
    year: 2026
cross_references:
  - slug: "ai-compute-infrastructure/data-centers/compute-overview"
    relationship: "depends-on"
  - slug: "mechanical-electrical/electrical/electrical-distribution"
    relationship: "depends-on"
  - slug: "ai-compute-infrastructure/edge-iot/edge-sensor-mesh"
    relationship: "informs"
  - slug: "mechanical-electrical/fire-life-safety/fire-life-safety"
    relationship: "informs"
  - slug: "institutional-design/governance/governance-framework"
    relationship: "informs"
open_questions:
  - "What is the optimal wireless technology mix for dense, vertical environments: Wi-Fi 7, private 5G/CBRS, Li-Fi, or all three in different proportions by zone?"
  - "What regulatory framework governs wireless spectrum allocation inside a single structure housing 10 million people — does the FCC's existing SAS model scale to this density, or does the arcology need a bespoke spectrum coordination authority?"
  - "How should the network power budget (estimated 15-30 MW) be distributed across zones to balance redundancy with efficiency, and can PoE advances reduce per-AP power draw below 15W by the time residential zones come online?"
assumptions:
  - "Population of 10 million residents generating 30-50 million simultaneous wireless device connections"
  - "5,000-foot (1,524m) vertical structure requiring intermediate fiber support points every 100-200 feet"
  - "3-4 million residential units each requiring fiber drops, plus commercial/institutional spaces"
  - "Hardware technologies will advance significantly over the 20-30 year construction timeline"
  - "Average US internet household has 17-25 connected devices (Parks Associates, 2023-2024), yielding 60-88 million total connected devices across 3.5 million households"
parameters:
  - name: "building_height_ft"
    value: 5000
    unit: "feet"
    confidence: 3
  - name: "population"
    value: 10000000
    unit: "residents"
    confidence: 3
  - name: "simultaneous_wireless_devices"
    value: 40000000
    unit: "devices (estimated 30-50M range)"
    confidence: 2
  - name: "total_connected_devices"
    value: 70000000
    unit: "devices (estimated 60-88M including idle)"
    confidence: 2
  - name: "fiber_terminations"
    value: 9000000
    unit: "terminations (estimated 7-12M range)"
    confidence: 2
  - name: "internal_fiber_miles"
    value: 75000
    unit: "miles (estimated 50,000-100,000)"
    confidence: 2
  - name: "wireless_access_points"
    value: 750000
    unit: "APs (estimated 500,000-1,000,000)"
    confidence: 2
  - name: "current_switch_throughput_tbps"
    value: 51.2
    unit: "Tbps (Marvell Teralynx)"
    confidence: 3
  - name: "target_switch_throughput_tbps"
    value: 100
    unit: "Tbps (Broadcom Tomahawk 6)"
    confidence: 2
  - name: "fiber_backbone_speed_gbps"
    value: 800
    unit: "Gbps per wavelength (deployed)"
    confidence: 3
  - name: "single_mode_fiber_max_ft"
    value: 8200
    unit: "feet between crossconnects"
    confidence: 3
  - name: "vertical_riser_support_interval_ft"
    value: 150
    unit: "feet (typical 100-200 ft range)"
    confidence: 2
  - name: "vertical_latency_us"
    value: 7.6
    unit: "microseconds (one-way, 5000 ft)"
    confidence: 3
  - name: "switching_latency_per_hop_us"
    value: 2.75
    unit: "microseconds (0.5-5 us range)"
    confidence: 2
  - name: "network_management_scale_gap"
    value: 30
    unit: "x (Cisco Catalyst Center 3XL cluster manages ~300K endpoints; arcology needs 5-10M)"
    confidence: 2
  - name: "network_power_draw_mw"
    value: 22
    unit: "MW (estimated 15-30 MW range)"
    confidence: 1
  - name: "ap_power_consumption_watts"
    value: 25
    unit: "watts per AP (10-39W range, Wi-Fi 7 trending higher)"
    confidence: 2
  - name: "ieee_1_6t_ethernet_target_year"
    value: 2026
    unit: "year (IEEE 802.3dj standard completion)"
    confidence: 3
---

## The Integration Problem

A 5,000-foot vertical structure housing 10 million people requires a communications backbone unlike anything that exists. The individual components are available: 800 Gbps fiber runs are routine, 51.2 Tbps switches are in volume production, Wi-Fi 7 supports tens of thousands of concurrent users in stadiums, and private 5G on CBRS serves hundreds of thousands of radios across logistics hubs and factories. No fundamental technology gaps block the path.

The challenge is integration. The arcology is not a single network. It is thousands of overlapping networks: residential ISP service for millions, commercial office networks, industrial control networks, building management systems for HVAC and elevators and fire safety, emergency services communications, public Wi-Fi, and data center interconnects supporting the compute infrastructure that is co-equal to the arcology's purpose. Each requires isolation, different quality-of-service policies, and different security postures. Current software-defined networking and network slicing can handle multi-tenancy, but not at this scale with this diversity.

## Wired Backbone: Fiber to Everything

The primary medium is single-mode OS2 fiber. Single-mode fiber supports distances up to 8,200 feet between crossconnects — comfortably exceeding the arcology's 5,000-foot height. Distance is not the constraint.

Weight is. All fiber optic cables have a maximum vertical rise determined by cable weight and tensile strength. Exceeding this limit causes fiber breakage, excess attenuation, or fiber sliding in loose-tube cables. At 5,000 feet, the arcology exceeds the typical maximum vertical rise for most cable types. The solution is intermediate support points at each sky lobby or mechanical floor (every 100-200 feet), using tight-buffer riser cables rated for vertical installation and cascading multiple riser segments rather than continuous pulls.

The scale of the cable plant is staggering. Each of 3-4 million residential units requires a fiber drop — typically 2-4 fiber strands per unit in modern FTTH MDU (multi-dwelling unit) deployments, to support voice, data, video, and future expansion. Commercial and institutional spaces require higher fiber counts per tenant: 4-12 strands each. Add IoT and sensor networks, building management, and backbone distribution, and the arcology requires 7-12 million individual fiber terminations and 50,000-100,000 miles of internal fiber. Parks Associates research shows the average US internet household now has 17-25 connected devices [parks-associates-2024], each needing network connectivity — in the arcology's 3.5 million households, that translates to 60-88 million total connected devices demanding fiber backhaul.

For scale context: AWS operates over 9 million kilometers (5.6 million miles) of fiber-optic cabling across its global infrastructure [aws-fiber-infrastructure-2025]. Meta's single Louisiana data center campus will require 8 million miles of optical fiber, prompting a $6 billion deal with Corning that included development of a new "Contour" cable fitting twice as many fiber strands into a standard conduit [meta-corning-fiber-2026]. The arcology's 50,000-100,000 miles of internal fiber is modest compared to a hyperscale data center campus, but the installation challenge is different: residential fiber drops must be routed through finished living spaces, not purpose-built server halls. This is comparable to a small country's national FTTH buildout compressed into a single structure, and it demands automated planning tools and robotic installation systems.

Backbone switching has reached extraordinary throughput. The Marvell Teralynx at 51.2 Tbps is in volume production. The Broadcom Tomahawk 6 — the first single-chip 100-terabit switch — has been announced. The IEEE 802.3dj standard for 1.6 Tbps Ethernet is targeting completion by July 2026, with 200 Gbps/lane signaling [ieee-802-3dj-2026]. Major hyperscalers are already preparing for 3.2 Tbps speeds. The arcology's core switches will likely leverage technology several generations beyond what is available today by the time they are installed.

## Wireless: Density Beyond Any Precedent

An arcology housing 10 million people could generate 30-50 million simultaneous wireless device connections. This estimate is grounded in current device ownership trends: Parks Associates found 17 connected devices per US household in Q3 2023, trending toward 25 by 2025 [parks-associates-2024]. With an estimated 3.5 million households, the arcology contains 60-88 million total connected devices. Not all are wireless (wired desktop PCs, smart TVs on Ethernet), and not all wireless devices transmit simultaneously, but at any given moment 30-50 million active wireless connections is a defensible range.

For context, the largest stadium Wi-Fi deployments handle approximately 80,000 users. The arcology represents 375-625 stadiums stacked vertically and jammed into a single RF environment.

The problems multiply at this scale. Spectrum exhaustion is real — even with 6 GHz (Wi-Fi 6E/7), channels will be saturated in dense residential areas. Wi-Fi 7's 6 GHz band provides up to 1,200 MHz of unlicensed spectrum with three non-overlapping 320 MHz channels, but those three channels must serve potentially thousands of APs per floor. Millions of access points in close proximity create co-channel interference that degrades performance for everyone. Users moving vertically in elevators and horizontally through the structure need seamless handoff across thousands of access points. And Wi-Fi 7, private 5G/CBRS, carrier cellular via distributed antenna systems, and emerging Li-Fi technology must coexist and hand off between each other.

**Access point density** requires careful estimation. Industry guidelines recommend one AP per 800-1,600 sq ft for enterprise environments, or one AP per 45-105 seats in high-density venues like stadiums [ruckus-wifi7-2025]. The arcology's total usable floor area — residential, commercial, public, and institutional — spans hundreds of millions of square feet. Even at the sparser end (one AP per 2,000 sq ft for residential corridors and common areas, denser in public and commercial zones), the building-managed wireless infrastructure requires 500,000 to 1,000,000 access points. This is a significant revision upward from preliminary estimates, driven by the sheer floor area and the impossibility of serving 10 million people with sparse AP coverage. Individual units may also have personal routers, but the building-managed fabric — public Wi-Fi, emergency communications, IoT backhaul, commercial wireless — must be comprehensive.

Each wireless technology has its domain:

**Wi-Fi 7 (802.11be)** offers the highest raw throughput with 320 MHz channels, 4K QAM modulation, and Multi-Link Operation. MLO enables devices to simultaneously operate across 2.4 GHz, 5 GHz, and 6 GHz bands, aggregating bandwidth and reducing latency. Real-world benchmarks show 47% throughput improvement over Wi-Fi 6, with 2x2 clients achieving 8.6 Gbps by aggregating a 320 MHz 6 GHz channel and a 160 MHz 5 GHz channel. Stadium deployments prove the technology at high concurrency — BMO Stadium's 2026 RUCKUS deployment uses Wi-Fi 7 T670 APs under seats and hyper-directional T670SN antennas in concourses [ruckus-wifi7-2025] — but those are wide-open spaces with carefully engineered RF, not apartment buildings with walls and floors and interfering neighbor networks.

**Private 5G on CBRS** (3.5 GHz shared spectrum) provides better mobility and quality-of-service than Wi-Fi but at higher cost per access point. Network slicing enables different QoS policies for different applications on the same physical infrastructure. Over 420,000 CBRS radios are deployed across the US [ongoalliance-cbrs-2024], with notable enterprise deployments including Toyota Material Handling's 200,000 sq ft facility, Tesla manufacturing, and BMW Group logistics — demonstrating that private cellular networks reliably serve dense indoor environments. But the largest single-site deployments cover thousands of users, not millions. The 2024 launch of CBRS 2.0 expanded indoor availability to approximately 97% of the US (up from 78%), with minimized exclusion zones and improved spectrum policy [ongoalliance-cbrs-2024].

**Distributed Antenna Systems** capture cellular signals from external carriers and distribute them over fiber to antenna points throughout large buildings. Critical for 5G coverage in structures where high-band frequencies cannot penetrate internal walls and floors. The arcology requires DAS for carrier cellular coverage, in addition to its own private 5G. Federated Wireless's 2026 launch of CBRS Active DAS support allows mobile operators to add indoor capacity using shared spectrum while preserving licensed spectrum for the macro network [federated-wireless-sas-2026] — a model directly applicable to the arcology's carrier connectivity needs.

**Li-Fi** uses LED lighting modulation to transmit data wirelessly at multi-Gbps speeds. Each room requires its own transmitter (light can't penetrate walls), which is a constraint but also provides inherent room-level security and zero RF interference. Li-Fi could serve as the highest-bandwidth option for fixed locations — workstations, data-intensive equipment, high-security areas.

The architecture likely requires all four technologies in different proportions depending on the zone, with an interworking layer that enables seamless handoff between them. This interworking architecture is an open problem that no existing deployment has solved at this density.

## Network Management at Scale

No human team can manually manage a network with millions of endpoints across a 5,000-foot vertical structure. The gap between current AI-driven network management capabilities and arcology requirements is quantifiable.

Cisco's Catalyst Center (formerly DNA Center) represents the current enterprise state of the art. The platform's maximum scale in a 3-node Extra Large cluster configuration supports up to 300,000 concurrent endpoints [cisco-catalyst-center-2025]. A smaller Extra Large appliance handles 100,000 endpoints; a single Large appliance tops out at 40,000. Juniper's Mist AI platform, with its "Marvis Minis" digital twin technology for continuous user experience simulation, operates at comparable enterprise scale — thousands to tens of thousands of managed network elements per deployment. Both platforms provide anomaly detection, predictive analytics, and automated remediation.

The arcology needs to manage 5-10 million endpoints. Against the largest current single-cluster deployment (Cisco's 300K), that is a 17-33x gap — significant but not the 100-1,000x originally estimated. The original estimate compared against typical deployments (10-50K endpoints); the gap against state-of-the-art clustered deployments is more modest. Multiple Catalyst Center clusters could theoretically cover segments of the arcology, but coordination across clusters adds its own complexity.

Software-defined networking separates the control plane from the data plane, enabling centralized, programmable network management. SDN enables dynamic bandwidth allocation, tenant isolation, and automated policy enforcement — all essential for arcology-scale network management. The debate between fully centralized SDN and distributed control has matured since the early days of OpenFlow. Current research identifies three viable architectures: (1) physically distributed, logically centralized (PDLC), where multiple controller instances synchronize to maintain a global network view; (2) hierarchical, with domain-level controllers handling local decisions and a root controller handling network-wide policy; and (3) flat distributed, where equal-priority controllers each manage a partition. ONOS, designed for carrier-grade SDN, outperforms OpenDaylight in scalability benchmarks as switch counts increase, and its clustered architecture with distributed datastores provides the failover and partition tolerance needed at building scale.

The network will likely require a **hierarchical federated architecture**: zone-level controllers (one per sky lobby catchment, managing 50-100K endpoints each) operating semi-autonomously, with a building-wide coordination layer handling inter-zone routing, policy synchronization, and global anomaly detection. This maps naturally to the arcology's physical zone structure and limits the blast radius of any single controller failure.

## Network Power Budget

A network serving 10 million people consumes significant power. Enterprise Wi-Fi 7 access points draw 25-39 watts each via Power over Ethernet, a notable increase from Wi-Fi 6 APs at 15-30 watts, driven by additional radio chains and wider channels. At 750,000 APs averaging 25 watts, the wireless infrastructure alone draws approximately 19 MW. Core and distribution switching, DAS head-ends, fiber amplifiers, and network management servers add another 2-5 MW. The total network power budget falls in the 15-30 MW range, with 22 MW as a working estimate.

This is a non-trivial fraction of the arcology's total power budget and must be co-designed with the electrical distribution system. PoE delivery over the last 100 meters of copper (Cat 6A/Cat 8) from distribution switches to access points means thousands of PoE switches must be distributed throughout the structure, each requiring reliable power and cooling. The IEEE 802.3bt standard (PoE++) delivers up to 90 watts per port, sufficient for even the most power-hungry Wi-Fi 7 APs with margin for future growth.

## Fault Tolerance: When Failure Is Not an Option

When 10 million people depend on a single structure's network, failure modes that are acceptable in a building — reboot the switch, wait for the technician — become unacceptable.

The network must survive the loss of any single node, link, or riser without service degradation. Self-healing mesh networks and redundant fiber paths are proven technologies. Detection and rerouting around failures in milliseconds is achievable with current mesh protocols. Zero-downtime upgrades and maintenance windows without service interruption are standard practice in large data centers. AWS's network, spanning 9 million kilometers of fiber, is explicitly "designed to fail" — every component has redundant pathways, and systems are engineered to isolate failures and prevent cascading impacts across regions [aws-fiber-infrastructure-2025]. The arcology must adopt this same philosophy at building scale.

The key design requirement is ensuring that no single failure — fire, flood, mechanical damage — can take out more than one zone of the network. This means physical diversity of fiber routes (not just logical redundancy), hardened emergency communications paths independent of the general-purpose network, and fire-survival cables that maintain connectivity during and after fire events.

The Shanghai Tower's zone-based mechanical architecture offers a model: nine cylindrical building zones stacked vertically, each functioning semi-independently with its own mechanical systems. Each zone could operate as a semi-autonomous network domain, with inter-zone routing providing redundancy without tight coupling.

## Latency: Mostly Fine, Occasionally Matters

At the speed of light in fiber (~200,000 km/s), a 5,000-foot vertical run adds approximately 7.6 microseconds of one-way latency. This is negligible for almost all applications.

The larger latency concern is switch hops. Each intermediate switch adds 500ns to 5 microseconds depending on the platform. A hierarchical design with 5-8 switch hops between any two endpoints adds 2.5-40 microseconds of switching latency. For most human-facing applications, this is invisible. For time-sensitive industrial control systems or high-frequency trading operations (if any exist within the arcology), it could matter.

The architecture decision between traditional three-tier campus networks (core/distribution/access), modern spine-leaf architectures borrowed from data centers, and zone-based architectures with inter-zone routing affects the typical hop count between endpoints. This is an engineering tradeoff between simplicity, resilience, and latency that must be resolved during detailed design.

## Spectrum Governance

The deepest unresolved issue is governance, not technology.

Who manages the wireless spectrum inside the arcology? The CBRS model offers a concrete framework. The FCC's Spectrum Access System (SAS) — a cloud-based automated coordinator — dynamically assigns spectrum channels and transmit power to CBRS devices based on their tier status, geographic location, and real-time interference conditions [federated-wireless-sas-2026]. The SAS maintains a database of all registered base stations and uses real-time sensing to determine spectrum availability, granting or denying access to prevent harmful interference. Federated Wireless, one of the FCC-authorized SAS administrators, has invested in AI-driven automation and dynamic spectrum optimization specifically for increasingly dense indoor and outdoor deployments [federated-wireless-sas-2026].

For the arcology, a SAS-like model offers a middle path between full centralization and RF chaos. A building-level spectrum coordinator could dynamically allocate Wi-Fi channels, CBRS spectrum, and DAS capacity across zones. Residential units would not deploy their own uncoordinated Wi-Fi networks — the RF density would make that unworkable — but instead connect to the building-managed wireless fabric with guaranteed bandwidth and isolation per unit. This is operationally closer to a hotel or cruise ship model than a conventional apartment building.

The question is whether the FCC's existing SAS framework scales to a structure with 500,000-1,000,000 access points and 30-50 million simultaneous connections. Current SAS deployments coordinate hundreds of thousands of CBRS radios nationally [ongoalliance-cbrs-2024], but the arcology would concentrate that same density into a single site. A bespoke spectrum coordination authority — potentially operating under an FCC experimental license or a new regulatory category — may be necessary.

This is a microcosm of the arcology's broader governance challenge: how much centralized control is necessary for the infrastructure to function, and how much autonomy should zones and individuals retain even if it reduces aggregate efficiency? The network is where this tension becomes measurable in dropped packets and degraded throughput.

## Cross-Domain Dependencies

The network touches everything:

**Compute infrastructure** drives the backbone's capacity requirements. High-bandwidth east-west traffic between data center racks flows over the same physical fiber plant that serves residential internet. The network backbone and internal data center interconnects are co-designed.

**Electrical distribution** must deliver reliable power at thousands of locations where network equipment — switches, access points, DAS nodes — is installed. The estimated 15-30 MW network power budget requires coordination with UPS and emergency power systems to ensure that power failures don't cascade into network failures.

**Elevator shafts** are primary vertical riser pathways for fiber. Moving elevators require continuous wireless connectivity despite being Faraday cages hurtling through the RF environment. Elevator dispatch systems depend on network connectivity.

**Fire and life safety** systems require dedicated, hardened network paths independent of the general-purpose network. Fire-survival cables and redundant routing are mandatory. The fire alarm and emergency communication systems cannot fail when the building is burning.

**HVAC and atmospheric systems** rely on network-connected sensors and controls. Network equipment rooms generate significant heat requiring dedicated cooling. Cable pathway design must account for fire compartmentalization.

**Edge and IoT** systems connect millions of sensors and actuators through the network infrastructure. IoT traffic patterns — many small devices, low bandwidth each, high aggregate — differ from human-generated traffic and require different QoS treatment.

**Governance framework** must define spectrum allocation authority, network access policies, and the balance between centralized efficiency and zone-level autonomy.

## Where Current Technology Falls Short

Three gaps stand out:

**AI-driven network management at scale.** Current platforms manage up to 300,000 endpoints in their largest cluster configurations [cisco-catalyst-center-2025]. The arcology needs 5-10 million. This is a 17-33x gap per cluster that requires either federated multi-cluster architectures or purpose-built management platforms. The hierarchical SDN approach — zone-level controllers coordinating under a building-wide layer — is the most likely path, leveraging existing controller technology at the zone level while developing novel coordination for the inter-zone layer.

**Wireless integration at density.** Wi-Fi 7, private 5G, DAS, and Li-Fi are individually mature. Making them work together as a seamless, city-scale wireless fabric with billions of handoffs per day requires innovation in spectrum coordination, handoff protocols, and AI-driven interference management that doesn't exist today. The CBRS SAS model provides a regulatory and technical framework for spectrum coordination, but has not been tested at this density within a single structure.

**Building-scale network design literature.** Nobody has published on "building-scale networking for populations above 100,000" because nobody has built anything like this. The arcology will need to develop its own engineering playbook, drawing on precedents from stadium Wi-Fi, hyperscale data centers, and supertall buildings like Burj Khalifa — but synthesizing them in ways that haven't been attempted.

These gaps are not physics barriers. They are engineering challenges that can be addressed over the 10-15 year construction timeline, during which the underlying technologies will continue to advance. The IEEE 802.3dj standard for 1.6 Tbps Ethernet targets completion in July 2026 [ieee-802-3dj-2026]. By the time the first residential zones come online, terabit switching will be commonplace, Wi-Fi 8 (802.11bn) will be maturing, and AI-native networking will be standard practice.
