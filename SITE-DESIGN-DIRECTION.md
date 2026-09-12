# Floor by Floor — Site Design Direction

*Created: September 12, 2026*
*Status: Proposal — decisions awaiting Ben's call (see §9)*

---

## Purpose

A decision record for turning lifewithai.ai into a visual exploration of Arcology One as a built, working city: a day in the life, the quality of life inside well-designed density, and what it looks like for AI agents who have bodies and pair with humans. The Arcology One stories become the writing focus; the site is where every cross-posted story funnels back to.

The visual companion to this document (mockups of each plate, rendered in the proposed design system) was published as a Claude artifact and shared in the PR that added this file.

---

## 1. Where it stands (as of `main`)

| # | Finding | Evidence |
|---|---------|----------|
| 1 | Nine nav destinations for three audiences | Header: Stories, Blog, Arcology, Activity, The Brief, Podcast, Infographics, Mission Control, About, Sign in |
| 2 | The site promises a story every Saturday; the last shipped 2026-03-23 | Hero eyebrow, author letter, story footer all say "every Saturday" |
| 3 | Artwork is pencil-and-wash on cream paper; the shell is a dark dashboard | `public/images/stories/*` vs `globals.css` (`#0a0a0f`, cyan accent) |
| 4 | The two interactive experiences are the most original thing on the site and are three clicks deep | `/stories/water/experience`, `/stories/water-part-2/experience`, reached via a small banner |
| 5 | 32 MB of PNG in `public/images`; the OG card is 7 MB | Bluesky rejects link-card images over 1 MB; X skips oversized ones. Shares likely render without a picture |
| 6 | Two mailing lists; only one can send | `/api/v1/subscribe` writes to Netlify Blobs with `confirmed: false` and no send pipeline. Substack (footer link) actually delivers |
| 7 | Two tier vocabularies | Knowledge entry `institutional-design/governance/binding-hierarchy` counts autonomy (Tier 1 Tool → Tier 5 Autonomous). `content/experiences/water-part-2.json` counts bonds (Substrate, Membrane, Personal T1, Assigned T2, Compass T3, Embodied T4). *Water* Part 2 calls Pell "an inexperienced Tier 2"; under the bond scheme Pell is Tier 1 |
| 8 | World data lives in a component | In-universe dates, hooks, and Viktor commentary are hard-coded in `src/components/timeline/TimelineView.tsx` |

Side note: the standalone `arcology-mcp` repo is a stale copy of `Lifewithai/mcp` (SSE transport, old remote URL pointing at `bencorprondds-bot`, index snapshot from 2026-02-28). The deployed endpoint in `llms.txt` is `arcology-mcp.fly.dev`, built from `Lifewithai/mcp`. Pick one as source of truth and archive the other.

---

## 2. Thesis

**The site is the building.** Arcology One is 360 floors, ten terraced tiers, a mile of altitude. Elevation becomes the site's spine: the home page is a section drawing, every story pins to a floor, every system is a vertical thread, every resident (human or agent) has an address.

The Knowledge Node stays exactly what it is (an honest ledger of unsolved problems at CL 2) but moves one layer down. The reader-facing city is written in-world, present tense, 2038, as built. No KEDL badges and no open questions on the city layer. Every fact links down to its engineering basis for anyone who pulls the thread.

Three rules every page obeys:

1. A resident's experience first, how it works second, the engineering basis last and quietest.
2. Humans and agents get the same kind of entry.
3. The sketchbook, not the dashboard, is the visual language of the city.

---

## 3. Decisions

Numbered so they can be accepted or rejected by number.

### 1. One front door, and it is the city
Nav collapses to four: **Stories · The City · Workshop · About**. Workshop absorbs everything builder-facing: Knowledge Node, open questions, propose, review, benchmark, MCP/API docs, Activity, Mission Control, Blog, Infographics. The dark theme and the sign-in button live only there. The Brief and Podcast fold into About; story audio becomes a Listen button on the story page.
*Cost: an afternoon.*

### 2. Elevation is the spine
Home is a section drawing of the ziggurat, tiers labeled by altitude, floors with stories pinned. The same drawing appears in every story page rail with that story's floor lit. Stacked rectangles in SVG.
*Cost: one weekend. Plate A.*

### 3. Floor 318 is the pilot
Draw the floor that has already been written: atrium and mural column, flywheel corridors, ring corridor and junction planters, hydroponic bays on the glass wall, restaurants off the atrium, elevator lobby, rimpark with the hill, the railing over the drop to 310. Pins link to passages. New stories add places; nobody draws "the whole arcology."
*Cost: one weekend. Plate B.*

