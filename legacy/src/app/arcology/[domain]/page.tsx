import { notFound } from 'next/navigation';
import { getDomainMeta, getEntriesByDomain, getAllDomainMeta } from '@/lib/content';
import { DOMAIN_COLORS } from '@/lib/constants';
import type { Domain } from '@/lib/types';
import type { Metadata } from 'next';
import DomainPageClient from './DomainPageClient';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateStaticParams() {
  const domains = getAllDomainMeta();
  return domains.map((d) => ({ domain: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const meta = getDomainMeta(domain as Domain);
  if (!meta) return { title: 'Domain Not Found' };

  return {
    title: meta.name,
    description: meta.description,
  };
}

export default async function DomainPage({ params }: PageProps) {
  const { domain } = await params;
  const meta = getDomainMeta(domain as Domain);

  if (!meta) notFound();

  const entries = getEntriesByDomain(domain as Domain);
  const color = DOMAIN_COLORS[domain as Domain] || '#888';

  // Collect open questions with serializable data
  const openQuestions = entries.flatMap((e) =>
    e.open_questions.map((q) => ({ question: q, entryTitle: e.title, entrySlug: e.slug }))
  );

  // Serialize entries for client component (strip markdown content to reduce payload)
  const serializedEntries = entries.map((e) => ({
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    subdomain: e.subdomain,
    kedl: e.kedl,
    confidence: e.confidence,
    entry_type: e.entry_type,
    parameters: e.parameters,
  }));

  return (
    <DomainPageClient
      domain={domain}
      meta={meta}
      entries={serializedEntries}
      openQuestions={openQuestions}
      color={color}
    />
  );
}
