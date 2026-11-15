// What is on the site today.
// An interview fills in its topic on the strip. A bench build (Ben's own) does not: the topics stay open
// plots until real interviews come in (Ben, 2026-11-15).
import type { StageId } from './site';
import type { TopicId } from './topics';

export interface Piece {
  id: string;
  kind: 'interview' | 'bench';
  href: string;
  topic: TopicId;
  form: string; // what kind of piece it is
  title: string;
  who: string;
  hook: string;
  receipt: string[]; // a few plain facts, shown as chips
  stage: StageId;
}

export const PIECES: Piece[] = [
  {
    id: 'asher',
    kind: 'bench',
    href: '/projects/asher',
    topic: 'making',
    form: 'Bench build',
    title: 'Asher',
    who: 'Ben, host of Life with AI, on his own bench.',
    hook: 'A small robot car that Claude drives, hears and speaks through.',
    receipt: ['A hobby car kit', 'A small Linux computer', 'Two batteries'],
    stage: 'prototype',
  },
];

// The innovator spotlight: the first thing a reader sees. Asher holds it until the first guest's interview.
export const SPOTLIGHT_ID = 'asher';
export const spotlight = (): Piece => PIECES.find((p) => p.id === SPOTLIGHT_ID) ?? PIECES[0];

export const interviewsFor = (topic: TopicId) => PIECES.filter((p) => p.kind === 'interview' && p.topic === topic);
export const benchFor = (topic: TopicId) => PIECES.filter((p) => p.kind === 'bench' && p.topic === topic);
