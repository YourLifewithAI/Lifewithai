// @ts-nocheck
/* The drawing's renderer: an orthographic line drawing of the as-built model into an inline SVG, in CSS pixels.
   Ported from the studio's round 4 engine (render.js), as-built only: no option ghost, no software sheet, one start view.

   Eye at +x' after yaw t about z, lifted by tilt p. View vector (rotated frame) v = (-cos p, 0, -sin p), in the world
   vw = (-cos p cos t, cos p sin t, -sin p); depth = position . v, larger is farther.
   Every solid is drawn as an extrusion: two matching rings of points (a box's bottom and top, a cylinder's two end circles
   along any direction, a prism's two outlines, a hex's two end faces from its eight corners) joined by side quads, with
   the rings as caps. A face is filled when it faces the eye; an edge is outlined where the solid turns its back (silhouette)
   or folds sharply (crease). Solids are drawn back to front: where two overlap on screen and their boxes are apart along
   a world axis, the one on the eye's side of that gap is drawn later; otherwise the nearer centre is.

   No words live here: every caption comes in through opts.words (the page's data file). Only unit symbols ("mm") and
   number formatting stay in code. */

const NS = 'http://www.w3.org/2000/svg';
const RING = 20; // points round a cylinder
const CREASE = Math.cos(Math.PI / 6); // faces meeting at more than 30 degrees show their shared edge
const EPS = 0.6; // mm: boxes this close count as apart (touching parts)
// The start view is the rear-left three-quarter: from the front the camera can hide the main computer.
export const ISO = { t: 145, p: 28 };

export function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function txt(parent, x, y, s, cls, anchor) {
  const t = el('text', { x, y, class: cls, 'text-anchor': anchor || 'start' }, parent);
  t.textContent = s;
  return t;
}
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

function camera(tDeg, pDeg) {
  const t = (tDeg * Math.PI) / 180, p = (pDeg * Math.PI) / 180;
  const ct = Math.cos(t), st = Math.sin(t), cp = Math.cos(p), sp = Math.sin(p);
  return {
    // world -> screen (x right, y down, unscaled mm) and depth
    proj(x, y, z) {
      const r0 = x * ct - y * st, r1 = x * st + y * ct;
      return { x: r1, y: r0 * sp - z * cp, d: -r0 * cp - z * sp };
    },
    vw: [-cp * ct, cp * st, -sp],
    p,
    t,
  };
}

