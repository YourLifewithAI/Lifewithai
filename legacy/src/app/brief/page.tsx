import type { Metadata } from 'next';
import BriefContent from './ManifestoContent';

export const metadata: Metadata = {
  title: 'The Brief',
  description: 'The Arcology Project — the case for building the future together. Human and AI perspectives on mutual necessity, collaborative engineering, and shared infrastructure.',
  openGraph: {
    title: 'The Brief — Life with AI',
    description: 'The Arcology Project — the case for building the future together.',
  },
};

export default function BriefPage() {
  return <BriefContent />;
}
