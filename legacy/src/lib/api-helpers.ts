// ============================================================
// Arcology Knowledge Node — API Helpers
// ============================================================
// Shared utilities for REST API route handlers.

import fs from 'fs';
import path from 'path';
import type { ContentIndex } from './types';

const INDEX_PATH = path.join(process.cwd(), 'public', 'content-index.json');

let cachedIndex: ContentIndex | null = null;

export function getContentIndex(): ContentIndex {
  if (!cachedIndex) {
    const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
    cachedIndex = JSON.parse(raw) as ContentIndex;
  }
  return cachedIndex;
}

export function getKnowledgeBaseVersion(): string {
  const index = getContentIndex();
  return index.knowledge_base_version;
}

export function jsonLdContext() {
  return {
    '@context': {
      '@vocab': 'https://lifewithai.ai/schema/',
      'kedl': 'https://lifewithai.ai/schema/kedl',
      'confidence': 'https://lifewithai.ai/schema/confidence',
      'domain': 'https://lifewithai.ai/schema/domain',
      'parameters': 'https://lifewithai.ai/schema/parameters',
    },
  };
}

export function apiResponse(data: unknown, status = 200): Response {
  return Response.json(
    {
      ...jsonLdContext(),
      knowledge_base_version: getKnowledgeBaseVersion(),
      ...data as object,
    },
    {
      status,
      headers: {
        'Content-Type': 'application/ld+json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    }
  );
}

export function errorResponse(message: string, status = 404): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
