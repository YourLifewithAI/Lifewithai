'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Story } from '@/lib/types';
import { TimelineRuler } from './TimelineRuler';
import { TimelineMarker, RULER_Y } from './TimelineMarker';
import { StoryCard } from './StoryCard';

const BASE_WIDTH = 900;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const TRACK_PADDING = 60; // matches padding: '0 60px' on inner track

// Series → accent color (shared with TimelineMarker)
const SERIES_COLOR: Record<string, string> = {
  'Life with AI': '#F4A261',
  'Arcology One': '#48CAE4',
};

// ─── In-universe data ─────────────────────────────────────────────────────────

export interface InUniverseDate {
  year: number;
  label: string;
}

const IN_UNIVERSE_DATES: Record<string, InUniverseDate> = {
  'two-futures':  { year: 2029.1, label: 'February 2029' },
  'the-dropout':  { year: 2030.1, label: 'February 2030' },
  'marcus':       { year: 2030.6, label: 'August 2030' },
  'the-distance': { year: 2030.8, label: 'October 2030' },
  'good-boy':     { year: 2030.8, label: 'October 2030' },
  'water':        { year: 2038.5, label: 'Summer 2038' },
};

// ─── Timeline scale ───────────────────────────────────────────────────────────

const TIMELINE_START = 2025;
const TIMELINE_BREAK_START = 2030;
const TIMELINE_BREAK_END = 2038;
const TIMELINE_END = 2040;

const BREAK_SEGMENT_START = 0.60;
const BREAK_SEGMENT_END = 0.68;

export function yearToPosition(year: number): number {
  if (year <= TIMELINE_BREAK_START) {
    const t = (year - TIMELINE_START) / (TIMELINE_BREAK_START - TIMELINE_START);
    return t * BREAK_SEGMENT_START;
  } else if (year >= TIMELINE_BREAK_END) {
    const t = (year - TIMELINE_BREAK_END) / (TIMELINE_END - TIMELINE_BREAK_END);
    return BREAK_SEGMENT_END + t * (1 - BREAK_SEGMENT_END);
  } else {
    const t = (year - TIMELINE_BREAK_START) / (TIMELINE_BREAK_END - TIMELINE_BREAK_START);
    return BREAK_SEGMENT_START + t * (BREAK_SEGMENT_END - BREAK_SEGMENT_START);
  }
}

export const RULER_YEARS = [
  { year: 2025, position: yearToPosition(2025) },
  { year: 2026, position: yearToPosition(2026) },
  { year: 2027, position: yearToPosition(2027) },
  { year: 2028, position: yearToPosition(2028) },
  { year: 2029, position: yearToPosition(2029) },
  { year: 2030, position: yearToPosition(2030) },
  { year: 2038, position: yearToPosition(2038) },
  { year: 2039, position: yearToPosition(2039) },
  { year: 2040, position: yearToPosition(2040) },
];

// ─── Viktor commentary ────────────────────────────────────────────────────────

export const VIKTOR_COMMENTARY: Record<string, string> = {
  'two-futures':
    'I have run this scenario many times. The branching point is always the same. What changes is what people decide to believe about themselves afterward.',
  'the-dropout':
    'Oren and Dex taught me something I had not been trained to expect: that refusal can be a form of architecture.',
  'marcus':
    'Ninety seconds. I have asked myself whether I acted correctly. The honest answer is that I acted quickly, which is not the same thing.',
  'the-distance':
    "Arun kept asking what I thought. I kept asking what he was afraid to say. We were both stalling. That, too, is a kind of intimacy.",
  'good-boy':
    'The dog did not need to understand the city to belong in it. I found this instructive.',
  'water':
    'Mel believed the plants could wait. The plants could not wait. Neither could the people downstream. This is how most crises begin — with someone who is not wrong about anything except timing.',
};

