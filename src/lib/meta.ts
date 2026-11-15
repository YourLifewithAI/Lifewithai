// Share metadata for every page. Next.js replaces a parent's openGraph object instead of merging it, so a
// page that sets its own must carry the image and site name too. This builds the whole set in one place.
import type { Metadata } from 'next';
import { SITE } from './site';

export function pageMeta({
  title,
  description,
  path,
}: {
  title?: string; // omit for the front page
  description: string;
  path: string;
}): Metadata {
  const image = { url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE.name}: ${SITE.line} ${SITE.tagline}` };
  const shareTitle = title ? `${title} | ${SITE.name}` : `${SITE.name}: ${SITE.line.replace(/\.$/, '')}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [image.url] },
  };
}
