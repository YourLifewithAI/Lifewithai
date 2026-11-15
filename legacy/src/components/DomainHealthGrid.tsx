// ============================================================
// Domain Health Grid — Visual Progress Component
// ============================================================
// Server component. Pure CSS visualizations, no charting library.
// Shows parameter confidence distribution per domain as a
// red-to-green stacked bar (low → high evidence).

import type { DomainStats } from '@/lib/types';

// Confidence level colors: red → amber → yellow → green → deep green
const CL_COLORS: Record<string, string> = {
  '1': '#EF4444', // red — conjectured
  '2': '#F59E0B', // amber — estimated
  '3': '#EAB308', // yellow — calculated
  '4': '#22C55E', // green — verified
  '5': '#16A34A', // deep green — validated
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
  /** Parameter confidence distribution by domain */
  parameterConfidence?: Record<string, Record<string, number>>;
  /** Schema completeness per domain (subdomain slug → has entries) */
  subdomainCoverage?: Record<string, { total: number; populated: number }>;
  /** 'full' for landing/stats pages, 'compact' for domain pages */
  variant?: 'full' | 'compact';
  /** @deprecated No longer used — entry count bar removed */
  maxEntries?: number;
}

export default function DomainHealthGrid({
  domainStats,
  parameterConfidence,
  subdomainCoverage,
  variant = 'full',
}: DomainHealthGridProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Domain Health</h3>
        {variant === 'full' && (
          <span className="text-[10px] text-muted">Parameter confidence by domain</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted mb-5">
        {['1', '2', '3', '4', '5'].map((level) => (
          <span key={level} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: CL_COLORS[level] }}
            />
            {CL_LABELS[level]}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {domainStats.map((domain) => {
          const paramDist = parameterConfidence?.[domain.slug] || {};
          const paramTotal = Object.values(paramDist).reduce((a, b) => a + b, 0);
          const coverage = subdomainCoverage?.[domain.slug];

          return (
            <div key={domain.slug}>
              {/* Domain name + stats */}
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
                  {paramTotal > 0 && <span>{paramTotal} params</span>}
                  <span>{domain.entry_count} {domain.entry_count === 1 ? 'entry' : 'entries'}</span>
                  {coverage && (
                    <span>
                      {coverage.populated}/{coverage.total} subdomains
                    </span>
                  )}
                </div>
              </div>

              {/* Parameter confidence stacked bar */}
              {paramTotal > 0 && (
                <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden flex">
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
                        title={`${CL_LABELS[level]}: ${count} parameters (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregate confidence totals (full variant only) */}
      {variant === 'full' && parameterConfidence && (
        <div className="mt-5 pt-4 border-t border-border">
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