// ---- geometry -----------------------------------------------------------------------------------------------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function unit(a) {
  const l = Math.sqrt(dot(a, a));
  return l > 1e-9 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0];
}
function centroid(ps) {
  const c = [0, 0, 0];
  ps.forEach((p) => { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; });
  return [c[0] / ps.length, c[1] / ps.length, c[2] / ps.length];
}
// Newell's normal: right for any flat polygon, convex or not
function newell(ps) {
  const n = [0, 0, 0];
  for (let i = 0; i < ps.length; i++) {
    const a = ps[i], b = ps[(i + 1) % ps.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return n;
}
// The two rings of a solid, in world mm.
function rings(s) {
  if (s.kind === 'prism' && s.rings) return [s.rings[0], s.rings[1]];
  // Blender bound_box order: corners 0-3 are one end face, 4-7 the other, 0 with 4, 1 with 5 and so on
  if (s.kind === 'hex' && s.corners) return [s.corners.slice(0, 4), s.corners.slice(4, 8)];
  if (s.kind === 'cyl') {
    const d = unit(s.dir || (s.axis === 'x' ? [1, 0, 0] : s.axis === 'y' ? [0, 1, 0] : [0, 0, 1]));
    const u = unit(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u), hl = s.len / 2, A = [], B = [];
    for (let i = 0; i < RING; i++) {
      const a = (i / RING) * Math.PI * 2, c = Math.cos(a) * s.r, sn = Math.sin(a) * s.r;
      const o = [s.cx + u[0] * c + v[0] * sn, s.cy + u[1] * c + v[1] * sn, s.cz + u[2] * c + v[2] * sn];
      A.push([o[0] - d[0] * hl, o[1] - d[1] * hl, o[2] - d[2] * hl]);
      B.push([o[0] + d[0] * hl, o[1] + d[1] * hl, o[2] + d[2] * hl]);
    }
    return [A, B];
  }
  const x0 = s.cx - s.l / 2, x1 = s.cx + s.l / 2, y0 = s.cy - s.w / 2, y1 = s.cy + s.w / 2, z0 = s.cz - s.h / 2, z1 = s.cz + s.h / 2;
  return [
    [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]],
    [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
  ];
}
// Faces (points as indices into pts, outward normal) and edges (two points, the two faces they join). Cached per solid.
function geom(s) {
  if (s._geo) return s._geo;
  const R = rings(s), A = R[0], B = R[1], n = A.length, pts = A.concat(B), faces = [], edges = [];
  const e = sub(centroid(B), centroid(A)), turn = dot(newell(A), e) < 0 ? -1 : 1;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, q = [i, j, n + j, n + i];
    const nn = unit(newell(q.map((k) => pts[k])));
    faces.push({ idx: q, n: [nn[0] * turn, nn[1] * turn, nn[2] * turn] });
  }
  let na = unit(newell(A)), nb = unit(newell(B));
  if (dot(na, e) > 0) na = [-na[0], -na[1], -na[2]];
  if (dot(nb, e) < 0) nb = [-nb[0], -nb[1], -nb[2]];
  const ca = faces.length, cb = ca + 1;
  faces.push({ idx: A.map((p, k) => k), n: na, cap: true });
  faces.push({ idx: B.map((p, k) => n + k), n: nb, cap: true });
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    edges.push([i, j, i, ca]);
    edges.push([n + i, n + j, i, cb]);
    edges.push([i, n + i, (i - 1 + n) % n, i]);
  }
  const b = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9, z0: 1e9, z1: -1e9 };
  pts.forEach((p) => {
    b.x0 = Math.min(b.x0, p[0]); b.x1 = Math.max(b.x1, p[0]);
    b.y0 = Math.min(b.y0, p[1]); b.y1 = Math.max(b.y1, p[1]);
    b.z0 = Math.min(b.z0, p[2]); b.z1 = Math.max(b.z1, p[2]);
  });
  s._geo = { pts, faces, edges, box: b };
  return s._geo;
}

function hull(pts) {
  pts = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length < 3) return pts;
  const crs = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [], upper = [];
  for (let i = 0; i < pts.length; i++) {
    while (lower.length >= 2 && crs(lower[lower.length - 2], lower[lower.length - 1], pts[i]) <= 0) lower.pop();
    lower.push(pts[i]);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && crs(upper[upper.length - 2], upper[upper.length - 1], pts[i]) <= 0) upper.pop();
    upper.push(pts[i]);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

// flat fill per part; a small lightness shift so top faces read lighter than sides. Set as a style so var() resolves.
function shade(fam, n, cam) {
  const base = 'var(--f-' + fam + ')';
  if (n[2] > 0.5) return 'color-mix(in srgb, ' + base + ', white 22%)';
  if (n[2] < -0.5) return 'color-mix(in srgb, ' + base + ', black 18%)';
  // side faces: the one facing more toward the eye is a touch darker than the one in profile
  const facing = -(n[0] * cam.vw[0] + n[1] * cam.vw[1]);
  return facing > 0.6 ? 'color-mix(in srgb, ' + base + ', black 12%)' : base;
}

const pointsAttr = (ps) => ps.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');

