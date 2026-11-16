'use client';
// The words editor: click any words on the preview page, type, save. Local preview only: src/app/layout.tsx renders it
// only when editorOn() (src/lib/words-edit.ts), and the API it talks to (src/app/api/words-editor/route.dev.ts) answers
// nothing otherwise. Its look is words-editor.css, handed in as `css` by the layout, so a production build never loads
// it.
//
// How it finds the words: it fetches every words file's slots, cuts each slot into the pieces the page shows (cells,
// list items, headings, paragraphs, whole slots: pieces.ts), and compares an element's text, with the Markdown and the
// spaces taken out, against them. The smallest element that matches is the one highlighted and edited. An edit to a
// piece is put back into its full slot and saved; then the page re-renders with the new words.
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  allPieces, changeSnippet, cleanHint, ELSEWHERE_MIN, fileLabel, hasMarkdown, matcher, pageFiles, rankPieces, rebuild,
  squash, type IndexFile, type LogEntry, type Matcher, type Piece,
} from './pieces';

const API = '/api/words-editor';
const FLAG = 'words-editor';
const UI = '[data-words-editor]';

/** What a pointer is on: the element, and when the element holds words from more than one place, the run of text
 *  (`node`) that is the words found. */
type Hit = { el: Element; cands: Piece[]; node?: Text };
type Box = { top: number; left: number; width: number; height: number };
type Font = { family: string; size: number; lineHeight: number; weight: string };
interface Editing {
  el: Element;
  node?: Text;
  cands: Piece[];
  pick: number;
  /** each candidate's slot text when the editor opened: sent as `before` */
  texts: string[];
  text: string;
  error: string;
  saving: boolean;
  warned: boolean;
  font: Font;
  rect: Box;
}

function readFlag(): boolean {
  try {
    return sessionStorage.getItem(FLAG) === '1';
  } catch {
    return false;
  }
}
function writeFlag(on: boolean) {
  try {
    if (on) sessionStorage.setItem(FLAG, '1');
    else sessionStorage.removeItem(FLAG);
  } catch {
    // private window or storage off: the switch just won't survive a reload
  }
}

// the editor's own parts, and Next's dev badge and error overlay (in a <nextjs-portal>): left alone
const inUI = (t: EventTarget | null) => t instanceof Element && !!t.closest(`${UI}, nextjs-portal`);
const label = (p: Piece) => `${fileLabel(p.file)} · ${p.slot}`;
const fold = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

