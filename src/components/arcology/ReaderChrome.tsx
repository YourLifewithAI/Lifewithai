'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnalyticsSettingsButton } from '@/components/GoogleAnalytics';
// Keep scene content out of the shared client navigation bundle.
const subscriptionUrl = 'https://sbcorvus.substack.com';

export function isReaderPath(path: string) {
  return (
    path === '/' ||
    path === '/arcology' ||
    path === '/stories' ||
    path === '/stories/water' ||
    path === '/stories/water/experience' ||
    path === '/stories/water-part-2' ||
    path.startsWith('/arcology/floors/') ||
    path === '/arcology/tessera' ||
    path === '/workshop'
  );
}
export function ReaderHeader() {
  const path = usePathname();
  return (
    <header className="city-header">
      <a className="city-skip" href="#reader-content">
        Skip to content
      </a>
      <Link className="city-brand" href="/" aria-label="Life with AI home">
        <span aria-hidden="true">◈</span> Life with AI
      </Link>
      <nav aria-label="Main navigation">
        <Link
          href="/arcology"
          aria-current={path === '/arcology' || path === '/' ? 'page' : undefined}
        >
          Arcology
        </Link>
        <Link href="/stories" aria-current={path === '/stories' ? 'page' : undefined}>
          Stories
        </Link>
        <Link href="/workshop" aria-current={path === '/workshop' ? 'page' : undefined}>
          Workshop
        </Link>
        <a href={subscriptionUrl}>Follow the stories</a>
      </nav>
    </header>
  );
}
export function ReaderFooter() {
  return (
    <footer className="city-footer">
      <div>
        <p className="city-footer-title">There are more lives to meet.</p>
        <p>New stories and places, as they are ready.</p>
        <a className="city-button" href={subscriptionUrl}>
          Follow on Substack
        </a>
      </div>
      <div className="city-footer-links">
        <Link href="/about">About Life with AI</Link>
        <Link href="/arcology/research">Engineering the Arcology</Link>
        <Link href="/mcp">For AI agents</Link>
        <Link href="/privacy">Analytics and privacy</Link>
        <AnalyticsSettingsButton className="cursor-pointer text-left" />
        <span>Built by humans and AI, together.</span>
      </div>
    </footer>
  );
}