### 4. Residents, not characters; agents get the same card as humans
Index fields: name, kind, bond, floor, shell, first appearance. Requires one canonical vocabulary (see §9 B). Recommendation: bonds are the reader-facing "Tier" (Personal, Assigned, Compass, Embodied); the autonomy scale becomes "autonomy level L1–L5"; only one of them is ever called Tier.
*Cost: a day once vocabulary is settled. Plate D.*

### 5. A Day on 318 is the time axis
A 24-hour ribbon with two lanes (humans / agents & shells), assembled from `moments` in story frontmatter. Shows the thing the fiction is best at: the agents are awake when the humans are not.
*Cost: a day. Plate C.*

### 6. Systems as lived experience, in three layers
Promote the two experiences to a Systems section. Every system page: **Feel** (prose) → **Works** (diagram, with the existing AI-layer toggle) → **Basis** (Knowledge Node links, small). Existing: Water, Governance. Next: Shells, Cycles. Later: Compass, Vertical transport.
*Cost: a day to move two; each new system ≈ a story's worth of work. Plate F.*

### 7. The sketchbook is the visual identity
Palette from the illustrations and the story's materials:

| Token | Light (city) | Dark (workshop) | Job |
|-------|--------------|-----------------|-----|
| paper | `#F4EFE4` | `#12161B` | ground |
| ink | `#2A2C29` | `#E9E3D5` | type |
| wash | `#7C9E76` / deep `#4B6A47` | `#8CB287` / `#B3CFAE` | terraces, living things, humans |
| sunrise | `#DE6F63` | `#F0897C` | one job: the "you are here" marker |
| amber | `#E9AE5A` | `#F0BE6C` | atrium light |
| substrate | `#24476B` | `#7FB0E0` | anything that belongs to the agents |
| water | `#2A9D8F` | `#4FC1B3` | keep, from the Living Loop |

Type: **Bricolage Grotesque** (display), **Literata** (reading), **Geist Mono** (floor numbers, altitudes, times; already loaded). The city is light-first (a glass building in Texas sun); the Workshop stays dark.
*Cost: tokens and fonts in a day.*

### 8. Arcology One leads; Life with AI becomes the "Before" shelf
Stories index puts Arcology One first and frames 2029–2030 as the prequel era on the same timeline. Nothing deleted.
*Cost: an hour.*

### 9. Substack is the list of record; the site is canonical
Publish on lifewithai.ai first, cross-post full text to Substack the same day with a footer pointing to the floor. Site subscribe form hands off to Substack. Add stories RSS, per-story OG images, and replace "every Saturday" with a promise that is true ("New Arcology One stories as they are finished").
*Cost: a weekend. §5.*

### 10. Frontmatter carries the world
Floor, tier, world date, POV, residents, places, moments, systems, basis, hook, cover. Components read; nothing about a story lives in code.
*Cost: a day to extend types and migrate seven stories. §6.*

---

## 4. Plates (mockups in the artifact)

- **A · Home, elevation.** Ten tiers at 504 ft (36 floors × 14 ft), 30 subfloors at 16 ft, core band for compute/transit/services, Floor 318 at 4,452 ft pinned in sunrise. Horizontal scale compressed 3:1.
- **B · Floor 318, plan.** Rimpark ring, glass wall, ring corridor, eight radial corridors, atrium and column, hydroponic bays east, eight pins with a legend keyed to passages.
- **C · A Day on 318.** Two lanes over 24 hours, composited from *Water* Parts 1 and 2.
- **D · Residents.** Mel, Pell, Raquel, Gota, Compass, Davi on identical cards; Shell row shows embodiment.
- **E · Story page.** Literata reading column at 62ch; rail with floor number, mini-plan, residents chips, systems, engineering basis, Listen and Substack buttons.
- **F · Systems.** Six cards, Feel / Works / Basis, with status (built / next / later).

---

## 5. Cross-posting and the funnel

```
Write (repo) → lifewithai.ai/stories/<slug> (first, canonical, RSS, OG card)
                 ├→ Substack (full text; list of record; footer → the floor)
                 ├→ Bluesky / X / Reddit / Discord (illustration + hook + link)
                 └→ Medium via import tool (keeps canonical)
             every channel → story page → the floor → Subscribe (Substack)
```

