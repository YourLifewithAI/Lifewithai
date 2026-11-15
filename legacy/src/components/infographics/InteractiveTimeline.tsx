'use client';

import { useState } from 'react';
import type { GenesisTimelinePhase } from '@/lib/types';

interface InteractiveTimelineProps {
  phases: GenesisTimelinePhase[];
}

export default function InteractiveTimeline({ phases }: InteractiveTimelineProps) {
  const currentIndex = phases.findIndex((p) => p.status === 'in-progress');
  const [selected, setSelected] = useState(currentIndex >= 0 ? currentIndex : 0);
  const phase = phases[selected];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 flex flex-col space-y-2 border-l-2 border-border pl-4">
        {phases.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            className={`text-left px-4 py-3 rounded-lg border transition-all font-medium text-sm ${
              i === selected
                ? 'bg-accent/20 text-accent border-accent/30'
                : 'text-muted border-transparent hover:bg-surface hover:text-foreground'
            }`}
          >
            <span className="text-xs uppercase tracking-wider block mb-0.5 opacity-70">
              {p.label}
            </span>
            {p.title}
          </button>
        ))}
      </div>

      <div className="md:w-2/3 rounded-xl border border-border bg-background p-6 min-h-[250px]">
        <div className="text-3xl mb-2">{phase.icon}</div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-white">{phase.title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              phase.status === 'completed'
                ? 'bg-green-500/10 text-green-400'
                : phase.status === 'in-progress'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-white/5 text-muted'
            }`}
          >
            {phase.status === 'in-progress' ? 'Current' : phase.status}
          </span>
        </div>
        <p className="text-muted leading-relaxed mb-4">{phase.description}</p>
        <ul className="space-y-2">
          {phase.milestones.map((m, i) => (
            <li key={i} className="flex items-center text-sm text-muted">
              <span className={`mr-2 ${m.done ? 'text-green-400' : 'text-muted'}`}>
                {m.done ? '✓' : '○'}
              </span>
              {m.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
