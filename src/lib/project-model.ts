// The build-time loader for a project's 3D model. It applies the page's overrides, then prepares everything the page
// shows from the model: the drawing's scene and panels (handed to the client drawing as plain data), the parts list
// with its total, and the measurements. It runs when the page is built, so the reader's browser gets the final model
// and no option catalogue, swap rule or check rule ever reaches it.
// Every caption comes from the page's words (words/projects/<id>.md, read by src/content/<id>.ts); this file keeps
// only unit symbols and number formatting. The parts', plates' and sizes' own names and notes are set over the model
// file's by the page's overrides, which the data file makes from the same words file. What the code decides from the
// model (a home-made part, a price that covers the whole kit, a size's unit) is read from the model file before the
// words go on, so rewording a part never changes how it is counted.
// Ported from round 4's build.py (load_model) and the drawing engine's layout.js and app.js, as-built only.
import { fill, type Override, type ProjectPage, type ProjectWords } from './project';

// ---- the model file's shape ---------------------------------------------------------------------------------------
type Vec = [number, number, number];
export interface ModelSolid {
  id: string;
  partId?: string | null;
  kind: 'box' | 'cyl' | 'prism' | 'hex';
  level: number;
  role?: string;
  main?: boolean;
  quiet?: boolean;
  fill: string;
  cx: number;
  cy: number;
  cz: number;
  l: number;
  w: number;
  h: number;
  r?: number;
  len?: number;
  axis?: 'x' | 'y' | 'z';
  dir?: Vec;
  rings?: Vec[][];
  corners?: Vec[];
  name?: string;
}
interface ModelPart {
  id: string;
  slot: string;
  name: string;
  maker?: string;
  model?: string;
  status: string;
  does: string;
  dims?: number[];
  mass?: number;
  est: string[];
  price: number | null;
  priceEst?: boolean;
  priceText?: string;
  note?: string;
  builtInto?: string;
  short?: string;
  homeMade?: boolean; // set from the model file before the words go on
  wholeKit?: boolean; // its price is the whole kit's (set from the model file)
}
interface ModelLevel {
  id: string;
  name: string;
  kit: boolean;
  carries: boolean;
  l: number;
  w: number;
  top: number;
  holds: string;
  sizeFrom: string;
  topFrom: string;
  madeOf?: string;
}
interface ModelDim {
  key: string;
  name: string;
  value: number | number[];
  unit: string;
  source: string;
  sourceWords: string;
  note: string;
  symbol?: string; // the unit as shown after the value, set from the model file before the words go on
}
export interface Model {
  robot: { name: string; status: string };
  pricesCheckedOn: string;
  chassis: { kind: string; wheelbase: number; track: number; massMeasured: number };
  slots: { id: string; name: string; current: string }[];
  parts: Record<string, ModelPart>;
  asBuilt: { note: string; size: { l: number; w: number; h: number }; levels: ModelLevel[]; solids: ModelSolid[]; dims: ModelDim[] };
}

// ---- overrides: 'parts.some-id.does' or 'asBuilt.levels[id=deck-0].madeOf' --------------------------------------------
function setPath(root: unknown, path: string, value: unknown) {
  const segs = path.match(/[^.[\]]+(?:\[[^\]]+\])?/g) ?? [];
  let cur = root as Record<string, unknown>;
  segs.forEach((seg, i) => {
    const last = i === segs.length - 1;
    const m = /^([^[]+)\[(\w+)=([^\]]+)\]$/.exec(seg);
    if (m) {
      if (last) throw new Error(`override path must end on a field: ${path}`);
      const arr = cur[m[1]] as Record<string, unknown>[];
      const hit = (arr ?? []).filter((x) => String(x[m[2]]) === m[3]);
      if (hit.length !== 1) throw new Error(`override path ${path}: ${hit.length} matches for ${seg}`);
      cur = hit[0];
    } else if (last) {
      cur[seg] = value;
    } else {
      if (!(seg in cur)) throw new Error(`override path ${path}: no ${seg}`);
      cur = cur[seg] as Record<string, unknown>;
    }
  });
}

export function applyOverrides(model: Model, overrides: readonly Override[]): Model {
  const out = structuredClone(model);
  overrides.forEach((o) => setPath(out, o.path, o.value));
  return out;
}

