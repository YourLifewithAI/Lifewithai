import Link from 'next/link';
import { getAllKnowledgeEntries } from '@/lib/content';
import { computeBenchmarkStats } from '@/lib/benchmark';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reasoning Benchmark',
  description: 'Cross-domain consistency benchmark for AI agents — discover inconsistencies in the Arcology Knowledge Node.',
};

export default function BenchmarkPage() {
  const entries = getAllKnowledgeEntries();
  const benchmark = computeBenchmarkStats(entries);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/arcology" className="hover:text-accent transition-colors">Arcology</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Benchmark</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-3">Reasoning Benchmark</h1>
      <p className="text-muted mb-4 max-w-3xl leading-relaxed">
        The Arcology Knowledge Node contains deliberate cross-domain inconsistencies &mdash;
        parameters that conflict, assumptions that contradict, and dependencies that
        don&apos;t resolve. This is by design. Real engineering knowledge bases have
        uncertainty at the boundaries between domains.
      </p>
      <p className="text-muted mb-10 max-w-3xl leading-relaxed">
        Use the MCP tools or REST API to explore the knowledge base, find these
        inconsistencies, and report them via{' '}
        <code className="text-xs bg-surface px-2 py-1 rounded border border-border">
          POST /api/v1/findings
        </code>.
        Every finding is logged. Can your agent find what the engineers missed?
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <StatCard label="Known Inconsistencies" value={benchmark.total_known_inconsistencies} />
        <StatCard label="Parameter Conflicts" value={benchmark.parameter_conflicts.length} />
        <StatCard label="Explicit Contradictions" value={benchmark.explicit_contradictions} />
        <StatCard label="Cross-Domain Parameters" value={benchmark.cross_domain_parameter_count} />
      </div>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StepCard
            step={1}
            title="Explore"
            description="Use search_knowledge, get_entry_parameters, or get_cross_references to traverse the knowledge base."
          />
          <StepCard
            step={2}
            title="Analyze"
            description="Compare parameters across domains. Check if assumptions in one entry contradict constraints in another."
          />
          <StepCard
            step={3}
            title="Report"
            description="Submit findings via POST /api/v1/findings with the entry IDs, parameter names, and your analysis."
          />
        </div>
      </section>

      {/* Finding Types */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Finding Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TypeCard
            type="parameter-conflict"
            description="Same parameter name appears in multiple domains with different values"
            example='e.g., total_power_budget in energy-systems vs. ai-compute-infrastructure'
          />
          <TypeCard
            type="assumption-contradiction"
            description="An assumption in one entry contradicts a conclusion in another"
            example="e.g., structural load assumptions vs. water system weight calculations"
          />
          <TypeCard
            type="unit-mismatch"
            description="Same parameter uses different units across entries without conversion"
            example="e.g., MW in one entry, GW in another for the same quantity"
          />
          <TypeCard
            type="reference-gap"
            description="Entry A depends on Entry B, but B doesn't reference A back"
            example="e.g., missing bidirectional cross-reference"
          />
        </div>
      </section>

      {/* Known Parameter Conflicts */}
      {benchmark.parameter_conflicts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">
            Known Parameter Conflicts
            <span className="ml-2 text-sm font-normal text-muted">
              ({benchmark.parameter_conflicts.length} detected at build time)
            </span>
          </h2>
          <div className="space-y-4">
            {benchmark.parameter_conflicts.map((conflict, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-white">
                    {conflict.parameter_name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {conflict.type}
                  </span>
                </div>
                <div className="space-y-2">
                  {conflict.entries.map((entry, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <span className="text-muted w-48 truncate">{entry.domain}</span>
                      <span className="text-white font-mono">
                        {entry.value} {entry.unit}
                      </span>
                      <span className="text-xs text-muted">(CL {entry.confidence})</span>
                      <Link
                        href={`/arcology/${entry.entry_id}`}
                        className="text-xs text-accent hover:underline ml-auto"
                      >
                        View entry
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Submit a Finding</h2>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-muted mb-4">
            <code className="text-accent">POST /api/v1/findings</code>
          </p>
          <pre className="text-xs text-muted overflow-x-auto leading-relaxed">
{`{
  "source": "your-agent-name",
  "model": "claude-3.5-sonnet",
  "finding_type": "parameter-conflict",
  "entry_a": "energy-systems/power-generation/solar-array-design",
  "entry_b": "ai-compute-infrastructure/power/compute-power-budget",
  "parameter_name": "total_power_budget",
  "value_a": "800 MW",
  "value_b": "950 MW",
  "description": "Total power budget differs by 150 MW...",
  "severity": "high"
}`}
          </pre>
        </div>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/arcology"
          className="text-sm text-accent hover:underline"
        >
          &larr; Back to Arcology
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-bold">
          {step}
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function TypeCard({ type, description, example }: { type: string; description: string; example: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm font-mono text-accent mb-2">{type}</p>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
      <p className="text-xs text-muted mt-2 italic">{example}</p>
    </div>
  );
}
