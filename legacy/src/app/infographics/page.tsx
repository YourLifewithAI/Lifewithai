import Link from 'next/link';
import { getAllInfographics } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infographics',
  description: 'Interactive data visualizations and status reports. Updated on a regular schedule as new data becomes available.',
};

const FREQUENCY_LABELS: Record<string, string> = {
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  annual: 'Annual',
  'one-time': 'One-time',
};

export default function InfographicsPage() {
  const infographics = getAllInfographics();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Infographics</h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Interactive data visualizations and status reports, updated on a regular schedule as new data becomes available.
        </p>
      </div>

      {infographics.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <p className="text-muted">Infographics are coming soon.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {infographics.map((info) => (
            <Link
              key={info.slug}
              href={`/infographics/${info.slug}`}
              className="block group rounded-xl border border-border bg-surface p-6 hover:border-accent/30 transition-all"
            >
              <h2 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                {info.title}
              </h2>
              <p className="mt-2 text-muted leading-relaxed">{info.summary}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                <span>
                  Updated{' '}
                  {new Date(info.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>&middot;</span>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {FREQUENCY_LABELS[info.updateFrequency] || info.updateFrequency}
                </span>
                {info.tags && info.tags.length > 0 && (
                  <>
                    <span>&middot;</span>
                    <span>{info.tags.join(', ')}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
