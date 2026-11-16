// @ts-nocheck
/* The drawing's engine: builds the drawing's markup inside a root element (or two: see opts.after), draws the model,
   and handles turning, exploding, labels and picking a part. Ported from the studio's round 4 engine (app.js), as-built
   only: no swaps, checks, presets or software sheet, and one start view (iso). It never touches anything outside the
   elements it is given, and
   mount() returns { destroy } so React can clean up.

   Turning is by drag; there are no turn buttons or sliders (Ben, 2026-11-15). A finger drag sideways turns the model;
   the sheet has touch-action: pan-y, so a vertical swipe still scrolls the page (the browser takes it and sends
   pointercancel). A mouse drag turns and tilts. Drag is the only way to turn it (Ben took the Shift + arrow keys out,
   2026-11-15); on a keyboard the arrow keys move between parts.

   Every word comes from opts.words (the page's data file); only unit symbols and number formatting live in code. */
import { draw as drawModel, ISO } from './render.js';

const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

// a tiny element builder: h('p', { class: 'x' }, 'text', child)
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs)
    for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') e.textContent = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
  kids.flat().forEach((c) => { if (c !== null && c !== undefined && c !== false) e.append(c); });
  return e;
}

/* data: DrawingData from src/lib/project-model.ts.
   opts: { words, id (a unique prefix for ids), after (optional: a second element, for the part panel and the parts
   list, so the page can put something of its own between them and the model) } */
