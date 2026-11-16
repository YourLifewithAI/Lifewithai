// The words editor's server half: lists every words file's slots, and saves an edit to one slot back into its file.
// Server only (it reads and writes files), and only ever on in the local preview: editorOn() needs `next dev` and
// WORDS_EDITOR=1 (npm run edit sets both). The API route (src/app/api/words-editor/route.dev.ts) checks editorOn()
// and that the request comes from this computer before calling anything here.
//
// An edit replaces one slot's words: the lines under its "# " heading, up to the next "# " line. Nothing else in the
// file changes, its line endings included. A file that isn't UTF-8 is refused, since writing it back would spoil its
// letters. The new file is read in memory first and must give the same slots with only the edited one changed; then
// it is written whole to a temporary file and renamed over the old one, and read back; if it didn't come back right,
// the old file is put back. Every change is logged, one JSON line each, to .words-edits.jsonl next to the words folder
// (kept out of git), so the page can offer Undo.
import fs from 'node:fs';
import path from 'node:path';
import { WORDS_ROOT, keyOf, parseWords, wordsFiles, type WordsFile } from './words';
import type { IndexFile, IndexSlot, LogEntry } from '@/components/words-editor/pieces';

/** True only in the local preview with the editor asked for: `next dev` with WORDS_EDITOR=1. */
export function editorOn(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.WORDS_EDITOR === '1';
}

/** A refusal or failure with the HTTP status to answer with and a message Ben can read. */
export class WordsEditError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'WordsEditError';
    this.status = status;
  }
}

const HEAD = /^# (.+)$/; // a slot's heading, exactly as parseWords reads it
const strip = (line: string) => line.replace(/\r$/, '');
// a byte-order mark at the very start of a file, which some editors add
const noBom = (line: string) => (line.charCodeAt(0) === 0xfeff ? line.slice(1) : line);
const fileOf = (name: string) => `words/${name}.md`;
const logPath = (root: string) => path.join(path.dirname(root), '.words-edits.jsonl');
// an error's short code (EPERM, ENOENT...), never its message: that names the full path on this computer
const codeOf = (e: unknown) => (e as NodeJS.ErrnoException)?.code ?? 'an error';

/** The editor's own look (words-editor.css), read when the page is made; only called while the editor is on. */
export function editorStyles(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'words-editor', 'words-editor.css'), 'utf8');
  } catch {
    return '';
  }
}

// ---- reading ---------------------------------------------------------------------------------------------------------

/** Every words file with its slots, in file order. `i` is a slot's place in parseWords(...).order. */
export function wordsIndex(root: string = WORDS_ROOT): IndexFile[] {
  return wordsFiles(root).map((name) => {
    const file = fileOf(name);
    try {
      const w = parseWords(file, fs.readFileSync(path.join(root, `${name}.md`), 'utf8'));
      return {
        name,
        file,
        benPass: w.benPass,
        slots: w.order.map((s, i) => ({ i, name: s.name, hint: s.hint, line: s.line, text: s.text })),
      };
    } catch (e) {
      return { name, file, benPass: false, slots: [], error: `${file} can't be read: ${(e as Error).message.split('\n')[0]}` };
    }
  });
}

/** The newest log entries first. */
export function readLog(limit = 50, root: string = WORDS_ROOT): LogEntry[] {
  let text: string;
  try {
    text = fs.readFileSync(logPath(root), 'utf8');
  } catch {
    return [];
  }
  const out: LogEntry[] = [];
  const lines = text.split('\n');
  for (let k = lines.length - 1; k >= 0 && out.length < limit; k--) {
    const l = lines[k].trim();
    if (!l) continue;
    try {
      out.push(JSON.parse(l) as LogEntry);
    } catch {
      // a line cut short: skip it
    }
  }
  return out;
}

// ---- writing ---------------------------------------------------------------------------------------------------------

// the words file's name, checked against the real list: nothing else gets through (no "../", no paths of any kind)
function known(name: unknown, root: string): string {
  if (typeof name !== 'string' || !wordsFiles(root).includes(name)) {
    throw new WordsEditError(400, `There is no words file called "${String(name).slice(0, 80)}". Refresh the page and try again.`);
  }
  return name;
}

