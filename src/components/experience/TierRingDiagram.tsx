'use client';

import { useState, useCallback } from 'react';
import type { TierData, ExperienceTheme } from '@/lib/types';

interface Props {
  tiers: TierData[];
  selectedTier: string | null;
  onSelectTier: (id: string | null) => void;
  theme: ExperienceTheme;
}

// Ring layout configuration
const CENTER_X = 500;
const CENTER_Y = 500;
const VIEWBOX_SIZE = 1000;
const RING_RADII = [
  { inner: 0, outer: 80 },     // Tier 0 — solid center circle
  { inner: 90, outer: 120 },   // Membrane — thin glowing ring
  { inner: 135, outer: 210 },  // Tier 1
  { inner: 220, outer: 290 },  // Tier 2
  { inner: 300, outer: 370 },  // Tier 3
  { inner: 380, outer: 450 },  // Tier 4
];

// Label arc radii — single line per tier
const LABEL_ARC_RADII = [
  0,      // Tier 0 — flat text (center circle)
  105,    // Membrane
  168,    // Tier 1
  252,    // Tier 2
  332,    // Tier 3
  412,    // Tier 4
];

/**
 * Build an upper-semicircle arc path for textPath to follow.
 * Goes from left to right across the top so text reads naturally.
 */
function describeTextArc(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
}

export default function TierRingDiagram({ tiers, selectedTier, onSelectTier, theme }: Props) {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleTierClick = useCallback(
    (tierId: string) => {
      onSelectTier(selectedTier === tierId ? null : tierId);
    },
    [selectedTier, onSelectTier]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, tierId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTierClick(tierId);
      }
    },
    [handleTierClick]
  );

  return (
    <div className="relative w-full mx-auto">
      {/* CSS animation for membrane pulse — avoids React re-renders */}
      <style>{`
        @keyframes membrane-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        .membrane-ring {
          animation: membrane-pulse 3s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="w-full h-auto"
        role="img"
        aria-label="Arcology One Binding Hierarchy — concentric ring diagram showing AI tiers from Substrate at center to Embodied Agents at periphery"
      >
        <defs>
          {/* Glow filters for each tier */}
          {tiers.map((tier) => (
            <filter key={`glow-${tier.id}`} id={`glow-${tier.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={tier.glowColor} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Membrane glow filter (static — animation is CSS opacity on the element) */}
          <filter id="membrane-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={theme.accent} floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Selection highlight filter */}
          <filter id="selected-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feFlood floodColor="#ffffff" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Background radial gradient */}
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#151530" />
            <stop offset="100%" stopColor={theme.background} />
          </radialGradient>

          {/* Arc paths for curved text labels */}
          {tiers.map((tier) => {
            if (tier.ringIndex === 0) return null;
            return (
              <path
                key={`arc-${tier.id}`}
                id={`arc-label-${tier.id}`}
                d={describeTextArc(CENTER_X, CENTER_Y, LABEL_ARC_RADII[tier.ringIndex])}
                fill="none"
                stroke="none"
              />
            );
          })}
        </defs>

        <circle cx={CENTER_X} cy={CENTER_Y} r={460} fill="url(#bg-gradient)" opacity="0.5" />

        {/* Render rings from outermost to innermost (so inner rings draw on top) */}
        {[...tiers].reverse().map((tier) => {
          const ring = RING_RADII[tier.ringIndex];
          const isSelected = selectedTier === tier.id;
          const isHovered = hoveredTier === tier.id;
          const isActive = isSelected || isHovered;
          const isMembrane = tier.id === 'membrane';

          return (
            <g
              key={tier.id}
              className="cursor-pointer"
              style={{
                opacity: selectedTier && !isSelected ? 0.4 : 1,
                transition: 'opacity 300ms ease',
              }}
              onClick={() => handleTierClick(tier.id)}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              onKeyDown={(e) => handleKeyDown(e, tier.id)}
              role="button"
              tabIndex={0}
              aria-label={`${tier.designation}: ${tier.name} — ${tier.tagline}`}
              aria-pressed={isSelected}
            >
              {/* The ring shape */}
              {tier.ringIndex === 0 ? (
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={ring.outer}
                  fill={tier.color}
                  stroke={tier.glowColor}
                  strokeWidth={isActive ? 2 : 1}
                  filter={isSelected ? 'url(#selected-glow)' : `url(#glow-${tier.id})`}
                />
              ) : (
                <path
                  d={describeAnnulus(CENTER_X, CENTER_Y, ring.inner, ring.outer)}
                  fill={tier.color}
                  stroke={isMembrane ? theme.accent : tier.glowColor}
                  strokeWidth={isActive ? 2 : isMembrane ? 1.5 : 0.5}
                  className={isMembrane && !isSelected ? 'membrane-ring' : undefined}
                  filter={
                    isSelected
                      ? 'url(#selected-glow)'
                      : isMembrane
                        ? 'url(#membrane-glow)'
                        : `url(#glow-${tier.id})`
                  }
                />
              )}

              {/* Tier label — "Designation: Name" on one line */}
              {tier.ringIndex === 0 ? (
                <text
                  x={CENTER_X}
                  y={CENTER_Y + 4}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fontSize={14}
                  style={{ opacity: isActive ? 1 : 0.85 }}
                >
                  <tspan fill={isActive ? '#ffffff' : tier.glowColor} fontWeight={700}>
                    {tier.designation}:
                  </tspan>
                  <tspan fill={isActive ? '#ffffff' : '#a0a0b0'} fontWeight={400}>
                    {' '}{tier.name}
                  </tspan>
                </text>
              ) : (
                <text
                  className="pointer-events-none select-none"
                  fontSize={isMembrane ? 13 : 16}
                  style={{ opacity: isActive ? 1 : 0.85 }}
                >
                  <textPath
                    href={`#arc-label-${tier.id}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    <tspan fill={isActive ? '#ffffff' : tier.glowColor} fontWeight={700}>
                      {tier.designation}:
                    </tspan>
                    <tspan fill={isActive ? '#ffffff' : '#a0a0b0'} fontWeight={400}>
                      {' '}{tier.name}
                    </tspan>
                  </textPath>
                </text>
              )}
            </g>
          );
        })}

        {/* Outer decorative ring — subtle border */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={460}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>

      {/* "Click to explore" hint */}
      {!selectedTier && (
        <p className="text-center text-xs text-muted/50 mt-2 animate-pulse">
          Click a ring to explore
        </p>
      )}
    </div>
  );
}

/**
 * Describe an annulus (donut) as an SVG path using two arcs.
 * Outer arc clockwise, inner arc counter-clockwise, connected.
 */
function describeAnnulus(cx: number, cy: number, innerR: number, outerR: number): string {
  return [
    `M ${cx - outerR} ${cy}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx - outerR} ${cy}`,
    'Z',
    `M ${cx - innerR} ${cy}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy}`,
    'Z',
  ].join(' ');
}
