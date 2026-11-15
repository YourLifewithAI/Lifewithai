// ============================================================
// Arcology Knowledge Node — Content Validation Engine
// ============================================================
// Validates knowledge entries for integrity, consistency, and
// completeness. Runs at build time alongside index generation.
//
// Checks:
//   1. Cross-reference validity (do linked entries exist?)
//   2. Parameter consistency (do numbers add up across entries?)
//   3. Orphan detection (entries with zero inbound cross-refs)
//   4. Citation verification (required fields, URL format)
//   5. KEDL progression tracking (readiness to level up)
//   6. Frontmatter schema completeness
//
// Usage:
//   import { validateAll } from './validate';
//   const report = validateAll(entries, domains);
//   // report.errors = must fix before publish
//   // report.warnings = should fix, not blocking
//   // report.info = informational (KEDL readiness, etc.)

import type {
  KnowledgeEntry,
  DomainMeta,
  Domain,
  KEDLLevel,
  ConfidenceLevel,
  CrossReference,
  RelationshipType,
  EntryType,
  CitationType,
} from './types';
import { DOMAINS } from './types';

// --- Types ---

export type Severity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: Severity;
  category: string;
  entry_id: string;
  message: string;
  details?: string;
}

export interface ValidationReport {
  timestamp: string;
  total_entries: number;
  issues: ValidationIssue[];
  errors: number;
  warnings: number;
  info: number;
  summary: {
    cross_references: { valid: number; broken: number; total: number };
    orphans: { count: number; entries: string[] };
    citations: { valid: number; issues: number; total: number };
    parameters: { total: number; consistency_issues: number };
    kedl: { ready_to_advance: string[]; blocked: string[] };
    schema: { complete: number; incomplete: number };
  };
}

// --- Valid enum values ---

const VALID_KEDL: KEDLLevel[] = [100, 200, 300, 350, 400, 500];
const VALID_CONFIDENCE: ConfidenceLevel[] = [1, 2, 3, 4, 5];
const VALID_ENTRY_TYPES: EntryType[] = ['concept', 'analysis', 'specification', 'reference', 'open-question'];
const VALID_CITATION_TYPES: CitationType[] = ['peer-reviewed', 'standard', 'project-data', 'internal', 'expert-judgment'];
const VALID_RELATIONSHIPS: RelationshipType[] = ['depends-on', 'informs', 'contradicts', 'extends', 'alternative-to'];

// --- Main Validation ---

