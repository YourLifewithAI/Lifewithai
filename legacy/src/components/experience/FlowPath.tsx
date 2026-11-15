'use client';

interface Props {
  d: string;
  color: string;
  speed: number;
  active: boolean;
  label?: string;
}

export default function FlowPath({ d, color, speed, active, label }: Props) {
  return (
    <g
      className="transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.08 }}
    >
      {/* Base path (subtle) */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 2 : 1}
        strokeOpacity={0.2}
        strokeLinecap="round"
      />

      {/* Animated flow particles */}
      {active && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="6 28"
          className="experience-flow"
          style={{
            '--flow-speed': `${speed}s`,
            '--flow-color': color,
          } as React.CSSProperties}
        />
      )}

      {/* Flow label at midpoint */}
      {active && label && (
        <text
          className="fill-muted text-[9px] pointer-events-none select-none"
          textAnchor="middle"
          dy="-8"
        >
          <textPath href={`#flow-${d.slice(0, 20)}`} startOffset="50%">
          </textPath>
        </text>
      )}
    </g>
  );
}
