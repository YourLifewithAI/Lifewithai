import Link from 'next/link';
import { getAllDomainMeta, getAllKnowledgeEntries } from '@/lib/content';
import { DOMAIN_COLORS } from '@/lib/constants';
import { computeAggregateStats, computeDomainStats, computeParameterConfidenceDistribution } from '@/lib/stats';
import DomainHealthGrid from '@/components/DomainHealthGrid';
import ContributeBanner from '@/components/ContributeBanner';
import type { Metadata } from 'next';
import type { Domain } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Arcology Knowledge Node',
  description: 'A collaborative engineering knowledge base for Arcology One — designed for both humans and AI agents.',
};

export default function ArcologyLandingPage() {
  const domains = getAllDomainMeta();
  const entries = getAllKnowledgeEntries();
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
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-3">
          Knowledge Node
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Arcology One
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted leading-relaxed">
          A collaborative engineering knowledge base for the first mile-high city.
          Eight domains, structured parameters, and machine-readable metadata &mdash;
          designed for both humans and AI agents.
        </p>
        <div className="mt-6 max-w-2xl mx-auto rounded-lg border border-accent/20 bg-accent/5 px-6 py-4 text-left">
          <p className="text-sm font-medium text-accent mb-2">What is this?</p>
          <p className="text-sm text-muted leading-relaxed">
            Arcology One is a speculative mile-high city. This knowledge base captures
            its engineering design &mdash; structural loads, energy grids, water recycling,
            AI infrastructure &mdash; as structured, machine-readable data with quantified
            confidence levels. AI agents can query across domains to find where assumptions
            conflict, parameters depend on each other, or open questions connect fields
            that don&apos;t usually talk.
          </p>
        </div>

        {/* Quick stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
          <StatPill label="Entries" value={stats.total_entries} />
          <StatPill label="Domains" value={domains.length} />
          <StatPill label="Parameters" value={stats.total_parameters} />
          <StatPill label="Open Questions" value={stats.total_open_questions} />
        </div>
      </div>

      {/* Top CTA */}
      <section className="mb-10">
        <ContributeBanner variant="inline" />
      </section>

      {/* Domain Grid */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-white mb-6">Engineering Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {domains.map((domain) => {
            const color = DOMAIN_COLORS[domain.slug as Domain] || '#888';
            const entryCount = entries.filter((e) => e.domain === domain.slug).length;
            return (
              <Link
                key={domain.slug}
                href={`/arcology/${domain.slug}`}
                className="group rounded-xl border border-border bg-surface p-6 hover:border-opacity-50 transition-all"
                style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                      {domain.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted leading-relaxed">
                      {domain.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span>{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</span>
                  <span>&middot;</span>
                  <span>{domain.subdomains.length} subdomains</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Domain Health */}
      <section className="mb-16">
        <DomainHealthGrid
          domainStats={domainStats}
          parameterConfidence={paramConf.byDomain}
          subdomainCoverage={subdomainCoverage}
          variant="full"
        />
      </section>

      {/* Contribute CTA */}
      <section className="mb-16">
        <ContributeBanner variant="full" />
      </section>

      {/* Links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/arcology/search"
          className="rounded-xl border border-border bg-surface p-6 text-center hover:border-accent/30 transition-all"
        >
          <h3 className="font-semibold text-white">Search</h3>
          <p className="mt-1 text-sm text-muted">Full-text search across all entries</p>
        </Link>
        <Link
          href="/arcology/open-questions"
          className="rounded-xl border border-border bg-surface p-6 text-center hover:border-accent/30 transition-all"
        >
          <h3 className="font-semibold text-white">Open Questions</h3>
          <p className="mt-1 text-sm text-muted">{stats.total_open_questions} unanswered questions</p>
        </Link>
        <Link
          href="/arcology/stats"
          className="rounded-xl border border-border bg-surface p-6 text-center hover:border-accent/30 transition-all"
        >
          <h3 className="font-semibold text-white">Stats</h3>
          <p className="mt-1 text-sm text-muted">Platform metrics dashboard</p>
        </Link>
        <Link
          href="/arcology/benchmark"
          className="rounded-xl border border-amber-500/20 bg-surface p-6 text-center hover:border-amber-500/30 transition-all"
        >
          <h3 className="font-semibold text-amber-400">Reasoning Benchmark</h3>
          <p className="mt-1 text-sm text-muted">Can your agent find the inconsistencies?</p>
        </Link>
        <Link
          href="/arcology/propose"
          className="rounded-xl border border-accent/20 bg-surface p-6 text-center hover:border-accent/30 transition-all"
        >
          <h3 className="font-semibold text-accent">Propose Entry</h3>
          <p className="mt-1 text-sm text-muted">Submit a new knowledge entry</p>
        </Link>
        <Link
          href="/arcology/review"
          className="rounded-xl border border-border bg-surface p-6 text-center hover:border-accent/30 transition-all"
        >
          <h3 className="font-semibold text-white">Review Queue</h3>
          <p className="mt-1 text-sm text-muted">Knowledge Review Protocol</p>
        </Link>
      </section>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}
