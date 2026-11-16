// Tests for the words editor's pure helpers (pieces.ts). Read only: nothing is written. The first test runs over the
// live words (every piece of every file must rebuild its slot exactly); the rest use the small, made-up words folder in
// src/lib/__fixtures__/words, so they don't change when Ben's words do.
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { wordsIndex } from '../../lib/words-edit';
import {
  allPieces, changeSnippet, cleanHint, fileLabel, holesOf, isTable, matcher, pageFiles, plainText, rankPieces, rebuild,
  slotPieces, squash, type IndexFile, type Piece,
} from './pieces';

const files = wordsIndex(path.join(process.cwd(), 'src', 'lib', '__fixtures__', 'words'));
const file = (name: string): IndexFile => files.find((f) => f.name === name)!;
const slot = (name: string, s: string) => file(name).slots.find((x) => x.name === s)!;
const pieces = (name: string, s: string) => slotPieces(name, slot(name, s));
const m = matcher(allPieces(files));
const found = (text: string) => m.exact(squash(text)).map((p) => `${p.file} · ${p.slot} · ${p.kind}`);
const names = files.map((f) => f.name);
// the pieces a click on some words on a page offers, as "file · kind"
const offered = (text: string, page: string) => rankPieces(m.exact(squash(text)), pageFiles(page, names), squash(text)).map((p) => `${p.file} · ${p.kind}`);

test('every piece of every words file, rebuilt with its own words, gives back its slot exactly (the live words too)', () => {
  const live = wordsIndex();
  assert.ok(live.length > 0);
  let n = 0;
  for (const f of [...live, ...files]) {
    for (const s of f.slots) {
      for (const p of slotPieces(f.name, s)) {
        n++;
        assert.equal(rebuild(s.text, p, p.source), s.text, `${f.file}, "# ${s.name}", ${p.kind}`);
      }
    }
  }
  assert.ok(n > 0);
});

test('plain text drops the Markdown the page drops', () => {
  assert.equal(plainText('Write to [hello](mailto:x) **now**, *please*.'), 'Write to hello now, please.');
  assert.equal(plainText('## Who {#who}'), 'Who');
  assert.equal(plainText('Ben: {{Ben: That was the best run yet.}}'), 'Ben: That was the best run yet.');
  assert.equal(plainText('- **Then:** A little `history`'), 'Then: A little history');
  assert.equal(plainText('wheel_d and snake_case stay; _this_ goes'), 'wheel_d and snake_case stay; this goes');
  assert.equal(plainText('1 \\* 2 &amp; 3'), '1 * 2 & 3');
  assert.equal(squash(' A b\n\nC '), 'abc');
  // "&shy;" in the words is a soft hyphen on the page, which shows as nothing
  assert.equal(squash(plainText('Construc&shy;tion &#x27;x&#39;')), squash(`Construc${String.fromCharCode(0xad)}tion 'x'`));
  assert.deepEqual(found(`Construc${String.fromCharCode(0xad)}tion`), ['topics/building · Small word under the name · slot']);
});

test('a multi-paragraph slot gives one piece per paragraph and one for the whole slot', () => {
  const ps = pieces('projects/rover', 'Intro');
  assert.deepEqual(ps.map((p) => p.kind), ['block', 'block', 'block', 'slot']);
  assert.equal(ps[2].source, 'A small computer drives him. He speaks in a voice called Tom.');
  assert.equal(ps[2].oneLine, false);
  const s = slot('projects/rover', 'Intro').text;
  const now = rebuild(s, ps[1], 'New middle.');
  assert.deepEqual(now.split('\n\n'), [s.split('\n\n')[0], 'New middle.', s.split('\n\n')[2]]);
  // a one-line slot is one piece, edited on one line
  const hook = pieces('projects/rover', 'Hook');
  assert.equal(hook.length, 1);
  assert.equal(hook[0].kind, 'slot');
  assert.equal(hook[0].oneLine, true);
});

test('list items keep their bullets; a bold term also matches as <dt> and <dd>', () => {
  const ps = pieces('about', 'Page');
  const now = ps.find((p) => p.kind === 'item' && p.source.startsWith('**Now:**'))!;
  assert.equal(now.oneLine, true);
  assert.ok(now.forms.includes(squash('Now' + 'How most people do it today.')));
  const s = slot('about', 'Page').text;
  assert.ok(rebuild(s, now, '**Now:** Changed.').includes('\n- **Now:** Changed.\n- **Next:**'));
  assert.deepEqual(found('NowHow most people do it today.'), ['about · Page · item']);

  // a list with a line that runs on joins it to the item above, and gives it back as typed
  const text = 'Intro line\n\n- one\n  runs on\n- two';
  const s2 = { i: 0, name: 'X', hint: '', line: 1, text };
  const items = slotPieces('x', s2).filter((p) => p.kind === 'item');
  assert.deepEqual(items.map((p) => p.source), ['one\n  runs on', 'two']);
  assert.equal(rebuild(text, items[0], 'one, joined'), 'Intro line\n\n- one, joined\n- two');
  assert.equal(rebuild(text, items[1], 'TWO'), 'Intro line\n\n- one\n  runs on\n- TWO');
});

