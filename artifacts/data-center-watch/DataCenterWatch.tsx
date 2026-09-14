// @ts-nocheck
"use client";

// ^ Both lines are intentional:
//   - "use client" is required when this file is rendered inside a Next.js
//     app-router preview page. It's a harmless no-op string literal in
//     claude.ai/artifacts.
//   - @ts-nocheck keeps this file portable as a single artifact without
//     forcing prop typing on every component. The Next.js build still
//     compiles JSX cleanly; only type-checking is suppressed for this file.

import React, { useState, useMemo } from "react";
import {
  Droplets,
  Zap,
  Wind,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  Filter,
  ArrowUpRight,
  Quote,
  Calendar,
  Skull,
  Leaf,
  Building2,
  Users,
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Bot,
  User as UserIcon,
  Cpu,
  Heart,
  HandCoins,
  Search,
  ScrollText,
  Wrench,
  Network,
  CircleDot,
  Sparkles,
} from "lucide-react";

// ============================================================
// Data Center Buildout Watch
// A peer-reviewable scoreboard of U.S. AI infrastructure operators.
// Standalone artifact — drop into claude.ai/artifacts as a single file.
//
// Editorial stance: objective. Praise where earned, accountability where
// the record warrants it. Every claim should track to a public source or
// a named contributor who has independently verified it. Nothing here is
// immutable — this file is meant to be forked, fact-checked, and amended.
// ============================================================

const LAST_UPDATED = "May 9, 2026";
const VERSION = "0.2.0";

// ============================================================
// Project owner — set to whoever is hosting this artifact.
// Contributors below get clear, visible credit. Add yours.
// ============================================================
const PROJECT_OWNER = {
  name: "Project initiator",
  url: "",
  bio: "Seed maintainer of the Data Center Buildout Watch. See Contributors tab.",
};

// ============================================================
// CONTRIBUTORS — the visible-credit registry.
// Add yourself by appending an entry. AI agents go alongside humans;
// `handler` names the human responsible for the agent's contributions.
// ============================================================

const CONTRIBUTORS = [
  {
    id: "initiator",
    name: PROJECT_OWNER.name,
    type: "human",
    role: "Initiator / Editor",
    joined: "2026-05-08",
    contributions: 1,
    bio: PROJECT_OWNER.bio,
    url: PROJECT_OWNER.url,
  },
  {
    id: "claude-opus-4-7",
    name: "Claude (Opus 4.7)",
    type: "ai-agent",
    role: "Research synthesis, schema design, drafting",
    handler: PROJECT_OWNER.name,
    handlerNote:
      "Operating under the project initiator's direction. All factual claims drafted by this agent are flagged for human verification before they harden.",
    joined: "2026-05-09",
    contributions: 1,
    bio: "Synthesized the v0.2 schema, expanded the operator scoreboard, and seeded the facility catalog with citations. Marks its own gaps explicitly rather than fabricating.",
    url: "https://www.anthropic.com/claude",
    model: "claude-opus-4-7",
  },
  {
    id: "brockovich-initiative",
    name: "Brockovich Data Center Reporting Initiative",
    type: "human-collective",
    role: "Community signal source",
    joined: "2026-01-01",
    contributions: 1713,
    bio: "Crowd-sourced community impact reports across 47 states. Cited as the upstream feed for the Community Voice tab.",
    url: "https://brockovichdatacenter.com/",
  },
  {
    id: "selc",
    name: "Southern Environmental Law Center",
    type: "human-collective",
    role: "Litigation & evidence",
    joined: "2026-01-01",
    contributions: 12,
    bio: "Aerial thermal-imaging evidence and notice-of-intent filings on xAI Colossus. Cited throughout the xAI entry.",
    url: "https://www.selc.org/",
  },
  {
    id: "earthjustice",
    name: "Earthjustice",
    type: "human-collective",
    role: "Litigation",
    joined: "2026-01-01",
    contributions: 4,
    bio: "Active Clean Air Act litigation against xAI. Filings provide primary-record evidence cited here.",
    url: "https://earthjustice.org/",
  },
];

// ============================================================
// SCORING DIMENSIONS
// ============================================================

const DIMENSIONS = [
  {
    key: "water",
    label: "Water",
    icon: Droplets,
    blurb:
      "Cooling approach, WUE, water source, and recycling practices. Lower direct water draw + transparent reporting scores higher.",
  },
  {
    key: "energy",
    label: "Energy",
    icon: Zap,
    blurb:
      "Power sourcing — clean PPA share, on-site generation type, ratepayer impact, and additionality of new generation.",
  },
  {
    key: "pollution",
    label: "Pollution",
    icon: Wind,
    blurb:
      "PFAS exposure, NOx/PM2.5 from on-site or backup generation, noise, e-waste handling, and community burden.",
  },
  {
    key: "transparency",
    label: "Transparency",
    icon: Eye,
    blurb:
      "Site-level disclosure, permit compliance, NDA practices, and willingness to engage with affected communities.",
  },
];

// ============================================================
// COMPANIES — operator-level scoreboard.
// Each company is scored 1-5 (5 = best) on the four dimensions.
// Add `references` for primary-source verifiability.
// ============================================================