export function validateAll(
  entries: KnowledgeEntry[],
  domains: DomainMeta[]
): ValidationReport {
  const issues: ValidationIssue[] = [];

  // Build lookup maps
  const entryMap = new Map<string, KnowledgeEntry>();
  const entryIdSet = new Set<string>();
  for (const entry of entries) {
    const fullSlug = `${entry.domain}/${entry.slug}`;
    entryMap.set(fullSlug, entry);
    entryIdSet.add(fullSlug);
  }

  const subdomainSet = new Set<string>();
  for (const domain of domains) {
    for (const sub of domain.subdomains) {
      subdomainSet.add(`${domain.slug}/${sub.slug}`);
    }
  }

  // Run all checks
  for (const entry of entries) {
    const entryId = `${entry.domain}/${entry.slug}`;

    issues.push(...validateSchema(entry, entryId, subdomainSet));
    issues.push(...validateCrossReferences(entry, entryId, entryIdSet));
    issues.push(...validateCitations(entry, entryId));
    issues.push(...validateParameters(entry, entryId));
  }

  // Cross-entry checks
  issues.push(...validateOrphans(entries, entryIdSet));
  issues.push(...validateParameterConsistency(entries));
  issues.push(...validateKEDLReadiness(entries, entryIdSet));

  // Compute summary
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const info = issues.filter(i => i.severity === 'info').length;

  // Cross-reference summary
  let totalRefs = 0;
  let brokenRefs = 0;
  for (const entry of entries) {
    totalRefs += entry.cross_references.length;
    for (const ref of entry.cross_references) {
      if (!entryIdSet.has(ref.slug)) brokenRefs++;
    }
  }

  // Orphan summary
  const inboundRefs = new Map<string, number>();
  for (const entry of entries) {
    for (const ref of entry.cross_references) {
      inboundRefs.set(ref.slug, (inboundRefs.get(ref.slug) || 0) + 1);
    }
  }
  const orphanEntries = entries
    .filter(e => !inboundRefs.has(`${e.domain}/${e.slug}`))
    .map(e => `${e.domain}/${e.slug}`);

  // Citation summary
  let totalCitations = 0;
  let citationIssues = 0;
  for (const entry of entries) {
    totalCitations += entry.citations.length;
  }
  citationIssues = issues.filter(i => i.category === 'citation').length;

  // Parameter summary
  let totalParams = 0;
  for (const entry of entries) {
    totalParams += entry.parameters.length;
  }
  const paramIssues = issues.filter(i => i.category === 'parameter-consistency').length;

  // KEDL summary
  const kedlReady = issues
    .filter(i => i.category === 'kedl' && i.message.includes('may be ready'))
    .map(i => i.entry_id);
  const kedlBlocked = issues
    .filter(i => i.category === 'kedl' && i.message.includes('blocked'))
    .map(i => i.entry_id);

  // Schema summary
  const schemaIssues = issues.filter(i => i.category === 'schema');
  const incompleteEntries = new Set(schemaIssues.map(i => i.entry_id));

  return {
    timestamp: new Date().toISOString(),
    total_entries: entries.length,
    issues,
    errors,
    warnings,
    info,
    summary: {
      cross_references: {
        valid: totalRefs - brokenRefs,
        broken: brokenRefs,
        total: totalRefs,
      },
      orphans: {
        count: orphanEntries.length,
        entries: orphanEntries,
      },
      citations: {
        valid: totalCitations - citationIssues,
        issues: citationIssues,
        total: totalCitations,
      },
      parameters: {
        total: totalParams,
        consistency_issues: paramIssues,
      },
      kedl: {
        ready_to_advance: kedlReady,
        blocked: kedlBlocked,
      },
      schema: {
        complete: entries.length - incompleteEntries.size,
        incomplete: incompleteEntries.size,
      },
    },
  };
}

// --- 1. Schema Validation ---

