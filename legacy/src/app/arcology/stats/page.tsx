import Link from 'next/link';
import { getAllKnowledgeEntries, getAllDomainMeta } from '@/lib/content';
import { computeAggregateStats, computeDomainStats, computeParameterConfidenceDistribution } from '@/lib/stats';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/constants';
import { KEDL_INFO, CONFIDENCE_INFO } from '@/lib/types';
import DomainHealthGrid from '@/components/DomainHealthGrid';
import ContributeBanner from '@/components/ContributeBanner';
import type { Domain, KEDLLevel, ConfidenceLevel } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stats',
  description: 'Public metrics dashboard for the Arcology Knowledge Node.',
};

export default function StatsPage() {
  const entries = getAllKnowledgeEntries();
  const domains = getAllDomainMeta();
  const stats = computeAggregateStats(entries, domains);
  const domainStats = computeDomainStats(entries, domains);
  const paramConf = computeParameterConfidenceDistribution(entries);

  // Compute subdomain coverage per domain
  const subdomainCoverage: Record<string, { total: number; populated: number }> = {};
  for (const d of domains) {
    const populated = d.subdomains.filter((s) =>
      entries.some((e) => e.domain === d.slug && e.subdomain === s.slug)
    ).length;
    subdomainCoverage[d.slug] = { total: d.subdomains.length, populated };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Stats</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-3">Knowledge Node Metrics</h1>
      <p className="text-muted mb-10">
        All metrics computed at build time from content files. Zero runtime infrastructure.
      </p>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <StatCard label="Total Entries" value={stats.total_entries} />
        <StatCard label="Citations" value={stats.total_citations} />
        <StatCard label="Parameters" value={stats.total_parameters} />
        <StatCard label="Open Questions" value={stats.total_open_questions} />
        <StatCard label="Cross-Refs" value={stats.total_cross_references} />
        <StatCard label="Domains" value={domains.length} />
      </div>

      {/* Quality Metrics */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Quality Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Schema Completeness"
            value={`${stats.schema_completeness}%`}
            description="Subdomains with at least one entry"
          />
          <MetricCard
            label="Citation Density"
            value={`${stats.average_citation_density}`}
            description="Average citations per entry"
          />
          <MetricCard
            label="Cross-Domain Refs"
            value={`${stats.cross_domain_reference_percentage}%`}
            description="References linking across domains"
          />
          <MetricCard
            label="Domain Balance"
            value={`${stats.domain_balance_index}`}
            description="Coefficient of variation (lower = more balanced)"
          />
        </div>
      </section>

      {/* KEDL Distribution */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">KEDL Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {([100, 200, 300, 350, 400, 500] as KEDLLevel[]).map((level) => {
            const count = stats.kedl_distribution[String(level)] || 0;
            const info = KEDL_INFO[level];
            return (
              <div key={level} className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-muted mt-1">KEDL {level}</p>
                <p className="text-xs text-muted">{info.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Confidence Distribution */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Confidence Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as ConfidenceLevel[]).map((level) => {
            const count = stats.confidence_distribution[String(level)] || 0;
            const info = CONFIDENCE_INFO[level];
            return (
              <div key={level} className="rounded-lg border border-border bg-surface p-4 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-muted mt-1">CL {level}</p>
                <p className="text-xs text-muted">{info.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Domain Health */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Domain Health</h2>
        <DomainHealthGrid
          domainStats={domainStats}
          parameterConfidence={paramConf.byDomain}
          subdomainCoverage={subdomainCoverage}
          variant="full"
        />
      </section>

      {/* Contribute CTA */}
      <section>
        <ContributeBanner variant="full" />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-muted mt-1">{description}</p>
    </div>
  );
}
