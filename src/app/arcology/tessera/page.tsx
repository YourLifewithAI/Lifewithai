import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Tessera — A piece of the mosaic',
  description: 'The neighborhood-sized idea at the beginning of an Arcology.',
};
export default function TesseraPage() {
  return (
    <div className="city" id="reader-content">
      <div className="city-wayfinding">
        <Link href="/arcology">↖ Return to Arcology One</Link>
        <span>At the roots of the city</span>
      </div>
      <article className="city-essay">
        <p className="city-location">Tessera</p>
        <h1>A single piece of the mosaic.</h1>
        <p className="city-lede">
          Before a city reaches into the clouds, there is a neighborhood table.
        </p>
        <p>
          Tessera explores a smaller beginning: a community built around compute and automation, and
          the lives that could take root around them. The Arcology is one possible future for that
          idea. A Tessera can also remain a place of its own.
        </p>
        <p>
          The marker at the foot of the Arcology connects these ideas. It represents an origin,
          rather than an assigned address inside the future city.
        </p>
        <a className="city-button" href="https://substack.com/@sbcorvus/p-198907409">
          Read the Tessera essay
        </a>
        <hr />
        <h2>The next place to explore</h2>
        <p>
          Tessera’s own walkable neighborhood will grow here. For now, enter Floor 318 to explore
          the first illustrated neighborhood in Arcology One.
        </p>
        <Link href="/arcology/floors/318/mel">Visit Mel and Pell on Floor 318</Link>
      </article>
    </div>
  );
}
