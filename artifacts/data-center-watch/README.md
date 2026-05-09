# Data Center Buildout Watch

A standalone Claude artifact — single-file React TSX. Drop into
`claude.ai/artifacts` to render. Not wired into the rest of this Next.js
project on purpose; the repo provides tone and editorial frame, the artifact
ships separately.

## What it does

A peer-reviewable scoreboard of U.S. AI infrastructure operators. Seven tabs:

- **Scoreboard** — operator-level grades on Water, Energy, Pollution,
  Transparency. Tiers: Trending Right / Mixed / Trending Wrong.
- **Facilities** — site-level catalog. Filterable by status, verification
  level, owner. Each facility carries: design, infrastructure drag, long-tail
  medical risk, profit & benefit sharing, public records, references, named
  contributors, last-verified date, and explicit "known gaps" the maintainers
  have not yet been able to confirm.
- **Concerns** — reference panel for the underlying environmental harms
  (PFAS, diesel/turbine emissions, water, ratepayers, noise, e-waste).
- **Community Voice** — aggregate stats from the Brockovich Data Center
  Reporting Initiative.
- **Contributors** — public credit registry. Humans, collectives, and AI
  agents are all first-class contributors. AI agents must name a human
  handler.
- **Methodology** — scoring rubric, verification ladder, and the
  Automation Pipeline (what the project intends to scrape vs. what's wired
  up today).
- **Contribute** — how to add a facility, dispute a claim, and the rules
  for AI agent participation.

## Editorial stance

Objective. Praise where earned, accountability where the record warrants it.
"Trending Right" is praise for measurable, verifiable practice; "Trending
Wrong" is a statement about specific operating choices in specific places —
not a verdict on AI as a whole.

Two-source rule for any factual claim: either two independent sources or one
primary public record cited inline. Better to mark something as a known gap
than to fabricate it.

## How to use

Open `DataCenterWatch.tsx`, paste into a Claude artifact, render. The data
arrays at the top of the file (`CONTRIBUTORS`, `COMPANIES`, `FACILITIES`,
`CONCERNS`, `COMMUNITY_STATS`, `AUTOMATION_PIPELINE`) are the public-facing
schema.

To add yourself as a contributor: append an entry to `CONTRIBUTORS`. AI
agents include a `handler` field naming the responsible human.

To add a facility: append to `FACILITIES` with a stable `id`, set
`verificationLevel` conservatively, and list anything you can't confirm in
`gaps`.

To dispute a claim: add a `claim` / `counterClaim` / `status` triple to the
facility's `disputes` array. Don't overwrite the original.

## Provenance

Seeded by the project initiator on 2026-05-08. Schema and v0.2 expansion
drafted by an AI agent (Claude Opus 4.7) operating under that initiator —
both listed in the Contributors tab. Brockovich Data Center Reporting
Initiative cited as the upstream community signal source. SELC and
Earthjustice cited for the xAI Colossus litigation record.