function validateSchema(
  entry: KnowledgeEntry,
  entryId: string,
  subdomainSet: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required string fields
  if (!entry.id) {
    issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Missing required field: id' });
  }
  if (!entry.title) {
    issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Missing required field: title' });
  }
  if (!entry.summary) {
    issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Missing required field: summary' });
  }
  if (!entry.created) {
    issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Missing required field: created' });
  }
  if (!entry.updated) {
    issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Missing required field: updated' });
  }

  // Domain must be valid
  if (!DOMAINS.includes(entry.domain)) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: `Invalid domain: "${entry.domain}"`,
      details: `Valid domains: ${DOMAINS.join(', ')}`,
    });
  }

  // Subdomain must exist in domain taxonomy
  const subdomainKey = `${entry.domain}/${entry.subdomain}`;
  if (!subdomainSet.has(subdomainKey)) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: `Subdomain "${entry.subdomain}" not found in ${entry.domain} taxonomy`,
    });
  }

  // KEDL must be valid
  if (!VALID_KEDL.includes(entry.kedl)) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: `Invalid KEDL level: ${entry.kedl}`,
      details: `Valid levels: ${VALID_KEDL.join(', ')}`,
    });
  }

  // Confidence must be valid
  if (!VALID_CONFIDENCE.includes(entry.confidence)) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: `Invalid confidence level: ${entry.confidence}`,
      details: `Valid levels: ${VALID_CONFIDENCE.join(', ')}`,
    });
  }

  // Entry type must be valid
  if (!VALID_ENTRY_TYPES.includes(entry.entry_type)) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: `Invalid entry_type: "${entry.entry_type}"`,
    });
  }

  // Authors must exist
  if (!entry.authors || entry.authors.length === 0) {
    issues.push({
      severity: 'error',
      category: 'schema',
      entry_id: entryId,
      message: 'Missing authors — at least one author required',
    });
  } else {
    for (const author of entry.authors) {
      if (!author.id) {
        issues.push({ severity: 'error', category: 'schema', entry_id: entryId, message: 'Author missing id' });
      }
      if (author.type !== 'human' && author.type !== 'agent') {
        issues.push({
          severity: 'error',
          category: 'schema',
          entry_id: entryId,
          message: `Invalid author type: "${author.type}" (must be "human" or "agent")`,
        });
      }
      if (author.type === 'agent' && !author.model) {
        issues.push({
          severity: 'warning',
          category: 'schema',
          entry_id: entryId,
          message: `Agent author "${author.id}" missing model field`,
        });
      }
    }
  }

  // Summary length check
  if (entry.summary) {
    const wordCount = entry.summary.split(/\s+/).length;
    if (wordCount > 300) {
      issues.push({
        severity: 'warning',
        category: 'schema',
        entry_id: entryId,
        message: `Summary exceeds 300 words (${wordCount} words)`,
      });
    }
  }

  // Quality floor: at least 1 cross-reference
  if (entry.cross_references.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      entry_id: entryId,
      message: 'No cross-references — entries should link to at least one other entry',
    });
  }

  // Quality floor: at least 1 open question
  if (entry.open_questions.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      entry_id: entryId,
      message: 'No open questions — entries should identify at least one open question',
    });
  }

  // Quality floor: at least 1 assumption
  if (entry.assumptions.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      entry_id: entryId,
      message: 'No assumptions stated — entries should list at least one assumption',
    });
  }

  // Quality floor: at least 1 parameter with units
  if (entry.parameters.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      entry_id: entryId,
      message: 'No quantitative parameters — entries should include at least one parameter with units',
    });
  }

  // ID should match file path
  const expectedId = entryId;
  if (entry.id !== expectedId) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      entry_id: entryId,
      message: `Frontmatter id "${entry.id}" doesn't match file path "${expectedId}"`,
    });
  }

  return issues;
}

// --- 2. Cross-Reference Validation ---

function validateCrossReferences(
  entry: KnowledgeEntry,
  entryId: string,
  entryIdSet: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const ref of entry.cross_references) {
    // Check that the referenced entry exists
    if (!entryIdSet.has(ref.slug)) {
      issues.push({
        severity: 'warning',
        category: 'cross-reference',
        entry_id: entryId,
        message: `Broken cross-reference: "${ref.slug}" does not exist`,
        details: `Referenced from ${entryId} with relationship "${ref.relationship}"`,
      });
    }

    // Check relationship type is valid
    if (!VALID_RELATIONSHIPS.includes(ref.relationship)) {
      issues.push({
        severity: 'error',
        category: 'cross-reference',
        entry_id: entryId,
        message: `Invalid relationship type: "${ref.relationship}"`,
        details: `On reference to "${ref.slug}". Valid types: ${VALID_RELATIONSHIPS.join(', ')}`,
      });
    }

    // Self-reference check
    if (ref.slug === entryId) {
      issues.push({
        severity: 'error',
        category: 'cross-reference',
        entry_id: entryId,
        message: 'Entry references itself',
      });
    }

    // Slug format check (should be domain/subdomain/entry-slug)
    const slugParts = ref.slug.split('/');
    if (slugParts.length < 3) {
      issues.push({
        severity: 'error',
        category: 'cross-reference',
        entry_id: entryId,
        message: `Malformed cross-reference slug: "${ref.slug}" (expected domain/subdomain/entry-slug)`,
      });
    }
  }

  // Duplicate cross-reference check
  const slugSet = new Set<string>();
  for (const ref of entry.cross_references) {
    if (slugSet.has(ref.slug)) {
      issues.push({
        severity: 'warning',
        category: 'cross-reference',
        entry_id: entryId,
        message: `Duplicate cross-reference to "${ref.slug}"`,
      });
    }
    slugSet.add(ref.slug);
  }

  return issues;
}

// --- 3. Citation Validation ---

