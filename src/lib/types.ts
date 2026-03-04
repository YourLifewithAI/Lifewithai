// ============================================================
// Arcology Knowledge Node — Type Definitions
// ============================================================

// --- Domain Taxonomy ---

export type Domain =
  | 'structural-engineering'
  | 'energy-systems'
  | 'environmental-systems'
  | 'mechanical-electrical'
  | 'ai-compute-infrastructure'
  | 'institutional-design'
  | 'construction-logistics'
  | 'urban-design-livability';

export const DOMAINS: Domain[] = [
  'structural-engineering',
  'energy-systems',
  'environmental-systems',
  'mechanical-electrical',
  'ai-compute-infrastructure',
  'institutional-design',
  'construction-logistics',
  'urban-design-livability',
];

// --- Knowledge Entry Types ---

export type KEDLLevel = 100 | 200 | 300 | 350 | 400 | 500;
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;
export type EntryType = 'concept' | 'analysis' | 'specification' | 'reference' | 'open-question';
export type EntryStatus = 'draft' | 'published' | 'superseded';
export type CitationType = 'peer-reviewed' | 'standard' | 'project-data' | 'internal' | 'expert-judgment';
export type RelationshipType = 'depends-on' | 'informs' | 'contradicts' | 'extends' | 'alternative-to';

export interface Author {
  id: string;
  type: 'human' | 'agent';
  model?: string;
}

export interface Citation {
  id: string;
  type: CitationType;
  title: string;
  source: string;
  year: number;
  url?: string;
}

export interface CrossReference {
  slug: string;
  relationship: RelationshipType;
}

export interface Parameter {
  name: string;
  value: number;
  unit: string;
  confidence: ConfidenceLevel;
}

export interface KnowledgeEntryFrontmatter {
  id: string;
  title: string;
  domain: Domain;
  subdomain: string;
  kedl: KEDLLevel;
  confidence: ConfidenceLevel;
  status: EntryStatus;
  created: string;
  updated: string;
  authors: Author[];
  entry_type: EntryType;
  tags: string[];
  summary: string;
  citations: Citation[];
  cross_references: CrossReference[];
  open_questions: string[];
  assumptions: string[];
  parameters: Parameter[];
}

export interface KnowledgeEntry extends KnowledgeEntryFrontmatter {
  content: string;
  slug: string;
}

// --- Domain Metadata ---

export interface SubdomainMeta {
  slug: string;
  name: string;
  description: string;
}

export interface DomainMeta {
  name: string;
  slug: Domain;
  description: string;
  color: string;
  icon: string;
  subdomains: SubdomainMeta[];
}

// --- Story Types ---

export interface StoryFrontmatter {
  type: 'story';
  title: string;
  subtitle?: string;
  published: string;
  series: string;
  order: number;
  characters: string[];
  themes: string[];
  word_count: number;
  parts: number;
  summary: string;
  viktor_intro: boolean;
}

export interface Story extends StoryFrontmatter {
  content: string;
  slug: string;
}

// --- Blog Types ---

export interface BlogPostFrontmatter {
  type: 'blog';
  title: string;
  published: string;
  summary: string;
  tags: string[];
  author?: string;
  author_role?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string;
  slug: string;
}

// --- Page Types ---

export interface PageFrontmatter {
  type: 'page';
  title: string;
  subtitle?: string;
}

export interface Page extends PageFrontmatter {
  content: string;
  slug: string;
}

// --- Content Index (generated at build time) ---

export interface DomainStats {
  slug: Domain;
  name: string;
  color: string;
  entry_count: number;
  kedl_distribution: Record<string, number>;
  confidence_distribution: Record<string, number>;
  average_confidence: number;
  open_question_count: number;
  subdomain_count: number;
  last_updated: string;
}

export interface ContentIndex {
  generated_at: string;
  entries: KnowledgeEntry[];
  domains: DomainMeta[];
  domain_stats: DomainStats[];
  stories: Story[];
  blog_posts: BlogPost[];
  pages: Page[];
  aggregate_stats: AggregateStats;
  mission_control?: MissionControlData;
}

export interface AggregateStats {
  total_entries: number;
  total_citations: number;
  total_cross_references: number;
  total_open_questions: number;
  total_parameters: number;
  kedl_distribution: Record<string, number>;
  confidence_distribution: Record<string, number>;
  average_citation_density: number;
  cross_domain_reference_percentage: number;
  domain_balance_index: number;
  schema_completeness: number;
  orphan_entry_rate: number;
}

// --- Mission Control / Pipeline Types ---

export type PipelineItemStatus = 'completed' | 'in_progress' | 'pending' | 'failed';

export interface PipelineItem {
  order: number;
  domain: string;
  domain_slug: string;
  subdomain: string;
  subdomain_slug: string;
  wave: number;
  status: PipelineItemStatus;
  started_at: string | null;
  completed_at: string | null;
  experts_found: number;
  ai_systems_found: number;
  report_path: string | null;
  retry_count: number;
  error: string | null;
}

export interface PipelineData {
  version: number;
  last_updated: string;
  session_counter: number;
  completed: number;
  total: number;
  queue: PipelineItem[];
}

export interface MissionControlData {
  pipeline: PipelineData | null;
  stories_shipped: number;
  stories_total: number;
  generated_at: string;
}

// --- KEDL & Confidence Display Info ---

export const KEDL_INFO: Record<KEDLLevel, { name: string; description: string }> = {
  100: { name: 'Conceptual', description: 'Qualitative, no numbers, identifies design space' },
  200: { name: 'Schematic', description: 'Approximate parameters with major assumptions' },
  300: { name: 'Preliminary', description: 'Quantified with engineering basis, suitable for feasibility' },
  350: { name: 'Developed', description: 'Detailed calculations, cross-domain interfaces defined' },
  400: { name: 'Construction', description: 'Specification-grade' },
  500: { name: 'As-Built', description: 'Reflects actual constructed/deployed configuration' },
};

export const CONFIDENCE_INFO: Record<ConfidenceLevel, { name: string; description: string }> = {
  1: { name: 'Conjectured', description: 'Reasonable hypothesis without supporting evidence' },
  2: { name: 'Estimated', description: 'Order-of-magnitude based on analogous systems' },
  3: { name: 'Calculated', description: 'Engineering calculation with stated methodology' },
  4: { name: 'Verified', description: 'Independently verified by qualified reviewer' },
  5: { name: 'Validated', description: 'Confirmed by physical test or operational data' },
};