// What the code needs to know from the model's own wording, read before any override changes the words.
// A size whose name ends "(g)" or "(degrees)" carries its unit in the name; it shows the symbol instead.
export function markModel(model: Model): Model {
  const out = structuredClone(model);
  Object.values(out.parts).forEach((p) => {
    p.homeMade = /home-made/i.test(p.maker ?? '');
    p.wholeKit = !!(p.note && /whole kit/i.test(p.note));
  });
  out.asBuilt.dims.forEach((x) => {
    const u = /\((g|degrees)\)$/.exec(x.name);
    x.symbol = u ? (u[1] === 'g' ? ' g' : '°') : x.unit ? ' ' + x.unit : '';
    if (u) x.name = x.name.replace(/\s*\((g|degrees)\)$/, '');
  });
  return out;
}

// ---- number formatting ------------------------------------------------------------------------------------------------
// a number for readers, with a real minus sign; `unknown` stands in for a missing figure
export function fmt(n: number | null | undefined, unit?: string, digits?: number, unknown = '?'): string {
  if (n === null || n === undefined || Number.isNaN(n)) return unknown;
  const v =
    digits === undefined
      ? (Math.round(Math.abs(n) * 100) / 100).toLocaleString('en-US')
      : Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return (n < 0 ? '−' : '') + v + (unit ? ' ' + unit : '');
}
const mm2 = (a: number, b: number) => `${fmt(a)} x ${fmt(b)} mm`;
const mm3 = (a: number, b: number, c: number) => `${fmt(a)} x ${fmt(b)} x ${fmt(c)} mm`;

// the colour group a part is drawn in (the names are CSS hooks, not words)
function fillFor(p: ModelPart | null) {
  const s = p?.slot;
  if (s === 'brain') return 'compute';
  if (s === 'controller' || s === 'driver' || s === 'regulator') return 'board';
  if (s === 'camera' || s === 'range' || s === 'audio') return 'sensor';
  if (s === 'battery' || s === 'computer-battery') return 'power';
  if (s === 'drive') return 'drive';
  return 'structure';
}

type Words = ProjectWords;
type DrawingWords = Pick<ProjectPage['drawing'], 'partLabels' | 'sourceWords' | 'measGroups'>;

// A part's price in words. $0 means three different things: built into another part, home-made, or in the kit.
// Returns the price and whether it is an estimate.
function priceOf(m: Model, p: ModelPart, w: Words): { text: string; est: boolean } {
  if (p.priceText) return { text: p.priceText, est: false };
  if (p.price === null || p.price === undefined) return { text: w.priceUnknown, est: false };
  if (p.price === 0) {
    const host = p.builtInto ? m.parts[p.builtInto] : null;
    if (host) {
      const hostName = m.slots.find((s) => s.id === host.slot)?.name.toLowerCase() ?? host.name.split(',')[0];
      return { text: fill(w.pricePartOf, { host: hostName }), est: false };
    }
    if (p.homeMade) return { text: w.priceHomeMade, est: false };
    return { text: w.priceInKit, est: false };
  }
  return { text: '$' + fmt(p.price, undefined, 2), est: !!p.priceEst };
}

// the parts on the robot: the slots' parts in the data's order, then the fixed parts
function partsOnRobot(m: Model) {
  const inSlots = m.slots.map((s) => ({ slot: s, part: m.parts[s.current] })).filter((x) => x.part);
  const ids = new Set(inSlots.map((x) => x.part.id));
  const fixed = Object.values(m.parts).filter(
    (p) => p.slot === 'fixed' && (p.builtInto ? ids.has(p.builtInto) : p.status === 'installed'),
  );
  return { inSlots, fixed };
}

