import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import CopyFeedButton from './CopyFeedButton';

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'Fiction and daily research briefings from the Life with AI project.',
};

interface EpisodeMetadata {
  type: 'briefing' | 'story';
  title: string;
  date: string;
  description: string;
  series?: string;
  session_count?: number;
}

interface Episode {
  filename: string;
  date: string;
  fileSize: number;
  durationEstimate: string;
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

function getEpisodes(): Episode[] {
  const podcastDir = path.join(process.cwd(), 'public', 'podcast');

  if (!fs.existsSync(podcastDir)) {
    return [];
  }

  return fs.readdirSync(podcastDir)
    .filter(f => f.endsWith('.mp3'))
    .sort()
    .reverse()
    .map(filename => {
      const filePath = path.join(podcastDir, filename);
      const stats = fs.statSync(filePath);
      const baseName = filename.replace('.mp3', '');
      const isStory = filename.startsWith('story-');
      const meta = loadMetadata(podcastDir, filename);

      const date = isStory
        ? (meta?.date || baseName.replace('story-', ''))
        : baseName;

      const minutes = Math.max(1, Math.round(stats.size / (960 * 1024)));

      return {
        filename,
        date,
        fileSize: stats.size,
        durationEstimate: `${minutes} min`,
        title: meta?.title || (isStory ? `Story: ${baseName}` : `Research Briefing - ${date}`),
        description: meta?.description || '',
        episodeType: meta?.type || (isStory ? 'story' : 'briefing'),
      };
    });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function PodcastPage() {
  const episodes = getEpisodes();
  const feedUrl = `${SITE_URL}/api/v1/podcast/feed`;

  const stories = episodes.filter(ep => ep.episodeType === 'story');
  const briefings = episodes.filter(ep => ep.episodeType === 'briefing');

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-12">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-3">
          Audio
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Podcast
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Listen to our fiction and daily research briefings. Stories from the
          Life with AI anthology, plus audio digests of each day&apos;s completed
          research sessions.
        </p>
      </div>

      {/* Subscribe section */}
      <div className="mb-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Subscribe</h2>
        <p className="text-sm text-muted mb-4">
          Add this RSS feed to your podcast app to get new episodes automatically.
        </p>
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-lg bg-surface-2 px-4 py-2.5 text-sm text-foreground font-mono truncate border border-border">
            {feedUrl}
          </code>
          <CopyFeedButton url={feedUrl} />
        </div>
        <p className="mt-4 text-xs text-muted">
          Coming soon to Spotify and Apple Podcasts.
        </p>
      </div>

      {/* Stories section */}
      {stories.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">Stories</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </span>
          </div>
          <div className="space-y-6">
            {stories.map((ep) => (
              <EpisodeCard key={ep.filename} episode={ep} />
            ))}
          </div>
        </div>
      )}

      {/* Briefings section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-white">Research Briefings</h2>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted">
            {briefings.length} {briefings.length === 1 ? 'episode' : 'episodes'}
          </span>
        </div>

        {briefings.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-10 text-center">
            <p className="text-muted">
              No briefings yet. The first digest will appear after research
              sessions generate enough data for an audio briefing.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {briefings.map((ep) => (
              <EpisodeCard key={ep.filename} episode={ep} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EpisodeCard({ episode: ep }: { episode: Episode }) {
  const typeLabel = ep.episodeType === 'story' ? 'Story' : 'Briefing';
  const typeColor = ep.episodeType === 'story'
    ? 'text-amber-400 bg-amber-400/10'
    : 'text-accent bg-accent/10';

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeColor}`}>
              {typeLabel}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">
            {ep.title}
          </h3>
          {ep.description && (
            <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">
              {ep.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <span>{formatDate(ep.date)}</span>
            <span>&middot;</span>
            <span>{ep.durationEstimate}</span>
            <span>&middot;</span>
            <span>{formatFileSize(ep.fileSize)}</span>
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls preload="none" className="w-full mt-3">
        <source src={`/podcast/${ep.filename}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-3">
        <a
          href={`/podcast/${ep.filename}`}
          download
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          Download MP3
        </a>
      </div>
    </div>
  );
}
