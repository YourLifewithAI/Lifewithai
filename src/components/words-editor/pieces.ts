// The words editor's pure helpers: no React, no DOM, no server code, so the tests can run them on the real words files.
//
// The page shows a slot's words in many ways: as one string, as paragraphs, as list items, as table cells, as headings
// inside Markdown. A "piece" is one of those as the page shows it: a cell, an item, a heading, a paragraph, or the whole
// slot. Each piece knows its source (the Markdown as typed), the plain forms the page's text can take (to find it on the
// page) and where it sits in its slot, so an edit to one piece can be put back into the full slot text (rebuild).
// The rules mirror src/lib/words.ts: table() for cells, items() for list items, html() for headings and term lists.

/** One slot of a words file, as GET /api/words-editor lists it. `i` is its place in parseWords(...).order. */
export interface IndexSlot {
  i: number;
  name: string;
  hint: string;
  line: number;
  text: string;
}

/** One words file, as GET /api/words-editor lists it. */
export interface IndexFile {
  name: string;
  file: string;
  benPass: boolean;
  slots: IndexSlot[];
  error?: string;
}

/** One line of the edit log (<repo>/.words-edits.jsonl). */
export interface LogEntry {
  at: string;
  action: 'edit' | 'undo' | 'pass';
  name: string;
  file: string;
  i?: number;
  slot?: string;
  line?: number;
  before: string;
  after: string;
}

export type PieceKind = 'slot' | 'block' | 'heading' | 'item' | 'cell';

export type PieceLoc =
  | { kind: 'slot' }
  // `block` counts the slot's blocks (split on blank lines) from 0
  | { kind: 'block'; block: number }
  | { kind: 'heading'; block: number; prefix: string; suffix: string }
  // the item's lines within its block, [start, end); `bullet` is its first line's "- " as typed
  | { kind: 'item'; block: number; start: number; end: number; bullet: string }
  // the cell's words within one line of the slot, [start, end) in characters
  | { kind: 'cell'; line: number; start: number; end: number };

export interface Piece {
  /** the words file's name, e.g. 'projects/asher' */
  file: string;
  /** the slot's place in the file */
  i: number;
  slot: string;
  hint: string;
  kind: PieceKind;
  /** the words as typed, the way the editor shows them */
  source: string;
  /** true for words that sit on one line on the page: a cell, a list item, a heading, a one-line slot */
  oneLine: boolean;
  /** the forms the page's text can take, lower case with every space taken out */
  forms: string[];
  /** for words with {name} in them, which the site fills in: matches any text in their place */
  pattern: RegExp | null;
  /** the {name} words in the source */
  holes: string[];
  loc: PieceLoc;
}

// ---- plain text ------------------------------------------------------------------------------------------------------

// &shy; (a soft hyphen, where a long word may break) shows as nothing until the word breaks
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
// characters a page holds but doesn't show: the soft hyphen, zero-width spaces and joiners, the byte-order mark
const INVISIBLE = new RegExp(`[${String.fromCharCode(0xad, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff)}]`, 'g');

/** Markdown as the page shows it, roughly: the words of links and images, no emphasis marks, no heading marks, no
 *  {#id}, quotes ({{Who: words}}) as their words, backslash escapes undone. Spaces are left as they are. */
export function plainText(md: string): string {
  let s = md;
  s = s.replace(/\{\{([^:}]+):\s*([^}]+)\}\}/g, '$2');
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  s = s.replace(/<((?:https?:|mailto:)[^>\s]+)>/g, '$1');
  s = s.replace(/[ \t]*\{#[a-z0-9-]+\}/g, '');
  s = s.replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '');
  s = s.replace(/^[ \t]*[-*+][ \t]+/gm, '');
  s = s.replace(/^[ \t]*\d+[.)][ \t]+/gm, '');
  s = s.replace(/^[ \t]*>[ \t]?/gm, '');
  s = s.replace(/\*\*([^*]+?)\*\*/g, '$1');
  s = s.replace(/(^|[^\w])__([^_]+?)__(?!\w)/g, '$1$2');
  s = s.replace(/\*([^*\s][^*]*?)\*/g, '$1');
  s = s.replace(/(^|[^\w])_([^_\s][^_]*?)_(?!\w)/g, '$1$2');
  s = s.replace(/`+/g, '');
  s = s.replace(/\\([\\`*_{}[\]()#+\-.!|>~<"'])/g, '$1');
  s = s.replace(/&(?:(amp|lt|gt|quot|apos|nbsp|shy)|#(\d{1,7})|#x([0-9a-f]{1,6}));/gi, (m, name?: string, dec?: string, hex?: string) => {
    if (name) return ENTITIES[name.toLowerCase()] ?? m;
    const code = dec ? Number(dec) : parseInt(hex!, 16);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
  });
  return s;
}