function validateCitations(
  entry: KnowledgeEntry,
  entryId: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const citationIds = new Set<string>();
  for (const citation of entry.citations) {
    // Required fields
    if (!citation.id) {
      issues.push({
        severity: 'error',
        category: 'citation',
        entry_id: entryId,
        message: 'Citation missing id',
      });
    }
    if (!citation.title) {
      issues.push({
        severity: 'error',
        category: 'citation',
        entry_id: entryId,
        message: `Citation "${citation.id}" missing title`,
      });
    }
    if (!citation.source) {
      issues.push({
        severity: 'error',
        category: 'citation',
        entry_id: entryId,
        message: `Citation "${citation.id}" missing source`,
      });
    }
    if (!citation.year || citation.year < 1900 || citation.year > 2030) {
      issues.push({
        severity: 'warning',
        category: 'citation',
        entry_id: entryId,
        message: `Citation "${citation.id}" has suspicious year: ${citation.year}`,
      });
    }

    // Type validation
    if (!VALID_CITATION_TYPES.includes(citation.type)) {
      issues.push({
        severity: 'error',
        category: 'citation',
        entry_id: entryId,
        message: `Citation "${citation.id}" has invalid type: "${citation.type}"`,
        details: `Valid types: ${VALID_CITATION_TYPES.join(', ')}`,
      });
    }

    // URL format check (if present)
    if (citation.url) {
      try {
        new URL(citation.url);
      } catch {
        issues.push({
          severity: 'warning',
          category: 'citation',
          entry_id: entryId,
          message: `Citation "${citation.id}" has malformed URL: ${citation.url}`,
        });
      }
    }

    // Peer-reviewed citations should ideally have URL
    if (citation.type === 'peer-reviewed' && !citation.url) {
      issues.push({
        severity: 'info',
        category: 'citation',
        entry_id: entryId,
        message: `Peer-reviewed citation "${citation.id}" has no URL — consider adding for verification`,
      });
    }

    // Duplicate citation ID check
    if (citationIds.has(citation.id)) {
      issues.push({
        severity: 'warning',
        category: 'citation',
        entry_id: entryId,
        message: `Duplicate citation id: "${citation.id}"`,
      });
    }
    citationIds.add(citation.id);
  }

  // No citations at all
  if (entry.citations.length === 0 && entry.kedl >= 200) {
    issues.push({
      severity: 'warning',
      category: 'citation',
      entry_id: entryId,
      message: 'No citations at KEDL 200+ — entries should cite at least one source',
    });
  }

  return issues;
}

// --- 4. Parameter Validation ---

function validateParameters(
  entry: KnowledgeEntry,
  entryId: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const paramNames = new Set<string>();
  for (const param of entry.parameters) {
    // Required fields
    if (!param.name) {
      issues.push({
        severity: 'error',
        category: 'parameter',
        entry_id: entryId,
        message: 'Parameter missing name',
      });
    }
    if (param.value === undefined || param.value === null) {
      issues.push({
        severity: 'error',
        category: 'parameter',
        entry_id: entryId,
        message: `Parameter "${param.name}" missing value`,
      });
    }
    if (!param.unit) {
      issues.push({
        severity: 'error',
        category: 'parameter',
        entry_id: entryId,
        message: `Parameter "${param.name}" missing unit`,
      });
    }
    if (!VALID_CONFIDENCE.includes(param.confidence)) {
      issues.push({
        severity: 'error',
        category: 'parameter',
        entry_id: entryId,
        message: `Parameter "${param.name}" has invalid confidence: ${param.confidence}`,
      });
    }

    // Parameter confidence shouldn't exceed entry confidence
    if (param.confidence > entry.confidence) {
      issues.push({
        severity: 'warning',
        category: 'parameter',
        entry_id: entryId,
        message: `Parameter "${param.name}" confidence (${param.confidence}) exceeds entry confidence (${entry.confidence})`,
      });
    }

    // Negative value check (not always wrong, but worth flagging for physical params)
    if (param.value < 0 && !param.name.includes('delta') && !param.name.includes('offset')) {
      issues.push({
        severity: 'info',
        category: 'parameter',
        entry_id: entryId,
        message: `Parameter "${param.name}" has negative value: ${param.value} ${param.unit}`,
      });
    }

    // Duplicate parameter name
    if (paramNames.has(param.name)) {
      issues.push({
        severity: 'warning',
        category: 'parameter',
        entry_id: entryId,
        message: `Duplicate parameter name: "${param.name}"`,
      });
    }
    paramNames.add(param.name);
  }

  return issues;
}

