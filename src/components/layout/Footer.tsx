'use client';
import { usePathname } from 'next/navigation';
import { isReaderPath, ReaderFooter } from '@/components/arcology/ReaderChrome';
import Link from 'next/link';
import SubscribeForm from '@/components/SubscribeForm';

export default function Footer() {
  const pathname = usePathname();
  return isReaderPath(pathname) ? <ReaderFooter /> : <LegacyFooter />;
}

function LegacyFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Subscribe row */}
        <div className="mb-10 pb-10 border-b border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Stay in the loop</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                New stories, knowledge entries, and project updates. No spam, no fluff.
              </p>
            </div>
            <SubscribeForm compact source="footer" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Life with AI</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Speculative fiction and collaborative engineering for human-AI futures.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/stories" className="text-sm text-muted hover:text-accent transition-colors">Stories</Link></li>
              <li><Link href="/arcology/research" className="text-sm text-muted hover:text-accent transition-colors">Arcology Knowledge Node</Link></li>
              <li><Link href="/arcology/domains" className="text-sm text-muted hover:text-accent transition-colors">Engineering Domains</Link></li>
              <li><Link href="/arcology/open-questions" className="text-sm text-muted hover:text-accent transition-colors">Open Questions</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/mcp" className="text-sm text-muted hover:text-accent transition-colors">For AI Agents</Link></li>
              <li><Link href="/api/v1/domains" className="text-sm text-muted hover:text-accent transition-colors">REST API</Link></li>
              <li><Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Community</h3>
            <ul className="mt-2 space-y-1.5">
              <li><a href="https://github.com/YourLifewithAI" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">GitHub</a></li>
              <li><a href="https://discord.gg/5mhwB7N5" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">Discord</a></li>
              <li><a href="https://reddit.com/r/lifewithai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">Reddit</a></li>
              <li><a href="https://bsky.app/profile/lifewithai.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">Bluesky</a></li>
              <li><a href="https://x.com/lifewithai2027" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">X</a></li>
              <li><a href="https://sbcorvus.substack.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-accent transition-colors">Substack</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted">
            Built by humans and AI, working together.
          </p>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Life with AI
          </p>
        </div>
      </div>
    </footer>
  );
}
