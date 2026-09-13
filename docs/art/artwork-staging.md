# Approved website artwork — staging and release record

## Current publication authorization

On 13 September 2026, after completion of the company directory, the author explicitly requested: “Once you've finished, go ahead and push/commit/publish.” This lifts the earlier hold for the completed artwork, Living Loop and company evidence batch. Earlier staging notes below record the hold as it stood at the time; this authorization supersedes them. Publication is being verified as one batched release.

Release checks: all seven Arcology/Living Loop tests and TypeScript pass. A complete production `next build` now passes, including all 112 static pages, with normal worker processes. `npm run build` still stops at the existing knowledge validator (173 errors, 177 warnings); no validator was relaxed. Netlify's configured `npm run prebuild && next build` application path passes locally. The refreshed validation reports retain the unresolved research findings.

## Approved artwork

| Entrance | Lossless master | Local website asset |
| --- | --- | --- |
| Before Water | [mel-atrium-simplified-v2.png](reference/mel-atrium-simplified-v2.png) | `public/images/arcology/318-garden-storybook.webp` |
| After Water | [after-water-storybook-v3.png](reference/after-water-storybook-v3.png) | `public/images/arcology/318-after-water-storybook.webp` |
| Main landing page and Arcology overview | [arcology-overview-storybook-v3.png](reference/arcology-overview-storybook-v3.png) | `public/images/arcology/overview-storybook.webp` |

All three masters are 1536 × 1024. The WebP derivatives retain that framing and resolution, using quality 90, effort 6: 463,136 bytes for entry, 419,968 bytes for exit, and 544,634 bytes for the overview. The lossless masters are unchanged. Existing older asset URLs are retained for compatibility, but current local pages use the new filenames to avoid old image caches.

The approved exit has Mel's calm, straight-line mouth, a clean mural column, paintbrushes, physically bounded broken glass, the corrected right window frame, and matching gripper tails on the visible emergency robots. Most greenery is gone; two seedlings remain in the old marigold bed. Preserve this approved version when making future changes.

## Integration

- Both Mel and Pell's introductory routes use the approved entry illustration.
- Both after-story routes use the approved exit illustration.
- The story listing, Water sharing image, resident sharing images, and Floor 318 invitation use the introductory illustration. After-story metadata continues to use the introductory artwork to avoid exposing the exit scene in previews.
- Exit markers are now Mel at 81% / 66%, Pell at 65% / 71%, and the water system at 16% / 32%. Introductory markers remain aligned with Mel, the column speaker, and fish tanks.
- Accessible image descriptions and after-story detail text now describe the damaged atrium, Pell's temporary lobster embodiment, and the beginning of recovery.
- The main `/` landing page and `/arcology` overview now use the approved exterior hero and sharing image. Its accessible description identifies the flat park, three visible three-tier extensions, and left-side river.
- The hero uses its approved colors without a blending filter and retains its full composition on smaller screens. Existing Floor 318 and Tessera links remain available; future destinations will be mapped onto this approved hero as their content is developed.

## Validation

The four existing Arcology checks pass, including spoiler separation, resident navigation, and both published story installments and interactive experiences. TypeScript checking passes. The local entry and exit routes render the new artwork, and the exit Pell marker correctly selects its updated detail panel and after-story resident link. The original sources and WebP dimensions are checked. No production build or remote operation is part of this staging work.

After the hero integration, the same four checks and TypeScript checking pass again. The main homepage locally renders the approved overview with the existing Floor 318 and Tessera navigation. The hero master is verified byte-for-byte against the approved original, and its WebP preserves 1536 × 1024 dimensions. The sharing-image references on both overview routes use the new asset.

Local preview routes:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/arcology`
- `http://127.0.0.1:3000/arcology/floors/318/mel`
- `http://127.0.0.1:3000/arcology/floors/318/mel/after-water`

Keep this hold in place until the author explicitly requests publication. Follow the usual release checks at that time.

## Living Loop and story-ending update — 13 September 2026

Locally rebuilt `/stories/water/experience` with a new Storybook farm cutaway, six exploration points, three exchange routes, people/AI notes, a nutrient-transfer isolation demonstration, a floor-layout comparison and twelve scoped research/company references. The new illustration is a design draft for review, not an additional approved master or confirmed floor plan.

- Master: `docs/art/reference/living-loop-storybook-v1.png` (1536 × 1024).
- Website derivative: `public/images/arcology/living-loop-storybook.webp` (quality 90; 485,946 bytes).
- Exact built-in image-generation prompt: `docs/art/living-loop-illustration-prompt.txt`. Style reference: the approved introductory Mel master.
- Research and claim audit: `docs/living-loop-research.md`. Structured source and transfer content: `content/experiences/water.json`.
- The full Water reader now displays the existing approved recovery image after the final story paragraph, followed by the exploration invitation. Its source is byte-for-byte identical to the author's uploaded `Mel and Pel post-flood.png` (SHA256 `36fb3418ab961cea00bb1396ec471599e38d5985b9172922956b681aebd4ee18`). Sharing images remain spoiler-safe.
- The Tessera hotspot subtitle and garden invitation have the exact author-requested wording.

Validation: TypeScript passes; all seven Arcology/Living Loop checks pass. Desktop and 390 px phone previews render the illustration; phone content has no horizontal overflow. Tested room selection, expanded care notes, all three exchanges, paused/resumed nutrient transfer and adjacent-deck layout. The full story's recovery image loads and links to the after-story atrium. Browser viewport override was reset after testing. Publication hold remains in place; no push, production deployment or Netlify build was triggered.

Additional local previews:

- `http://127.0.0.1:3000/stories/water/experience`
- `http://127.0.0.1:3000/stories/water#after-water`

### Living Loop revision 2

The current local experience uses `public/images/arcology/living-loop-storybook-v2.webp` (1536 × 1024, quality 90, effort 6, 480,826 bytes). Its lossless master is `docs/art/reference/living-loop-storybook-v2.png`; the exact built-in image-generation edit prompt is `docs/art/living-loop-illustration-v2-prompt.txt`. Version 1 remains as history. The author approved this revision (“Perfect”) on 13 September 2026. It is the approved Living Loop illustration and does not change the standing style authority or publication hold.

Applied all five requested edits: no door leaves, a dirt-hauling quad with a large square back bucket being loaded by the worker, ceiling-mounted arms loading the mushroom quad, one floating monitor in each tank, and one produce-monitoring drone. The crop-monitoring review supplied by the author and Corvus Drones' official site are linked in the plant notes. The depicted robot mechanisms are identified as proposals. Updated descriptions and moved markers to keep the new activities visible. All seven existing checks pass. No publication or Netlify build occurred.

### Company evidence catalogue — 13 September 2026

Added ten company examples across all six farm rooms, with technology labels, deployment status, direct evidence links and limits on applicability. The new directory and per-room links share one structured source catalogue. Research sources remain separate. The accompanying `docs/living-loop-company-examples.md` is also available in the user’s `outputs/living-loop/` folder. No publication or Netlify build is authorized by this work.

Validation: TypeScript and all seven existing checks pass, with source integrity checks extended to require company coverage, deployment notes and evidence links for every room. Desktop and 390 px phone previews render all ten examples across six groups without horizontal overflow. Expanded commercial-trial and prototype notes show their evidence links; the water workshop links to Gradiant and Ostara. The revised illustration markers leave the workers and robot activities visible. The temporary phone viewport was reset. Changes are staged locally only.
