// ============================================================
// Domain Health Grid — Visual Progress Component
// ============================================================
// Server component. Pure CSS visualizations, no charting library.
// Shows entry coverage, parameter confidence distribution, and
// schema completeness per domain.

import type { DomainStats } from '@/lib/types';

// Confidence level colors (CL1-CL5)
const CL_COLORS: Record<string, string> = {
  '1': '#EF4444', // red — conjectured
  '2': '#F59E0B', // amber — estimated
  '3': '#3B82F6', // blue — calculated
  '4': '#10B981', // green — verified
  '5': '#8B5CF6', // purple — validated
};

const CL_LABELS: Record<string, string> = {
  '1': 'Conjectured',
  '2': 'Estimated',
  '3': 'Calculated',
  '4': 'Verified',
  '5': 'Validated',
};

interface DomainHealthGridProps {
  /** Per-domain statistics */
  domainStats: DomainStats[];
  /** Max entries across any domain (for normalizing bars) */
  maxEntries?: number;
  /** Parameter confidence distribution by domain */
  parameterConfidence?: Record<string, Record<string, number>>;
  /** Schema completeness per domain (subdomain slug → has entries) */
  subdomainCoverage?: Record<string, { total: number; populated: number }>;
  /** 'full' for landing/stats pages, 'compact' for domain pages */
  variant?: 'full' | 'compact';
}

export default function DomainHealthGrid({
  domainStats,
  maxEntries,
  parameterConfidence,
  subdomainCoverage,
  variant = 'full',
}: DomainHealthGridProps) {
  const max = maxEntries || Math.max(...domainStats.map((d) => d.entry_count), 1);

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Domain Health</h3>
        <div className="flex items-center gap-3 text-[10px] text-muted">
          {Object.entries(CL_COLORS).map(([level, color]) => (
            <span key={level} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              CL{level}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {domainStats.map((domain) => {
          const fillPct = (domain.entry_count / max) * 100;
          const paramDist = parameterConfidence?.[domain.slug] || {};
          const paramTotal = Object.values(paramDist).reduce((a, b) => a + b, 0);
          const coverage = subdomainCoverage?.[domain.slug];

          return (
            <div key={domain.slug}>
              {/* Domain name + entry count */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: domain.color }}
                  />
                  <span className="text-sm text-foreground truncate">
                    {domain.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted shrink-0">
                  <span>{domain.entry_count} entries</span>
                  {coverage && (
                    <span>
                      {coverage.populated}/{coverage.total} subdomains
                    </span>
                  )}
                </div>
              </div>

              {/* Entry count bar */}
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(fillPct, 2)}%`,
                    backgroundColor: domain.color,
                    opacity: 0.7,
                  }}
                />
              </div>

              {/* Parameter confidence stacked bar */}
              {paramTotal > 0 && variant === 'full' && (
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden flex">
                  {['1', '2', '3', '4', '5'].map((level) => {
                    const count = paramDist[level] || 0;
                    if (count === 0) return null;
                    const pct = (count / paramTotal) * 100;
                    return (
                      <div
                        key={level}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: CL_COLORS[level],
                        }}
                        title={`CL${level} ${CL_LABELS[level]}: ${count} parameters (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregate confidence legend (full variant only) */}
      {variant === 'full' && parameterConfidence && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs text-muted mb-2">Parameter Confidence Distribution</p>
          <div className="flex items-center gap-4 text-xs">
            {['1', '2', '3', '4', '5'].map((level) => {
              const total = Object.values(parameterConfidence).reduce(
                (sum, domain) => sum + (domain[level] || 0),
                0
              );
              if (total === 0) return null;
              return (
                <span key={level} className="flex items-center gap-1.5 text-muted">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: CL_COLORS[level] }}
                  />
                  <span>{CL_LABELS[level]}: {total}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
