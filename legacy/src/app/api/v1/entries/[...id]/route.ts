import { getContentIndex, apiResponse, errorResponse } from '@/lib/api-helpers';

interface RouteContext {
  params: Promise<{ id: string[] }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const entryId = id.join('/');
  const index = getContentIndex();

  const entry = index.entries.find((e) => e.id === entryId);
  if (!entry) {
    return errorResponse(`Entry "${entryId}" not found`);
  }

  return apiResponse({ entry });
}
