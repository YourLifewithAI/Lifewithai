import Link from 'next/link';
import ThemeToggle from '@/components/site/ThemeToggle';
import { SITE } from '@/lib/site';
import { slot, words } from '@/lib/words';

/** The words for the sun and the moon next to Subscribe (words/site.md). */
export function themeWords() {
  const w = words('site');
  return {
    group: slot(w, 'Colour switch, for screen readers'),
    light: slot(w, 'Colour switch: light'),
    dark: slot(w, 'Colour switch: dark'),
  };
}

// The bar on every page but the front page (the front page's cover sheet carries the name, its own Subscribe and its
// own sun and moon). A server component: the layout hands it to HeaderGate, which leaves it off the front page.
export default function SiteHeader() {
  return (
    <header className="bar">
      <div className="bar-in">
        <p className="bar-name">
          <Link className="brand" href="/">
            {SITE.name}
          </Link>
          <span className="bar-line">{SITE.line}</span>
        </p>
        <a className="btn" href="#signup">
          {slot(words('site'), 'Subscribe button')}
        </a>
        <ThemeToggle words={themeWords()} />
      </div>
    </header>
  );
}
