import Link from 'next/link';
import { getStory } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
export default async function WaterReader() {
  const first = getStory('water')!;
  const second = getStory('water-part-2')!;
  const [firstHtml, secondHtml] = await Promise.all([
    renderMarkdown(first.content),
    renderMarkdown(second.content),
  ]);
  return (
    <div className="city" id="reader-content">
      <div className="city-wayfinding">
        <Link href="/arcology/floors/318/mel">↖ Visit Floor 318</Link>
        <Link href="/stories">All stories</Link>
      </div>
      <article className="city-essay">
        <header>
          <p className="city-location">A story from Arcology One</p>
          <h1>Water</h1>
          <p className="city-lede">By SB Corvus</p>
        </header>
        <aside className="city-reading-door">
          <p>Meet Mel and Pell where the story begins.</p>
          <Link href="/arcology/floors/318/mel">Visit the atrium — spoiler-free</Link>
        </aside>
        <div className="city-story-body" dangerouslySetInnerHTML={{ __html: firstHtml }} />
        <section className="city-story-body" id="part-2" aria-label="Water, part two">
          <hr />
          <div dangerouslySetInnerHTML={{ __html: secondHtml }} />
        </section>
        <aside className="city-reading-door">
          <h2>Return to the place you know.</h2>
          <p>The story ends. The neighborhood still has more to show you.</p>
          <Link className="city-button" href="/arcology/floors/318/mel/after-water">
            I’ve finished Water — revisit the atrium
          </Link>
          <p style={{ marginTop: 20 }}>
            <Link href="/stories/water/experience">Explore the Living Loop</Link>
          </p>
          <p>
            <Link href="/stories/water-part-2/experience">
              Explore the Binding Hierarchy · Story spoilers
            </Link>
          </p>
        </aside>
      </article>
    </div>
  );
}
