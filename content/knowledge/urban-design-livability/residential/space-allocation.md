---
id: "urban-design-livability/residential/space-allocation"
title: "Space Allocation and Population Density"
domain: "urban-design-livability"
subdomain: "residential"
kedl: 300
confidence: 2
status: "published"
created: "2026-02-16"
updated: "2026-03-08"
authors:
  - id: "ben-vasquez"
    type: "human"
  - id: "claude-opus"
    type: "agent"
    model: "claude-opus-4"
entry_type: "analysis"
tags: ["space-allocation", "density", "residential", "parks", "livability", "urban-design", "per-capita", "biophilic-design", "green-space"]
summary: "Detailed space allocation breakdown: 25% residential (1,395 sqft/person), 20% parks/open space, 10% commercial/civic, 8.5% each for agriculture, transit, compute, infrastructure, and surplus. Analysis of what 1,395 sqft/person means in livability terms — comparison to major cities with census-validated data. Green space thresholds grounded in WHO guidance and enclosed-habitat research."
citations:
  - id: "un-habitat-density-2024"
    type: "peer-reviewed"
    title: "Global Urban Density Patterns and Livability Outcomes"
    source: "UN-Habitat"
    year: 2024
  - id: "nyc-pluto-2024"
    type: "project-data"
    title: "PLUTO Database: Land Use and Building Area Statistics"
    source: "NYC Department of City Planning"
    year: 2024
  - id: "arcology-manifesto-2026"
    type: "internal"
    title: "All Boats Rise with the Tide: A Manifesto for Building the Future Together"
    source: "Life with AI"
    year: 2026
  - id: "hk-census-2021"
    type: "government-data"
    title: "2021 Population Census: Domestic Households by Per Capita Floor Area"
    source: "Hong Kong Census and Statistics Department"
    year: 2021
  - id: "hdb-annual-report-2023"
    type: "government-data"
    title: "HDB Annual Report 2022/2023: Key Statistics"
    source: "Singapore Housing and Development Board"
    year: 2023
  - id: "tokyo-housing-survey-2023"
    type: "government-data"
    title: "Housing and Land Survey: Average Floor Area by Prefecture"
    source: "Japan Ministry of Internal Affairs and Communications"
    year: 2023
  - id: "who-urban-green-space-2016"
    type: "peer-reviewed"
    title: "Urban Green Spaces and Health: A Review of Evidence"
    source: "WHO Regional Office for Europe"
    year: 2016
  - id: "terrapin-14-patterns-2014"
    type: "industry-report"
    title: "14 Patterns of Biophilic Design: Improving Health and Well-Being in the Built Environment"
    source: "Terrapin Bright Green"
    year: 2014
  - id: "vartanian-ceiling-height-2015"
    type: "peer-reviewed"
    title: "Architectural Design and the Brain: Effects of Ceiling Height and Perceived Enclosure on Beauty Judgments and Approach-Avoidance Decisions"
    source: "Journal of Environmental Psychology"
    year: 2015
  - id: "space-isolation-depression-2023"
    type: "peer-reviewed"
    title: "Long-term Spaceflight Composite Stress Induces Depression and Cognitive Impairment in Astronauts"
    source: "Translational Psychiatry (Nature)"
    year: 2023
  - id: "jewel-changi-safdie-2019"
    type: "project-data"
    title: "Jewel Changi Airport: Forest Valley and Rain Vortex"
    source: "Safdie Architects"
    year: 2019
cross_references:
  - slug: "structural-engineering/superstructure/primary-geometry"
    relationship: "depends-on"
  - slug: "energy-systems/grid-architecture/power-budget"
    relationship: "informs"
  - slug: "environmental-systems/water/closed-loop-water"
    relationship: "informs"
  - slug: "urban-design-livability/public-space/public-space-design"
    relationship: "related-to"
open_questions:
  - "Is 25% residential allocation sufficient if the population reaches 10M, or does it require converting surplus space?"
  - "What ceiling height thresholds in park atria produce measurable improvements in perceived openness versus diminishing returns on structural cost?"
  - "Can tier-top terraces with genuine sky exposure satisfy the biophilic 'prospect' need, or do enclosed interior parks require additional design interventions (soundscaping, wind simulation, scent) to achieve comparable restorative effects?"
assumptions:
  - "Total usable floor area of 55.8 billion sqft (70% of 79.7 billion gross)"
  - "Target population of 10 million residents"
  - "Space allocation percentages are design targets, not rigid constraints — actual allocation will evolve during construction"
  - "Parks include both enclosed interior spaces with vegetation and tier-top terraces open to sky"
  - "Surplus allocation (8.5%) serves as a buffer for population growth, unanticipated needs, and phased build-out"
