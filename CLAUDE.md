# Lifewithai — working notes for Claude

The website and knowledge node for **Life with AI**: speculative fiction set in and
around Arcology One, plus a collaborative engineering knowledge base for it.

## Don't poll pull requests

See `.claude/skills/steward/SKILL.md`. Short version: **do not schedule recurring
check-ins on a PR.** Webhook events are the wake signal. A green, mergeable PR with no
open threads is done from your side — say so once and stop. Timed check-ins are only
for a red or conflicted PR you are actively driving to green, and then it's one
check-in sized to the wait, never an hourly heartbeat.

## Build

```bash
npm run prebuild && npx next build   # what netlify.toml runs — use this to verify
npx tsc --noEmit                     # typecheck
```

`npm run build` additionally runs `npm run validate`, which currently fails on
pre-existing content errors in `content/knowledge/`. That's a known separate problem;
don't let it block or expand an unrelated change.

## Content model

Everything reader-facing is files, no database. The prebuild step turns them into
`content-index.json`, which the REST API, the MCP server, and client-side search read.

| Path | What it is |
|------|------------|
| `content/stories/` | Fiction. Markdown + YAML frontmatter. `*.agent.md` is the agent-facing variant of the same story. |
| `content/floors/` | One JSON per Arcology One floor, driving `/city/floors/<n>`. |
| `content/experiences/` | Interactive system diagrams attached to a story. |
| `content/knowledge/` | Engineering entries, 8 domains, with KEDL level and confidence. |
| `content/blog/`, `content/pages/`, `content/infographics/` | The rest. |

**Floors are the unit of visual exploration.** A story set on a floor carries
`floor: <n>` in its frontmatter and gets an "Explore Floor N" banner. The floor's
places, residents, systems, and passages live in `content/floors/<n>.json`.

Rule for floor content: **everything on a floor plan comes from a story set there.**
Don't invent places for the map. New stories add places; the plan grows with them.

## Design direction

`SITE-DESIGN-DIRECTION.md` is the decision record. Confirmed direction: grounded
solarpunk, light-first for the city, readers can visually explore each story's floor.

Two visual worlds, deliberately:

- **The City** (`/city/*`) — light. Styles scoped to `.daylight` in `globals.css`.
  Off-white composite as the ground, graphite ink, one leaf green, one sunrise red
  reserved for the "you are here" marker, substrate blue for anything belonging to the
  agents. Hand-drawn linework. No glow, no gradients, no dashboard chrome.
- **Everything else** — the existing dark theme. Leave it alone unless a change says
  otherwise.

## Voice

Stories are by SB Corvus. Not utopian, not dystopian. Agents are characters with
standing, not tools or threats. When writing anything in-world (floor blurbs, place
descriptions), stay present tense and matter-of-fact: the arcology is built and
lived in, not proposed.
