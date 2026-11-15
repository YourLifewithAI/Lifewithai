// TimelineRuler — the axis line with year markers and gap indicator
// Server component — no interactivity needed.

interface RulerYear {
  year: number;
  position: number; // 0–1 fraction
}

interface TimelineRulerProps {
  years: RulerYear[];
  breakStart: number; // fraction where the gap begins
  breakEnd: number;   // fraction where the gap ends
}

// Vertical center of the ruler band within the timeline container
const RULER_Y = 180; // px from top of container

export function TimelineRuler({ years, breakStart, breakEnd }: TimelineRulerProps) {
  const gapMidFraction = (breakStart + breakEnd) / 2;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="absolute inset-x-0 pointer-events-none"
      style={{ top: `${RULER_Y}px` }}
    >
      {/* ── Main axis line ──────────────────────────────────────────────── */}
      {/* Left segment: 2025–2030 */}
      <div
        className="absolute"
        style={{
          left: '60px',
          width: `calc(${breakStart * 100}% - 60px)`,
          height: '1px',
          top: '0',
          background:
            'linear-gradient(to right, transparent, rgba(244,162,97,0.4) 5%, rgba(244,162,97,0.6) 50%, rgba(244,162,97,0.4) 95%, transparent)',
        }}
      />

      {/* Gap segment: dashed / atmospheric */}
      <div
        className="absolute"
        style={{
          left: `${breakStart * 100}%`,
          width: `${(breakEnd - breakStart) * 100}%`,
          height: '1px',
          top: '0',
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(107,107,123,0.3) 0px, rgba(107,107,123,0.3) 4px, transparent 4px, transparent 10px)',
        }}
      />

      {/* Right segment: 2038–2040 */}
      <div
        className="absolute"
        style={{
          left: `${breakEnd * 100}%`,
          right: '60px',
          height: '1px',
          top: '0',
          background:
            'linear-gradient(to right, rgba(72,202,228,0.4) 5%, rgba(72,202,228,0.6) 50%, rgba(72,202,228,0.4) 95%, transparent)',
        }}
      />

      {/* ── Year tick marks ─────────────────────────────────────────────── */}
      {years.map(({ year, position }) => {
        const isGapYear = position >= breakStart && position <= breakEnd;
        if (isGapYear) return null; // skip year labels inside the gap

        const isArcology = year >= 2038;
        const labelColor = isArcology
          ? 'rgba(72,202,228,0.7)'
          : 'rgba(244,162,97,0.7)';

        return (
          <div
            key={year}
            className="absolute flex flex-col items-center"
            style={{
              left: `calc(${position * 100}% + 0px)`,
              transform: 'translateX(-50%)',
              top: '0',
            }}
          >
            {/* Tick */}
            <div
              style={{
                width: '1px',
                height: '8px',
                background: labelColor,
              }}
            />
            {/* Label */}
            <span
              className="text-xs mt-1 tabular-nums"
              style={{
                color: labelColor,
                fontSize: '10px',
                letterSpacing: '0.05em',
              }}
            >
              {year}
            </span>
          </div>
        );
      })}

      {/* ── Gap indicator ────────────────────────────────────────────────── */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: `${gapMidFraction * 100}%`,
          transform: 'translateX(-50%)',
          top: '-4px',
        }}
      >
        {/* Gap symbol — three dots */}
        <span
          style={{
            fontSize: '14px',
            letterSpacing: '4px',
            color: 'rgba(107,107,123,0.6)',
          }}
        >
          ···
        </span>
        <span
          className="mt-1 text-center"
          style={{
            fontSize: '9px',
            color: 'rgba(107,107,123,0.5)',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          2031–2037
        </span>
      </div>
    </div>
  );
}
