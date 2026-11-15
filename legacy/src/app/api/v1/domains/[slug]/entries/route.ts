import { getContentIndex, apiResponse, errorResponse } from '@/lib/api-helpers';
import type { NextRequest } from 'next/server';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const index = getContentIndex();

  const domain = index.domains.find((d) => d.slug === slug);
  if (!domain) {
    return errorResponse(`Domain "${slug}" not found`);
  }

  let entries = index.entries.filter((e) => e.domain === slug);

  // Apply filters from query params
  const searchParams = request.nextUrl.searchParams;

  const subdomain = searchParams.get('subdomain');
  if (subdomain) {
    entries = entries.filter((e) => e.subdomain === subdomain);
  }

  const kedlMin = searchParams.get('kedl_min');
  if (kedlMin) {
    const min = parseInt(kedlMin);
    entries = entries.filter((e) => e.kedl >= min);
  }

  const confMin = searchParams.get('confidence_min');
  if (confMin) {
    const min = parseInt(confMin);
    entries = entries.filter((e) => e.confidence >= min);
  }

  const entryType = searchParams.get('type');
  if (entryType) {
    entries = entries.filter((e) => e.entry_type === entryType);
  }

  // Strip content field for list view (too large)
  const summaryEntries = entries.map(({ content, ...rest }) => rest);

  return apiResponse({
    domain: slug,
    entries: summaryEntries,
    count: summaryEntries.length,
  });
}
