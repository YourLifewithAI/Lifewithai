'use client';

import type { InfographicMeta } from '@/lib/types';

interface WorldEnergyData {
  meta: InfographicMeta;
  embedUrl: string;
  source?: { label: string; url: string };
}

const FREQUENCY_LABELS: Record<string, string> = {
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  annual: 'Annual',
  'one-time': 'One-time',
};

export default function WorldEnergyEmbed({ data }: { data: WorldEnergyData }) {
  const { meta, embedUrl, source } = data;

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{meta.title}</h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">{meta.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span>
            Updated{' '}
            {new Date(meta.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>&middot;</span>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
            {FREQUENCY_LABELS[meta.updateFrequency] || meta.updateFrequency}
          </span>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            Open full dashboard
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <iframe
          src={embedUrl}
          title={meta.title}
          loading="lazy"
          className="w-full h-[85vh] min-h-[640px] border-0 block"
        />
      </div>

      {source && (
        <p className="mt-4 text-xs text-muted leading-relaxed">
          Data:{' '}
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            {source.label}
          </a>
          . Embedded from the standalone dashboard, which re-pulls the source data and redeploys monthly.
        </p>
      )}
    </article>
  );
}