function sleep(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Write a whole file by writing a temporary file next to it and renaming it over the old one, so a reader never sees
// half a file. On Windows a rename can fail for a moment while something else has the file open: try again a few times.
function writeAtomic(file: string, data: string | Buffer) {
  const tmp = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}-${Date.now()}.tmp`);
  fs.writeFileSync(tmp, data);
  try {
    for (let n = 0; ; n++) {
      try {
        fs.renameSync(tmp, file);
        return;
      } catch (e) {
        const code = (e as NodeJS.ErrnoException).code;
        if (n >= 5 || !(code === 'EPERM' || code === 'EBUSY' || code === 'EACCES')) throw e;
        sleep(50 * (n + 1));
      }
    }
  } finally {
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { force: true });
  }
}

// A words file's bytes and its text. A file that isn't UTF-8 is refused: its text, written back as UTF-8, would spoil
// every letter that isn't plain ASCII, all through the file.
function readText(full: string, file: string): { original: Buffer; raw: string } {
  let original: Buffer;
  try {
    original = fs.readFileSync(full);
  } catch (e) {
    throw new WordsEditError(500, `${file} couldn't be read (${codeOf(e)}). Nothing was saved. Refresh the page and try again.`);
  }
  const raw = original.toString('utf8');
  if (!Buffer.from(raw, 'utf8').equals(original)) {
    throw new WordsEditError(
      422,
      `${file} isn't saved as UTF-8 text, so the editor can't change it without spoiling some of its letters. Nothing was saved. Ask Claude to look.`,
    );
  }
  return { original, raw };
}

// How a file reads to the site: done or not, and every slot's name, note and words in order. Line numbers are left
// out (new lines at the top move them).
interface Reading {
  benPass: boolean;
  slots: [string, string, string][];
}
const readingOf = (w: WordsFile): Reading => ({ benPass: w.benPass, slots: w.order.map((s) => [s.name, s.hint, s.text]) });
function readsAs(file: string, text: string, want: Reading): WordsFile | null {
  try {
    const w = parseWords(file, text);
    return w.benPass === want.benPass && JSON.stringify(readingOf(w).slots) === JSON.stringify(want.slots) ? w : null;
  } catch {
    return null;
  }
}

// Put a file's old bytes back. False when even that failed.
function putBack(full: string, original: Buffer): boolean {
  try {
    writeAtomic(full, original);
    return true;
  } catch {
    return false;
  }
}

// Save a file's new text, but only if it reads as `want`: checked in memory first (nothing is written if not), then
// read back from the disk once written (the old file is put back if not). `why` starts the message if it fails.
// Returns the file as read back.
function commit(full: string, file: string, original: Buffer, text: string, want: Reading, why: string): WordsFile {
  if (!readsAs(file, text, want)) throw new WordsEditError(500, `${why} Nothing was saved. Ask Claude to look at ${file}.`);
  try {
    writeAtomic(full, text);
  } catch (e) {
    throw new WordsEditError(500, `${file} couldn't be saved (${codeOf(e)}). Nothing changed. Try again, or ask Claude.`);
  }
  let back = '';
  try {
    back = fs.readFileSync(full, 'utf8');
  } catch {
    back = '';
  }
  const again = readsAs(file, back, want);
  if (again) return again;
  if (putBack(full, original)) throw new WordsEditError(500, `${why} ${file} was put back as it was. Ask Claude to look.`);
  throw new WordsEditError(
    500,
    `${why} Putting ${file} back didn't work either, so it may be half-changed. Ask Claude to look at ${file}.`,
  );
}

function log(root: string, entry: LogEntry) {
  try {
    fs.appendFileSync(logPath(root), `${JSON.stringify(entry)}\n`);
  } catch {
    // the change is saved; only the list of changes misses it
  }
}

export interface EditRequest {
  name: unknown;
  i: unknown;
  before: unknown;
  after: unknown;
  /** true when this edit puts back an earlier one (it is logged as "undo") */
  undo?: boolean;
}

/** Replace one slot's words. Refuses (with a status and a plain message) an unknown file, a slot that changed since
 *  the page loaded (409), empty words, and a line starting "# ". Returns the slot as it now reads. */
