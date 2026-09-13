import Link from 'next/link';
import Image from 'next/image';
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
        <figure className="city-story-recovery" id="after-water">
          <Link href="/arcology/floors/318/mel/after-water" aria-label="Explore the atrium after Water">
            <Image src="/images/arcology/318-after-water-storybook.webp" width={1536} height={1024}
              sizes="(max-width: 900px) 92vw, 900px"
              alt="Mel rests a hand on Pell’s orange lobster-shaped robot body as neighbors repaint the atrium mural. Empty damaged fish tanks, bare trellises, and two new seedlings show the work of recovery." />
          </Link>
          <figcaption>After Water. The neighborhood begins again.</figcaption>
        </figure>
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
