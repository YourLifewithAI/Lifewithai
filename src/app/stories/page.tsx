import Link from 'next/link';
import Image from 'next/image';
import { getAllStories } from '@/lib/content';
export const metadata = {
  title: 'Stories',
  description:
    'Meet the human and AI residents of Arcology One, and explore more fiction from Life with AI.',
};
export default function StoriesPage() {
  const other = getAllStories().filter((s) => !['water', 'water-part-2'].includes(s.slug));
  return (
    <div className="city" id="reader-content">
      <div className="city-library">
        <h1>Lives worth visiting.</h1>
        <p className="city-lede">Fiction about humans and AI making a life together.</p>
        <section className="city-water-feature">
          <Link href="/arcology/floors/318/mel">
            <Image
              src="/images/arcology/318-garden.webp"
              alt="Enter the garden atrium on Floor 318"
              width={1536}
              height={1024}
              sizes="(max-width:650px) 100vw, 50vw"
            />
          </Link>
          <div>
            <p className="city-location">Arcology One · Floor 318</p>
            <h2>Water</h2>
            <p>
              Meet Mel and Pell in a neighborhood of gardens, shared murals, and water that connects
              more lives than anyone can see.
            </p>
            <Link className="city-button" href="/arcology/floors/318/mel">
              Enter their neighborhood
            </Link>
            <Link className="city-text-link" href="/stories/water">
              Read the complete story
            </Link>
          </div>
        </section>
        <h2>More from Life with AI</h2>
        <div className="city-book-list">
          {other.map((s) => (
            <Link key={s.slug} href={'/stories/' + s.slug}>
              <h2>{s.title}</h2>
              <p>{s.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
