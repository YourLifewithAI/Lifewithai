// Reads the site's words from the plain-text files in /words (see words/README.md).
// Server only: it reads files at build time. Client components get their words as props.
//
// A words file is Markdown. A line that starts with a single "# " names a slot; the text under it, up to the
// next "# " line, is that slot's words. Anything in brackets after the slot name is a hint for the person
// editing and is ignored here. Inside a slot, Markdown works as usual: a blank line starts a new paragraph,
// "- " starts a list item, **bold**, [a link](https://...), "## " a heading.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const ROOT = path.join(process.cwd(), 'words');

export interface WordsFile {
  file: string;
  /** "yes" once Ben has been through the page in his own voice. */
  benPass: boolean;
  slots: Record<string, string>;
}

const keyOf = (name: string) =>
  name
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

const cache = new Map<string, { mtime: number; value: WordsFile }>();

/** Load one words file, e.g. words('about') or words('topics/making'). */
export function words(name: string): WordsFile {
  const file = path.join(ROOT, `${name}.md`);
  const mtime = fs.statSync(file).mtimeMs; // so edits show on the next refresh in the preview
  const hit = cache.get(file);
  if (hit && hit.mtime === mtime) return hit.value;

  const parsed = matter(fs.readFileSync(file, 'utf8'));
  const slots: Record<string, string> = {};
  let key: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (key) slots[key] = buf.join('\n').trim();
  };
  for (const line of parsed.content.replace(/\r\n/g, '\n').split('\n')) {
    const m = /^# (.+)$/.exec(line);
    if (m) {
      flush();
      key = keyOf(m[1]);
      if (key in slots) throw new Error(`words/${name}.md has two slots named "# ${m[1]}" (the words in brackets don't count).`);
      buf = [];
    } else if (key) {
      buf.push(line);
    }
  }
  flush();
  const bp = parsed.data.ben_pass;
  const value: WordsFile = { file: `words/${name}.md`, benPass: bp === true || bp === 'yes', slots };
  cache.set(file, { mtime, value });
  return value;
}

/** A slot's words as plain text (one line or a few). Throws with the file and slot name if it is missing. */
export function slot(w: WordsFile, key: string): string {
  const v = w.slots[keyOf(key)];
  if (v === undefined || v === '') {
    throw new Error(`${w.file} has no "# ${key}" slot, or it is empty.`);
  }
  return v;
}

/** A slot that may be left empty. */
export const maybe = (w: WordsFile, key: string): string => w.slots[keyOf(key)] ?? '';

/** A slot written as a "- " list, as an array of items. */
export function list(w: WordsFile, key: string): string[] {
  return slot(w, key)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

/** A slot's paragraphs (split on blank lines), each as plain text. */
export const paras = (w: WordsFile, key: string): string[] =>
  slot(w, key)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

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

/** Every words file and whether Ben has been through it (for the check before launch). */
export function passList(): { file: string; benPass: boolean }[] {
  const out: { file: string; benPass: boolean }[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') && e.name !== 'README.md') {
        const name = path.relative(ROOT, p).replace(/\\/g, '/').replace(/\.md$/, '');
        out.push({ file: `words/${name}.md`, benPass: words(name).benPass });
      }
    }
  };
  walk(ROOT);
  return out.sort((a, b) => a.file.localeCompare(b.file));
}
