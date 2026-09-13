# Arcology reader experience

This branch introduces the visual city and Floor 318 as the reading entrance to Life with AI. It is a first illustrated neighborhood, not a complete city simulation.

## Design

The city overview provides orientation and scale. Resident pages provide human-scale scenes with labeled, keyboard-accessible exploration points. Readers can move from a person to another resident, a system, the story, or the wider city.

The palette comes from planted terraces: mist `#edf2ed`, leaf `#245b48`, deep water `#173a36`, sage `#bccfc4`, and daylight `#f8faf6`. Georgia carries the story titles and reading text; Geist provides quiet navigation and captions. The illustration does the expressive work. No chronology ribbon, fictional metrics dashboard, or inaccessible image-only navigation.

## Routes

| Destination                                   | URL                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| Main entrance                                 | `/`                                                                      |
| Arcology overview                             | `/arcology`                                                              |
| Mel before reading                            | `/arcology/floors/318/mel`                                               |
| Pell before reading                           | `/arcology/floors/318/pell`                                              |
| Mel after reading                             | `/arcology/floors/318/mel/after-water`                                   |
| Pell after reading                            | `/arcology/floors/318/pell/after-water`                                  |
| Complete Water                                | `/stories/water`                                                         |
| Previous second installment                   | `/stories/water-part-2` redirects permanently to `/stories/water#part-2` |
| Living Loop                                   | `/stories/water/experience`                                              |
| Binding Hierarchy                             | `/stories/water-part-2/experience`                                       |
| Tessera introduction                          | `/arcology/tessera`                                                      |
| Engineering index                             | `/arcology/research`                                                     |
| Essays, research, and other existing features | `/workshop`                                                              |

Existing engineering detail URLs, APIs, MCP entry, administration, other fiction, and both experiences remain available. The domains shortcut now redirects to the relocated engineering index.

## Editorial boundaries

The two published Water files are rendered together without rewriting the prose. The newly supplied complete manuscript is retained separately as an editorial reference. A later author pass can reconcile it with the published installments. The published story still says 2038; the newer world direction is approximately 2045. This branch does not silently change the story's date.

The working world bible and Upload manuscript are private references and are not committed or served. The bible is provisional: identity, work, relationship, and embodiment should remain separate concepts. Do not turn an agent's current role or body into an immutable classification of the person. Tier numbering and final addresses need an author pass before becoming public profile facts. Current profiles give the known story location, not an invented apartment number.

Do not assign unconfirmed floors to Upload's care facility, rooftop art space, or infrastructure. The overview is concept art and its markers are illustrative, not an engineering section drawn to scale. Tessera's base marker expresses the origin of an idea, not an established physical address.

## Adding the next story

Add confirmed resident records and scene entrances in `src/lib/arcology-world.ts`, then their explicitly approved routes. Each story may have an introductory scene and a different after-story scene. A person keeps one identity across those scenes. Scenes need not share a location, and no global timeline is required.

Each scene has an image, accessible description, meaningful hotspots, and corresponding text navigation. On a phone, the entire scene remains visible and the details follow below. Hotspot coordinates are percentages of the uncropped illustration. Do not crop a scene independently of its hotspots.

The server chooses the introductory or after-story payload; the shared client navigation imports no story data. Links to after-story scenes are labeled, not automatically prefetched from introductions, excluded from the sitemap, and marked noindex. Search/social metadata uses the introductory art. Noindex is an indexing preference, not access control: deliberate after-story URLs remain readable.

Subscription links use the site's existing Substack destination. This does not subscribe a reader automatically or replace the existing site's subscriber records. No fixed publication-day promise is made. A dedicated subscription provider and sender remain a separate decision.

## Verification and release

Run `npm run test:arcology`, `npx tsc --noEmit`, and the existing `npm run build` before merging. Tests cover resident lookup, reading-context preservation, scene coordinate bounds, spoiler-safe introductory payloads, both story installments, and both retained experiences.

At the start of this branch, the checked-in research validation report already contained **173 errors** and 176 warnings. Running the existing validator on unchanged research content reports 173 errors and 177 warnings. That prevents the existing build command from completing. This redesign does not relax the validator or change research claims to make it pass.

Local Windows host restrictions additionally prevent normal child-process spawning. TypeScript and application compilation pass using in-process tooling. The optional `ARCOLOGY_LOCAL_THREADS=1` configuration allows a working dev preview; a production static-export pass with threads hits a Next.js DataCloneError. A clean production build has therefore not been verified. Complete release validation in a normal build environment after resolving the research-content gate.

Do not merge this draft solely because the preview works.
