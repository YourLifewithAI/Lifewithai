// Reads the site's words from the plain-text files in /words (see words/README.md).
// Server only: it reads files at build time. Client components get their words as props.
//
// A words file is Markdown. A line that starts with a single "# " names a slot; the text under it, up to the
// next "# " line, is that slot's words. Anything in brackets after the slot name is a hint for the person
// editing and is ignored here. Inside a slot, Markdown works as usual: a blank line starts a new paragraph,
// "- " starts a list item, **bold**, [a link](https://...), "## " a heading.
//
// Every reader here fails loudly: a missing or empty slot, a list with no items, a gap in numbered rows or a slot
// name used twice throws an error naming the file and the slot, so the preview shows it instead of quietly
// dropping words. `npm run words:check` (src/lib/words-check.ts) runs the same checks over every file at once.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export const WORDS_ROOT = path.join(process.cwd(), 'words');

/** One slot as written: its key, its name as typed (hint left out), the hint in brackets, its words, and the file
 *  line of its "# ". */
export interface WordsSlot {
  key: string;
  name: string;
  hint: string;
  text: string;
  line: number;
}

export interface WordsFile {
  file: string;
  /** "yes" once Ben has been through the page in his own voice. */
  benPass: boolean;
  /** Each slot's words by key (for a name used more than once, the first). */
  slots: Record<string, string>;
  /** Every slot in file order, repeats included (a journal's entries repeat their slot names). */
  order: WordsSlot[];
  /** Keys whose name is used more than once. Reading one of them as a single slot throws. */
  repeated: Set<string>;
}

export const keyOf = (name: string) =>
  name
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

// a slot's name as typed, without the hint in brackets
const nameOf = (heading: string) => heading.replace(/\(.*?\)|\[.*?\]/g, '').replace(/\s+/g, ' ').trim();

/** "yes", "Yes", "YES" or true: Ben has been through the page. Anything else is not yet. */
export const isPass = (v: unknown) => v === true || /^(yes|true)$/i.test(String(v ?? '').trim());

/** Parse one words file's text. `file` is how errors name it, e.g. "words/about.md". */
export function parseWords(file: string, source: string): WordsFile {
  const parsed = matter(source.replace(/\r\n/g, '\n'));
  const content = parsed.content;
  // the front matter's lines, so a slot's line number is the one an editor shows
  const offset = source.replace(/\r\n/g, '\n').split('\n').length - content.split('\n').length;
  const slots: Record<string, string> = {};
  const order: WordsSlot[] = [];
  const repeated = new Set<string>();
  let cur: WordsSlot | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (!cur) return;
    cur.text = buf.join('\n').trim();
    if (cur.key in slots) repeated.add(cur.key);
    else slots[cur.key] = cur.text;
    order.push(cur);
  };
  content.split('\n').forEach((line, i) => {
    const m = /^# (.+)$/.exec(line);
    if (m) {
      flush();
      cur = { key: keyOf(m[1]), name: nameOf(m[1]), hint: (m[1].match(/\(.*?\)|\[.*?\]/g) ?? []).join(' '), text: '', line: offset + i + 1 };
      buf = [];
    } else if (cur) {
      buf.push(line);
    }
  });
  flush();
  return { file, benPass: isPass(parsed.data.ben_pass), slots, order, repeated };
}

const cache = new Map<string, { mtime: number; value: WordsFile }>();

/** Load one words file, e.g. words('about') or words('topics/making'). */
export function words(name: string): WordsFile {
  const file = path.join(WORDS_ROOT, `${name}.md`);
  const mtime = fs.statSync(file).mtimeMs; // so edits show on the next refresh in the preview
  const hit = cache.get(file);
  if (hit && hit.mtime === mtime) return hit.value;
  const value = parseWords(`words/${name}.md`, fs.readFileSync(file, 'utf8'));
  cache.set(file, { mtime, value });
  return value;
}

// one slot's words, or undefined; a name used twice can't be read as one slot
function pick(w: WordsFile, key: string): string | undefined {
  const k = keyOf(key);
  if (w.repeated.has(k)) {
    const lines = w.order.filter((s) => s.key === k).map((s) => s.line);
    throw new Error(`${w.file} has more than one slot named "# ${key}" (lines ${lines.join(', ')}; the words in brackets don't count). Keep one.`);
  }
  return w.slots[k];
}

/** A slot's words as plain text (one line or a few). Throws with the file and slot name if it is missing. */
export function slot(w: WordsFile, key: string): string {
  const v = pick(w, key);
  if (v === undefined || v === '') {
    throw new Error(`${w.file} has no "# ${key}" slot, or it is empty.`);
  }
  return v;
}

/** A slot that may be left empty. */
export const maybe = (w: WordsFile, key: string): string => pick(w, key) ?? '';

