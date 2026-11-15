import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

// The default share image: a drawing-set sheet with the name, the line and the tagline. Built at build time.
export const alt = `${SITE.name}: ${SITE.line} ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#2B2F8E';
const PAPER = '#F3F5F9';
const TABLE = '#E2E7F0';
const HAIR = '#B4BAD8';
const RED = '#B5362C';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: TABLE, padding: 40 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: PAPER,
            border: `4px solid ${INK}`,
            outline: `2px solid ${HAIR}`,
            outlineOffset: -14,
            padding: '56px 64px',
            color: INK,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{SITE.name}</div>
            <div style={{ fontSize: 56, marginTop: 8 }}>{SITE.line}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', borderTop: `4px solid ${INK}`, paddingTop: 24 }}>
            <div style={{ width: 22, height: 14, background: RED, marginRight: 18 }} />
            <div style={{ fontSize: 40 }}>{SITE.tagline}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
