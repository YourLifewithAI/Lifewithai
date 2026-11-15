'use client';

import { useState, type FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface FeedbackWidgetProps {
  /** Current page URL for context */
  pageUrl: string;
  /** Entry title if on an entry page */
  entryTitle?: string;
  /** Domain slug for context */
  domain?: string;
}

type FeedbackCategory = 'content' | 'parameters' | 'citation' | 'general';
type FormState = 'collapsed' | 'idle' | 'submitting' | 'success' | 'error';

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'content', label: 'Content accuracy' },
  { value: 'parameters', label: 'Parameter values' },
  { value: 'citation', label: 'Citation needed' },
  { value: 'general', label: 'General feedback' },
];

export default function FeedbackWidget({
  pageUrl,
  entryTitle,
  domain,
}: FeedbackWidgetProps) {
  const { data: session } = useSession();
  const [state, setState] = useState<FormState>('collapsed');
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (state === 'success') {
    return (
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <p className="text-sm text-accent">
          Thanks for your feedback! It&apos;s been recorded and will be reviewed.
        </p>
        <button
          onClick={() => {
            setState('collapsed');
            setMessage('');
            setCategory('general');
            setSource('');
          }}
          className="mt-2 text-xs text-muted hover:text-foreground transition-colors"
        >
          Submit another
        </button>
      </div>
    );
  }

  if (state === 'collapsed') {
    return (
      <button
        onClick={() => setState('idle')}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted hover:text-foreground hover:border-accent/30 transition-all w-full sm:w-auto"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        Send feedback on this entry
      </button>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setState('submitting');
    setErrorMsg('');

    try {
      const payload: Record<string, unknown> = {
        source: session?.user
          ? `user:${session.user.id}`
          : (source.trim() || 'anonymous-web'),
        category,
        message: message.trim(),
        page_url: pageUrl,
        metadata: {
          entry_title: entryTitle,
          domain,
          authenticated: !!session?.user,
          ...(session?.user && {
            user_name: session.user.name,
            user_provider: session.user.provider,
          }),
        },
      };

      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit feedback.');
        setState('idle');
        return;
      }

      setState('success');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setState('idle');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-white">Send Feedback</h4>
        <button
          type="button"
          onClick={() => setState('collapsed')}
          className="text-muted hover:text-foreground transition-colors"
          aria-label="Close feedback form"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === cat.value
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-2 text-muted hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          category === 'parameters'
            ? 'Which parameter needs correction? What should the value be, and what is your source?'
            : category === 'citation'
            ? 'What claim needs a citation? Do you have a specific source to suggest?'
            : 'Your feedback on this entry...'
        }
        required
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors resize-y"
      />

      {/* Source field (only for anonymous users) */}
      {!session?.user && (
        <div className="mt-3">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Your name or handle (optional)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <p className="mt-1 text-xs text-muted">
            <Link href="/auth/signin" className="text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
            {' '}for automatic attribution.
          </p>
        </div>
      )}

      {/* Signed-in indicator */}
      {session?.user && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          {session.user.image && (
            <img src={session.user.image} alt="" className="h-4 w-4 rounded-full" />
          )}
          <span>Submitting as {session.user.name || session.user.email}</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}

      {/* Submit */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setState('collapsed')}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={state === 'submitting' || !message.trim()}
          className="rounded-lg bg-accent/15 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state === 'submitting' ? 'Sending...' : 'Send Feedback'}
        </button>
      </div>
    </form>
  );
}
