// ============================================================
// Arcology Knowledge Node — Auth Status API
// ============================================================
// GET /api/v1/auth — Check auth configuration status
//
// Returns whether OAuth is configured, which providers are
// available, and whether the current request is authenticated.

import { type NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-helpers';
import { getAuthStatus } from '@/lib/auth-config';
import { API_KEY_PREFIX } from '@/lib/auth-types';

export async function GET(request: NextRequest) {
  const authStatus = getAuthStatus();

  // Check if current request has auth
  const authHeader = request.headers.get('authorization');
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;

  let currentAuth: { type: string; identifier?: string } = { type: 'anonymous' };

  if (authHeader) {
    const key = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (key.startsWith(API_KEY_PREFIX)) {
      currentAuth = { type: 'api_key', identifier: key.substring(0, 12) + '...' };
    }
  } else if (sessionToken) {
    currentAuth = { type: 'session' };
  }

  return apiResponse({
    auth: {
      configured: authStatus.configured,
      providers: authStatus.providers,
      current_request: currentAuth,
    },
    submission_paths: {
      human: {
        method: 'OAuth sign-in → web form → POST /api/v1/proposals',
        status: authStatus.configured ? 'active' : 'pending_configuration',
      },
      agent: {
        method: 'API key → POST /api/v1/proposals',
        status: 'active',
        key_format: 'arc_ak_{32 hex chars}',
        auth_header: 'Authorization: Bearer arc_ak_...',
      },
    },
  });
}
