import Link from 'next/link';
import { getAllKnowledgeEntries, getAllDomainMeta } from '@/lib/content';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/constants';
import type { Domain } from '@/lib/types';
import ContributeBanner from '@/components/ContributeBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Questions',
  description: 'Unanswered engineering questions across all domains of the Arcology Knowledge Node.',
};

export default function OpenQuestionsPage() {
  const entries = getAllKnowledgeEntries();
  const domains = getAllDomainMeta();

  // Collect all open questions grouped by domain
  const questionsByDomain = new Map<string, Array<{ question: string; entryTitle: string; entrySlug: string; domain: string }>>();

  for (const entry of entries) {
    for (const q of entry.open_questions) {
      const group = questionsByDomain.get(entry.domain) || [];
      group.push({
        question: q,
        entryTitle: entry.title,
        entrySlug: entry.slug,
        domain: entry.domain,
      });
      questionsByDomain.set(entry.domain, group);
    }
  }

  const totalQuestions = Array.from(questionsByDomain.values()).reduce(
    (sum, group) => sum + group.length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Open Questions</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-3">Open Questions</h1>
      <p className="text-lg text-muted mb-10">
        {totalQuestions} unanswered engineering questions across the Knowledge Node.
        These represent gaps in our understanding &mdash; the frontier of what needs
        to be figured out.
      </p>

      {totalQuestions === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <p className="text-muted">No open questions yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(questionsByDomain.entries()).map(([domain, questions]) => {
            const color = DOMAIN_COLORS[domain as Domain] || '#888';
            return (
              <section key={domain}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full" style={{ background: color }} />
                  <h2 className="text-lg font-semibold text-white">
                    <Link href={`/arcology/${domain}`} className="hover:text-accent transition-colors">
                      {DOMAIN_NAMES[domain as Domain] || domain}
                    </Link>
                  </h2>
                  <span className="text-xs text-muted">({questions.length})</span>
                </div>

                <div className="space-y-3 ml-6">
                  {questions.map((oq, i) => (
                    <div key={i} className="rounded-lg border border-border bg-surface p-4">
                      <p className="text-foreground text-sm">{oq.question}</p>
                      <p className="mt-2 text-xs text-muted">
                        From:{' '}
                        <Link
                          href={`/arcology/${oq.domain}/${oq.entrySlug}`}
                          className="text-accent hover:underline"
                        >
                          {oq.entryTitle}
                        </Link>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Contribute CTA */}
      <section className="mt-12">
        <ContributeBanner variant="full" />
      </section>
    </div>
  );
}
