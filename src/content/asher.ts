/* Asher's project page: its data, with every word read from words/projects/asher.md.
 *
 * The words file holds every word a reader sees on the page, the drawing's included: the part, plate and size names
 * and notes that the part panel, the parts lists and Measurements show. This file keeps only what is not words: the
 * topic and stage, which milestones are reached and when, the wiring's boxes and arrows, which sizes go in which
 * group, and how the words file's slots map onto the page and onto the 3D model (src/content/asher.model.json),
 * which keeps the ids and the geometry. It is read on every request in the preview, so an edit to the words file
 * shows on the next refresh.
 *
 * Source: the studio's round 4 content (design-stage/data/asher.project.json, 2026-11-15), with the round 4 review's
 * fixes applied. Facts come only from Asher's build record (skills/asher/content/build-record.md); "What runs where"
 * comes from the Asher fact sheet (skills/asher/content/what-runs-where.md, checked 2026-11-15). Quotes are written
 * {{Who: words}}; only Ben's own words and Asher's own lines are quoted.
 *
 * Kept off this page and out of the words file (the repo is public): network addresses, hostnames, ports, tailnet or
 * machine names, Wi-Fi names, credentials, the name of the home graphics computer, anything heard in the house, any
 * family member but the one line about Ben's cousin, rooms, furnishings, the route through the rooms, and Ben's
 * surname.
 *
 * The model's own words are replaced when the page is built by overrides made here from the words file
 * (modelOverrides), applied by src/lib/project-model.ts, so the reader's browser gets the final model. Where the
 * page's words first differed from the model file's (round 4 review): the kit decks are "two kit decks", colour left
 * out until settled (item 13 for the kit's about $60); the Pi no longer does speech and hearing (item 5); the webcam's
 * frame size and rate are not in the record (item 2); the distance sensor is foam-taped in the kit's cat-face
 * bracket, with no printed angle (item 3); the wheelbase note says which figure came from the tape (item 14); and
 * notes about watts, cell voltages and part swaps, which the page does not show, were cut.
 */
import type { ProjectPage, ProjectWords, Override } from '@/lib/project';
import type { Model } from '@/lib/project-model';
import { list, maybe, paras, slot, table, words, type WordsFile } from '@/lib/words';
import modelFile from './asher.model.json';

const model = modelFile as unknown as Model;
export const WORDS_FILE = 'projects/asher';

