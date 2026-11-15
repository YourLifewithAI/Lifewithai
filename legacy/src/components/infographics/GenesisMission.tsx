'use client';

import type { GenesisInfographicData } from '@/lib/types';
import StatCard from './StatCard';
import InteractiveTimeline from './InteractiveTimeline';
import DonutChart from './charts/DonutChart';
import RegionalBarChart from './charts/BarChart';
import StackedAreaChart from './charts/StackedAreaChart';

interface GenesisMissionProps {
  data: GenesisInfographicData;
}

export default function GenesisMission({ data }: GenesisMissionProps) {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="inline-block bg-accent/10 text-accent font-semibold px-4 py-1 rounded-full text-sm mb-4">
          {data.subtitle}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          {data.meta.title}
        </h1>
        <p className="text-lg text-muted leading-relaxed">{data.description}</p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.kpis.map((kpi) => (
          <StatCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2">Mission Timeline</h2>
        <p className="text-muted mb-6 max-w-2xl">
          Explore the key phases below to understand current status and upcoming milestones. Click each phase for details.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <InteractiveTimeline phases={data.timeline} />
        </div>
      </section>

      {/* Budget Allocation */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2">Budget Allocation</h2>
        <p className="text-muted mb-6 max-w-2xl">
          The $50 Billion Genesis fund is strategically divided across four core pillars. Click a segment to explore each sector.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <DonutChart categories={data.budgetAllocation} />
        </div>
      </section>

      {/* Regional Impact */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2">Regional Impact & Deployment</h2>
        <p className="text-muted mb-6 max-w-2xl">
          Progress is actively measured across U.S. regions. Use the selector to switch between funding and active projects.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <RegionalBarChart regions={data.regionalData} />
        </div>
      </section>

      {/* Projections */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2">2035 Energy Mix Projections</h2>
        <p className="text-muted mb-6 max-w-2xl">
          The ultimate goal: a radical shift in the national energy mix, phasing out carbon-heavy sources in favor of renewables and next-generation nuclear.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <StackedAreaChart projections={data.projections} />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-6">
            {data.projectionNotes.map((note) => (
              <div key={note.title}>
                <h4 className="font-bold text-white mb-2">{note.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{note.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center text-xs text-muted pt-4 border-t border-border">
        Data Status: Active as of {data.meta.lastUpdated} &middot; Updated {data.meta.updateFrequency}
      </div>
    </div>
  );
}
