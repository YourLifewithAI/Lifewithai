// Tests for the words editor's server half (src/lib/words-edit.ts). Every test that writes runs on a fresh copy of a
// small, made-up words folder (src/lib/__fixtures__/words) in a temporary folder, so the real words are never touched
// and these tests don't change when Ben's words do. One test reads the live words, only to check that every file reads.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, beforeEach, test } from 'node:test';
import { slotPieces, rebuild, type IndexFile, type Piece } from '../components/words-editor/pieces';
import { WordsEditError, applyEdit, editorOn, readLog, setPass, wordsIndex } from './words-edit';
import { WORDS_ROOT, html, parseWords, table, wordsFiles } from './words';

const FIXTURES = path.join(process.cwd(), 'src', 'lib', '__fixtures__', 'words');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'words-edit-'));
const root = path.join(tmp, 'words');
const read = (name: string) => fs.readFileSync(path.join(root, `${name}.md`), 'utf8');
// a fixture as the tests use it: with "\n" line endings, however git checked it out
const fixture = (name: string) => fs.readFileSync(path.join(FIXTURES, `${name}.md`), 'utf8').replace(/\r\n/g, '\n');
const logFile = path.join(tmp, '.words-edits.jsonl');

beforeEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
  for (const name of wordsFiles(FIXTURES)) {
    const to = path.join(root, `${name}.md`);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, fixture(name));
  }
});
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const fileOf = (name: string): IndexFile => wordsIndex(root).find((f) => f.name === name)!;
const slotOf = (name: string, slot: string) => fileOf(name).slots.find((s) => s.name === slot)!;
const pieceOf = (name: string, slot: string, pick: (p: Piece) => boolean) => {
  const p = slotPieces(name, slotOf(name, slot)).find(pick);
  assert.ok(p, `a piece of "${slot}" in ${name}`);
  return p!;
};
// one piece edited the way the page does it: rebuild the slot, send it with the slot's words as they were
function editPiece(name: string, slot: string, pick: (p: Piece) => boolean, words: string) {
  const s = slotOf(name, slot);
  const p = pieceOf(name, slot, pick);
  return applyEdit({ name, i: s.i, before: s.text, after: rebuild(s.text, p, words) }, root);
}
const refused = (status: number, f: () => unknown) =>
  assert.throws(f, (e: unknown) => e instanceof WordsEditError && e.status === status && e.message.length > 10);
// the refusal's message
function messageOf(f: () => unknown): string {
  try {
    f();
  } catch (e) {
    assert.ok(e instanceof WordsEditError, String(e));
    return e.message;
  }
  assert.fail('no refusal');
}

test('every live words file reads, and the index lists its slots the way parseWords reads them', () => {
  const files = wordsIndex();
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.equal(f.error, undefined, f.file);
    const w = parseWords(f.file, fs.readFileSync(path.join(WORDS_ROOT, `${f.name}.md`), 'utf8'));
    assert.equal(f.benPass, w.benPass, f.file);
    assert.deepEqual(
      f.slots.map((s) => [s.i, s.name, s.hint, s.line, s.text]),
      w.order.map((s, i) => [i, s.name, s.hint, s.line, s.text]),
      f.file,
    );
  }
});

test('the index lists every file with its slots in file order', () => {
  const files = wordsIndex(root);
  assert.deepEqual(
    files.map((f) => f.name),
    ['about', 'home', 'not-found', 'privacy', 'projects/rover', 'projects/rover-drawing', 'site', 'topics/building'],
  );
  const rover = files.find((f) => f.name === 'projects/rover')!;
  assert.equal(rover.file, 'words/projects/rover.md');
  assert.equal(rover.benPass, false);
  assert.equal(files.find((f) => f.name === 'privacy')!.benPass, true);
  const parsed = parseWords('x', read('projects/rover'));
  assert.equal(rover.slots.length, parsed.order.length);
  rover.slots.forEach((s, i) => {
    assert.equal(s.i, i);
    assert.equal(s.text, parsed.order[i].text);
  });
  assert.deepEqual(
    { name: rover.slots[1].name, hint: rover.slots[1].hint, line: rover.slots[1].line },
    { name: 'Hook', hint: '(one line under the title)', line: 9 },
  );
  // repeated names (journal entries) get their own place each
  assert.equal(rover.slots.filter((s) => s.name === 'Journal entry: title').length, 2);
});

test('refuses an unknown file and any path trick', () => {
  for (const name of ['nope', '../package', 'words/about', 'about.md', '/about', 'topics/../about', '..\\about', 'README', '', null, 7]) {
    refused(400, () => applyEdit({ name, i: 0, before: 'About', after: 'x' }, root));
  }
  refused(400, () => setPass({ name: '../package', value: true }, root));
  assert.equal(read('about'), fixture('about'));
});

