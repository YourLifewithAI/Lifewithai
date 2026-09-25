# Owen’s Forks — illustrated story page

Prepared and approved by the author for publication on 25 September 2026. This release includes the complete illustrated story and its homepage navigation.

The complete story is at `/stories/owens-forks`. It is linked from a Floor 245 marker below Floor 318 on the main overview illustration, a second illustrated invitation on both `/` and `/arcology`, and featured in `/stories`. The Floor 245 marker identifies Aaron’s neighborhood and opens the full story.

## Manuscript

`content/stories/owens-forks.md` contains the supplied Word manuscript, with HTML paragraph/heading markup to preserve its inline italics and explicit dialogue line breaks. Narrative wording, punctuation, Vietnamese diacritics, dates, and section order remain unchanged. Tab indentation is expanded to spaces. The title is supplied through frontmatter and rendered once as the page H1.

The frontmatter publication date is 25 September 2026. The story’s own 2041 and 2043 dates are retained. No new floor numbers or resident addresses were invented.

The original DOCX and all four original PNGs are archived outside the website checkout in `../reference/owens-forks/`. The one-time import script, source paragraph data and SHA-256 record are in the parent workspace’s `outputs/owens-forks/` directory. Do not rerun the import over later author edits without reconciling them.

## Artwork placement

| Supplied artwork | Web asset | Placement |
| --- | --- | --- |
| Lanternlit Arcology in a Lush Night Valley | `lantern-city.webp` | Cover, homepage invitation, story library and social preview |
| Hospital Room Portal to Cozy Reflection | `hospital-mirror.webp` | After the paragraph where the little office becomes a cozy den |
| Sunlit Arcology Ball Toss Circle | `ball-toss.webp` | After Aaron catches the ball while holding his sketchbook |
| Lanterns Above the Mural Maze | `mural-maze.webp` | After the final paragraph |

Web assets are in `public/images/arcology/owens-forks/`. All four are converted to WebP at their original dimensions, without cropping or repainting; together they are approximately 945 KiB. In-story image positions use explicit `<!-- illustration: … -->` markers and the server component `OwensForksReader.tsx`. The hospital alt text avoids naming the reflection before his name appears in the prose.

## Verification

- Source comparison: all 236 body paragraphs/headings match, with only tab indentation expanded; all 20 italic runs and 9 explicit line breaks retained. Both scene dividers retained.
- Independent manuscript/layout review completed.
- All 12 existing Arcology, Living Loop and Google Analytics tests pass.
- TypeScript check passes; content index generation and the production Next.js build pass (114 static pages).
- The separate research knowledge validator has known pre-existing failures; it was not rerun or changed for this story.
- Browser checks at 1280px and 390px: readable layout, no horizontal overflow, all four images load, and manuscript paragraph/italic/line-break counts are preserved in the DOM.
- Homepage “Read Owen’s Forks” opens the story; “Begin reading” includes the opening date.

For local review, use `next start --hostname 127.0.0.1 --port 4181` after building. A development-mode Tailwind resolution error occurred in this workspace; the verified production build serves the preview successfully. Netlify publication was held until the author's explicit approval.
