// ============================================================
// Arcology Knowledge Node — Client-Side Search
// ============================================================
// Full-text search over the content index, loaded in the browser.

import type { KnowledgeEntry, Domain, KEDLLevel, ConfidenceLevel, EntryType } from './types';

export interface SearchFilters {
  query?: string;
  domain?: Domain;
  subdomain?: string;
  kedl_min?: KEDLLevel;
  confidence_min?: ConfidenceLevel;
  entry_type?: EntryType;
}

export function searchEntries(
  entries: KnowledgeEntry[],
  filters: SearchFilters
): KnowledgeEntry[] {
  let results = [...entries];

  // Domain filter
  if (filters.domain) {
    results = results.filter((e) => e.domain === filters.domain);
  }

  // Subdomain filter
  if (filters.subdomain) {
    results = results.filter((e) => e.subdomain === filters.subdomain);
  }

  // KEDL minimum filter
  if (filters.kedl_min) {
    results = results.filter((e) => e.kedl >= filters.kedl_min!);
  }

  // Confidence minimum filter
  if (filters.confidence_min) {
    results = results.filter((e) => e.confidence >= filters.confidence_min!);
  }

  // Entry type filter
  if (filters.entry_type) {
    results = results.filter((e) => e.entry_type === filters.entry_type);
  }

  // Full-text search (simple but effective for Phase 0)
  if (filters.query && filters.query.trim().length > 0) {
    const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
    results = results.filter((entry) => {
      const searchText = buildSearchText(entry);
      return terms.every((term) => searchText.includes(term));
    });

    // Sort by relevance (term frequency)
    results.sort((a, b) => {
      const aText = buildSearchText(a);
      const bText = buildSearchText(b);
      const aScore = terms.reduce((score, term) => score + countOccurrences(aText, term), 0);
      const bScore = terms.reduce((score, term) => score + countOccurrences(bText, term), 0);
      return bScore - aScore;
    });
  }

  return results;
}

function buildSearchText(entry: KnowledgeEntry): string {
  return [
    entry.title,
    entry.summary,
    entry.content,
    entry.tags.join(' '),
    entry.open_questions.join(' '),
    entry.assumptions.map((a) => typeof a === 'string' ? a : a.text).join(' '),
    entry.parameters.map((p) => p.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

function countOccurrences(text: string, term: string): number {
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(term, pos)) !== -1) {
    count++;
    pos += term.length;
  }
  return count;
}