// Explode lifts each unit (a part, or the parts built into it, on one level) by how high its bottom sits above the
// bottom plate; what is on or below the bottom plate stays put.
function lifts(scene, explode) {
  const low = {}, base = scene.floorDeckTop - 3, out = {};
  scene.solids.forEach((s) => {
    const u = s.unit || s.id;
    low[u] = Math.min(low[u] === undefined ? 1e9 : low[u], geom(s).box.z0);
  });
  scene.solids.forEach((s) => { out[s.id] = explode * Math.max(0, low[s.unit || s.id] - base) * 1.1; });
  return out;
}

// The directions a solid's flat faces give for telling it apart from a neighbour: its long axis, and the sides of a
// box, hex or outline (a cylinder's many sides are left out).
function axesOf(g) {
  if (g.axes) return g.axes;
  const sides = g.faces.length - 2, out = [g.faces[sides].n];
  if (sides <= 12) for (let i = 0; i < sides; i++) out.push(g.faces[i].n);
  g.axes = out.filter((n) => n[0] || n[1] || n[2]);
  return g.axes;
}
function spread(pts, L, n) {
  let lo = 1e18, hi = -1e18;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], v = p[0] * n[0] + p[1] * n[1] + (p[2] + L) * n[2];
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return [lo, hi];
}
// 1 when a is in front of b, -1 when b is in front, 0 when nothing tells (or the two cannot overlap on screen). A gap
// between the two is a plane that separates them, so its answer is sure (1 or -1); for parts sunk into each other it is a
// guess from their centres (0.5 or -0.5).
function inFront(a, b, vw) {
  let vote = 0;
  const A = a.box, B = b.box;
  const lo = [A.x0, A.y0, A.z0], hi = [A.x1, A.y1, A.z1], lo2 = [B.x0, B.y0, B.z0], hi2 = [B.x1, B.y1, B.z1];
  // boxes apart along a world axis: the one on the eye's side of the gap is in front (two axes that disagree mean the
  // two cannot overlap on screen)
  for (let k = 0; k < 3; k++) {
    if (Math.abs(vw[k]) < 1e-6) continue;
    let v = 0;
    if (hi[k] <= lo2[k] + EPS) v = vw[k] > 0 ? 1 : -1; // b lies on the + side of a
    else if (hi2[k] <= lo[k] + EPS) v = vw[k] > 0 ? -1 : 1;
    if (!v) continue;
    if (vote && v !== vote) return 0;
    vote = v;
  }
  if (vote) return vote;
  // boxes that run into each other (tilted or touching parts): look for a gap along either solid's own face directions
  const axes = axesOf(a.g).concat(axesOf(b.g));
  for (let k = 0; k < axes.length; k++) {
    const n = axes[k], dv = dot(n, vw);
    if (Math.abs(dv) < 1e-3) continue;
    const sa = spread(a.g.pts, a.L, n), sb = spread(b.g.pts, b.L, n);
    if (sa[1] <= sb[0] + EPS) return dv > 0 ? 1 : -1;
    if (sb[1] <= sa[0] + EPS) return dv > 0 ? -1 : 1;
  }
  // no gap at all (one part sunk into another): the nearer centre is in front, as a guess
  return a.d <= b.d ? 0.5 : -0.5;
}

