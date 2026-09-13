# The Living Loop — research and design decisions

Reviewed 13 September 2026. Prepared for the local redesign of `/stories/water/experience`. This is a research-grounded proposal for fiction and website exploration, not a completed engineering design. Publication remains on hold.

## Recommendation

Begin with a compact farm cluster serving the neighborhood around Floor 318: adjacent, separately controlled rooms with independent water circuits. Keep the fish circuit, its filtration and life support together. Give hydroponics its own reservoir and nutrient controls. Transfer measured, checked water in one direction from fish production to plant production.

Physical proximity and hydraulic coupling are different decisions. Two rooms on one deck can use separate circuits. Two rooms on different decks need not exchange their entire recirculating flow. This distinction makes the website's layout comparison more useful than declaring every process either entirely together or entirely separate.

The recommendation is an inference from process needs and maintenance logistics. It is not a finding that a mile-high farm has been demonstrated, nor a decision that these exact six rooms all exist on Floor 318.

## What supports that choice?

[Monsees, Kloas and Wuertz's five-month pilot](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0183056) compared coupled and decoupled aquaponics with a recirculating-aquaculture control. Independent management addressed compromises between fish and plant conditions. This is evidence for considering separate circuits, not a universal yield prediction.

There is a credible alternative: carefully designed coupled aquaponics. [Tetreault and colleagues](https://www.frontiersin.org/journals/horticulture/articles/10.3389/fhort.2023.1140998/full) discuss parallel unit processes and different hydraulic requirements; they also describe the extra space, equipment and supplementation that decoupled systems can require. Their paper is hypothesis and theory, not a controlled test of an Arcology layout. Avoid declaring a universal winner.

For this fictional city's first design study, independent modules provide a useful starting point for isolation, maintenance and crop-specific control. Both circuits still require replacement water, monitoring and fail-safe operation. Closing an exchange valve is not by itself a complete resilience plan.

## One deck or several?

| Arrangement | Why consider it | What needs resolution |
| --- | --- | --- |
| One contiguous farm deck | Short transfers; staff can inspect neighboring processes; easier movement of harvested food and selected residues | Floor area, concentrated water loads, light access, separate air and hygiene zones, maintenance and egress |
| Adjacent specialized decks | More room and flexibility; plants can occupy a light-facing zone while other processes have enclosed environments | Pumping head, service risers, penetrations, containment, backflow prevention, goods lifts and coordinated maintenance |
| Neighborhood growing with shared city recovery | Small farms do not each need a large compost or digestion installation | Reliable collection, traceability, travel, buffer storage and a route back for suitable recovered products |

These are our design comparisons, not experimentally ranked alternatives. In either arrangement, keep high-flow recirculation local. Move selected nutrient transfers and contained batches between modules. Avoid casually drawing a continuously connected stack of tanks.

Water load is substantial even before machinery: 1 m² × 1 m depth × approximately 1,000 kg/m³ is approximately one tonne of water per square metre. This elementary mass calculation excludes tanks, equipment, people and dynamic loads. It cannot establish the capacity of any fictional floor. The position of heavy rooms must follow structural design, rather than a blanket rule that any lower floor is adequate.

## A branching food system

The proposed chain becomes more credible when its branches are visible:

1. **Harvest for people first.** Exported food removes nutrients from this farm's balance. The page no longer claims that the illustrated rooms feed thousands, an entire floor, or a complete diet.
2. **Keep suitable residues identifiable.** Fibrous material, moist vegetable trimmings, fish solids and contaminated rejects have different destinations. The same kilogram cannot be counted as feed for both insects and mushrooms.
3. **Grow mushrooms on a compatible prepared substrate.** Oyster mushrooms are the illustrated example. [Cornell's cultivation guidance](https://smallfarms.cornell.edu/resources/methods-of-commercial-mushroom-cultivation-in-the-northeastern-united-states/4-four-methods-of-commercial-cultivation/) explains species and preparation differences. Separate air and clean handling are proposed design requirements. Crop residues may need supplemental straw or wood; mushrooms do not simply follow every animal-waste stream.
4. **Treat insect rearing as husbandry and feed manufacture.** [Eawag's practical resources](https://www.eawag.ch/en/department/sandec/projects/mswm/practical-knowhow-on-black-soldier-fly-bsf-biowaste-processing/) cover rearing, conversion and post-processing. The proposed nursery accepts assessed feedstocks; frass has its own processing route. Biological conversion alone does not establish safety or permission to use a substrate as feed.
5. **Formulate animal diets.** Larvae are a potential feed ingredient, not an automatic complete diet. A [2024 salmon study](https://doi.org/10.1016/j.aqrep.2024.101966) specifically examines fillet and sensory quality after insect-meal feeding. Only bibliographic/abstract information was accessible in this review, so no numerical outcome is asserted. Sea-cage salmon results would not establish indoor tilapia performance anyway. Fish are the animal module in this illustration; adding poultry or mammals needs a separate assessment.
6. **Finish the return to soil.** [EPA's definition](https://www.epa.gov/sustainable-management-food/composting) distinguishes stable aerobic compost from raw material and anaerobic digestate. Assess finished compost for its intended soil or substrate use. Do not send it directly into fish water or hydroponic circulation.

Fish solids need a separate decision. [Gerdes genannt Janßen and colleagues' 2026 experiments](https://www.frontiersin.org/journals/aquaculture/articles/10.3389/faquc.2026.1842840/full) show how treatment changes the nutrient profile of tilapia sludge. Their downstream growth trials used Arthrospira. This supports investigating recovery and conditioning; it does not validate raw sludge on vegetables or a universal recovery percentage. A sensible next step is crop-specific batch trials with nutrient and contaminant analysis.

Anaerobic digestion may suit a larger shared utility, but it is a different process from composting. Do not draw biogas as free electricity for grow lights without a feedstock, gas-treatment and energy balance. Heat recovery from compute is likewise a future thermal-design question, not a guaranteed benefit already demonstrated by this page.

## Companies and AI: useful, specific comparisons

The website separates company descriptions from research evidence. These are examples of parts of the system, not endorsements or evidence that one supplier has demonstrated this complete cycle.

The phase-by-phase [company evidence catalogue](living-loop-company-examples.md) now covers all six rooms with ten organizations: Source.ag and Corvus Drones; ReelData and Aquaai; Gradiant/Turing and Ostara; 4AG Robotics; Protix; Engineered Compost Systems and Sonnenerde. Each entry identifies the actual method, deployment evidence and limits. Conventional compost controls and nutrient-recovery chemistry are not relabeled as AI. Commercial use, grower pilots, offered platforms and research prototypes remain distinct.

[Wageningen's Autonomous Greenhouse Challenge](https://www.wur.nl/en/research/plant/autonomous-greenhouse-challenge) provides a stronger research anchor for AI cultivation than a single impressive percentage: actual crop trials, linked papers and datasets. It supports testing climate and irrigation strategies in specified growing conditions. It is not evidence that one model can optimize a whole mixed farm without local validation.

The proposed AI role is to make decisions observable: compare crop plans, flag sensor disagreement, forecast harvests and help staff coordinate batches. Local controls, alarms, maintenance and accountable operators remain part of the design. Evaluate marketable yield, flavor, texture, shelf life, nutrient composition and welfare along with resource use. More biomass is not synonymous with a better meal.

## Claim audit and next evidence needed

The former Water experience had metrics with generic source labels rather than traceable citations. The replacement removes its 80 fish/m³ and 768 g defaults; universal feed-conversion/feed-rate prescriptions; 14.51 kg/m² yield without a period; 99.3% health accuracy; 82.1% lighting savings; 40× space efficiency; and blanket nutrient-recovery percentages. This is not a claim that every number is false. Their applicability was not established, so they should not function as specifications.

Also removed: an entire-floor feeding claim, a purportedly closed system, direct digester-to-biofilter nutrient return, and the conflation of composting with digestion. Plant lighting should be described with crop-relevant measurements and a complete energy balance rather than a universal lux target.

Before assigning production capacity or exact floor numbers, build a pilot brief that specifies crop mix and edible diet contribution; growing area and time basis; fish species and biomass; feed and substrate composition; water, nutrient and energy balances; structural loads; climate-control needs; staffing; containment; maintenance; and outage recovery. Demonstrate safe batch exchanges between individual modules before integrating the full network. Compare against simpler standalone systems as well as coupled aquaponics.

## Website implementation

The new machine-readable content is `content/experiences/water.json` with `experienceType: living-loop`. It contains the six places, selected transfers, evidence IDs and source scope. Sources include research, practical guidance and company documents, each labeled. The illustration is a concept cutaway, not a plumbing drawing; transfer overlays are explicitly schematic. Room boundaries and scale remain proposals.

The first release includes six place selections, three resource routes, optional people/AI notes, an isolatable nutrient-transfer demonstration and a floor-arrangement comparison. The demonstration shows connection logic, not a biological or hydraulic simulation. No Water plot spoilers are introduced. The existing Binding Hierarchy remains available.

The approved post-flood image appears after the full Water story. Homepage text now reads “Where Arcology One begins” and “Join Mel and Pell in their community garden.”

## Artwork revision: visible automation

The author's second farm-art pass removes the door leaves from the cutaway and adds an integrated-bucket compost quad, ceiling-mounted mushroom-picking/loading arms, a floating monitor in each tank, and a crop-scouting drone. These robot bodies and their exact deployment are design proposals. The doors are omitted for visual clarity; this does not establish that the actual cultivation environments share uncontrolled air or access.

The supplied [Adel et al. paper, *Drones-of-the-Future in Agriculture 5.0*](https://www.sciencedirect.com/science/article/pii/S0308521X25002835) reviews agricultural Drone-as-a-Service applications and integration. Publisher abstract and indexed text were reviewed; the full paper was not retrieved directly. It appears in Agricultural Systems 231 (2026), DOI [10.1016/j.agsy.2025.104543](https://doi.org/10.1016/j.agsy.2025.104543). It supports the crop-monitoring direction, not a claim that this indoor configuration has been tested.

[Corvus Drones](https://www.corvusdrones.com/en/) is a direct commercial comparison for greenhouse scouting, growth/anomaly monitoring and germination counts. Its official descriptions are labeled as company information. Visual crop observations can support decisions about condition and harvest; they do not independently establish flavor or nutritional quality. Both references are attached to the plant room. The subsequent company review expands the structured catalogue to nineteen entries: nine research/practice references and ten company examples.

The skimmer form does not represent a ReelData product. The ceiling-arm layout is not presented as a documented 4AG installation. Their sensing and harvesting examples inform the concepts without validating every illustrated mechanism.
