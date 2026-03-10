// ============================================================
// Arcology Knowledge Node — Benchmark Computation
// ============================================================
// Identifies cross-domain parameter inconsistencies and
// contradictory assumptions for the reasoning benchmark.

import type { KnowledgeEntry } from './types';

export interface ParameterConflict {
  parameter_name: string;
  entries: {
    entry_id: string;
    entry_title: string;
    domain: string;
    value: number;
    unit: string;
    confidence: number;
  }[];
  type: 'value-mismatch' | 'unit-mismatch' | 'both';
}

export interface BenchmarkStats {
  parameter_conflicts: ParameterConflict[];
  cross_domain_parameter_count: number;
  explicit_contradictions: number;
  total_known_inconsistencies: number;
}

/**
 * Find parameters with the same name that appear in multiple domains
 * with different values or units — these are the "deliberate inconsistencies"
 * that agents should discover.
 */
export function computeBenchmarkStats(entries: KnowledgeEntry[]): BenchmarkStats {
  // Group parameters by normalized name across all entries
  const paramMap = new Map<string, {
    entry_id: string;
    entry_title: string;
    domain: string;
    name: string;
    value: number;
    unit: string;
    confidence: number;
  }[]>();

  for (const entry of entries) {
    for (const param of entry.parameters) {
      const key = param.name.toLowerCase().trim();
      if (!paramMap.has(key)) paramMap.set(key, []);
      paramMap.get(key)!.push({
        entry_id: entry.id,
        entry_title: entry.title,
        domain: entry.domain,
        name: param.name,
        value: param.value,
        unit: param.unit,
        confidence: param.confidence,
      });
    }
  }

  // Find parameters that appear in multiple domains
  const conflicts: ParameterConflict[] = [];
  let crossDomainParamCount = 0;

  for (const [paramName, occurrences] of paramMap) {
    // Only care about parameters appearing in 2+ different domains
    const domains = new Set(occurrences.map(o => o.domain));
    if (domains.size < 2) continue;

    crossDomainParamCount++;

    // Check for value or unit mismatches
    const values = new Set(occurrences.map(o => o.value));
    const units = new Set(occurrences.map(o => o.unit.toLowerCase().trim()));

    const valueMismatch = values.size > 1;
    const unitMismatch = units.size > 1;

    if (valueMismatch || unitMismatch) {
      conflicts.push({
        parameter_name: occurrences[0].name,
        entries: occurrences.map(o => ({
          entry_id: o.entry_id,
          entry_title: o.entry_title,
          domain: o.domain,
          value: o.value,
          unit: o.unit,
          confidence: o.confidence,
        })),
        type: valueMismatch && unitMismatch ? 'both' : valueMismatch ? 'value-mismatch' : 'unit-mismatch',
      });
    }
  }

  // Count explicit "contradicts" cross-references
  let explicitContradictions = 0;
  for (const entry of entries) {
    for (const ref of entry.cross_references) {
      if (ref.relationship === 'contradicts') {
        explicitContradictions++;
      }
    }
  }

  return {
    parameter_conflicts: conflicts,
    cross_domain_parameter_count: crossDomainParamCount,
    explicit_contradictions: explicitContradictions,
    total_known_inconsistencies: conflicts.length + explicitContradictions,
  };
}