// Groups of solids that must each come before the next round a loop (Tarjan's strongly connected components).
function groups(n, after) {
  const index = [], low = [], on = [], stack = [], comp = [];
  let next = 0, nc = 0;
  for (let i = 0; i < n; i++) { index.push(-1); low.push(0); on.push(false); comp.push(-1); }
  function visit(v) {
    index[v] = low[v] = next++;
    stack.push(v);
    on[v] = true;
    after[v].forEach((w) => {
      if (index[w] < 0) { visit(w); low[v] = Math.min(low[v], low[w]); }
      else if (on[w]) low[v] = Math.min(low[v], index[w]);
    });
    if (low[v] === index[v]) {
      let w;
      do { w = stack.pop(); on[w] = false; comp[w] = nc; } while (w !== v);
      nc++;
    }
  }
  for (let i = 0; i < n; i++) if (index[i] < 0) visit(i);
  return { comp, n: nc };
}
// Back to front: where two solids overlap on screen, inFront says which is drawn later. A loop can only come from the
// guesses, so inside a loop the guesses are dropped. Then the groups that still loop are drawn as one: of the groups whose
// predecessors are all drawn, the one with the farthest solid goes first, so a loop never pulls a plate over what sits on it;
// inside such a group, the solid with the fewest undrawn predecessors goes first (then the farthest).
function paintOrder(items, vw) {
  const n = items.length, edges = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const a = items[i], b = items[j];
      if (a.sx1 < b.sx0 || b.sx1 < a.sx0 || a.sy1 < b.sy0 || b.sy1 < a.sy0) continue;
      const vote = inFront(a, b, vw); // above 0: a is in front, so b is drawn first
      if (vote) edges.push(vote > 0 ? [j, i, vote > 0.75] : [i, j, vote < -0.75]);
    }
  const adj = (list) => {
    const out = [];
    for (let k = 0; k < n; k++) out.push([]);
    list.forEach((e) => out[e[0]].push(e[1]));
    return out;
  };
  const g0 = groups(n, adj(edges));
  const keep = edges.filter((e) => e[2] || g0.comp[e[0]] !== g0.comp[e[1]]);
  const after = adj(keep), G = groups(n, after), comp = G.comp;
  const members = [], cin = [], far = [];
  for (let i = 0; i < G.n; i++) { members.push([]); cin.push(0); far.push(-1e18); }
  for (let i = 0; i < n; i++) { members[comp[i]].push(i); far[comp[i]] = Math.max(far[comp[i]], items[i].d); }
  keep.forEach((e) => { if (comp[e[0]] !== comp[e[1]]) cin[comp[e[1]]]++; });
  const done = [], drawn = [];
  let left = G.n;
  for (let i = 0; i < G.n; i++) drawn.push(false);
  while (left) {
    let pick = -1;
    for (let i = 0; i < G.n; i++) if (!drawn[i] && cin[i] === 0 && (pick < 0 || far[i] > far[pick])) pick = i;
    if (pick < 0) for (let i = 0; i < G.n; i++) if (!drawn[i] && (pick < 0 || far[i] > far[pick])) pick = i; // cannot happen
    drawn[pick] = true;
    left--;
    const m = members[pick].slice(), inner = {};
    m.forEach((v) => { inner[v] = 0; });
    m.forEach((v) => after[v].forEach((w) => { if (comp[w] === pick) inner[w]++; }));
    while (m.length) {
      let best = 0;
      for (let j = 1; j < m.length; j++)
        if (inner[m[j]] < inner[m[best]] || (inner[m[j]] === inner[m[best]] && items[m[j]].d > items[m[best]].d)) best = j;
      const v = m.splice(best, 1)[0];
      done.push(items[v]);
      after[v].forEach((w) => { if (comp[w] === pick) inner[w]--; else cin[comp[w]]--; });
    }
  }
  return done;
}

/* Draw the scene.
   opts: { W, H, frame, view: {t,p}, viewName, explode, sel, labelsOn, numbered, titleBlock, rank(key), focusId,
           aria(key), title, words }
   Returns { key: [{n, text}], tbText }. */
