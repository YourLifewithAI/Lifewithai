'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: 'Server configuration error',
      description: 'There is a problem with the server configuration. Please contact the site administrator.',
    },
    AccessDenied: {
      title: 'Access denied',
      description: 'You do not have permission to sign in. Please contact the site administrator if you believe this is an error.',
    },
    Verification: {
      title: 'Verification error',
      description: 'The verification link may have expired or already been used.',
    },
    OAuthSignin: {
      title: 'Sign-in error',
      description: 'Error starting the OAuth sign-in flow. Please try again.',
    },
    OAuthCallback: {
      title: 'Callback error',
      description: 'Error completing the OAuth callback. Please try again.',
    },
    OAuthAccountNotLinked: {
      title: 'Account not linked',
      description: 'This email is already associated with a different sign-in method. Please use your original sign-in method.',
    },
    Default: {
      title: 'Authentication error',
      description: 'An unexpected error occurred during authentication. Please try again.',
    },
  };

  const { title, description } = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-accent/15 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/25 transition-colors"
          >
            Try again
          </Link>
          <Link
            href="/arcology"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            Browse anonymously
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
