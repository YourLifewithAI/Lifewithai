import type { MetadataRoute } from 'next';
import { getAllStories, getAllBlogPosts, getAllKnowledgeEntries, getAllInfographics } from '@/lib/content';
import { DOMAINS } from '@/lib/types';

const BASE_URL = 'https://lifewithai.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/stories`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/arcology`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/brief`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/podcast`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/mcp`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/infographics`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Stories
  const stories = getAllStories().filter(s => s.slug !== 'water-part-2');
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${BASE_URL}/stories/${story.slug}`,
    lastModified: story.published || now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const posts = getAllBlogPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.published || now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Arcology domain index pages
  const domainPages: MetadataRoute.Sitemap = DOMAINS.map((domain) => ({
    url: `${BASE_URL}/arcology/${domain}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Arcology knowledge entries
  const entries = getAllKnowledgeEntries();
  const entryPages: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${BASE_URL}/arcology/${entry.domain}/${entry.slug}`,
    lastModified: entry.updated || now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Infographics
  const infographics = getAllInfographics();
  const infographicPages: MetadataRoute.Sitemap = infographics.map((info) => ({
    url: `${BASE_URL}/infographics/${info.slug}`,
    lastModified: info.lastUpdated || now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const readerPages: MetadataRoute.Sitemap = ['/arcology/floors/318/mel', '/arcology/floors/318/pell', '/arcology/tessera', '/arcology/research', '/workshop'].map(route => ({url: BASE_URL + route, changeFrequency: 'monthly', priority: 0.7}));
  return [...readerPages, ...staticPages, ...storyPages, ...blogPages, ...infographicPages, ...domainPages, ...entryPages];
}
