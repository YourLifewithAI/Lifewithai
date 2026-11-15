import { getContentIndex, apiResponse, errorResponse } from '@/lib/api-helpers';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const index = getContentIndex();

  const domain = index.domains.find((d) => d.slug === slug);
  if (!domain) {
    return errorResponse(`Domain "${slug}" not found`);
  }

  const stats = index.domain_stats.find((ds) => ds.slug === slug);
  const entries = index.entries.filter((e) => e.domain === slug);

  return apiResponse({
    ...domain,
    stats,
    entry_count: entries.length,
  });
}