// A list's items: each starts with "- " (or "* ", "+ "). A line that doesn't is joined to the item above it, so a
// long item can run on over several lines. Words before the first item, or no items at all, throw.
export function items(text: string, where: string): string[] {
  const out: string[] = [];
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    const m = /^[-*+]\s+(.*)$/.exec(l);
    if (m) out.push(m[1].trim());
    else if (out.length) out[out.length - 1] += ' ' + l;
    else throw new Error(`${where} is a list, but "${l}" comes before its first item. Start that line with "- ", or move it.`);
  }
  if (!out.length) throw new Error(`${where} is a list, but it has no items. Start each item with "- ".`);
  return out;
}

/** A slot written as a "- " list, as an array of items. */
export const list = (w: WordsFile, key: string): string[] => items(slot(w, key), `${w.file}, "# ${key}"`);

// a slot's paragraphs (split on blank lines), each as one line of plain text
const parasOf = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

/** A slot's paragraphs (split on blank lines), each as plain text. */
export const paras = (w: WordsFile, key: string): string[] => parasOf(slot(w, key));

/** Numbered rows ("Can do 1: he can", "Can do 2: he can", ...), read in number order. `first` names a row's first
 *  slot with {n} for the number; read(n) reads row n. Every number up to the highest one used must have its first
 *  slot filled in: a row left empty or missing before a later one throws, naming the file and the slot. */
export function numbered<T>(w: WordsFile, first: string, read: (n: number) => T): T[] {
  const [pre] = first.split('{n}').map(keyOf);
  const re = new RegExp(`^${pre}_(\\d+)(?:_|$)`);
  const nums = w.order.map((s) => re.exec(s.key)).filter((m): m is RegExpExecArray => !!m).map((m) => Number(m[1]));
  const max = nums.length ? Math.max(...nums) : 0;
  const out: T[] = [];
  for (let n = 1; n <= max; n++) {
    const name = first.replace('{n}', String(n));
    if (maybe(w, name) === '') {
      const later = nums.filter((x) => x > n);
      const after = later.length ? `, but row ${Math.min(...later)} comes after it` : '';
      throw new Error(
        `${w.file}: "# ${name}" is empty or missing${after}. Fill it in, or take out all of row ${n}'s slots` +
          (later.length ? ' and number the rows after it down by one.' : '.'),
      );
    }
    out.push(read(n));
  }
  return out;
}

/** One entry of a repeated group (see entries): its words by slot name, each read with the same checks as slot(). */
export interface Entry {
  line: number;
  text(field: string): string;
  maybe(field: string): string;
  list(field: string): string[];
}

/** Repeated groups of slots, read in file order with no numbers: each entry starts at its `first` slot (e.g.
 *  "Journal entry: date") and holds the `fields` slots that follow, up to the next `first`. Copying a whole entry
 *  adds one; moving it moves it on the page. A field before the first entry, or twice in one entry, throws. */
export function entries(w: WordsFile, first: string, fields: string[]): Entry[] {
  const fk = keyOf(first);
  const fieldKeys = new Set(fields.map(keyOf));
  const found: { line: number; slots: Map<string, WordsSlot> }[] = [];
  for (const s of w.order) {
    if (s.key === fk) {
      found.push({ line: s.line, slots: new Map([[fk, s]]) });
    } else if (fieldKeys.has(s.key)) {
      const cur = found[found.length - 1];
      if (!cur) {
        throw new Error(`${w.file}, line ${s.line}: "# ${s.name}" comes before the first "# ${first}". Each entry starts with its "# ${first}".`);
      }
      if (cur.slots.has(s.key)) {
        throw new Error(
          `${w.file}, line ${s.line}: a second "# ${s.name}" in the entry that starts on line ${cur.line}. Did an entry lose its "# ${first}" line?`,
        );
      }
      cur.slots.set(s.key, s);
    }
  }
  if (!found.length) throw new Error(`${w.file} has no "# ${first}" slot.`);
  return found.map((e) => {
    const where = `${w.file}, the entry that starts on line ${e.line}`;
    const may = (f: string) => e.slots.get(keyOf(f))?.text ?? '';
    const text = (f: string) => {
      const v = may(f);
      if (!v) throw new Error(`${where} has no "# ${f}" slot, or it is empty.`);
      return v;
    };
    return { line: e.line, text, maybe: may, list: (f: string) => items(text(f), `${where}, "# ${f}"`) };
  });
}

export interface WordsTable {
  head: string[];
  rows: string[][];
}

/** A slot written as a table: one row per line, cells split by "|", the first row the column names. A leading "- ",
 *  outer pipes and a Markdown divider row (|---|---|) are allowed and ignored. Every row needs as many cells as the
 *  first. */
export function table(w: WordsFile, key: string): WordsTable {
  const lines = slot(w, key)
    .split('\n')
    .map((l) => l.trim().replace(/^- /, '').replace(/^\||\|$/g, '').trim())
    .filter((l) => l && !/^[\s|:-]+$/.test(l));
  const [head, ...rows] = lines.map((l) => l.split('|').map((c) => c.trim()));
  rows.forEach((r, i) => {
    if (r.length !== head.length) {
      throw new Error(`${w.file}, "# ${key}": row ${i + 1} has ${r.length} cells, the first row has ${head.length}.`);
    }
  });
  return { head, rows };
}

