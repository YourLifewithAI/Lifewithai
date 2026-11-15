// ============================================================
// Arcology Knowledge Node — NextAuth.js Configuration
// ============================================================
// Central auth config. Imported by the [...nextauth] route handler
// and by server components that need session data via getServerSession().
//
// Supports two OAuth providers: GitHub and Google.
// User records are persisted in Netlify Blobs ('users' store).
// JWT strategy — no database adapter required.

import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import crypto from 'crypto';
import { getJSON, setJSON } from './storage';
import { DEFAULT_TRUST_SCORE } from './auth-types';
import type { UserSession } from './auth-types';

const USERS_STORE = 'users';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in, user and account are present.
      // Create or update the user record in Netlify Blobs.
      if (user && account) {
        const providerKey = `${account.provider}:${account.providerAccountId}`;
        let userRecord = await getJSON<UserSession>(USERS_STORE, providerKey);

        if (!userRecord) {
          // New user — create record with default trust score
          userRecord = {
            id: crypto.randomUUID(),
            provider: account.provider as 'github' | 'google',
            provider_id: account.providerAccountId,
            name: user.name || '',
            email: user.email || '',
            avatar_url: user.image || undefined,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            trust_score: { ...DEFAULT_TRUST_SCORE, last_updated: new Date().toISOString() },
            role: 'visitor',
          };
          await setJSON(USERS_STORE, providerKey, userRecord);
        } else {
          // Returning user — update last login and profile data
          userRecord.last_login = new Date().toISOString();
          if (user.name) userRecord.name = user.name;
          if (user.image) userRecord.avatar_url = user.image;
          await setJSON(USERS_STORE, providerKey, userRecord);
        }

        // Attach user data to the JWT token
        token.userId = userRecord.id;
        token.role = userRecord.role;
        token.provider = userRecord.provider;
        token.providerId = userRecord.provider_id;
        token.trustScore = userRecord.trust_score?.overall ?? 0.5;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose custom fields on the client-side session object
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
        session.user.providerId = token.providerId as string;
        session.user.trustScore = token.trustScore as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

/**
 * Check if at least one OAuth provider is configured.
 */
export function isAuthConfigured(): boolean {
  return !!(
    process.env.AUTH_SECRET &&
    (
      (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) ||
      (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    )
  );
}

/**
 * Auth status for client-side display.
 * Returns which providers are configured (safe to expose).
 */
export function getAuthStatus() {
  const providers: { id: string; name: string }[] = [];
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push({ id: 'github', name: 'GitHub' });
  }
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push({ id: 'google', name: 'Google' });
  }
  return {
    configured: isAuthConfigured(),
    providers,
  };
}