// ---- the page's labels: one slot each ----------------------------------------------------------------------------
export const LABELS: [keyof ProjectWords, string][] = [
  // the title sheet
  ['jumpsLabel', 'Jump links, for screen readers'],
  ['jumpCanDo', 'Jump link: what it can do'],
  ['jumpJournal', 'Jump link: the journal'],
  ['jumpReceipt', 'Jump link: the receipt'],
  ['jumpCore', 'Jump link: the core'],
  ['stage', 'Title block: stage'],
  ['stageLadder', 'Stage steps, for screen readers'],
  ['stageThisBuild', 'Stage steps: this build, for screen readers'],
  ['topic', 'Title block: topic'],
  ['updated', 'Title block: last updated'],
  ['credit', 'Title block: credit'],
  ['builtBy', 'Credit'],
  ['status', 'Title block: status'],
  // the drawing sheet
  ['drawnFrom', 'Drawing title block: drawn from'],
  ['scale', 'Drawing title block: scale'],
  ['noScript', 'Drawing: without JavaScript'],
  ['howToTitle', 'How to read the drawing: heading'],
  ['colourComputer', 'Colour key: computer'],
  ['colourBoards', 'Colour key: boards'],
  ['colourSensors', 'Colour key: sensors'],
  ['colourPower', 'Colour key: power'],
  ['colourDrive', 'Colour key: drive'],
  ['colourPlates', 'Colour key: plates'],
  ['colourPillars', 'Colour key: pillars'],
  // the drawing itself
  ['modelHeading', 'Drawing: heading, for screen readers'],
  ['modelLabel', 'Drawing, for screen readers'],
  ['modelKey', 'Drawing: number key, for screen readers'],
  ['labelsButton', 'Drawing: labels button'],
  ['explode', 'Drawing: explode slider'],
  ['dragHint', 'Drawing: hint under it'],
  ['selectedPart', 'Part panel: heading'],
  ['selectedHint', 'Part panel: hint'],
  ['partsOnRobot', 'Parts beside the drawing: heading'],
  ['partsCount', 'Parts beside the drawing: count'],
  ['sheetName', 'Drawing corner: sheet name'],
  ['viewWords', 'Drawing corner: view'],
  ['viewIso', 'Drawing corner: view at the start'],
  ['viewTurned', 'Drawing corner: view once turned'],
  ['scaleWords', 'Drawing corner: scale'],
  ['sheetLine', 'Drawing corner, read out'],
  ['axisFront', 'Drawing arrows: front'],
  ['axisLeft', 'Drawing arrows: left'],
  ['axisUp', 'Drawing arrows: up'],
  ['est', 'Estimate mark'],
  ['unknown', 'Unknown mark'],
  // the drawing's panels and labels
  ['asBuilt', 'Part panel, nothing selected: heading'],
  ['nothingSelected', 'Part panel, nothing selected: line'],
  ['levels', 'Part panel, nothing selected: levels'],
  ['wholeRobot', 'Whole robot label'],
  ['wholeRobotFrom', 'Whole robot: where the size came from'],
  ['weight', 'Weight label'],
  ['weightFrom', 'Weight: where it came from'],
  ['size', 'Part panel: size'],
  ['mass', 'Part panel: mass'],
  ['price', 'Part panel: price'],
  ['pricesChecked', 'Part panel: price note'],
  ['onRobotNow', 'Part panel: on the robot'],
  ['onRobotNowShort', 'Parts beside the drawing: on the robot'],
  ['fixedPart', 'Role: fixed part'],
  ['fixedParts', 'Parts beside the drawing: fixed parts'],
  ['chassisFloorUp', 'Parts beside the drawing: chassis'],
  ['chassisLevel', 'Plate panel: level'],
  ['plate', 'Plate panel: plate'],
  ['kitDeck', 'Plate panel: kit deck'],
  ['topAboveFloor', 'Plate panel: top'],
  ['madeOf', 'Plate panel: made of'],
  ['notRecorded', 'Plate panel: not recorded'],
  ['ariaPart', 'Part, read out'],
  ['ariaFixed', 'Fixed part, read out'],
  ['ariaPlate', 'Plate, read out'],
  ['priceUnknown', 'Price: not known'],
  ['pricePartOf', 'Price: part of another part'],
  ['priceHomeMade', 'Price: home-made'],
  ['priceInKit', 'Price: in the kit'],
  // what runs where
  ['whatRunsWhere', 'What runs where: heading'],
  // what it can do, the arc, the journal, the receipt
  ['canDo', 'What it can do: heading'],
  ['milestoneNext', 'Milestone: next'],
  ['milestoneReached', 'Milestone: reached'],
  ['journal', 'Journal: heading'],
  ['journalSub', 'Journal: under the heading'],
  ['changed', 'Journal: what changed label'],
  ['wrong', 'Journal: what went wrong label'],
  ['receipt', 'Receipt: heading'],
  ['receiptSub', 'Receipt: under the heading'],
  ['receiptCost', 'Receipt: cost label'],
  ['receiptTime', 'Receipt: time label'],
  ['receiptAiPart', 'Receipt: who did what label'],
  ['receiptBroke', 'Receipt: what broke label'],
  ['receiptChecked', 'Receipt: who checked it label'],
  ['receiptGaps', 'Receipt: gaps label'],
  // the core
  ['core', 'Core: heading'],
  ['safetyTitle', 'Before you copy this: heading'],
  ['safetyLine', 'Before you copy this: first line'],
  ['licenceTitle', 'Licence: heading'],
  ['licenceCopy', 'Licence: once chosen'],
  ['energy', 'Energy: heading'],
  ['materials', 'Materials: heading'],
  ['parts', 'Parts: heading'],
  ['partsList', 'Parts list: heading'],
  ['partsListSub', 'Parts list: under the heading'],
  ['partsRole', 'Parts list: role, for screen readers'],
  ['partsPart', 'Parts list: part column'],
  ['partsPrice', 'Parts list: price column'],
  ['partsTotal', 'Parts list: total row'],
  ['partsNote', 'Parts list: note'],
  ['partsUnknownOne', 'Parts list: one part without a price'],
  ['partsUnknownMany', 'Parts list: parts without a price'],
  ['measurements', 'Measurements: heading'],
  ['measurementsSub', 'Measurements: under the heading'],
  ['axleToAxle', 'Measurements: axle to axle'],
  ['axleFrom', 'Measurements: axle to axle, where it came from'],
  ['wholeRobotAxes', 'Measurements: whole robot, which way'],
  ['levelsTitle', 'Measurements: levels heading'],
  ['levelCol', 'Measurements: level column'],
  ['levelSizeCol', 'Measurements: size column'],
  ['levelTop', 'Measurements: plate top'],
  ['everySize', 'Every size: heading'],
  ['everySizeCount', 'Every size: count'],
  ['sizeCol', 'Every size: size column'],
  ['valueCol', 'Every size: value column'],
  ['otherSizes', 'Every size: other sizes'],
  ['wired', 'Wiring: heading'],
  ['wiredFrom', 'Wiring table: from'],
  ['wiredTo', 'Wiring table: to'],
  ['wiredHow', 'Wiring table: what it carries'],
];

