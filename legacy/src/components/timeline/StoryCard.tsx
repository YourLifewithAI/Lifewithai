'use client';

import Link from 'next/link';
import type { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
  hook: string;
  viktorCommentary: string;
  accentColor: string;
  position: number; // 0–1, used to determine card direction (flip near edges)
}

export function StoryCard({
  story,
  hook,
  viktorCommentary,
  accentColor,
  position,
}: StoryCardProps) {
  // Flip card to the left when the marker is in the right 30% of the timeline
  const alignRight = position > 0.7;

  return (
    <div
      role="dialog"
      aria-label={`Story details: ${story.title}`}
      onClick={(e) => e.stopPropagation()}
      className="absolute animate-fade-in"
      style={{
        bottom: 'calc(100% + 40px)', // sits above the marker + connector
        ...(alignRight
          ? { right: '-8px' }
          : { left: '-8px' }),
        width: '260px',
        zIndex: 30,
      }}
    >
      {/* Card shell — glass effect */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'rgba(20,20,25,0.92)',
          border: `1px solid ${accentColor}40`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px ${accentColor}20`,
        }}
      >
        {/* Cover image placeholder — Step 5 will wire up real assets */}
        <div
          className="w-full"
          style={{
            height: '100px',
            background: `linear-gradient(135deg, rgba(10,10,15,1) 0%, ${accentColor}20 100%)`,
            borderBottom: `1px solid ${accentColor}20`,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="p-4">
          {/* Series badge */}
          <p
            className="text-xs font-medium tracking-widest uppercase mb-1"
            style={{ color: `${accentColor}cc` }}
          >
            {story.series}
          </p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white leading-snug">
            {story.title}
          </h3>
          {story.subtitle && (
            <p
              className="text-xs mt-0.5"
              style={{ color: `${accentColor}99` }}
            >
              {story.subtitle}
            </p>
          )}

          {/* Hook line */}
          <p className="text-xs text-muted leading-relaxed mt-3">
            {hook}
          </p>

          {/* Viktor commentary */}
          {viktorCommentary && (
            <blockquote
              className="mt-3 pt-3 text-xs italic leading-relaxed"
              style={{
                borderTop: `1px solid ${accentColor}20`,
                color: 'rgba(107,107,123,0.9)',
              }}
            >
              <span
                className="not-italic font-medium text-xs tracking-widest uppercase"
                style={{ color: `${accentColor}80`, display: 'block', marginBottom: '4px' }}
              >
                Viktor
              </span>
              "{viktorCommentary}"
            </blockquote>
          )}

          {/* CTA */}
          <Link
            href={`/stories/${story.slug}`}
            className="mt-4 block text-center text-xs font-medium py-2 rounded transition-colors"
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = `${accentColor}28`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = `${accentColor}18`;
            }}
          >
            Read the story →
          </Link>
        </div>
      </div>

      {/* Downward-pointing caret connecting card to marker */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-7px',
          ...(alignRight ? { right: '14px' } : { left: '14px' }),
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `7px solid ${accentColor}40`,
        }}
      />
    </div>
  );
}
