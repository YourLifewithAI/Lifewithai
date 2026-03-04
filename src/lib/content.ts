// ============================================================
// Arcology Knowledge Node — Content Loading
// ============================================================
// Reads markdown files with YAML frontmatter from content/
// Used both by Next.js pages (at build time) and by the index builder.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {
  KnowledgeEntry,
  KnowledgeEntryFrontmatter,
  DomainMeta,
  Story,
  StoryFrontmatter,
  BlogPost,
  BlogPostFrontmatter,
  Page,
  PageFrontmatter,
  Domain,
  PipelineData,
  MissionControlData,
} from './types';
import { DOMAINS } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const KNOWLEDGE_DIR = path.join(CONTENT_DIR, 'knowledge');
const STORIES_DIR = path.join(CONTENT_DIR, 'stories');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');

// --- Utility: recursively find all .md files in a directory ---

function findMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// --- Knowledge Entries ---

export function getAllKnowledgeEntries(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];

  for (const domain of DOMAINS) {
    const domainDir = path.join(KNOWLEDGE_DIR, domain);
    const files = findMarkdownFiles(domainDir);

    for (const filePath of files) {
      const entry = parseKnowledgeEntry(filePath, domain);
      if (entry && entry.status === 'published') {
        entries.push(entry);
      }
    }
  }

  return entries.sort((a, b) => b.updated.localeCompare(a.updated));
}

export function getKnowledgeEntry(domain: Domain, slug: string): KnowledgeEntry | null {
  // slug might be "foundation-systems/deep-foundations"
  const filePath = path.join(KNOWLEDGE_DIR, domain, slug + '.md');
  if (!fs.existsSync(filePath)) return null;
  return parseKnowledgeEntry(filePath, domain);
}

export function getEntriesByDomain(domain: Domain): KnowledgeEntry[] {
  const domainDir = path.join(KNOWLEDGE_DIR, domain);
  const files = findMarkdownFiles(domainDir);
  const entries: KnowledgeEntry[] = [];

  for (const filePath of files) {
    const entry = parseKnowledgeEntry(filePath, domain);
    if (entry && entry.status === 'published') {
      entries.push(entry);
    }
  }

  return entries.sort((a, b) => b.updated.localeCompare(a.updated));
}

function parseKnowledgeEntry(filePath: string, domain: Domain): KnowledgeEntry | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as KnowledgeEntryFrontmatter;

    // Derive slug from file path relative to the domain directory
    const domainDir = path.join(KNOWLEDGE_DIR, domain);
    const relativePath = path.relative(domainDir, filePath);
    const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');

    return {
      ...fm,
      domain,
      content,
      slug,
      // Ensure arrays exist even if frontmatter omits them
      tags: fm.tags || [],
      citations: fm.citations || [],
      cross_references: fm.cross_references || [],
      open_questions: fm.open_questions || [],
      assumptions: fm.assumptions || [],
      parameters: fm.parameters || [],
      authors: fm.authors || [],
    };
  } catch (err) {
    console.error(`Error parsing knowledge entry ${filePath}:`, err);
    return null;
  }
}

// --- Domain Metadata ---

export function getDomainMeta(domain: Domain): DomainMeta | null {
  const yamlPath = path.join(KNOWLEDGE_DIR, domain, '_domain.yaml');
  if (!fs.existsSync(yamlPath)) return null;

  try {
    const raw = fs.readFileSync(yamlPath, 'utf-8');
    // gray-matter can parse standalone YAML if we wrap it
    const parsed = matter(`---\n${raw}\n---`);
    return parsed.data as DomainMeta;
  } catch (err) {
    console.error(`Error parsing domain metadata for ${domain}:`, err);
    return null;
  }
}

export function getAllDomainMeta(): DomainMeta[] {
  const metas: DomainMeta[] = [];
  for (const domain of DOMAINS) {
    const meta = getDomainMeta(domain);
    if (meta) metas.push(meta);
  }
  return metas;
}