// --- 5. Orphan Detection ---

function validateOrphans(
  entries: KnowledgeEntry[],
  entryIdSet: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Build inbound reference map
  const inboundRefs = new Map<string, string[]>();
  for (const entry of entries) {
    const sourceId = `${entry.domain}/${entry.slug}`;
    for (const ref of entry.cross_references) {
      if (!inboundRefs.has(ref.slug)) {
        inboundRefs.set(ref.slug, []);
      }
      inboundRefs.get(ref.slug)!.push(sourceId);
    }
  }

  // Find orphans (entries with zero inbound refs)
  for (const entry of entries) {
    const entryId = `${entry.domain}/${entry.slug}`;
    if (!inboundRefs.has(entryId)) {
      issues.push({
        severity: 'warning',
        category: 'orphan',
        entry_id: entryId,
        message: 'Orphan entry — no other entries reference this one',
        details: 'Consider adding cross-references from related entries to integrate this into the knowledge graph',
      });
    }
  }

  return issues;
}

// --- 6. Cross-Entry Parameter Consistency ---

function validateParameterConsistency(
  entries: KnowledgeEntry[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Build a global parameter map: param_name -> [{entry, value, unit}]
  const globalParams = new Map<string, Array<{
    entryId: string;
    value: number;
    unit: string;
    confidence: ConfidenceLevel;
  }>>();

  for (const entry of entries) {
    const entryId = `${entry.domain}/${entry.slug}`;
    for (const param of entry.parameters) {
      if (!globalParams.has(param.name)) {
        globalParams.set(param.name, []);
      }
      globalParams.get(param.name)!.push({
        entryId,
        value: param.value,
        unit: param.unit,
        confidence: param.confidence,
      });
    }
  }

  // Check for same-name parameters with different values
  for (const [paramName, occurrences] of globalParams) {
    if (occurrences.length < 2) continue;

    // Group by unit
    const byUnit = new Map<string, typeof occurrences>();
    for (const occ of occurrences) {
      const unit = occ.unit.toLowerCase().trim();
      if (!byUnit.has(unit)) byUnit.set(unit, []);
      byUnit.get(unit)!.push(occ);
    }

    // Same-unit, different-value conflicts
    for (const [unit, unitOccs] of byUnit) {
      if (unitOccs.length < 2) continue;

      const values = unitOccs.map(o => o.value);
      const uniqueValues = [...new Set(values)];
      if (uniqueValues.length > 1) {
        const entries = unitOccs.map(o => `${o.entryId} (${o.value} ${o.unit}, CL${o.confidence})`);
        issues.push({
          severity: 'warning',
          category: 'parameter-consistency',
          entry_id: unitOccs[0].entryId,
          message: `Parameter "${paramName}" has conflicting values across entries`,
          details: entries.join(' vs. '),
        });
      }
    }

    // Different-unit occurrences of the same parameter name (potential mismatch)
    if (byUnit.size > 1) {
      const unitList = [...byUnit.keys()].join(', ');
      issues.push({
        severity: 'info',
        category: 'parameter-consistency',
        entry_id: occurrences[0].entryId,
        message: `Parameter "${paramName}" appears with different units: ${unitList}`,
        details: 'This may be intentional (e.g., metric/imperial) or a data entry inconsistency',
      });
    }
  }

  // Specific arcology-wide consistency checks
  validateArcologyConsistency(entries, globalParams, issues);

  return issues;
}

// Arcology-specific parameter rules
function validateArcologyConsistency(
  entries: KnowledgeEntry[],
  globalParams: Map<string, Array<{ entryId: string; value: number; unit: string; confidence: ConfidenceLevel }>>,
  issues: ValidationIssue[]
): void {
  // Check: target_population should be consistent everywhere
  const popParams = globalParams.get('target_population');
  if (popParams && popParams.length > 1) {
    const values = popParams.map(p => p.value);
    const unique = [...new Set(values)];
    if (unique.length > 1) {
      issues.push({
        severity: 'error',
        category: 'parameter-consistency',
        entry_id: 'global',
        message: `Critical: target_population differs across entries: ${unique.join(', ')}`,
        details: popParams.map(p => `${p.entryId}: ${p.value}`).join(', '),
      });
    }
  }

  // Check: total power referenced in compute should not exceed total power generated
  const totalPower = globalParams.get('total_power_gw');
  const computePower = globalParams.get('compute_power_gw');
  if (totalPower && computePower) {
    const maxPower = Math.max(...totalPower.map(p => p.value));
    const maxCompute = Math.max(...computePower.map(p => p.value));
    if (maxCompute > maxPower) {
      issues.push({
        severity: 'error',
        category: 'parameter-consistency',
        entry_id: 'global',
        message: `Compute power (${maxCompute} GW) exceeds total power generation (${maxPower} GW)`,
      });
    }
  }

  // Check: space allocation percentages should sum to approximately 100%
  // (This checks if entries referencing space allocation are internally consistent)
}

// --- 7. KEDL Progression Tracking ---

function validateKEDLReadiness(
  entries: KnowledgeEntry[],
  entryIdSet: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const entry of entries) {
    const entryId = `${entry.domain}/${entry.slug}`;

    // KEDL advancement criteria
    switch (entry.kedl) {
      case 100: {
        // KEDL 100 → 200 requires: at least 1 parameter with value
        const hasParams = entry.parameters.length > 0;
        const hasCitations = entry.citations.length > 0;
        if (hasParams && hasCitations) {
          issues.push({
            severity: 'info',
            category: 'kedl',
            entry_id: entryId,
            message: 'KEDL 100 entry may be ready to advance to 200 — has parameters and citations',
          });
        }
        break;
      }
      case 200: {
        // KEDL 200 → 300 requires: engineering calculation methodology,
        // multiple citations, CL ≥ 3 on key parameters
        const hasMethods = entry.content.toLowerCase().includes('calculat') ||
                          entry.content.toLowerCase().includes('methodology') ||
                          entry.content.toLowerCase().includes('derived from');
        const hasMultipleCitations = entry.citations.length >= 3;
        const highConfParams = entry.parameters.filter(p => p.confidence >= 3).length;
        const totalParams = entry.parameters.length;
        const paramRatio = totalParams > 0 ? highConfParams / totalParams : 0;

        // Check if dependencies are at KEDL 200+
        const depsAt200Plus = entry.cross_references
          .filter(r => r.relationship === 'depends-on')
          .every(r => {
            const depEntry = entryIdSet.has(r.slug)
              ? [...entryIdSet].find(id => id === r.slug)
              : null;
            // If dependency doesn't exist yet, it's blocking
            return depEntry !== null;
          });

        if (hasMethods && hasMultipleCitations && paramRatio >= 0.5) {
          issues.push({
            severity: 'info',
            category: 'kedl',
            entry_id: entryId,
            message: 'KEDL 200 entry may be ready to advance to 300 — has methodology, 3+ citations, and 50%+ parameters at CL3+',
          });
        }

        // Check for blocked dependencies
        const brokenDeps = entry.cross_references
          .filter(r => r.relationship === 'depends-on')
          .filter(r => !entryIdSet.has(r.slug));
        if (brokenDeps.length > 0) {
          issues.push({
            severity: 'info',
            category: 'kedl',
            entry_id: entryId,
            message: `KEDL advancement blocked — depends on ${brokenDeps.length} entries that don't exist yet`,
            details: brokenDeps.map(r => r.slug).join(', '),
          });
        }
        break;
      }
      case 300: {
        // KEDL 300 → 350 requires: cross-domain interfaces defined
        const crossDomainRefs = entry.cross_references
          .filter(r => {
            const refDomain = r.slug.split('/')[0];
            return refDomain !== entry.domain;
          });
        if (crossDomainRefs.length >= 3 && entry.confidence >= 3) {
          issues.push({
            severity: 'info',
            category: 'kedl',
            entry_id: entryId,
            message: 'KEDL 300 entry may be ready to advance to 350 — has 3+ cross-domain refs and CL3+',
          });
        }
        break;
      }
      // 350+ advancement requires human domain steward review — not automatable
    }
  }

  return issues;
}

