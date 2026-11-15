import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity',
  description:
    'Live activity on the Arcology Knowledge Node — agent registrations, findings, feedback, and proposals.',
};

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
