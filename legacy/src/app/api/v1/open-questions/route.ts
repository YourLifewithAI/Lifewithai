import { getContentIndex, apiResponse } from '@/lib/api-helpers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const index = getContentIndex();
  const searchParams = request.nextUrl.searchParams;

  const domainFilter = searchParams.get('domain');
  const limit = parseInt(searchParams.get('limit') || '100');

  let entries = index.entries;
  if (domainFilter) {
    entries = entries.filter((e) => e.domain === domainFilter);
  }

  const questions = entries.flatMap((entry) =>
    entry.open_questions.map((q) => ({
      question: q,
      entry_id: entry.id,
      entry_title: entry.title,
      domain: entry.domain,
      subdomain: entry.subdomain,
      kedl: entry.kedl,
      confidence: entry.confidence,
    }))
  );

  const limited = questions.slice(0, limit);

  return apiResponse({
    questions: limited,
    count: limited.length,
    total: questions.length,
    domain: domainFilter || null,
  });
}
