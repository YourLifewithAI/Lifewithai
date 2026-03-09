// ============================================================
// Arcology Knowledge Node — Statistics Computation
// ============================================================
// Computes Phase 0 metrics from knowledge entries at build time.

import type {
  KnowledgeEntry,
  DomainMeta,
  DomainStats,
  AggregateStats,
  Domain,
} from './types';
import { DOMAINS } from './types';

export function computeDomainStats(
  entries: KnowledgeEntry[],
  domainMeta: DomainMeta[]
): DomainStats[] {
  return DOMAINS.map((domain) => {
    const meta = domainMeta.find((m) => m.slug === domain);
    const domainEntries = entries.filter((e) => e.domain === domain);

    const kedlDist: Record<string, number> = {};
    const confDist: Record<string, number> = {};
    let totalConf = 0;
    let openQuestions = 0;
    let lastUpdated = '';

    for (const entry of domainEntries) {
      const kedlKey = String(entry.kedl);
      kedlDist[kedlKey] = (kedlDist[kedlKey] || 0) + 1;

      const confKey = String(entry.confidence);
      confDist[confKey] = (confDist[confKey] || 0) + 1;
      totalConf += entry.confidence;

      openQuestions += entry.open_questions.length;

      if (entry.updated > lastUpdated) lastUpdated = entry.updated;
    }

    return {
      slug: domain,
      name: meta?.name || domain,
      color: meta?.color || '#888888',
      entry_count: domainEntries.length,
      kedl_distribution: kedlDist,
      confidence_distribution: confDist,
      average_confidence: domainEntries.length > 0 ? totalConf / domainEntries.length : 0,
      open_question_count: openQuestions,
      subdomain_count: meta?.subdomains.length || 0,
      last_updated: lastUpdated || new Date().toISOString().split('T')[0],
    };
  });
}

export function computeAggregateStats(
  entries: KnowledgeEntry[],
  domainMeta: DomainMeta[]
): AggregateStats {
  const totalEntries = entries.length;

  // KEDL distribution
  const kedlDist: Record<string, number> = {};
  const confDist: Record<string, number> = {};
  let totalCitations = 0;
  let totalCrossRefs = 0;
  let crossDomainRefs = 0;
  let totalOpenQuestions = 0;
  let totalParameters = 0;

  for (const entry of entries) {
    const kedlKey = String(entry.kedl);
    kedlDist[kedlKey] = (kedlDist[kedlKey] || 0) + 1;

    const confKey = String(entry.confidence);
    confDist[confKey] = (confDist[confKey] || 0) + 1;

    totalCitations += entry.citations.length;
    totalCrossRefs += entry.cross_references.length;
    totalOpenQuestions += entry.open_questions.length;
    totalParameters += entry.parameters.length;

    // Count cross-domain references
    for (const ref of entry.cross_references) {
      const refDomain = ref.slug.split('/')[0];
      if (refDomain !== entry.domain) {
        crossDomainRefs++;
      }
    }
  }

  // Citation density
  const avgCitationDensity = totalEntries > 0 ? totalCitations / totalEntries : 0;

  // Cross-domain reference percentage
  const crossDomainPct = totalCrossRefs > 0 ? (crossDomainRefs / totalCrossRefs) * 100 : 0;

  // Domain balance index (coefficient of variation)
  const domainCounts = DOMAINS.map(
    (d) => entries.filter((e) => e.domain === d).length
  );
  const domainBalanceIndex = coefficientOfVariation(domainCounts);

  // Schema completeness: % of subdomains with at least 1 entry
  const allSubdomains = domainMeta.flatMap((m) =>
    m.subdomains.map((s) => `${m.slug}/${s.slug}`)
  );
  const populatedSubdomains = allSubdomains.filter((sd) =>
    entries.some((e) => `${e.domain}/${e.subdomain}` === sd)
  );
  const schemaCompleteness =
    allSubdomains.length > 0
      ? (populatedSubdomains.length / allSubdomains.length) * 100
      : 0;

  // Orphan entry rate: % of entries with zero inbound cross-references
  const inboundRefCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const ref of entry.cross_references) {
      const count = inboundRefCounts.get(ref.slug) || 0;
      inboundRefCounts.set(ref.slug, count + 1);
    }
  }
  const orphanCount = entries.filter((e) => {
    const entrySlug = `${e.domain}/${e.slug}`;
    return !inboundRefCounts.has(entrySlug);
  }).length;
  const orphanRate = totalEntries > 0 ? (orphanCount / totalEntries) * 100 : 0;

  return {
    total_entries: totalEntries,
    total_citations: totalCitations,
    total_cross_references: totalCrossRefs,
    total_open_questions: totalOpenQuestions,
    total_parameters: totalParameters,
    kedl_distribution: kedlDist,
    confidence_distribution: confDist,
    average_citation_density: Math.round(avgCitationDensity * 100) / 100,
    cross_domain_reference_percentage: Math.round(crossDomainPct * 100) / 100,
    domain_balance_index: Math.round(domainBalanceIndex * 100) / 100,
    schema_completeness: Math.round(schemaCompleteness * 100) / 100,
    orphan_entry_rate: Math.round(orphanRate * 100) / 100,
  };
}

/**
 * Compute the distribution of confidence levels across all parameters.
 * Returns per-domain and aggregate counts for CL 1-5.
 */
export function computeParameterConfidenceDistribution(
  entries: KnowledgeEntry[]
): {
  aggregate: Record<string, number>;
  byDomain: Record<string, Record<string, number>>;
  total: number;
} {
  const aggregate: Record<string, number> = {};
  const byDomain: Record<string, Record<string, number>> = {};
  let total = 0;

  for (const entry of entries) {
    if (!byDomain[entry.domain]) byDomain[entry.domain] = {};
    for (const param of entry.parameters) {
      const key = String(param.confidence);
      aggregate[key] = (aggregate[key] || 0) + 1;
      byDomain[entry.domain][key] = (byDomain[entry.domain][key] || 0) + 1;
      total++;
    }
  }

  return { aggregate, byDomain, total };
}

function coefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stddev = Math.sqrt(variance);
  return stddev / mean;
}