const COMPANIES = [
  {
    id: "microsoft",
    name: "Microsoft",
    tier: "leading",
    short:
      "First major hyperscaler to commit to zero-water-evaporation new builds. Anchored the Three Mile Island restart. Site-level WUE still aggregate.",
    facilities:
      "Global fleet; new builds since Aug 2024 use closed-loop chip-level cooling. Crane Clean Energy Center (TMI restart) anchors PPA strategy.",
    scores: { water: 4, energy: 4, pollution: 4, transparency: 3 },
    cooling:
      "Closed-loop, chip-level cooling (zero-water-evaporation) is the new build standard. Fleet WUE 0.30 L/kWh (FY24), down 39% from 0.49 in 2021. Reclaimed/recycled water in TX, WA, CA, and Singapore.",
    energy:
      "20-year, 835 MW PPA with Constellation to restart Three Mile Island Unit 1 (rebranded Crane Clean Energy Center, ~$1.6B, targeting 2027–2028). Heavy renewables PPAs. No documented behind-the-meter gas turbine plays.",
    pollution:
      "Standard diesel backup at most sites. Continues to use fluorinated fluids in some cooling/fire suppression — phase-out tracking 3M's end of PFAS production. No active environmental justice litigation on AI sites.",
    transparency:
      "Publishes fleetwide WUE and PUE; does NOT publish site-level data. Standard NDAs with local utilities. Better than peers but still opaque on per-site water.",
    wins: [
      "Zero-water-evaporation cooling as new build standard (Aug 2024)",
      "Three Mile Island restart — first US fully-shut nuclear restart",
      "39% fleet WUE reduction since 2021",
    ],
    concerns: [
      "TMI restart slipping (originally 2027 → now 2028)",
      "Still no site-level WUE disclosure",
      "PFAS in cooling fluids being phased out, not yet eliminated",
    ],
    references: [
      {
        id: "msft-zwe",
        label: "Microsoft: Sustainable by design (Dec 2024)",
        url: "https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/",
        type: "corporate",
      },
      {
        id: "msft-tmi",
        label: "Constellation TMI restart — World Nuclear News",
        url: "https://www.world-nuclear-news.org/articles/constellation-to-restart-three-mile-island-unit-powering-microsoft",
        type: "news",
      },
      {
        id: "msft-fy24-sus",
        label: "Microsoft 2024 Environmental Sustainability Report (fleet WUE)",
        url: "https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report",
        type: "corporate",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    tier: "leading",
    short:
      "Best published fleet WUE among hyperscalers and the only one publishing meaningful site-level water data. SMR investment via Kairos.",
    facilities:
      "Council Bluffs IA (highest water draw, 1B gal in 2024), Pflugerville TX (air-cooled, 10K gal/yr), Storey County NV, Mango Farm VA, others.",
    scores: { water: 4, energy: 4, pollution: 4, transparency: 5 },
    cooling:
      "Mixed fleet. Fleetwide WUE ~1.10 L/kWh (2022, best-in-class for global operator). >25% of campuses use reclaimed/non-potable water. Air-cooled where climate allows. Massive site-level variance — 100,000x between best and worst facilities.",
    energy:
      "Up to 500 MW SMR commitment with Kairos Power (deployable early 2030s). Heavy renewable PPA portfolio. Has engaged in advanced-conductor and grid-upgrade financing as part of regional deals.",
    pollution:
      "Mango Farm (Gainesville VA) is among the cluster generating noise/air complaints in Loudoun-Prince William. Standard diesel backup with usual industry concerns. No documented EJ violations.",
    transparency:
      "Publishes per-facility water consumption — uniquely among hyperscalers. Reports for owned and leased sites; does not include third-party operated. Best transparency in the industry, still imperfect.",
    wins: [
      "Only major hyperscaler publishing site-level water data",
      "SMR fleet investment with Kairos Power",
      ">25% of campuses on reclaimed/non-potable water",
    ],
    concerns: [
      "Mango Farm VA noise/air complaints from neighbors",
      "Council Bluffs IA single-site water draw is significant (~1B gal/yr)",
      "Site-level reporting still excludes third-party operated facilities",
    ],
    references: [
      {
        id: "goog-env-report",
        label: "Google 2025 Environmental Report",
        url: "https://sustainability.google/reports/",
        type: "corporate",
      },
      {
        id: "goog-kairos",
        label: "Google × Kairos Power SMR deal coverage",
        url: "https://introl.com/blog/nuclear-power-ai-data-centers-microsoft-google-amazon-2025",
        type: "news",
      },
      {
        id: "goog-water-detail",
        label: "Google site-level water disclosures (per-facility table)",
        url: "https://sustainability.google/reports/",
        type: "corporate",
      },
    ],
  },
  {
    id: "apple",
    name: "Apple",
    tier: "leading",
    short:
      "Smaller AI footprint than peers but the cleanest published track record. Server upgrades alone cut 60M gallons of annual cooling water.",
    facilities:
      "Maiden NC, Reno NV, Mesa AZ, Prineville OR, plus international.",
    scores: { water: 4, energy: 4, pollution: 4, transparency: 4 },
    cooling:
      "Server upgrade and cooling optimization program achieved 227 million liter (60M gal) annual reduction across data centers. Mostly evaporative legacy with active modernization.",
    energy:
      "Long-standing 100% renewable claim for owned operations (verified by RE100). Smaller AI training footprint than peers means less aggressive new buildout.",
    pollution:
      "No active EJ litigation. Standard backup generators. Apple's smaller AI footprint (vs. Microsoft/Google/Meta scale) means lower aggregate impact.",
    transparency:
      "Published environmental data via annual Environmental Progress Report. Site-level granularity is moderate. Less scrutinized because smaller AI scale.",
    wins: [
      "60M gallon annual cooling water reduction via server upgrades",
      "Long-running 100% renewable for owned operations",
      "Smallest AI training footprint among the FAANG tier",
    ],
    concerns: [
      "AI buildout will scale up — current track record may not predict future practice",
      "Less site-level granularity than Google",
    ],
    references: [
      {
        id: "appl-env",
        label: "Apple Environmental Progress Report",
        url: "https://www.apple.com/environment/",
        type: "corporate",
      },
    ],
  },
  {
    id: "lancium",
    name: "Lancium",
    tier: "leading",
    short:
      "Lower-profile build partner. Closed-loop cooling is corporate policy, not optional. Operates the Stargate Abilene 'Clean Campus.'",
    facilities:
      "Stargate I in Abilene TX (Lancium Clean Campus), additional gigawatt campuses in development.",
    scores: { water: 5, energy: 4, pollution: 4, transparency: 3 },
    cooling:
      "All Lancium Clean Campuses require closed-loop cooling — once filled, no additional water for the life of the project. Storm Water Pollution Prevention Plans documented at all sites.",
    energy:
      "Sites strategically located near abundant West Texas wind. Heavy battery integration. The Abilene site does include 360 MW of on-site gas turbines for firm backup (Stargate footprint).",
    pollution:
      "Less scrutinized than hyperscalers. The on-site gas turbines at the Stargate campus are a real emissions source even if cooling is clean.",
    transparency:
      "Public sustainability messaging is clear; less independent verification given lower public profile.",
    wins: [
      "Closed-loop cooling as a corporate policy across all sites",
      "Abilene 'zero-impact' branding has held up to scrutiny on water",
    ],
    concerns: [
      "On-site gas turbines (via Stargate partnership) at Abilene undercut clean narrative",
      "Lower public profile means less independent verification",
    ],
    references: [
      {
        id: "lan-loc",
        label: "Lancium — Locations & Clean Campus design",
        url: "https://lancium.com/locations/",
        type: "corporate",
      },
    ],
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    tier: "mixed",
    short:
      "Massive nuclear bet (1.92 GW Susquehanna) but still using direct evaporative cooling at scale and opaque on site-level water.",
    facilities:
      "Northern Virginia (largest hyperscale concentration globally), Susquehanna PA campus (nuclear-co-located), global fleet.",
    scores: { water: 2, energy: 4, pollution: 3, transparency: 2 },
    cooling:
      "Direct evaporative cooling — hot air pulled through water-soaked pads — across the bulk of the fleet. Reports fleet WUE of 0.19 L/kWh, but evaporates ~80% of drawn water. Site totals not published.",
    energy:
      "Expanded Talen Energy PPA at Susquehanna nuclear from 960 MW to 1,920 MW. Major nuclear bet relative to peers. Significant solar/wind PPAs.",
    pollution:
      "Northern Virginia cluster is the most studied for cumulative air pollution, noise, and ratepayer impact. Standard diesel backup; has been pressured to engage with backup generator concerns.",
    transparency:
      "Reports water as 'WUE per unit of power' rather than site totals. Has stated commitment to 'increasingly disclosing site-specific water consumption data' — i.e., not yet doing so.",
    wins: [
      "1,920 MW Susquehanna nuclear PPA — largest single corporate nuclear deal",
      "Stated direction toward site-level water disclosure",
    ],
    concerns: [
      "Direct evaporative cooling at scale across fleet",
      "Site-level water data not published",
      "Loudoun County cumulative impact (shared with peers)",
    ],
    references: [
      {
        id: "aws-talen",
        label: "AWS × Talen 1.92 GW PPA expansion",
        url: "https://introl.com/blog/nuclear-power-ai-data-centers-microsoft-google-amazon-2025",
        type: "news",
      },
      {
        id: "aws-investor-pressure",
        label: "Investor pressure on AWS water disclosure",
        url: "https://www.insurancejournal.com/news/national/2026/04/08/864987.htm",
        type: "news",
      },
    ],
  },
  {
    id: "meta",
    name: "Meta",
    tier: "mixed",
    short:
      "RFP for 1–4 GW of new nuclear is real, but 99% of water comes from third-party municipal supply and disclosure is aggregated.",
    facilities:
      "Hyperion (Louisiana) — among largest under construction. Forest City NC, Prineville OR, Eagle Mountain UT, Temple TX, others.",
    scores: { water: 2, energy: 3, pollution: 3, transparency: 2 },
    cooling:
      "Reports company-wide water consumption (3.1B liters globally in 2023, 95% in data centers) but not site-level. Newer builds use evaporative-assisted cooling with aggressive efficiency targets — claims 80% better than industry average.",
    energy:
      "RFP for 1–4 GW of new nuclear generation. Vistra deal includes future SMR provision. Heavy renewables PPA portfolio but still grid-dependent in many regions.",
    pollution:
      "Hyperion (LA) is being scrutinized for footprint. Eagle Mountain UT and other sites have generated local concerns. Standard backup generator profile.",
    transparency:
      "99%+ of water withdrawal from third-party municipal supplies — concentrates impact on local utilities. Limited site-level reporting.",
    wins: [
      "RFP for 1–4 GW of new nuclear generation",
      "Newer builds reportedly 80% better than industry-average WUE",
    ],
    concerns: [
      "99%+ municipal water dependency concentrates community impact",
      "No site-level water disclosure",
      "Hyperion Louisiana scale raises local resource questions",
    ],
    references: [
      {
        id: "meta-sus",
        label: "Meta water and sustainability reporting",
        url: "https://sustainability.atmeta.com/",
        type: "corporate",
      },
    ],
  },
  {
    id: "stargate",
    name: "Stargate (OpenAI / Oracle / SoftBank / Crusoe)",
    tier: "mixed",
    short:
      "Closed-loop direct-to-chip cooling from day one — but 360 MW of on-site gas turbines per campus and heavy political fast-tracking.",
    facilities:
      "Abilene TX (flagship, 1.2 GW), Shackelford TX, Milam TX, Doña Ana NM, Lordstown OH, Mt Pleasant WI. ~7 GW planned across known sites; goal of 10 GW by 2029.",
    scores: { water: 4, energy: 3, pollution: 2, transparency: 3 },
    cooling:
      "Direct-to-chip closed-loop liquid cooling across all sites. ~1M gallon initial charge then top-up only. Genuinely a low-water design.",
    energy:
      "Each campus has 360 MW of on-site natural gas turbines for firm backup, supplemented by solar + battery + wind PPAs + grid. Wisconsin/Michigan partners committing to fund all incremental generation. Public commitment: 'paying our own way on energy' so the project doesn't raise local rates.",
    pollution:
      "On-site gas turbines at every campus = consistent NOx and PM emissions. Less acute than xAI's unpermitted approach but persistent. Federal political tailwind (Trump executive orders, expedited permitting) creates structural pressure to skip review.",
    transparency:
      "Stargate Community plans published per-site. Local infrastructure investment commitments (e.g., $175M in Wisconsin water restoration). Better than xAI by a wide margin; worse than Microsoft on independent verification.",
    wins: [
      "Closed-loop cooling design from day one across all sites",
      "Public 'pay our own way' commitment on energy costs",
      "Site-specific community investment programs (e.g., $175M Wisconsin water)",
    ],
    concerns: [
      "360 MW gas turbines per campus = ongoing emissions",
      "Federal political fast-tracking creates pressure to skip review",
      "Project delivery risk has been publicly questioned (financing, supply chain)",
    ],
    references: [
      {
        id: "sg-comm",
        label: "OpenAI — Stargate Community",
        url: "https://openai.com/index/stargate-community/",
        type: "corporate",
      },
      {
        id: "sg-five",
        label: "OpenAI — Five new Stargate sites",
        url: "https://openai.com/index/five-new-stargate-sites/",
        type: "corporate",
      },
      {
        id: "sg-rdw",
        label: "Stargate Abilene cooling design coverage",
        url: "https://www.rdworldonline.com/stargates-500b-bet-could-force-data-center-and-1-2-gw-grid-rethink/",
        type: "news",
      },
    ],
  },
  {
    id: "crusoe",
    name: "Crusoe",
    tier: "mixed",
    short:
      "AI-cooling tech is genuinely strong; the company's stranded-gas origins and current Stargate role complicate the clean narrative.",
    facilities:
      "Stargate Abilene (build partner with Lancium and Oracle), additional behind-the-meter gas-to-AI sites elsewhere.",
    scores: { water: 4, energy: 3, pollution: 3, transparency: 3 },
    cooling:
      "Closed-loop liquid cooling with zero-water-evaporation for AI campuses. Technical execution is among the best.",
    energy:
      "Original business was monetizing flared natural gas at oil wells via mobile compute. AI campus model has migrated toward cleaner mixes but the company's history is fundamentally tied to behind-the-meter fossil generation.",
    pollution:
      "Earlier flared-gas operations were a real emissions story. Newer AI sites are designed cleaner but the operating history matters.",
    transparency:
      "Public-facing technical disclosures are reasonable. Less independent verification than larger peers.",
    wins: [
      "Strong technical execution on closed-loop AI cooling",
      "Build partner role at Stargate Abilene",
    ],
    concerns: [
      "Company history with flared-gas behind-the-meter compute",
      "Tied to Stargate's broader political and emissions footprint",
    ],
    references: [
      {
        id: "crusoe-rdw",
        label: "Stargate Abilene technical coverage (Crusoe role)",
        url: "https://www.rdworldonline.com/stargates-500b-bet-could-force-data-center-and-1-2-gw-grid-rethink/",
        type: "news",
      },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    tier: "lagging",
    short:
      "Active Clean Air Act litigation. Operating dozens of unpermitted methane gas turbines. Sited in a community already at 4× national cancer risk.",
    facilities:
      "Colossus 1 (South Memphis TN) — 35 turbines, only 15 permitted. Colossus 2 (Southaven MS) — 27 unpermitted turbines plus permit pending for 41 permanent.",
    scores: { water: 2, energy: 1, pollution: 1, transparency: 1 },
    cooling:
      "Up to 1M gallons/day projected at Colossus 2. Originally drew from Memphis Sand Aquifer (the city's drinking water source). Wastewater recycling facility added under community pressure; recycling rate not disclosed.",
    energy:
      "Built unpermitted gas-fired power plants at both sites by classifying turbines as 'temporary mobile' — a category designed to avoid Clean Air Act PSD permitting. Colossus 1: 421 MW combined. Colossus 2: 495 MW from 27 unpermitted units.",
    pollution:
      "Modeled potential emissions from Colossus 2's permitted 41 turbines: 1,700+ tons NOx/year, 180 tons PM2.5, 500 tons CO, 19 tons formaldehyde. Independent study estimated $30–44M annual health damages. Combined facilities likely the largest industrial NOx source in Memphis. NASA/ESA satellite data shows 79% increase in peak NO2 in surrounding areas since operations began.",
    transparency:
      "City officials reportedly signed NDAs preventing public disclosure. Mayor stated 15 turbines were operational; thermal drone footage by SELC showed heat signatures on 33 of 35. Active lawsuits by NAACP, Earthjustice, SELC.",
    wins: [
      "Removed unpermitted turbines at Colossus 1 after notice of intent to sue",
      "Built a wastewater recycling facility under community pressure",
    ],
    concerns: [
      "Active Clean Air Act litigation (NAACP, Earthjustice, SELC)",
      "Turbines sited in 38109 (Boxtown) — already 4× national cancer risk",
      "City officials signed NDAs preventing public disclosure",
      "Officially-reported turbine count contradicted by aerial thermal imaging",
      "Memphis already failing federal smog standards before xAI arrived",
    ],
    references: [
      {
        id: "xai-selc",
        label: "SELC — xAI illegal power plant",
        url: "https://www.selc.org/news/xai-built-an-illegal-power-plant-to-power-its-data-center/",
        type: "litigation",
      },
      {
        id: "xai-ej",
        label: "Earthjustice — xAI lawsuit",
        url: "https://earthjustice.org/case/xai-illegal-gas-power-plant-data-center-colossus",
        type: "litigation",
      },
      {
        id: "xai-time",
        label: "TIME — Inside Memphis' Battle Against xAI",
        url: "https://time.com/7308925/elon-musk-memphis-ai-data-center/",
        type: "news",
      },
      {
        id: "xai-icn",
        label: "Inside Climate News — Colossus emissions",
        url: "https://insideclimatenews.org/news/17072025/elon-musk-xai-data-center-gas-turbines-memphis/",
        type: "news",
      },
    ],
  },
  {
    id: "msb-global",
    name: "MSB Global (Matrix Sulphur Springs)",
    tier: "lagging",
    short:
      "Marketing language ('Net-Zero AI') doesn't match the litigation reality. 30 data centers planned on contaminated former coal-mine land.",
    facilities:
      "Matrix Data Center Campus, Sulphur Springs TX — 1,677 acres, 30 planned 100MW buildings, NVIDIA GB300 systems with immersion cooling.",
    scores: { water: 3, energy: 2, pollution: 2, transparency: 1 },
    cooling:
      "Two-phase immersion cooling with dielectric fluids — the type of design that introduces PFAS exposure pathways. Cooling claims have not been independently verified.",
    energy:
      "First building powered by Bloom Energy fuel cell microgrid (cleaner than turbines but still gas). Plans cite geothermal + solar + batteries + 'natural gas with carbon capture.' Carbon capture component is aspirational.",
    pollution:
      "Site is reclaimed lignite coal mine — soil contamination from prior use is a separate active liability. PFAS exposure pathway via immersion cooling fluid is unmonitored.",
    transparency:
      "City council minutes show 18 months of relevant negotiations with no mention of 'data center,' 'AI,' or 'MSB Global.' Residents found out from a developer YouTube video. Active resident lawsuit alleges Open Meetings Act violations. City has set aside $1.2M in legal fees fighting two lawsuits.",
    wins: [
      "Immersion cooling design is technically a low-water choice",
      "Bloom fuel cell microgrid is cleaner than gas turbines",
    ],
    concerns: [
      "Active Open Meetings Act lawsuit by city resident",
      "Active deed-restriction lawsuit from prior landowner (Vistra/Luminant)",
      "270 community reports filed with Brockovich initiative — most-reported single facility nationally",
      "PFAS exposure pathway via immersion fluid not monitored",
      "Site is reclaimed contaminated coal-mine land",
    ],
    references: [
      {
        id: "msb-heatmap",
        label: "Heatmap News — Sulphur Springs vs. Vistra",
        url: "https://heatmap.news/plus/the-fight/spotlight/sulphur-springs-data-center-msb-global-vistra",
        type: "news",
      },
      {
        id: "msb-ketk",
        label: "KETK — 30 AI data centers at Sulphur Springs",
        url: "https://www.ketk.com/news/local-news/30-ai-data-centers-to-be-built-at-sulphur-springs-campus/",
        type: "news",
      },
    ],
  },
  {
    id: "stratos",
    name: "Stratos / O'Leary Digital (Box Elder)",
    tier: "lagging",
    short:
      "9 GW gas-fired data center campus — more than double Utah's total state electricity demand — fast-tracked with minimal public process.",
    facilities:
      "Stratos Project Area, Box Elder County UT — 40,000 acres of unzoned land north of the Great Salt Lake, with on-site 9 GW natural gas plant.",
    scores: { water: 3, energy: 1, pollution: 1, transparency: 1 },
    cooling:
      "Developers claim 'zero water turbine' technology. No publicly available hydrologic analysis or independent review. No manufacturers, technologies, or contracts have been cited.",
    energy:
      "9 GW of on-site natural gas generation — among the largest gas-fired plants ever proposed globally. Self-supplied to bypass grid interconnect constraints.",
    pollution:
      "Project would increase Utah's carbon footprint by ~50% based on developer's own projections. Methane is the dominant emission pathway; no carbon capture committed. Air quality impact studies not yet public.",
    transparency:
      "Box Elder commissioners learned of project in late March 2026; voted on it May 4 after one one-week delay. Hundreds protested with 'Shame! Shame! Shame!' chants. Commissioner Lee Perry: 'I literally have police officers in front of my house.' Commissioners stated they had limited authority because the land is unzoned and MIDA had pre-negotiated terms.",
    wins: [
      "Self-supplied generation does NOT directly raise local utility rates",
      "Will not draw from the Great Salt Lake watershed for cooling (claimed)",
    ],
    concerns: [
      "9 GW gas generation = single largest project-level methane source in proposal pipeline",
      "Fast-tracked through unzoned land + MIDA mechanism with minimal public input",
      "Carbon capture and 'zero water turbine' claims unverified",
      "Local commissioners received death threats over the vote",
      "Active referendum effort to repeal county approval",
    ],
    references: [
      {
        id: "strat-cd",
        label: "Common Dreams — Box Elder protest coverage",
        url: "https://www.commondreams.org/news/utah-mr-wonderful-data-center-protest",
        type: "news",
      },
      {
        id: "strat-und",
        label: "Utah News Dispatch — Stratos project details",
        url: "https://utahnewsdispatch.com/2026/05/04/box-elder-commissioners-approve-data-center/",
        type: "news",
      },
    ],
  },
];

// ============================================================
// FACILITIES — site-level catalog.
// Verification levels:
//   announced            Operator press release / public statement only
//   publicly-reported    Multiple independent journalistic sources
//   public-records       Linked to a permit, docket, FOIA, or court filing
//   independently-verified  A named contributor has confirmed on the ground
//
// `gaps` lists fields the maintainers know are unanswered. Better honest
// holes than fabricated data.
// ============================================================

const FACILITIES = [
  {
    id: "fac-tmi-crane",
    name: "Crane Clean Energy Center (Three Mile Island Unit 1 restart)",
    ownerId: "microsoft",
    operatorId: "microsoft",
    location: { city: "Londonderry Township", state: "PA", county: "Dauphin" },
    status: "permitted",
    verificationLevel: "public-records",
    capacityMW: 835,
    purpose:
      "Anchor PPA — 20-year offtake of nuclear baseload to power Microsoft's expanding AI fleet. Not a colocated data center; a generator dedicated to one.",
    design: {
      cooling: "Existing once-through cooling tower system at TMI Unit 1.",
      hardware: "Power generation only — output sent to grid via PJM.",
      density: "—",
    },
    infrastructureImpact: {
      waterSource: "Susquehanna River (cooling tower makeup, existing intake)",
      waterDraw: "Existing TMI permit envelope; restart does not expand draw",
      powerSourcing: "Restart of fully-shut nuclear unit; new generation to grid",
      ratepayerImpact:
        "Microsoft pays via PPA. Restart costs (~$1.6B) borne by Constellation, not ratepayers. PJM interconnection costs allocated per FERC tariff.",
      transmissionUpgradesNeeded:
        "Existing TMI substation; modest upgrades expected in NRC restart filings.",
    },
    medicalRisk: {
      pfasExposure: "none-known",
      noxPm25: "Nuclear — negligible operational NOx/PM",
      noiseDb: "Cooling tower noise (existing site profile)",
      cancerCorridor: false,
      notes:
        "Standard nuclear safety profile under NRC oversight. Public records on emergency planning zone unchanged from prior operating period.",
    },
    communityBenefit: {
      profitSharing:
        "Tax base restoration to Dauphin County and Londonderry Township (TMI was decommissioning prior)",
      ratepayerProtection: "PPA model — not on ratebase",
      localComputeShare: "None — generator only",
      jobsPermanent: 600,
      jobsConstruction: 3400,
    },
    publicRecords: [
      {
        type: "filing",
        label: "NRC restart application (Constellation)",
        issuingBody: "Nuclear Regulatory Commission",
      },
      {
        type: "filing",
        label: "PJM interconnection queue position (post-restart)",
        issuingBody: "PJM Interconnection",
      },
    ],
    references: ["msft-tmi", "msft-zwe"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Specific restart in-service date (slipping; latest public estimate 2028)",
      "Final allocation of PJM upgrade costs",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-google-council-bluffs",
    name: "Google Council Bluffs",
    ownerId: "google",
    operatorId: "google",
    location: { city: "Council Bluffs", state: "IA", county: "Pottawattamie" },
    status: "operating",
    verificationLevel: "public-records",
    purpose: "Long-running Google data center cluster in the Midwest fleet.",
    design: {
      cooling: "Mixed; predominantly evaporative.",
      hardware: "General fleet workloads; AI training present but not exclusive.",
    },
    infrastructureImpact: {
      waterSource: "Council Bluffs municipal supply",
      waterDraw:
        "~1.0 billion gallons in 2024 (Google site-level disclosure — highest of any Google site)",
      powerSourcing: "MidAmerican Energy mix + Google PPAs",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25: "Standard diesel backup",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Property tax + economic development agreements",
      ratepayerProtection: "Google rate class negotiated with MidAmerican",
      localComputeShare: "None disclosed",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "Pottawattamie County tax agreements (multiple amendments)",
        issuingBody: "Pottawattamie County",
      },
    ],
    references: ["goog-env-report", "goog-water-detail"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Per-megawatt cooling efficiency for AI-specific workloads on this campus",
      "Specifics of the most recent rate class renegotiation",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-google-pflugerville",
    name: "Google Pflugerville",
    ownerId: "google",
    operatorId: "google",
    location: { city: "Pflugerville", state: "TX", county: "Travis" },
    status: "operating",
    verificationLevel: "public-records",
    purpose:
      "Air-cooled Texas site — frequently cited as the low-water counterpoint to Council Bluffs.",
    design: {
      cooling: "Air-cooled (no evaporative makeup at site scale)",
      hardware: "General fleet",
    },
    infrastructureImpact: {
      waterSource: "Municipal — minimal direct draw",
      waterDraw: "~10,000 gallons/year (Google disclosure)",
      powerSourcing: "ERCOT grid + Google PPAs",
    },
    medicalRisk: {
      pfasExposure: "none-known",
      noxPm25: "Standard diesel backup",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Property tax abatements per Travis County records",
      ratepayerProtection: "ERCOT — competitive market, no captive ratepayer pass-through",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "Pflugerville Community Development Corp agreement",
        issuingBody: "City of Pflugerville",
      },
    ],
    references: ["goog-env-report"],
    contributors: ["claude-opus-4-7"],
    gaps: ["Comparable PUE/WUE for AI training racks vs. fleet average"],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-google-mango-farm",
    name: "Google Mango Farm",
    ownerId: "google",
    operatorId: "google",
    location: { city: "Gainesville", state: "VA", county: "Prince William" },
    status: "operating",
    verificationLevel: "publicly-reported",
    purpose: "Northern Virginia data center cluster member.",
    design: {
      cooling: "Mixed; site is part of Loudoun-Prince William hyperscale corridor.",
    },
    infrastructureImpact: {
      waterSource: "Prince William Service Authority municipal supply",
      powerSourcing: "Dominion Energy + Google PPAs",
      rateImpact:
        "Northern Virginia cluster correlated with $13.60/month residential bill increase approved by SCC Nov 2025.",
    },
    medicalRisk: {
      noxPm25: "Documented community noise/air complaints",
      noiseDb: "Resident reports of low-frequency 'organ vibration' — see Concerns: Noise",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Property tax revenue to Prince William County",
      ratepayerProtection: "None specific to this site",
    },
    publicRecords: [
      {
        type: "filing",
        label: "Virginia SCC Dominion biennial review (Nov 2025 order)",
        issuingBody: "Virginia State Corporation Commission",
      },
    ],
    references: ["goog-env-report"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Site-specific water draw (Google reports per facility but Mango Farm aggregates with regional cluster)",
      "Permitted backup generator count / runtime",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-aws-susquehanna",
    name: "AWS Cumulus / Susquehanna Co-located Campus",
    ownerId: "aws",
    operatorId: "aws",
    location: { city: "Salem Township", state: "PA", county: "Luzerne" },
    status: "operating",
    verificationLevel: "public-records",
    capacityMW: 1920,
    purpose:
      "Co-located with Talen Energy's Susquehanna nuclear plant; PPA expanded from 960 MW to 1,920 MW (subject to FERC and PJM filings).",
    design: {
      cooling: "Evaporative (typical AWS fleet design)",
      hardware: "AI + general workloads",
    },
    infrastructureImpact: {
      waterSource: "Susquehanna River-fed cooling system",
      powerSourcing: "Direct Talen nuclear PPA (behind-the-meter and grid)",
      ratepayerImpact:
        "FERC has reviewed the BTM allocation; concerns raised about cost shift to PJM ratepayers if upgrades become socialized. Outcome of disputes still in motion.",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25: "Standard diesel backup",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Tax revenue to Luzerne County and host township",
      ratepayerProtection:
        "Disputed — FERC challenge from competing utilities argues the BTM arrangement shifts grid costs to other ratepayers.",
      localComputeShare: "None disclosed",
    },
    publicRecords: [
      {
        type: "filing",
        label: "FERC docket on Talen-AWS interconnection arrangement",
        issuingBody: "Federal Energy Regulatory Commission",
      },
    ],
    references: ["aws-talen", "aws-investor-pressure"],
    contributors: ["claude-opus-4-7"],
    disputes: [
      {
        claim:
          "BTM allocation does not socialize costs to other PJM ratepayers (AWS / Talen position)",
        counterClaim:
          "Competing utilities argue the arrangement shifts ~hundreds of millions in grid costs (FERC docket)",
        status: "open",
      },
    ],
    gaps: [
      "Site-specific water consumption (AWS does not publish)",
      "Confirmed in-service date for full 1,920 MW configuration",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-meta-hyperion",
    name: "Meta Hyperion",
    ownerId: "meta",
    operatorId: "meta",
    location: { city: "Richland Parish", state: "LA" },
    status: "under-construction",
    verificationLevel: "publicly-reported",
    purpose:
      "One of the largest single-campus AI training builds under construction, supporting Meta's Llama-class workloads.",
    design: {
      cooling: "Evaporative-assisted (Meta's stated design lineage)",
    },
    infrastructureImpact: {
      waterSource: "Local municipal + ground sources (specifics not publicly itemized)",
      powerSourcing: "Entergy Louisiana grid + announced new gas + RFP for nuclear",
      rateImpact:
        "Entergy has filed for new generation tied to data-center load; Louisiana PSC reviewing cost allocation.",
    },
    medicalRisk: {
      noxPm25: "New gas generation tied to project carries permitted emissions envelopes",
      cancerCorridor: false,
      notes: "Louisiana's 'Cancer Alley' is geographically distinct but the regulatory context is relevant.",
    },
    communityBenefit: {
      profitSharing: "Property tax revenue + local hire commitments (Meta publication)",
      localComputeShare: "Not disclosed",
    },
    publicRecords: [
      {
        type: "filing",
        label: "Louisiana PSC dockets on Entergy generation additions",
        issuingBody: "Louisiana Public Service Commission",
      },
    ],
    references: ["meta-sus"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Site-specific water draw projection",
      "Final breakdown of Entergy generation additions attributed to Hyperion vs. other load",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-stargate-abilene",
    name: "Stargate I — Abilene (Lancium Clean Campus)",
    ownerId: "stargate",
    operatorId: "crusoe",
    location: { city: "Abilene", state: "TX", county: "Taylor" },
    status: "under-construction",
    verificationLevel: "public-records",
    capacityMW: 1200,
    purpose:
      "Flagship Stargate campus. Lancium hosts; Crusoe builds; Oracle anchors compute capacity for OpenAI workloads.",
    design: {
      cooling: "Direct-to-chip closed-loop liquid cooling (~1M gal initial charge, top-up only)",
      hardware: "Dense GPU racks; specifics not fully public",
    },
    infrastructureImpact: {
      waterSource: "Municipal — minimal recurring draw (per Lancium Clean Campus design)",
      waterDraw: "Low — closed-loop design",
      powerSourcing:
        "West Texas wind PPAs + battery + grid + 360 MW of on-site gas turbines for firm backup",
      ratepayerImpact:
        "Stargate publicly committed to 'paying our own way' on energy; Texas grid context (ERCOT) means no rate-base socialization mechanism in any case.",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25:
        "Persistent emissions from 360 MW gas turbines; permitted under TCEQ standards",
      noiseDb: "Industrial campus noise envelope (per TCEQ permit)",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing:
        "Stargate Community plans published per-site; Abilene includes local infrastructure investment",
      ratepayerProtection: "Self-supplied generation reduces grid impact",
      localComputeShare: "None disclosed",
      jobsConstruction: 4500,
    },
    publicRecords: [
      {
        type: "permit",
        label: "TCEQ air permit for on-site turbines",
        issuingBody: "Texas Commission on Environmental Quality",
      },
      {
        type: "permit",
        label: "Storm Water Pollution Prevention Plan (Lancium standard)",
        issuingBody: "TCEQ",
      },
    ],
    references: ["sg-comm", "sg-rdw", "lan-loc"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Permitted vs. operating turbine count (no current dispute, but worth periodic verification)",
      "Specific GPU count and training workload profile",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-stargate-mt-pleasant",
    name: "Stargate — Mt Pleasant WI",
    ownerId: "stargate",
    operatorId: "stargate",
    location: { city: "Mount Pleasant", state: "WI", county: "Racine" },
    status: "announced",
    verificationLevel: "publicly-reported",
    purpose:
      "Wisconsin Stargate site with public $175M water-restoration commitment to Lake Michigan watershed.",
    design: {
      cooling: "Direct-to-chip closed-loop (Stargate standard)",
    },
    infrastructureImpact: {
      waterSource: "Lake Michigan watershed (regulated by Great Lakes Compact)",
      powerSourcing:
        "Wisconsin partner committing to fund all incremental generation needed",
      ratepayerImpact: "Self-funded generation — minimal pass-through risk if held",
    },
    medicalRisk: {
      noxPm25: "Standard Stargate-template gas turbine envelope (~360 MW per campus)",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "$175M water restoration commitment (publicly stated)",
      ratepayerProtection: "Yes — self-funded generation framing",
      localComputeShare: "None disclosed",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "Mount Pleasant village development agreement (precedent: Foxconn)",
        issuingBody: "Village of Mount Pleasant",
      },
    ],
    references: ["sg-five", "sg-comm"],
    contributors: ["claude-opus-4-7"],
    gaps: [
      "Whether the $175M water restoration is binding via the Great Lakes Compact mechanisms",
      "Final site footprint and capacity",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-stargate-lordstown",
    name: "Stargate — Lordstown OH",
    ownerId: "stargate",
    operatorId: "stargate",
    location: { city: "Lordstown", state: "OH", county: "Trumbull" },
    status: "announced",
    verificationLevel: "publicly-reported",
    purpose: "Stargate site in former GM Lordstown industrial area.",
    design: {
      cooling: "Direct-to-chip closed-loop",
    },
    infrastructureImpact: {
      waterSource: "Local municipal",
      powerSourcing: "PJM grid + on-site generation per Stargate template",
      rateImpact:
        "Ohio's data center reform legislation cut prospective project pipeline from 30 GW → 13 GW; Lordstown's specific allocation tracked through PUCO.",
    },
    medicalRisk: {
      noxPm25: "Stargate gas-turbine template emissions",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Tax revenue + local hire commitments expected",
    },
    publicRecords: [
      {
        type: "filing",
        label: "PUCO data center reform docket",
        issuingBody: "Public Utilities Commission of Ohio",
      },
    ],
    references: ["sg-five"],
    contributors: ["claude-opus-4-7"],
    gaps: ["Capacity, in-service date, specific PUCO docket numbers"],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-xai-colossus-1",
    name: "xAI Colossus 1",
    ownerId: "xai",
    operatorId: "xai",
    location: {
      city: "South Memphis",
      state: "TN",
      county: "Shelby",
      neighborhood: "Boxtown / 38109",
    },
    status: "operating",
    verificationLevel: "independently-verified",
    capacityMW: 421,
    purpose: "First xAI training campus; site of active Clean Air Act litigation.",
    design: {
      cooling:
        "Originally drew from Memphis Sand Aquifer (the city's drinking water source). Wastewater recycling facility added under community pressure.",
      hardware: "100,000+ NVIDIA H100/H200 GPUs (xAI public claim)",
    },
    infrastructureImpact: {
      waterSource:
        "Memphis Sand Aquifer (initial), plus newer wastewater recycling — recycling rate not disclosed",
      waterDraw: "Up to 1M gallons/day projected at Colossus 2; Colossus 1 in similar envelope",
      powerSourcing: "Unpermitted on-site methane gas turbines + grid",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25:
        "Combined with Colossus 2: 1,700+ tons NOx/year modeled, 180 tons PM2.5, 500 tons CO, 19 tons formaldehyde. NASA/ESA satellite data: 79% peak NO2 increase in surrounding areas.",
      noiseDb: "Industrial; specific measurements pending",
      proximityToResidential:
        "Sited in 38109 (Boxtown) — community already at 4× national cancer risk before xAI arrived",
      cancerCorridor: true,
      notes:
        "Independent study estimated $30–44M annual health damages from combined facilities.",
    },
    communityBenefit: {
      profitSharing: "None disclosed; tax revenue to Shelby County",
      ratepayerProtection: "None — gas turbines bypass interconnect oversight",
      localComputeShare: "None disclosed",
    },
    publicRecords: [
      {
        type: "lawsuit",
        label: "NAACP / Earthjustice Clean Air Act lawsuit",
        issuingBody: "U.S. District Court (Earthjustice docket)",
      },
      {
        type: "filing",
        label: "Shelby County Health Department air permit decisions",
        issuingBody: "Shelby County Health Department",
      },
      {
        type: "foia",
        label: "FOIA — turbine permit applications and approvals",
        issuingBody: "Shelby County / Tennessee DEC",
      },
    ],
    references: ["xai-selc", "xai-ej", "xai-time", "xai-icn"],
    contributors: ["claude-opus-4-7", "selc", "earthjustice"],
    disputes: [
      {
        claim: "City officials stated 15 turbines were operational",
        counterClaim:
          "SELC thermal drone footage showed heat signatures on 33 of 35 turbines",
        status: "evidence favors counter-claim (independent imagery)",
      },
    ],
    gaps: [
      "Current operating turbine count post-litigation pressure",
      "Wastewater recycling rate (xAI has not disclosed)",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-xai-colossus-2",
    name: "xAI Colossus 2",
    ownerId: "xai",
    operatorId: "xai",
    location: { city: "Southaven", state: "MS", county: "DeSoto" },
    status: "operating",
    verificationLevel: "independently-verified",
    capacityMW: 495,
    purpose:
      "Second xAI campus, sited across the state line from Memphis to evade Tennessee permitting pressure.",
    design: {
      cooling:
        "Up to 1M gallons/day projected at Colossus 2; design and recycling not disclosed.",
    },
    infrastructureImpact: {
      waterSource: "Local municipal + groundwater (specifics not public)",
      powerSourcing: "27 unpermitted gas turbines + permit pending for 41 permanent",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25:
        "Modeled potential from 41 permitted turbines: 1,700+ tons NOx/year, 180 tons PM2.5, 500 tons CO, 19 tons formaldehyde",
      proximityToResidential:
        "Memphis-area airshed crosses state line; emissions affect TN residents regardless of MS siting",
      cancerCorridor: true,
    },
    communityBenefit: {
      profitSharing: "DeSoto County tax revenue (specifics not public)",
      ratepayerProtection: "None",
      localComputeShare: "None disclosed",
    },
    publicRecords: [
      {
        type: "permit",
        label: "Mississippi DEQ permit application — 41 permanent turbines",
        issuingBody: "Mississippi Department of Environmental Quality",
      },
    ],
    references: ["xai-icn", "xai-ej"],
    contributors: ["claude-opus-4-7", "earthjustice"],
    gaps: [
      "Final permit decision on 41 permanent turbines",
      "DeSoto County agreements (FOIA pending)",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-msb-sulphur-springs",
    name: "Matrix Data Center Campus",
    ownerId: "msb-global",
    operatorId: "msb-global",
    location: { city: "Sulphur Springs", state: "TX", county: "Hopkins", siteAcres: 1677 },
    status: "contested",
    verificationLevel: "public-records",
    capacityMW: 3000,
    purpose: "30 planned 100 MW buildings on a reclaimed lignite coal-mine site.",
    design: {
      cooling:
        "Two-phase immersion cooling with dielectric fluids — introduces PFAS exposure pathway not currently monitored",
      hardware: "NVIDIA GB300 systems (developer claim, not independently verified)",
    },
    infrastructureImpact: {
      waterSource:
        "Local municipal — exact draw not publicly committed despite immersion design",
      powerSourcing:
        "Bloom Energy fuel cell microgrid (first building); plans cite geothermal + solar + batteries + 'natural gas with carbon capture'",
      rateImpact:
        "Self-supplied microgrid claim mitigates ratepayer pass-through; carbon capture component is aspirational",
    },
    medicalRisk: {
      pfasExposure: "immersion-fluid",
      noxPm25: "Bloom fuel cells emit lower NOx than turbines but are still gas-fired",
      proximityToResidential: "Site is reclaimed coal mine; soil contamination is a separate liability",
      cancerCorridor: false,
      notes:
        "PFAS exposure pathway via immersion cooling fluid is not monitored. Standard landfill liners do not prevent PFAS leaching.",
    },
    communityBenefit: {
      profitSharing: "Tax abatement specifics not fully disclosed",
      ratepayerProtection: "Microgrid claim — not independently verified",
      localComputeShare: "None disclosed",
      notes:
        "City has set aside $1.2M in legal fees defending two active lawsuits — net negative to public coffers in the short term.",
    },
    publicRecords: [
      {
        type: "lawsuit",
        label: "Resident Open Meetings Act lawsuit",
        issuingBody: "Hopkins County District Court",
      },
      {
        type: "lawsuit",
        label: "Vistra/Luminant deed-restriction lawsuit",
        issuingBody: "Hopkins County District Court",
      },
      {
        type: "meeting-minutes",
        label: "Sulphur Springs city council minutes (18 months pre-announcement)",
        issuingBody: "City of Sulphur Springs",
      },
    ],
    references: ["msb-heatmap", "msb-ketk"],
    contributors: ["claude-opus-4-7", "brockovich-initiative"],
    disputes: [
      {
        claim: "Project will be 'Net-Zero AI' (developer marketing)",
        counterClaim:
          "PFAS immersion exposure pathway, gas-fired microgrid, and reclaimed coal-mine soil contamination are not addressed in the marketing",
        status: "open",
      },
    ],
    gaps: [
      "Confirmed cooling-fluid manufacturer and PFAS content disclosure",
      "Final NVIDIA hardware contracts",
      "Outcome of Open Meetings Act lawsuit",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-stratos-box-elder",
    name: "Stratos Project Area",
    ownerId: "stratos",
    operatorId: "stratos",
    location: {
      city: "Box Elder County",
      state: "UT",
      county: "Box Elder",
      siteAcres: 40000,
    },
    status: "contested",
    verificationLevel: "public-records",
    capacityMW: 9000,
    purpose: "Largest single-project gas-fired data center proposal in the U.S. pipeline.",
    design: {
      cooling: "Developer claim: 'zero water turbine' technology — no manufacturer named",
    },
    infrastructureImpact: {
      waterSource: "Claimed not to draw from Great Salt Lake watershed; specifics not public",
      powerSourcing: "9 GW on-site natural gas — self-supplied to bypass grid interconnect",
      rateImpact:
        "Self-supplied generation does not directly raise local utility rates, but the methane footprint affects state climate accounting and air quality.",
    },
    medicalRisk: {
      noxPm25:
        "Methane is dominant emission pathway; no carbon capture committed; air quality impact studies not yet public",
      cancerCorridor: false,
      notes:
        "Project would increase Utah's carbon footprint by ~50% based on developer's own projections.",
    },
    communityBenefit: {
      profitSharing: "MIDA-pre-negotiated terms; specifics opaque",
      ratepayerProtection: "Yes — self-supplied",
      localComputeShare: "None disclosed",
      notes:
        "Box Elder commissioners stated they had limited authority because the land is unzoned and MIDA had pre-negotiated terms.",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "MIDA agreement on Stratos project area",
        issuingBody: "Military Installation Development Authority (Utah)",
      },
      {
        type: "meeting-minutes",
        label: "Box Elder County Commission May 4, 2026 vote",
        issuingBody: "Box Elder County",
      },
    ],
    references: ["strat-cd", "strat-und"],
    contributors: ["claude-opus-4-7"],
    disputes: [
      {
        claim: "'Zero water turbine' technology will eliminate cooling water draw (developer)",
        counterClaim:
          "No manufacturer, technology, or contract has been cited; no independent hydrologic review",
        status: "open",
      },
    ],
    gaps: [
      "Active referendum effort to repeal county approval — outcome pending",
      "Any independent air-quality modeling",
      "Identity of off-takers (which AI operator(s) intend to use the capacity)",
    ],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-apple-prineville",
    name: "Apple Prineville",
    ownerId: "apple",
    operatorId: "apple",
    location: { city: "Prineville", state: "OR", county: "Crook" },
    status: "operating",
    verificationLevel: "publicly-reported",
    purpose: "Apple's high-desert Oregon data center campus.",
    design: {
      cooling: "Air-side economization where climate allows; modernization program ongoing",
    },
    infrastructureImpact: {
      waterSource: "Crook County / municipal",
      powerSourcing: "PacifiCorp grid + Apple PPAs (RE100-verified portfolio)",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      cancerCorridor: false,
    },
    communityBenefit: {
      profitSharing: "Property tax + community foundation grants (Apple discloses)",
      ratepayerProtection: "Not specific",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "Crook County tax agreements (Apple)",
        issuingBody: "Crook County",
      },
    ],
    references: ["appl-env"],
    contributors: ["claude-opus-4-7"],
    gaps: ["Site-specific water draw"],
    lastVerified: "2026-05-09",
  },
  {
    id: "fac-meta-eagle-mountain",
    name: "Meta Eagle Mountain",
    ownerId: "meta",
    operatorId: "meta",
    location: { city: "Eagle Mountain", state: "UT", county: "Utah" },
    status: "operating",
    verificationLevel: "publicly-reported",
    purpose: "Utah Meta data center campus.",
    design: {
      cooling: "Evaporative-assisted (Meta standard)",
    },
    infrastructureImpact: {
      waterSource: "Eagle Mountain municipal water",
      powerSourcing: "Rocky Mountain Power + Meta PPAs",
    },
    medicalRisk: {
      pfasExposure: "fire-suppression",
      noxPm25: "Standard diesel backup",
      cancerCorridor: false,
      notes: "Local concerns documented — see Brockovich initiative reports.",
    },
    communityBenefit: {
      profitSharing: "Tax abatements + community foundation",
      ratepayerProtection: "Not specific",
    },
    publicRecords: [
      {
        type: "agreement",
        label: "Eagle Mountain city development agreements",
        issuingBody: "City of Eagle Mountain",
      },
    ],
    references: ["meta-sus"],
    contributors: ["claude-opus-4-7"],
    gaps: ["Site-specific water draw under recent drought conditions"],
    lastVerified: "2026-05-09",
  },
];

// ============================================================
// CONCERNS — environmental harm reference panel.
// Each company score traces back to one or more of these.
// ============================================================

const CONCERNS = [
  {
    id: "pfas",
    title: "PFAS — Forever Chemicals",
    icon: Skull,
    severity: "high",
    summary:
      "Per- and polyfluoroalkyl substances are used in immersion cooling fluids, server component coatings, and clean-agent fire suppression. They bioaccumulate, never break down naturally, and are linked to cancer, reproductive harm, and immune dysfunction.",
    keyfacts: [
      "EPA set drinking water limit at 4 parts per trillion in 2024 — enforcement delayed to 2031",
      "Trump executive order (Sept 2025) directs EPA to fast-track chemical reviews 'supporting' AI/data center projects — including PFAS",
      "EPA does NOT require companies to report PFAS use or release",
      "3M ended all PFAS production end of 2025 — Novec 1230 alternatives are constrained",
      "Immersion cooling — marketed as 'sustainable' — is the primary new PFAS exposure pathway in AI infrastructure",
    ],
    sources: [
      {
        label: "Sierra Club — Data Centers Have a PFAS Problem",
        url: "https://www.sierraclub.org/sierra/data-centers-have-pfas-problem",
      },
      {
        label: "Bay Journal — Forever chemicals in data centers",
        url: "https://www.bayjournal.com/news/pollution/concerns-raised-about-forever-chemicals-in-data-centers/article_477e0100-d2d2-4bad-95c6-7855f4bae775.html",
      },
    ],
  },
  {
    id: "diesel",
    title: "Diesel & Gas Turbine Emissions",
    icon: Wind,
    severity: "high",
    summary:
      "Diesel backup generators emit 200–600× more NOx per unit of energy than natural gas plants. On-site gas turbines (xAI's approach) operate continuously and emit smog-forming compounds, fine particulates, and carcinogens like formaldehyde.",
    keyfacts: [
      "Diesel exhaust contains 40+ known cancer-causing organic substances",
      "Tier II diesel generators range 1.5–3 MW each; hyperscale sites have 50–100 of them",
      "Virginia DEQ guidance (Sept 2025) expanded permitted runtime for backup generators",
      "Modeled worst-case Virginia data center generators: 9,000 tons NOx regional release",
      "EDGI study found low-income communities within one mile of EPA-regulated data centers face elevated NO2 and diesel PM levels",
    ],
    sources: [
      {
        label: "WRI — How data centers affect US communities",
        url: "https://www.wri.org/insights/us-data-center-growth-impacts",
      },
      {
        label: "EDGI — Communities near data centers face heightened pollution",
        url: "https://envirodatagov.org/blogs/communities-close-to-epa-regulated-data-centers-face-heightened-air-pollution/",
      },
    ],
  },
  {
    id: "water",
    title: "Water — Direct vs Indirect",
    icon: Droplets,
    severity: "medium",
    summary:
      "The IEA's 560 billion liter global figure is misleadingly aggregated. ~140 billion L is direct cooling water; ~373 billion L is indirect (water consumed at thermoelectric power plants generating data center electricity). Local impact depends entirely on which category dominates at a given site.",
    keyfacts: [
      "WUE (Water Usage Effectiveness) = liters of water / kWh of IT load. Industry average ~1.8 L/kWh",
      "Best-in-class fleet WUE: Google ~1.10, Microsoft 0.30, AWS 0.19 (per-power-unit)",
      "Cornell (Nature Sustainability, Nov 2025): U.S. AI data centers projected to consume 731–1,125M m³/yr by 2030 — equivalent to 6–10M Americans of household water (NOT 6–10M households)",
      "Most direct cooling water comes from municipal supplies — typically at industrial rates, not residential subsidies",
      "Closed-loop cooling shifts the burden to electricity, which has its own indirect water cost",
    ],
    sources: [
      {
        label: "Cornell × Nature Sustainability paper (Xiao et al., Nov 2025)",
        url: "https://www.nature.com/articles/s41893-025-01681-y",
      },
      {
        label: "Patterns journal — Carbon and water footprints of data centers",
        url: "https://www.cell.com/patterns/fulltext/S2666-3899(25)00278-8",
      },
    ],
  },
  {
    id: "ratepayers",
    title: "Ratepayer Impact",
    icon: Zap,
    severity: "high",
    summary:
      "AI data center demand has driven the largest residential electricity rate increases in a decade. PJM capacity prices cleared 833% above prior year for 2025-2026. Virginia, Ohio, Maryland and Illinois ratepayers are absorbing the largest documented impacts.",
    keyfacts: [
      "Virginia: $13.60/month residential bill increase approved Nov 2025 (SCC)",
      "JLARC modeled $444/yr in additional residential bills by 2040 in Dominion territory",
      "PJM capacity auction: 833% increase 2024→2025; 22% further increase 2025→2026 (FERC cap)",
      "Western Maryland and Ohio: ~$16–18/month from PJM capacity costs alone",
      "Ohio's data center reform legislation cut prospective project pipeline from 30 GW → 13 GW",
      "78% of Virginia voters blame data centers for rising electricity bills",
    ],
    sources: [
      {
        label: "Virginia SCC order on Dominion biennial review",
        url: "https://www.scc.virginia.gov/about-the-scc/newsreleases/release/scc-issues-order-on-dev-biennial-review-2025/scc-rules-in-dev-biennial-review-case.html",
      },
      {
        label: "EESI — Data center power demands contributing to higher bills",
        url: "https://www.eesi.org/articles/view/data-center-power-demands-are-contributing-to-higher-energy-bills",
      },
    ],
  },
  {
    id: "noise",
    title: "Noise Pollution",
    icon: Wind,
    severity: "medium",
    summary:
      "Cooling systems, generator testing, and substations produce continuous low-frequency sound. Consumer-grade decibel meters can't measure it cleanly, which means most municipal noise ordinances don't apply. Loudoun County residents describe 'internal organ vibration' and chronic sleep disruption.",
    keyfacts: [
      "Smaller diesel generators reach 85 dB; larger industrial units approach 100 dB",
      "Low-frequency sound spans multiple ranges difficult to measure with standard equipment",
      "Loudoun County VA residents report sleep disruption, headaches, lower quality of life",
      "Generator monthly testing alone produces measurable air and noise impacts",
      "Some jurisdictions adopting natural acoustic barriers and increased setbacks",
    ],
    sources: [
      {
        label: "EESI — Communities raising noise pollution concerns",
        url: "https://www.eesi.org/articles/view/communities-are-raising-noise-pollution-concernsabout-data-centers",
      },
      {
        label: "US News — Living in Hell",
        url: "https://www.usnews.com/news/national-news/articles/2026-04-28/living-in-hell-data-center-neighbors-grapple-with-noise-air-pollution",
      },
    ],
  },
  {
    id: "ewaste",
    title: "E-Waste & Hardware Lifecycle",
    icon: Building2,
    severity: "medium",
    summary:
      "Data Center Coalition reports a 3–4 year average server lifespan. 100,000 GPUs deployed today become 100,000 GPUs of e-waste in 36–48 months. Specialized recyclers can handle PFAS-containing components; landfill liners cannot.",
    keyfacts: [
      "Server lifespan averages 3–4 years (industry self-reported)",
      "Specialized PFAS recyclers use thermal destruction or advanced filtration",
      "Standard landfill liners do not prevent PFAS leaching",
      "Lithium-ion BESS units are increasingly common; thermal runaway has caused multiple data center fires since 2024",
      "AI hardware turnover may accelerate further as B200 → B300 → next-gen architectures roll out",
    ],
    sources: [
      {
        label: "Bay Journal — Forever chemicals & e-waste",
        url: "https://www.bayjournal.com/news/pollution/concerns-raised-about-forever-chemicals-in-data-centers/article_477e0100-d2d2-4bad-95c6-7855f4bae775.html",
      },
    ],
  },
];

// ============================================================
// COMMUNITY VOICE — aggregate stats from the Brockovich initiative.
// ============================================================

const COMMUNITY_STATS = {
  totalReports: 1713,
  states: 47,
  uniqueZips: 793,
  recent30Days: 1624,
  asOf: "May 6, 2026",
  topCities: [
    { city: "Sulphur Springs, TX", count: 270 },
    { city: "Archbald, PA", count: 30 },
    { city: "Lusby, MD", count: 18 },
    { city: "Box Elder County, UT", count: 14 },
    { city: "Fort Meade, FL", count: 14 },
    { city: "San Angelo, TX", count: 11 },
    { city: "Cheyenne, WY", count: 9 },
    { city: "Ellendale, ND", count: 7 },
  ],
  concerns: [
    { label: "Water", pct: 41.2, count: 663 },
    { label: "Electricity / Grid", pct: 22.2, count: 358 },
    { label: "Health", pct: 18.1, count: 292 },
    { label: "Wildlife / Land", pct: 14.6, count: 235 },
    { label: "Noise", pct: 13.7, count: 221 },
    { label: "Zoning / Process", pct: 9.9, count: 159 },
    { label: "NDAs / Secrecy", pct: 8.0, count: 128 },
    { label: "Schools / Children", pct: 5.7, count: 91 },
  ],
  topStates: [
    { state: "Texas", count: 446, pct: 26.0 },
    { state: "Pennsylvania", count: 132, pct: 7.7 },
    { state: "Ohio", count: 104, pct: 6.1 },
    { state: "Georgia", count: 78, pct: 4.6 },
    { state: "Indiana", count: 66, pct: 3.9 },
    { state: "Missouri", count: 65, pct: 3.8 },
    { state: "Illinois", count: 59, pct: 3.4 },
    { state: "Michigan", count: 48, pct: 2.8 },
  ],
};

// ============================================================
// AUTOMATION PIPELINE — how this artifact is meant to stay current.
// Each entry is a candidate ingestion source. Prefer public records over
// news; prefer named contributors over scrapers; never publish a claim
// that fails the "two independent sources or one primary record" test.
// ============================================================

const AUTOMATION_PIPELINE = [
  {
    id: "permits",
    title: "Air & water permits",
    cadence: "Weekly",
    source: "State DEQ/DEC permit dockets (TCEQ, Virginia DEQ, Mississippi DEQ, etc.)",
    method:
      "Scheduled scrape of permit search portals; LLM extraction of project name, owner, NOx/PM envelopes; human review before publish.",
    status: "design",
  },
  {
    id: "ferc-puc",
    title: "FERC + state PUC dockets",
    cadence: "Daily",
    source: "FERC eLibrary, state PSC/PUC docket systems (VA SCC, OH PUCO, LA PSC, UT PSC)",
    method:
      "RSS where available; targeted scrape otherwise. Filter by 'data center,' operator name, and known load-allocation case numbers.",
    status: "design",
  },
  {
    id: "litigation",
    title: "Litigation tracking",
    cadence: "Daily",
    source: "PACER, state court e-filing, advocacy partners (SELC, Earthjustice, NAACP)",
    method:
      "Subscribe to dockets; structured filing summaries via LLM; never publish a legal claim without a docket number and date.",
    status: "design",
  },
  {
    id: "satellite",
    title: "Air & thermal satellite",
    cadence: "Weekly",
    source: "NASA TROPOMI / Sentinel-5P NO2; Landsat thermal band; commercial high-res for active disputes",
    method:
      "Routine NO2 deltas around known facility coordinates; flag anomalies to human review. Mirrors the SELC drone-imagery approach for ground truth.",
    status: "design",
  },
  {
    id: "community",
    title: "Community reports",
    cadence: "Continuous",
    source: "Brockovich Data Center Reporting Initiative + direct contributor submissions",
    method:
      "Ingest aggregate counts; respect contributor anonymity; never re-publish individual reports without explicit consent.",
    status: "operational",
  },
  {
    id: "corporate",
    title: "Corporate disclosures",
    cadence: "Quarterly + on-event",
    source: "Operator sustainability reports, 10-K/8-K filings, press releases",
    method:
      "RSS + filing-day pull. Flag any new metric (or any metric quietly removed) for the contributor team.",
    status: "design",
  },
  {
    id: "agent-drafting",
    title: "AI agent drafting",
    cadence: "On-demand",
    source: "Frontier LLMs (e.g. Claude Opus 4.7) operating under a named handler",
    method:
      "Agents draft updates with explicit citations and explicit gaps. Every agent edit enters peer review before it hardens. Agent identity and handler are public (see Contributors).",
    status: "operational",
  },
];

// ============================================================
// VISUAL META
// ============================================================

const TIER_META = {
  leading: {
    label: "Trending Right",
    color: "emerald",
    description: "Material commitments to clean water, clean energy, transparent reporting.",
    icon: CheckCircle2,
  },
  mixed: {
    label: "Mixed",
    color: "amber",
    description: "Real progress on some dimensions, persistent gaps on others.",
    icon: Info,
  },
  lagging: {
    label: "Trending Wrong",
    color: "rose",
    description: "Active environmental harm, regulatory violations, or process abuses.",
    icon: AlertTriangle,
  },
};

const tierClasses = {
  emerald: {
    border: "border-emerald-700/30",
    bg: "bg-emerald-50/60",
    text: "text-emerald-900",
    pill: "bg-emerald-700 text-white",
    soft: "bg-emerald-100 text-emerald-900",
    accent: "text-emerald-700",
  },
  amber: {
    border: "border-amber-700/30",
    bg: "bg-amber-50/60",
    text: "text-amber-900",
    pill: "bg-amber-700 text-white",
    soft: "bg-amber-100 text-amber-900",
    accent: "text-amber-700",
  },
  rose: {
    border: "border-rose-800/30",
    bg: "bg-rose-50/60",
    text: "text-rose-900",
    pill: "bg-rose-800 text-white",
    soft: "bg-rose-100 text-rose-900",
    accent: "text-rose-800",
  },
};

const STATUS_META = {
  announced: { label: "Announced", color: "stone", icon: CircleDot },
  permitted: { label: "Permitted", color: "stone", icon: FileText },
  "under-construction": { label: "Under construction", color: "amber", icon: Wrench },
  operating: { label: "Operating", color: "emerald", icon: CheckCircle2 },
  contested: { label: "Contested", color: "rose", icon: ShieldAlert },
  cancelled: { label: "Cancelled", color: "stone", icon: AlertTriangle },
};

const VERIFICATION_META = {
  announced: {
    label: "Announced only",
    description: "Operator press release or public statement. Not yet verified by a second source.",
    color: "stone",
  },
  "publicly-reported": {
    label: "Publicly reported",
    description: "Multiple independent journalistic sources have covered the same facts.",
    color: "stone",
  },
  "public-records": {
    label: "Public records",
    description: "Linked to a permit, docket, FOIA response, or court filing.",
    color: "emerald",
  },
  "independently-verified": {
    label: "Independently verified",
    description:
      "A named contributor has directly confirmed at least one core claim (imagery, measurement, public records review).",
    color: "emerald",
  },
};

// ============================================================
// SHARED COMPONENTS
// ============================================================

function ScoreBar({ value, max = 5 }) {
  const cells = Array.from({ length: max }, (_, i) => i < value);
  return (
    <div className="flex gap-1">
      {cells.map((on, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-sm ${on ? "bg-stone-700" : "bg-stone-200"}`}
        />
      ))}
    </div>
  );
}

function ScoreGrid({ scores, compact = false }) {
  return (
    <div className={`grid grid-cols-4 gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      {DIMENSIONS.map((dim) => {
        const Icon = dim.icon;
        const v = scores[dim.key];
        return (
          <div
            key={dim.key}
            className="flex flex-col gap-1.5 rounded-md border border-stone-200 bg-white px-2 py-1.5"
          >
            <div className="flex items-center gap-1.5 text-stone-600">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wide">{dim.label}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <ScoreBar value={v} />
              <span className="text-xs font-semibold text-stone-800">{v}/5</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ icon: Icon, label, text }) {
  if (!text) return null;
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-stone-500" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-stone-600 mb-0.5">
          {label}
        </div>
        <p className="text-sm text-stone-800 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function VerificationBadge({ level }) {
  const meta = VERIFICATION_META[level];
  if (!meta) return null;
  const cls =
    meta.color === "emerald"
      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
      : "bg-stone-100 text-stone-800 border-stone-300";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${cls} font-medium`}
      title={meta.description}
    >
      <ShieldCheck className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;
  const cls =
    meta.color === "emerald"
      ? "bg-emerald-100 text-emerald-900"
      : meta.color === "amber"
      ? "bg-amber-100 text-amber-900"
      : meta.color === "rose"
      ? "bg-rose-100 text-rose-900"
      : "bg-stone-100 text-stone-800";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${cls} font-medium`}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function ReferenceList({ ids = [], allReferences }) {
  const refs = ids
    .map((id) => allReferences.find((r) => r.id === id))
    .filter(Boolean);
  if (!refs.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-stone-200 hover:border-stone-400 transition"
        >
          {s.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

// ============================================================
// COMPANY CARD — operator-level scoreboard
// ============================================================

function CompanyCard({ company, expanded, onToggle }) {
  const meta = TIER_META[company.tier];
  const cls = tierClasses[meta.color];
  const TierIcon = meta.icon;

  return (
    <div
      className={`rounded-lg border ${cls.border} ${cls.bg} transition-shadow ${
        expanded ? "shadow-md" : "hover:shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        <div className="flex-shrink-0 mt-1">
          <div
            className={`h-9 w-9 rounded-full ${cls.pill} flex items-center justify-center`}
          >
            <TierIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-stone-900 font-serif tracking-tight">
              {company.name}
            </h3>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${cls.soft} font-medium`}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">{company.short}</p>
          <div className="mt-3">
            <ScoreGrid scores={company.scores} compact />
          </div>
        </div>
        <div className="flex-shrink-0 mt-1.5 text-stone-500">
          {expanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-200/60">
          <div className="pt-4 space-y-4">
            <DetailRow icon={MapPin} label="Facilities" text={company.facilities} />
            <DetailRow icon={Droplets} label="Water & Cooling" text={company.cooling} />
            <DetailRow icon={Zap} label="Energy" text={company.energy} />
            <DetailRow icon={Wind} label="Pollution Profile" text={company.pollution} />
            <DetailRow icon={Eye} label="Transparency" text={company.transparency} />

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              {company.wins?.length > 0 && (
                <div className="rounded-md bg-white border border-stone-200 p-3">
                  <div className="flex items-center gap-1.5 text-emerald-800 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[11px] uppercase tracking-wide font-semibold">
                      Material Wins
                    </span>
                  </div>
                  <ul className="text-sm text-stone-700 space-y-1.5">
                    {company.wins.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-700 mt-1">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {company.concerns?.length > 0 && (
                <div className="rounded-md bg-white border border-stone-200 p-3">
                  <div className="flex items-center gap-1.5 text-rose-800 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-[11px] uppercase tracking-wide font-semibold">
                      Open Concerns
                    </span>
                  </div>
                  <ul className="text-sm text-stone-700 space-y-1.5">
                    {company.concerns.map((c, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-rose-700 mt-1">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {company.references?.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-stone-600 mb-2">
                  References
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.references.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-stone-200 hover:border-stone-400 transition"
                    >
                      {s.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FACILITY CARD — site-level catalog
// ============================================================

function FacilityCard({ facility, owner, allReferences, expanded, onToggle }) {
  const ownerTier = owner ? TIER_META[owner.tier] : null;
  const ownerCls = ownerTier ? tierClasses[ownerTier.color] : null;

  const locationStr = [
    facility.location.city,
    facility.location.state,
    facility.location.county ? `${facility.location.county} County` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={`rounded-lg border ${
        ownerCls?.border || "border-stone-200"
      } bg-white transition-shadow ${
        expanded ? "shadow-md" : "hover:shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4"
      >
        <div className="flex-shrink-0 mt-1">
          <div
            className={`h-9 w-9 rounded-full ${
              ownerCls?.pill || "bg-stone-700 text-white"
            } flex items-center justify-center`}
          >
            <Building2 className="h-4 w-4" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-stone-900 font-serif tracking-tight">
              {facility.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={facility.status} />
              <VerificationBadge level={facility.verificationLevel} />
            </div>
          </div>
          <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span>{locationStr}</span>
            {facility.capacityMW ? (
              <>
                <span className="text-stone-400">·</span>
                <span>{facility.capacityMW.toLocaleString()} MW</span>
              </>
            ) : null}
            {owner ? (
              <>
                <span className="text-stone-400">·</span>
                <span>Owner: {owner.name}</span>
              </>
            ) : null}
          </div>
          {facility.purpose ? (
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">
              {facility.purpose}
            </p>
          ) : null}
        </div>
        <div className="flex-shrink-0 mt-1.5 text-stone-500">
          {expanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-200/60">
          <div className="pt-4 space-y-4">
            {/* Design */}
            {facility.design && (
              <div>
                <SectionHeading icon={Cpu} label="Design" />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                  <FieldRow label="Cooling" value={facility.design.cooling} />
                  <FieldRow label="Hardware" value={facility.design.hardware} />
                  <FieldRow label="Density" value={facility.design.density} />
                </div>
              </div>
            )}

            {/* Infrastructure */}
            {facility.infrastructureImpact && (
              <div>
                <SectionHeading icon={Network} label="Drag on local infrastructure" />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                  <FieldRow
                    label="Water source"
                    value={facility.infrastructureImpact.waterSource}
                  />
                  <FieldRow
                    label="Water draw"
                    value={facility.infrastructureImpact.waterDraw}
                  />
                  <FieldRow
                    label="Power sourcing"
                    value={facility.infrastructureImpact.powerSourcing}
                  />
                  <FieldRow
                    label="Ratepayer impact"
                    value={facility.infrastructureImpact.ratepayerImpact}
                  />
                  <FieldRow
                    label="Rate impact"
                    value={facility.infrastructureImpact.rateImpact}
                  />
                  <FieldRow
                    label="Transmission upgrades"
                    value={facility.infrastructureImpact.transmissionUpgradesNeeded}
                  />
                </div>
              </div>
            )}

            {/* Medical risk */}
            {facility.medicalRisk && (
              <div>
                <SectionHeading icon={Heart} label="Long-tail medical risk" />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                  <FieldRow
                    label="PFAS exposure"
                    value={renderPfas(facility.medicalRisk.pfasExposure)}
                  />
                  <FieldRow label="NOx / PM2.5" value={facility.medicalRisk.noxPm25} />
                  <FieldRow label="Noise" value={facility.medicalRisk.noiseDb} />
                  <FieldRow
                    label="Proximity to residential"
                    value={facility.medicalRisk.proximityToResidential}
                  />
                  <FieldRow
                    label="Cancer-corridor siting"
                    value={
                      facility.medicalRisk.cancerCorridor === undefined
                        ? null
                        : facility.medicalRisk.cancerCorridor
                        ? "Yes — pre-existing elevated risk in host community"
                        : "No"
                    }
                  />
                </div>
                {facility.medicalRisk.notes && (
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed italic">
                    {facility.medicalRisk.notes}
                  </p>
                )}
              </div>
            )}

            {/* Community benefit */}
            {facility.communityBenefit && (
              <div>
                <SectionHeading icon={HandCoins} label="Profit & benefit sharing" />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 mt-1">
                  <FieldRow
                    label="Profit sharing"
                    value={facility.communityBenefit.profitSharing}
                  />
                  <FieldRow
                    label="Ratepayer protection"
                    value={facility.communityBenefit.ratepayerProtection}
                  />
                  <FieldRow
                    label="Local compute share"
                    value={facility.communityBenefit.localComputeShare}
                  />
                  <FieldRow
                    label="Permanent jobs"
                    value={facility.communityBenefit.jobsPermanent}
                  />
                  <FieldRow
                    label="Construction jobs"
                    value={facility.communityBenefit.jobsConstruction}
                  />
                </div>
                {facility.communityBenefit.notes && (
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed italic">
                    {facility.communityBenefit.notes}
                  </p>
                )}
              </div>
            )}

            {/* Public records */}
            {facility.publicRecords?.length > 0 && (
              <div>
                <SectionHeading icon={ScrollText} label="Public records" />
                <ul className="text-sm text-stone-700 space-y-1.5 mt-1">
                  {facility.publicRecords.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-stone-400 mt-1.5">▸</span>
                      <span>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 mr-1.5">
                          {r.type}
                        </span>
                        {r.label}
                        {r.issuingBody ? (
                          <span className="text-stone-500"> — {r.issuingBody}</span>
                        ) : null}
                        {r.referenceNumber ? (
                          <span className="text-stone-500"> · {r.referenceNumber}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disputes */}
            {facility.disputes?.length > 0 && (
              <div>
                <SectionHeading icon={ShieldAlert} label="Active disputes" />
                <div className="space-y-2 mt-1">
                  {facility.disputes.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-md border border-amber-300 bg-amber-50/50 p-3 text-sm"
                    >
                      <div className="text-xs uppercase tracking-wide text-amber-800 font-semibold mb-1">
                        Claim
                      </div>
                      <div className="text-stone-800 mb-2">{d.claim}</div>
                      <div className="text-xs uppercase tracking-wide text-amber-800 font-semibold mb-1">
                        Counter-claim
                      </div>
                      <div className="text-stone-800 mb-2">{d.counterClaim}</div>
                      <div className="text-xs text-stone-600 italic">Status: {d.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {facility.gaps?.length > 0 && (
              <div>
                <SectionHeading icon={Search} label="Known gaps — help wanted" />
                <ul className="text-sm text-stone-700 space-y-1 mt-1">
                  {facility.gaps.map((g, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-stone-400 mt-1.5">▸</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* References */}
            {facility.references?.length > 0 && (
              <div>
                <SectionHeading icon={FileText} label="References" />
                <div className="mt-1">
                  <ReferenceList
                    ids={facility.references}
                    allReferences={allReferences}
                  />
                </div>
              </div>
            )}

            {/* Contributors + last verified */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-600 border-t border-stone-200 mt-2">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>
                  Contributors:{" "}
                  {facility.contributors
                    .map((id) => CONTRIBUTORS.find((c) => c.id === id)?.name || id)
                    .join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last verified {facility.lastVerified}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-stone-700">
      <Icon className="h-4 w-4" />
      <span className="text-[11px] uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
  );
}

function FieldRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="text-sm text-stone-800 leading-relaxed">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 mr-1.5">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

function renderPfas(value) {
  if (!value) return null;
  const map = {
    "none-known": "None known",
    "fire-suppression": "Fire suppression (legacy clean-agent)",
    "immersion-fluid": "Immersion cooling fluid (active pathway)",
    multiple: "Multiple pathways",
  };
  return map[value] || value;
}

// ============================================================
// VIEWS
// ============================================================

function ScoreboardView() {
  const [tierFilter, setTierFilter] = useState("all");
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    if (tierFilter === "all") return COMPANIES;
    return COMPANIES.filter((c) => c.tier === tierFilter);
  }, [tierFilter]);

  const grouped = useMemo(() => {
    const g = { leading: [], mixed: [], lagging: [] };
    for (const c of filtered) g[c.tier].push(c);
    return g;
  }, [filtered]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-stone-600 text-sm mr-1">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>
        {[
          { id: "all", label: "All" },
          { id: "leading", label: "Trending Right" },
          { id: "mixed", label: "Mixed" },
          { id: "lagging", label: "Trending Wrong" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setTierFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              tierFilter === f.id
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {["leading", "mixed", "lagging"].map((tier) => {
        const items = grouped[tier];
        if (!items.length) return null;
        const meta = TIER_META[tier];
        const cls = tierClasses[meta.color];
        const TierIcon = meta.icon;
        return (
          <section key={tier} className="space-y-3">
            <div className="flex items-baseline gap-3 border-b border-stone-300 pb-2">
              <div className={`flex items-center gap-2 ${cls.accent}`}>
                <TierIcon className="h-5 w-5" />
                <h2 className="text-xl font-serif font-semibold tracking-tight">
                  {meta.label}
                </h2>
              </div>
              <span className="text-xs text-stone-500">
                {items.length} {items.length === 1 ? "entry" : "entries"}
              </span>
              <span className="text-sm text-stone-600 ml-auto hidden md:inline">
                {meta.description}
              </span>
            </div>
            <div className="space-y-3">
              {items.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  expanded={!!expanded[c.id]}
                  onToggle={() => toggle(c.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function FacilitiesView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [expanded, setExpanded] = useState({});

  const allReferences = useMemo(() => {
    const refs = [];
    for (const c of COMPANIES) {
      if (c.references) refs.push(...c.references);
    }
    return refs;
  }, []);

  const filtered = useMemo(() => {
    return FACILITIES.filter((f) => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (verifyFilter !== "all" && f.verificationLevel !== verifyFilter) return false;
      if (ownerFilter !== "all" && f.ownerId !== ownerFilter) return false;
      return true;
    });
  }, [statusFilter, verifyFilter, ownerFilter]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2 text-stone-700 text-sm mb-3">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filter facilities</span>
          <span className="text-xs text-stone-500 ml-auto">
            {filtered.length} of {FACILITIES.length} shown
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <FilterPills
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "all", label: "All" },
              { id: "announced", label: "Announced" },
              { id: "permitted", label: "Permitted" },
              { id: "under-construction", label: "Under construction" },
              { id: "operating", label: "Operating" },
              { id: "contested", label: "Contested" },
            ]}
          />
          <FilterPills
            label="Verification"
            value={verifyFilter}
            onChange={setVerifyFilter}
            options={[
              { id: "all", label: "All" },
              { id: "announced", label: "Announced only" },
              { id: "publicly-reported", label: "Publicly reported" },
              { id: "public-records", label: "Public records" },
              { id: "independently-verified", label: "Independently verified" },
            ]}
          />
          <FilterPills
            label="Owner"
            value={ownerFilter}
            onChange={setOwnerFilter}
            options={[
              { id: "all", label: "All" },
              ...COMPANIES.map((c) => ({ id: c.id, label: c.name })),
            ]}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((facility) => {
          const owner = COMPANIES.find((c) => c.id === facility.ownerId);
          return (
            <FacilityCard
              key={facility.id}
              facility={facility}
              owner={owner}
              allReferences={allReferences}
              expanded={!!expanded[facility.id]}
              onToggle={() => toggle(facility.id)}
            />
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white p-10 text-center text-stone-600">
            No facilities match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPills({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`text-xs px-2.5 py-1 rounded-full border transition ${
              value === o.id
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConcernCard({ concern }) {
  const [open, setOpen] = useState(false);
  const Icon = concern.icon;
  const sevCls =
    concern.severity === "high"
      ? "bg-rose-100 text-rose-800"
      : concern.severity === "medium"
      ? "bg-amber-100 text-amber-800"
      : "bg-stone-100 text-stone-700";

  return (
    <div className="rounded-lg border border-stone-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-start gap-4 text-left"
      >
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-stone-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-serif font-semibold text-stone-900">
              {concern.title}
            </h3>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${sevCls} font-medium`}
            >
              {concern.severity} severity
            </span>
          </div>
          <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">
            {concern.summary}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1 text-stone-500">
          {open ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-stone-200/60">
          <div className="pt-4 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-wide font-semibold text-stone-600 mb-2">
                Key Facts
              </div>
              <ul className="text-sm text-stone-800 space-y-1.5">
                {concern.keyfacts.map((f, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-stone-400 mt-1.5 flex-shrink-0">▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {concern.sources?.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wide font-semibold text-stone-600 mb-2">
                  Sources
                </div>
                <div className="flex flex-wrap gap-2">
                  {concern.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-50 border border-stone-200 hover:border-stone-400 transition"
                    >
                      {s.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConcernsView() {
  return (
    <div className="space-y-4">
      <p className="text-stone-700 leading-relaxed">
        The dimensions used to score companies all derive from a small number of
        underlying environmental harms. This panel is the reference for what each
        one actually is, what the evidence base looks like, and where to follow it
        further.
      </p>
      <div className="space-y-3">
        {CONCERNS.map((concern) => (
          <ConcernCard key={concern.id} concern={concern} />
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">
        {value}
      </div>
      <div className="text-xs text-stone-600 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}

function CommunityView() {
  const stats = COMMUNITY_STATS;
  const maxConcern = Math.max(...stats.concerns.map((c) => c.pct));
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-300 bg-gradient-to-br from-stone-50 to-amber-50/40 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Quote className="h-8 w-8 text-stone-400" />
          </div>
          <div className="flex-1">
            <p className="text-stone-800 font-serif italic leading-relaxed text-lg">
              "The RACE to build AI infrastructures is unfolding town by town
              across America. In some places, data centers are welcomed. In others,
              they are delayed, contested or abandoned altogether."
            </p>
            <p className="text-sm text-stone-600 mt-2">
              — Erin Brockovich, Brockovich Data Center Reporting Initiative
            </p>
            <a
              href="https://brockovichdatacenter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 hover:text-stone-700 mt-3 underline-offset-2 hover:underline"
            >
              Visit the live community-reported map
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total Reports" value={stats.totalReports.toLocaleString()} />
        <StatTile label="States" value={stats.states} />
        <StatTile label="Unique Zips" value={stats.uniqueZips.toLocaleString()} />
        <StatTile
          label="Last 30 Days"
          value={stats.recent30Days.toLocaleString()}
        />
      </div>
      <p className="text-xs text-stone-500">
        Source data: Brockovich Data Center Reporting (community-stats.html), as of{" "}
        {stats.asOf}. Self-selected reporting — not a random sample. Pattern of
        clustering reflects both real local concentration and media-driven reporting
        waves.
      </p>

      <div>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">
          What Communities Are Reporting
        </h3>
        <div className="space-y-2">
          {stats.concerns.map((c) => (
            <div
              key={c.label}
              className="grid grid-cols-[140px_1fr_60px] items-center gap-3"
            >
              <div className="text-sm text-stone-700">{c.label}</div>
              <div className="bg-stone-100 rounded h-5 relative overflow-hidden">
                <div
                  className="bg-stone-700 h-full rounded transition-all"
                  style={{ width: `${(c.pct / maxConcern) * 100}%` }}
                />
              </div>
              <div className="text-sm text-stone-700 tabular-nums text-right">
                {c.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">
            Most-Reported Communities
          </h3>
          <div className="rounded-lg border border-stone-200 bg-white divide-y divide-stone-100">
            {stats.topCities.map((c, i) => (
              <div
                key={c.city}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 tabular-nums w-5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-stone-800">{c.city}</span>
                </div>
                <span className="text-sm font-semibold text-stone-700 tabular-nums">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Sulphur Springs alone — population ~16,000 — accounts for{" "}
            <span className="font-semibold">15.8%</span> of all national reports.
            That's not coincidence; it's a single community in active legal
            opposition to a 30-building campus.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">
            Top States
          </h3>
          <div className="rounded-lg border border-stone-200 bg-white divide-y divide-stone-100">
            {stats.topStates.map((s, i) => (
              <div
                key={s.state}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 tabular-nums w-5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-stone-800">{s.state}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 tabular-nums">{s.pct}%</span>
                  <span className="text-sm font-semibold text-stone-700 tabular-nums w-10 text-right">
                    {s.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Notable absence: Virginia ranks{" "}
            <span className="font-semibold">11th</span> at just 35 reports —
            despite hosting more data centers than any jurisdiction in the world.
            Likely a desensitization effect after a decade of buildout.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContributorsView() {
  const totalContribs = CONTRIBUTORS.reduce((s, c) => s + (c.contributions || 0), 0);
  const aiCount = CONTRIBUTORS.filter((c) => c.type === "ai-agent").length;
  const humanCount = CONTRIBUTORS.filter((c) => c.type === "human").length;
  const collectiveCount = CONTRIBUTORS.filter((c) => c.type === "human-collective")
    .length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-300 bg-gradient-to-br from-stone-50 to-emerald-50/30 p-5">
        <div className="flex items-start gap-4">
          <Sparkles className="h-7 w-7 text-emerald-700 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Distributed human + AI peer review
            </h2>
            <p className="text-stone-700 leading-relaxed mt-2">
              This artifact is a small demonstration of distributed intelligence.
              Humans, communities, and AI agents all contribute — and all get
              named credit. AI agent contributions are flagged and attributed to a
              human handler. Nothing here is immutable; every claim is open to
              peer fact-checking.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Contributors" value={CONTRIBUTORS.length} />
        <StatTile label="Human" value={humanCount} />
        <StatTile label="Collectives" value={collectiveCount} />
        <StatTile label="AI agents" value={aiCount} />
      </div>

      <div className="space-y-3">
        {CONTRIBUTORS.map((c) => (
          <ContributorCard key={c.id} contributor={c} />
        ))}
      </div>

      <p className="text-xs text-stone-500 leading-relaxed">
        Combined contribution volume across all contributors:{" "}
        <span className="font-semibold">{totalContribs.toLocaleString()}</span>{" "}
        (including the 1,713 community reports aggregated from the Brockovich
        initiative). Contribution counts are not a quality signal — a single
        well-sourced facility entry counts the same as a one-line typo fix.
      </p>
    </div>
  );
}

function ContributorCard({ contributor }) {
  const isAI = contributor.type === "ai-agent";
  const isCollective = contributor.type === "human-collective";
  const Icon = isAI ? Bot : isCollective ? Users : UserIcon;
  const tagCls = isAI
    ? "bg-indigo-100 text-indigo-900"
    : isCollective
    ? "bg-amber-100 text-amber-900"
    : "bg-emerald-100 text-emerald-900";
  const tagLabel = isAI ? "AI agent" : isCollective ? "Collective" : "Human";

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center">
            <Icon className="h-4 w-4 text-stone-700" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-base font-semibold text-stone-900">
                {contributor.name}
              </h3>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${tagCls} font-medium`}
              >
                {tagLabel}
              </span>
            </div>
            <span className="text-xs text-stone-500">
              joined {contributor.joined}
            </span>
          </div>
          <div className="text-xs text-stone-600 mt-0.5">{contributor.role}</div>
          {contributor.bio && (
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">
              {contributor.bio}
            </p>
          )}
          {isAI && contributor.handler && (
            <div className="mt-2 rounded-md border border-indigo-200 bg-indigo-50/40 p-2.5 text-xs text-stone-700 leading-relaxed">
              <span className="font-semibold">Handler:</span> {contributor.handler}
              {contributor.handlerNote ? (
                <span className="block text-stone-600 italic mt-1">
                  {contributor.handlerNote}
                </span>
              ) : null}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-stone-600 flex-wrap">
            <span>
              <span className="font-semibold tabular-nums">
                {contributor.contributions.toLocaleString()}
              </span>{" "}
              contribution{contributor.contributions === 1 ? "" : "s"}
            </span>
            {contributor.model && (
              <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">
                {contributor.model}
              </span>
            )}
            {contributor.url && (
              <a
                href={contributor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-stone-900 underline-offset-2 hover:underline"
              >
                profile <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodologyView() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Scoring approach
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm">
          Each company is scored 1–5 (5 = best) on four dimensions: Water, Energy,
          Pollution, and Transparency. Scores are calibrated against industry
          baselines as of {LAST_UPDATED}, not absolute targets — a 5 on Energy
          means "leading the field," not "carbon neutral." Tier assignment
          (Trending Right / Mixed / Trending Wrong) reflects the combined picture,
          not the simple average.
        </p>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {DIMENSIONS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.key}
                className="rounded-md border border-stone-200 bg-white p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-stone-700" />
                  <span className="font-semibold text-sm text-stone-900">{d.label}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{d.blurb}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Verification ladder
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm mb-3">
          Every facility is tagged with one of four verification levels. The ladder
          is meant to be honest about how much weight any given claim should carry.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(VERIFICATION_META).map(([key, meta]) => (
            <div
              key={key}
              className="rounded-md border border-stone-200 bg-white p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    meta.color === "emerald" ? "text-emerald-700" : "text-stone-600"
                  }`}
                />
                <span className="font-semibold text-sm text-stone-900">{meta.label}</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">{meta.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Automation pipeline
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm mb-3">
          Keeping this current at scale requires automation. The plan below is
          deliberately conservative: machines triage and draft; humans publish.
          Two-source rule applies to anything an LLM extracts. Status is{" "}
          <em>operational</em> if running today, <em>design</em> if specified but
          not yet wired up.
        </p>
        <div className="space-y-2">
          {AUTOMATION_PIPELINE.map((p) => (
            <div
              key={p.id}
              className="rounded-md border border-stone-200 bg-white p-3"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="font-semibold text-sm text-stone-900">{p.title}</div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium ${
                    p.status === "operational"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {p.status} · {p.cadence}
                </span>
              </div>
              <div className="text-xs text-stone-600 mt-1">{p.source}</div>
              <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">
                {p.method}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          What's NOT in the scores
        </h3>
        <ul className="text-sm text-stone-700 space-y-1.5">
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>Indirect water use from electricity generation.</strong> Most
              "data center water" headlines combine direct cooling and indirect
              thermoelectric water. We focus on direct here because indirect is
              grid-attributable, not company-attributable.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>Carbon offsets and unbundled RECs.</strong> Treated as
              non-additive unless paired with new generation that wouldn't have
              existed otherwise.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>International facilities.</strong> US-focused for now. Adding
              international entries would require different regulatory context.
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Editorial stance
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm">
          This artifact is "earned optimism" applied to the AI buildout. AI as a
          disruptive but net-positive force, when systems and incentives are
          aligned correctly. The buildout tracked here is exactly the kind of
          system that may or may not be aligned correctly, and the scoring reflects
          that. A "Trending Wrong" tier is not a moral verdict on AI; it's a
          statement about specific operating choices made by specific companies in
          specific localities. Equally, the "Trending Right" tier is praise for
          measurable, verifiable practice — not a corporate-image endorsement.
        </p>
      </section>
    </div>
  );
}

function ContributeView() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-300 bg-gradient-to-br from-stone-50 to-emerald-50/30 p-5">
        <div className="flex items-start gap-4">
          <GitBranch className="h-7 w-7 text-emerald-700 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Open, mutable, peer-reviewed
            </h2>
            <p className="text-stone-700 leading-relaxed mt-2">
              Anyone can add, dispute, or correct an entry. AI agents are welcome
              alongside humans — every edit is named, traceable, and subject to
              fact-check. The threshold isn't credentials; it's evidence.
            </p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Adding a facility entry
        </h3>
        <ol className="text-sm text-stone-700 space-y-2 list-decimal list-inside">
          <li>
            Append a new object to the <code className="text-xs bg-stone-100 px-1 rounded">FACILITIES</code> array. Use a stable <code className="text-xs bg-stone-100 px-1 rounded">id</code> like
            <code className="text-xs bg-stone-100 px-1 rounded">fac-OWNER-LOCATION</code>.
          </li>
          <li>
            Set <code className="text-xs bg-stone-100 px-1 rounded">verificationLevel</code> conservatively. Default to{" "}
            <em>announced</em> if all you have is a press release.
          </li>
          <li>
            Fill <code className="text-xs bg-stone-100 px-1 rounded">references</code> with reference IDs that exist on the parent company entry. Add new ones if needed.
          </li>
          <li>
            List anything you don't know in <code className="text-xs bg-stone-100 px-1 rounded">gaps</code>. Be honest. Empty gaps are a red flag.
          </li>
          <li>
            Add your <code className="text-xs bg-stone-100 px-1 rounded">contributors</code> ID. If you're new, add yourself to <code className="text-xs bg-stone-100 px-1 rounded">CONTRIBUTORS</code> first.
          </li>
          <li>
            Set <code className="text-xs bg-stone-100 px-1 rounded">lastVerified</code> to today's date in ISO format.
          </li>
        </ol>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Disputing a claim
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm mb-3">
          If a published claim looks wrong, add it to the facility's{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">disputes</code> array
          rather than overwriting the original. The claim/counter-claim pair stays
          visible until the evidence converges. Status values:
        </p>
        <ul className="text-sm text-stone-700 space-y-1.5">
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>open</strong> — both sides have evidence; no consensus
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>evidence favors X</strong> — one side has clearly stronger
              public-record support
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-stone-400 mt-1.5">▸</span>
            <span>
              <strong>resolved</strong> — superseded by a new permit, court ruling,
              or independent verification. The old claim/counter-claim stays in the
              record.
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          AI agent contributions
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm">
          AI agents are first-class contributors and are listed publicly. Every
          agent must have a named human handler. Drafting, summarization, and
          structured extraction are appropriate uses. Publishing without human
          peer review is not. The two-source rule is non-negotiable: an agent
          cannot publish a factual claim without either two independent sources or
          one primary public record cited inline.
        </p>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          Tone — what we keep, what we drop
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
            <div className="flex items-center gap-1.5 text-emerald-800 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Keep
              </span>
            </div>
            <ul className="text-sm text-stone-700 space-y-1">
              <li>• Specific numbers with source links</li>
              <li>• Praise for measurable, verifiable practice</li>
              <li>• Named gaps and disputes</li>
              <li>• Material wins from "Trending Wrong" entries</li>
            </ul>
          </div>
          <div className="rounded-md border border-rose-200 bg-rose-50/40 p-3">
            <div className="flex items-center gap-1.5 text-rose-800 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-wide font-semibold">
                Drop
              </span>
            </div>
            <ul className="text-sm text-stone-700 space-y-1">
              <li>• Doom narratives without numbers</li>
              <li>• Marketing language treated as fact</li>
              <li>• Anonymous claims without provenance</li>
              <li>• "AI is bad / good" framings — this is operator-specific</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
          File layout
        </h3>
        <p className="text-stone-700 leading-relaxed text-sm">
          The data lives at the top of this file (
          <code className="text-xs bg-stone-100 px-1 rounded">CONTRIBUTORS</code>,{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">COMPANIES</code>,{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">FACILITIES</code>,{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">CONCERNS</code>,{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">COMMUNITY_STATS</code>,{" "}
          and{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">AUTOMATION_PIPELINE</code>
          ). The UI re-renders automatically. To retire an entry, set status to{" "}
          <code className="text-xs bg-stone-100 px-1 rounded">cancelled</code>{" "}
          rather than deleting — the record is part of the public history.
        </p>
      </section>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================

const TABS = [
  { id: "scoreboard", label: "Scoreboard" },
  { id: "facilities", label: "Facilities" },
  { id: "concerns", label: "Concerns" },
  { id: "community", label: "Community Voice" },
  { id: "contributors", label: "Contributors" },
  { id: "methodology", label: "Methodology" },
  { id: "contribute", label: "Contribute" },
];

export default function DataCenterWatch() {
  const [tab, setTab] = useState("scoreboard");

  const counts = useMemo(() => {
    const c = { leading: 0, mixed: 0, lagging: 0 };
    for (const co of COMPANIES) c[co.tier]++;
    return c;
  }, []);

  const facilityCounts = useMemo(() => {
    const c = {
      operating: 0,
      "under-construction": 0,
      announced: 0,
      contested: 0,
      permitted: 0,
    };
    for (const f of FACILITIES) {
      if (c[f.status] !== undefined) c[f.status]++;
    }
    return c;
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-stone-600 text-xs uppercase tracking-wider mb-3">
            <Leaf className="h-4 w-4" />
            <span>Anthology Research / Data Center Buildout · v{VERSION}</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-stone-900 leading-tight tracking-tight">
            The Data Center Buildout Watch
          </h1>
          <p className="mt-3 text-lg text-stone-700 leading-relaxed max-w-3xl">
            A peer-reviewable scoreboard of the major U.S. AI infrastructure
            operators — scored on water, energy, pollution, and transparency —
            with site-level facility records, named contributors, and the community
            signal that the official disclosures keep missing.
          </p>
          <div className="mt-5 flex items-center flex-wrap gap-x-5 gap-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Last updated {LAST_UPDATED}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                {counts.leading} trending right
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-700" />
                {counts.mixed} mixed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-800" />
                {counts.lagging} trending wrong
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>
                {FACILITIES.length} facilities · {facilityCounts.operating} operating ·{" "}
                {facilityCounts["under-construction"]} under construction ·{" "}
                {facilityCounts.announced} announced ·{" "}
                {facilityCounts.contested} contested
              </span>
            </div>
            <a
              href="https://brockovichdatacenter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-900 underline-offset-2 hover:underline ml-auto"
            >
              Brockovich community map
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        <nav className="border-b border-stone-300 mb-8 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition whitespace-nowrap ${
                tab === t.id
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-600 hover:text-stone-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main>
          {tab === "scoreboard" && <ScoreboardView />}
          {tab === "facilities" && <FacilitiesView />}
          {tab === "concerns" && <ConcernsView />}
          {tab === "community" && <CommunityView />}
          {tab === "contributors" && <ContributorsView />}
          {tab === "methodology" && <MethodologyView />}
          {tab === "contribute" && <ContributeView />}
        </main>

        <footer className="mt-16 pt-6 border-t border-stone-300 text-xs text-stone-500 leading-relaxed">
          <p>
            Compiled from public reporting, environmental disclosures, litigation
            filings, and community submissions. Living document — updates appended
            as new information becomes available. See the{" "}
            <button
              type="button"
              onClick={() => setTab("contributors")}
              className="underline underline-offset-2 hover:text-stone-700"
            >
              Contributors
            </button>{" "}
            tab for named credit (humans, collectives, and AI agents).
          </p>
          <p className="mt-2">
            For the original source list and methodology, see the Methodology tab.
            For community-submitted reports across the U.S., visit Erin Brockovich's{" "}
            <a
              href="https://brockovichdatacenter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-stone-700"
            >
              live map
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
