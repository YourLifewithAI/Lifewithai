// Site-wide words. They live in words/site.md; pages read them from here, so a change lands everywhere at once.
// Server only (it reads the words files): client components get their words as props.
import { slot, words } from './words';

const w = () => words('site');

// Read on every use, so an edit to words/site.md shows on the next refresh in the preview.
export const SITE = {
  url: 'https://lifewithai.ai',
  get name() {
    return slot(w(), 'Name');
  },
  get line() {
    return slot(w(), 'Line');
  },
  get tagline() {
    return slot(w(), 'Tagline');
  },
  // The settled line (Ben's own words).
  get sub() {
    return slot(w(), 'Settled sentence');
  },
  get description() {
    return slot(w(), 'Description');
  },
  get host() {
    return slot(w(), 'Host');
  },
  get contact() {
    return slot(w(), 'Contact address');
  },
  get invite() {
    return slot(w(), 'Invite');
  },
};

// Every build shows one of these stages. The ids are fixed; their labels and meanings are in words/site.md.
export const STAGE_IDS = ['prototype', 'in-use', 'proven'] as const;

export type StageId = (typeof STAGE_IDS)[number];

export const stageLabel = (id: StageId) => slot(w(), `Stage: ${id}`);

export const stages = () =>
  STAGE_IDS.map((id) => ({ id, label: stageLabel(id), means: slot(w(), `Stage: ${id}, what it means`) }));

// Life with AI elsewhere: the same six links as the old site's footer (fixed 2026-11-08, Ben's yes).
// Bluesky, Mastodon and Substack sit under the pen-name handle but are the Life with AI accounts.
// Kept here, not in words/: they are the services' own names and addresses.
export const SOCIAL: readonly { label: string; href: string; me?: boolean }[] = [
  { label: 'GitHub', href: 'https://github.com/YourLifewithAI' },
  { label: 'Reddit', href: 'https://reddit.com/r/lifewithai' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/sbcorvus.bsky.social' },
  { label: 'Mastodon', href: 'https://mastodon.social/@sbcorvus', me: true },
  { label: 'X', href: 'https://x.com/lifewithai2027' },
  { label: 'Substack', href: 'https://sbcorvus.substack.com' },
];