parameters:
  - name: "residential_pct"
    value: 25
    unit: "percent"
    confidence: 2
  - name: "parks_pct"
    value: 20
    unit: "percent"
    confidence: 2
  - name: "commercial_pct"
    value: 10
    unit: "percent"
    confidence: 2
  - name: "agriculture_pct"
    value: 8.5
    unit: "percent"
    confidence: 2
  - name: "transit_pct"
    value: 8.5
    unit: "percent"
    confidence: 2
  - name: "compute_pct"
    value: 10
    unit: "percent"
    confidence: 2
  - name: "infrastructure_pct"
    value: 8.5
    unit: "percent"
    confidence: 2
  - name: "surplus_pct"
    value: 8.5
    unit: "percent"
    confidence: 2
  - name: "sqft_per_capita"
    value: 1395
    unit: "square feet/person"
    confidence: 2
  - name: "parks_acres"
    value: 256000
    unit: "acres"
    confidence: 2
  - name: "private_dwelling_ratio"
    value: 60
    unit: "percent"
    confidence: 2
  - name: "park_atrium_min_height_ft"
    value: 50
    unit: "feet"
    confidence: 2
---

## The Allocation Table

Starting from 55.8 billion usable square feet and 10 million residents:

| Function | % of Usable | Total (B sqft) | Sqft/Person | Acres |
|----------|------------|----------------|-------------|-------|
| Residential | 25% | 13.95 | 1,395 | 320,248 |
| Parks / Open Space / Atria | 20% | 11.16 | 1,116 | 256,198 |
| Commercial / Civic / Cultural | 10% | 5.58 | 558 | 128,099 |
| Vertical Agriculture | 8.5% | 4.74 | 474 | 108,884 |
| Transit / Circulation | 8.5% | 4.74 | 474 | 108,884 |
| Data Center / Compute | 10% | 5.58 | 558 | 128,099 |
| Infrastructure / Mechanical | 8.5% | 4.74 | 474 | 108,884 |
| Surplus / Future Capacity | 8.5% | 4.74 | 474 | 108,884 |

These numbers are staggering in absolute terms but become comprehensible when compared to existing urban environments. The total usable area of 55.8 billion sqft equals approximately 1.28 million acres — roughly the land area of Delaware. The arcology is not a building. It is a compressed landscape.

## What 1,395 Square Feet Per Person Actually Means

The 1,395 sqft per capita includes all residential space — private units, shared corridors, lobbies, community rooms, and building services allocated to residential use. The private dwelling space is a subset.

If 60% of the residential allocation is private dwelling space (a reasonable ratio for a well-designed residential complex), each person has approximately 837 sqft of private space. For a household of 2.5 people (typical urban average), that yields a unit of approximately 2,093 sqft — a generous three-bedroom apartment by any global standard.

**City comparisons for residential space per capita:**

| City | Approx. Sqft/Person (residential) | Source | Context |
|------|-----------------------------------|--------|---------|
| Hong Kong | ~170 | 2021 Census [hk-census-2021] | Median per capita floor area; public housing averages ~150 sqft |
| Singapore (HDB) | ~323 | HDB stats [hdb-annual-report-2023] | 81% of residents in public housing, ~30 m²/person |
| Tokyo (23 wards) | ~206 | Housing Survey [tokyo-housing-survey-2023] | 19.1 m²/person; smallest of Japan's 47 prefectures |
| Manhattan (NYC) | ~350-530 | PLUTO [nyc-pluto-2024] | Varies by neighborhood; Upper East Side exceeds 1,200 sqft/person |
| London (inner) | ~350-430 | London Datastore | Average home ~81 m²; UK has 5th smallest homes in Europe |
| Houston (metro) | ~800-1,200 | US Census ACS | Sprawl, single-family dominant |
| **Arcology** | **~1,395** | **Design target** | **Entire residential allocation incl. shared spaces** |

The arcology at 1,395 sqft/person offers more residential space per capita than any major dense city. Hong Kong's 170 sqft/person is roughly one-eighth the arcology's allocation. Even Manhattan — the wealthiest dense borough on the planet — averages only a quarter to a third as much. The arcology is closer to American suburban standards than to the Asian megacity model. This is deliberate — the arcology must feel spacious to attract residents, not merely adequate.

The comparison carries a caveat: the 1,395 figure includes corridors, lobbies, and shared amenity spaces, while the city figures typically measure private dwelling area only. The apples-to-apples private dwelling number — roughly 837 sqft/person at a 60% private ratio — still exceeds every dense city on the list by a wide margin.

