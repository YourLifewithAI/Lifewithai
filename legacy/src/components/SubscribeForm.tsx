'use client';

import { useState, type FormEvent } from 'react';

interface SubscribeFormProps {
  /** Pre-selected domain slug (e.g., from a domain page) */
  domain?: string;
  /** Human-readable domain name for display */
  domainName?: string;
  /** Where the form is rendered — sent to API for analytics */
  source?: 'footer' | 'domain-page' | 'api';
  /** Compact mode for footer placement */
  compact?: boolean;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function SubscribeForm({
  domain,
  domainName,
  source = 'footer',
  compact = false,
}: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          domains: domain ? [domain] : [],
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Something went wrong.');
        return;
      }

      setState('success');
      setMessage(
        domain
          ? `You'll be notified when ${domainName || domain} updates.`
          : "You're subscribed. We'll be in touch."
      );
      setEmail('');
    } catch {
      setState('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (state === 'success') {
    return (
      <div className={compact ? '' : 'rounded-xl border border-accent/20 bg-accent/5 p-5'}>
        <p className="text-sm text-accent">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? '' : 'rounded-xl border border-border bg-surface p-5'}>
      {!compact && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-white">
            {domain ? `Get ${domainName || domain} updates` : 'Stay in the loop'}
          </p>
          <p className="mt-1 text-xs text-muted">
            {domain
              ? 'New entries, revised parameters, and answered questions in this domain.'
              : 'New stories, knowledge entries, and project updates. No spam.'}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder="you@example.com"
          required
          className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="shrink-0 rounded-lg bg-accent/15 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      {state === 'error' && (
        <p className="mt-2 text-xs text-red-400">{message}</p>
      )}
    </form>
  );
}
