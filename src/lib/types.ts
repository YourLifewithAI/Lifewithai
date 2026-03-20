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

// Structured assumption — backward-compatible with string[]
// Old format:  assumptions: ["Population of 10 million residents"]
// New format:  assumptions: [{text: "...", category: "population", scope: "all-phases"}]
// Parser normalizes strings to {text: "..."} objects automatically.
export interface StructuredAssumption {
  text: string;
  category?: string;       // e.g. "population", "geometry", "timeline", "technology", "cost"
  scope?: string;           // e.g. "all-phases", "phase-1-only", "steady-state"
  context_dependent?: boolean;  // true if the value changes based on scenario
  varies_by?: string;       // what it depends on, e.g. "construction phase", "population density"
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
  assumptions: StructuredAssumption[];  // normalized from string[] or StructuredAssumption[]
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
  knowledge_base_version: string;
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

// ============================================================
// Interactive Story Experiences
// ============================================================

export interface ExperienceTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ExperienceTimeScale {
  id: string;
  label: string;
  description: string;
  duration: string;
  activeFlows: string[];
  activeNodes: string[];
  metrics: string[];
}

export interface ExperienceNode {
  id: string;
  label: string;
  type: 'biological' | 'mechanical' | 'ai-sensor' | 'process';
  position: { x: number; y: number };
  icon: string;
  description: string;
  aiRole?: string;
  storyQuote?: string;
  detailMetrics?: { label: string; value: string; source?: string }[];
}

export interface ExperienceFlow {
  id: string;
  from: string;
  to: string;
  substance: 'water' | 'nutrients' | 'waste' | 'data' | 'energy';
  timeScale: string;
  speed: number;
  color: string;
  label?: string;
}

export interface ExperienceMetric {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  source: string;
  icon?: string;
}

export interface StoryExperience {
  storySlug: string;
  title: string;
  subtitle: string;
  intro: string;
  theme: ExperienceTheme;
  timeScales: ExperienceTimeScale[];
  nodes: ExperienceNode[];
  flows: ExperienceFlow[];
  metrics: ExperienceMetric[];
}
