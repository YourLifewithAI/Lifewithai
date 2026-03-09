---
id: "urban-design-livability/public-space/public-space-design"
title: "Public Space and Sky Gardens at Arcology Scale"
domain: "urban-design-livability"
subdomain: "public-space"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-26"
updated: "2026-03-09"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["public-space", "sky-gardens", "parks", "biophilic-design", "atrium", "vertical-forest", "livability", "green-space", "indoor-parks", "artificial-sky", "enclosed-ecosystem"]
summary: "Analysis of public space requirements for 10 million residents in an enclosed vertical structure. Covers sky gardens, interior atriums, artificial sky technology, and the 90 km2 green space challenge. Singapore's skyrise greenery program, Jewel Changi Airport's Forest Valley, and Gardens by the Bay provide closest precedents, but no existing project approaches the scale required. Biosphere 2's pollinator collapse provides critical warnings for enclosed ecosystem design."
citations:
  - id: "biosensor-sky-gardens-2024"
    type: "peer-reviewed"
    title: "Restorative Benefits of Sky Gardens: A Biosensor Study"
    source: "Building and Environment"
    year: 2024
  - id: "sky-gardens-asia-2022"
    type: "peer-reviewed"
    title: "Sky Gardens in High-Density Cities: Analysis of 982 Projects"
    source: "Sustainability (MDPI)"
    year: 2022
  - id: "gardens-by-the-bay-2024"
    type: "project-data"
    title: "Gardens by the Bay Conservatory Specifications"
    source: "Gardens by the Bay"
    year: 2024
  - id: "bosco-verticale-2014"
    type: "project-data"
    title: "Bosco Verticale Technical Documentation"
    source: "Stefano Boeri Architetti"
    year: 2014
  - id: "singapore-skyrise-handbook-2023"
    type: "industry"
    title: "Skyrise Greenery Design Guidelines"
    source: "National Parks Board Singapore"
    year: 2023
  - id: "hong-kong-elevated-2020"
    type: "peer-reviewed"
    title: "Socialising on a Skywalk: Hong Kong's Elevated Walkways as Public Space"
    source: "ResearchGate"
    year: 2020
  - id: "coelux-artificial-sky-2023"
    type: "industry"
    title: "CoeLux Artificial Sky Technology"
    source: "CoeLux"
    year: 2023
  - id: "eden-project-2001"
    type: "project-data"
    title: "Eden Project Biome Engineering"
    source: "Grimshaw Architects"
    year: 2001
  - id: "koga-coelux-melatonin-2019"
    type: "peer-reviewed"
    title: "Non-visual effects of diurnal exposure to an artificial skylight, including nocturnal melatonin suppression"
    source: "Journal of Physiological Anthropology"
    year: 2019
  - id: "jewel-changi-2019"
    type: "project-data"
    title: "Jewel Changi Airport Forest Valley Specifications"
    source: "Jewel Changi Airport / Safdie Architects"
    year: 2019
  - id: "biosphere2-biodiversity-1996"
    type: "peer-reviewed"
    title: "Biosphere 2 and Biodiversity: The Lessons So Far"
    source: "Science"
    year: 1996
  - id: "woha-oasia-2016"
    type: "project-data"
    title: "Oasia Hotel Downtown Design Documentation"
    source: "WOHA Architects"
    year: 2016
  - id: "capitaspring-big-2021"
    type: "project-data"
    title: "CapitaSpring Tower: Biophilic Design Integration"
    source: "BIG-Bjarke Ingels Group / Carlo Ratti Associati"
    year: 2021
  - id: "ugspc-systematic-review-2025"
    type: "peer-reviewed"
    title: "Urban Green Space Per Capita for Sustainable and Equitable Urban Planning: A Systematic Review"
    source: "Land (MDPI)"
    year: 2025
  - id: "vertical-farm-energy-2024"
    type: "peer-reviewed"
    title: "Energy and cost analysis for a crop production in a vertical farm"
    source: "Applied Thermal Engineering"
    year: 2024
  - id: "biophilic-3d-green-2024"
    type: "peer-reviewed"
    title: "Implementing biophilic design in architecture through three-dimensional green spaces"
    source: "Journal of Building Engineering"
    year: 2024