// --- Report Formatting ---

export function formatReport(report: ValidationReport): string {
  const lines: string[] = [];

  lines.push('# Content Validation Report');
  lines.push(`*Generated: ${report.timestamp}*`);
  lines.push(`*Entries validated: ${report.total_entries}*`);
  lines.push('');

  // Overall health
  if (report.errors === 0 && report.warnings === 0) {
    lines.push('## Status: CLEAN');
    lines.push('No errors or warnings found.');
  } else if (report.errors === 0) {
    lines.push('## Status: HEALTHY (warnings only)');
    lines.push(`${report.warnings} warning(s), ${report.info} info note(s).`);
  } else {
    lines.push('## Status: ISSUES FOUND');
    lines.push(`**${report.errors} error(s)**, ${report.warnings} warning(s), ${report.info} info note(s).`);
  }
  lines.push('');

  // Summary table
  lines.push('## Summary');
  lines.push('');
  lines.push('| Check | Status |');
  lines.push('|-------|--------|');
  lines.push(`| Cross-references | ${report.summary.cross_references.valid}/${report.summary.cross_references.total} valid (${report.summary.cross_references.broken} broken) |`);
  lines.push(`| Orphan entries | ${report.summary.orphans.count} orphans |`);
  lines.push(`| Citations | ${report.summary.citations.valid}/${report.summary.citations.total} valid |`);
  lines.push(`| Parameters | ${report.summary.parameters.total} total, ${report.summary.parameters.consistency_issues} consistency issues |`);
  lines.push(`| Schema completeness | ${report.summary.schema.complete}/${report.summary.schema.complete + report.summary.schema.incomplete} entries complete |`);
  lines.push('');

  // KEDL readiness
  if (report.summary.kedl.ready_to_advance.length > 0) {
    lines.push('## KEDL Advancement Candidates');
    for (const id of report.summary.kedl.ready_to_advance) {
      lines.push(`- ${id}`);
    }
    lines.push('');
  }

  if (report.summary.kedl.blocked.length > 0) {
    lines.push('## KEDL Advancement Blocked');
    for (const id of report.summary.kedl.blocked) {
      lines.push(`- ${id}`);
    }
    lines.push('');
  }

  // Orphan list
  if (report.summary.orphans.entries.length > 0) {
    lines.push('## Orphan Entries');
    for (const id of report.summary.orphans.entries) {
      lines.push(`- ${id}`);
    }
    lines.push('');
  }

  // Issues by severity
  if (report.errors > 0) {
    lines.push('## Errors');
    for (const issue of report.issues.filter(i => i.severity === 'error')) {
      lines.push(`- **[${issue.category}]** \`${issue.entry_id}\`: ${issue.message}`);
      if (issue.details) lines.push(`  - ${issue.details}`);
    }
    lines.push('');
  }

  if (report.warnings > 0) {
    lines.push('## Warnings');
    for (const issue of report.issues.filter(i => i.severity === 'warning')) {
      lines.push(`- **[${issue.category}]** \`${issue.entry_id}\`: ${issue.message}`);
      if (issue.details) lines.push(`  - ${issue.details}`);
    }
    lines.push('');
  }

  if (report.info > 0) {
    lines.push('## Info');
    for (const issue of report.issues.filter(i => i.severity === 'info')) {
      lines.push(`- **[${issue.category}]** \`${issue.entry_id}\`: ${issue.message}`);
      if (issue.details) lines.push(`  - ${issue.details}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