// an element's box; for one with no box of its own (display: contents), and for a run of text, its contents' box
function boxOf(el: Element | Text): Box | null {
  if (!el.isConnected) return null;
  let r = el instanceof Element ? el.getBoundingClientRect() : null;
  if (!r || (!r.width && !r.height)) {
    const range = document.createRange();
    range.selectNodeContents(el);
    r = range.getBoundingClientRect();
  }
  if (!r.width && !r.height) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

// the texts an element shows or reads out, squashed: its text, a term with its meaning (<dt> and <dd> together), then
// (unless `shown` only) what's read out in its place (alt, aria-label) and a field's placeholder
function textsOf(el: Element, shown = false): string[] {
  const out: string[] = [];
  const tag = el.tagName.toLowerCase();
  if (tag === 'dt' || tag === 'dd') {
    const dt = tag === 'dt' ? el : el.previousElementSibling;
    const dd = tag === 'dd' ? el : el.nextElementSibling;
    if (dt?.tagName === 'DT' && dd?.tagName === 'DD') out.push(`${dt.textContent ?? ''}${dd.textContent ?? ''}`);
  }
  out.push(el.textContent ?? '');
  for (const a of shown ? [] : ['alt', 'aria-label', 'placeholder']) {
    const v = el.getAttribute(a);
    if (v) out.push(v);
  }
  return [...new Set(out.map(squash).filter(Boolean))];
}

// The same words in several slots of one file (a date in more than one row, say): put first the slot at the same place
// in the file as this element is among the page's elements with those words, when the counts agree.
function byPlace(hit: Hit): Hit {
  const c = hit.cands.filter((p) => p.file === hit.cands[0].file);
  if (hit.node || c.length < 2) return hit;
  const key = squash(hit.el.textContent ?? '');
  if (!key) return hit;
  const same = [...document.querySelectorAll(hit.el.tagName)].filter((e) => !inUI(e) && squash(e.textContent ?? '') === key);
  const k = same.indexOf(hit.el);
  if (same.length !== c.length || k < 0) return hit;
  const sorted = [...c].sort((a, b) => a.i - b.i);
  return { ...hit, cands: [sorted[k], ...sorted.filter((_, n) => n !== k), ...hit.cands.filter((p) => !c.includes(p))] };
}

// The same short words in more than one file the page shows ("Topic" in a table on the front page, on Asher's page
// and on a topic page): put first the file whose other words sit nearest these on the page. Words found in only one
// file count; the smallest part of the page around these words that has any decides.
function byContext(hit: Hit, m: Matcher, own: string[]): Hit {
  const files = [...new Set(hit.cands.map((p) => p.file))];
  if (files.length < 2 || own.includes(hit.cands[0].file)) return hit;
  let around = hit.el.parentElement;
  for (let up = 0; around && up < 6 && around !== document.body; up++, around = around.parentElement) {
    const els = around.querySelectorAll('*');
    if (els.length > 400) break;
    const score = new Map<string, number>();
    for (const e of els) {
      if (e === hit.el || e.contains(hit.el) || inUI(e)) continue;
      const t = squash(e.textContent ?? '');
      if (!t || t.length > 300) continue;
      const fs = new Set(m.exact(t).map((p) => p.file));
      const [f] = fs;
      if (fs.size === 1 && files.includes(f)) score.set(f, (score.get(f) ?? 0) + 1);
    }
    const best = [...score].sort((a, b) => b[1] - a[1]);
    if (best.length && (best.length === 1 || best[0][1] > best[1][1])) {
      const f = best[0][0];
      return { ...hit, cands: [...hit.cands.filter((p) => p.file === f), ...hit.cands.filter((p) => p.file !== f)] };
    }
  }
  return hit;
}

// the run of text under the pointer, when the pointer is on its words (not out in the empty end of its line)
function textAt(x: number, y: number): Text | null {
  const d = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null };
  const node = d.caretPositionFromPoint ? d.caretPositionFromPoint(x, y)?.offsetNode : document.caretRangeFromPoint?.(x, y)?.startContainer;
  if (!(node instanceof Text) || !node.data.trim() || inUI(node.parentElement)) return null;
  const range = document.createRange();
  range.selectNodeContents(node);
  for (const r of range.getClientRects()) if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return node;
  return null;
}

// the paragraph, heading, list item or cell an element sits in (itself, if it is one)
function blockOf(el: Element): Element {
  let b: Element | null = el;
  for (let up = 0; b && up <= 8; up++, b = b.parentElement) {
    const d = getComputedStyle(b).display;
    if (d !== 'contents' && !d.startsWith('inline')) return b;
  }
  return el;
}

// The files a page shows besides its own: any with longer words (ELSEWHERE_MIN or more) shown whole on it; any with the
// words of two of its slots shown whole (a topic's name and its small word, on the front page's strip); and the files
// of a folder when three or more of them have words shown whole (the topics' names in the sign-up form, on every page).
// Their short words count on this page too.
function shownFiles(m: Matcher, own: string[]): string[] {
  const long = new Set<string>();
  const slots = new Map<string, Set<number>>();
  for (const el of document.body.querySelectorAll('*')) {
    if (inUI(el) || (el.textContent ?? '').length > 4000) continue;
    for (const t of textsOf(el)) {
      if (t.length < 3) continue;
      for (const p of m.exact(t)) {
        if (own.includes(p.file)) continue;
        if (t.length >= ELSEWHERE_MIN) long.add(p.file);
        else slots.set(p.file, (slots.get(p.file) ?? new Set()).add(p.i));
      }
    }
  }
  const folders = new Map<string, string[]>();
  for (const [file, s] of slots) {
    if (s.size >= 2) long.add(file);
    const dir = file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '';
    if (dir) folders.set(dir, [...(folders.get(dir) ?? []), file]);
  }
  for (const fs of folders.values()) if (fs.length >= 3) fs.forEach((f) => long.add(f));
  return [...long];
}