cross_references:
  - slug: "urban-design-livability/residential/space-allocation"
    relationship: "depends-on"
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "environmental-systems/hvac/atmospheric-control"
    relationship: "depends-on"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "informs"
  - slug: "environmental-systems/food-production/food-systems"
    relationship: "parallel"
  - slug: "construction-logistics/robotics/robotics-factory"
    relationship: "informs"
open_questions:
  - "Can artificial sky technology sustain psychological well-being over years of permanent enclosed living, or does long-term habituation erode the circadian and mood benefits demonstrated in short-term studies?"
  - "How do you design fauna integration (pollinators, birds) in an enclosed ecosystem without repeating Biosphere 2's pollinator collapse — and is active managed pollination more viable than attempting self-sustaining populations?"
  - "What is the minimum ratio of genuine sky-access terrace area to total green space needed to prevent measurable psychological decline in permanent residents?"
assumptions:
  - "Population of 10 million residents"
  - "20% of usable floor area allocated to parks and open space (11.16 billion sqft per space-allocation entry)"
  - "Structure height of 5,000 feet with ziggurat setbacks creating tier-top terraces"
  - "9 m2 green space per capita as baseline target (widely applied international benchmark, originally from Italian planning standards DM 1444/1968, commonly attributed to WHO)"
  - "Deep interior spaces (beyond 6-8m from facade) comprise majority of floor area and require supplemental lighting for plant viability"
parameters:
  - name: "green_space_per_capita_target"
    value: 9
    unit: "m2/person"
    confidence: 3
  - name: "green_space_total_required"
    value: 90
    unit: "km2"
    confidence: 2
  - name: "base_footprint"
    value: 16
    unit: "km2"
    confidence: 2
  - name: "parks_allocation_pct"
    value: 20
    unit: "percent"
    confidence: 2
  - name: "parks_floor_area"
    value: 11.16
    unit: "billion sqft"
    confidence: 2
  - name: "largest_existing_sky_garden"
    value: 15000
    unit: "m2"
    confidence: 3
  - name: "largest_climate_controlled_interior_garden"
    value: 22000
    unit: "m2"
    confidence: 3
  - name: "bosco_verticale_trees"
    value: 800
    unit: "trees per tower"
    confidence: 3
  - name: "arcology_tree_target"
    value: 500000
    unit: "trees"
    confidence: 2
  - name: "natural_light_penetration_human"
    value: 15
    unit: "meters from facade"
    confidence: 2
  - name: "natural_light_penetration_plants"
    value: 6
    unit: "meters from facade"
    confidence: 2
  - name: "soil_weight"
    value: 1800
    unit: "kg/m3"
    confidence: 3
  - name: "mature_tree_weight"
    value: 5000
    unit: "kg average"
    confidence: 2
  - name: "max_vertical_distance_to_greenspace"
    value: 30
    unit: "meters (target)"
    confidence: 2
  - name: "supplemental_par_energy"
    value: 200
    unit: "kWh/m2/year"
    confidence: 2
  - name: "jewel_changi_trees"
    value: 3000
    unit: "trees in 22000 m2"
    confidence: 3
  - name: "urban_park_tree_density"
    value: 150
    unit: "trees/hectare"
    confidence: 2
---

## The 90 Square Kilometer Problem

The widely applied international standard of 9 m2 of green space per urban resident — commonly attributed to WHO, though a 2025 systematic review in *Land* (MDPI) traces the benchmark to Italian planning regulation DM 1444/1968 — sets the floor for livability. For 10 million people, that equals 90 km2, roughly 5.6 times the arcology's 16 km2 base footprint. The same review notes that WHO's *actual* recommendation targets 50 m2 per capita as ideal, which would require 500 km2 — an absurd figure for a single structure, and a useful reminder that the 9 m2 minimum is exactly that: a minimum.

