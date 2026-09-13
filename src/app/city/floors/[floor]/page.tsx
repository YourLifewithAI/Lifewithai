import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllFloors, getAllStories, getFloor } from '@/lib/content';
import FloorPlan from '@/components/floor/FloorPlan';
import ElevationStrip from '@/components/floor/ElevationStrip';

interface PageProps {
  params: Promise<{ floor: string }>;
}

export async function generateStaticParams() {
  return getAllFloors().map((f) => ({ floor: String(f.number) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { floor: n } = await params;
  const floor = getFloor(n);
  if (!floor) return { title: 'Floor Not Found' };
  const title = `Floor ${floor.number} — ${floor.name}`;
  const description = `${floor.tagline} Explore Floor ${floor.number} of Arcology One: every place on the plan comes from the stories set here.`;
  return {
    title,
    description,
    openGraph: { title: `${title} | Arcology One`, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

const KIND_ORDER = ['human', 'bonded agent', 'assigned agent', 'community AI', 'shells'] as const;

export default async function FloorPage({ params }: PageProps) {
  const { floor: n } = await params;
  const floor = getFloor(n);
  if (!floor) notFound();

  const stories = getAllStories().filter((s) => s.floor === floor.number);

  return (
    <div className="daylight min-h-screen">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6">
        <Link href="/stories" className="dl-link inline-flex items-center gap-1.5 text-sm mb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All stories
        </Link>

        <p className="dl-eyebrow mb-3">
          The City · Floor {floor.number} · {floor.elevation_ft.toLocaleString()} ft · Tier {floor.tier}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-end">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[0.98]" style={{ color: 'var(--dl-ink)' }}>
              <span className="block dl-floor-number">{floor.number}</span>
              {floor.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed max-w-prose" style={{ color: 'var(--dl-ink)' }}>
              {floor.tagline}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed max-w-prose" style={{ color: 'var(--dl-ink-2)' }}>
              {floor.intro}
            </p>
          </div>
          <div className="dl-sheet p-3 sm:p-4">
            <ElevationStrip floor={floor.number} elevationFt={floor.elevation_ft} tier={floor.tier} />
          </div>
        </div>
      </header>

      {/* The plan */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="sr-only">Plan of Floor {floor.number}</h2>
        <FloorPlan floor={floor} />
      </section>

      {/* Stories, systems, residents */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 dl-rule-top pt-8">
          <div>
            <p className="dl-eyebrow mb-4">Stories set here</p>
            {stories.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--dl-ink-2)' }}>No stories yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {stories.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/stories/${s.slug}`} className="dl-card block">
                      <span className="block font-semibold" style={{ color: 'var(--dl-ink)' }}>
                        {s.title}{s.subtitle ? `: ${s.subtitle}` : ''}
                      </span>
                      <span className="block text-sm mt-1 leading-relaxed" style={{ color: 'var(--dl-ink-2)' }}>{s.summary}</span>
                      <span className="block text-xs mt-2 font-mono" style={{ color: 'var(--dl-ink-2)' }}>
                        {s.word_count?.toLocaleString()} words
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="dl-eyebrow mb-4">How the floor works</p>
            <ul className="flex flex-col gap-3">
              {floor.systems.map((sys) => (
                <li key={sys.id}>
                  <Link href={sys.href} className="dl-card block">
                    <span className="block font-semibold" style={{ color: 'var(--dl-ink)' }}>{sys.label}</span>
                    <span className="block text-sm mt-1 leading-relaxed" style={{ color: 'var(--dl-ink-2)' }}>{sys.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {floor.basis.length > 0 && (
              <div className="mt-6">
                <p className="dl-eyebrow mb-2" style={{ color: 'var(--dl-ink-2)' }}>Engineering basis</p>
                <ul className="flex flex-col gap-1.5">
                  {floor.basis.map((b) => (
                    <li key={b.id} className="text-[13px]" style={{ color: 'var(--dl-ink-2)' }}>
                      <span className="font-mono mr-1.5" aria-hidden="true">§</span>
                      <Link href={`/arcology/${b.id}`} className="dl-link">{b.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <p className="dl-eyebrow mb-4">Who lives here</p>
            <ul className="flex flex-col gap-3">
              {[...floor.residents]
                .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind))
                .map((r) => (
                  <li key={r.name} className="flex items-start gap-3">
                    <span className={`dl-resident-mark dl-resident-${r.kind.replace(/\s+/g, '-')}`} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug" style={{ color: 'var(--dl-ink)' }}>
                        {r.name}
                        <span className="dl-kind ml-2 align-middle">{r.kind}</span>
                      </span>
                      <span className="block text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--dl-ink-2)' }}>{r.note}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <p className="dl-rule-top pt-5 text-xs" style={{ color: 'var(--dl-ink-2)' }}>
          Everything on this floor comes from the stories set here. New stories add places, residents, and systems; the plan grows with them.
        </p>
      </footer>
    </div>
  );
}