// ---- the model's words -----------------------------------------------------------------------------------------
// Each part's slots start "Part, <short name>:" (role, label on the drawing, name, made by, model, what it does,
// note, and for one part its price in words).
export const PARTS: [string, string][] = [
  ['rpi4b-2gb', 'main computer'],
  ['emeet-c980-pro', 'camera'],
  ['hc-sr04', 'distance sensor'],
  ['acebott-esp32-max', 'controller board'],
  ['acebott-qa052-shield', 'motor driver'],
  ['drive-tt-mecanum', 'motors and wheels'],
  ['nuon-18650-x2', 'motor battery'],
  ['anker-powercore-slim-10000', 'computer battery'],
  ['anker-usb-c-out', 'power bank socket'],
  ['emeet-c980-audio', 'ears and voice'],
  ['acebott-kit-plates', 'kit decks'],
  ['homemade-plates', 'Ben’s plates'],
  ['standoffs', 'pillars'],
  ['sensor-bracket', 'cat-face bracket'],
  ['case-fan', 'computer case'],
  ['microsd-32', 'memory card'],
  ['battery-holder-switch', 'battery holder'],
  ['controller-regulators', 'board regulators'],
];
// parts whose price is shown in words, not worked out from the model
export const PRICE_IN_WORDS = ['acebott-kit-plates'];
// facts the code acts on where the model file is wrong (not words; see markModel in src/lib/project-model.ts)
const FACTS = [
  { path: 'parts.sensor-bracket.homeMade', value: false, why: 'Review item 3: it is the kit’s bracket, not home-made.' },
];
// the parts the drawing labels: those with a main shape that is not left quiet
export const drawnParts = (m: Model = model) =>
  PARTS.map(([id]) => id).filter((id) => m.asBuilt.solids.some((s) => s.partId === id && s.main && !s.quiet));

// Measurements groups its sizes by the model's size keys; anything left over goes under "Every size: other sizes".
const MEAS_GROUPS = [
  '^(weight_g|wheel|track|deck_|lower_deck|pillar_|motor_)',
  '^(esp_|shield_|cells_)',
  '^(pi_|plate_t|velcro_t)',
  '^(cam_|sensor_|transducer_|catface_)',
  '^bank_',
];
// how a size was got: the model's codes, in the order the words file lists them
export const SOURCES = ['measured', 'ruler photo', 'photo', 'datasheet', 'record', 'guess'];

// the wiring diagram: its boxes and arrows (the words are the "Wiring box" and "Wiring arrow" slots)
export const WIRING_NODES: { id: string; slot: string; group?: 'box' }[] = [
  { id: 'claude', slot: 'Claude' },
  { id: 'laptop', slot: 'the laptop' },
  { id: 'pi', slot: 'the Raspberry Pi', group: 'box' },
  { id: 'cam', slot: 'the webcam', group: 'box' },
  { id: 'board', slot: 'the ESP32 board', group: 'box' },
  { id: 'sonar', slot: 'the distance sensor', group: 'box' },
  { id: 'wheels', slot: 'the motors', group: 'box' },
];
export const WIRING_LINKS: [string, string][] = [
  ['claude', 'laptop'],
  ['laptop', 'pi'],
  ['pi', 'cam'],
  ['pi', 'board'],
  ['board', 'sonar'],
  ['board', 'wheels'],
];
const nodeSlot = (id: string) => WIRING_NODES.find((n) => n.id === id)!.slot;
export const arrowSlot = (from: string, to: string) => `Wiring arrow: ${nodeSlot(from)} to ${nodeSlot(to)}`;

