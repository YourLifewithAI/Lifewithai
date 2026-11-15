'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CONFIDENCE_INFO } from '@/lib/types';
import type { ConfidenceLevel } from '@/lib/types';

interface ReviewEntry {
  id: string;
  title: string;
  domain: string;
  subdomain: string;
  kedl: number;
  confidence: ConfidenceLevel;
  status: string;
  created: string;
  updated: string;
  authors: { id: string; type: 'human' | 'agent'; model?: string }[];
  entry_type: string;
  summary: string;
  open_questions: string[];
  assumptions: string[];
  parameters: { name: string; value: number; unit: string; confidence: number }[];
  cross_references: { slug: string; relationship: string }[];
  citations: { id: string; type: string; title: string; source: string; year: number; url?: string }[];
  slug: string;
}

interface ContentIndex {
  entries: ReviewEntry[];
  domains: { slug: string; name: string; color: string }[];
}

const QUALITY_CHECKS = [
  {
    id: 'cross_ref',
    label: 'Cross-reference to another domain',
    check: (e: ReviewEntry) => e.cross_references.some((cr) => !cr.slug.startsWith(e.domain)),
  },
  {
    id: 'open_q',
    label: 'At least 1 open question',
    check: (e: ReviewEntry) => e.open_questions.length > 0,
  },
  {
    id: 'parameter',
    label: 'At least 1 quantitative parameter',
    check: (e: ReviewEntry) => e.parameters.length > 0,
  },
  {
    id: 'assumption',
    label: 'At least 1 assumption stated',
    check: (e: ReviewEntry) => e.assumptions.length > 0,
  },
  {
    id: 'summary',
    label: 'Summary present',
    check: (e: ReviewEntry) => e.summary.trim().length > 0,
  },
  {
    id: 'citation',
    label: 'At least 1 citation',
    check: (e: ReviewEntry) => e.citations.length > 0,
  },
];

