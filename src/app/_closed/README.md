# Closed features

Folders whose names start with an underscore are private in the Next.js App Router: nothing in them is served.

- `api-chat/route.ts` was `/api/chat`. It sent visitors' messages to Claude using the site's own API key, with no
  sign-in and no rate limit. Closed 2026-11-08 on Ben's word.
- `arcology-chat/page.tsx` was `/arcology/chat`, the only page that called it. `src/components/ArcologyChat.tsx` is
  left in place, unused.

To bring the chat back, move each file to its old path. Add sign-in or a rate limit and a spending cap first.
