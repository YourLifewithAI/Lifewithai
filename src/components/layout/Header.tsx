'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/stories', label: 'Stories' },
  { href: '/blog', label: 'Blog' },
  { href: '/arcology', label: 'Arcology' },
  { href: '/brief', label: 'The Brief' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/mission-control', label: 'Mission Control' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Site Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.5"/>
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Life with AI
          </span>
        </Link>

        {/* Navigation + Auth */}
        <div className="hidden sm:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted hover:text-foreground hover:bg-surface-2'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-2 pl-2 border-l border-border">
            <AuthControls session={session} status={status} />
          </div>
        </div>

        {/* Mobile menu button */}
        <MobileMenu pathname={pathname} session={session} status={status} />
      </div>
    </header>
  );
}

function AuthControls({
  session,
  status,
}: {
  session: ReturnType<typeof useSession>['data'];
  status: ReturnType<typeof useSession>['status'];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (status === 'loading') {
    return <div className="h-8 w-8 rounded-full bg-surface-2 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-2 rounded-md transition-colors"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-medium">
            {(session.user.name || session.user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-56 rounded-lg border border-border bg-surface p-2 shadow-xl">
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-sm font-medium text-foreground truncate">
              {session.user.name || 'User'}
            </p>
            <p className="text-xs text-muted truncate">
              {session.user.email}
            </p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  pathname,
  session,
  status,
}: {
  pathname: string | null;
  session: ReturnType<typeof useSession>['data'];
  status: ReturnType<typeof useSession>['status'];
}) {
  return (
    <div className="sm:hidden">
      <details className="group relative">
        <summary className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-2 list-none">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </summary>
        <div className="absolute right-0 top-12 w-48 rounded-lg border border-border bg-surface p-2 shadow-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  block px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-muted hover:text-foreground hover:bg-surface-2'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border mt-1 pt-1">
            {status === 'loading' ? null : session?.user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-xs text-muted truncate">{session.user.name || session.user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-md transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