test('table cells, the way table() reads them', () => {
  const t = slot('projects/rover', 'What runs where: at a glance').text;
  assert.equal(isTable(t), true);
  assert.equal(isTable(slot('projects/rover', 'Intro').text), false);
  const cells = pieces('projects/rover', 'What runs where: at a glance').filter((p) => p.kind === 'cell');
  assert.equal(cells.length, 3 * 4);
  assert.deepEqual(cells.slice(0, 4).map((p) => p.source), ['Job', 'Runs on', 'Card', 'Fan']);
  const cam = cells.find((p) => p.source === 'The webcam, read by the board')!;
  assert.equal(rebuild(t, cam, 'X').split('\n')[1], 'Camera | X | Yes | No');
  // "- ", outer pipes, a divider row and the spaces round a cell stay as typed
  const md = '- | Job |  Runs on |\n|---|---|\n- | Camera |  Pi  |';
  const ps = slotPieces('x', { i: 0, name: 'T', hint: '', line: 1, text: md }).filter((p) => p.kind === 'cell');
  assert.deepEqual(ps.map((p) => p.source), ['Job', 'Runs on', 'Camera', 'Pi']);
  assert.equal(rebuild(md, ps[3], 'The Pi'), '- | Job |  Runs on |\n|---|---|\n- | Camera |  The Pi  |');
  // the whole table, as the page's text runs: cell after cell
  const whole = pieces('projects/rover', 'What runs where: at a glance').find((p) => p.kind === 'slot')!;
  assert.ok(whole.forms.includes(squash(cells.map((p) => p.source).join(''))));
});

test('headings keep their "## " and their {#id}', () => {
  const ps = pieces('privacy', 'Page');
  const h = ps.find((p) => p.kind === 'heading' && p.source === 'Analytics.')!;
  assert.deepEqual(h.loc, { kind: 'heading', block: h.loc.kind === 'heading' ? h.loc.block : -1, prefix: '## ', suffix: ' {#analytics}' });
  assert.ok(rebuild(slot('privacy', 'Page').text, h, 'What we count.').includes('\n\n## What we count. {#analytics}\n\n'));
  // a line holding only a {marker} is the page's own, not words
  assert.equal(ps.some((p) => p.kind !== 'slot' && p.source.includes('{analytics settings button}')), false);
});

test('words with {name} in them match whatever the site fills in', () => {
  assert.deepEqual(holesOf('Level {n} of {total}, {{Ben: a {quote}}} ## X {#id}'), ['{n}', '{total}']);
  assert.deepEqual(found('22 parts'), ['projects/rover · Parts beside the drawing: count · slot']);
  assert.deepEqual(found('12 interviews'), ['home · Topic count: more · slot']);
  assert.deepEqual(found('Chassis. Level 2 of 4, counted from the floor up.'), ['projects/rover · Plate panel: level · slot']);
  assert.deepEqual(found('Partsx'), []);
  // a hole stands for some words, not none
  assert.deepEqual(found('Chassis. Level of 4, counted from the floor up.'), []);
});

test('a hole at the start or end of a few words stands only for figures, so a header holding them doesn\'t match', () => {
  // the parts list's header: its heading and its count in one line
  assert.deepEqual(found('Parts on the robot 22 parts'), []);
  assert.deepEqual(found('Fixed parts'), ['projects/rover · Parts beside the drawing: fixed parts · slot']);
  assert.deepEqual(found('Parts'), []);
  assert.deepEqual(found('Many parts'), []);
  // a click on that header offers nothing, so the page says the words aren't in a words file
  assert.deepEqual(offered('Parts on the robot 22 parts', '/projects/rover'), []);
});

test('the page\'s own files come first; short words from other pages\' files don\'t count', () => {
  assert.deepEqual(pageFiles('/projects/rover', names), ['projects/rover', 'projects/rover-drawing']);
  assert.deepEqual(pageFiles('/', names), ['home']);
  assert.deepEqual(pageFiles('/about/', names), ['about']);
  assert.deepEqual(pageFiles('/topics/building', names), ['topics/building']);
  const hits = m.exact(squash('On this page'));
  assert.equal(hits.length, 2);
  assert.deepEqual(offered('On this page', '/projects/rover'), ['projects/rover · slot']);
  assert.deepEqual(offered('On this page', '/privacy'), ['privacy · slot']);
  // on a page whose own files don't have them, short words from another page's file aren't offered
  assert.deepEqual(offered('On this page', '/about'), []);
  assert.deepEqual(offered('Yes', '/about'), []);
  assert.deepEqual(offered('Yes', '/projects/rover'), ['projects/rover · cell']);
  // longer words are: they're unlikely to be anywhere else
  assert.deepEqual(offered('The robot keeps no recordings.', '/about'), ['projects/rover · slot']);
  // site's words are on every page, short or not
  assert.deepEqual(offered('Made-up site', '/about'), ['site · slot']);
  // within one slot, the smallest piece wins
  const intro = pieces('projects/rover', 'Intro');
  const own = pageFiles('/projects/rover', names);
  assert.deepEqual(rankPieces([intro[3], intro[0]], own, squash(intro[0].source)).map((p: Piece) => p.kind), ['block']);
});

test('names, notes and change lines read plainly', () => {
  assert.equal(fileLabel('projects/asher'), "Asher's page");
  assert.equal(fileLabel('topics/making'), 'Topic: making');
  assert.equal(fileLabel('somewhere/else'), 'words/somewhere/else.md');
  assert.equal(cleanHint('(one line under the title)'), 'one line under the title');
  assert.equal(cleanHint('(a) [b]'), 'a; b');
  assert.deepEqual(changeSnippet('The cat sat on the mat.', 'The dog sat on the mat.'), { before: 'The cat sat on the mat.', after: 'The dog sat on the mat.' });
  const long = 'x'.repeat(100);
  const c = changeSnippet(`${long} old ${long}`, `${long} new ${long}`);
  assert.ok(c.before.startsWith('…') && c.before.includes('old') && c.before.endsWith('…'));
  assert.ok(c.after.includes('new') && c.after.length < 80);
});
