import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost, getBlogPostAgentContent } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import BlogPostContent from './BlogPostContent';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const humanHtml = await renderMarkdown(post.content);

  // Load agent variant if it exists
  const agentContent = getBlogPostAgentContent(slug);
  const agentHtml = agentContent ? await renderMarkdown(agentContent) : undefined;

  return (
    <BlogPostContent
      title={post.title}
      published={post.published}
      tags={post.tags}
      author={post.author}
      authorRole={post.author_role}
      humanHtml={humanHtml}
      agentHtml={agentHtml}
    />
  );
}
