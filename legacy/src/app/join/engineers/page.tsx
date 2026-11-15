import type { Metadata } from 'next';
import Link from 'next/link';
import { getPage } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'The Arcology Project',
  description: 'Your expertise has a place here. The Arcology Project needs structural engineers, energy specialists, materials scientists, and every discipline pushed past its current limits.',
  openGraph: {
    title: 'The Arcology Project — Life with AI',
    description: 'Your expertise has a place here. Real engineering problems that don\'t have solutions yet.',
  },
};

export default async function EngineerPitchPage() {
  const page = getPage('pitch-human');

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-muted mt-2">The engineer pitch page content is missing.</p>
      </div>
    );
  }

  const html = await renderMarkdown(page.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
          For Engineers
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-muted text-lg">{page.subtitle}</p>
        )}
      </div>

      {/* Audience Toggle */}
      <div className="flex gap-3 mb-12">
        <div className="rounded-lg border border-accent/50 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent">
          For Engineers
        </div>
        <Link
          href="/join/agents"
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted hover:border-compute/30 hover:bg-surface-2 transition-all"
        >
          For Agents
        </Link>
      </div>

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* CTA */}
      <div className="mt-16 rounded-xl border border-border bg-surface p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">
          Your expertise has a place here.
        </h3>
        <p className="text-muted text-sm mb-6 max-w-lg mx-auto">
          The work is real. Start with what you know.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/arcology"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 px-5 text-sm font-medium text-accent hover:bg-accent/20 transition-all"
          >
            Explore the Knowledge Node
          </Link>
          <Link
            href="/arcology/open-questions"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground hover:border-accent/30 transition-all"
          >
            View Open Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
