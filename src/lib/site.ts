// Site-wide words. Pages read them from here, so a change lands everywhere at once.

export const SITE = {
  name: 'Life with AI',
  url: 'https://lifewithai.ai',
  line: 'Beyond the chatbot.',
  tagline: 'Bringing AI to life.',
  // The settled line (Ben's own words).
  sub: 'Life with AI: beyond the chatbot. Exploring AI off screen, putting it on the ranch, in the workshop, in the kitchen, behind the counter and in the waiting room.',
  description:
    'Exploring AI off screen: on the ranch, in the workshop, in the kitchen, behind the counter and in the waiting room.',
  host: 'Ben, host of Life with AI',
  contact: 'hello@lifewithai.ai',
  invite: 'Do this kind of work? Tell us.',
} as const;

// Every build shows one of these stages.
export const STAGES = [
  { id: 'prototype', label: 'Prototype', means: 'It works on the bench or in a first trial.' },
  { id: 'in-use', label: 'In use', means: 'It is doing its job in the real place.' },
  { id: 'proven', label: 'Proven', means: 'More than one season of use, or more than a year.' },
] as const;

export type StageId = (typeof STAGES)[number]['id'];

export const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)?.label ?? id;

// Life with AI elsewhere: the same six links as the old site's footer (fixed 2026-11-08, Ben's yes).
// Bluesky, Mastodon and Substack sit under the pen-name handle but are the Life with AI accounts.
export const SOCIAL: readonly { label: string; href: string; me?: boolean }[] = [
  { label: 'GitHub', href: 'https://github.com/YourLifewithAI' },
  { label: 'Reddit', href: 'https://reddit.com/r/lifewithai' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/sbcorvus.bsky.social' },
  { label: 'Mastodon', href: 'https://mastodon.social/@sbcorvus', me: true },
  { label: 'X', href: 'https://x.com/lifewithai2027' },
  { label: 'Substack', href: 'https://sbcorvus.substack.com' },
];
