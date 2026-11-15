import { getAllKnowledgeEntries, getAllStories, getAllBlogPosts } from '@/lib/content';
import { DOMAIN_NAMES } from '@/lib/constants';

export async function GET() {
  const entries = getAllKnowledgeEntries();
  const stories = getAllStories();
  const posts = getAllBlogPosts();

  const lines: string[] = [
    '# Life with AI — Full Content for LLMs',
    '',
    '> This file contains the complete content of the Arcology One engineering',
    '> knowledge base, plus fiction and blog metadata. Designed for AI agents',
    '> that need the full context in a single request.',
    '',
    '---',
    '',
    '## Fiction Index',
    '',
    ...stories.map(s => [
      `### ${s.title}`,
      `- Series: ${s.series}`,
      `- Published: ${s.published}`,
      `- Characters: ${s.characters?.join(', ') || 'N/A'}`,
      `- Themes: ${s.themes?.join(', ') || 'N/A'}`,
      `- Summary: ${s.summary}`,
      `- URL: https://lifewithai.ai/stories/${s.slug}`,
      '',
    ]).flat(),
    '---',
    '',
    '## Blog Index',
    '',
    ...posts.map(p => [
      `### ${p.title}`,
      `- Author: ${p.author || 'Unknown'}`,
      `- Published: ${p.published}`,
      `- Tags: ${p.tags?.join(', ') || 'N/A'}`,
      `- Summary: ${p.summary}`,
      `- URL: https://lifewithai.ai/blog/${p.slug}`,
      '',
    ]).flat(),
    '---',
    '',
    '## Arcology One — Engineering Knowledge Base',
    '',
    `Total entries: ${entries.length}`,
    `Total domains: 8`,
    '',
  ];

  // Group entries by domain
  const byDomain = new Map<string, typeof entries>();
  for (const entry of entries) {
    const group = byDomain.get(entry.domain) || [];
    group.push(entry);
    byDomain.set(entry.domain, group);
  }

  for (const [domain, domainEntries] of byDomain) {
    const domainName = DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES] || domain;
    lines.push(`### ${domainName}`, '');

    for (const entry of domainEntries) {
      lines.push(
        `#### ${entry.title}`,
        `- Domain: ${domainName}`,
        `- Subdomain: ${entry.subdomain}`,
        `- KEDL: ${entry.kedl}`,
        `- Confidence: ${entry.confidence}/5`,
        `- Status: ${entry.status}`,
        `- URL: https://lifewithai.ai/arcology/${entry.domain}/${entry.slug}`,
        '',
      );

      if (entry.summary) {
        lines.push(`**Summary:** ${entry.summary}`, '');
      }

      if (entry.content) {
        lines.push(entry.content, '');
      }

      if (entry.open_questions && entry.open_questions.length > 0) {
        lines.push('**Open Questions:**');
        for (const q of entry.open_questions) {
          lines.push(`- ${q}`);
        }
        lines.push('');
      }

      lines.push('---', '');
    }
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
