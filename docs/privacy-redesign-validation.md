# Privacy page redesign — September 17, 2026

Status: approved for publication by the author on September 17, 2026: “Love the data privacy page, especially the little blue robot reading a book. Very cute. Please go ahead and post that to the website.” This record accompanies the release; deployment confirmation is recorded separately after the build finishes.

The website checkout was fast-forwarded from the already-published September 13 artwork release to the already-published Analytics setup/documentation commit `fbdffca`, using the other local checkout as the source. No remote history was rewritten.

## Changes

- `/privacy` now uses the homepage's reader header/footer, sage paper, green ink, literary display type and the proposed robot garden background.
- Added a clear top-level Analytics preferences button and links to the four policy sections.
- Copy describes optional Google Analytics, browser-specific 180-day choice, withdrawal/reload, existing collected data, report categories, advertising/Signals settings, other services and Substack-click scope.
- The preference lifetime is explicitly distinguished from data retention. Google Analytics implementation and account settings were not changed.
- [Artwork prompt and provenance](art/privacy-background-proposal.md); the lossless master is retained and the public WebP uses a versioned name.

## Verification

- TypeScript `tsc --noEmit`: pass.
- Existing Google Analytics + Arcology + Living Loop checks: 12 pass.
- Local `next build`: pass; 113 pages generated, including `/privacy`.
- Browser: reader navigation and artwork render; preferences opens; decline dismisses it; no Google tag on localhost. At 390px viewport, no horizontal overflow and the buttons/content fit. Desktop and narrow-screen screenshots inspected; viewport reset afterward.
- `git diff --check`: pass (Windows line-ending advisory only).

The full npm build's separate research metadata validator previously reported 173 pre-existing content errors. This change edits no knowledge entries; validation here uses the application build. No claim is made that the unrelated metadata backlog was repaired.

Local preview: http://127.0.0.1:4181/privacy. The development server must be running to view it; it is not the deployed website.