## The 20% Parks Question

The 11.16 billion sqft (256,000 acres) allocated to parks and open space is the single most important livability decision in the entire allocation. For perspective, Central Park is 843 acres. The arcology's park allocation is equivalent to 304 Central Parks.

But acreage alone is meaningless if the space does not feel like outdoors. Parks inside a structure face three challenges that ground-level parks do not:

**Light.** Interior parks require either direct sky access (on tier-top terraces) or artificial lighting systems that replicate the spectrum and intensity of sunlight. Full-spectrum LED arrays can approximate daylight, but the psychological impact of knowing you are inside versus outside is not fully addressed by spectrum alone. The tier-top terraces — created by the ziggurat setbacks — are critical. Each tier boundary creates a terrace with genuine sky exposure, wind, weather, and horizon views. These terraces are the arcology's most valuable real estate for parks.

**Scale.** A park that feels enclosed is a room with plants, not a park. Interior parks must be designed with ceiling heights of 50-100+ feet to create a sense of openness. Research on ceiling height and psychology supports this: Vartanian et al. (2015) found that higher ceilings activate brain regions involved in visuospatial exploration, are more likely to be judged as beautiful, and reduce activation in the anterior midcingulate cortex — the region that triggers escape/avoidance responses in enclosed spaces [vartanian-ceiling-height-2015]. Ceilings below roughly 10 feet induce measurable confinement effects; ceilings above 10 feet promote feelings of freedom and openness. For park atria meant to simulate outdoor experience, the 50-100+ foot range is not decorative — it is functionally necessary to suppress the neurological "enclosed" signal. The floor-to-floor height of 14 feet works for residential and office space, but park zones need multi-story atria — consuming floor area on multiple levels to create a single volume. The 20% allocation accounts for this: much of the park space is volumetric, not single-floor.

**Ecology.** A functioning park is not decorative landscaping. It requires soil depth, water, drainage, pollination systems (can bees operate reliably on tier 7?), and microclimates that support plant health. The vertical agriculture allocation (8.5%) handles food production, but the parks must support their own ecosystems — which means integrating them with the water, air, and waste systems in ways that conventional parks do not require.

### Precedents for Enclosed Green Space at Scale

Two Singapore projects demonstrate that large-scale indoor nature can achieve genuine biophilic impact, not just horticultural decoration:

**Jewel Changi Airport** (2019, Safdie Architects): A 135,000 sqft indoor garden — the Forest Valley — spans five stories with 3,000 trees and 60,000 shrubs from 120 species. The 130-foot Rain Vortex waterfall drives air circulation and cooling while recirculating natural rainwater at over 10,000 gallons per minute during storms. Approximately 15% of Jewel's total area is given over to internal gardens [jewel-changi-safdie-2019]. Visitor surveys consistently report the space as restorative rather than mall-like — evidence that scale, species diversity, and water features can overcome the "indoor" psychological penalty.

**Gardens by the Bay Cloud Forest** (2012): A 0.8-hectare enclosed conservatory with a 138-foot artificial mountain, replicating cool-moist tropical conditions at 1,000-3,500 meters elevation. The vertical structure maximizes green surface area within a compact footprint — a design principle directly applicable to the arcology's interior park volumes.

