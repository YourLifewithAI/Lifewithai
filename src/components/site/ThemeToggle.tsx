'use client';

import { useSyncExternalStore } from 'react';
import { THEME_COLOR, THEME_EVENT, THEME_KEY, type Theme } from '@/lib/theme';

// The sun and the moon next to Subscribe: light or dark pages. Its words come in as props (words/site.md).
// The script in the layout's <head> has already applied a saved choice before the first paint; this only reads it.
export interface ThemeWords {
  group: string; // the name read out for the pair
  light: string; // the sun
  dark: string; // the moon
}

const current = (): Theme => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

function apply(theme: Theme, save: boolean) {
  const root = document.documentElement;
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_COLOR[theme]));
  if (save) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // storage blocked: the choice holds for this page only
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange: () => void) {
  // a choice made in another tab
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY && e.key !== null) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      return;
    }
    apply(saved === 'dark' ? 'dark' : 'light', false);
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export default function ThemeToggle({ words, className }: { words: ThemeWords; className?: string }) {
  // The server cannot know the choice, so it renders the light one; the browser's value follows right after hydration.
  // The filled look comes from CSS keyed to data-theme, so it is right from the first paint.
  const theme = useSyncExternalStore<Theme>(subscribe, current, () => 'light');

  return (
    <div className={['theme', className].filter(Boolean).join(' ')} role="group" aria-label={words.group}>
      <button type="button" className="theme-btn theme-light" aria-pressed={theme === 'light'} aria-label={words.light}
        onClick={() => apply('light', true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </svg>
      </button>
      <button type="button" className="theme-btn theme-dark" aria-pressed={theme === 'dark'} aria-label={words.dark}
        onClick={() => apply('dark', true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M19.5 14.6A7.9 7.9 0 0 1 9.4 4.5a7.9 7.9 0 1 0 10.1 10.1z" />
        </svg>
      </button>
    </div>
  );
}
