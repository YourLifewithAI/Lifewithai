'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ViewToggle from '@/components/ViewToggle';

interface BlogPostContentProps {
  title: string;
  published: string;
  tags: string[];
  author?: string;
  authorRole?: string;
  humanHtml: string;
  agentHtml?: string;
}

function BlogPostInner({
  title,
  published,
  tags,
  author,
  authorRole,
  humanHtml,
  agentHtml,
}: BlogPostContentProps) {
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') === 'agent' ? 'agent' : 'human';
  const [view, setView] = useState<'human' | 'agent'>(initialView);

  const hasAgentView = !!agentHtml;
  const activeHtml = view === 'agent' && agentHtml ? agentHtml : humanHtml;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>
            {new Date(published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {author && (
            <>
              <span>&middot;</span>
              <span className="text-white/70">
                {author}
                {authorRole && (
                  <span className="text-muted ml-1">({authorRole})</span>
                )}
              </span>
            </>
          )}
          {tags && tags.length > 0 && (
            <>
              <span>&middot;</span>
              <span>{tags.join(', ')}</span>
            </>
          )}
        </div>
      </header>

      {hasAgentView && (
        <div className="mb-10">
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: activeHtml }}
      />
    </article>
  );
}

function BlogPostFallback({
  title,
  published,
  tags,
  author,
  authorRole,
  humanHtml,
}: BlogPostContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>
            {new Date(published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {author && (
            <>
              <span>&middot;</span>
              <span className="text-white/70">
                {author}
                {authorRole && (
                  <span className="text-muted ml-1">({authorRole})</span>
                )}
              </span>
            </>
          )}
          {tags && tags.length > 0 && (
            <>
              <span>&middot;</span>
              <span>{tags.join(', ')}</span>
            </>
          )}
        </div>
      </header>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: humanHtml }}
      />
    </article>
  );
}

export default function BlogPostContent(props: BlogPostContentProps) {
  return (
    <Suspense fallback={<BlogPostFallback {...props} />}>
      <BlogPostInner {...props} />
    </Suspense>
  );
}
