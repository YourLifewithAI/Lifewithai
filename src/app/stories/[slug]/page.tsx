import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllStories, getStory, getExperience } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import SubscribeForm from '@/components/SubscribeForm';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: 'Story Not Found' };

  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary || '',
      type: 'article',
      publishedTime: story.published,
      authors: ['SB Corvus'],
      tags: story.themes,
    },
    twitter: {
      card: 'summary',
      title: story.title,
      description: story.summary || '',
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getStory(slug);

  if (!story) notFound();

  const html = await renderMarkdown(story.content);

  // Find next/prev stories for navigation
  const allStories = getAllStories();
  const currentIndex = allStories.findIndex(s => s.slug === slug);
  const nextStory = currentIndex >= 0 && currentIndex < allStories.length - 1
    ? allStories[currentIndex + 1] : null;
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ShortStory',
    name: story.title,
    headline: story.subtitle ? `${story.title}: ${story.subtitle}` : story.title,
    author: {
      '@type': 'Person',
      name: 'SB Corvus',
      url: 'https://lifewithai.ai/about',
    },
    datePublished: story.published,
    description: story.summary || '',
    url: `https://lifewithai.ai/stories/${slug}`,
    genre: ['speculative fiction', 'science fiction', 'AI fiction'],
    wordCount: story.word_count,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: story.series,
      url: 'https://lifewithai.ai/stories',
    },
    keywords: story.themes?.join(', '),
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Life with AI',
      url: 'https://lifewithai.ai',
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <header className="mb-10">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-3">
          {story.series}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {story.title}
        </h1>
        {story.subtitle && (
          <p className="mt-2 text-xl text-muted">{story.subtitle}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>{new Date(story.published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>&middot;</span>
          <span>{story.word_count?.toLocaleString()} words</span>
          {story.parts > 1 && (
            <>
              <span>&middot;</span>
              <span>{story.parts} parts</span>
            </>
          )}
        </div>
        {story.themes && story.themes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {story.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full bg-surface-2 px-3 py-0.5 text-xs text-muted"
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Interactive experience banner */}
      {getExperience(slug) && (
        <Link
          href={`/stories/${slug}/experience`}
          className="group mb-10 flex items-center gap-4 rounded-xl border border-environmental/20 bg-environmental/5 p-5 hover:border-environmental/40 transition-all"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-environmental/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#2A9D8F" strokeWidth="1.5" />
              <path d="M10 6v4l2.5 2.5" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white group-hover:text-environmental transition-colors">
              Explore the interactive experience
            </p>
            <p className="text-xs text-muted mt-0.5">
              The science behind this story — real data, interactive diagrams
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-muted group-hover:text-environmental transition-colors">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}

      {/* Story content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Post-story CTA */}
      <footer className="mt-16 space-y-8 border-t border-border pt-10">
        {/* Subscribe */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
          <p className="text-lg font-semibold text-white mb-1">
            New stories every Saturday
          </p>
          <p className="text-sm text-muted mb-4">
            Near-future fiction about humans and AI figuring it out together. No spam.
          </p>
          <SubscribeForm source="footer" compact />
        </div>

        {/* Story navigation */}
        <div className="flex justify-between gap-4">
          {prevStory ? (
            <Link
              href={`/stories/${prevStory.slug}`}
              className="group flex-1 rounded-lg border border-border bg-surface p-4 hover:border-accent/30 transition-all"
            >
              <p className="text-xs text-muted mb-1">&larr; Previous</p>
              <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                {prevStory.title}
              </p>
            </Link>
          ) : <div className="flex-1" />}
          {nextStory ? (
            <Link
              href={`/stories/${nextStory.slug}`}
              className="group flex-1 rounded-lg border border-border bg-surface p-4 hover:border-accent/30 transition-all text-right"
            >
              <p className="text-xs text-muted mb-1">Next &rarr;</p>
              <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                {nextStory.title}
              </p>
            </Link>
          ) : <div className="flex-1" />}
        </div>

        {/* Back to all stories */}
        <div className="text-center">
          <Link
            href="/stories"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            All stories
          </Link>
        </div>
      </footer>
    </article>
  );
}
