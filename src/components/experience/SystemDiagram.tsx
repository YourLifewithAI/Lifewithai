'use client';

import type { ExperienceNode, ExperienceFlow, ExperienceTheme } from '@/lib/types';
import FlowPath from './FlowPath';
import SystemNode from './SystemNode';

interface Props {
  nodes: ExperienceNode[];
  flows: ExperienceFlow[];
  activeTimeScale: string;
  activeFlows: string[];
  activeNodes: string[];
  showAILayer: boolean;
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  theme: ExperienceTheme;
}

// Convert percentage positions to SVG coordinates
const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const toSvg = (pos: { x: number; y: number }) => ({
  x: (pos.x / 100) * SVG_WIDTH,
  y: (pos.y / 100) * SVG_HEIGHT,
});

// Generate a curved path between two points
function curvePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Control points offset perpendicular to the line for organic curves
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.4 + 30;
  // Perpendicular direction
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len * offset;
  const py = dx / len * offset;

  return `M ${from.x} ${from.y} C ${mx + px} ${my + py}, ${mx + px * 0.3} ${my + py * 0.3}, ${to.x} ${to.y}`;
}

export default function SystemDiagram({
  nodes,
  flows,
  activeFlows,
  activeNodes,
  showAILayer,
  selectedNode,
  onSelectNode,
  theme,
}: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/50" style={{ background: theme.background }}>
      {/* Decorative background */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="Interactive aquaponics system diagram showing the flow of water, nutrients, and energy between fish tanks, biofilters, grow beds, and compost digesters"
      >
        <defs>
          {/* Background grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(42,157,143,0.06)" strokeWidth="0.5" />
          </pattern>

          {/* Glow filters */}
          <filter id="glow-primary">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-accent">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradients for node backgrounds */}
          <radialGradient id="grad-biological" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.15" />
            <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-mechanical" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.secondary} stopOpacity="0.1" />
            <stop offset="100%" stopColor={theme.secondary} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-ai" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-process" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B6914" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8B6914" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Decorative vine elements */}
        <g opacity="0.08" stroke={theme.primary} fill="none" strokeWidth="1.5">
          <path d="M 0 300 Q 40 280, 30 240 Q 20 200, 50 180" />
          <path d="M 800 200 Q 760 220, 770 260 Q 780 300, 750 320" />
          <path d="M 0 500 Q 30 480, 20 450" />
          <path d="M 800 450 Q 770 430, 780 400" />
          {/* Leaf shapes */}
          <ellipse cx="30" cy="240" rx="8" ry="4" transform="rotate(-30 30 240)" />
          <ellipse cx="770" cy="260" rx="8" ry="4" transform="rotate(20 770 260)" />
        </g>

        {/* Node background glows */}
        {nodes.map((node) => {
          const pos = toSvg(node.position);
          const isActive = activeNodes.includes(node.id);
          const gradId = node.type === 'ai-sensor' ? 'grad-ai'
            : node.type === 'process' ? 'grad-process'
            : node.type === 'mechanical' ? 'grad-mechanical'
            : 'grad-biological';

          return (
            <circle
              key={`bg-${node.id}`}
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 60 : 40}
              fill={`url(#${gradId})`}
              className="transition-all duration-700"
              style={{ opacity: isActive ? 1 : 0.3 }}
            />
          );
        })}

        {/* Flow paths */}
        {flows.map((flow) => {
          const fromNode = nodeMap.get(flow.from);
          const toNode = nodeMap.get(flow.to);
          if (!fromNode || !toNode) return null;

          const isActive = activeFlows.includes(flow.id);
          const isAIFlow = flow.substance === 'data';
          if (isAIFlow && !showAILayer) return null;

          return (
            <FlowPath
              key={flow.id}
              d={curvePath(toSvg(fromNode.position), toSvg(toNode.position))}
              color={flow.color}
              speed={flow.speed}
              active={isActive}
              label={flow.label}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.includes(node.id);
          const isSelected = selectedNode === node.id;
          const isAI = node.type === 'ai-sensor';
          if (isAI && !showAILayer && !isActive) return null;

          return (
            <SystemNode
              key={node.id}
              node={node}
              position={toSvg(node.position)}
              active={isActive}
              selected={isSelected}
              showAI={showAILayer}
              onClick={() => onSelectNode(isSelected ? null : node.id)}
              theme={theme}
            />
          );
        })}

        {/* AI data lines (visible when AI layer active) */}
        {showAILayer && (
          <g opacity="0.4">
            {nodes
              .filter((n) => n.type !== 'ai-sensor' && n.aiRole)
              .map((node) => {
                const aiNode = nodes.find((n) => n.id === 'ai-monitor');
                if (!aiNode) return null;
                const from = toSvg(aiNode.position);
                const to = toSvg(node.position);
                return (
                  <line
                    key={`ai-line-${node.id}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={theme.accent}
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    className="animate-flow-slow"
                  />
                );
              })}
          </g>
        )}
      </svg>
    </div>
  );
}
