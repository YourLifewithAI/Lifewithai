'use client';

import type { ExperienceTheme } from '@/lib/types';

interface Props {
  active: boolean;
  onChange: (active: boolean) => void;
  theme: ExperienceTheme;
}

export default function AILayerToggle({ active, onChange, theme }: Props) {
  return (
    <button
      aria-pressed={active}
      onClick={() => onChange(!active)}
      className="inline-flex items-center gap-2.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        borderColor: active ? `${theme.accent}50` : '#2a2a35',
        background: active ? `${theme.accent}15` : 'transparent',
        color: active ? theme.accent : '#6b6b7b',
      }}
    >
      {/* AI eye icon */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        {active && <circle cx="8" cy="8" r="1" fill="currentColor" />}
      </svg>
      Show AI Layer
    </button>
  );
}
