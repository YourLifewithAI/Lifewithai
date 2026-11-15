import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInfographic, getAllInfographicSlugs } from '@/lib/content';
import InfographicRenderer from '@/components/infographics/InfographicRenderer';
import type { Metadata } from 'next';
import type { InfographicMeta } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllInfographicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getInfographic<{ meta: InfographicMeta }>(slug);
  if (!data) return { title: 'Infographic Not Found' };

  return {
    title: data.meta.title,
    description: data.meta.summary,
    openGraph: {
      title: data.meta.title,
      description: data.meta.summary,
      type: 'article',
    },
  };
}

export default async function InfographicPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getInfographic<{ meta: InfographicMeta; [key: string]: unknown }>(slug);

  if (!data) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Link
          href="/infographics"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Infographics
        </Link>

        <InfographicRenderer data={data} />
      </div>
    </div>
  );
}
