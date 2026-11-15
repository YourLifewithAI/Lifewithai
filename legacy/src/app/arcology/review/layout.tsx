import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Queue',
  description: 'Knowledge Review Protocol — review pending proposals and track contribution metrics.',
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
