'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';

// The front page's cover sheet carries the name and its own Subscribe, so the bar is left off there.
export default function HeaderGate() {
  const path = usePathname();
  return path === '/' ? null : <SiteHeader />;
}
