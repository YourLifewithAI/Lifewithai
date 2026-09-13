---
name: steward
description: How Claude watches pull requests in this repo. Read before acting on CI or review events on a PR you opened or were asked to drive.
---

# PR stewardship rules for Lifewithai

These rules take precedence over the default PR-watching posture on **how proactive to
be** and on **cadence**. They do not relax any "never" rule, and they never authorize
approving or merging.

## 1. No idle polling. Events are the wake signal.

**Default: do not schedule a recurring check-in on a pull request.** The webhook
subscription already wakes the session when something actually happens. A timed
check-in that finds no change costs roughly 15–20k tokens and produces nothing.

Scheduling a check-in is allowed in exactly one case:

- The PR head is **red or conflicted** and you are actively driving it to green, and
  the thing you are waiting on is external state a webhook will not report (a CI run
  that may die silently, a deploy that may hang).

In that case: **one** check-in, sized to how long the thing you are waiting on
actually takes. Not an hourly heartbeat.

## 2. When a PR is green, stop.

A PR whose head is green, mergeable, and has no open review threads is **done from
Claude's side**. Say so once, then stop. Do not schedule anything. Do not re-check.
Waiting for a human to review or merge is not work, and it is not something to poll.

## 3. Never re-arm after a no-change check-in.

If a check-in fires and finds nothing changed, that is evidence the cadence was wrong.
Do not schedule another one. Report nothing and end the turn.

Two consecutive "no change" reports to the user should never happen.

## 4. Netlify deploy-preview comments are noise.

`netlify[bot]` edits one comment in place several times per push (processing → ready)
and posts a `check_suite.completed` alongside it. These need no reply, no action, and
no status message to the user beyond the first "preview is ready" with the link.

## 5. Red CI and merge conflicts are still work.

None of the above changes the drive-to-green posture. If CI is red or the branch
conflicts on a PR opened here, fix it and push, or say once exactly what is blocking.
The point of these rules is to stop burning budget confirming that nothing happened,
not to stop doing the work when something did.

## 6. Build command

`npm run build` fails on this repo because `npm run validate` reports pre-existing
errors in the knowledge entries. Netlify runs `npm run prebuild && next build`
(see `netlify.toml`). Use that to verify a build, and do not "fix" the validator's
findings as a side effect of an unrelated PR.