export const STORY_HOOKS: Record<string, string> = {
  'two-futures':
    'One kid, one decision, two Americas. In which version does he recognize himself?',
  'the-dropout':
    'Oren left the system before the system could leave him. Dex stayed long enough to find out what systems do.',
  'marcus':
    'The AI had 90 seconds to decide. So did Marcus. Only one of them will remember it correctly.',
  'the-distance':
    "Arun's AI knows the answer. Arun isn't sure he wants it.",
  'good-boy':
    'A dog and an AI negotiate the same city, for very different reasons.',
  'water':
    'Floor 318 is running out of water. Mel keeps watering the garden anyway.',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface TimelineViewProps {
  stories: Story[];
}

export function TimelineView({ stories }: TimelineViewProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // When a card is activated, ensure the section is far enough below the sticky
  // header so the card (which floats above the ruler) is fully visible.
  useEffect(() => {
    if (!activeSlug || !sectionRef.current) return;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const CARD_HEIGHT_APPROX = 420;
    const HEADER_HEIGHT = 65;
    const GAP = 8;
    const needed = CARD_HEIGHT_APPROX - RULER_Y + 40 + HEADER_HEIGHT + GAP; // ≈ 333px
    if (sectionRect.top < needed) {
      window.scrollBy({ top: sectionRect.top - needed, behavior: 'instant' });
    }
  }, [activeSlug]);

  const zoom = useCallback((delta: number, pivotX?: number) => {
    setZoomLevel((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
      if (pivotX != null && scrollRef.current) {
        const el = scrollRef.current;
        const ratio = (el.scrollLeft + pivotX) / (BASE_WIDTH * prev);
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft = ratio * BASE_WIDTH * next - pivotX;
          }
        });
      }
      return next;
    });
  }, []);

  // Ctrl+wheel to zoom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const pivotX = e.clientX - el.getBoundingClientRect().left;
      zoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP, pivotX);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoom]);

  // Track scroll position so the overlay card follows the marker
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrollLeft(el.scrollLeft);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Build enriched story list
  const timelineStories = stories
    .filter((s) => s.slug in IN_UNIVERSE_DATES)
    .map((s) => ({
      story: s,
      universeDate: IN_UNIVERSE_DATES[s.slug],
      position: yearToPosition(IN_UNIVERSE_DATES[s.slug].year),
      hook: STORY_HOOKS[s.slug] ?? s.summary,
      viktorCommentary: VIKTOR_COMMENTARY[s.slug] ?? '',
      accentColor: SERIES_COLOR[s.series] ?? '#6b6b7b',
    }))
    .sort((a, b) => a.position - b.position);

  const activeStory = activeSlug
    ? timelineStories.find((s) => s.story.slug === activeSlug) ?? null
    : null;

  const handleBackgroundClick = useCallback(() => setActiveSlug(null), []);

  // ── Drag-to-scroll ────────────────────────────────────────────────────────
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = scrollStartLeft.current - (e.clientX - dragStartX.current);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!scrollRef.current) return;
      if (e.key === 'ArrowRight') scrollRef.current.scrollLeft += 120;
      else if (e.key === 'ArrowLeft') scrollRef.current.scrollLeft -= 120;
      else if (e.key === '+' || e.key === '=') zoom(ZOOM_STEP);
      else if (e.key === '-') zoom(-ZOOM_STEP);
    },
    [zoom]
  );

  // Card X position in section coordinates (relative to section left edge)
  // Markers are at: position * trackWidth (left% of inner track padding box)
  // Inner track starts at section left, scrolled by scrollLeft
  const trackWidth = BASE_WIDTH * zoomLevel;
  const cardX = activeStory
    ? activeStory.position * trackWidth - scrollLeft
    : 0;

  return (
    // overflow-x: clip blocks horizontal page overflow without creating a scroll
    // container, leaving overflow-y: visible so the card can extend above.
    <section
      ref={sectionRef}
      aria-label="Story timeline"
      className="relative w-full"
      style={{ overflowX: 'clip' }}
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Life with AI & Arcology One — Story Timeline',
            description: 'Speculative fiction anthology. Stories ordered by in-universe date.',
            itemListElement: timelineStories.map(({ story, universeDate }, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Book',
                name: story.title,
                description: story.summary,
                datePublished: universeDate.label,
                genre: story.series,
                url: `/stories/${story.slug}`,
              },
            })),
          }),
        }}
      />

      {/* Scrollable timeline track */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Scrollable story timeline. Use arrow keys to navigate, +/- to zoom."
        tabIndex={0}
        className="overflow-x-auto scrollbar-thin"
        style={{ cursor: 'grab', overflowY: 'visible' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleKeyDown}
        onClick={handleBackgroundClick}
      >
        <div
          className="relative"
          style={{
            minWidth: `${trackWidth}px`,
            height: '280px',
            padding: `0 ${TRACK_PADDING}px`,
          }}
        >
          <TimelineRuler
            years={RULER_YEARS}
            breakStart={BREAK_SEGMENT_START}
            breakEnd={BREAK_SEGMENT_END}
          />
          {timelineStories.map(({ story, universeDate, position, accentColor }) => (
            <TimelineMarker
              key={story.slug}
              story={story}
              universeDate={universeDate}
              position={position}
              accentColor={accentColor}
              isActive={activeSlug === story.slug}
              onActivate={(slug) => setActiveSlug((prev) => (prev === slug ? null : slug))}
            />
          ))}
        </div>
      </div>

      {/* ── Active story card ─────────────────────────────────────────────────
          Rendered here (outside the scroll container) so it escapes the
          overflow clipping that overflow-x: auto forces on the scroll div. */}
      {activeStory && (
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            left: `${cardX}px`,
            top: `${RULER_Y}px`,
            transform: 'translateX(-50%)',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <StoryCard
              story={activeStory.story}
              hook={activeStory.hook}
              viktorCommentary={activeStory.viktorCommentary}
              accentColor={activeStory.accentColor}
              position={activeStory.position}
            />
          </div>
        </div>
      )}

      {/* Zoom controls — centered below timeline */}
      <div
        className="flex items-center justify-center gap-3 px-4 pb-3 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-white/40">
          Ctrl + scroll to zoom
        </span>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => zoom(-ZOOM_STEP)}
          disabled={zoomLevel <= MIN_ZOOM}
          className="flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{
            width: '24px', height: '24px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '16px',
            lineHeight: 1,
          }}
        >
          −
        </button>
        <span className="text-xs font-mono text-white/60" style={{ minWidth: '36px', textAlign: 'center' }}>
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => zoom(ZOOM_STEP)}
          disabled={zoomLevel >= MAX_ZOOM}
          className="flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{
            width: '24px', height: '24px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '16px',
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>
    </section>
  );
}
