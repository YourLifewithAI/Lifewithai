// npm run words:check: reads every file in /words and lists what looks wrong, without changing anything. It is not
// part of the build: a problem it finds is one the preview would show as an error, or words a reader would see wrong.
//
//   - a slot the site doesn't read (often a stray "# " line inside a slot, which also cuts the words under it off
//     the slot above), or one it reads that is missing
//   - a slot name used twice, where the site reads it once
//   - a {word} in curly brackets the site doesn't fill in (a typo like {N} for {n} would show as typed)
//   - an empty slot that needs words, a list with no "- " items, a table with a short row
//   - anything that stops a page's words loading (the same errors the preview shows)
// Last, it lists the files still on "ben_pass: no".
//
// npm run words:snapshot (this file with --snapshot) writes words/.slots.json: for each file, the slot names the site
// reads, the {words} each one holds (the site fills in every one of them, and any its note in brackets names), and
// the names that may repeat (journal entries). Numbered slots are kept
// as one name with {n} ("Can do {n}: he can"). Run it only after the code changes which slots it reads: the check
// takes the snapshot as the truth.
import fs from 'node:fs';
import path from 'node:path';
import { WORDS_ROOT, items, keyOf, parseWords, table, wordsFiles, type WordsFile } from './words';

const SNAPSHOT = path.join(WORDS_ROOT, '.slots.json');

interface FileSnap {
  repeat: string[];
  slots: Record<string, string[]>;
}
type Snapshot = Record<string, FileSnap>;

// a numbered slot's family name: "Can do 3: he can" -> "Can do {n}: he can", "Every size: group 2" -> "... group {n}"
const family = (name: string) => name.replace(/ \d+(?=:|$)/, ' {n}');

// the {words} in a slot that the site fills in. Quotes ({{Who: words}}) and heading link names ({#name}) aren't.
const tokensOf = (text: string) =>
  [...new Set([...text.replace(/\{\{[\s\S]*?\}\}/g, '').matchAll(/\{([a-zA-Z][\w ]*)\}/g)].map((m) => `{${m[1]}}`))].sort();

const mayBeEmpty = (hint: string) => /may be (left )?empty|may be left|can be left/i.test(hint);

function readAll() {
  const files: { name: string; w: WordsFile | null; error?: string }[] = [];
  for (const name of wordsFiles()) {
    const file = `words/${name}.md`;
    try {
      files.push({ name, w: parseWords(file, fs.readFileSync(path.join(WORDS_ROOT, `${name}.md`), 'utf8')) });
    } catch (e) {
      files.push({ name, w: null, error: `${file}: the lines between the two "---" at the top can't be read (${(e as Error).message.split('\n')[0]}).` });
    }
  }
  return files;
}

function snapshotOf(w: WordsFile): FileSnap {
  const slots: Record<string, string[]> = {};
  const seen = new Map<string, string>(); // family key -> family name as first written
  for (const s of w.order) {
    const fam = family(s.name);
    const k = keyOf(fam);
    if (!seen.has(k)) seen.set(k, fam);
    const name = seen.get(k)!;
    slots[name] = [...new Set([...(slots[name] ?? []), ...tokensOf(s.text)])].sort();
  }
  const repeat = [...w.repeated].map((k) => w.order.find((s) => s.key === k)!.name);
  return { repeat, slots };
}

// every loader the pages use, so a problem the preview would show turns up here too
async function loadPages(): Promise<string[]> {
  const errors: string[] = [];
  const run = async (what: string, f: () => Promise<unknown>) => {
    try {
      await f();
    } catch (e) {
      errors.push(`${what}: ${(e as Error).message}`);
    }
  };
  await run('The site’s words (site.md)', async () => {
    const site = await import('./site');
    site.stages();
    void site.SITE.name;
  });
  await run('The topics (topics/)', async () => (await import('./topic-words')).topics());
  await run('The pieces (pieces/)', async () => (await import('./pieces')).pieces());
  await run('Asher’s page (projects/asher.md, projects/asher-drawing.md)', async () => {
    const { asherPage } = await import('../content/asher');
    const { loadProject } = await import('./project-model');
    const model = (await import('../content/asher.model.json')).default;
    loadProject(model as unknown as Parameters<typeof loadProject>[0], asherPage());
  });
  return errors;
}

function writeSnapshot(snap: Snapshot) {
  const out = ['{'];
  const files = Object.keys(snap);
  files.forEach((f, i) => {
    out.push(`  ${JSON.stringify(f)}: {`, `    "repeat": ${JSON.stringify(snap[f].repeat)},`, '    "slots": {');
    const names = Object.keys(snap[f].slots);
    names.forEach((n, j) => out.push(`      ${JSON.stringify(n)}: ${JSON.stringify(snap[f].slots[n])}${j < names.length - 1 ? ',' : ''}`));
    out.push('    }', `  }${i < files.length - 1 ? ',' : ''}`);
  });
  out.push('}');
  fs.writeFileSync(SNAPSHOT, out.join('\n') + '\n');
}

