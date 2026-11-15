'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ANALYTICS_CHOICE_KEY, ANALYTICS_SETTINGS_EVENT, AnalyticsChoice,
  analyticsAvailable, readAnalyticsChoice, saveAnalyticsChoice,
  startGoogleAnalytics, stopGoogleAnalytics, trackSubstackClick,
} from '@/lib/google-analytics';

// Every word here comes in as props from server components (words/site.md): this file runs in the browser.
export function AnalyticsSettingsButton({ className, label }: { className?: string; label: string }) {
  return (
    <button type="button" className={className}
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}>
      {label}
    </button>
  );
}

export interface AnalyticsWords {
  label: string; // the banner's name for screen readers
  heading: string;
  text: string;
  link: string; // the link to the privacy page
  preview: string; // shown only where Google Analytics is switched off
  decline: string;
  accept: string;
}

export default function GoogleAnalytics({ words }: { words: AnalyticsWords }) {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [showChoice, setShowChoice] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const enabled = analyticsAvailable();
    setAvailable(enabled);
    const saved = readAnalyticsChoice();
    setChoice(saved);
    setShowChoice(enabled && saved === null);
    const open = () => setShowChoice(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CHOICE_KEY && event.key !== null) return;
      const updated = readAnalyticsChoice();
      setChoice(updated);
      setShowChoice(enabled && updated === null);
      if (updated !== 'accepted') stopGoogleAnalytics();
    };
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, open);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ANALYTICS_SETTINGS_EVENT, open);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!available || choice !== 'accepted') return;
    startGoogleAnalytics(choice);
    const track = (event: MouseEvent) => {
      if (event.type === 'auxclick' && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (link instanceof HTMLAnchorElement) trackSubstackClick(link.href);
    };
    document.addEventListener('click', track);
    document.addEventListener('auxclick', track);
    return () => {
      document.removeEventListener('click', track);
      document.removeEventListener('auxclick', track);
    };
  }, [available, choice]);

  function choose(next: AnalyticsChoice) {
    saveAnalyticsChoice(next);
    setChoice(next);
    setShowChoice(false);
    if (next === 'declined') stopGoogleAnalytics();
  }

  if (!showChoice) return null;
  // A sheet on the site's tokens (globals.css), so it follows the light or dark pages. The two answers look the same.
  return (
    <section aria-label={words.label}
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-3xl border-2 border-[var(--ink)] bg-[var(--paper)] p-5 text-[var(--ink)] shadow-2xl sm:flex sm:items-center sm:gap-6">
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-semibold">{words.heading}</p>
        <p className="mt-1">{words.text}
          {' '}<Link href="/privacy" className="underline underline-offset-2">{words.link}</Link></p>
        {!available && <p className="mt-1">{words.preview}</p>}
      </div>
      <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
        <button type="button" onClick={() => choose('declined')}
          className="border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 hover:bg-[var(--paper-2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]">{words.decline}</button>
        <button type="button" onClick={() => choose('accepted')}
          className="border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 hover:bg-[var(--paper-2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]">{words.accept}</button>
      </div>
    </section>
  );
}
