import { getContentIndex, apiResponse } from '@/lib/api-helpers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const index = getContentIndex();
  const searchParams = request.nextUrl.searchParams;

  const domainFilter = searchParams.get('domain');
  const nameFilter = searchParams.get('parameter_name');

  let entries = index.entries;
  if (domainFilter) {
    entries = entries.filter((e) => e.domain === domainFilter);
  }

  const parameters = entries.flatMap((entry) =>
    entry.parameters
      .filter((p) => !nameFilter || p.name.includes(nameFilter))
      .map((p) => ({
        ...p,
        entry_id: entry.id,
        entry_title: entry.title,
        domain: entry.domain,
        subdomain: entry.subdomain,
      }))
  );

  return apiResponse({
    parameters,
    count: parameters.length,
    filters: {
      domain: domainFilter || null,
      parameter_name: nameFilter || null,
    },
  });
}
