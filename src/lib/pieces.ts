// What is on the site today.
// An interview fills in its topic on the strip. A bench build (Ben's own) does not: the topics stay open
// plots until real interviews come in (Ben, 2026-11-15).
// Each piece's words (its kind, title, who, hook and main parts) are in words/pieces/<id>.md. Server only.
import type { StageId } from './site';
import type { TopicId } from './topics';
import { topicById } from './topic-words';
import { list, maybe, slot, words } from './words';

export interface Piece {
  id: string;
  kind: 'interview' | 'bench';
  href: string;
  topic: TopicId;
  /** the topic as this piece's card names it: its own words if it has them ("DIY Robotics" for Asher, Ben,
   *  2026-11-15), else the topic's name. The piece still sits under its topic. */
  topicLabel: string;
  form: string; // what kind of piece it is
  title: string;
  who: string;
  hook: string;
  receipt: string[]; // a few plain facts, shown as chips
  stage: StageId;
}

type PieceData = Pick<Piece, 'id' | 'kind' | 'href' | 'topic' | 'stage'>;

const DATA: PieceData[] = [{ id: 'asher', kind: 'bench', href: '/projects/asher', topic: 'making', stage: 'prototype' }];

function withWords(d: PieceData): Piece {
  const w = words(`pieces/${d.id}`);
  return {
    ...d,
    topicLabel: maybe(w, 'Topic on the card') || (topicById(d.topic)?.verb ?? ''),
    form: slot(w, 'Kind of piece'),
    title: slot(w, 'Title'),
    who: slot(w, 'Who'),
    hook: slot(w, 'Hook'),
    receipt: list(w, 'Main parts'),
  };
}

/** Every piece, in order, with its words. */
export const pieces = (): Piece[] => DATA.map(withWords);

export const pieceById = (id: string): Piece | undefined => pieces().find((p) => p.id === id);

// The innovator spotlight: the first thing a reader sees. Asher holds it until the first guest's interview.
export const SPOTLIGHT_ID = 'asher';
export const spotlight = (): Piece => pieceById(SPOTLIGHT_ID) ?? pieces()[0];

export const interviewsFor = (topic: TopicId) => pieces().filter((p) => p.kind === 'interview' && p.topic === topic);
export const benchFor = (topic: TopicId) => pieces().filter((p) => p.kind === 'bench' && p.topic === topic);