// The words a pointer is on, in this order: the whole paragraph (or heading, list item, cell) they're in, so a link in
// a paragraph opens the paragraph; the element itself; the run of text under the pointer (`node`), for an element that
// holds words from more than one place; then further up; then, failing all that, words held in only a few slots.
function findHit(start: Element, node: Text | null, m: Matcher, own: string[], near: string[]): Hit | null {
  const usable = (el: Element) => el !== document.body && el !== document.documentElement && !inUI(el) && (el.textContent ?? '').length <= 20000;
  // short words found only in a file the page doesn't show don't count (rankPieces)
  const rank = (t: string) => rankPieces(m.exact(t), own, t, near);
  const whole = (el: Element, shown = false): Hit | null => {
    if (!usable(el)) return null;
    for (const t of textsOf(el, shown)) {
      const cands = rank(t);
      if (cands.length) return byPlace(byContext({ el, cands }, m, own));
    }
    return null;
  };
  // Words shown on the page are the words pointed at, not the read-out label of a part they sit in (a section's
  // aria-label); an element that shows none (a picture, an icon) is its read-out words, not its caption's.
  const shows = !!(start.textContent ?? '').trim();
  const block = shows ? blockOf(start) : start;
  const first = whole(block, block !== start) ?? (block !== start ? whole(start) : null);
  if (first) return first;
  if (node?.parentElement && usable(node.parentElement)) {
    const t = squash(node.data);
    const cands = t ? rank(t) : [];
    if (cands.length) return byContext({ el: node.parentElement, node, cands }, m, own);
  }
  let el: Element | null = start.parentElement;
  for (let up = 1; el && up <= 8; up++, el = el.parentElement) {
    if (!usable(el)) break;
    const h = whole(el, shows);
    if (h) return h;
  }
  // nothing matches exactly: words held in only a few slots (a term list, an element with more than one part)
  const words = (start.textContent ?? '').trim();
  if (words.length >= 12 && words.length <= 4000) {
    const t = squash(words);
    const inside = m.within(t);
    const slots = new Set(inside.map((p) => `${p.file}#${p.i}`));
    const cands = slots.size >= 1 && slots.size <= 3 ? rankPieces(inside, own, t, near) : [];
    if (cands.length) return { el: start, cands };
  }
  return null;
}

function fontOf(el: Element): Font {
  const fallback: Font = { family: 'var(--sans, system-ui, sans-serif)', size: 16, lineHeight: 1.5, weight: '400' };
  if (!(el instanceof HTMLElement)) return fallback; // SVG text: its sizes are the drawing's, not the page's
  const cs = getComputedStyle(el);
  const px = parseFloat(cs.fontSize) || 16;
  const lh = cs.lineHeight.endsWith('px') ? parseFloat(cs.lineHeight) / px : parseFloat(cs.lineHeight) || 1.4;
  return {
    family: cs.fontFamily || fallback.family,
    size: Math.min(28, Math.max(14, px)),
    lineHeight: Math.min(2, Math.max(1.2, lh)),
    weight: cs.fontWeight || '400',
  };
}

function helpFor(p: Piece): string {
  if (p.kind === 'cell') return 'A table cell can’t hold a | sign.';
  if (p.holes.length === 1) return `${p.holes[0]} fills in by itself: keep it.`;
  if (p.holes.length > 1) return `${p.holes.slice(0, -1).join(', ')} and ${p.holes[p.holes.length - 1]} fill in by themselves: keep them.`;
  if (/\{\{[^}]+\}\}/.test(p.source)) return 'A quote is written {{Who: words}}: keep the double curly brackets and the name.';
  if (hasMarkdown(p.source)) return 'Markdown works here: **bold**, *italic*, [words](https://link). Keep the marks round the words.';
  return '';
}