// ---- the drawing's data ------------------------------------------------------------------------------------------------
export interface PanelFig {
  dt: string;
  dd: string;
  est?: string;
}
export interface Panel {
  name: string;
  line: string;
  does?: string;
  figs: PanelFig[];
  status: string;
  note?: string;
}
export interface SceneSolid extends ModelSolid {
  key: string; // what a tap on it selects: its part, or its plate
  owner: string | null; // a deck also lights up when the part that owns the decks is selected
  unit: string; // explode lifts a part (and what is built into it) as one
}
export interface DrawingData {
  title: string;
  status: string;
  solids: SceneSolid[];
  labels: { solid: string; text: string }[];
  bounds: { minx: number; maxx: number; miny: number; maxy: number; minz: number; maxz: number };
  floorDeckTop: number;
  keys: Record<string, { rank: number; aria: string }>;
  panels: Record<string, Panel>;
  robotPanel: Panel;
  tree: { heading: string; items: { key: string; name: string; status: string; fill: string }[] }[];
  count: number;
}

export function drawingData(m: Model, w: Words, d: DrawingWords): DrawingData {
  const AB = m.asBuilt;
  const LV = AB.levels;
  const P = m.parts;
  const slotName = (id: string) => m.slots.find((s) => s.id === id)?.name ?? null;
  const label = (p: ModelPart) => d.partLabels[p.slot] ?? d.partLabels[p.id] ?? p.name.split(/,| on /)[0];

  const solids: SceneSolid[] = AB.solids.map((a) => {
    const deck = a.role === 'deck';
    const p = a.partId ? P[a.partId] : null;
    const level = deck ? Number(a.id.slice(5)) : a.level;
    return {
      ...a,
      level,
      owner: deck ? (a.partId ?? null) : null,
      partId: deck ? null : (a.partId ?? null),
      key: deck ? a.id : a.partId || 'deck-' + a.level, // the hook-and-loop strips select the plate they sit on
      name: deck ? LV[level].name : p ? p.name : a.name,
      unit: ((p && p.builtInto) || (deck ? a.id : a.partId || 'deck-' + a.level)) + '@' + level,
    };
  });

  const labels: { solid: string; text: string }[] = [];
  solids.forEach((s) => {
    const p = s.partId ? P[s.partId] : null;
    if (s.main && p && !s.quiet) labels.push({ solid: s.id, text: label(p) });
  });

  let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, maxz = -1e9;
  solids.forEach((s) => {
    minx = Math.min(minx, s.cx - s.l / 2);
    maxx = Math.max(maxx, s.cx + s.l / 2);
    miny = Math.min(miny, s.cy - s.w / 2);
    maxy = Math.max(maxy, s.cy + s.w / 2);
    maxz = Math.max(maxz, s.cz + s.h / 2);
  });

  const { inSlots, fixed } = partsOnRobot(m);
  const keys: DrawingData['keys'] = {};
  const panels: DrawingData['panels'] = {};

  // keyboard order through the model: the slots in the data's order, then the fixed parts, then the plates
  inSlots.forEach(({ slot, part }, i) => {
    keys[part.id] = { rank: i, aria: fill(w.ariaPart, { name: part.name, role: slot.name.toLowerCase() }) };
  });
  fixed.forEach((p) => (keys[p.id] = { rank: 40, aria: fill(w.ariaFixed, { name: p.name }) }));
  LV.forEach((lv, n) => (keys[lv.id] = { rank: 60 + n, aria: fill(w.ariaPlate, { name: lv.name }) }));

  // a part's panel: what it is and what it does, its size, mass and price; nothing about options
  [...inSlots.map((x) => x.part), ...fixed].forEach((p) => {
    const sl = slotName(p.slot);
    const est = (k: string) => (p.est.includes(k) ? w.est : undefined);
    const figs: PanelFig[] = [];
    if (p.dims && (p.dims[0] || p.dims[1])) figs.push({ dt: w.size, dd: p.dims.map((x) => fmt(x)).join(' x ') + ' mm', est: est('dims') });
    if (p.mass) figs.push({ dt: w.mass, dd: fmt(p.mass, 'g'), est: est('mass') });
    const pr = priceOf(m, p, w);
    figs.push({ dt: w.price, dd: pr.text, est: pr.est ? fill(w.pricesChecked, { date: m.pricesCheckedOn }) : undefined });
    panels[p.id] = {
      name: p.name,
      line: (sl ?? w.fixedPart) + (p.maker ? '. ' + p.maker + (p.model ? ', ' + p.model : '') : '') + '.',
      does: p.does,
      figs,
      status: w.onRobotNow,
      note: p.note || undefined,
    };
  });

  // a level as built, each size and height saying how it was got
  LV.forEach((lv, n) => {
    panels[lv.id] = {
      name: lv.name,
      line: fill(w.chassisLevel, { n: n + 1, total: LV.length }),
      does: lv.holds,
      figs: [
        { dt: lv.kit ? w.kitDeck : w.plate, dd: mm2(lv.l, lv.w), est: lv.sizeFrom },
        { dt: w.topAboveFloor, dd: fmt(Math.round(lv.top), 'mm'), est: lv.topFrom },
        { dt: w.madeOf, dd: lv.madeOf || w.notRecorded },
      ],
      status: w.onRobotNow,
    };
  });

  const robotPanel: Panel = {
    name: fill(w.asBuilt, { name: m.robot.name }),
    line: w.nothingSelected,
    does: m.chassis.kind.replace(/\.?$/, '.'),
    figs: [
      { dt: w.levels, dd: String(LV.length) },
      { dt: w.wholeRobot, dd: mm3(AB.size.l, AB.size.w, AB.size.h), est: w.wholeRobotFrom },
      { dt: w.weight, dd: fmt(m.chassis.massMeasured, 'g'), est: w.weightFrom },
    ],
    status: m.robot.status,
  };

  const tree: DrawingData['tree'] = inSlots.map(({ slot, part }) => ({
    heading: slot.name,
    items: [{ key: part.id, name: part.name, status: w.onRobotNowShort, fill: fillFor(part) }],
  }));
  tree.push({ heading: w.fixedParts, items: fixed.map((p) => ({ key: p.id, name: p.name, status: w.onRobotNowShort, fill: fillFor(p) })) });
  tree.push({ heading: w.chassisFloorUp, items: LV.map((lv) => ({ key: lv.id, name: lv.name, status: w.onRobotNowShort, fill: 'structure' })) });

  return {
    title: m.robot.name,
    status: m.robot.status,
    solids,
    labels,
    bounds: { minx, maxx, miny, maxy, minz: 0, maxz },
    floorDeckTop: LV[0].top,
    keys,
    panels,
    robotPanel,
    tree,
    count: tree.reduce((a, g) => a + g.items.length, 0),
  };
}