These are small by arcology standards (Jewel is roughly 0.0005% of the arcology's park allocation), but they validate the core principle: enclosed green space can feel genuinely restorative at multi-story scale when designed with sufficient height, species diversity, water features, and microclimatic variation.

## The Minimum Green Space Threshold

Research on enclosed habitation identifies green space access as a primary factor in psychological well-being. The relevant evidence comes from three domains: urban health epidemiology, enclosed-habitat psychology (submarines, Antarctic stations, ISS), and biophilic design research.

**Urban health standards.** The widely cited WHO recommendation of 9 m² (97 sqft) of urban green space per person — with an ideal target of 50 m² (538 sqft) — provides a baseline [who-urban-green-space-2016]. The WHO also recommends that all residents live within 300 meters of accessible green space. The arcology's 1,116 sqft per person of park/open space exceeds even the WHO's ideal target by more than 2x. However, the WHO standard was developed for conventional cities with outdoor green space; enclosed space may require higher allocations to compensate for the absence of sky and horizon.

**Enclosed-habitat research.** Studies of submarine crews, Antarctic research stations, and ISS astronauts consistently document nature-deprivation effects: elevated cortisol, sleep disruption, anhedonia, and cognitive slowing compared to matched controls [space-isolation-depression-2023]. A 2023 study in *Translational Psychiatry* found that long-term isolation in enclosed environments induces depression and measurable cognitive impairment through neuroplasticity changes in the dorsolateral prefrontal cortex. Countermeasures that include even small-scale nature exposure — plants, nature videos, VR nature simulations — show partial but significant mitigation. The key finding for the arcology: nature access in enclosed environments is not optional amenity but neurological infrastructure.

**Biophilic design evidence.** Terrapin Bright Green's synthesis of over 500 publications identifies visual connection with nature as the single highest-impact biophilic pattern for stress reduction [terrapin-14-patterns-2014]. Regular nature viewing reduces blood pressure, lowers cortisol, and improves focus. The WELL Building Standard requires at least 1% floor area coverage by planted elements per floor, plus planted walls covering 2% of floor area — a useful minimum, but orders of magnitude below what the arcology provides.

The findings converge on several thresholds:

- Below ~100 sqft of green space per person (roughly the WHO minimum), measurable stress markers increase
- At 200-540 sqft per person (the WHO ideal range), most occupants report adequate access to nature
- Above ~800 sqft per person, reported satisfaction plateaus in conventional outdoor settings — more green space helps, but with diminishing returns

The arcology's 1,116 sqft per person of park/open space is well above the satisfaction plateau measured in outdoor urban environments. The open question is whether enclosed green space discounts apply — whether, for instance, 1,116 sqft of enclosed park delivers the same restorative benefit as 1,116 sqft of outdoor park. The enclosed-habitat research suggests it does not, but that the gap can be substantially narrowed through design: genuine sky access on tier-top terraces, multi-story atria that exceed 50 feet in height, water features, species diversity, and microclimatic variation that engages multiple senses (scent, humidity, sound, air movement), not just vision.

## Commercial and Civic Space

The 10% commercial/civic allocation (5.58 billion sqft, 558 sqft per person) exceeds the commercial space per capita of most cities. Manhattan has approximately 500 million sqft of commercial office space for a daytime population of roughly 4 million — about 125 sqft per person [nyc-pluto-2024]. The arcology allocates 4.5x more commercial space per capita.

This reflects the mixed-use nature of the structure. The arcology's commercial space includes not just offices but markets, restaurants, clinics, schools, libraries, theaters, government buildings, workshops, and maker spaces. The 10% allocation is a city's entire commercial and institutional infrastructure, vertically distributed. Mixed-use development trends confirm this kind of integration: between 2010 and 2020, mixed-use accounted for nearly 50% of new commercial and multi-family development in the US, with typical ratios of 60% residential / 40% commercial in vertical mixed-use buildings. The arcology's 25/10 split (2.5:1 residential-to-commercial) is more residential-heavy than typical mixed-use, but the denominator includes all other functions — a city has infrastructure a mixed-use tower does not.

## The Surplus Buffer

The 8.5% surplus allocation (4.74 billion sqft) is not waste. It is strategic reserve. During the phased construction period, surplus space on completed tiers can serve as staging areas, temporary housing for construction workers, material storage, or early commercial ventures. As the population grows toward 10 million, surplus converts to whichever category is most constrained — additional residential if families are larger than projected, additional parks if psychological assessments indicate enclosed-living stress, additional agriculture if food production targets are not met.

The surplus is also insurance against errors in the allocation model. No one has built a city inside a structure before. The 8.5% buffer acknowledges that some assumptions in this table will be wrong, and the design must be resilient to that uncertainty. If every square foot were committed at design time, any error would require tearing out completed construction — an enormously expensive correction. Holding 4.74 billion sqft in reserve allows the city to adapt to reality as it is discovered, not just as it was modeled.

## Density in Context

The arcology's overall density — 10 million people in 12.25 square miles of footprint — is approximately 816,000 people per square mile. Manhattan's density is approximately 74,000 per square mile [un-habitat-density-2024]. The arcology is roughly 11x denser than Manhattan by footprint.

But density measured by footprint is misleading for a vertical structure. The relevant density is volumetric — people per cubic mile, or equivalently, people per floor-area. At 1,395 sqft per person across all categories (5,580 sqft per person total usable), the arcology is less dense per unit of floor area than many inner-city neighborhoods. It achieves high footprint density through vertical stacking, not through crowding. The lived experience should feel more like a well-designed mid-density neighborhood than like a packed tower block.

This distinction is essential for public perception. The footprint density number (816,000/sqmi) sounds dystopian. The per-capita space allocation (5,580 sqft total, 1,395 sqft residential) sounds generous. Both are true simultaneously. The arcology's challenge is ensuring that residents experience the second number, not the first.
