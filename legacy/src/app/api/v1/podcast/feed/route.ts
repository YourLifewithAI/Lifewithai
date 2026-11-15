// ============================================================
// Life with AI — Podcast RSS Feed
// ============================================================
// Apple Podcasts-compliant RSS XML for research briefings and stories.
// Reads MP3 files + companion JSON metadata from public/podcast/.

import fs from 'fs';
import path from 'path';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

interface EpisodeMetadata {
  type: 'briefing' | 'story';
  title: string;
  date: string;
  description: string;
}

interface PodcastEpisode {
  filename: string;
  date: string;
  fileSize: number;
  title: string;
  description: string;
  episodeType: 'briefing' | 'story';
}

function loadMetadata(podcastDir: string, mp3Filename: string): EpisodeMetadata | null {
  const baseName = mp3Filename.replace('.mp3', '');
  const metaPath = path.join(podcastDir, baseName + '.json');

  if (!fs.existsSync(metaPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(metaPath, 'utf-8').replace(/^\uFEFF/, '');
    return JSON.parse(raw) as EpisodeMetadata;
  } catch {
    return null;
  }
}

function getPodcastEpisodes(): PodcastEpisode[] {
  const podcastDir = path.join(process.cwd(), 'public', 'podcast');

  if (!fs.existsSync(podcastDir)) {
    return [];
  }

  const files = fs.readdirSync(podcastDir)
    .filter(f => f.endsWith('.mp3'))
    .sort()
    .reverse();

  return files.map(filename => {
    const filePath = path.join(podcastDir, filename);
    const stats = fs.statSync(filePath);
    const baseName = filename.replace('.mp3', '');
    const meta = loadMetadata(podcastDir, filename);

    const isStory = filename.startsWith('story-');
    const date = isStory
      ? (meta?.date || baseName.replace('story-', ''))
      : baseName;

    return {
      filename,
      date,
      fileSize: stats.size,
      title: meta?.title || (isStory ? `Story: ${baseName}` : `Research Briefing - ${date}`),
      description: meta?.description || `${SITE_NAME} podcast episode.`,
      episodeType: meta?.type || (isStory ? 'story' : 'briefing'),
    };
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc2822(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00Z');
  return date.toUTCString();
}

function estimateDuration(fileSize: number): string {
  // At 128kbps: 1 minute ~= 960KB
  const minutes = Math.max(1, Math.round(fileSize / (960 * 1024)));
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

function generateRssXml(episodes: PodcastEpisode[]): string {
  const feedUrl = `${SITE_URL}/api/v1/podcast/feed`;
  const podcastUrl = `${SITE_URL}/podcast`;
  const now = new Date().toUTCString();

  const items = episodes.map((ep, index) => {
    const episodeUrl = `${SITE_URL}/podcast/${ep.filename}`;
    const duration = estimateDuration(ep.fileSize);
    const pubDate = formatRfc2822(ep.date);

    return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escapeXml(episodeUrl)}" length="${ep.fileSize}" type="audio/mpeg" />
      <guid isPermaLink="true">${escapeXml(episodeUrl)}</guid>
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>
      <itunes:duration>${duration}</itunes:duration>
      <itunes:episode>${index + 1}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Podcast</title>
    <link>${podcastUrl}</link>
    <description>Fiction and research from the Life with AI project. Stories exploring human-AI coexistence, plus daily audio digests of arcology engineering and AI systems research.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <itunes:author>SB Corvus</itunes:author>
    <itunes:summary>Speculative fiction and research briefings from the Life with AI project. Stories about humans and AIs building a shared future, plus daily digests covering arcology engineering, energy systems, AI infrastructure, and the cross-domain interfaces that make coexistence possible.</itunes:summary>
    <itunes:owner>
      <itunes:name>SB Corvus</itunes:name>
    </itunes:owner>
    <itunes:explicit>false</itunes:explicit>
    <itunes:category text="Technology" />
    <itunes:category text="Fiction">
      <itunes:category text="Science Fiction" />
    </itunes:category>
    <itunes:type>episodic</itunes:type>
${items}
  </channel>
</rss>`;
}

export async function GET() {
  const episodes = getPodcastEpisodes();
  const xml = generateRssXml(episodes);

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
