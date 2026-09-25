# Next study: several districts inside one structural section

Status: proposed study method, not a selected construction system or approved placement.

The first comparison is now implemented in [section study 01](../section-study-01/README.md). Read its [generated findings](../section-study-01/output/report.md) before choosing an arrangement. The brief below records the study intent; a successful adapter run does not establish design viability.

The tools are now connected to reproducible local workflows. The next decision is how inhabited districts share a structural section while retaining daylight, continuous supports and maintainable, isolatable services. Preserve the confirmed brief: 100 million humans, 100 million paired AI plus other AI, at least 750 sqft of private dwelling area per human, a universally public flat summit, variable main tier count, and equipment-based compute requirements. Lead with the housing-led case and keep the shared-city case as the comparison.

## A bounded first comparison

Begin with four representative districts: two neighboring districts and two above them. This is a manageable test arrangement, not a new fixed subdivision of the whole Arcology. Use the current district program as the starting schedule; reconcile its exact floor area, open volume and service space after actual placement. Do not extrapolate a successful four-district result to the entire city without larger load-path and infrastructure models.

Compare three arrangements with the same private dwelling area and civic/service program:

1. Aligned districts with open courts that continue through upper levels.
2. Stepped districts where roofs become public terraces and lower courts receive more sky exposure.
3. Districts separated by larger open slots, with limited bridges carrying circulation and services.

Treat the preliminary support spacing, structural depth, tier height and court dimensions as variables. Do not close daylight openings merely to preserve a legacy tier count. Keep a separate tally of actual floor plates, voids, support footprints and infrastructure reservations; the massing study's numerical empty-volume allowance is not evidence that courts have been spatially fitted.

## Geometry and interfaces before optimization

Create a shared section input with stable IDs for districts, buildings, rooms/thermal zones, courts, public terraces, cores, columns/walls, bridges, plant rooms and utility connections. Use a metre-based 3D coordinate system with Z up and record every mapping into a 2D structural plane. Keep human housing, public/civic uses and AI/utility plant separately identifiable.

Each structural section needs an explicit boundary: what carries its gravity and lateral loads; where movement joints occur; which bridges can tolerate differential displacement; which utility connections cross that boundary. “Independent district” should be specified service by service, including the duration of operation after disconnection. A district can have local controls and isolation valves while depending on shared structure, bulk water, heat rejection, transport and energy supply.

| Decision | Initial model | Evidence needed before selection |
|---|---|---|
| Where supports and openings fit | Extend FreeCAD from the slab benchmark into native parametric cores, members and floor plates | Continuous geometry, space reservations, exchange round-trips, and section drawings |
| Which framing arrangement is plausible | Extend the OpenSees contract to the required 3D/nonlinear model after a material and load brief | Gravity/lateral load paths, reactions, deflections, stability and sensitivity to support stiffness; engineering review |
| Which inhabited fronts have usable sky access | Extend Radiance to actual court/terrace geometry, glazing and room sensors | Obstruction maps first, then site sky/sun and convergence-tested interior daylight results |
| Where thermal and AI heat loads go | Build EnergyPlus zones and schedules with explicit envelope/weather assumptions | Peak and annual thermal demand; separate cooling plant electricity, water use and rejected heat |
| What can remain operational during an outage | A service-connection graph and equipment/capacity schedule linked to the same IDs | Supply/return paths, isolation, backup duration, maintainability and common failure points |

These four tools do not by themselves provide a complete water, electrical-grid, evacuation or utility-reliability model. Begin those connections as an explicit graph and balance sheet; add a specialized hydraulic/electrical/transport solver when the decision requires it.

## Next deliverable

Produce a small comparison package: three plan/section alternatives, equal-program area schedules, support and service overlays, initial sky-visibility maps, and a list of assumptions that dominate the result. Select a direction only after those comparisons. Then develop the chosen section into explainer illustrations, showing both public spaces and the infrastructure that makes them possible.