// Then, now, next. The milestones' words are a list in the words file; which are reached, and when, are kept here.
export const ARC = [
  { id: 'then', slot: 'Then' },
  { id: 'now', slot: 'Now' },
  { id: 'next', slot: 'Next' },
];
const MILESTONES: { state?: 'done' | 'next'; when?: string }[] = [
  { state: 'done', when: '2026-11-11' }, // M0
  { state: 'done', when: '2026-11-11' }, // M1
  { state: 'next' }, // M2
];

// "What runs where": the short sections, in page order
export const RUNS_SECTIONS = [
  'On the Pi',
  'On the ESP32',
  'The microSD card',
  'Vision',
  'Hearing',
  'Speech',
  'From a phone',
  'From the laptop',
];

export const RECEIPT_SLOTS = [
  ['cost', 'Receipt: cost'],
  ['time', 'Receipt: time'],
  ['aiPart', 'Receipt: who did what'],
  ['broke', 'Receipt: what broke'],
  ['checked', 'Receipt: who checked it'],
  ['gaps', 'Receipt: gaps'],
] as const;

// ---- reading the words file ----------------------------------------------------------------------------------------
// numbered slots ("Can do 1: ...", "Journal 2: ...") run from 1 until the next number has no slots
function numbered<T>(w: WordsFile, first: string, read: (n: number) => T): T[] {
  const out: T[] = [];
  for (let n = 1; maybe(w, `${first.replace('{n}', String(n))}`) !== ''; n++) out.push(read(n));
  return out;
}

/** The overrides that put the words file's words on the model: every part, role, plate and size. */
export function modelOverrides(w: WordsFile, m: Model = model): Override[] {
  const out: Override[] = [...FACTS];
  const why = 'words/projects/asher.md';
  const set = (path: string, value: string) => out.push({ path, value, why });
  set('robot.status', slot(w, 'Drawing status chip'));
  set('chassis.kind', slot(w, 'Whole robot: what it is'));
  set('asBuilt.note', paras(w, 'Measurements: note').join(' '));
  PARTS.forEach(([id, short]) => {
    const p = m.parts[id];
    if (!p) throw new Error(`src/content/asher.ts: the model has no part "${id}".`);
    const s = (field: string) => `Part, ${short}: ${field}`;
    if (p.slot !== 'fixed') set(`slots[id=${p.slot}].name`, slot(w, s('role')));
    set(`parts.${id}.name`, slot(w, s('name')));
    set(`parts.${id}.maker`, maybe(w, s('made by')));
    set(`parts.${id}.model`, maybe(w, s('model')));
    set(`parts.${id}.does`, slot(w, s('what it does')));
    set(`parts.${id}.note`, maybe(w, s('note')));
    if (PRICE_IN_WORDS.includes(id)) set(`parts.${id}.priceText`, slot(w, s('price')));
  });
  m.asBuilt.levels.forEach((lv, i) => {
    const s = (field: string) => `Level ${i + 1}: ${field}`;
    set(`asBuilt.levels[id=${lv.id}].name`, slot(w, s('name')));
    set(`asBuilt.levels[id=${lv.id}].holds`, slot(w, s('what it holds')));
    set(`asBuilt.levels[id=${lv.id}].sizeFrom`, slot(w, s('size, how it was got')));
    set(`asBuilt.levels[id=${lv.id}].topFrom`, slot(w, s('height, how it was got')));
    set(`asBuilt.levels[id=${lv.id}].madeOf`, slot(w, s('made of')));
  });
  m.asBuilt.dims.forEach((x) => {
    set(`asBuilt.dims[key=${x.key}].name`, slot(w, `Size ${x.key}: name`));
    set(`asBuilt.dims[key=${x.key}].note`, maybe(w, `Size ${x.key}: note`));
    set(`asBuilt.dims[key=${x.key}].sourceWords`, slot(w, `Size tag: ${x.source}`));
  });
  return out;
}

