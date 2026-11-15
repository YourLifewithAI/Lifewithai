'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { KnowledgeEntry, Domain, ContentIndex } from '@/lib/types';
import { DOMAINS, KEDL_INFO, CONFIDENCE_INFO } from '@/lib/types';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/constants';
import { searchEntries } from '@/lib/search';
import type { SearchFilters } from '@/lib/search';
import ContributeBanner from '@/components/ContributeBanner';

export default function SearchPage() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<Domain | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content-index.json')
      .then((res) => res.json())
      .then((data) => {
        setIndex(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!index) return [];
    const filters: SearchFilters = {};
    if (query.trim()) filters.query = query;
    if (domainFilter) filters.domain = domainFilter as Domain;
    return searchEntries(index.entries, filters);
  }, [index, query, domainFilter]);

  const showResults = query.trim().length > 0 || domainFilter;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Search</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-8">Search the Knowledge Node</h1>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries, parameters, questions..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
          autoFocus
        />
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value as Domain | '')}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:border-accent/50 transition-colors"
        >
          <option value="">All domains</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>{DOMAIN_NAMES[d]}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-muted">Loading search index...</div>
      ) : !showResults ? (
        <div className="text-center py-12">
          <p className="text-muted">
            Enter a search term or select a domain to filter entries.
          </p>
          <p className="mt-2 text-sm text-muted">
            {index?.entries.length || 0} entries available across {DOMAINS.length} domains.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {query && ` for "${query}"`}
            {domainFilter && ` in ${DOMAIN_NAMES[domainFilter as Domain]}`}
          </p>

          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="text-muted">No entries match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((entry) => {
                const color = DOMAIN_COLORS[entry.domain as Domain] || '#888';
                return (
                  <Link
                    key={entry.id}
                    href={`/arcology/${entry.domain}/${entry.slug}`}
                    className="block group rounded-lg border border-border bg-surface p-5 hover:border-accent/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                          <span className="text-xs text-muted">{DOMAIN_NAMES[entry.domain]}</span>
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {entry.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted line-clamp-2">{entry.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="kedl-badge"
                          style={{ background: `${color}15`, color }}
                        >
                          {entry.kedl}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Contribute CTA */}
      <section className="mt-12">
        <ContributeBanner variant="inline" />
      </section>
    </div>
  );
}