No precedent exists for creating this much functional green space within an enclosed structure. Singapore's entire Skyrise Greenery program targets 200 hectares by 2030. The arcology requires 450 times that amount.

The 20% parks allocation from the space-allocation entry provides 11.16 billion sqft of floor area — approximately 1,036 km2 if measured as pure floor space. This far exceeds the 90 km2 minimum. But floor space is not green space. An interior room with potted plants is not a park. The challenge is not area, but quality: making interior spaces feel like genuine nature rather than elaborate greenery decoration.

## What Works at Current Scale

The best evidence for sky gardens comes from Singapore, where mandatory landscape replacement policies have driven systematic adoption. Research analyzing 982 sky gardens across Singapore, Hong Kong, and Shenzhen identifies specific design features that deliver measurable psychological benefits.

**Biosensor studies (2024)** using skin conductance, heart rate variability, EEG, and eye tracking found:

- Large sky gardens with spatial depth and plant diversity produce the strongest stress reduction
- Medium-scale gardens with high visual complexity ("vitality") provide the best physiological relief
- Even small sky gardens overlooking cityscapes deliver meaningful restorative effects
- Vegetative density matters more than garden area
- Rich color variation and stable green coverage are more effective than minimal or sparse planting

These findings suggest that the arcology does not need 90 km2 of continuous parkland. It needs thousands of high-quality sky gardens distributed so that every resident has access within a short walk. The Singapore model of mandatory green replacement ratios — every square meter of ground coverage must be replaced with equivalent vertical greenery — provides a policy template.

A 2024 review in the *Journal of Building Engineering* classifies three-dimensional green spaces in buildings as "green pockets" — rooftop gardens, sky gardens, green balconies, indoor gardens, and atrium gardens — and finds that emerging building codes increasingly mandate integrated green elements, recognizing that vegetative density and spatial complexity matter more for well-being than raw area alone.

## The Best Existing Precedents

**Jewel Changi Airport (Singapore, 2019)** now represents the most ambitious enclosed garden precedent. Designed by Safdie Architects, the Forest Valley spans five stories and 22,000 m2, housing approximately 3,000 trees and 60,000 shrubs of 120 species from high-altitude tropical forests worldwide. The HSBC Rain Vortex — a 40-meter indoor waterfall recirculating up to 37,850 liters per minute — demonstrates that dramatic water features can function within enclosed garden environments. At 135,700 m2 total floor area, Jewel proves that large-scale indoor botanical environments are commercially viable and publicly beloved. The arcology requires roughly 4,500 times the Forest Valley's garden area.

**Gardens by the Bay (Singapore, 2012)** operates the world's largest climate-controlled conservatories: the Flower Dome (1.2 hectares) and Cloud Forest (0.8 hectares) maintain Mediterranean and tropical montane climates respectively. The cooling system achieves near-zero carbon operation by burning waste wood biomass to power absorption chillers. This demonstrates that enclosed botanical environments can function at significant scale with sustainable energy systems.

**Bosco Verticale (Milan, 2014)** proved that significant tree populations can survive on building facades. Two towers (80m and 112m) support 480 large and medium trees, 300 small trees, 11,000 perennials, and 5,000 shrubs. The vegetation filters pollution, produces oxygen, and regulates building temperature. Maintenance requires specialized "flying gardeners" who rappel down the facade.

For the arcology, facade forests are secondary to interior and terrace parks, but Bosco Verticale demonstrates that trees at height are structurally and horticulturally viable. The arcology would need approximately 500,000 trees distributed throughout the structure — based on typical urban park densities of 100-200 trees per hectare applied to the fraction of allocated park area suitable for tree planting — and the maintenance model cannot rely on human rappelling.

