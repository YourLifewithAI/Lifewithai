# Google Analytics setup

## Current status

The user selected **bencorprondds@gmail.com** as the owner and explicitly approved
acceptance of Google's US Terms of Service and Data Processing Terms. The account
and the **Life with AI website** stream were created on September 15, 2026.

- Measurement ID: `G-0FEVY5TS8J`
- Web stream ID: `15784411245`
- Analytics account ID: `408290049`
- GA4 property ID: `554473737`
- [Open the property](https://analytics.google.com/analytics/web/#/a408290049p554473737/reports/intelligenthome)

## Property configuration

- Account: **Life with AI**; property: **Life with AI — lifewithai.ai**.
- Website: `https://lifewithai.ai`.
- Reporting time zone: **America/Chicago**; currency: **USD**.
- Use standard, free Google Analytics 4.
- Enhanced measurement: pageviews (including browser history changes), scrolls,
  outbound clicks, downloads, and video engagement. Disable form interactions
  and site-search measurement; do not collect form contents as custom events.
- Keep Google Signals, advertising personalization, and optional product data
  sharing disabled.
- Keep email data redaction enabled.
- Mark `substack_click` as a key event if the goal is measuring visits to Substack.
  This event measures a click, not a confirmed subscription.

The public `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in `netlify.toml` under the
production context. It is a public identifier and must never be confused with
a secret API credential. Rebuild after changing the ID.

## Site behavior

The Google tag only loads after explicit acceptance and only on `lifewithai.ai`
or `www.lifewithai.ai`. Development and deploy-preview hosts do not send data.
The existing Plausible tag is preserved. Google Analytics uses its own choice.

Choices expire after 180 days. Footer controls and `/privacy` reopen preferences.
Declining disables Google Analytics, clears its cookies without touching login
cookies, and reloads if the tag was already running. Other tabs respond to a
changed stored choice. Storage failures never implicitly grant consent.

Enhanced measurement owns pageviews; the application does not manually emit
page_view events. This avoids double-counting Next.js navigation. The custom
`substack_click` event includes the destination without query/hash data and the
source pathname. It never includes an email address, link text, or form field.

## Validation and activation checklist

- `npx tsx --test src/lib/google-analytics.test.ts`: five tests pass.
- `npx tsc --noEmit`: passes.
- `npx next build`: passes (the build command used by Netlify after prebuild).
- Local browser check: preferences open and the consent banner fits the page.
- `npm run build` currently stops in the existing content validator, which reports
  173 content errors and seven broken cross-references. No knowledge content is
  changed by this integration.
- After the actual ID is configured: build, publish once, verify the tag and
  consent choices on production, then confirm incoming events in GA Realtime.
- Check one pageview per Next.js navigation and verify `substack_click`.
- Google Analytics starts collecting after activation; it does not import the
  earlier Netlify request history.
