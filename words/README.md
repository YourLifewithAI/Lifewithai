# The site's words

Every word a reader sees on the site lives in this folder, one file per page. Change anything you like: the
code only reads these files. Nothing here goes live until the site is pushed.

## Editing on the page

The easy way is to change the words right on the page, in the preview.

1. Start the preview with the editor on: `npm run edit` (for a set port, `npm run edit -- -p 3011`). Open the
   address it prints.
2. Click "Edit text" at the bottom right. Words you can change light up as the pointer passes over them.
3. Click the words, type, and press Save. Enter saves a one-line spot, Ctrl+Enter a longer one, and Esc or
   Cancel leaves the words as they were. The page shows the new words at once.
4. The panel above the button has a "Done with this page" box for each of the page's files. Tick it once the
   page sounds like you: it sets `ben_pass: yes` (see "Your pass" below).
5. "Your changes" in the panel lists your latest changes. The newest change in each spot has Undo.

The editor saves into these same files, on this laptop only. Nothing goes live until the site is pushed.
Words that don't light up come from the build's data or the code: ask Claude about those. While editing, a
click on a link edits its words instead of following it, so click "Stop editing" to move around the site.
Editing the files directly, as below, still works. The list of changes is kept in `.words-edits.jsonl`, next
to this folder, and stays on the laptop.

The editor is never part of the live site: a production build leaves out its button, its code and its save
route. Start it only with `npm run edit`, which keeps the preview on this computer. Never put `WORDS_EDITOR` in
a `.env` file: plain `next dev` listens to the whole home network, and the editor would let other devices change
the files.

To take the editor to another site that reads its words with `src/lib/words.ts`: copy `src/lib/words-edit.ts`,
`src/app/api/words-editor/`, `src/components/words-editor/` and `scripts/edit-words.mjs`. Then add the `edit`
line to `package.json`, the `WordsEditorSlot` lines to `src/app/layout.tsx`, and the `config(phase)` lines
(which turn on the `.dev.ts` route only in the editor's preview) to `next.config.ts`.

## How a file works

A line that starts with `# ` (one hash and a space) names a slot. The words under it, down to the next `# `
line, are what the page shows in that spot. Words in brackets after a slot name are a note for you.

```
# Spotlight heading
Innovator spotlight
```

- Change the words under a slot as much as you like. Leave the `# ` line itself as it is: the code looks for
  that name. Two slots can't share a name (the words in brackets don't count). A line of your own that starts
  with `# ` makes a new slot, so the check below flags it.
- A blank line starts a new paragraph. How much more Markdown works depends on the spot:
  - The About and Privacy pages and "What runs where" on a project page take full Markdown: lists, `**bold**`,
    `*italic*`, `[words](https://link)`, and `## ` and `### ` for headings. `{#name}` after a heading is its
    link name: keep it, or the links to that heading stop working.
  - The sentences and list items on a project page, the not-found page and the line under the sign-up form
    take Markdown inside a sentence: `**bold**`, `*italic*`, `[words](https://link)` and `` `code` ``.
  - Everywhere else (headings, labels, buttons, table cells, the front page, the topic pages, the cards and
    the words read out to screen readers) shows the words exactly as typed, so `**` shows as two stars.
- A slot marked "(a list)" wants one item per line, each starting with `- `. A long item can run on over
  several lines: a line that doesn't start with `- ` joins the item above it. A list where every item starts
  with a bold term (`- **Then:** what it means`) shows as terms and their meanings.
- A slot marked "(a table)" wants one row per line, the cells split by `|`. The first row names the columns,
  and every row needs as many cells as the first.
- Numbered slots (`Can do 1: he can`, `Can do 2: he can`, ...) are rows. The numbers must run on with no gap:
  to take a row out, delete all its slots and number the rows after it down by one.
- Journal entries have no numbers. One entry is four slots, from `Journal entry: date` to
  `Journal entry: what went wrong`, and the page shows the entries in the order the file has them. To add one,
  copy a whole entry and paste it where it belongs.
- Words in curly brackets, like `{n}` or `{date}`, are filled in by the site. A line holding only one, like
  `{stages}` or `{analytics settings button}`, is where the page puts something of its own. Keep them as they
  are: `{N}` or `{dates}` isn't one the site knows, and would show as typed.
- On a project page, a quote is written `{{Who: words}}`, so the quotes can be counted and checked. Quote only
  your own words and Asher's own lines.
- Text above the first `# ` line is ignored, so you can leave yourself a note there.
- If the site can't read a file (a slot missing or empty, a gap in the numbers, a list with no `- ` items),
  the preview shows an error naming the file and the slot.

## Seeing your change

On the laptop, start the preview with `npm run dev` and open the address it prints. It shows a change when you
save the file and refresh the page.

## Checking your words

`npm run words:check` reads every file and lists anything that looks wrong: a slot the site doesn't know (often
a stray `# ` line), a slot that's missing, a word in curly brackets the site won't fill in, or a page that won't
build. Last, it lists the files still on `ben_pass: no`. Run it whenever you like; it changes nothing.

`npm run words:snapshot` writes down the slot names the check expects (in `.slots.json`, in this folder). It's
for the studio, after a change to the code adds or takes out a slot. Running it after a typo would teach the
check the typo.

## Your pass

The top of each file says `ben_pass: no`. Change it to `ben_pass: yes` once the page sounds like you.
`npm run words:check` lists every page still on `no`.

## Where things are

- `site.md`: the name, the lines under it, the header, the footer, the sign-up form, the analytics banner and
  the names of the three stages.
- `home.md`: the front page, its spotlight and the strip of topics.
- `about.md`, `privacy.md`, `not-found.md`: those pages.
- `topic-page.md`: the words every topic page shares, and the cards that list pieces.
- `topics/`: one file per topic (`building.md`, `feeding.md`, `fixing.md`, `growing.md`, `living.md`,
  `making.md`).
- `pieces/`: one file per piece, as its card shows it on the front page and the topic pages
  (`pieces/asher.md`).
- `projects/`: the project pages. `projects/asher.md` is Asher's page, top to bottom: the title sheet, the
  drawing sheet, What runs where, What it can do, Then, Now, Next, the journal, the receipt and the core.
  `projects/asher-drawing.md` holds the drawing's own words, as the part panel, the parts list and
  Measurements show them: each part (`Part, camera: name` and so on), each plate (`Level 1: name`) and each
  size (`Size wheel_d: name`).