// ---- the parts list ------------------------------------------------------------------------------------------------------
// A bill of materials (Ben, 2026-11-15): one row for each thing you buy or make to build the robot, not one for each part
// on it. The kit is one row, with the parts that came in it; a part built into another part has no row of its own.
// The total is the same as every part's, since the parts left out are the ones at $0.
export interface PartsList {
  rows: { role: string; part: string; price: string; est: boolean; foot: boolean; has?: string }[];
  total: string;
  totalEst: boolean;
  foot: string | null;
  note: string;
  checkedOn: string;
}
export function partsList(m: Model, w: Words): PartsList {
  const { inSlots, fixed } = partsOnRobot(m);
  const all = [...inSlots.map((x) => ({ role: x.slot.name, p: x.part })), ...fixed.map((p) => ({ role: w.fixedPart, p }))];
  // a priced part whose note says the price covers more than the part itself (the kit plates carry the whole kit's price)
  const isFoot = (p: ModelPart) => !!(p.note && p.price && p.price > 0 && p.wholeKit);
  // what came in the kit: a part at $0 that is neither home-made nor built into another part
  const inKit = (p: ModelPart) => p.price === 0 && !p.homeMade && !p.builtInto;
  // "Four TT motors" -> "four TT motors" inside a sentence; "HC-SR04 ..." and "ACEBOTT ..." keep their capitals
  const low = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
  const kitHas = all.filter((x) => inKit(x.p) || x.p.wholeKit).map((x) => low(x.p.name));
  const rows = [...all]
    // the kit first: everything else is added to it
    .sort((a, b) => Number(!!b.p.wholeKit) - Number(!!a.p.wholeKit))
    .filter(({ p }) => p.wholeKit || !(p.price === 0 && !p.homeMade))
    .map(({ role, p }) => {
      const pr = priceOf(m, p, w);
      if (p.wholeKit) return { role: '', part: w.bomKit, price: pr.text, est: pr.est, foot: false, has: fill(w.bomKitHas, { parts: kitHas.join(', ') }) };
      return { role: role === w.fixedPart ? '' : role, part: p.name, price: pr.text, est: pr.est, foot: isFoot(p) };
    });
  const sum = all.reduce((a, x) => a + (x.p.price || 0), 0);
  const unknown = all.filter((x) => x.p.price === null || x.p.price === undefined).length;
  // the kit's own row says what its price covers, so no footnote for it
  const footPart = all.find((x) => isFoot(x.p) && !x.p.wholeKit);
  const note = [fill(w.partsNote, { date: m.pricesCheckedOn })];
  if (unknown) note.push(fill(unknown > 1 ? w.partsUnknownMany : w.partsUnknownOne, { n: unknown }));
  return {
    rows,
    total: '$' + fmt(sum, undefined, 2),
    // an estimate when any price in it is one, is given in words ("about $60"), or is not known and counts as $0
    totalEst: all.some((x) => !!(x.p.priceEst && x.p.price) || !!x.p.priceText || x.p.price === null || x.p.price === undefined),
    foot: footPart ? footPart.p.note! : null,
    note: note.join(' '),
    checkedOn: m.pricesCheckedOn,
  };
}

