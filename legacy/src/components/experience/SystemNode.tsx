'use client';

import type { ExperienceNode, ExperienceTheme } from '@/lib/types';

interface Props {
  node: ExperienceNode;
  position: { x: number; y: number };
  active: boolean;
  selected: boolean;
  showAI: boolean;
  onClick: () => void;
  theme: ExperienceTheme;
}

const ICONS: Record<string, (color: string) => React.ReactNode> = {
  fish: (c) => (
    <g transform="translate(-10, -10) scale(0.85)">
      <path d="M20 12c-3-3-7-4-11-4 4-1 8-4 11-7 0 3 1 5 3 7-2 2-3 4-3 7-3-3-7-4-11-4" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="1" fill={c} />
    </g>
  ),
  filter: (c) => (
    <g transform="translate(-10, -10)">
      <path d="M4 4h16l-6 7v5l-4 2V11L4 4z" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  ),
  bacteria: (c) => (
    <g transform="translate(-10, -10)">
      <circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill={c} opacity="0.4" />
      <line x1="12" y1="3" x2="12" y2="7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="7" y2="12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="12" x2="21" y2="12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  plant: (c) => (
    <g transform="translate(-10, -10)">
      <path d="M12 22V12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M12 15C12 11 16 7 20 7c0 4-4 8-8 8z" fill="none" stroke={c} strokeWidth="1.5" />
    </g>
  ),
  compost: (c) => (
    <g transform="translate(-10, -10)">
      <path d="M4 18h16" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 14c2-2 4 0 6-2s4 0 6-2" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M8 10c1.5-1.5 3 0 4.5-1.5S15.5 7 17 8.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M10 6c1-1 2 0 3-1" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
    </g>
  ),
  light: (c) => (
    <g transform="translate(-10, -10)">
      <circle cx="12" cy="12" r="4" fill="none" stroke={c} strokeWidth="1.5" />
      <line x1="12" y1="2" x2="12" y2="5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="5" y2="12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
  brain: (c) => (
    <g transform="translate(-10, -10)">
      <path d="M12 2C8 2 6 5 6 8c0 2 1 3 2 4l-1 3h10l-1-3c1-1 2-2 2-4 0-3-2-6-6-6z" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M9 8h6M9 11h6" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="12" y1="15" x2="12" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="20" x2="14" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  ),
};

export default function SystemNode({ node, position, active, selected, showAI, onClick, theme }: Props) {
  const nodeColor = node.type === 'ai-sensor' ? theme.accent
    : node.type === 'process' ? '#8B6914'
    : node.type === 'mechanical' ? theme.secondary
    : theme.primary;

  const iconFn = ICONS[node.icon];
  const hasAI = !!node.aiRole && showAI;

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${node.label}: ${node.description.slice(0, 80)}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {/* Selection ring */}
      {selected && (
        <circle
          r="32"
          fill="none"
          stroke={nodeColor}
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.6"
        />
      )}

      {/* Outer ring */}
      <circle
        r="24"
        fill={`${nodeColor}10`}
        stroke={nodeColor}
        strokeWidth={active ? 1.5 : 0.5}
        className="transition-all duration-500"
        style={{ opacity: active ? 1 : 0.3 }}
      />

      {/* Inner circle */}
      <circle
        r="16"
        fill={theme.background}
        stroke={nodeColor}
        strokeWidth={active ? 1.5 : 0.75}
        className="transition-all duration-500"
        style={{ opacity: active ? 1 : 0.4 }}
      />

      {/* Icon */}
      <g style={{ opacity: active ? 1 : 0.4 }} className="transition-opacity duration-500">
        {iconFn ? iconFn(nodeColor) : null}
      </g>

      {/* Label */}
      <text
        y="38"
        textAnchor="middle"
        className="text-[11px] font-medium pointer-events-none select-none transition-opacity duration-500"
        fill={active ? '#e8e8ed' : '#6b6b7b'}
      >
        {node.label}
      </text>

      {/* AI indicator dot */}
      {hasAI && (
        <circle
          cx="18"
          cy="-18"
          r="4"
          fill={theme.accent}
          className="animate-pulse"
        />
      )}
    </g>
  );
}
