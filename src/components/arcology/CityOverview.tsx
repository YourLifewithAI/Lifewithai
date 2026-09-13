import Image from 'next/image';
import Link from 'next/link';
export default function CityOverview() {
  return (
    <div className="city" id="reader-content">
      <section className="city-overview" aria-labelledby="city-title">
        <div className="city-overview-heading">
          <p>A shared city. Many ways to be alive.</p>
          <h1 id="city-title">Arcology One</h1>
          <p>
            A mile above the ground. Millions of human and AI lives.
            <br />
            Find your way in through one of them.
          </p>
        </div>
        <div className="city-map">
          <Image
            src="/images/arcology/overview-storybook.webp"
            alt="Storybook illustration of Arcology One, a vast stepped city crowned by a flat rooftop park. Three visible three-tier extensions project from its sides, with planted terraces, blue windows, and a river winding through the hill country to the left."
            width={1536}
            height={1024}
            priority
            sizes="100vw"
          />
          <Link
            href="/arcology/floors/318/mel"
            className="city-map-pin city-floor-pin"
            id="floor-318"
          >
            <span className="city-pin-dot" />
            <span>
              <strong>Floor 318</strong>
              <small>Mel, Pell & the garden atrium</small>
            </span>
          </Link>
          <Link href="/arcology/tessera" className="city-map-pin city-tessera-pin">
            <span className="city-pin-dot" />
            <span>
              <strong>Tessera</strong>
              <small>Where Arcology One begins</small>
            </span>
          </Link>
          <p className="city-map-caption">
            An architectural imagining. Explore the places with stories to tell.
          </p>
        </div>
      </section>
      <section className="city-invitation">
        <div>
          <p className="city-location">Your first visit · Floor 318</p>
          <h2>Start with the marigolds.</h2>
          <p>
            Join Mel and Pell in their community garden.
          </p>
          <Link className="city-button" href="/arcology/floors/318/mel">
            Enter the atrium
          </Link>
          <Link className="city-text-link" href="/stories/water">
            Read Water
          </Link>
        </div>
        <Link href="/arcology/floors/318/mel" aria-label="Visit Mel in the Floor 318 atrium">
          <Image
            src="/images/arcology/318-garden-storybook.webp"
            alt="A resident tending plants beneath a shared mural."
            width={1536}
            height={1024}
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </Link>
      </section>
      <section className="city-note">
        <h2>A city revealed through its residents.</h2>
        <p>
          Each story opens another place to explore: the people who belong there, the relationships
          that give it meaning, and the systems that make everyday life possible. Floor 318 is the
          first inhabited scene. The rest of the city will become familiar one story at a time.
        </p>
        <Link href="/arcology/research">Explore the engineering research</Link>
      </section>
    </div>
  );
}
