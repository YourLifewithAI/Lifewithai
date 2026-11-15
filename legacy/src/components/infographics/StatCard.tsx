import type { GenesisKPI } from '@/lib/types';

interface StatCardProps {
  kpi: GenesisKPI;
}

export default function StatCard({ kpi }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
      <div className="text-2xl mb-2">{kpi.icon}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
        {kpi.label}
      </div>
      <div className="text-2xl font-bold text-white">{kpi.value}</div>
      <div className="text-xs text-muted mt-1">{kpi.subtext}</div>
    </div>
  );
}
