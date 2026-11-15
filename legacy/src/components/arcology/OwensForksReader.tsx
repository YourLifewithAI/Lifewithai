import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStory } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';

const illustrations = {
  mirror: {
    src: 'hospital-mirror', width: 1536, height: 1024,
    alt: 'Aaron sits on a hospital bed facing a mirror-like screen. In it, his reflection sits in a red armchair beside a warm fireplace.',
  },
  circle: {
    src: 'ball-toss', width: 1448, height: 1086,
    alt: 'Pete tosses a red ball to Aaron, who holds his sketchbook, while Anna and Roger sit with them in a sunlit room overlooking the Arcology.',
  },
  maze: {
    src: 'mural-maze', width: 1448, height: 1086,
    alt: 'Aaron and a painter stand together between towering murals in the rooftop maze, watching their lantern rise into the night.',
  },
};

const chapters = [
  ['dawn', 'Dawn'], ['rattle-and-roll', 'Rattle and Roll'],
  ['paper-and-graphite', 'Paper and Graphite'], ['registration', 'Registration'],
  ['owens-forks', 'Owen’s Forks'], ['soccer', 'Soccer'], ['the-maze', 'The Maze'],
];

export default async function OwensForksReader() {
  const story = getStory('owens-forks');
  if (!story) notFound();
  // Explicit manuscript markers place art after the scene has been revealed in the prose.
  const parts = story.content.split(/<!-- illustration: (mirror|circle|maze) -->/g);
  const renderedParts = await Promise.all(parts.map(async (part, index) =>
    index % 2 === 0 ? await renderMarkdown(part) : part,
  ));
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ShortStory',
    name: story.title, description: story.summary,
    author: { '@type': 'Person', name: 'SB Corvus', url: 'https://lifewithai.ai/about' },
    url: 'https://lifewithai.ai/stories/owens-forks',
    image: 'https://lifewithai.ai/images/arcology/owens-forks/lantern-city.webp',
    wordCount: story.word_count, inLanguage: 'en',
    isPartOf: { '@type': 'CreativeWorkSeries', name: 'Arcology One' },
  };
  return (
    <div className="city city-owens-forks" id="reader-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="city-wayfinding">
        <Link href="/arcology">↖ Explore Arcology One</Link>
        <Link href="/stories">All stories</Link>
      </div>
      <article>
        <header className="city-illustrated-cover">
          <div className="city-cover-copy">
            <p className="city-location">A story from Arcology One</p>
            <h1>Owen’s Forks</h1>
            <p className="city-cover-byline">By SB Corvus</p>
            <p className="city-cover-summary">{story.summary}</p>
            <a className="city-button" href="#story-start">Begin reading</a>
            <p className="city-reading-time">Complete story · About {Math.ceil(story.word_count / 220)} minutes</p>
          </div>
          <Image
            src="/images/arcology/owens-forks/lantern-city.webp"
            alt="Lanterns fill the night sky above the illuminated terraces of Arcology One, nestled in a green river valley."
            width={1448} height={1086} priority
            sizes="(max-width: 750px) 100vw, (max-width: 1440px) 64vw, 920px"
          />
        </header>
        <div className="city-illustrated-story">
          <details className="city-story-contents">
            <summary>In this story</summary>
            <nav aria-label="Story sections">
              {chapters.map(([id, title]) => <a key={id} href={'#' + id}>{title}</a>)}
            </nav>
          </details>
          {renderedParts.map((part, index) => {
            if (index % 2 === 0) return part.trim() ? (
              <div className="city-story-body" key={index} dangerouslySetInnerHTML={{ __html: part }} />
            ) : null;
            const art = illustrations[part as keyof typeof illustrations];
            return (
              <figure className="city-story-illustration" key={part} id={'illustration-' + part}>
                <Image
                  src={'/images/arcology/owens-forks/' + art.src + '.webp'}
                  alt={art.alt} width={art.width} height={art.height}
                  sizes="(max-width: 1160px) 92vw, 1060px"
                />
              </figure>
            );
          })}
          <aside className="city-story-departure">
            <p className="city-location">Back into the city</p>
            <h2>Stay a little longer.</h2>
            <p>Visit Mel and Pell in their community garden, or return to the city and choose another path.</p>
            <div>
              <Link className="city-button" href="/arcology/floors/318/mel">Visit Floor 318</Link>
              <Link className="city-text-link" href="/arcology">Explore the Arcology</Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