async function post(body: Record<string, unknown>): Promise<{ ok: boolean; status: number; error: string }> {
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-words-editor': '1' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    let error = '';
    if (!r.ok) {
      try {
        error = ((await r.json()) as { error?: string }).error ?? '';
      } catch {
        error = '';
      }
    }
    return { ok: r.ok, status: r.status, error: error || (r.ok ? '' : `The preview said no (${r.status}).`) };
  } catch {
    return { ok: false, status: 0, error: 'The preview didn’t answer. Is it still running?' };
  }
}

export default function WordsEditor({ css }: { css: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const [on, setOn] = useState(false);
  const [files, setFiles] = useState<IndexFile[] | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [hl, setHl] = useState<(Box & { label: string }) | null>(null);
  const [edit, setEdit] = useState<Editing | null>(null);
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [panelMsg, setPanelMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const pieces = useMemo(() => (files ? allPieces(files) : []), [files]);
  const m = useMemo(() => matcher(pieces), [pieces]);
  const own = useMemo(() => (files ? pageFiles(pathname, files.map((f) => f.name)) : []), [files, pathname]);

  // the listeners read the latest of these without being added again
  const live = useRef({ on, m, own, edit, files });
  live.current = { on, m, own, edit, files };
  const hover = useRef<Hit | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  // the other files this page is seen to show (shownFiles), worked out once per page when first needed
  const nearRef = useRef<{ key: string; m: Matcher | null; files: string[] }>({ key: '', m: null, files: [] });
  const nearFiles = useCallback(() => {
    const { m, own } = live.current;
    const key = `${window.location.pathname}|${own.join(',')}`;
    if (nearRef.current.key !== key || nearRef.current.m !== m) nearRef.current = { key, m, files: shownFiles(m, own) };
    return nearRef.current.files;
  }, []);
  const hitAt = useCallback(
    (t: Element, node: Text | null) => findHit(t, node, live.current.m, live.current.own, nearFiles()),
    [nearFiles],
  );
  const boxRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOn(readFlag()), []);

  const say = useCallback((msg: string) => setToast(msg), []);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([fetch(API, { cache: 'no-store' }), fetch(`${API}?log=1`, { cache: 'no-store' })]);
      if (!a.ok) throw new Error(`(${a.status})`);
      setFiles(((await a.json()) as { files: IndexFile[] }).files);
      setLog(b.ok ? ((await b.json()) as { log: LogEntry[] }).log : []);
    } catch (e) {
      say(`The words files couldn’t be loaded ${(e as Error).message}. Is the preview running with the editor on?`);
    }
  }, [say]);

  useEffect(() => {
    if (on) void load();
  }, [on, load]);

  // the highlight follows its element as the page scrolls or changes size
  const paint = useCallback(() => {
    const cur: Hit | null = live.current.edit ?? hover.current;
    const box = cur ? boxOf(cur.node ?? cur.el) : null;
    if (!cur || !box) {
      setHl(null);
      return;
    }
    const more = cur.cands.length > 1 ? ` (+${cur.cands.length - 1})` : '';
    setHl({ ...box, label: `${label(cur.cands[0])}${more}` });
  }, []);

  useEffect(() => {
    if (!on) {
      hover.current = null;
      setHl(null);
      setEdit(null);
      return;
    }
    let frame = 0;
    const repaint = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    // the highlight follows the pointer, run of text by run of text; worked out at most once a frame, and only when the
    // pointer has moved onto another element or another run
    let moved: MouseEvent | null = null;
    let moveFrame = 0;
    let at: { t: Element; node: Text | null } | null = null;
    const look = () => {
      moveFrame = 0;
      const e = moved;
      moved = null;
      if (!e || live.current.edit) return;
      const t = e.target;
      if (!(t instanceof Element) || inUI(t)) {
        at = null;
        if (hover.current) {
          hover.current = null;
          paint();
        }
        return;
      }
      const node = textAt(e.clientX, e.clientY);
      if (at && at.t === t && at.node === node) return;
      at = { t, node };
      hover.current = hitAt(t, node);
      paint();
    };
    const over = (e: MouseEvent) => {
      moved = e;
      if (!moveFrame) moveFrame = requestAnimationFrame(look);
    };
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget && hover.current && !live.current.edit) {
        at = null;
        hover.current = null;
        repaint();
      }
    };
    const press = (e: PointerEvent) => {
      down.current = { x: e.clientX, y: e.clientY };
    };
    const click = (e: MouseEvent) => {
      if (inUI(e.target)) return;
      // links, buttons, <details> and the drawing's own handlers don't get this click
      e.preventDefault();
      e.stopImmediatePropagation();
      const d = down.current;
      down.current = null;
      // the end of a drag (turning the drawing), not a click; a click made with the keyboard has no pointer to check
      if (e.detail !== 0 && d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      const files = live.current.files;
      if (!files) {
        say('The words are still loading. Try again in a moment.');
        return;
      }
      const cur = live.current.edit;
      if (cur && cur.text !== cur.cands[cur.pick].source) {
        say('Save or cancel the words you’re changing first.');
        areaRef.current?.focus();
        return;
      }
      // a click made with the keyboard has no pointer, so no run of text: its element's words are found
      const hit = hitAt(t, e.detail !== 0 ? textAt(e.clientX, e.clientY) : null);
      if (!hit) {
        const shows = (t.textContent ?? '').trim() || t.getAttribute('alt') || t.getAttribute('aria-label');
        if (shows) say('These words aren’t in a words file: they come from the build’s data or the code. Ask Claude to change them.');
        return;
      }
      const box = boxOf(hit.node ?? hit.el) ?? { top: e.clientY, left: e.clientX, width: 0, height: 0 };
      const texts = hit.cands.map((p) => files.find((f) => f.name === p.file)?.slots[p.i]?.text ?? '');
      hover.current = null;
      at = null;
      setEdit({ el: hit.el, node: hit.node, cands: hit.cands, pick: 0, texts, text: hit.cands[0].source, error: '', saving: false, warned: false, font: fontOf(hit.el), rect: box });
    };
    // no form on the page sends anything while editing
    const submit = (e: Event) => {
      if (inUI(e.target)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    // Esc closes the box even when the focus has moved out of it (the box handles its own keys)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && live.current.edit && !inUI(e.target)) setEdit(null);
    };
    window.addEventListener('mousemove', over, true);
    window.addEventListener('mouseout', out, true);
    window.addEventListener('pointerdown', press, true);
    window.addEventListener('click', click, true);
    window.addEventListener('submit', submit, true);
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', repaint, { capture: true, passive: true });
    window.addEventListener('resize', repaint);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(moveFrame);
      window.removeEventListener('mousemove', over, true);
      window.removeEventListener('mouseout', out, true);
      window.removeEventListener('pointerdown', press, true);
      window.removeEventListener('click', click, true);
      window.removeEventListener('submit', submit, true);
      window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', repaint, true);
      window.removeEventListener('resize', repaint);
    };
  }, [on, paint, say, hitAt]);

  // For checking the matching, from the browser's console: window.__wordsAudit() lists the words on this page that
  // the editor can't find in a words file (each run of text, and each picture's or button's read-out words);
  // window.__wordsAudit(true) lists every run, with the slot a click there opens.
  useEffect(() => {
    if (!on || !files) return;
    type Row = { text: string; where: string; opens?: string };
    const w = window as Window & { __wordsAudit?: (all?: boolean) => Row[] };
    w.__wordsAudit = (all = false) => {
      const missed: Row[] = [];
      const note = (text: string, el: Element, hit: Hit | null) => {
        if (!hit) missed.push({ text, where: where(el) });
        else if (all) missed.push({ text, where: where(el), opens: `${hit.cands.map(label).join(' | ')}${hit.node ? ' (run)' : ''}` });
      };
      const where = (el: Element) => {
        const bits: string[] = [];
        for (let e: Element | null = el; e && e !== document.body && bits.length < 4; e = e.parentElement) {
          bits.unshift(e.tagName.toLowerCase() + (e.classList.length ? `.${[...e.classList].join('.')}` : ''));
        }
        return bits.join(' > ');
      };
      const seen = (el: Element) => {
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length > 0;
      };
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const t = n as Text;
        const el = t.parentElement;
        if (!el || !t.data.trim() || inUI(el) || el.closest('script, style, noscript, template') || !seen(el)) continue;
        note(t.data.trim().slice(0, 120), el, hitAt(el, t));
      }
      for (const el of document.body.querySelectorAll('[alt], [aria-label], [placeholder]')) {
        if (inUI(el) || !seen(el)) continue;
        note(`[${el.getAttribute('alt') ?? el.getAttribute('aria-label') ?? el.getAttribute('placeholder')}]`, el, hitAt(el, null));
      }
      return missed;
    };
    return () => {
      delete w.__wordsAudit;
    };
  }, [on, files, hitAt]);

  // repaint when the editor opens or closes
  useEffect(() => {
    paint();
  }, [edit?.el, paint]);

  // the editor box sits over its words, kept inside the window; its text box grows with its words
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !edit) return;
    const a = areaRef.current;
    if (a) {
      a.style.height = 'auto';
      a.style.height = `${Math.min(a.scrollHeight + 2, window.innerHeight * 0.5)}px`;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(vw - 16, Math.max(360, edit.rect.width + 24));
    const left = Math.min(Math.max(8, edit.rect.left - 12), vw - width - 8);
    box.style.width = `${width}px`;
    box.style.left = `${left}px`;
    const h = box.offsetHeight;
    const head = box.querySelector('.we-head') as HTMLElement | null;
    let top = edit.rect.top - (head?.offsetHeight ?? 48) - 12;
    if (top + h > vh - 8) top = vh - 8 - h;
    box.style.top = `${Math.max(8, top)}px`;
  }, [edit]);

  const editing = edit?.el;
  useEffect(() => {
    if (!editing) return;
    const a = areaRef.current;
    if (a) {
      a.focus();
      a.setSelectionRange(a.value.length, a.value.length);
    }
  }, [editing]);

  const toggle = () => {
    const next = !on;
    writeFlag(next);
    setOn(next);
    if (!next) {
      setEdit(null);
      setPanelMsg('');
    }
  };

  // close the box; if the focus was in it, it goes to the "Stop editing" button rather than falling to the page's top
  const close = () => {
    const a = document.activeElement;
    if (!a || a === document.body || boxRef.current?.contains(a)) toggleRef.current?.focus();
    setEdit(null);
  };
  const cancel = close;

  const save = async () => {
    if (!edit || edit.saving) return;
    const p = edit.cands[edit.pick];
    const src = p.oneLine ? fold(edit.text) : edit.text.trim();
    const was = p.oneLine ? fold(p.source) : p.source.trim();
    const fail = (error: string, more: Partial<Editing> = {}) => setEdit({ ...edit, ...more, error, saving: false });
    if (src === was) {
      close();
      say('Nothing changed.');
      return;
    }
    if (!src) return fail('Type some words, or press Cancel. To take a part out completely, ask Claude.');
    if (p.kind === 'cell' && src.includes('|')) return fail('A table cell can’t hold a | sign. Take it out, or ask Claude.');
    if (/^# /m.test(src)) return fail('A line can’t start with "# " (a hash and a space): in a words file that starts a new slot.');
    const lost = p.holes.filter((h) => !src.includes(h));
    if (lost.length && !edit.warned) {
      const gone = lost.length > 1 ? `${lost.join(' and ')} fill in by themselves and are gone now` : `${lost[0]} fills in by itself and is gone now`;
      return fail(`${gone}. Put ${lost.length > 1 ? 'them' : 'it'} back, or press Save again to save without ${lost.length > 1 ? 'them' : 'it'}.`, { warned: true });
    }
    setEdit({ ...edit, saving: true, error: '' });
    const before = edit.texts[edit.pick];
    const r = await post({ action: 'edit', name: p.file, i: p.i, before, after: rebuild(before, p, src) });
    if (!r.ok) {
      fail(r.error);
      areaRef.current?.focus(); // the Save button was off while saving, which can drop the focus
      return;
    }
    close();
    say('Saved.');
    router.refresh();
    await load();
  };

  const onKey = (e: ReactKeyboardEvent) => {
    if (!edit || e.nativeEvent.isComposing) return;
    if (e.key === 'Tab') {
      // Tab and Shift+Tab go round the box's own fields and buttons, not off into the page behind it
      const all = [...(boxRef.current?.querySelectorAll<HTMLElement>('select, textarea, button') ?? [])].filter((x) => !x.matches(':disabled'));
      const first = all[0];
      const last = all[all.length - 1];
      if (!first) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void save();
    } else if (e.key === 'Enter' && e.target === areaRef.current && edit.cands[edit.pick].oneLine) {
      e.preventDefault();
      void save();
    }
  };

  const pass = async (name: string, value: boolean) => {
    setBusy(true);
    setPanelMsg('');
    const r = await post({ action: 'pass', name, value });
    if (!r.ok) setPanelMsg(r.error);
    await load();
    setBusy(false);
  };

  const undo = async (e: LogEntry) => {
    setBusy(true);
    setPanelMsg('');
    const r = await post({ action: 'edit', name: e.name, i: e.i, before: e.after, after: e.before, undo: true });
    if (r.ok) {
      say('Put back.');
      router.refresh();
    } else if (r.status === 409) {
      setPanelMsg('Those words have changed since, so Undo can’t put them back by itself. Ask Claude to put them back.');
    } else setPanelMsg(r.error);
    await load();
    setBusy(false);
    // the Undo button just pressed is gone now: keep the focus from falling to the page's top
    requestAnimationFrame(() => {
      if (!document.activeElement || document.activeElement === document.body) toggleRef.current?.focus();
    });
  };

  const mine = files ? files.filter((f) => own.includes(f.name) || f.name === 'site') : [];
  const broken = files ? files.filter((f) => f.error) : [];
  const changes = log.filter((e) => e.action === 'edit' || e.action === 'undo').slice(0, 10);
  // Undo only for the newest change to each spot, and only when that change was an edit (the log is newest first): an
  // older change has been changed again since, and a "Put back" is itself an undo
  const seen = new Set<string>();
  const undoable = changes.map((e) => {
    const k = `${e.name}#${e.i}`;
    const newest = !seen.has(k);
    seen.add(k);
    return newest && e.action === 'edit' && typeof e.i === 'number';
  });
  const p = edit ? edit.cands[edit.pick] : null;
  const help = p ? helpFor(p) : '';
  const hint = p ? cleanHint(p.hint) : '';

  return (
    <div data-words-editor="" className="we-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {on && hl && (
        <div className={edit ? 'we-hl we-hl-on' : 'we-hl'} style={{ top: hl.top - 3, left: hl.left - 3, width: hl.width + 6, height: hl.height + 6 }} aria-hidden="true">
          {!edit && <span className={hl.top < 28 ? 'we-tag we-tag-below' : 'we-tag'}>{hl.label}</span>}
        </div>
      )}

      {on && edit && p && (
        <div ref={boxRef} className="we-box" role="dialog" aria-label={`Change the words: ${label(p)}`} onKeyDown={onKey}>
          <div className="we-head">
            <p className="we-where">{label(p)}</p>
            {hint && <p className="we-hint">{hint}</p>}
            {edit.cands.length > 1 && (
              <label className="we-choose">
                <span>These words are in more than one place. Which one?</span>
                <select
                  value={edit.pick}
                  onChange={(e) => {
                    const k = Number(e.target.value);
                    setEdit({ ...edit, pick: k, text: edit.cands[k].source, error: '', warned: false });
                  }}
                >
                  {edit.cands.map((c, k) => {
                    // slots with the same name (journal entries) are told apart by their order in the file
                    const twins = edit.cands.filter((x) => label(x) === label(c)).sort((a, b) => a.i - b.i);
                    const nth = twins.length > 1 ? ` (${twins.indexOf(c) + 1} of ${twins.length})` : '';
                    return (
                      <option key={`${c.file}#${c.i}`} value={k}>
                        {`${label(c)}${nth}`}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
          </div>
          <textarea
            ref={areaRef}
            className="we-area"
            aria-label={`Words for ${label(p)}`}
            value={edit.text}
            readOnly={edit.saving}
            rows={p.oneLine ? 1 : 3}
            spellCheck
            style={{ fontFamily: edit.font.family, fontSize: `${edit.font.size}px`, lineHeight: edit.font.lineHeight, fontWeight: edit.font.weight }}
            onChange={(e) => setEdit({ ...edit, text: e.target.value, error: '' })}
          />
          {help && <p className="we-help">{help}</p>}
          {edit.error && (
            <p className="we-error" role="alert">
              {edit.error}
            </p>
          )}
          <div className="we-actions">
            <button type="button" className="we-btn we-primary" onClick={() => void save()} disabled={edit.saving} title={p.oneLine ? 'Enter saves' : 'Ctrl+Enter saves'}>
              {edit.saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="we-btn" onClick={cancel} title="Esc cancels">
              Cancel
            </button>
          </div>
        </div>
      )}

      {on && (
        <section className="we-panel" aria-label="Words editor">
          <div className="we-panel-top">
            <p className="we-panel-title">Editing text</p>
            <button type="button" className="we-btn we-small" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? 'Show' : 'Hide'}
            </button>
          </div>
          {!collapsed && (
            <div className="we-panel-body">
              <p className="we-line">Click any words to change them. Changes save into the site’s words files on this laptop. Nothing goes live until it’s pushed.</p>
              {broken.map((f) => (
                <p key={f.name} className="we-error">
                  {f.error}
                </p>
              ))}
              {mine.length > 0 && (
                <ul className="we-files">
                  {mine.map((f) => (
                    <li key={f.name}>
                      <label className="we-check">
                        <input type="checkbox" checked={f.benPass} disabled={busy} onChange={() => void pass(f.name, !f.benPass)} />
                        <span>
                          <strong>{fileLabel(f.name)}</strong> Done with this page
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <p className="we-sub">Your changes</p>
              {changes.length ? (
                <ol className="we-log">
                  {changes.map((e, k) => {
                    const c = changeSnippet(e.before, e.after);
                    return (
                      <li key={`${e.at}-${k}`}>
                        <p className="we-log-where">
                          {e.action === 'undo' ? 'Put back: ' : ''}
                          {fileLabel(e.name)} · {e.slot}
                        </p>
                        <p className="we-log-what">
                          <del>{c.before}</del> <span aria-hidden="true">→</span> <ins>{c.after}</ins>
                        </p>
                        {undoable[k] && (
                          <button type="button" className="we-btn we-small" disabled={busy} onClick={() => void undo(e)}>
                            Undo
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="we-muted">None yet.</p>
              )}
              {panelMsg && (
                <p className="we-error" role="alert">
                  {panelMsg}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      <div className="we-live" role="status" aria-live="polite">
        {toast && <p className="we-toast">{toast}</p>}
      </div>

      <button ref={toggleRef} type="button" className={on ? 'we-btn we-toggle we-toggle-on' : 'we-btn we-toggle'} onClick={toggle}>
        {on ? 'Stop editing' : 'Edit text'}
      </button>
    </div>
  );
}