**Singapore's Skyrise Greenery Program** provides the policy framework: mandatory 1:1 landscape replacement, incentive schemes (SGIS), Green Plot Ratio requirements, and the LUSH program for intensive rooftop greenery. At 200 hectares national target, the program addresses individual buildings rather than integrated mega-structures. But the standards and design guidelines establish what quality sky gardens require.

**Hong Kong's Elevated Walkway System** — 15+ km of pedestrian networks in the Central district — shows how elevated infrastructure becomes de facto public space in land-constrained environments. The social dynamics are revealing: food gathering and informal socializing dominate usage; marginalized populations depend on these spaces disproportionately; design choices about seating, climate control, and amenities determine whether the space serves all residents or only those passing through.

## The Deep Interior Challenge

In a structure kilometers wide, the vast majority of floor area is "deep interior" — beyond practical daylight reach from any facade. Daylighting research establishes that useful natural illumination penetrates approximately 2.5 times the window head height into a space. For typical 4-meter floor-to-ceiling heights, that yields roughly 8-10 meters of usable daylight; for generous 6-meter park-level ceilings, up to 15 meters. Plant viability is more constrained: even shade-tolerant species struggle beyond 6-8 meters from a window, and most indoor plants cannot survive beyond about 3 meters from an average window without supplemental lighting.

This creates a critical distinction between human daylight zones and plant daylight zones. Humans perceive adequate brightness at 15 meters from a well-designed facade. Plants need photosynthetically active radiation (PAR) that falls below viable thresholds at roughly 6 meters from the same facade. The deep interior — everything beyond these limits — requires technological intervention for both human psychology and plant survival.

Three technologies address this:

**Artificial Sky (CoeLux)** uses nano-structured optical panels and LED systems to replicate Rayleigh scattering — the optical phenomenon that makes the sky appear blue and creates the perception of infinite depth. A CoeLux installation only millimeters thick can create the visual perception of an open sky. The technology is deployed in hospitals, hotels, and commercial spaces where access to windows is limited.

A 2019 peer-reviewed study in the *Journal of Physiological Anthropology* (Koga et al.) directly tested CoeLux's non-visual effects in a simulated windowless office. Subjects exposed to CoeLux lighting showed higher nocturnal melatonin levels — a key indicator of healthy circadian alignment — compared to those under conventional fluorescent lighting. Sympathetic nervous system activity (stress markers) was reduced, while parasympathetic tone (rest and recovery) increased. The study concluded that artificial skylights can help maintain circadian rhythm stability in windowless environments. A separate study found that anxiety levels in CoeLux-lit rooms were "completely normal," while standard artificial lighting produced significantly elevated anxiety.

These results are encouraging but limited. All studies to date measure short-term exposure (days to weeks) in environments where subjects *know* they will leave. No study has tested whether artificial sky benefits persist over months or years of permanent enclosed living, or whether habituation erodes the psychological effect. This remains the single most important unanswered question for deep interior livability.

**Photosynthetic Lighting** supplements or replaces sunlight for plant growth. LED arrays tuned to the PAR spectrum can support healthy plant growth indefinitely. Vertical farms operate entirely under artificial light, with energy intensity ranging from 400 to 1,260 kWh/m2/year for intensive food production — driven by the combination of photosynthetic photon flux density (140-500 µmol/m2/s), photoperiod (12-24 hours), and photon efficacy (1.5-3.5 µmol/J).

Deep interior parks would not need agricultural-intensity lighting. Ornamental plantings and shade-tolerant species require roughly 200 kWh/m2/year of supplemental PAR — an order of magnitude below vertical farm intensity but still a significant energy load when multiplied across millions of square meters of interior parkland. Low-light adapted species (ferns, mosses, shade-tolerant groundcovers) can survive on lower intensities, and a layered planting strategy — shade-tolerant understory beneath canopy trees with targeted PAR lighting — reduces the total energy demand.

**Tier-Top Terraces** created by the ziggurat setbacks are the most valuable park space in the entire structure. These terraces have genuine sky access — sunlight, wind, weather, and horizon views. They are the only locations where residents experience actual outdoors without leaving the arcology.

