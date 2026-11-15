import { getMissionControlData, getAllStories, getAllKnowledgeEntries, getAllDomainMeta } from '@/lib/content';
import { computeAggregateStats } from '@/lib/stats';
import { DOMAIN_COLORS } from '@/lib/constants';
import type { PipelineItem, Domain } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Live project dashboard for the Life with AI anthology and Arcology Knowledge Node.',
};

export default function MissionControlPage() {
  const mc = getMissionControlData();
  const stories = getAllStories();
  const entries = getAllKnowledgeEntries();
  const domains = getAllDomainMeta();
  const stats = computeAggregateStats(entries, domains);

  const pipeline = mc.pipeline;
  const wave1Items = pipeline?.queue.filter(q => q.wave === 1) || [];
  const wave2Items = pipeline?.queue.filter(q => q.wave === 2) || [];
  const wave1Complete = wave1Items.filter(q => q.status === 'completed').length;
  const wave2Complete = wave2Items.filter(q => q.status === 'completed').length;
  // Expert/AI system counts tracked internally only — not shown publicly until contributors opt in

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-3">
          Dashboard
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Mission Control
        </h1>
        <p className="mt-4 text-muted leading-relaxed max-w-2xl">
          A human and an AI building a speculative fiction anthology and engineering
          knowledge base together. This is the live view of the workshop.
        </p>
        {pipeline && (
          <p className="mt-2 text-xs text-muted">
            Last pipeline update: {new Date(pipeline.last_updated).toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: 'numeric', minute: '2-digit',
            })}
            {' '}&middot; Session #{pipeline.session_counter}
            {' '}&middot; Page built: {new Date(mc.generated_at).toLocaleString('en-US', {
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Scoreboard */}
      <section className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ScoreCard label="Stories Shipped" value={stories.length} detail={`of ${mc.stories_total}`} />
          <ScoreCard label="Research Complete" value={pipeline?.completed || 0} detail={`of ${pipeline?.total || 0}`} />
          <ScoreCard label="Knowledge Entries" value={stats.total_entries} />
          <ScoreCard label="Sessions Run" value={pipeline?.session_counter || 0} />
        </div>
      </section>

      {/* Two-column layout: Pipeline + Anthology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        {/* Pipeline - takes 2 columns */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Research Pipeline
          </h2>

          {/* Wave 1 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
                Wave 1 &mdash; Domain Deep Dives
              </h3>
              <span className="text-sm text-accent font-mono">
                {wave1Complete}/{wave1Items.length}
              </span>
            </div>
            <ProgressBar completed={wave1Complete} total={wave1Items.length} />
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {wave1Items.map((item) => (
                <PipelineDot key={item.order} item={item} />
              ))}
            </div>
          </div>

          {/* Wave 2 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
                Wave 2 &mdash; Cross-Domain Integration
              </h3>
              <span className="text-sm text-accent font-mono">
                {wave2Complete}/{wave2Items.length}
              </span>
            </div>
            <ProgressBar completed={wave2Complete} total={wave2Items.length} />
            <div className="mt-4 space-y-2">
              {wave2Items.map((item) => (
                <PipelineRow key={item.order} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Anthology sidebar */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            The Anthology
          </h2>
          <div className="rounded-xl border border-border bg-surface p-5 mb-6">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-white">{stories.length}</span>
              <span className="text-muted mb-1">of {mc.stories_total} stories</span>
            </div>
            <AnthologyBar shipped={stories.length} total={mc.stories_total} />
          </div>

          {/* Published stories list */}
          <div className="space-y-3">
            {stories.map((story) => (
              <a
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-accent/30 transition-all group"
              >
                <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                  {story.title}
                </p>
                {story.subtitle && (
                  <p className="text-xs text-muted mt-1">{story.subtitle}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span>{story.word_count?.toLocaleString()} words</span>
                  <span>&middot;</span>
                  <span>{story.series}</span>
                </div>
              </a>
            ))}

            {/* Placeholder slots */}
            {Array.from({ length: Math.min(3, mc.stories_total - stories.length) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="rounded-lg border border-border/50 border-dashed bg-surface/50 p-4"
              >
                <p className="text-xs text-muted italic">Story {stories.length + i + 1} &mdash; in progress</p>
              </div>
            ))}

            {mc.stories_total - stories.length > 3 && (
              <p className="text-xs text-muted text-center pt-2">
                +{mc.stories_total - stories.length - 3} more to come
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Knowledge base summary */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-6">
          Knowledge Base
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((domain) => {
            const color = DOMAIN_COLORS[domain.slug as Domain] || '#888';
            const domainEntries = entries.filter(e => e.domain === domain.slug);
            return (
              <a
                key={domain.slug}
                href={`/arcology/${domain.slug}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-accent/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {domain.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{domainEntries.length} entries</span>
                  <span>{domain.subdomains.length} subdomains</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// --- Components ---

function ScoreCard({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center">
      <div className="flex items-baseline justify-center gap-1.5">
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        {detail && <p className="text-xs text-muted">{detail}</p>}
      </div>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AnthologyBar({ shipped, total }: { shipped: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-sm transition-all ${
            i < shipped ? 'bg-accent' : 'bg-surface-2'
          }`}
        />
      ))}
    </div>
  );
}

function PipelineDot({ item }: { item: PipelineItem }) {
  const statusClasses: Record<string, string> = {
    completed: 'bg-accent',
    in_progress: 'bg-accent animate-pulse',
    pending: 'bg-surface-2',
    failed: 'bg-red-500',
  };

  return (
    <div
      className={`h-3 w-full rounded-sm ${statusClasses[item.status] || 'bg-surface-2'}`}
      title={`${item.domain} / ${item.subdomain} (${item.status})`}
    />
  );
}

function PipelineRow({ item }: { item: PipelineItem }) {
  const statusColors: Record<string, string> = {
    completed: 'text-accent',
    in_progress: 'text-accent animate-pulse',
    pending: 'text-muted',
    failed: 'text-red-400',
  };

  const statusIcons: Record<string, string> = {
    completed: '\u2713',
    in_progress: '\u25CF',
    pending: '\u25CB',
    failed: '\u2717',
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
      <span className={`font-mono text-xs w-4 ${statusColors[item.status]}`}>
        {statusIcons[item.status]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-foreground truncate">{item.subdomain}</p>
        <p className="text-xs text-muted truncate">{item.domain}</p>
      </div>
      {item.status === 'completed' && (
        <span className="text-xs text-accent shrink-0">Complete</span>
      )}
    </div>
  );
}
