import { getContentIndex, apiResponse, errorResponse } from '@/lib/api-helpers';
import { searchEntries } from '@/lib/search';
import type { NextRequest } from 'next/server';
import type { Domain, KEDLLevel, ConfidenceLevel, EntryType } from '@/lib/types';

export async function GET(request: NextRequest) {
  const index = getContentIndex();
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('q') || '';
  const domain = searchParams.get('domain') as Domain | null;
  const kedlMin = searchParams.get('kedl_min');
  const confMin = searchParams.get('confidence_min');
  const entryType = searchParams.get('type') as EntryType | null;
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!query && !domain) {
    return errorResponse('Provide at least a query (q) or domain filter', 400);
  }

  const results = searchEntries(index.entries, {
    query: query || undefined,
    domain: domain || undefined,
    kedl_min: kedlMin ? (parseInt(kedlMin) as KEDLLevel) : undefined,
    confidence_min: confMin ? (parseInt(confMin) as ConfidenceLevel) : undefined,
    entry_type: entryType || undefined,
  });

  // Strip content for search results
  const summaryResults = results.slice(0, limit).map(({ content, ...rest }) => rest);

  return apiResponse({
    query: query || null,
    filters: {
      domain: domain || null,
      kedl_min: kedlMin ? parseInt(kedlMin) : null,
      confidence_min: confMin ? parseInt(confMin) : null,
      type: entryType || null,
    },
    results: summaryResults,
    count: summaryResults.length,
    total_matches: results.length,
  });
}
