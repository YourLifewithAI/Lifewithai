# The site's words

Every word a reader sees on the site lives in this folder, one file per page. Change anything you like: the
code only reads these files. Nothing here goes live until the site is pushed.

## How a file works

A line that starts with `# ` (one hash and a space) names a slot. The words under it, down to the next `# `
line, are what the page shows in that spot. Words in brackets after a slot name are a note for you.

```
# Spotlight heading
Innovator spotlight
```

- Change the words under a slot as much as you like. Leave the `# ` line itself as it is: the code looks for
  that name. Two slots can't share a name (the words in brackets don't count).
- Inside a slot, Markdown works: a blank line starts a new paragraph, `- ` starts a list item, `**bold**`,
  `[words](https://link)`. In the longer pages, `## ` and `### ` make headings. `{#name}` after a heading is
  its link name: keep it, or the links to that heading stop working.
- A slot marked "(a list)" wants one item per line, each starting with `- `. A list where every item starts
  with a bold term (`- **Then:** what it means`) shows as terms and their meanings.
- A slot marked "(a table)" wants one row per line, the cells split by `|`. The first row names the columns,
  and every row needs as many cells as the first.
- Words in curly brackets, like `{n}` or `{date}`, are filled in by the site. A line holding only one, like
  `{stages}` or `{analytics settings button}`, is where the page puts something of its own. Keep them.
- On a project page, a quote is written `{{Who: words}}`, so the quotes can be counted and checked. Quote only
  your own words and Asher's own lines.
- Text above the first `# ` line is ignored, so you can leave yourself a note there.
- If the site can't find a slot, the preview shows an error naming the file and the slot.

## Seeing your change

On the laptop, the preview at http://localhost:3011 shows a change when you save the file and refresh the
page.

## Your pass

The top of each file says `ben_pass: no`. Change it to `ben_pass: yes` once the page sounds like you. Before
launch, the studio lists every page still on `no`.

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
- `projects/`: one file per project page. `projects/asher.md` is Asher's page, top to bottom: the title
  sheet, the drawing and its part panel, What runs where, What it can do, Then, Now, Next, the journal, the
  receipt and the core. Near the end are the drawing's own words: each part (`Part, camera: name` and so on),
  each plate (`Level 1: name`) and each size (`Size wheel_d: name`).
