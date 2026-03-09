import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllKnowledgeEntries, getKnowledgeEntry, getDomainMeta } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/constants';
import { KEDL_INFO, CONFIDENCE_INFO } from '@/lib/types';
import type { Domain, KEDLLevel, ConfidenceLevel } from '@/lib/types';
import FeedbackWidget from '@/components/FeedbackWidget';
import ContributeBanner from '@/components/ContributeBanner';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ domain: string; slug: string[] }>;
}

export async function generateStaticParams() {
  const entries = getAllKnowledgeEntries();
  return entries.map((e) => ({
    domain: e.domain,
    slug: e.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const entry = getKnowledgeEntry(domain as Domain, slug.join('/'));
  if (!entry) return { title: 'Entry Not Found' };

  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function KnowledgeEntryPage({ params }: PageProps) {
  const { domain, slug } = await params;
  const slugStr = slug.join('/');
  const entry = getKnowledgeEntry(domain as Domain, slugStr);

  if (!entry) notFound();

  const domainMeta = getDomainMeta(domain as Domain);
  const color = DOMAIN_COLORS[domain as Domain] || '#888';
  const html = await renderMarkdown(entry.content);
  const kedlInfo = KEDL_INFO[entry.kedl as KEDLLevel];
  const confInfo = CONFIDENCE_INFO[entry.confidence as ConfidenceLevel];

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: entry.title,
    headline: entry.title,
    description: entry.summary,
    url: `https://lifewithai.ai/arcology/${domain}/${slugStr}`,
    dateModified: entry.updated,
    author: entry.authors.map(a => ({
      '@type': a.type === 'agent' ? 'SoftwareApplication' : 'Person',
      name: a.id,
    })),
    about: {
      '@type': 'Thing',
      name: domainMeta?.name || domain,
    },
    keywords: entry.tags.join(', '),
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Arcology Knowledge Node',
      url: 'https://lifewithai.ai/arcology',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Life with AI',
      url: 'https://lifewithai.ai',
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <Link href={`/arcology/${domain}`} className="hover:text-accent transition-colors">
          {domainMeta?.name || domain}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{entry.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10" style={{ borderLeftColor: color, borderLeftWidth: '3px', paddingLeft: '1rem' }}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className="kedl-badge"
            style={{ background: `${color}20`, color }}
          >
            KEDL {entry.kedl} &mdash; {kedlInfo.name}
          </span>
          <span className="kedl-badge bg-surface-2 text-muted">
            CL {entry.confidence} &mdash; {confInfo.name}
          </span>
          <span className="kedl-badge bg-surface-2 text-muted capitalize">
            {entry.entry_type}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {entry.title}
        </h1>
        <p className="mt-3 text-muted leading-relaxed">{entry.summary}</p>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span>Updated {entry.updated}</span>
          <span>&middot;</span>
          <span>
            {entry.authors.map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1">
                {a.type === 'agent' && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-compute" />
                )}
                {a.id}
              </span>
            )).reduce<React.ReactNode[]>((acc, el, i) => {
              if (i > 0) acc.push(<span key={`sep-${i}`}>, </span>);
              acc.push(el);
              return acc;
            }, [])}
          </span>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Assumptions */}
      {entry.assumptions.length > 0 && (
        <div className="mb-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Assumptions
          </h2>
          <ul className="space-y-1.5">
            {entry.assumptions.map((a, i) => (
              <li key={i} className="text-sm text-muted flex items-start gap-2">
                <span className="text-accent mt-1 flex-shrink-0">&bull;</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div
        className="prose max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Parameters Table */}
      {entry.parameters.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Quantitative Parameters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted font-medium">Parameter</th>
                  <th className="text-right py-2 px-4 text-muted font-medium">Value</th>
                  <th className="text-left py-2 px-4 text-muted font-medium">Unit</th>
                  <th className="text-center py-2 pl-4 text-muted font-medium">CL</th>
                </tr>
              </thead>
              <tbody>
                {entry.parameters.map((p, i) => (
                  <tr key={i} className="border-b border-border-subtle">
                    <td className="py-2 pr-4 text-foreground font-mono text-xs">{p.name}</td>
                    <td className="py-2 px-4 text-right text-white font-mono">
                      {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                    </td>
                    <td className="py-2 px-4 text-muted">{p.unit}</td>
                    <td className="py-2 pl-4 text-center">
                      <ConfidenceDots level={p.confidence as ConfidenceLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Open Questions */}
      {entry.open_questions.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Open Questions</h2>
          <div className="space-y-3">
            {entry.open_questions.map((q, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-foreground text-sm">{q}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cross References */}
      {entry.cross_references.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Cross References</h2>
          <div className="space-y-2">
            {entry.cross_references.map((ref, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted capitalize">
                  {ref.relationship.replace('-', ' ')}
                </span>
                <Link
                  href={`/arcology/${ref.slug}`}
                  className="text-accent hover:underline"
                >
                  {ref.slug}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Citations */}
      {entry.citations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Citations</h2>
          <div className="space-y-3">
            {entry.citations.map((cite) => (
              <div key={cite.id} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-foreground text-sm font-medium">{cite.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {cite.source} ({cite.year})
                  <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-xs capitalize">
                    {cite.type.replace('-', ' ')}
                  </span>
                </p>
                {cite.url && (
                  <a
                    href={cite.url}
                    className="mt-1 inline-block text-xs text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cite.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KEDL/CL Legend */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Understanding the Ratings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h3 className="font-medium text-muted mb-2">KEDL {entry.kedl}: {kedlInfo.name}</h3>
            <p className="text-muted">{kedlInfo.description}</p>
          </div>
          <div>
            <h3 className="font-medium text-muted mb-2">CL {entry.confidence}: {confInfo.name}</h3>
            <p className="text-muted">{confInfo.description}</p>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="mt-10">
        <FeedbackWidget
          pageUrl={`/arcology/${domain}/${slugStr}`}
          entryTitle={entry.title}
          domain={domain}
        />
      </section>

      {/* Contribute CTA */}
      <section className="mt-6">
        <ContributeBanner domain={domain} domainName={domainMeta?.name} variant="inline" />
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
