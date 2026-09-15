'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ANALYTICS_CHOICE_KEY, ANALYTICS_SETTINGS_EVENT, AnalyticsChoice,
  analyticsAvailable, readAnalyticsChoice, saveAnalyticsChoice,
  startGoogleAnalytics, stopGoogleAnalytics, trackSubstackClick,
} from '@/lib/google-analytics';

export function AnalyticsSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className}
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}>
      Analytics preferences
    </button>
  );
}

export default function GoogleAnalytics() {
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
  return (
    <section aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-3xl rounded-xl border border-white/20 bg-[#171a1b] p-5 text-[#f5f2e9] shadow-2xl sm:flex sm:items-center sm:gap-6">
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-semibold">Help us understand what you enjoy</p>
        <p className="mt-1">With your permission, Google Analytics uses cookies to measure visits,
          reading engagement, and clicks to Substack. You can change your choice at any time.
          {' '}<Link href="/privacy" className="underline underline-offset-2">About analytics</Link></p>
        {!available && <p className="mt-1">Google Analytics is inactive on this preview.</p>}
      </div>
      <div className="mt-4 flex shrink-0 gap-3 sm:mt-0">
        <button type="button" onClick={() => choose('declined')}
          className="rounded-md border border-white/40 px-4 py-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4">Decline</button>
        <button type="button" onClick={() => choose('accepted')}
          className="rounded-md border border-white/40 px-4 py-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4">Accept</button>
      </div>
    </section>
  );
}