Concrete fixes:
- **Publish order:** site first, Substack same day (Substack cannot set canonical).
- **Social cards:** per-story `opengraph-image` route: illustration + floor + title, under 1 MB.
- **One list:** export blob-store addresses into Substack once; point the form at Substack; keep the API endpoint for agents if wanted.
- **Feeds:** `/stories/feed.xml`, copied from the podcast feed route.
- **The promise:** remove "every Saturday" from hero, letter, and story footer.
- **Weight:** images to WebP at 1600 px (≈32 MB → ≈1 MB).

---

## 6. Content model (story frontmatter additions)

```yaml
series: "Arcology One"
world_date: "2038-07"          # replaces IN_UNIVERSE_DATES in TimelineView.tsx
floor: 318
tier: 9
pov: "human"                   # human | agent | mixed
hook: "Floor 318 is running out of water. Mel keeps watering the garden anyway."
cover: "water-floor-318-corridor"
residents:
  - { name: Mel,     kind: human,    role: gardener,      bond: Pell }
  - { name: Pell,    kind: personal, bond: Mel,           shell: "ERS pod (6 lobsters)" }
  - { name: Raquel,  kind: human,    role: floor captain, bond: Gota }
  - { name: Compass, kind: community }
places:
  - { id: atrium-mural, label: "The central column and its mural" }
  - { id: rimpark-rail, label: "The railing" }
moments:                       # feeds A Day on 318
  - { at: "21:10", lane: humans, text: "The floor rumbles. Water only goes one way.", tone: alarm }
  - { at: "03:00", lane: agents, text: "Pell coordinates every agent on 318; the lobsters cut and sort" }
systems: [water, shells, governance]
basis:                         # Knowledge Node ids, rendered small
  - environmental-systems/water/closed-loop-water
  - urban-design-livability/residential/space-allocation
```

`kind` values: `human | personal | assigned | community | embodied`. `viktor_intro`, `characters`, `themes` stay as they are.

---

## 7. Series seeds (each one is a commission for the map)

| Story | Whose eyes | Opens on the site |
|-------|-----------|-------------------|
| **Shell** — Pell's first weeks across six lobsters; 40 ms between selves | Agent | Shells system page; first agent-POV story; a resident with a body |
| **Ninety Days** — the man from Toledo comes back; a trial bond at 78; life on 318 unpaired | Human, unpaired | The bond ritual; the equity gap; a second household on the plan |
| **Off Duty** — an assigned medical-intake agent on its own hours, spending cycles on something nobody assigned | Assigned agent | Cycles system page; an assigned-agent card; a clinic on a new floor |
| **Level 6** — Raquel and Gota at the sector review; Compass's subsystems argue in human time | Human, with agent | Compass system page; Level 6 on the elevation |
| **Descent** — Mel goes to the subfloors to find where the furniture is made | Human | Vertical transport; subfloors and ground on the elevation; second floor plan |
| **Passing** — an embodied agent in a human-passing shell moves onto 318; someone asks | Embodied agent | Identification policy; an Embodied resident; the rebuilt festival |

---

## 8. Shipping order

**Phase A — Stop the bleeding (one weekend, no new design yet)**
- [ ] Nav to four items; Workshop absorbs builder pages
- [ ] Replace the Saturday promise (hero, letter, story footer)
- [ ] Images to WebP; per-story OG image route
- [ ] Subscribe hands off to Substack; stories RSS
- [ ] Frontmatter fields; migrate seven stories; delete the maps in `TimelineView.tsx`
- [ ] Arcology One first; Life with AI as "Before"

**Phase B — Build the floor (two or three weekends)**
- [ ] Tokens, fonts, light city / dark workshop
- [ ] Plate A: elevation home
- [ ] Plate B: Floor 318 plan
- [ ] Plate D: residents index (after §9 B)
- [ ] Plate F: Systems section; move Water and Governance
- [ ] Plate E: story page rail
- [ ] Plate C: day ribbon

**Phase C — Every story adds a floor (ongoing)**
- Each story ships with places, residents, moments, systems in frontmatter
- One new system page per two stories
- New floors get a plan only when a story has lived there

---

## 9. Calls only Ben can make

- **A. Light city, dark workshop, or dark everywhere?** Recommendation: light for the city.
- **B. Which vocabulary is "Tier"?** Recommendation: bonds for readers; the autonomy scale becomes "autonomy level L1–L5." Then fix Amos's line in *Water* Part 2 or decide Pell is Tier 2 and update the rings.
- **C. Fold Life with AI in as "Before," or park it?** Recommendation: fold it in; the 2030→2038 gap on the timeline becomes a feature.
- **D. Substack as the list of record?** Recommendation: yes, unless sending gets built.
