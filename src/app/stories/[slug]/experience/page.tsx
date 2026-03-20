import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExperience, getAllExperienceSlugs, getStory } from '@/lib/content';
import ExperienceShell from '@/components/experience/ExperienceShell';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllExperienceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return { title: 'Experience Not Found' };

  return {
    title: `${experience.title} — Interactive Experience`,
    description: experience.subtitle,
    openGraph: {
      title: experience.title,
      description: experience.subtitle,
      type: 'article',
    },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const experience = getExperience(slug);
  const story = getStory(slug);

  if (!experience) notFound();

  return (
    <div className="min-h-screen" style={{ background: experience.theme.background }}>
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6">
        <Link
          href={story ? `/stories/${slug}` : '/stories'}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {story ? `Back to "${story.title}"` : 'All stories'}
        </Link>
        <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: experience.theme.primary }}>
          Interactive Experience
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {experience.title}
        </h1>
        <p className="mt-2 text-lg text-muted max-w-2xl">
          {experience.subtitle}
        </p>
        <p className="mt-4 text-sm text-muted/70 max-w-2xl leading-relaxed">
          {experience.intro}
        </p>
      </header>

      {/* Interactive Shell */}
      <ExperienceShell experience={experience} />

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted/50">
            Data sourced from peer-reviewed research (2024-2025). See individual metrics for citations.
          </p>
          {story && (
            <Link
              href={`/stories/${slug}`}
              className="text-sm font-medium hover:text-accent transition-colors"
              style={{ color: experience.theme.primary }}
            >
              Read the story &rarr;
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