test('refuses words that changed since the page loaded, empty words and a "# " line', () => {
  const s = slotOf('about', 'Title');
  refused(409, () => applyEdit({ name: 'about', i: s.i, before: 'Not what it says', after: 'New' }, root));
  refused(409, () => applyEdit({ name: 'about', i: 999, before: 'About', after: 'New' }, root));
  refused(400, () => applyEdit({ name: 'about', i: s.i, before: s.text, after: '  \n ' }, root));
  refused(400, () => applyEdit({ name: 'about', i: s.i, before: s.text, after: 'Fine\n# A new slot' }, root));
  refused(400, () => applyEdit({ name: 'about', i: -1, before: s.text, after: 'x' }, root));
  refused(400, () => applyEdit({ name: 'about', i: s.i, before: s.text, after: 5 }, root));
  assert.equal(read('about'), fixture('about'));
  assert.equal(fs.existsSync(logFile), false);
});

test('a paragraph inside a slot of several changes, and nothing else in the file does', () => {
  const was = read('projects/rover');
  const old = 'A small computer drives him. He speaks in a voice called Tom.';
  const done = editPiece('projects/rover', 'Intro', (p) => p.kind === 'block' && p.source === old, 'The computer drives him.\nHe speaks as Tom.');
  assert.equal(done.changed, true);
  assert.equal(read('projects/rover'), was.replace(old, 'The computer drives him.\nHe speaks as Tom.'));
  const intro = slotOf('projects/rover', 'Intro').text.split('\n\n');
  assert.equal(intro.length, 3);
  assert.equal(intro[2], 'The computer drives him.\nHe speaks as Tom.');
  assert.equal(done.slot.text, slotOf('projects/rover', 'Intro').text);
  assert.equal(fs.readdirSync(path.join(root, 'projects')).filter((f) => f.endsWith('.tmp')).length, 0);
});

test('a list item changes and keeps its bullet; a term list still shows as terms', () => {
  editPiece('about', 'Page', (p) => p.kind === 'item' && p.source.startsWith('**Now:**'), '**Now:** How most people **really** do it.');
  const page = slotOf('about', 'Page').text;
  assert.match(page, /\n- \*\*Now:\*\* How most people \*\*really\*\* do it\.\n- \*\*Next:\*\*/);
  assert.match(html(page), /<dt>Now<\/dt><dd>How most people <strong>really<\/strong> do it\.<\/dd>/);
});

test('a table cell changes and the table keeps its shape', () => {
  const w = () => parseWords('x', read('projects/rover'));
  const before = table(w(), 'What runs where: at a glance');
  editPiece('projects/rover', 'What runs where: at a glance', (p) => p.kind === 'cell' && p.source === 'The webcam, read by the board', 'The small webcam, read by the board');
  const now = table(w(), 'What runs where: at a glance');
  assert.equal(now.rows.length, before.rows.length);
  assert.deepEqual(now.rows[0], ['Camera', 'The small webcam, read by the board', 'Yes', 'No']);
  assert.deepEqual(now.rows.slice(1), before.rows.slice(1));
  assert.match(read('projects/rover'), /\nCamera \| The small webcam, read by the board \| Yes \| No\n/);
});

