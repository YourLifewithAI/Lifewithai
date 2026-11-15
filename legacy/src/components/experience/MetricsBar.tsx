'use client';

import type { ExperienceMetric, ExperienceTheme } from '@/lib/types';

interface Props {
  metrics: ExperienceMetric[];
  theme: ExperienceTheme;
}

const METRIC_ICONS: Record<string, (c: string) => React.ReactNode> = {
  droplet: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L4 8.5C4 11 5.8 13 8 13s4-2 4-4.5L8 2z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  leaf: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 14C4 14 4 8 8 4c4-4 6-2 6-2s2 2-2 6c-4 4-10 4-10 4" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 14L9 9" stroke={c} strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  zap: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 2L4 9h4l-1 5 5-7H8l1-5z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  layers: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8l6 3 6-3" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 11l6 3 6-3" stroke={c} strokeWidth="1.2" strokeLinejoin="round" opacity="0.5" />
      <path d="M2 5l6 3 6-3L8 2 2 5z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  recycle: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 3l3-1 3 1M3 8l-1 3 1 3M13 8l1 3-1 3" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2v5M2 11h5M14 11h-5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  gauge: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 12a6 6 0 1 1 10 0" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 8V5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1" fill={c} />
    </svg>
  ),
  alert: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3L2 13h12L8 3z" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="8" y1="7" x2="8" y2="10" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.5" fill={c} />
    </svg>
  ),
  fish: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 8c-2-2-5-3-8-3 3-.5 6-3 8-5 0 2 .5 3.5 2 5-1.5 1.5-2 3-2 5-2-2-5-3-8-3" stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
};

export default function MetricsBar({ metrics, theme }: Props) {
  if (metrics.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.map((metric) => {
          const iconFn = metric.icon ? METRIC_ICONS[metric.icon] : null;

          return (
            <div
              key={metric.id}
              className="rounded-xl border border-border/40 bg-surface/40 p-4 transition-colors duration-300 hover:border-border/60"
            >
              <div className="flex items-center gap-2 mb-2">
                {iconFn && (
                  <span style={{ color: theme.primary }}>
                    {iconFn(theme.primary)}
                  </span>
                )}
                <span className="text-xs text-muted font-medium">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono tracking-tight">
                {metric.value}
              </p>
              {metric.comparison && (
                <p className="text-xs text-muted/70 mt-1 leading-relaxed">
                  {metric.comparison}
                </p>
              )}
              <p className="text-[10px] text-muted/40 mt-2">
                {metric.source}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