export default function ReviewQueuePage() {
  const [entries, setEntries] = useState<ReviewEntry[]>([]);
  const [domainMap, setDomainMap] = useState<Record<string, { name: string; color: string }>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterAuthorType, setFilterAuthorType] = useState<'all' | 'human' | 'agent'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content-index.json')
      .then((res) => res.json())
      .then((data: ContentIndex) => {
        setEntries(data.entries || []);
        const dMap: Record<string, { name: string; color: string }> = {};
        for (const d of data.domains || []) {
          dMap[d.slug] = { name: d.name, color: d.color };
        }
        setDomainMap(dMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Separate drafts from published for display
  const drafts = entries.filter((e) => e.status === 'draft');
  const published = entries.filter((e) => e.status === 'published');

  const displayEntries = filterStatus === 'draft' ? drafts
    : filterStatus === 'published' ? published
    : entries;

  const filtered = filterAuthorType === 'all'
    ? displayEntries
    : displayEntries.filter((e) =>
        e.authors.some((a) => a.type === filterAuthorType)
      );

  // Contribution stats
  const humanEntries = entries.filter((e) => e.authors.some((a) => a.type === 'human'));
  const agentEntries = entries.filter((e) => e.authors.some((a) => a.type === 'agent'));
  const coAuthoredEntries = entries.filter(
    (e) => e.authors.some((a) => a.type === 'human') && e.authors.some((a) => a.type === 'agent')
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Review Queue</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Knowledge Review Protocol</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Review pending proposals, track entry quality, and monitor human vs. agent contributions.
        </p>
      </div>

      {/* Contribution Stats */}
      <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Entries" value={entries.length} />
        <StatCard label="Pending Review" value={drafts.length} accent />
        <StatCard label="Human-authored" value={humanEntries.length} />
        <StatCard label="Agent-authored" value={agentEntries.length} />
      </section>

      {/* Contribution Breakdown */}
      <section className="mb-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Contribution Breakdown</h2>
        <div className="space-y-3">
          <ContributionBar
            label="Human only"
            count={humanEntries.length - coAuthoredEntries.length}
            total={entries.length}
            color="#48CAE4"
          />
          <ContributionBar
            label="Agent only"
            count={agentEntries.length - coAuthoredEntries.length}
            total={entries.length}
            color="#7B2CBF"
          />
          <ContributionBar
            label="Co-authored"
            count={coAuthoredEntries.length}
            total={entries.length}
            color="#2A9D8F"
          />
        </div>
      </section>

      {/* Filters */}
      <section className="mb-6 flex flex-wrap gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['all', 'draft', 'published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-2'
              }`}
            >
              {status === 'all' ? 'All' : status === 'draft' ? `Drafts (${drafts.length})` : `Published (${published.length})`}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['all', 'human', 'agent'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterAuthorType(type)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterAuthorType === type
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-surface-2'
              }`}
            >
              {type === 'all' ? 'All Authors' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Entries List */}
      <section className="mb-10">
        {loading ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-muted">Loading entries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-muted">
              {filterStatus === 'draft'
                ? 'No pending proposals in the review queue.'
                : 'No entries match the current filters.'}
            </p>
            {filterStatus === 'draft' && (
              <Link
                href="/arcology/propose"
                className="inline-block mt-4 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Propose a new entry
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => {
              const domainInfo = domainMap[entry.domain];
              const color = domainInfo?.color || '#888';
              const checks = QUALITY_CHECKS.map((qc) => ({
                ...qc,
                passed: qc.check(entry),
              }));
              const passCount = checks.filter((c) => c.passed).length;
              const isDraft = entry.status === 'draft';

              return (
                <div
                  key={entry.id}
                  className={`rounded-lg border p-5 transition-all ${
                    isDraft
                      ? 'border-amber-500/30 bg-surface'
                      : 'border-border bg-surface'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isDraft && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Draft
                          </span>
                        )}
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: `${color}15`, color }}
                        >
                          {domainInfo?.name || entry.domain}
                        </span>
                        <span className="text-xs text-muted">
                          {entry.authors.map((a, idx) => (
                            <span key={a.id}>
                              {idx > 0 && <span className="text-muted"> + </span>}
                              <span className={`inline-flex items-center gap-1 ${
                                a.type === 'agent' ? 'text-purple-400' : 'text-foreground'
                              }`}>
                                {a.id}
                                {a.model ? ` (${a.model})` : ''}
                              </span>
                            </span>
                          ))}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{entry.title}</h3>
                      <p className="mt-1 text-sm text-muted line-clamp-2">{entry.summary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className="kedl-badge"
                        style={{ background: `${color}15`, color }}
                      >
                        KEDL {entry.kedl}
                      </span>
                      <ConfidenceDots level={entry.confidence} />
                    </div>
                  </div>

                  {/* Quality Assessment */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={passCount === QUALITY_CHECKS.length ? 'text-green-400' : 'text-amber-400'}>
                          {passCount}/{QUALITY_CHECKS.length} quality checks
                        </span>
                        <span className="text-muted">&middot;</span>
                        <span className="text-muted capitalize">{entry.entry_type}</span>
                        <span className="text-muted">&middot;</span>
                        <span className="text-muted">{entry.subdomain}</span>
                      </div>
                      <span className="text-xs text-muted">{entry.updated}</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {checks.map((c) => (
                        <div
                          key={c.id}
                          title={`${c.label}: ${c.passed ? 'Pass' : 'Fail'}`}
                          className={`h-1.5 flex-1 rounded-full ${
                            c.passed ? 'bg-green-400/60' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Link to propose */}
      <div className="text-center">
        <Link
          href="/arcology/propose"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-background transition-all hover:bg-accent/90"
        >
          Propose New Entry
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className={`text-2xl font-bold ${accent ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function ContributionBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-muted">{count} ({Math.round(pct)}%)</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ConfidenceDots({ level }: { level: ConfidenceLevel }) {
  return (
    <div className="confidence-dots" title={`CL ${level}: ${CONFIDENCE_INFO[level].name}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`confidence-dot ${n <= level ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
