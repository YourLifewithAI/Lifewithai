import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { TOPICS } from '@/lib/topics';

// The new site's pages only. Old addresses redirect to the archive and are not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    changeFrequency: 'weekly',
    priority,
  });
  return [
    page('', 1.0),
    ...TOPICS.map((t) => page(`/topics/${t.id}`, 0.8)),
    page('/projects/asher', 0.7),
    page('/about', 0.5),
    page('/privacy', 0.3),
  ];
}
