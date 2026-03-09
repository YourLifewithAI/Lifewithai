// ============================================================
// Arcology Knowledge Node — NextAuth.js Route Handler
// ============================================================
// Handles all /api/auth/* routes: sign-in, sign-out, callbacks,
// session, CSRF token, and provider metadata.

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