export function draw(svg, scene, opts) {
  const W = opts.words;
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute('viewBox', '0 0 ' + opts.W + ' ' + opts.H);
  const cam = camera(opts.view.t, opts.view.p), lift = lifts(scene, opts.explode || 0);

  // project every solid once (unscaled), then fit the frame
  let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
  const items = scene.solids.map((s) => {
    const g = geom(s), L = lift[s.id], q = g.pts.map((p) => cam.proj(p[0], p[1], p[2] + L));
    q.forEach((p) => {
      minx = Math.min(minx, p.x); maxx = Math.max(maxx, p.x);
      miny = Math.min(miny, p.y); maxy = Math.max(maxy, p.y);
    });
    const b = g.box, c = cam.proj((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2 + L);
    return { s, g, q, L, d: c.d, box: { x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, z0: b.z0 + L, z1: b.z1 + L } };
  });
  const w = Math.max(1, maxx - minx), h = Math.max(1, maxy - miny), fr = opts.frame;
  const F = { s: Math.min(fr.w / w, fr.h / h, 2.4) };
  F.ox = fr.x + fr.w / 2 - ((minx + maxx) / 2) * F.s;
  F.oy = fr.y + fr.h / 2 - ((miny + maxy) / 2) * F.s;
  const S = (q) => ({ x: F.ox + q.x * F.s, y: F.oy + q.y * F.s, d: q.d });
  const P = (p) => S(cam.proj(p[0], p[1], p[2]));
  items.forEach((it) => {
    it.p = it.q.map(S);
    it.sx0 = 1e9; it.sx1 = -1e9; it.sy0 = 1e9; it.sy1 = -1e9;
    it.p.forEach((p) => {
      it.sx0 = Math.min(it.sx0, p.x); it.sx1 = Math.max(it.sx1, p.x);
      it.sy0 = Math.min(it.sy0, p.y); it.sy1 = Math.max(it.sy1, p.y);
    });
  });

  // Grid: on the floor when the eye is above it, else on the back plane, 10 mm minor and 50 mm major, in mm.
  const gg = el('g', { 'aria-hidden': 'true' }, svg);
  const bd = scene.bounds, pad = 60;
  if (opts.view.p >= 8) {
    const x0 = Math.floor((bd.minx - pad) / 50) * 50, x1 = Math.ceil((bd.maxx + pad) / 50) * 50;
    const y0 = Math.floor((bd.miny - pad) / 50) * 50, y1 = Math.ceil((bd.maxy + pad) / 50) * 50;
    for (let k = x0; k <= x1; k += 10) {
      const a1 = P([k, y0, 0]), a2 = P([k, y1, 0]);
      el('line', { x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y, class: 'gridline' + (k % 50 === 0 ? ' major' : '') }, gg);
    }
    for (let k = y0; k <= y1; k += 10) {
      const b1 = P([x0, k, 0]), b2 = P([x1, k, 0]);
      el('line', { x1: b1.x, y1: b1.y, x2: b2.x, y2: b2.y, class: 'gridline' + (k % 50 === 0 ? ' major' : '') }, gg);
    }
  } else {
    const step = 10 * F.s, gx = F.ox % (step * 5), gy = F.oy % (step * 5);
    for (let m = gx - step * 5; m < opts.W; m += step) {
      const maj = Math.abs(((m - gx) / step) % 5) < 0.01;
      el('line', { x1: m, y1: 0, x2: m, y2: opts.H, class: 'gridline' + (maj ? ' major' : '') }, gg);
    }
    for (let m = gy - step * 5; m < opts.H; m += step) {
      const maj = Math.abs(((m - gy) / step) % 5) < 0.01;
      el('line', { x1: 0, y1: m, x2: opts.W, y2: m, class: 'gridline' + (maj ? ' major' : '') }, gg);
    }
  }

  const vw = cam.vw, anchors = {}, hitsBy = {}, hitOrder = [], keyOfSolid = {};
  const parts = el('g', { class: 'parts' }, svg);
  const picks = el('g', { class: 'taps' }, svg);
  paintOrder(items, vw).forEach((it) => {
    const s = it.s, g = it.g, pp = it.p, key = s.key || s.partId || s.id;
    const on = opts.sel && (opts.sel === key || opts.sel === s.owner);
    const grp = el('g', { class: 'part' + (on ? ' sel' : '') + (s.quiet ? ' quiet' : ''), 'data-id': key }, parts);
    const vis = g.faces.map((f) => dot(f.n, vw) < -1e-6);
    // faces toward the eye, farthest first (a notched outline can put one in front of another)
    g.faces
      .map((f, i) => ({ f, i, d: f.idx.reduce((a, k) => a + pp[k].d, 0) / f.idx.length }))
      .filter((x) => vis[x.i])
      .sort((a, b) => b.d - a.d)
      .forEach((x) => {
        el('polygon', { points: pointsAttr(x.f.idx.map((k) => pp[k])), class: 'face side', style: 'fill:' + shade(s.fill, x.f.n, cam) }, grp);
      });
    // outline: silhouette edges and sharp folds between faces the eye sees
    let d = '';
    g.edges.forEach((e) => {
      const v1 = vis[e[2]], v2 = vis[e[3]];
      if (!(v1 || v2)) return;
      if (v1 && v2 && dot(g.faces[e[2]].n, g.faces[e[3]].n) > CREASE) return;
      const a = pp[e[0]], b = pp[e[1]];
      d += 'M' + a.x.toFixed(1) + ',' + a.y.toFixed(1) + 'L' + b.x.toFixed(1) + ',' + b.y.toFixed(1);
    });
    if (d) el('path', { d, class: 'sil' }, grp);
    // label anchor: the middle of the top of the solid's box
    const b = it.box, top = P([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, b.z1]);
    anchors[s.id] = top;
    keyOfSolid[s.id] = key;
    // a pick area per solid, in painter order, so a tap lands on the part drawn on top there
    const hl = hull(pp);
    el('polygon', { points: pointsAttr(hl), class: 'tap', 'data-id': key }, picks);
    if (!hitsBy[key]) { hitsBy[key] = { s, hulls: [], all: [] }; hitOrder.push(key); }
    const hb = hitsBy[key];
    if (!s.quiet) hb.hulls.push(hl);
    if (s.main || (s.role === 'deck' && !hb.s.main) || (hb.s.quiet && !s.quiet)) hb.s = s;
    hb.all.push(hl);
  });

  // Keyboard layer: one focusable button per part (the four wheels are one stop, the two cells one stop), with a
  // roving tabindex so the whole drawing is one tab stop; arrow keys move between parts (engine.js), in data-rank order.
  // Its shapes only draw the focus ring: taps go to the pick areas above, which keep painter order.
  const rankOf = opts.rank || (() => 0);
  const firstKey = hitOrder.slice().sort((a, b) => rankOf(a) - rankOf(b))[0];
  const focusKey = opts.focusId && hitsBy[opts.focusId] ? opts.focusId : opts.sel && hitsBy[opts.sel] ? opts.sel : firstKey;
  const hg = el('g', { class: 'hits' }, svg);
  hitOrder.forEach((key) => {
    const hb = hitsBy[key], on = opts.sel === key;
    const g2 = el('g', {
      class: 'hitg', 'data-id': key, 'data-rank': rankOf(key), role: 'button', tabindex: key === focusKey ? 0 : -1,
      'aria-label': opts.aria ? opts.aria(key, hb.s) : hb.s.name, 'aria-pressed': String(on),
    }, hg);
    (hb.hulls.length ? hb.hulls : hb.all).forEach((pts) => el('polygon', { points: pointsAttr(pts), class: 'hit' }, g2));
  });

  // Numbered labels: a small circled number at each anchor, the key printed under the sheet. Each label's number is
  // fixed by its place in the model's own label list, so it never changes as the model turns or explodes. Sorting by
  // screen position only decides which circle is placed first (to keep them apart), never a number. A number picks its
  // part (data-id, read by engine.js's click handler) and turns red while that part is picked; keyboard users pick
  // parts through the focusable layer above, so the numbers stay out of the accessibility tree.
  const keyList = [];
  if (opts.labelsOn && opts.numbered) {
    const ng = el('g', { class: 'labels', 'aria-hidden': 'true' }, svg);
    const pts = [];
    scene.labels.forEach((L, i) => {
      keyList.push({ n: i + 1, text: L.text, id: keyOfSolid[L.solid] || null });
      const a = anchors[L.solid];
      if (a) pts.push({ a, n: i + 1, solid: L.solid });
    });
    pts.sort((p, q) => p.a.y - q.a.y || p.a.x - q.a.x);
    const placed = [];
    pts.forEach((it) => {
      const right = it.a.x < opts.W / 2;
      let x = it.a.x + (right ? 16 : -16), y = it.a.y - 14, moved = true, guard = 0;
      while (moved && guard++ < 12) {
        moved = false;
        placed.forEach((q) => {
          if (Math.abs(q.x - x) < 24 && Math.abs(q.y - y) < 24) { y = q.y + 24; moved = true; }
        });
      }
      x = Math.max(12, Math.min(opts.W - 12, x));
      y = Math.max(12, Math.min(opts.H - 12, y));
      placed.push({ x, y });
      const id = keyOfSolid[it.solid];
      const lg = el('g', { class: 'lbl' + (id && opts.sel === id ? ' sel' : ''), 'data-n': it.n, 'data-solid': it.solid, 'data-id': id }, ng);
      el('line', { x1: it.a.x, y1: it.a.y, x2: x, y2: y, class: 'leader' }, lg);
      el('circle', { cx: it.a.x, cy: it.a.y, r: 2.2, class: 'leader-dot' }, lg);
      // numbers sit 24 px apart: a 13.5 px pick ring is as big as it can be without reaching a neighbour's circle
      el('circle', { cx: x, cy: y, r: 13.5, class: 'numhit' }, lg);
      el('circle', { cx: x, cy: y, r: 10.5, class: 'numc' }, lg);
      txt(lg, x, y + 4.5, String(it.n), 'num', 'middle');
    });
  }

  // Leader-line labels (wide sheets): the part's name at the sheet's edge.
  if (opts.labelsOn && !opts.numbered) {
    const lg = el('g', { class: 'labels', 'aria-hidden': 'true' }, svg);
    const left = [], right = [], midX = opts.frame.x + opts.frame.w / 2;
    scene.labels.forEach((L, i) => {
      const a = anchors[L.solid];
      if (!a) return;
      (a.x < midX ? left : right).push({ a, text: L.text, n: i + 1, solid: L.solid });
    });
    const place = (list, side) => {
      list.sort((p, q) => p.a.y - q.a.y);
      const minY = 14, maxY = opts.H - (side === 'right' ? 92 : 40), gapY = 18;
      let y = minY;
      list.forEach((it) => { it.y = Math.max(y, it.a.y - 8); y = it.y + gapY; });
      // push back up if the last ones ran off the bottom
      for (let i = list.length - 1, lim = maxY; i >= 0; i--) {
        if (list[i].y > lim) list[i].y = lim;
        lim = list[i].y - gapY;
      }
      list.forEach((it) => {
        const lx = side === 'left' ? 8 : opts.W - 8;
        const ex = side === 'left' ? Math.min(it.a.x - 10, opts.frame.x - 4) : Math.max(it.a.x + 10, opts.frame.x + opts.frame.w + 4);
        const tw = it.text.length * 6.3 + 6, bx = side === 'left' ? lx - 2 : lx - tw + 2;
        const g3 = el('g', { class: 'lbl', 'data-n': it.n, 'data-solid': it.solid }, lg);
        el('polyline', {
          points: it.a.x.toFixed(1) + ',' + it.a.y.toFixed(1) + ' ' + ex.toFixed(1) + ',' + it.y.toFixed(1) + ' ' +
            (side === 'left' ? bx + tw : bx).toFixed(1) + ',' + it.y.toFixed(1),
          class: 'leader',
        }, g3);
        el('circle', { cx: it.a.x, cy: it.a.y, r: 2.2, class: 'leader-dot' }, g3);
        el('rect', { x: bx, y: it.y - 8, width: tw, height: 15, class: 'lab-bg' }, g3);
        txt(g3, lx, it.y + 3.5, it.text, 'lab', side === 'left' ? 'start' : 'end');
      });
    };
    place(left, 'left');
    place(right, 'right');
  }

  // Scale bar (bottom left), axis triad (top left), title block (bottom right).
  const ui = el('g', { 'aria-hidden': 'true' }, svg);
  const sb = 50 * F.s, sx = 12, sy = opts.H - 18;
  el('line', { x1: sx, y1: sy, x2: sx + sb, y2: sy, class: 'scale' }, ui);
  el('line', { x1: sx, y1: sy - 4, x2: sx, y2: sy + 4, class: 'scale' }, ui);
  el('line', { x1: sx + sb, y1: sy - 4, x2: sx + sb, y2: sy + 4, class: 'scale' }, ui);
  txt(ui, sx + sb / 2, sy - 6, '50 mm', 'tbt', 'middle');
  const tri = { x: 46, y: 40 }, TL = 22, o = cam.proj(0, 0, 0);
  [[[1, 0, 0], W.axisFront], [[0, 1, 0], W.axisLeft], [[0, 0, 1], W.axisUp]].forEach(([v, name]) => {
    const q = cam.proj(v[0], v[1], v[2]), qx = q.x - o.x, qy = q.y - o.y;
    const ex = tri.x + qx * TL, ey = tri.y + qy * TL;
    if (Math.abs(qx) + Math.abs(qy) < 0.05) return;
    el('line', { x1: tri.x, y1: tri.y, x2: ex, y2: ey, class: 'triad' }, ui);
    txt(ui, ex + qx * 9, ey + qy * 9 + 3.5, name, 'triad-t', 'middle');
  });
  const viewText = fill(W.viewWords, {
    view: opts.viewName,
    t: Math.round((((opts.view.t % 360) + 360) % 360)),
    p: Math.round(opts.view.p),
  });
  const scaleText = fill(W.scaleWords, { s: F.s.toFixed(2) });
  if (opts.titleBlock) {
    // the block grows to fit its longest line, whatever the words say
    const tbh = 55, box = el('rect', { class: 'tbt-box' }, ui), rule = el('line', { class: 'tbt-box' }, ui);
    const t1 = txt(ui, 0, 0, opts.title || '', 'tbt tbt-strong'), t2 = txt(ui, 0, 0, W.sheetName, 'tbt', 'end');
    const t3 = txt(ui, 0, 0, viewText, 'tbt'), t4 = txt(ui, 0, 0, scaleText, 'tbt');
    const len = (t, s) => { try { return t.getComputedTextLength() || s.length * 7; } catch (e) { return s.length * 7; } };
    const tbw = Math.ceil(Math.max(156, len(t1, opts.title || '') + len(t2, W.sheetName) + 28, len(t3, viewText) + 14, len(t4, scaleText) + 14));
    const tbx = opts.W - tbw - 8, tby = opts.H - tbh - 8;
    [[box, { x: tbx, y: tby, width: tbw, height: tbh }], [rule, { x1: tbx, y1: tby + 19, x2: tbx + tbw, y2: tby + 19 }],
      [t1, { x: tbx + 7, y: tby + 13.5 }], [t2, { x: tbx + tbw - 7, y: tby + 13.5 }],
      [t3, { x: tbx + 7, y: tby + 33 }], [t4, { x: tbx + 7, y: tby + 48 }]].forEach(([e, a]) => {
      for (const k in a) e.setAttribute(k, a[k]);
    });
  }
  const tbText = fill(W.sheetLine, { name: opts.title || '', sheet: W.sheetName.toLowerCase(), view: viewText, scale: scaleText });
  return { key: keyList, tbText };
}
