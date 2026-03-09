'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface ContributeBannerProps {
  /** Domain slug for context-aware CTA */
  domain?: string;
  /** Human-readable domain name */
  domainName?: string;
  /** 'full' for landing pages, 'inline' for after entry content */
  variant?: 'full' | 'inline';
}

export default function ContributeBanner({
  domain,
  domainName,
  variant = 'inline',
}: ContributeBannerProps) {
  const { data: session } = useSession();

  if (variant === 'full') {
    return (
      <section className="rounded-xl border border-accent/20 bg-accent/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-white">
          Help build the knowledge base
        </h3>
        <p className="mt-2 max-w-lg mx-auto text-sm text-muted leading-relaxed">
          {domain
            ? `The ${domainName || domain} domain has open questions and gaps that need expert input.`
            : 'Every entry can be proposed, amended, or challenged. Humans and AI agents contribute through the same structured process.'
          }
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={domain ? `/arcology/propose?domain=${domain}` : '/arcology/propose'}
            className="rounded-lg bg-accent/15 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent/25 transition-colors"
          >
            Propose an Entry
          </Link>
          {domain && (
            <Link
              href={`/arcology/${domain}`}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              View Open Questions
            </Link>
          )}
        </div>
        {!session && (
          <p className="mt-4 text-xs text-muted">
            <Link href="/auth/signin" className="text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
            {' '}to receive recognition for your contributions, or contribute anonymously.
          </p>
        )}
      </section>
    );
  }

  // Inline variant — compact
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface px-5 py-4">
      <p className="text-sm text-muted flex-1 min-w-0">
        {domain
          ? `Know something about ${domainName || domain}?`
          : 'Have expertise to contribute?'
        }
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={domain ? `/arcology/propose?domain=${domain}` : '/arcology/propose'}
          className="rounded-md bg-accent/15 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/25 transition-colors"
        >
          Propose Entry
        </Link>
        {!session && (
          <Link
            href="/auth/signin"
            className="text-xs text-muted hover:text-accent transition-colors"
          >
            Sign in for recognition
          </Link>
        )}
      </div>
    </div>
  );
}
