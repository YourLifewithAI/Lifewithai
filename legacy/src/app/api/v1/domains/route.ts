import { getContentIndex, apiResponse } from '@/lib/api-helpers';

export async function GET() {
  const index = getContentIndex();

  const domains = index.domain_stats.map((ds) => ({
    slug: ds.slug,
    name: ds.name,
    color: ds.color,
    entry_count: ds.entry_count,
    subdomain_count: ds.subdomain_count,
    open_question_count: ds.open_question_count,
    average_confidence: ds.average_confidence,
    last_updated: ds.last_updated,
  }));

  return apiResponse({ domains, count: domains.length });
}
