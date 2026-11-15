'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Client-side providers wrapper.
 * Wraps the app with NextAuth SessionProvider so useSession()
 * works in any client component.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
