import { ARCHIVE_HOST } from '@/lib/archive';
import { SITE } from '@/lib/site';
import { topics } from '@/lib/topic-words';
import { pieces } from '@/lib/pieces';

// A short guide to the new site for language models, with a pointer to the archive. The site's, topics' and pieces'
// words come from words/; the guide's own lines below are for language models, not readers, and stay here.
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.sub}`,
    '',
    'The site follows AI off the screen and into hands-on work. It is written for people who think of AI as a chatbot.',
    '',
    '## Topics',
    '',
    ...topics().map((t) => `- [${t.verb}](${SITE.url}/topics/${t.id}): ${t.covers}.`),
    '',
    '## Pieces',
    '',
    ...pieces().map((p) => `- [${p.title}](${SITE.url}${p.href}): ${p.hook}`),
    '',
    '## About',
    '',
    `- [About](${SITE.url}/about): who runs the site, how a piece is made, and its rules.`,
    `- [Analytics and privacy](${SITE.url}/privacy)`,
    `- Contact: ${SITE.contact}`,
    '',
    '## The earlier site',
    '',
    `The earlier version of this site, including the Arcology One project, its Knowledge Node, its REST API, its MCP details and its full llms.txt, is archived at ${ARCHIVE_HOST}. Old addresses on ${SITE.url} redirect there.`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