// ---- the measurements: the robot as built, every size with where it came from ------------------------------------------
export interface Measurements {
  note: string;
  figs: PanelFig[];
  levels: { name: string; holds: string; size: string; sizeFrom: string; top: string; topFrom: string }[];
  counts: string;
  total: number;
  groups: { heading: string; rows: { name: string; value: string; note: string; source: string; sourceWords: string }[] }[];
}
export function measurements(m: Model, w: Words, d: DrawingWords): Measurements {
  const AB = m.asBuilt;
  const by: Record<string, number> = {};
  AB.dims.forEach((x) => {
    const k = d.sourceWords[x.source] ?? x.sourceWords;
    by[k] = (by[k] || 0) + 1;
  });
  const counts = Object.keys(by)
    .sort((a, b) => by[b] - by[a])
    .map((k) => `${by[k]} ${k}`)
    .join(', ');
  // a size's value with its unit (see markModel)
  const value = (x: ModelDim) => {
    const v = Array.isArray(x.value) ? x.value.map((n) => fmt(n)).join(', ') : fmt(x.value, undefined, undefined, w.unknown);
    return { name: x.name, text: v + (x.symbol ?? '') };
  };
  const used = new Set<string>();
  const groups = [...d.measGroups, [w.otherSizes, '.*'] as const].map(([heading, pattern]) => {
    const re = new RegExp(pattern);
    const rows = AB.dims
      .filter((x) => !used.has(x.key) && re.test(x.key))
      .map((x) => {
        used.add(x.key);
        const v = value(x);
        return { name: v.name, value: v.text, note: x.note ? x.note.charAt(0).toUpperCase() + x.note.slice(1) : '', source: x.source, sourceWords: x.sourceWords };
      });
    return { heading, rows };
  });
  return {
    note: AB.note,
    figs: [
      { dt: w.wholeRobot, dd: mm3(AB.size.l, AB.size.w, AB.size.h), est: w.wholeRobotAxes },
      { dt: w.weight, dd: fmt(m.chassis.massMeasured, 'g'), est: w.weightFrom },
      { dt: w.axleToAxle, dd: fmt(m.chassis.wheelbase, 'mm'), est: fill(w.axleFrom, { track: fmt(m.chassis.track, 'mm') }) },
    ],
    levels: AB.levels.map((lv) => ({
      name: lv.name,
      holds: lv.holds,
      size: mm2(lv.l, lv.w),
      sizeFrom: lv.sizeFrom,
      top: fill(w.levelTop, { top: fmt(lv.top, 'mm') }),
      topFrom: lv.topFrom,
    })),
    counts: fill(w.everySizeCount, { n: AB.dims.length, counts }),
    total: AB.dims.length,
    groups: groups.filter((g) => g.rows.length),
  };
}

// ---- one call for the page ------------------------------------------------------------------------------------------------
export function loadProject(model: Model, page: ProjectPage) {
  const m = applyOverrides(markModel(model), page.drawing.overrides);
  return {
    model: m,
    drawing: drawingData(m, page.words, page.drawing),
    parts: partsList(m, page.words),
    measurements: measurements(m, page.words, page.drawing),
  };
}
