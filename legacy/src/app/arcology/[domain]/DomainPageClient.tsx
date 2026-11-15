'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CONFIDENCE_INFO } from '@/lib/types';
import type { DomainMeta, ConfidenceLevel, KEDLLevel, Parameter } from '@/lib/types';
import SubscribeForm from '@/components/SubscribeForm';
import ContributeBanner from '@/components/ContributeBanner';

interface SerializedEntry {
  slug: string;
  title: string;
  summary: string;
  subdomain: string;
  kedl: KEDLLevel;
  confidence: ConfidenceLevel;
  entry_type: string;
  parameters: Parameter[];
}

interface OpenQuestion {
  question: string;
  entryTitle: string;
  entrySlug: string;
}

interface DomainPageClientProps {
  domain: string;
  meta: DomainMeta;
  entries: SerializedEntry[];
  openQuestions: OpenQuestion[];
  color: string;
}

export default function DomainPageClient({
  domain,
  meta,
  entries,
  openQuestions,
  color,
}: DomainPageClientProps) {
  const [activeSubdomain, setActiveSubdomain] = useState<string | null>(null);

  // Group entries by subdomain for counts
  const countBySubdomain = new Map<string, number>();
  for (const entry of entries) {
    countBySubdomain.set(entry.subdomain, (countBySubdomain.get(entry.subdomain) || 0) + 1);
  }

  // Filter entries by active subdomain
  const filteredEntries = activeSubdomain
    ? entries.filter((e) => e.subdomain === activeSubdomain)
    : entries;

  // Filter open questions by active subdomain
  const filteredQuestions = activeSubdomain
    ? openQuestions.filter((oq) => {
        const entry = entries.find((e) => e.slug === oq.entrySlug);
        return entry && entry.subdomain === activeSubdomain;
      })
    : openQuestions;

  const activeSubdomainName = activeSubdomain
    ? meta.subdomains.find((s) => s.slug === activeSubdomain)?.name
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        {activeSubdomain ? (
          <>
            <button
              onClick={() => setActiveSubdomain(null)}
              className="hover:text-accent transition-colors"
            >
              {meta.name}
            </button>
            <span className="mx-2">/</span>
            <span className="text-foreground">{activeSubdomainName}</span>
          </>
        ) : (
          <span className="text-foreground">{meta.name}</span>
        )}
      </nav>

      {/* Header */}
      <div className="mb-12" style={{ borderLeftColor: color, borderLeftWidth: '3px', paddingLeft: '1rem' }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          {activeSubdomain ? activeSubdomainName : meta.name}
        </h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">
          {activeSubdomain
            ? meta.subdomains.find((s) => s.slug === activeSubdomain)?.description
            : meta.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>{filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}</span>
          {!activeSubdomain && (
            <>
              <span>&middot;</span>
              <span>{meta.subdomains.length} subdomains</span>
            </>
          )}
          <span>&middot;</span>
          <span>{filteredQuestions.length} open questions</span>
        </div>
      </div>

      {/* Subdomains */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Subdomains</h2>
          {activeSubdomain && (
            <button
              onClick={() => setActiveSubdomain(null)}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Show all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {meta.subdomains.map((sub) => {
            const count = countBySubdomain.get(sub.slug) || 0;
            const isActive = activeSubdomain === sub.slug;
            return (
              <button
                key={sub.slug}
                onClick={() => setActiveSubdomain(isActive ? null : sub.slug)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  isActive
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border bg-surface hover:border-accent/30 hover:bg-surface-2'
                }`}
              >
                <h3 className={`font-medium ${isActive ? 'text-accent' : 'text-foreground'}`}>
                  {sub.name}
                </h3>
                <p className="mt-1 text-xs text-muted">{sub.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {count} {count === 1 ? 'entry' : 'entries'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Entries */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">
          {activeSubdomain ? `${activeSubdomainName} Entries` : 'Knowledge Entries'}
        </h2>
        {filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-muted">
              {activeSubdomain
                ? 'No entries yet in this subdomain.'
                : 'No entries yet in this domain.'}
            </p>
            <Link
              href={`/arcology/propose?domain=${domain}${activeSubdomain ? `&subdomain=${activeSubdomain}` : ''}`}
              className="inline-block mt-4 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Propose the first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/arcology/${domain}/${entry.slug}`}
                className="block group rounded-lg border border-border bg-surface p-5 hover:border-accent/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted line-clamp-2">{entry.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="kedl-badge"
                      style={{
                        background: `${color}15`,
                        color: color,
                      }}
                    >
                      KEDL {entry.kedl}
                    </span>
                    <ConfidenceDots level={entry.confidence} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                  <span className="capitalize">{entry.entry_type}</span>
                  <span>&middot;</span>
                  <span>{entry.subdomain}</span>
                  {entry.parameters.length > 0 && (
                    <>
                      <span>&middot;</span>
                      <span>{entry.parameters.length} parameters</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Contribute CTA */}
      <section className="mb-12">
        <ContributeBanner domain={domain} domainName={meta.name} variant="inline" />
      </section>

      {/* Open Questions */}
      {filteredQuestions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Open Questions</h2>
          <div className="space-y-3">
            {filteredQuestions.map((oq, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-foreground">{oq.question}</p>
                <p className="mt-2 text-xs text-muted">
                  From: <Link href={`/arcology/${domain}/${oq.entrySlug}`} className="text-accent hover:underline">{oq.entryTitle}</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subscribe to domain updates */}
      <section>
        <SubscribeForm
          domain={domain}
          domainName={meta.name}
          source="domain-page"
        />
      </section>
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