/** Text for matching: lower case, with every space and invisible character taken out (the page's text drops spaces
 *  between blocks). */
export const squash = (s: string): string => s.replace(/\s+/g, '').replace(INVISIBLE, '').toLowerCase();

/** The {name} words in some words that the site fills in. Quotes ({{Who: words}}) and heading link names ({#id}) aren't. */
export function holesOf(source: string): string[] {
  const bare = source.replace(/\{\{[\s\S]*?\}\}/g, '');
  return [...new Set([...bare.matchAll(/\{[a-zA-Z][\w ]*\}/g)].map((m) => m[0]))];
}

/** True when some words use Markdown (bold, italic, a link, code, a heading or a quote). */
export const hasMarkdown = (source: string): boolean =>
  /\*\*|__|\[[^\]]+\]\([^)]*\)|`|(^|\s)\*[^*\s]|(^|\s)_[^_\s]|^\s*#{2,6} |\{\{[^}]+\}\}/m.test(source);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Template words whose own words (the holes left out) are shorter than this, and fewer than three words, are too short to
// go on by themselves: a hole at their start or end may only stand for a number or a date written in figures.
const FEW_WORDS = 12;
// what a hole with words on both sides of it can stand for: any text, but some
const ANY = '[\\s\\S]{1,200}?';
// what a hole at the start or end of few words can stand for: a number, a price or a date in figures, with no letters
// ("22 parts" is "{n} parts"; "Parts on the robot 22 parts" and "Fixed parts" aren't)
const FIGURES = '[^a-z\\u00c0-\\u024f]{1,24}';

// a pattern for words with {name} holes: each hole matches some text. Needs some words of its own to go on.
function patternOf(plain: string, holes: string[]): RegExp | null {
  if (!holes.length) return null;
  const flat = squash(plain);
  const marks = holes.map((h) => squash(h));
  const parts: string[] = [];
  let rest = flat;
  // split at every hole, in whatever order they come
  for (;;) {
    let at = -1;
    let len = 0;
    for (const m of marks) {
      const k = rest.indexOf(m);
      if (k >= 0 && (at < 0 || k < at)) {
        at = k;
        len = m.length;
      }
    }
    if (at < 0) break;
    parts.push(rest.slice(0, at));
    rest = rest.slice(at + len);
  }
  parts.push(rest);
  const fixed = parts.join('').length;
  if (fixed < 3) return null;
  // three words or more of its own are enough to go on, however short ("part of the {host}")
  const own = holes.reduce((t, h) => t.split(h).join(' '), plain).split(/\s+/).filter((w) => /[a-z]/i.test(w)).length;
  const few = fixed < FEW_WORDS && own < 3;
  const last = parts.length - 1;
  let re = '';
  parts.forEach((part, k) => {
    if (k > 0) {
      // the hole before this part: at the start or the end of the words when nothing comes before or after it
      const edge = (k === 1 && !parts[0]) || (k === last && !part);
      re += edge && few ? FIGURES : ANY;
    }
    re += escapeRe(part);
  });
  return new RegExp(`^${re}$`);
}

// ---- a slot's pieces -------------------------------------------------------------------------------------------------

/** A table slot: two or more lines with words, every one with a "|" (as table() reads them). */
export function isTable(text: string): boolean {
  const lines = text.split('\n').filter((l) => l.trim());
  return lines.length >= 2 && lines.every((l) => l.includes('|'));
}

// A table line's cells, mirroring table() in src/lib/words.ts: trim, drop "- ", drop the outer pipes, trim, split on "|".
// Each cell's words are given as [start, end) within the line, without the spaces round them.
function cellsOf(line: string): { start: number; end: number }[] | null {
  let s = 0;
  let e = line.length;
  const ws = (c: string | undefined) => c !== undefined && /\s/.test(c);
  while (s < e && ws(line[s])) s++;
  while (e > s && ws(line[e - 1])) e--;
  if (line.startsWith('- ', s)) s += 2;
  if (s < e && line[s] === '|') s++;
  if (e > s && line[e - 1] === '|') e--;
  while (s < e && ws(line[s])) s++;
  while (e > s && ws(line[e - 1])) e--;
  const inner = line.slice(s, e);
  if (!inner || /^[\s|:-]+$/.test(inner)) return null; // an empty line or a divider row
  const out: { start: number; end: number }[] = [];
  let a = s;
  for (let k = s; k <= e; k++) {
    if (k === e || line[k] === '|') {
      const seg = line.slice(a, k);
      const lead = seg.length - seg.trimStart().length;
      const words = seg.trim();
      out.push({ start: a + lead, end: a + lead + words.length });
      a = k + 1;
    }
  }
  return out;
}

/** A slot's text cut into its blocks and the blank lines between them: [block, gap, block, gap, block, ...]. */
export const splitParts = (text: string): string[] => text.split(/(\n\s*\n)/);

const BULLET = /^(\s*[-*+]\s+)/;
const HEADING = /^(\s*#{2,6}[ \t]+)(.*?)([ \t]*\{#[a-z0-9-]+\}[ \t]*)?$/;

function base(file: string, s: IndexSlot) {
  return { file, i: s.i, slot: s.name, hint: s.hint };
}

function makePiece(file: string, s: IndexSlot, kind: PieceKind, source: string, loc: PieceLoc, oneLine: boolean, extra: string[] = []): Piece | null {
  const plain = plainText(source);
  const holes = holesOf(source);
  // words that are nothing but a {marker}, like {stages}: the page puts something of its own there
  if (holes.length && !squash(holes.reduce((t, h) => t.split(h).join(''), plain))) return null;
  const forms = [...new Set([squash(plain), squash(source), ...extra].filter(Boolean))];
  if (!forms.length) return null;
  return { ...base(file, s), kind, source, loc, oneLine, forms, pattern: patternOf(plain, holes), holes };
}

/** Every piece of one slot. */
export function slotPieces(file: string, s: IndexSlot): Piece[] {
  const text = s.text;
  if (!text.trim()) return [];
  const out: Piece[] = [];
  const add = (p: Piece | null) => {
    if (p) out.push(p);
  };

  if (isTable(text)) {
    const all: string[] = [];
    text.split('\n').forEach((line, li) => {
      for (const c of cellsOf(line) ?? []) {
        const words = line.slice(c.start, c.end);
        all.push(words);
        add(makePiece(file, s, 'cell', words, { kind: 'cell', line: li, start: c.start, end: c.end }, true));
      }
    });
    // the whole table: the page's text is its cells, one after another
    const whole = makePiece(file, s, 'slot', text, { kind: 'slot' }, false, [squash(all.join(''))]);
    if (whole) out.push(whole);
    return out;
  }

  const parts = splitParts(text);
  const sub: Piece[] = [];
  for (let k = 0; k < parts.length; k += 2) {
    const block = parts[k];
    const b = k / 2;
    if (!block.trim()) continue;
    const lines = block.split('\n');
    if (BULLET.test(lines[0])) {
      // a list: one piece per item; a line without a bullet joins the item above (as items() reads it)
      const found: { start: number; end: number; bullet: string }[] = [];
      lines.forEach((l, li) => {
        const m = BULLET.exec(l);
        if (m) found.push({ start: li, end: li + 1, bullet: m[1] });
        else if (found.length) found[found.length - 1].end = li + 1;
      });
      for (const it of found) {
        const src = lines.slice(it.start, it.end).join('\n').slice(it.bullet.length);
        // a list whose items start with a bold term shows as terms and their meanings (<dt>, <dd>)
        const term = /^\*\*([\s\S]*?)\*\*([\s\S]*)$/.exec(src);
        const extra = term ? [squash(plainText(term[1].replace(/:\s*$/, '')) + plainText(term[2]))] : [];
        const p = makePiece(file, s, 'item', src, { kind: 'item', block: b, start: it.start, end: it.end, bullet: it.bullet }, true, extra);
        if (p) sub.push(p);
      }
      continue;
    }
    const h = lines.length === 1 ? HEADING.exec(block) : null;
    if (h) {
      const p = makePiece(file, s, 'heading', h[2], { kind: 'heading', block: b, prefix: h[1], suffix: h[3] ?? '' }, true);
      if (p) sub.push(p);
      continue;
    }
    const p = makePiece(file, s, 'block', block, { kind: 'block', block: b }, false);
    if (p) sub.push(p);
  }

  // one piece on its own: a plain one-block slot is the whole slot; a lone item or heading keeps its own piece
  if (sub.length === 1 && sub[0].kind === 'block') {
    add(makePiece(file, s, 'slot', text, { kind: 'slot' }, !text.includes('\n')));
    return out;
  }
  out.push(...sub);
  if (sub.length > 1) add(makePiece(file, s, 'slot', text, { kind: 'slot' }, false));
  return out;
}

/** Every piece of every file. */
export function allPieces(files: IndexFile[]): Piece[] {
  return files.flatMap((f) => f.slots.flatMap((s) => slotPieces(f.name, s)));
}

/** The full slot text with one piece's words replaced. A cell keeps its line's "- ", its pipes and the spaces round
 *  it; an item keeps its bullet; a heading keeps its "## " and its {#id}. Rebuilding a piece with its own source gives
 *  back the slot text unchanged. */
export function rebuild(slotText: string, p: Piece, source: string): string {
  const loc = p.loc;
  if (loc.kind === 'slot') return source;
  if (loc.kind === 'cell') {
    const lines = slotText.split('\n');
    const l = lines[loc.line];
    lines[loc.line] = l.slice(0, loc.start) + source + l.slice(loc.end);
    return lines.join('\n');
  }
  const parts = splitParts(slotText);
  const k = loc.block * 2;
  if (loc.kind === 'block') parts[k] = source;
  else if (loc.kind === 'heading') parts[k] = loc.prefix + source + loc.suffix;
  else {
    const lines = parts[k].split('\n');
    lines.splice(loc.start, loc.end - loc.start, ...(loc.bullet + source).split('\n'));
    parts[k] = lines.join('\n');
  }
  return parts.join('');
}

// ---- finding pieces from the page's text -------------------------------------------------------------------------------

export interface Matcher {
  /** pieces whose words are exactly this text (already squashed) */
  exact(text: string): Piece[];
  /** pieces whose words hold this text (already squashed), for when nothing matches exactly */
  within(text: string): Piece[];
}

export function matcher(pieces: Piece[]): Matcher {
  const map = new Map<string, Piece[]>();
  const patterns: Piece[] = [];
  for (const p of pieces) {
    for (const f of p.forms) {
      const list = map.get(f);
      if (list) {
        if (!list.includes(p)) list.push(p);
      } else map.set(f, [p]);
    }
    if (p.pattern) patterns.push(p);
  }
  return {
    exact(text) {
      if (!text) return [];
      const hit = [...(map.get(text) ?? [])];
      if (text.length <= 2000) for (const p of patterns) if (!hit.includes(p) && p.pattern!.test(text)) hit.push(p);
      return hit;
    },
    within(text) {
      if (!text) return [];
      return pieces.filter((p) => p.forms.some((f) => f.includes(text)));
    },
  };
}

// ---- files and the page ------------------------------------------------------------------------------------------------

const LABELS: Record<string, string> = {
  home: 'Front page',
  site: 'Every page (header, footer, sign-up)',
  about: 'About',
  privacy: 'Privacy',
  'not-found': 'Page not found',
  'topic-page': 'Topic pages',
  'pieces/asher': "Asher's card",
  'projects/asher': "Asher's page",
  'projects/asher-drawing': "Asher's drawing",
};

/** A words file's name as Ben reads it: "Asher's page". Falls back to the file's path, so the kit works on any site. */
export function fileLabel(name: string): string {
  if (LABELS[name]) return LABELS[name];
  const topic = /^topics\/(.+)$/.exec(name);
  if (topic) return `Topic: ${topic[1].replace(/-/g, ' ')}`;
  return `words/${name}.md`;
}

/** The words files that belong to a page: "/" is home; otherwise the file named as the path, and files whose name
 *  starts with the path and "-" or "/" ("/projects/asher" gives projects/asher and projects/asher-drawing). */
export function pageFiles(pathname: string, names: string[]): string[] {
  const p = pathname.replace(/^\/+|\/+$/g, '');
  if (!p) return names.filter((n) => n === 'home');
  return names.filter((n) => n === p || n.startsWith(`${p}-`) || n.startsWith(`${p}/`));
}

/** 0 for the page's own files; 1 for site (on every page) and for `near`, the other files the page is seen to show
 *  (WordsEditor finds them: a file with longer words shown whole on the page); 2 for the rest. */
export function fileRank(name: string, own: string[], near: string[] = []): number {
  return own.includes(name) ? 0 : name === 'site' || near.includes(name) ? 1 : 2;
}

/** Words shorter than this (squashed) are only looked for in the page's own files, site and the files the page is seen
 *  to show: short words like "Yes" or "Parts" are in many files, so a file the page doesn't show holding them says
 *  nothing about where these came from. */
export const ELSEWHERE_MIN = 12;

/** The pieces found for some text (`text`, squashed, is what was matched), one per slot, best first: the page's own
 *  files, then site and the files the page is seen to show (`near`), then the rest. The rest count only when nothing
 *  better matches and the text is at least ELSEWHERE_MIN long. Within a slot, the smallest piece comes first. */
export function rankPieces(found: Piece[], own: string[], text: string, near: string[] = []): Piece[] {
  const rank = (p: Piece) => fileRank(p.file, own, near);
  const best = Math.min(...found.map(rank));
  const elsewhere = best > 0 && text.length >= ELSEWHERE_MIN;
  const kept = found.filter((p) => rank(p) < 2 || elsewhere);
  const sorted = kept
    .map((p, n) => ({ p, n }))
    .sort((a, b) => rank(a.p) - rank(b.p) || +(a.p.kind === 'slot') - +(b.p.kind === 'slot') || a.n - b.n)
    .map((x) => x.p);
  const seen = new Set<string>();
  return sorted.filter((p) => {
    const k = `${p.file}#${p.i}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** A slot's note in brackets, without the brackets. */
export function cleanHint(hint: string): string {
  const notes = hint.match(/\(.*?\)|\[.*?\]/g);
  if (!notes) return hint.trim();
  return notes
    .map((h) => h.slice(1, -1).trim())
    .filter(Boolean)
    .join('; ');
}

/** What changed between two versions of some words, cut down to the changed part with a little around it. */
export function changeSnippet(before: string, after: string, room = 60): { before: string; after: string } {
  const b = before.replace(/\s+/g, ' ').trim();
  const a = after.replace(/\s+/g, ' ').trim();
  let pre = 0;
  while (pre < b.length && pre < a.length && b[pre] === a[pre]) pre++;
  let suf = 0;
  while (suf < b.length - pre && suf < a.length - pre && b[b.length - 1 - suf] === a[a.length - 1 - suf]) suf++;
  const ctx = 16;
  const cut = (s: string) => {
    const from = Math.max(0, pre - ctx);
    const to = Math.min(s.length, s.length - suf + ctx);
    let t = s.slice(from, to);
    if (t.length > room) t = `${t.slice(0, room - 1)}…`;
    return `${from > 0 ? '…' : ''}${t}${to < s.length && !t.endsWith('…') ? '…' : ''}`;
  };
  return { before: cut(b), after: cut(a) };
}