The structural geometry should maximize terrace area. Every square meter of tier-top is worth more than ten square meters of interior park for psychological well-being. The setback angles are constrained by structural requirements, but within those constraints, terrace optimization is a primary design goal.

## Vertical Distribution and Sky Garden Spacing

A ground-level park in a conventional city serves residents within approximately 300 meters walking distance — a 5-minute walk. In a vertical structure, the relevant distance is three-dimensional. A park on floor 200 does not serve a resident on floor 250 unless they can reach it in reasonable time.

Contemporary high-rise biophilic design converges on a vertical interval of approximately 25-30 meters between sky gardens. WOHA's Oasia Hotel Downtown in Singapore places sky gardens at roughly 30-meter vertical intervals, creating distinct vegetated strata with community terraces and breezeways at each level. CapitaSpring tower by BIG and Carlo Ratti Associati integrates four connected levels of open-air garden at the building's core, with a total landscaped area of 8,300 m2 — a 140% green plot ratio exceeding Le Corbusier's ambitions. These projects demonstrate that 25-30 meter vertical spacing is both structurally feasible and perceptually effective for creating nature-connected high-rise living.

For the arcology, a target of 30 meters maximum vertical distance to meaningful green space implies:

- **Horizontal coverage**: Parks distributed so that no point is more than 150-200 meters from a park entrance
- **Vertical coverage**: Parks on every 30 vertical meters (~100 feet, or roughly 7-10 floors), connected by dedicated elevator service

This implies a minimum of 50 major park levels for a 1,500-meter structure, each with multiple park zones distributed across the floor plate. The 20% allocation must be understood volumetrically: many parks will be multi-story atria, consuming floor area on several levels to create a single open volume.

The circulation integration is critical. Parks cannot be isolated destinations requiring long elevator trips. They must be woven into the daily movement patterns — on the route to work, school, shopping, not a separate journey.

## Structural and Systems Integration

Green space at height creates engineering challenges that ground-level parks avoid:

**Weight.** Soil weighs 1,600-2,000 kg/m3. A park with 1 meter of planting depth adds 1.8 tonnes per square meter to floor loads. Water for irrigation adds more. Mature trees weigh 1,000-10,000+ kg each, with a reasonable average of 5,000 kg for the medium-scale species suitable for interior parks. Distributed across hundreds of floors, the cumulative load is enormous.

The structural engineering must accommodate these loads from the design stage. Retrofitting parks into a structure designed for standard floor loads is prohibitively expensive. The superstructure entry's load calculations must include distributed landscape mass.

**Water.** Parks need irrigation. At arcology scale, landscape irrigation is a significant water demand — potentially millions of gallons daily. This water must come from the closed-loop water system, and greywater recycling for irrigation is the obvious integration point. Rainwater capture at terrace levels reduces demand on the central system. Jewel Changi Airport's Rain Vortex demonstrates rainwater collection integrated directly into garden design — an approach scalable to tier-top terraces where rainfall can be captured and distributed to lower park levels.

**Atmosphere.** Enclosed parks require atmospheric management: temperature, humidity, CO2 levels (plants need CO2; humans produce it), and air quality. The HVAC system must treat park zones differently from residential or commercial space. The Gardens by the Bay model — integrated cooling via biomass combustion — suggests that park climate control can be designed for energy efficiency, but it requires dedicated systems.

## The Biosphere 2 Warning: Enclosed Ecosystems and Pollinator Collapse

Biosphere 2 provides the most relevant — and cautionary — precedent for enclosed ecosystem management at scale. During its 1991-1993 sealed experiment, virtually all introduced pollinating insects died. The globally invasive tramp ant *Paratrechina longicornis* came to dominate other ant species, and cockroach populations exploded. Many of the pollination functions that survived were performed not by the intended pollinators but by ants and cockroaches — a functional but drastically impoverished ecosystem.

