// "How it is wired": a block diagram laid out from the data, ported from the studio's round 4 build.py (wiring_svg).
// Each block sits one layer below the furthest thing that feeds it, in the column of its first feeder. Links run
// straight down, or turn one corner; each carries its words. Blocks in the group "box" share one outline with the
// project's own name for it (boxLabel), and a tint as a second cue. The table beside it says the same in words.
import type { WiringNode } from '@/lib/project';

type Link = { from: string; to: string; how: string };

function wrap(s: string, max: number) {
  const lines: string[] = [];
  let cur = '';
  s.split(' ').forEach((w) => {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? cur + ' ' + w : w;
  });
  if (cur) lines.push(cur);
  return lines;
}

export function WiringDiagram({ nodes, links: all, boxLabel, markerId }: { nodes: WiringNode[]; links: Link[]; boxLabel: string; markerId: string }) {
  const ids = nodes.map((n) => n.id);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links = all.filter((l) => byId.has(l.from) && byId.has(l.to));
  const layer: Record<string, number> = Object.fromEntries(ids.map((i) => [i, 0]));
  // longest path; the cap stops a loop in the data from running for ever
  ids.forEach(() => links.forEach((l) => (layer[l.to] = Math.max(layer[l.to], layer[l.from] + 1))));
  ids.forEach((i) => (layer[i] = Math.min(layer[i], ids.length - 1)));
  const parents: Record<string, string[]> = Object.fromEntries(ids.map((i) => [i, links.filter((l) => l.to === i).map((l) => l.from)]));
  const col: Record<string, number> = {};
  const used: Record<number, Set<number>> = {};
  const maxLayer = Math.max(...ids.map((i) => layer[i]));
  for (let lay = 0; lay <= maxLayer; lay++) {
    ids.forEach((i) => {
      if (layer[i] !== lay) return;
      let c = parents[i].length && parents[i][0] in col ? col[parents[i][0]] : 0;
      const taken = (used[lay] ??= new Set());
      while (taken.has(c)) c++;
      col[i] = c;
      taken.add(c);
    });
  }
  const w = 150, h = 52, gx = 62, gy = 50, m = 16;
  const left = (i: string) => m + col[i] * (w + gx);
  const top = (i: string) => m + layer[i] * (h + gy);
  const midx = (i: string) => left(i) + w / 2;
  const midy = (i: string) => top(i) + h / 2;
  const maxCol = Math.max(...ids.map((i) => col[i]));
  const width = m * 2 + (maxCol + 1) * w + maxCol * gx;
  const height = m * 2 + (maxLayer + 1) * h + maxLayer * gy;
  // links that land on a block's top edge fan out along it
  const intoTop: Record<string, number[]> = {};
  links.forEach((l, k) => {
    if (col[l.from] === col[l.to] || layer[l.to] === layer[l.from] + 1) (intoTop[l.to] ??= []).push(k);
  });
  const land: Record<number, number> = {};
  Object.entries(intoTop).forEach(([b, ks]) => {
    ks.sort((x, y) => col[links[x].from] - col[links[y].from] || x - y);
    ks.forEach((k, j) => (land[k] = midx(b) + (j - (ks.length - 1) / 2) * 44));
  });
  const box = nodes.filter((n) => n.group === 'box').map((n) => n.id);
  const pad = 10;
  const bx0 = Math.min(...box.map(left)) - pad, bx1 = Math.max(...box.map(left)) + w + pad;
  const by0 = Math.min(...box.map(top)) - pad, by1 = Math.max(...box.map(top)) + h + pad;
  const r = (n: number) => Math.round(n);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
          <path className="fill" d="M0 1l10 4l-10 4z" />
        </marker>
      </defs>
      {box.length > 0 && (
        <>
          <rect className="ln wbox" x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} />
          {boxLabel && (
            <text className="wboxl" x={bx1 - 8} y={by0 + 20} textAnchor="end">
              {boxLabel}
            </text>
          )}
        </>
      )}
      {links.map((l, k) => {
        const a = l.from, b = l.to;
        let d: string, lab: React.ReactNode;
        if (col[a] === col[b]) {
          const x = land[k];
          d = `M${r(x)} ${r(top(a) + h)}V${r(top(b))}`;
          lab = <text className="sm" x={r(x + 8)} y={r(top(a) + h + gy / 2 + 5)}>{l.how}</text>;
        } else if (layer[b] === layer[a] + 1) {
          const x = land[k];
          const side = col[b] < col[a] ? left(a) : left(a) + w;
          d = `M${r(side)} ${r(midy(a))}H${r(x)}V${r(top(b))}`;
          lab = <text className="sm" x={r((side + x) / 2)} y={r(midy(a) - 7)} textAnchor="middle">{l.how}</text>;
        } else {
          const side = col[a] > col[b] ? left(b) + w : left(b);
          d = `M${r(midx(a))} ${r(top(a) + h)}V${r(midy(b))}H${r(side)}`;
          lab = <text className="sm" x={r((midx(a) + side) / 2)} y={r(midy(b) - 7)} textAnchor="middle">{l.how}</text>;
        }
        return (
          <g key={k}>
            <path className="ln wl" d={d} markerEnd={`url(#${markerId})`} />
            {lab}
          </g>
        );
      })}
      {nodes.map((n) => {
        const lines = wrap(n.label, 18);
        const y0 = midy(n.id) + 5 - (lines.length - 1) * 8.5;
        return (
          <g key={n.id}>
            <rect className={`ln2 ${n.group === 'box' ? 'shade' : 'pfill'} wb`} x={left(n.id)} y={top(n.id)} width={w} height={h} />
            {lines.map((ln, j) => (
              <text key={j} x={r(midx(n.id))} y={(y0 + j * 17).toFixed(1)} textAnchor="middle">
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