// --- Stories ---

export function getAllStories(): Story[] {
  const files = findMarkdownFiles(STORIES_DIR);
  const stories: Story[] = [];

  for (const filePath of files) {
    const story = parseStory(filePath);
    if (story) stories.push(story);
  }

  return stories.sort((a, b) => a.order - b.order);
}

export function getStory(slug: string): Story | null {
  const filePath = path.join(STORIES_DIR, slug + '.md');
  if (!fs.existsSync(filePath)) return null;
  return parseStory(filePath);
}

function parseStory(filePath: string): Story | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as StoryFrontmatter;
    const slug = path.basename(filePath, '.md');

    return {
      ...fm,
      content,
      slug,
      characters: fm.characters || [],
      themes: fm.themes || [],
    };
  } catch (err) {
    console.error(`Error parsing story ${filePath}:`, err);
    return null;
  }
}

// --- Blog Posts ---

export function getAllBlogPosts(): BlogPost[] {
  const files = findMarkdownFiles(BLOG_DIR).filter(
    (f) => !f.endsWith('.agent.md')
  );
  const posts: BlogPost[] = [];

  for (const filePath of files) {
    const post = parseBlogPost(filePath);
    if (post) posts.push(post);
  }

  return posts.sort((a, b) => b.published.localeCompare(a.published));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, slug + '.md');
  if (!fs.existsSync(filePath)) return null;
  return parseBlogPost(filePath);
}

export function getBlogPostAgentContent(slug: string): string | null {
  const filePath = path.join(BLOG_DIR, slug + '.agent.md');
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { content } = matter(raw);
    return content;
  } catch {
    return null;
  }
}

function parseBlogPost(filePath: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as BlogPostFrontmatter;
    const slug = path.basename(filePath, '.md');

    return {
      ...fm,
      content,
      slug,
      tags: fm.tags || [],
    };
  } catch (err) {
    console.error(`Error parsing blog post ${filePath}:`, err);
    return null;
  }
}

// --- Pages ---

export function getAllPages(): Page[] {
  const files = findMarkdownFiles(PAGES_DIR);
  const pages: Page[] = [];

  for (const filePath of files) {
    const page = parsePage(filePath);
    if (page) pages.push(page);
  }

  return pages;
}

export function getPage(slug: string): Page | null {
  const filePath = path.join(PAGES_DIR, slug + '.md');
  if (!fs.existsSync(filePath)) return null;
  return parsePage(filePath);
}

function parsePage(filePath: string): Page | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as PageFrontmatter;
    const slug = path.basename(filePath, '.md');

    return {
      ...fm,
      content,
      slug,
    };
  } catch (err) {
    console.error(`Error parsing page ${filePath}:`, err);
    return null;
  }
}

// --- Mission Control Pipeline Data ---

// Pipeline data sources (checked in order):
// 1. In-repo snapshot: content/pipeline.json (works on Netlify)
// 2. Google Drive state file: ../state/research-queue.json (works locally)
const PIPELINE_SNAPSHOT = path.join(CONTENT_DIR, 'pipeline.json');
const PIPELINE_DRIVE = path.join(path.resolve(process.cwd(), '..'), 'state', 'research-queue.json');

export function getPipelineData(): PipelineData | null {
  // Try in-repo snapshot first (works on Netlify)
  for (const filePath of [PIPELINE_SNAPSHOT, PIPELINE_DRIVE]) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
      const data = JSON.parse(raw) as PipelineData;
      console.log(`[content] Pipeline data loaded from ${path.basename(filePath)}`);
      return data;
    } catch {
      continue;
    }
  }
  console.warn('[content] No pipeline data found');
  return null;
}

export function getMissionControlData(): MissionControlData {
  const pipeline = getPipelineData();
  const stories = getAllStories();

  return {
    pipeline,
    stories_shipped: stories.length,
    stories_total: 50,
    generated_at: new Date().toISOString(),
  };
}
