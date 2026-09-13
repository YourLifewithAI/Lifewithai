'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import type { FloorData, FloorPlace, FloorPlaceKind, FloorSystem } from '@/lib/types';

// ============================================================
// FloorPlan — a floor of Arcology One, drawn from its stories
// ============================================================
// Every floor shares the same bones (a rimpark around the outside, a glass
// wall, a ring corridor, radial corridors, an atrium around a central column).
// What differs is what the residents put in it: bays, rooms, murals, a hill.
// Those come from content/floors/<n>.json, and so do the pins.

const VIEW = 520;
const EDGE = 30;          // outer plate inset
const RIM = 34;           // rimpark width
const PLATE_R = 64;       // outer corner radius
const INNER_R = 44;

const KIND_LABEL: Record<FloorPlaceKind, string> = {
  commons: 'Commons',
  growing: 'Growing',
  home: 'Home',
  edge: 'The edge',
  transit: 'Transit',
};

interface Props {
  floor: FloorData;
}

export default function FloorPlan({ floor }: Props) {
  const [selectedId, setSelectedId] = useState<string>(floor.places[0]?.id ?? '');
  const selected = floor.places.find((p) => p.id === selectedId) ?? floor.places[0];
  const systemFor = (p: FloorPlace | undefined): FloorSystem | undefined =>
    p?.system ? floor.systems.find((s) => s.id === p.system) : undefined;

  const { plan } = floor;
  const c = VIEW / 2;
  const innerEdge = EDGE + RIM;
  const innerSize = VIEW - innerEdge * 2;
  const ring = plan.ringInset;
  const ringSize = VIEW - ring * 2;

  // Radial corridors: from the atrium edge out to the glass wall.
  const spokes = Array.from({ length: plan.spokes }, (_, i) => {
    const a = (i / plan.spokes) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const start = { x: c + cos * plan.atriumRadius, y: c + sin * plan.atriumRadius };
    // stop at the inner (glass) boundary, approximated as a square
    const t = (innerSize / 2) / Math.max(Math.abs(cos), Math.abs(sin));
    const end = { x: c + cos * t * 0.94, y: c + sin * t * 0.94 };
    // junction planter where the spoke crosses the ring corridor
    const tr = (ringSize / 2) / Math.max(Math.abs(cos), Math.abs(sin));
    const junction = { x: c + cos * tr, y: c + sin * tr };
    return { start, end, junction };
  });

  const onPinKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedId(id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 items-start">
      {/* ---------- The plan ---------- */}
      <div className="relative dl-sheet">
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="w-full h-auto block"
          role="img"
          aria-label={`Plan of Floor ${floor.number}: a rimpark around the outside, a glass wall, a ring corridor, ${plan.spokes} radial corridors, an atrium around the central column, and ${floor.places.length} numbered places from the stories.`}
        >
          {/* Rimpark: open air around the whole floor */}
          <rect x={EDGE} y={EDGE} width={VIEW - EDGE * 2} height={VIEW - EDGE * 2} rx={PLATE_R} className="dl-plate" />

          {/* Hill and other rimpark features drawn before the interior */}
          {plan.features.filter((f) => f.type === 'hill').map((f, i) =>
            f.type === 'hill' ? (
              <ellipse key={`hill-${i}`} cx={f.x} cy={f.y} rx={f.rx} ry={f.ry} className="dl-hill" />
            ) : null
          )}

          {/* Interior behind the glass wall */}
          <rect x={innerEdge} y={innerEdge} width={innerSize} height={innerSize} rx={INNER_R} className="dl-interior" />

          {/* Ring corridor */}
          <rect x={ring} y={ring} width={ringSize} height={ringSize} rx={30} className="dl-corridor" fill="none" />

          {/* Radial corridors */}
          {spokes.map((s, i) => (
            <line key={`spoke-${i}`} x1={s.start.x} y1={s.start.y} x2={s.end.x} y2={s.end.y} className="dl-corridor" />
          ))}

          {/* Bays and rooms */}
          {plan.features.map((f, i) => {
            if (f.type === 'bay') {
              const rows = f.rows ?? 0;
              return (
                <g key={`bay-${i}`}>
                  <rect x={f.x} y={f.y} width={f.w} height={f.h} className="dl-bay" />
                  {Array.from({ length: rows }, (_, r) => {
                    const y = f.y + ((r + 1) * f.h) / (rows + 1);
                    return <line key={r} x1={f.x} y1={y} x2={f.x + f.w} y2={y} className="dl-bay-row" />;
                  })}
                </g>
              );
            }
            if (f.type === 'room') {
              return <rect key={`room-${i}`} x={f.x} y={f.y} width={f.w} height={f.h} className="dl-room" />;
            }
            return null;
          })}

          {/* Atrium and the column with its mural */}
          <circle cx={c} cy={c} r={plan.atriumRadius} className="dl-atrium" />
          <circle cx={c} cy={c} r={plan.columnRadius} className="dl-column" />
          <circle cx={c} cy={c} r={plan.columnRadius + 5} className="dl-mural" />

          {/* Junction planters where corridors cross the ring */}
          {spokes.map((s, i) => (
            <circle key={`planter-${i}`} cx={s.junction.x} cy={s.junction.y} r={4} className="dl-planter" />
          ))}

          {/* Labels */}
          {plan.features.map((f, i) =>
            f.type === 'label' ? (
              <text key={`label-${i}`} x={f.x} y={f.y} className={`dl-label dl-label-${f.color ?? 'ink'}`}>
                {f.text}
              </text>
            ) : null
          )}

          {/* Selection halo */}
          {selected && (
            <circle cx={selected.x} cy={selected.y} r={20} className="dl-halo" />
          )}

          {/* Pins */}
          {floor.places.map((p, i) => {
            const isSelected = p.id === selected?.id;
            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={`${i + 1}. ${p.label}`}
                aria-pressed={isSelected}
                className={`dl-pin${isSelected ? ' is-selected' : ''}`}
                onClick={() => setSelectedId(p.id)}
                onKeyDown={(e) => onPinKey(e, p.id)}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <circle cx={p.x} cy={p.y} r={9} className="dl-pin-dot" />
                <text x={p.x} y={p.y + 3.4} className="dl-pin-num">{i + 1}</text>
              </g>
            );
          })}
        </svg>

        {/* Title block, the way a drawing sheet carries one */}
        <div className="dl-titleblock" aria-hidden="true">
          <span className="dl-titleblock-strong">Floor {floor.number}</span>
          <span>Plan · not to scale</span>
          <span>Pins open the passage</span>
        </div>
      </div>

      {/* ---------- The place ---------- */}
      <div className="flex flex-col gap-5">
        {selected && (
          <article className="dl-sheet p-5 sm:p-6" aria-live="polite">
            <div className="flex items-center gap-3 mb-3">
              <span className="dl-pin-badge">{floor.places.findIndex((p) => p.id === selected.id) + 1}</span>
              <span className={`dl-kind dl-kind-${selected.kind}`}>{KIND_LABEL[selected.kind]}</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight leading-tight" style={{ color: 'var(--dl-ink)' }}>
              {selected.label}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--dl-ink)' }}>
              {selected.blurb}
            </p>

            {selected.passages.map((q, i) => (
              <blockquote key={i} className="dl-quote">
                <p>{q.excerpt}</p>
                <footer>
                  <Link href={`/stories/${q.story}`} className="dl-link">
                    {q.label}
                  </Link>
                </footer>
              </blockquote>
            ))}

            {systemFor(selected) && (
              <Link href={systemFor(selected)!.href} className="dl-system-link">
                <span className="dl-eyebrow" style={{ color: 'var(--dl-moss)' }}>How it works</span>
                <span className="font-semibold" style={{ color: 'var(--dl-ink)' }}>{systemFor(selected)!.label}</span>
                <span className="text-sm" style={{ color: 'var(--dl-ink-2)' }}>{systemFor(selected)!.blurb}</span>
              </Link>
            )}
          </article>
        )}

        {/* Legend: every place, selectable */}
        <ol className="dl-legend" aria-label="Places on this floor">
          {floor.places.map((p, i) => {
            const isSelected = p.id === selected?.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-pressed={isSelected}
                  className={`dl-legend-btn${isSelected ? ' is-selected' : ''}`}
                >
                  <span className="dl-pin-badge">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium leading-snug" style={{ color: 'var(--dl-ink)' }}>{p.label}</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--dl-ink-2)' }}>
                      {KIND_LABEL[p.kind]} · {p.passages.map((q) => q.label.split(' · ')[0]).filter((v, idx, arr) => arr.indexOf(v) === idx).join(', ')}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
