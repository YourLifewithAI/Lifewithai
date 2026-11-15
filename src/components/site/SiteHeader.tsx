import Link from 'next/link';
import { SITE } from '@/lib/site';
import { slot, words } from '@/lib/words';

// The bar on every page but the front page (the front page's cover sheet carries the name and its own Subscribe).
// A server component: the layout hands it to HeaderGate, which leaves it off the front page.
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
      </div>
    </header>
  );
}