export function applyEdit(req: EditRequest, root: string = WORDS_ROOT): { changed: boolean; slot: IndexSlot } {
  const name = known(req.name, root);
  const file = fileOf(name);
  const i = req.i;
  if (typeof i !== 'number' || !Number.isInteger(i) || i < 0) throw new WordsEditError(400, 'The edit names no slot. Refresh the page and try again.');
  if (typeof req.before !== 'string' || typeof req.after !== 'string') throw new WordsEditError(400, 'The edit is missing its words. Refresh the page and try again.');
  const before = req.before.replace(/\r\n?/g, '\n');
  const after = req.after.replace(/\r\n?/g, '\n').trim();
  if (!after) throw new WordsEditError(400, 'The new words are empty. Type some words, or press Cancel. To take a spot out completely, ask Claude.');
  if (after.split('\n').some((l) => /^# /.test(l))) {
    throw new WordsEditError(400, 'A line can\'t start with "# " (a hash and a space): in a words file that starts a new slot. Take out the "# ", or ask Claude.');
  }

  const full = path.join(root, `${name}.md`);
  const { original, raw } = readText(full, file);
  const parsed = parseWords(file, raw);
  const slot = parsed.order[i];
  if (!slot) throw new WordsEditError(409, `That spot isn't in ${file} any more (it changed since the page loaded). Refresh the page and try again.`);
  if (slot.text !== before) {
    throw new WordsEditError(409, `These words changed since the page loaded (perhaps in ${file} itself). Refresh the page and try again.`);
  }
  if (slot.text === after) return { changed: false, slot: { i, name: slot.name, hint: slot.hint, line: slot.line, text: slot.text } };

  // the slot's lines: its "# " heading where parseWords says, then everything up to the next "# " line or the end
  const lines = raw.split('\n');
  const h = slot.line - 1;
  const head = h >= 0 && h < lines.length ? HEAD.exec(noBom(strip(lines[h]))) : null;
  if (!head || keyOf(head[1]) !== slot.key) {
    throw new WordsEditError(500, `${file} didn't read the way the editor expected (the "# ${slot.name}" line isn't on line ${slot.line}). Nothing was saved. Ask Claude to look.`);
  }
  let end = h + 1;
  while (end < lines.length && !HEAD.test(strip(lines[end]))) end++;
  // new lines get the file's own line ending
  const cr = raw.includes('\r\n') ? '\r' : '';
  const body = after.split('\n').map((l) => l + cr);
  const next =
    end < lines.length
      ? [...lines.slice(0, h + 1), ...body, cr, ...lines.slice(end)] // one blank line before the next heading
      : [...lines.slice(0, h + 1), ...body, '']; // the last slot: end the file with one line ending
  const text = next.join('\n');

  // the same slots, this one as typed and every other one as it was
  const want = readingOf(parsed);
  want.slots[i] = [slot.name, slot.hint, after];
  const again = commit(full, file, original, text, want, "The change didn't read the way it was typed.");
  const s = again.order[i];
  log(root, { at: new Date().toISOString(), action: req.undo ? 'undo' : 'edit', name, file, i, slot: slot.name, line: slot.line, before: slot.text, after });
  return { changed: true, slot: { i, name: s.name, hint: s.hint, line: s.line, text: s.text } };
}

/** Set "ben_pass: yes" or "no" at the top of a words file (adding the lines between "---" if the file has none).
 *  The file's slots must read exactly as before, or nothing is saved. */
export function setPass(req: { name: unknown; value: unknown }, root: string = WORDS_ROOT): { benPass: boolean } {
  const name = known(req.name, root);
  const file = fileOf(name);
  const v = req.value;
  if (!(typeof v === 'boolean' || v === 'yes' || v === 'no')) throw new WordsEditError(400, 'Done or not done? The request says neither.');
  const value = v === true || v === 'yes';
  const full = path.join(root, `${name}.md`);
  const { original, raw } = readText(full, file);
  const parsed = parseWords(file, raw);
  const was = parsed.benPass;
  if (was === value) return { benPass: value };

  // a byte-order mark stays the very first thing in the file, before the "---"
  const bom = raw.charCodeAt(0) === 0xfeff ? raw[0] : '';
  const body = raw.slice(bom.length);
  const cr = body.includes('\r\n') ? '\r' : '';
  const line = `ben_pass: ${value ? 'yes' : 'no'}${cr}`;
  const lines = body.split('\n');
  // the lines between "---" as parseWords (gray-matter) finds them: a first line of "---", or of "---" and the name of
  // their language ("---yaml"), down to the next line that starts with "---"
  const open = /^---(?!-)(.*)$/.exec(strip(lines[0]));
  let next: string[];
  if (open) {
    const lang = open[1].trim().toLowerCase();
    if (lang && lang !== 'yaml' && lang !== 'yml') {
      throw new WordsEditError(
        422,
        `The lines between the two "---" at the top of ${file} aren't written the usual way, so the editor leaves them alone. Nothing was saved. Ask Claude to set ben_pass.`,
      );
    }
    const close = lines.findIndex((l, k) => k > 0 && strip(l).startsWith('---'));
    if (close < 0) throw new WordsEditError(500, `The lines between the two "---" at the top of ${file} can't be read. Nothing was saved. Ask Claude to look.`);
    const at = lines.findIndex((l, k) => k > 0 && k < close && /^ben_pass\s*:/.test(l));
    next = [...lines];
    if (at >= 0) next[at] = line;
    else next.splice(close, 0, line);
  } else {
    next = [`---${cr}`, line, `---${cr}`, ...lines];
  }
  const want = { ...readingOf(parsed), benPass: value };
  commit(full, file, original, bom + next.join('\n'), want, `${file} didn't read as ${value ? 'done' : 'not done'} with its words as they were.`);
  log(root, { at: new Date().toISOString(), action: 'pass', name, file, before: was ? 'yes' : 'no', after: value ? 'yes' : 'no' });
  return { benPass: value };
}