// Markdown to HTML. Raw HTML in the words is not passed through.
const toHtml = (md: string) => String(remark().use(remarkRehype).use(rehypeStringify).processSync(md));

// A list whose every item starts with a bold term ("- **Then:** A little history") becomes terms and their meanings.
const LI = '<li><strong>(?:(?!</?li>)[\\s\\S])*?</strong>(?:(?!</?li>)[\\s\\S])*</li>\\n';
const termList = (h: string) =>
  h.replace(new RegExp(`<ul>\\n((?:${LI})+)</ul>`, 'g'), (_, items: string) =>
    '<dl>' +
    items.replace(/<li><strong>([\s\S]*?):?<\/strong>\s*([\s\S]*?)<\/li>\n/g, (_m, t: string, d: string) => `<dt>${t}</dt><dd>${d}</dd>`) +
    '</dl>',
  );

/** Markdown to HTML. A heading written "## Words {#id}" gets that id. A list whose every item starts with a bold term
 *  shows as terms and their meanings. */
export function html(md: string): string {
  return termList(toHtml(md)).replace(/<(h[2-4])>(.*?)\s*\{#([a-z0-9-]+)\}<\/\1>/g, '<$1 id="$3">$2</$1>');
}

/** Rendered HTML cut into pieces at a line that holds only a {marker}, e.g. "{stages}", so the page can put something
 *  of its own there. Returns the HTML before and after each marker. */
export const splitAt = (h: string, marker: string): string[] => h.split(new RegExp(`<p>\\{${marker}\\}</p>\\n?`));

/** Markdown for one line (a link or bold inside a sentence) with no wrapping paragraph. */
export const inline = (md: string): string => toHtml(md).trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1');

// ---- inline Markdown as a tree, for React (src/components/site/project/Rich.tsx) ---------------------------------
/** Inline Markdown, ready to become React elements: text, **bold**, *italic*, [links](https://...) and `code`. */
export type InlineNode = string | { tag: 'strong' | 'em' | 'code' | 'a' | 'br'; href?: string; title?: string; kids: InlineNode[] };

// the few hast shapes read here (remark-rehype's output)
type HastNode =
  | { type: 'text'; value: string }
  | { type: 'element'; tagName: string; properties?: Record<string, unknown>; children: HastNode[] }
  | { type: 'root' | 'comment' | 'doctype' | 'raw'; children?: HastNode[]; value?: string };

const mdTree = remark().use(remarkRehype);
const INLINE_TAGS = new Set(['strong', 'em', 'code', 'a', 'br']);
const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;
const inlineCache = new Map<string, InlineNode[] | null>();

function toInline(nodes: HastNode[]): InlineNode[] | null {
  const out: InlineNode[] = [];
  for (const n of nodes) {
    if (n.type === 'text') out.push(n.value);
    else if (n.type === 'element' && INLINE_TAGS.has(n.tagName)) {
      const kids = toInline(n.children);
      if (!kids) return null;
      const href = typeof n.properties?.href === 'string' ? n.properties.href : undefined;
      if (n.tagName === 'a' && !(href && SAFE_HREF.test(href))) {
        out.push(...kids); // a link to somewhere odd (javascript: and the like) shows as its words
        continue;
      }
      const title = typeof n.properties?.title === 'string' ? n.properties.title : undefined;
      out.push({ tag: n.tagName as Exclude<InlineNode, string>['tag'], href, title, kids });
    } else return null; // an image or anything else: show the words as typed
  }
  return out;
}

/** One line of words as inline Markdown, or null when it isn't a plain sentence (it reads as a list, a heading or a
 *  block of code, or holds an image): the caller then shows it exactly as typed. Raw HTML is dropped. */
export function inlineMarkdown(md: string): InlineNode[] | null {
  const hit = inlineCache.get(md);
  if (hit !== undefined) return hit;
  const root = mdTree.runSync(mdTree.parse(md)) as unknown as { children: HastNode[] };
  const blocks = root.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
  const p = blocks[0];
  const value = blocks.length === 1 && p.type === 'element' && p.tagName === 'p' ? toInline(p.children) : null;
  if (inlineCache.size > 2000) inlineCache.clear();
  inlineCache.set(md, value);
  return value;
}

// ---- the check before launch ----------------------------------------------------------------------------------------
/** Every words file (README.md aside), as names for words(): 'about', 'topics/making', ... `root` is the words folder
 *  (the editor's tests point it at a copy). */
export function wordsFiles(root: string = WORDS_ROOT): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') && e.name !== 'README.md') out.push(path.relative(root, p).replace(/\\/g, '/').replace(/\.md$/, ''));
    }
  };
  walk(root);
  return out.sort();
}

/** Every words file and whether Ben has been through it (for the check before launch). */
export function passList(): { file: string; benPass: boolean }[] {
  return wordsFiles().map((name) => ({ file: `words/${name}.md`, benPass: words(name).benPass }));
}
