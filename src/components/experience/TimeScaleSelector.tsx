'use client';

import type { ExperienceTimeScale, ExperienceTheme } from '@/lib/types';

interface Props {
  timeScales: ExperienceTimeScale[];
  active: string;
  onChange: (id: string) => void;
  theme: ExperienceTheme;
}

export default function TimeScaleSelector({ timeScales, active, onChange, theme }: Props) {
  return (
    <div role="tablist" aria-label="Time scale" className="inline-flex rounded-lg border border-border/50 bg-surface/50 p-1 gap-1">
      {timeScales.map((ts) => {
        const isActive = ts.id === active;
        return (
          <button
            key={ts.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`timescale-${ts.id}`}
            onClick={() => onChange(ts.id)}
            className="relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
              color: isActive ? '#fff' : '#6b6b7b',
              background: isActive ? `${theme.primary}20` : 'transparent',
            }}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-md border transition-opacity duration-200"
                style={{ borderColor: `${theme.primary}40` }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: isActive ? theme.primary : '#2a2a35',
                  boxShadow: isActive ? `0 0 8px ${theme.primary}60` : 'none',
                }}
              />
              {ts.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