function whatRunsWhere(w: WordsFile): ProjectPage['whatRunsWhere'] {
  return {
    intro: slot(w, 'What runs where: intro'),
    glance: table(w, 'What runs where: at a glance'),
    sections: RUNS_SECTIONS.map((name) => ({
      heading: slot(w, `What runs where, ${name}: heading`),
      body: slot(w, `What runs where, ${name}`),
    })),
    gpuHeading: slot(w, 'What runs where, graphics card: heading'),
    gpu: table(w, 'What runs where, graphics card'),
    inShort: slot(w, 'What runs where: in short'),
  };
}

/** Asher's page, read fresh from the words file. */
export function asherPage(): ProjectPage {
  const w = words(WORDS_FILE);
  const drawn = drawnParts();
  return {
    id: 'asher',
    name: slot(w, 'Title'),
    builder: 'Ben',
    updated: slot(w, 'Last updated'),
    topic: 'making',
    stage: 'prototype',
    stageNote: slot(w, 'Stage note'),
    status: slot(w, 'Status'),
    hook: slot(w, 'Hook'),
    intro: paras(w, 'Intro'),
    footerNote: slot(w, 'Footnote'),
    words: Object.fromEntries(LABELS.map(([k, name]) => [k, slot(w, name)])) as unknown as ProjectWords,

    drawing: {
      title: slot(w, 'Drawing: heading'),
      sub: slot(w, 'Drawing: under the heading'),
      pending: slot(w, 'Drawing: software still to come'),
      drawnFrom: slot(w, 'Drawn from'),
      scale: slot(w, 'Scale'),
      howTo: paras(w, 'How to read the drawing'),
      partLabels: Object.fromEntries(
        drawn.map((id) => [id, slot(w, `Part, ${PARTS.find((p) => p[0] === id)![1]}: label on the drawing`)]),
      ),
      sourceWords: Object.fromEntries(SOURCES.map((s) => [s, slot(w, `Size count: ${s}`)])),
      measGroups: MEAS_GROUPS.map((pattern, i) => [slot(w, `Every size: group ${i + 1}`), pattern] as [string, string]),
      overrides: modelOverrides(w),
    },

    whatRunsWhere: whatRunsWhere(w),

    canDo: {
      cols: [slot(w, 'What it can do: he can column'), slot(w, 'What it can do: last seen column'), slot(w, 'What it can do: how well column')],
      note: slot(w, 'What it can do: note under the table'),
      rows: numbered(w, 'Can do {n}: he can', (n) => ({
        can: slot(w, `Can do ${n}: he can`),
        last: slot(w, `Can do ${n}: last seen working`),
        lastNote: maybe(w, `Can do ${n}: note under the date`) || undefined,
        how: slot(w, `Can do ${n}: how well`),
      })),
    },

    arc: ARC.map(({ id, slot: name }) => {
      const steps = id === 'next' ? list(w, 'Next: milestones') : [];
      return {
        id,
        label: slot(w, `${name}: heading`),
        title: slot(w, `${name}: title`),
        text: paras(w, name),
        ...(steps.length ? { steps: steps.map((label, i) => ({ label, ...MILESTONES[i] })) } : {}),
      };
    }),

    journal: numbered(w, 'Journal {n}: date', (n) => ({
      date: slot(w, `Journal ${n}: date`),
      title: slot(w, `Journal ${n}: title`),
      changed: list(w, `Journal ${n}: what changed`),
      wrong: list(w, `Journal ${n}: what went wrong`),
    })),

    receipt: Object.fromEntries(RECEIPT_SLOTS.map(([k, name]) => [k, paras(w, name)])),

    core: {
      intro: slot(w, 'Core: under the heading'),
      safety: { checks: list(w, 'Before you copy this: checks') },
      licence: { chosen: null, note: slot(w, 'Licence: note') },
      energy: paras(w, 'Energy'),
      materials: paras(w, 'Materials'),
      partsLine: slot(w, 'Parts: under the heading'),
      wiring: {
        boxLabel: slot(w, 'Wiring: box label'),
        key: slot(w, 'Wiring: key'),
        nodes: WIRING_NODES.map(({ id, slot: name, group }) => ({ id, label: slot(w, `Wiring box: ${name}`), ...(group ? { group } : {}) })),
        links: WIRING_LINKS.map(([from, to]) => ({ from, to, how: slot(w, arrowSlot(from, to)) })),
      },
    },
  };
}
