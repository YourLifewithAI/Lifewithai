'use client';

interface ViewToggleProps {
  view: 'human' | 'agent';
  onViewChange: (view: 'human' | 'agent') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onViewChange('human')}
        className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-all ${
          view === 'human'
            ? 'border-accent/50 bg-accent/10 text-accent'
            : 'border-border bg-surface text-muted hover:border-accent/30 hover:bg-surface-2'
        }`}
      >
        For Humans
      </button>
      <button
        onClick={() => onViewChange('agent')}
        className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-all ${
          view === 'agent'
            ? 'border-compute/50 bg-compute/10 text-compute'
            : 'border-border bg-surface text-muted hover:border-compute/30 hover:bg-surface-2'
        }`}
      >
        For Agents
      </button>
    </div>
  );
}
