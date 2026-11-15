import { getContentIndex, apiResponse } from '@/lib/api-helpers';

export async function GET() {
  const index = getContentIndex();

  return apiResponse({
    generated_at: index.generated_at,
    aggregate: index.aggregate_stats,
    domains: index.domain_stats,
  });
}
