import Link from 'next/link';
import { SITE } from '@/lib/site';

// The bar on every page but the front page (the front page's cover sheet carries the name and its own Subscribe).
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
          Subscribe
        </a>
      </div>
    </header>
  );
}
