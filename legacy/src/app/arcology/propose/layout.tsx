import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propose Entry',
  description: 'Submit a new knowledge entry to the Arcology Knowledge Node.',
};

export default function ProposeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