function check(files: ReturnType<typeof readAll>, snap: Snapshot) {
  const problems: string[] = [];
  const notes: string[] = [];
  for (const f of files) {
    if (!f.w) {
      problems.push(f.error!);
      continue;
    }
    const w = f.w;
    const want = snap[f.name];
    if (!want) {
      notes.push(`${w.file} is new to the check. If the site reads it, the studio runs "npm run words:snapshot".`);
    }
    const expected = new Map(Object.entries(want?.slots ?? {}).map(([n, t]) => [keyOf(n), { name: n, tokens: t }]));
    const repeatOk = new Set((want?.repeat ?? []).map(keyOf));
    const present = new Set<string>();
    for (const s of w.order) {
      const where = `${w.file}, line ${s.line}, "# ${s.name}"`;
      const fk = keyOf(family(s.name));
      present.add(fk);
      const exp = expected.get(fk);
      if (want && !exp) {
        problems.push(
          `${where}: the site doesn't read a slot with this name. If it's a line of your words that starts with "# ", ` +
            'take out the "# " (until then, everything under it is missing from the slot above). If you renamed a slot, put its old name back.',
        );
        continue;
      }
      // {words} the site won't fill in: known are those in the snapshot and those the slot's note in brackets names
      const known = [...new Set([...(exp?.tokens ?? []), ...tokensOf(s.hint)])].sort();
      const unknown = tokensOf(s.text).filter((t) => !known.includes(t));
      if (want && unknown.length) {
        const fills = known.length ? `The site fills in ${known.join(', ')} here.` : 'The site fills in nothing here.';
        problems.push(`${where}: ${unknown.join(', ')} ${unknown.length > 1 ? 'are' : 'is'} not filled in by the site and would show as typed. ${fills}`);
      }
      if (s.text) {
        const gone = (exp?.tokens ?? []).filter((t) => !s.text.includes(t));
        if (gone.length) notes.push(`${where}: ${gone.join(', ')} ${gone.length > 1 ? 'are' : 'is'} gone, so the site has nowhere to put that value.`);
      }
      // empty slots, lists and tables
      if (!s.text) {
        if (!mayBeEmpty(s.hint)) problems.push(`${where} is empty. The page needs words here.`);
        continue;
      }
      if (/^\(a list\b/i.test(s.hint)) {
        try {
          items(s.text, where);
        } catch (e) {
          problems.push((e as Error).message);
        }
      }
      if (/^\(a table\b/i.test(s.hint) && !w.repeated.has(s.key)) {
        try {
          table(w, s.name);
        } catch (e) {
          problems.push((e as Error).message);
        }
      }
    }
    // a name used twice (the snapshot says which names may repeat)
    for (const k of w.repeated) {
      if (!want || repeatOk.has(k)) continue;
      const same = w.order.filter((s) => s.key === k);
      problems.push(`${w.file}: "# ${same[0].name}" is used ${same.length} times (lines ${same.map((s) => s.line).join(', ')}). Keep one.`);
    }
    // slots the site reads that aren't there
    for (const [k, e] of expected) {
      if (!present.has(k)) problems.push(`${w.file} has no "# ${e.name}" slot. The site reads it: put it back.`);
    }
  }
  for (const name of Object.keys(snap)) {
    if (!files.some((f) => f.name === name)) problems.push(`words/${name}.md is missing. The site reads it.`);
  }
  return { problems, notes };
}

async function main() {
  const files = readAll();
  if (process.argv.includes('--snapshot')) {
    const broken = [...files.filter((f) => !f.w).map((f) => f.error!), ...(await loadPages())];
    if (broken.length) {
      console.log('Not written: the words don’t load yet. Fix these first, then run it again.\n');
      broken.forEach((p) => console.log(`- ${p}`));
      process.exit(1);
    }
    const snap: Snapshot = {};
    for (const f of files) snap[f.name] = snapshotOf(f.w!);
    writeSnapshot(snap);
    console.log(`Wrote ${path.relative(process.cwd(), SNAPSHOT).replace(/\\/g, '/')}: the slot names of ${files.length} files.`);
    return;
  }

  let snap: Snapshot = {};
  try {
    snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')) as Snapshot;
  } catch {
    console.log('words/.slots.json is missing or can’t be read, so slot names aren’t checked. "npm run words:snapshot" makes it.\n');
  }
  const { problems, notes } = check(files, snap);
  problems.push(...(await loadPages()).filter((p) => !problems.some((q) => p.endsWith(q))));

  console.log(`Words check: ${files.length} files read.\n`);
  if (problems.length) {
    console.log(`Problems (${problems.length}): the preview shows an error, or a reader sees the words wrong.`);
    problems.forEach((p) => console.log(`- ${p}`));
    console.log('');
  } else {
    console.log('No problems found.\n');
  }
  if (notes.length) {
    console.log('Worth a look:');
    notes.forEach((p) => console.log(`- ${p}`));
    console.log('');
  }
  const pending = files.filter((f) => f.w && !f.w.benPass).map((f) => f.w!.file);
  if (pending.length) {
    console.log(`Still on "ben_pass: no" (${pending.length} of ${files.length}):`);
    pending.forEach((p) => console.log(`- ${p}`));
  } else {
    console.log('Every file is on "ben_pass: yes".');
  }
  if (problems.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
