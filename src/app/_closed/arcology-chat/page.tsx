// ============================================================
// Arcology Chat — Page
// ============================================================
// A conversational interface to the Arcology knowledge base.
// Users can ask questions in natural language and get sourced
// answers backed by the engineering entries.

import type { Metadata } from 'next';
import ArcologyChat from '@/components/ArcologyChat';

export const metadata: Metadata = {
  title: 'Chat with the Knowledge Base',
  description:
    'Ask questions about Arcology One in natural language. Get sourced answers from the engineering knowledge base.',
};

export default function ArcologyChatPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-2">
          Knowledge Node
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Ask the Knowledge Base
        </h1>
        <p className="mt-2 text-sm text-muted max-w-lg mx-auto">
          Ask anything about Arcology One &mdash; structural engineering, energy systems,
          transport, governance, and more. Answers are sourced from the knowledge base entries.
        </p>
      </div>
      <ArcologyChat />
    </div>
  );
}
