'use client';

import { useEffect, useRef } from 'react';
import type { ExperienceNode, ExperienceTheme } from '@/lib/types';

interface Props {
  node: ExperienceNode;
  showAILayer: boolean;
  onClose: () => void;
  theme: ExperienceTheme;
}

export default function NodeDetailPanel({ node, showAILayer, onClose, theme }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid immediate close from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  const nodeColor = node.type === 'ai-sensor' ? theme.accent
    : node.type === 'process' ? '#8B6914'
    : node.type === 'mechanical' ? theme.secondary
    : theme.primary;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`Details for ${node.label}`}
      className="absolute top-4 right-4 w-full max-w-sm rounded-xl border p-5 animate-fade-in z-10"
      style={{
        background: 'rgba(14, 14, 20, 0.95)',
        backdropFilter: 'blur(16px)',
        borderColor: `${nodeColor}30`,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close panel"
        className="absolute top-3 right-3 p-1 rounded text-muted hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ background: nodeColor }}
        />
        <h3 className="text-base font-semibold text-white">{node.label}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed mb-4">
        {node.description}
      </p>

      {/* AI role (conditional) */}
      {showAILayer && node.aiRole && (
        <div
          className="rounded-lg border p-3 mb-4"
          style={{
            borderColor: `${theme.accent}25`,
            background: `${theme.accent}08`,
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: theme.accent }}>
            AI Optimization
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {node.aiRole}
          </p>
        </div>
      )}

      {/* Story quote */}
      {node.storyQuote && (
        <blockquote
          className="border-l-2 pl-3 mb-4 text-xs italic leading-relaxed"
          style={{ borderColor: `${nodeColor}40`, color: '#8b8b9b' }}
        >
          {node.storyQuote}
        </blockquote>
      )}

      {/* Metrics */}
      {node.detailMetrics && node.detailMetrics.length > 0 && (
        <div className="space-y-2">
          {node.detailMetrics.map((m, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-3 text-xs"
            >
              <span className="text-muted">{m.label}</span>
              <span className="font-mono font-medium text-foreground">{m.value}</span>
            </div>
          ))}
          {node.detailMetrics.some((m) => m.source) && (
            <p className="text-[10px] text-muted/50 pt-1 border-t border-border/30">
              Sources: {node.detailMetrics.filter((m) => m.source).map((m) => m.source).join('; ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
