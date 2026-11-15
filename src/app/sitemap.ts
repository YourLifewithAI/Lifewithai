import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { TOPIC_IDS } from '@/lib/topics';

// The new site's pages only. Old addresses redirect to the archive and are not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    changeFrequency: 'weekly',
    priority,
  });
  return [
    page('', 1.0),
    ...TOPIC_IDS.map((id) => page(`/topics/${id}`, 0.8)),
    page('/projects/asher', 0.7),
    page('/about', 0.5),
    page('/privacy', 0.3),
  ];
}
