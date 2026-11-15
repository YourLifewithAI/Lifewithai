// A build's project page: the shape of its data. Every word a reader sees on a project page lives in that project's
// words file (words/projects/<id>.md), including headings, labels, captions and the drawing's own words, and is read
// into this shape by the project's data file (src/content/<id>.ts); the code keeps only ids, dates of state, unit
// symbols and number formatting. Ported from the studio's round 4 template.
import type { StageId } from './site';
import type { TopicId } from './topics';
import type { WordsTable } from './words';

// Text in the data is plain text. A quote is written {{Who: words}} and renders as <q data-by="Who">, so quotes can be
// counted: only the builder's own words and the project's own lines are quoted.
export type Words = string;

// A template: {name} is filled in by the page, e.g. 'Built by {builder} with Claude'.
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export interface Override {
  path: string; // 'parts.<id>.<field>', or 'a.b[key=value].field'
  value: unknown;
  why: string;
}

// "What runs where": which machine does each job, in plain words. Its parts are Markdown (a list, a link, **bold**),
// except the tables, which are plain words in cells.
export interface WhatRunsWhere {
  intro: Words;
  glance: WordsTable; // the table at a glance: one row per job
  sections: { heading: string; body: Words }[]; // On the Pi, On the ESP32, ... From the laptop
  gpuHeading: string;
  gpu: WordsTable; // how much needs a graphics card
  inShort: Words;
}

export interface WiringNode {
  id: string;
  label: string;
  group?: 'box';
}

// Every heading, label and caption on a project page, flat. {name} marks a value the page fills in.
export interface ProjectWords {
  // the title sheet
  jumpsLabel: string;
  jumpCanDo: string;
  jumpJournal: string;
  jumpReceipt: string;
  jumpCore: string;
  stage: string;
  stageLadder: string;
  stageThisBuild: string;
  topic: string;
  updated: string;
  credit: string;
  builtBy: string;
  status: string;
  // the drawing sheet
  drawnFrom: string;
  scale: string;
  noScript: string;
  howToTitle: string;
  colourComputer: string;
  colourBoards: string;
  colourSensors: string;
  colourPower: string;
  colourDrive: string;
  colourPlates: string;
  colourPillars: string;
  // the drawing itself (the engine)
  modelHeading: string;
  modelLabel: string;
  modelKey: string;
  labelsButton: string;
  explode: string;
  dragHint: string;
  selectedPart: string;
  selectedHint: string;
  partsOnRobot: string;
  partsCount: string;
  sheetName: string;
  viewWords: string;
  viewIso: string;
  viewTurned: string;
  scaleWords: string;
  sheetLine: string;
  axisFront: string;
  axisLeft: string;
  axisUp: string;
  est: string;
  unknown: string;
  // the drawing's panels and labels (filled in when the page is built)
  asBuilt: string;
  nothingSelected: string;
  levels: string;
  wholeRobot: string;
  wholeRobotFrom: string;
  weight: string;
  weightFrom: string;
  size: string;
  mass: string;
  price: string;
  pricesChecked: string;
  onRobotNow: string;
  onRobotNowShort: string;
  fixedPart: string;
  fixedParts: string;
  chassisFloorUp: string;
  chassisLevel: string;
  plate: string;
  kitDeck: string;
  topAboveFloor: string;
  madeOf: string;
  notRecorded: string;
  ariaPart: string;
  ariaFixed: string;
  ariaPlate: string;
  priceUnknown: string;
  pricePartOf: string;
  priceHomeMade: string;
  priceInKit: string;
  // what runs where
  whatRunsWhere: string;
  // what it can do, the arc, the journal, the receipt
  canDo: string;
  milestoneNext: string;
  milestoneReached: string;
  journal: string;
  journalSub: string;
  changed: string;
  wrong: string;
  receipt: string;
  receiptSub: string;
  receiptCost: string;
  receiptTime: string;
  receiptAiPart: string;
  receiptBroke: string;
  receiptChecked: string;
  receiptGaps: string;
  // the core
  core: string;
  safetyTitle: string;
  safetyLine: string;
  licenceTitle: string;
  licenceCopy: string;
  energy: string;
  materials: string;
  parts: string;
  partsList: string;
  partsListSub: string;
  partsRole: string;
  partsPart: string;
  partsPrice: string;
  partsTotal: string;
  partsNote: string;
  partsUnknownOne: string;
  partsUnknownMany: string;
  measurements: string;
  measurementsSub: string;
  axleToAxle: string;
  axleFrom: string;
  wholeRobotAxes: string;
  levelsTitle: string;
  levelCol: string;
  levelSizeCol: string;
  levelTop: string;
  everySize: string;
  everySizeCount: string;
  sizeCol: string;
  valueCol: string;
  otherSizes: string;
  wired: string;
  wiredFrom: string;
  wiredTo: string;
  wiredHow: string;
}

export interface ProjectPage {
  id: string;
  name: string;
  builder: string;
  updated: string;
  topic: TopicId;
  stage: StageId;
  stageNote: Words;
  status: string;
  hook: Words;
  intro: Words[];
  footerNote: Words;
  words: ProjectWords;
  drawing: {
    title: string;
    sub: Words;
    pending: Words; // the line that stands where the software drawing will go
    drawnFrom: string;
    scale: string;
    howTo: Words[];
    partLabels: Record<string, string>; // the drawing's label for a part, by slot (or by part id for a fixed part)
    sourceWords: Record<string, string>; // how a size was got, counted in Measurements, by the model's source code
    measGroups: [string, string][]; // [heading, key pattern]; anything left over goes under words.otherSizes
    overrides: Override[];
  };
  whatRunsWhere: WhatRunsWhere | null; // null: the page leaves the section out
  canDo: { cols: [string, string, string]; note: Words; rows: { can: Words; last: string; lastNote?: Words; how: Words }[] };
  arc: {
    id: string;
    label: string;
    title: string;
    text: Words[];
    steps?: { label: string; state?: 'done' | 'next' | 'todo'; when?: string }[];
  }[];
  journal: { date: string; title: string; changed: Words[]; wrong: Words[] }[];
  receipt: Partial<Record<ReceiptKey, Words[]>>;
  core: {
    intro: Words;
    safety: { checks: Words[] };
    licence: { chosen: 'copy' | null; note: Words };
    energy: Words[];
    materials: Words[];
    partsLine: Words;
    wiring: { boxLabel: string; key: Words; nodes: WiringNode[]; links: { from: string; to: string; how: string }[] };
  };
}

export type ReceiptKey = 'cost' | 'time' | 'aiPart' | 'broke' | 'checked' | 'gaps';
