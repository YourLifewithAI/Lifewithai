// ============================================================
// NextAuth.js Type Augmentation
// ============================================================
// Extends the default NextAuth session and JWT types
// with Arcology-specific fields (user ID, role, provider, trust).

import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: string;
      provider: string;
      providerId: string;
      trustScore: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: string;
    provider?: string;
    providerId?: string;
    trustScore?: number;
  }
}