Plant species diversity declined steadily after assembly. Several bird species were lost. The small, closed system proved far more vulnerable to cascading ecological disruption than its designers anticipated.

For the arcology, Biosphere 2's lessons are direct:

1. **Self-sustaining pollinator populations in enclosed structures should not be assumed.** Even with careful design, competitive exclusion, disease, and predation can collapse pollinator communities within years.
2. **Active managed pollination** — using maintained honeybee colonies, hand pollination for critical species, or robotic pollination systems — is more reliable than attempting to establish self-sustaining insect ecosystems.
3. **Fauna integration requires continuous intervention.** Unlike outdoor ecosystems where immigration replenishes lost species, enclosed systems have no immigration. Every extinction is permanent unless actively remediated.
4. **Pest species thrive disproportionately.** The species most likely to succeed in enclosed environments are the ones you least want: cockroaches, tramp ants, and disease vectors. Integrated pest management must be designed from day one.

The practical approach for the arcology is a managed ecosystem model rather than a wilderness model: maintained pollinator colonies in dedicated apiaries, controlled introduction of bird species in large atrium spaces, aggressive pest monitoring and suppression, and acceptance that the ecology will require ongoing human (and robotic) management indefinitely.

## Maintenance Economics

Bosco Verticale requires specialized gardeners rappelling down the facade for regular maintenance. At arcology scale — 500,000 trees, millions of smaller plants — that model does not work. The maintenance workforce would number in the thousands, and rappelling access is impractical for interior and terrace gardens.

Commercial landscape maintenance in the United States runs $800-1,600 per acre per month for full-service packages, with labor accounting for roughly 46% of total costs. Grounds maintenance workers earn a median of $22.37 per hour. At the arcology's scale — thousands of hectares of maintained green space — economies of scale apply, but the sheer volume of biological maintenance is staggering.

A conservative estimate based on commercial landscaping ratios: if 3,000-5,000 hectares of the parks allocation is actively planted (the rest being hardscape, water features, paths, and structures), maintaining it at urban park standards would require 3,000-5,000 full-time landscape workers. This is roughly the landscaping workforce of a large city — significant, but not impossible, and it represents meaningful employment for residents.

Automation offers partial solutions. Robotic pruning, sensor-based irrigation, drone-mounted monitoring, and AI-driven plant health diagnostics can reduce the human hours per plant. But plants are biological systems with high variance, and fully autonomous maintenance is not currently achievable for complex landscapes.

The practical approach is layered: automated monitoring and basic irrigation for all green space; robotic assistance for routine maintenance; human specialists for design, health assessment, and intervention. The robotics subdomain integration is critical — park maintenance is a leading use case for service robotics at arcology scale.

## The Psychological Threshold

Research on enclosed habitation (submarines, Antarctic stations, spacecraft) consistently identifies nature access as a primary factor in psychological well-being. The 2024 biosensor studies on sky gardens confirm that even brief exposure to well-designed green space produces measurable stress reduction. The 2019 Koga et al. study demonstrates that artificial sky technology can maintain circadian rhythm in windowless spaces — but only short-term effects have been measured.

The relevant question is not "how much green space is enough" — the 20% allocation provides generous area — but "what kind of green space prevents the psychological effects of living in an enclosed structure permanently."

No one has lived in a fully enclosed arcology-scale structure for years at a time. The closest precedents are isolated research stations where personnel rotate every 6-18 months, and the psychological challenges are well-documented. The arcology's residents will not rotate out. They will raise children, grow old, and potentially spend their entire lives without ever standing under an actual open sky (tier-top terraces excepted).

This is not a solved problem. The design must assume that high-quality interior green space, artificial sky technology, and tier-top access can together provide sufficient nature connection — but this assumption should be treated as hypothesis, not established fact. The 8.5% surplus allocation in the space-allocation entry serves partly as insurance: if psychological assessments during early habitation show that residents are struggling, surplus space can convert to additional parks.

