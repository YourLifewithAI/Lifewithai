'use client';

import { usePathname } from 'next/navigation';

// The front page's cover sheet carries the name and its own Subscribe, so the bar is left off there.
// The bar itself (SiteHeader) comes in as children from the layout, with its words already in it.
export default function HeaderGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path === '/' ? null : children;
}