export function mount(root, data, opts) {
  const W = opts.words, P = opts.id || 'pd';
  // the solids get a geometry cache attached as the model is drawn; keep that off the caller's data
  const scene = { ...data, solids: data.solids.map((s) => ({ ...s })) };
  const state = { t: ISO.t, p: ISO.p, explode: 0, labelsOn: true, sel: null, focusId: null };

  // ---- markup ------------------------------------------------------------------------------------------------
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', fill(W.modelLabel, { name: data.title }));
  const sheet = h('div', { class: 'pd-sheet' }, svg);
  const tbline = h('p', { class: 'tbline' });
  const keyBox = h('ol', { class: 'keylist', 'aria-label': W.modelKey, hidden: true });
  const labelsBtn = h('button', { type: 'button', class: 'vb', 'aria-pressed': 'true', text: W.labelsButton });
  const explode = h('input', { type: 'range', id: P + '-explode', min: '0', max: '100', step: '1', value: '0' });
  const explodeOut = h('output', { for: P + '-explode', text: '0' });
  const bar = h('div', { class: 'pd-bar' },
    labelsBtn,
    h('div', { class: 'rng explode' }, h('label', { for: P + '-explode', text: W.explode }), explode, explodeOut),
  );
  const model = h('section', { class: 'model', 'aria-labelledby': P + '-h-model' },
    h('h3', { id: P + '-h-model', class: 'vh', text: W.modelHeading }),
    sheet, tbline, keyBox, bar,
    h('p', { class: 'small hint', text: W.dragHint }),
  );
  const propsHint = h('span', { class: 'small' });
  const props = h('div', { class: 'pb', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const propsPane = h('section', { class: 'pane props', 'aria-labelledby': P + '-h-props' },
    h('div', { class: 'ph' }, h('h3', { id: P + '-h-props', text: W.selectedPart }), propsHint),
    props,
  );
  const tree = h('div', { class: 'pb' });
  const treePane = h('details', { class: 'pane tree' },
    h('summary', { class: 'ph' }, h('h3', { text: W.partsOnRobot }), h('span', { class: 'small', text: fill(W.partsCount, { n: data.count }) })),
    tree,
  );
  const after = opts.after || null;
  root.textContent = '';
  const status = h('div', { class: 'pd-status' }, h('span', { class: 'chip', text: data.status }));
  if (after) {
    after.textContent = '';
    root.append(status, h('div', { class: 'ws' }, model));
    after.append(h('div', { class: 'ws' }, propsPane, treePane));
  } else {
    root.append(status, h('div', { class: 'ws' }, model, propsPane, treePane));
  }

  // ---- drawing -------------------------------------------------------------------------------------------------
  const atIso = () => Math.round(((state.t % 360) + 360) % 360) === ISO.t && Math.round(state.p) === ISO.p;
  const rankOf = (key) => (data.keys[key] ? data.keys[key].rank : 70);
  const ariaOf = (key, s) => (data.keys[key] ? data.keys[key].aria : s.name);
  function draw() {
    const width = sheet.clientWidth || 360, height = sheet.clientHeight || 400;
    const ae = document.activeElement, hadFocus = ae && svg.contains(ae) ? ae.getAttribute('data-id') : null;
    // Numbers on every width (Ben, 2026-11-15): a circled number on each part that picks it, the key under the sheet,
    // and the title block as a line under it. (render.js can still draw names at the sheet's edge, numbered: false, but
    // they took two 150 px columns off the drawing and couldn't be clicked.)
    const narrow = true, col = 14;
    const res = drawModel(svg, scene, {
      W: width, H: height,
      frame: { x: col, y: narrow ? 58 : 46, w: width - col * 2, h: height - (narrow ? 58 + 32 : 46 + 70) },
      view: { t: state.t, p: state.p }, viewName: atIso() ? W.viewIso : W.viewTurned,
      explode: state.explode, sel: state.sel, labelsOn: state.labelsOn, numbered: narrow, titleBlock: !narrow,
      focusId: state.focusId, rank: rankOf, aria: ariaOf, title: data.title, words: W,
    });
    tbline.textContent = res.tbText;
    tbline.className = narrow ? 'tbline' : 'tbline vh';
    // The key only changes when the labels are switched on or off: rebuild it then, so a focused line keeps its focus
    // while the model turns; otherwise just show which line's part is picked.
    const sig = res.key.map((k) => k.n + ':' + k.text + ':' + k.id).join('|');
    if (sig !== keySig) {
      keySig = sig;
      keyBox.textContent = '';
      res.key.forEach((k) => keyBox.append(h('li', { 'data-n': k.n },
        k.id
          ? h('button', { type: 'button', class: 'kbtn', 'data-id': k.id }, h('b', { text: String(k.n) }), h('span', { text: k.text }))
          : h('span', { class: 'kbtn' }, h('b', { text: String(k.n) }), h('span', { text: k.text })))));
    }
    keyBox.querySelectorAll('button.kbtn').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-id') === state.sel)));
    keyBox.hidden = !res.key.length;
    if (hadFocus) {
      const g = svg.querySelector('.hits [data-id="' + CSS.escape(hadFocus) + '"]');
      if (g) try { g.focus({ preventScroll: true }); } catch (e) { /* old browsers */ }
    }
  }
  let raf = 0, keySig = '';
  const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };

  // ---- the selected part ---------------------------------------------------------------------------------------
  function renderProps() {
    const pn = (state.sel && data.panels[state.sel]) || data.robotPanel;
    propsHint.textContent = state.sel ? '' : W.selectedHint;
    props.textContent = '';
    // Element.append turns a null into the text "null", so the parts a panel lacks are filtered out first
    props.append(...[
      h('div', { class: 'name', text: pn.name }),
      h('div', { class: 'slotline', text: pn.line }),
      pn.does ? h('p', { class: 'does', text: pn.does }) : null,
      h('dl', { class: 'figs' }, pn.figs.map((f) =>
        h('div', null, h('dt', { text: f.dt }), h('dd', null, f.dd, f.est ? ' ' : null, f.est ? h('span', { class: 'est', text: f.est }) : null)))),
      h('span', { class: 'status real', text: pn.status }),
      pn.note ? h('p', { class: 'note', text: pn.note }) : null,
    ].filter(Boolean));
  }
  function renderTree() {
    tree.textContent = '';
    tree.append(h('ul', null, data.tree.map((g) => h('li', null,
      h('div', { class: 'slot', text: g.heading }),
      g.items.map((it) => h('button', { type: 'button', class: 'pbtn', 'data-id': it.key, 'aria-pressed': String(state.sel === it.key) },
        h('span', { class: 'sw', style: 'background:var(--f-' + it.fill + ')' }),
        h('span', { class: 't' }, it.name, h('small', { text: it.status })),
      )),
    ))));
  }
  function select(id) {
    state.sel = state.sel === id ? null : id;
    draw();
    renderProps();
    tree.querySelectorAll('.pbtn').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-id') === state.sel)));
    // Where the parts list scrolls inside its own box (beside the model on a wide screen), bring the picked part into
    // view there, without scrolling the page.
    const b = state.sel ? tree.querySelector('.pbtn[aria-pressed="true"]') : null;
    if (b && treePane.scrollHeight > treePane.clientHeight + 1) {
      const r = b.getBoundingClientRect(), pr = treePane.getBoundingClientRect();
      const head = treePane.querySelector('summary')?.getBoundingClientRect().height || 0;
      if (r.top < pr.top + head) treePane.scrollTop -= pr.top + head - r.top + 8;
      else if (r.bottom > pr.bottom) treePane.scrollTop += r.bottom - pr.bottom + 8;
    }
  }

  // ---- controls ------------------------------------------------------------------------------------------------
  const on = [];
  const listen = (target, type, fn, o) => { target.addEventListener(type, fn, o); on.push(() => target.removeEventListener(type, fn, o)); };

  listen(labelsBtn, 'click', () => {
    state.labelsOn = !state.labelsOn;
    labelsBtn.setAttribute('aria-pressed', String(state.labelsOn));
    schedule();
  });
  listen(explode, 'input', () => {
    state.explode = explode.value / 100;
    explodeOut.value = explode.value;
    explodeOut.textContent = explode.value;
    schedule();
  });

  // picking: a tap on a part's pick area, or Enter / Space on its keyboard stop
  let suppressClick = false;
  listen(svg, 'click', (e) => {
    if (suppressClick) return;
    const g = e.target.closest ? e.target.closest('[data-id]') : null;
    if (!g) return;
    state.focusId = g.getAttribute('data-id');
    select(state.focusId);
  });
  listen(svg, 'focusin', (e) => {
    const g = e.target.closest ? e.target.closest('.hitg') : null;
    if (g) state.focusId = g.getAttribute('data-id');
  });
  const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: 'home', End: 'end' };
  listen(svg, 'keydown', (e) => {
    const g = e.target.closest ? e.target.closest('.hitg') : null;
    if (!g) return;
    if (STEP[e.key] !== undefined) {
      const all = Array.from(svg.querySelectorAll('.hits .hitg')).sort((a, b) => (+a.getAttribute('data-rank') || 0) - (+b.getAttribute('data-rank') || 0));
      if (!all.length) return;
      e.preventDefault();
      const i = all.indexOf(g), s = STEP[e.key];
      const j = s === 'home' ? 0 : s === 'end' ? all.length - 1 : (i + s + all.length) % all.length;
      all.forEach((x, k) => x.setAttribute('tabindex', k === j ? '0' : '-1'));
      state.focusId = all[j].getAttribute('data-id');
      try { all[j].focus({ preventScroll: true }); } catch (err) { /* old browsers */ }
      return;
    }
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    state.focusId = g.getAttribute('data-id');
    select(state.focusId);
  });
  // a part picked from the key or the list is also where Tab lands on the drawing next
  listen(keyBox, 'click', (e) => {
    const b = e.target.closest ? e.target.closest('button[data-id]') : null;
    if (b) { state.focusId = b.getAttribute('data-id'); select(state.focusId); }
  });
  listen(tree, 'click', (e) => {
    const b = e.target.closest ? e.target.closest('[data-id]') : null;
    if (b) { state.focusId = b.getAttribute('data-id'); select(state.focusId); }
  });

  // drag to turn. Pointer capture starts only once a drag has begun, so a plain tap still reaches the part under it.
  let drag = null;
  const THRESHOLD = 6;
  listen(sheet, 'pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, active: false };
  });
  listen(sheet, 'pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx0 = e.clientX - drag.x, dy0 = e.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx0) + Math.abs(dy0) < THRESHOLD) return;
      // a finger that starts mostly up or down is scrolling the page: leave it to the browser
      if (drag.type !== 'mouse' && Math.abs(dy0) > Math.abs(dx0)) { drag = null; return; }
      drag.active = true;
      sheet.classList.add('dragging');
      try { sheet.setPointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    }
    const dx = e.clientX - drag.lastX, dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    state.t += dx * 0.5;
    if (drag.type === 'mouse') state.p = Math.max(-5, Math.min(89, state.p + dy * 0.4));
    schedule();
  });
  function endDrag(e, cancelled) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const was = drag.active;
    drag = null;
    sheet.classList.remove('dragging');
    if (e) try { if (sheet.hasPointerCapture(e.pointerId)) sheet.releasePointerCapture(e.pointerId); } catch (err) { /* gone */ }
    // the click that follows a drag must not select a part
    if (was && !cancelled) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
  }
  listen(sheet, 'pointerup', (e) => endDrag(e, false));
  listen(sheet, 'pointercancel', (e) => endDrag(e, true));
  listen(sheet, 'lostpointercapture', (e) => { if (drag && drag.active && e.pointerId === drag.id) endDrag(e, false); });

  // the parts list opens by itself on a wide screen, where it sits beside the selected part
  const wide = window.matchMedia ? window.matchMedia('(min-width: 760px)') : null;
  if (wide) {
    treePane.open = wide.matches;
    const onWide = (e) => { treePane.open = e.matches; };
    if (wide.addEventListener) { wide.addEventListener('change', onWide); on.push(() => wide.removeEventListener('change', onWide)); }
  }

  // redraw when the sheet changes size
  let ro = null, rto = 0;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => { clearTimeout(rto); rto = setTimeout(schedule, 60); });
    ro.observe(sheet);
  }

  // ---- first paint ---------------------------------------------------------------------------------------------
  renderTree();
  renderProps();
  draw();

  return {
    destroy() {
      on.forEach((off) => off());
      if (ro) ro.disconnect();
      clearTimeout(rto);
      if (raf) cancelAnimationFrame(raf);
      root.textContent = '';
      if (after) after.textContent = '';
    },
  };
}
