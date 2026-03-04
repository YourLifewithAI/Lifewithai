import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Updates, tutorials, and behind-the-scenes notes on building the Arcology Knowledge Node.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Blog</h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Updates, tutorials, and behind-the-scenes notes on building the world
          of Arcology One.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <p className="text-muted">
            Blog posts are coming soon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group rounded-xl border border-border bg-surface p-6 hover:border-accent/30 transition-all"
            >
              <h2 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-muted leading-relaxed">{post.summary}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                <span>
                  {new Date(post.published).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {post.author && (
                  <>
                    <span>&middot;</span>
                    <span>{post.author}</span>
                  </>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>&middot;</span>
                    <span>{post.tags.join(', ')}</span>
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
