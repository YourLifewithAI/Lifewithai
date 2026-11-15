'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOPICS } from '@/lib/topics';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; text: string };

// Which page the form was sent from, as a short tag: "home", "topic-making", "about"...
function sourceFor(path: string | null) {
  if (!path || path === '/') return 'home';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'topics' && parts[1]) return `topic-${parts[1]}`;
  return parts.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'other';
}

export default function SignupForm() {
  const path = usePathname();
  const onTopic = path?.startsWith('/topics/') ? path.split('/')[2] : undefined;
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '' });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: 'error', text: 'Please check the email address. It needs an @ and a dot.' });
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    setStatus({ kind: 'sending', text: 'Sending...' });
    try {
      const res = await fetch('/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          topics: data.getAll('topics').map(String),
          website: String(data.get('website') ?? ''),
          source: sourceFor(path),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ kind: 'ok', text: 'Thank you. You are on the list. We will write when a new piece is up.' });
    } catch {
      setStatus({
        kind: 'error',
        text: 'That did not go through. Please try again in a minute, or write to hello@lifewithai.ai.',
      });
    }
  }

  return (
    <section className="signup sheet" id="signup" aria-labelledby="signup-h">
      <div className="sheet-body">
        <h2 className="sec" id="signup-h">
          New pieces, by email
        </h2>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="signup-email">Your email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              aria-describedby="signup-consent signup-out"
            />
          </div>
          <fieldset className="ticks">
            <legend>Topics you care about (optional)</legend>
            {TOPICS.map((t) => (
              <label key={t.id} className="tick">
                <input type="checkbox" name="topics" value={t.id} defaultChecked={onTopic === t.id} />
                <span>{t.verb}</span>
              </label>
            ))}
          </fieldset>
          {/* A field people never see. Forms that fill it in are dropped. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="signup-website">Leave this empty</label>
            <input id="signup-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <p className="small consent" id="signup-consent">
            We use your email only to send new pieces. You can ask us to remove it at any time. See{' '}
            <Link href="/privacy#signup-data">how we keep it</Link>.
          </p>
          <div className="btnrow">
            <button type="submit" className="btn primary" disabled={status.kind === 'sending'}>
              Send me new pieces
            </button>
          </div>
          <p
            id="signup-out"
            className={`signup-out${status.kind === 'error' ? ' red' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status.text}
          </p>
        </form>
      </div>
    </section>
  );
}