The ratio of genuine sky-access terrace area to total green space may prove to be a critical design parameter. If terrace access is the psychological anchor — the thing that makes permanent interior living tolerable — then maximizing terrace area within structural constraints should take priority over expanding interior park volume.

## The Authentic Nature Debate

There is active debate over whether artificial plants and synthetic nature provide biophilic benefits. High-quality simulations — artificial trees, preserved moss walls, nature photography and video — can evoke some of the visual responses that living plants provide.

Research suggests that people respond differently when they know the nature is artificial. The stress-reduction benefits are reduced (though not eliminated) for synthetic environments. This implies that where possible, living plants are preferable — but in spaces where living plants cannot survive (true deep interior with no supplemental lighting), high-quality simulation may be better than nothing.

The practical middle ground: living plants wherever horticulturally viable, with supplemental PAR lighting at roughly 200 kWh/m2/year extending viability into deeper interior zones; high-quality simulation only where living systems are truly impractical; and design transparency — residents should know which spaces are living and which are simulated.

## Public vs. Private Green Space

Singapore includes private balcony gardens in its green space calculations. The arcology faces a similar question: should the 20% allocation emphasize communal parks or include distributed private gardens (balconies, terraces, window boxes)?

The WOHA architectural model places community terraces every 8-10 stories (roughly 25-30 meters), creating neighborhood-scale public space. This creates nodes of social interaction at walkable intervals. Private green space, by contrast, supports individual well-being but does not build community.

The answer is probably both: communal parks for social space and ecosystem function; private or semi-private green space (shared terraces for residential clusters) for everyday nature contact. The communal parks must be genuinely public — accessible to all residents, not gated by neighborhood or tier — while the private spaces can be allocated with residential units.

The balance matters for social equity. Hong Kong research documents how elevated walkway scarcity impacts disadvantaged groups most severely. If the best green spaces are effectively privatized (high-tier terraces, premium-location parks), the arcology will reproduce rather than resolve urban inequality.

## What the Arcology Requires

Synthesizing across precedents and constraints:

**Tier-top terraces** with genuine sky access are the highest-value green space and should be maximized within structural constraints. These terraces serve the entire population for true outdoor experience. The ratio of terrace area to total green space should be tracked as a key livability metric.

**Major park atria** (50,000+ m2 each) should appear on approximately every 100 vertical feet, distributed across the floor plate so that no resident is more than 200 meters horizontal distance from a park entrance. These parks should be multi-story volumes with 50-100+ foot ceiling heights. Jewel Changi's Forest Valley — 22,000 m2 with 3,000 trees across five stories — provides the closest design template, though arcology atria would need to be 2-3 times larger.

**Neighborhood sky gardens** (500-5,000 m2) should appear every 25-30 vertical meters, integrated with residential clusters, following the WOHA model established at Oasia Downtown and refined at CapitaSpring. These provide daily casual nature contact.

**Facade forests** following the Bosco Verticale model can cover appropriate exterior surfaces, contributing both to interior views and to external air quality.

**Artificial sky installations** are necessary for all deep interior parks and should be designed with the highest-fidelity technology available. The Koga et al. research supports circadian benefits, but long-term effectiveness under permanent habitation remains unvalidated.

**Managed ecosystem infrastructure** must replace the self-sustaining wilderness model. Dedicated apiaries for maintained pollinator colonies, controlled bird populations in large atria, integrated pest management systems, and continuous ecological monitoring are required — informed directly by Biosphere 2's lessons.

**Automated maintenance infrastructure** must be integrated from the design stage, with robotic access paths, sensor networks, and irrigation systems embedded in park construction.

The total system — terraces, atria, sky gardens, facades, artificial sky, managed ecosystems, and automation — must collectively achieve the psychological function of outdoor nature for a population that may spend years without leaving the structure. This is achievable with current technology, but it has never been attempted at this scale, and the Biosphere 2 experience warns that ecological assumptions made in design rarely survive contact with enclosed reality.