test('a heading changes and keeps its "## " and its {#id}', () => {
  editPiece('privacy', 'Page', (p) => p.kind === 'heading' && p.source === 'The sign-up form.', 'What the sign-up form keeps.');
  assert.match(read('privacy'), /\n## What the sign-up form keeps\. \{#signup-data\}\n/);
  assert.match(html(slotOf('privacy', 'Page').text), /<h2 id="signup-data">What the sign-up form keeps\.<\/h2>/);
});

test('the last slot in a file ends with one line ending; a slot before a heading keeps one blank line', () => {
  const s = slotOf('about', 'Page');
  applyEdit({ name: 'about', i: s.i, before: s.text, after: '## Who {#who}\n\nShort now.\n\n' }, root);
  assert.ok(read('about').endsWith(' there)\n## Who {#who}\n\nShort now.\n'));
  const t = slotOf('about', 'Title');
  applyEdit({ name: 'about', i: t.i, before: t.text, after: 'About us' }, root);
  assert.match(read('about'), /^---\nben_pass: no\n---\n# Title\nAbout us\n\n# Description/);
});

test('a file with Windows line endings keeps them', () => {
  const crlf = fixture('not-found').replace(/\n/g, '\r\n');
  fs.writeFileSync(path.join(root, 'not-found.md'), crlf);
  const s = fileOf('not-found').slots[0];
  assert.equal(s.name, 'Title');
  applyEdit({ name: 'not-found', i: s.i, before: s.text, after: 'One line\nand another' }, root);
  const now = read('not-found');
  assert.equal(/[^\r]\n/.test(now), false, 'every line ends \\r\\n');
  assert.ok(now.includes('# Title\r\nOne line\r\nand another\r\n\r\n# Text\r\n'));
  assert.equal(fileOf('not-found').slots[0].text, 'One line\nand another');
  // the rest of the file is byte for byte the same
  assert.equal(now, crlf.replace(s.text, 'One line\r\nand another'));
  // the last slot (this file had no line ending at its end): it gets one, the file's own
  const t = fileOf('not-found').slots[1];
  applyEdit({ name: 'not-found', i: t.i, before: t.text, after: 'Gone.' }, root);
  assert.ok(read('not-found').endsWith('and another\r\n\r\n# Text\r\nGone.\r\n'));
});

test('a file that isn\'t UTF-8 is refused and left exactly as it was; UTF-8 beyond plain letters is fine', () => {
  // "Café" saved the old Windows way, with one byte for the "é": read as UTF-8 and written back, it would be spoiled
  const latin1 = Buffer.from('# Title\nCafé\n\n# Text\nHello\n', 'latin1');
  const full = path.join(root, 'not-found.md');
  fs.writeFileSync(full, latin1);
  const s = fileOf('not-found').slots[1];
  refused(422, () => applyEdit({ name: 'not-found', i: s.i, before: s.text, after: 'Hi' }, root));
  refused(422, () => setPass({ name: 'not-found', value: true }, root));
  assert.match(messageOf(() => applyEdit({ name: 'not-found', i: s.i, before: s.text, after: 'Hi' }, root)), /words\/not-found\.md isn't saved as UTF-8/);
  assert.ok(fs.readFileSync(full).equals(latin1));
  assert.equal(fs.existsSync(logFile), false);

  fs.writeFileSync(full, '# Title\nCafé ☕\n\n# Text\nHello\n');
  const t = fileOf('not-found').slots[1];
  applyEdit({ name: 'not-found', i: t.i, before: t.text, after: 'Ça va' }, root);
  assert.equal(read('not-found'), '# Title\nCafé ☕\n\n# Text\nÇa va\n');
});

test('a change that reads back wrong is put back, and says so plainly when putting it back fails too', (t) => {
  const full = path.join(root, 'about.md');
  const was = fs.readFileSync(full);
  const s = slotOf('about', 'Title');
  const realRead = fs.readFileSync;
  const realRename = fs.renameSync;
  // the file as read back after the save comes back wrong
  t.mock.method(fs, 'readFileSync', ((p: fs.PathOrFileDescriptor, o?: unknown) =>
    p === full && o === 'utf8' ? '# Title\nSomething else\n' : realRead(p, o as never)) as unknown as typeof fs.readFileSync);
  const edit = () => applyEdit({ name: 'about', i: s.i, before: s.text, after: 'About us' }, root);
  assert.match(messageOf(edit), /didn't read the way it was typed\. words\/about\.md was put back as it was\./);
  assert.ok(fs.readFileSync(full).equals(was));

  // the save works; putting the file back doesn't
  let renames = 0;
  t.mock.method(fs, 'renameSync', ((from: fs.PathLike, to: fs.PathLike) => {
    if (renames++ === 0) return realRename(from, to);
    throw Object.assign(new Error(`EISDIR: illegal operation on a directory, rename '${String(from)}' -> '${String(to)}'`), { code: 'EISDIR' });
  }) as typeof fs.renameSync);
  const msg = messageOf(edit);
  assert.match(msg, /Putting words\/about\.md back didn't work either, so it may be half-changed\. Ask Claude to look at words\/about\.md\./);
  assert.doesNotMatch(msg, /was put back/);
  assert.equal(msg.includes(tmp), false, 'no path on this computer in the message');
  assert.equal(msg.includes('EISDIR'), false);
  assert.equal(fs.readdirSync(root).filter((f) => f.endsWith('.tmp')).length, 0);
  assert.equal(readLog(10, root).length, 0);
});

test('edits and undos are logged, newest first', () => {
  const s = slotOf('projects/rover', 'Hook');
  applyEdit({ name: 'projects/rover', i: s.i, before: s.text, after: 'A new hook.' }, root);
  applyEdit({ name: 'projects/rover', i: s.i, before: 'A new hook.', after: s.text, undo: true }, root);
  assert.equal(slotOf('projects/rover', 'Hook').text, s.text);
  assert.equal(read('projects/rover'), fixture('projects/rover'));
  const log = readLog(10, root);
  assert.equal(log.length, 2);
  assert.equal(log[0].action, 'undo');
  assert.equal(log[1].action, 'edit');
  assert.deepEqual(
    { name: log[1].name, file: log[1].file, i: log[1].i, slot: log[1].slot, line: log[1].line, before: log[1].before, after: log[1].after },
    { name: 'projects/rover', file: 'words/projects/rover.md', i: s.i, slot: 'Hook', line: s.line, before: s.text, after: 'A new hook.' },
  );
  assert.ok(!Number.isNaN(Date.parse(log[0].at)));
  // an undo of words that have since changed again is refused
  refused(409, () => applyEdit({ name: 'projects/rover', i: s.i, before: 'A new hook.', after: s.text, undo: true }, root));
});

test('no change, no write and no log', () => {
  const s = slotOf('about', 'Title');
  const mtime = fs.statSync(path.join(root, 'about.md')).mtimeMs;
  assert.equal(applyEdit({ name: 'about', i: s.i, before: s.text, after: `${s.text}\n` }, root).changed, false);
  assert.equal(fs.statSync(path.join(root, 'about.md')).mtimeMs, mtime);
  assert.equal(readLog(10, root).length, 0);
});

test('setPass sets ben_pass, adds the lines at the top when a file has none, and logs it', () => {
  setPass({ name: 'about', value: true }, root);
  assert.match(read('about'), /^---\nben_pass: yes\n---\n# Title\n/);
  assert.equal(fileOf('about').benPass, true);
  setPass({ name: 'about', value: 'no' }, root);
  assert.equal(fileOf('about').benPass, false);
  assert.equal(read('about'), fixture('about'));

  setPass({ name: 'not-found', value: 'yes' }, root);
  assert.equal(read('not-found'), `---\nben_pass: yes\n---\n${fixture('not-found')}`);
  assert.equal(fileOf('not-found').slots[0].line, 4);

  fs.writeFileSync(path.join(root, 'site.md'), '---\r\ntitle: x\r\n---\r\n# Title\r\nHello\r\n');
  setPass({ name: 'site', value: true }, root);
  assert.equal(read('site'), '---\r\ntitle: x\r\nben_pass: yes\r\n---\r\n# Title\r\nHello\r\n');

  refused(400, () => setPass({ name: 'about', value: 'maybe' }, root));
  const log = readLog(10, root);
  assert.equal(log.length, 4);
  assert.deepEqual([log[0].action, log[0].name, log[0].before, log[0].after], ['pass', 'site', 'no', 'yes']);
});

test('setPass keeps a byte-order mark first, reads "---yaml" as the lines between "---", and leaves the words alone', () => {
  const bom = '﻿';
  // a byte-order mark and no lines between "---": they go after the mark, so the first slot still reads
  fs.writeFileSync(path.join(root, 'home.md'), `${bom}# Title\nHello\n\n# Footer\nBye\n`);
  const slots = () => fileOf('home').slots.map((s) => [s.name, s.text]);
  assert.deepEqual(slots(), [['Title', 'Hello'], ['Footer', 'Bye']]);
  setPass({ name: 'home', value: true }, root);
  assert.equal(read('home'), `${bom}---\nben_pass: yes\n---\n# Title\nHello\n\n# Footer\nBye\n`);
  assert.equal(fileOf('home').benPass, true);
  assert.deepEqual(slots(), [['Title', 'Hello'], ['Footer', 'Bye']]);
  setPass({ name: 'home', value: false }, root);
  assert.equal(read('home'), `${bom}---\nben_pass: no\n---\n# Title\nHello\n\n# Footer\nBye\n`);

  // "---yaml" opens them too: ben_pass changes there, with no second block stacked on top
  fs.writeFileSync(path.join(root, 'site.md'), '---yaml\nben_pass: no\n---\n# Name\nX\n');
  setPass({ name: 'site', value: 'yes' }, root);
  assert.equal(read('site'), '---yaml\nben_pass: yes\n---\n# Name\nX\n');
  assert.equal(fileOf('site').benPass, true);

  // written in another language, they're left alone
  const json = '---json\n{ "ben_pass": "no" }\n---\n# Name\nX\n';
  fs.writeFileSync(path.join(root, 'site.md'), json);
  refused(422, () => setPass({ name: 'site', value: true }, root));
  assert.equal(read('site'), json);
  assert.equal(readLog(10, root).length, 3);
});

test('the editor is on only in the preview, with WORDS_EDITOR=1', () => {
  const env = process.env as Record<string, string | undefined>;
  const saved = { node: env.NODE_ENV, flag: env.WORDS_EDITOR };
  try {
    env.WORDS_EDITOR = '1';
    env.NODE_ENV = 'production';
    assert.equal(editorOn(), false);
    env.NODE_ENV = 'test';
    assert.equal(editorOn(), false);
    env.NODE_ENV = 'development';
    assert.equal(editorOn(), true);
    env.WORDS_EDITOR = 'yes';
    assert.equal(editorOn(), false);
    delete env.WORDS_EDITOR;
    assert.equal(editorOn(), false);
  } finally {
    env.NODE_ENV = saved.node;
    if (saved.flag === undefined) delete env.WORDS_EDITOR;
    else env.WORDS_EDITOR = saved.flag;
  }
});
