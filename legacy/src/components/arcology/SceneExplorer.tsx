'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ScenePoint, Resident } from '@/lib/arcology-world';
interface Props {
  resident: Resident;
  after: boolean;
  image: string;
  alt: string;
  points: ScenePoint[];
}
export default function SceneExplorer({ resident, after, image, alt, points }: Props) {
  const [selected, setSelected] = useState(resident.id as string);
  const point = points.find((p) => p.id === selected)!;
  return (
    <div className="city" id="reader-content">
      <div className="city-wayfinding">
        <Link href="/arcology#floor-318">↖ Zoom out to Arcology One</Link>
        <span>Floor 318 / Central atrium</span>
      </div>
      <header className="city-scene-heading">
        <div>
          <p className="city-location">
            {after ? 'After Water · Contains story spoilers' : 'Before Water · No story spoilers'}
          </p>
          <h1>{after ? 'Back at the mural.' : `Meet ${resident.name}.`}</h1>
        </div>
        <p>
          {after
            ? 'The place has changed. So have the people who call it home.'
            : resident.introduction}
        </p>
      </header>
      <section className="city-scene-layout" aria-label="Explore Floor 318">
        <div className="city-scene-image">
          <Image
            src={image}
            alt={alt}
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 900px) 100vw, 74vw"
          />
          {points.map((p) => (
            <button
              key={p.id}
              className="city-scene-pin"
              style={{ left: `${p.position[0]}%`, top: `${p.position[1]}%` }}
              aria-label={`Explore ${p.name}`}
              aria-pressed={selected === p.id}
              aria-controls="scene-detail"
              onClick={() => setSelected(p.id)}
            >
              <span className="city-pin-dot" />
              <span>{p.name}</span>
            </button>
          ))}
          <span className="city-scene-caption">A vision of the neighborhood</span>
        </div>
        <aside
          className="city-scene-detail"
          id="scene-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="city-location">In this scene</p>
          <h2>{point.heading}</h2>
          <p>{point.description}</p>
          <Link
            className="city-button"
            href={point.id === resident.id ? '#resident-profile' : point.href}
          >
            {point.id === resident.id ? `More about ${resident.name}` : point.linkLabel}
          </Link>
          <div className="city-detail-links">
            <p>Look around</p>
            {points.map((p) => (
              <button key={p.id} aria-pressed={p.id === selected} onClick={() => setSelected(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
        </aside>
      </section>
      <section className="city-resident" id="resident-profile">
        <div>
          <p className="city-location">{resident.identity}</p>
          <h2>{resident.name}, at home in the Arcology.</h2>
          <p>{resident.attention}</p>
          <dl>
            <dt>Find them here</dt>
            <dd>{resident.location}</dd>
            <dt>Story</dt>
            <dd>
              <Link href="/stories/water">Water, by SB Corvus</Link>
            </dd>
          </dl>
        </div>
        <div className="city-reading-invitation">
          <h2>{after ? 'Look beneath the experience.' : 'Stay for the story.'}</h2>
          <p>
            {after
              ? 'Explore how water circulates through the neighborhood, and how the story imagines responsibility between humans and AI.'
              : 'A garden is a small part of a very large system. Water follows Mel and Pell through the life of their neighborhood.'}
          </p>
          <Link
            className="city-button"
            href={after ? '/stories/water-part-2/experience' : '/stories/water'}
          >
            {after ? 'Explore the Binding Hierarchy' : 'Read Water — the complete story'}
          </Link>
          <Link
            prefetch={false}
            className="city-text-link"
            href={
              after
                ? `/arcology/floors/318/${resident.id}`
                : `/arcology/floors/318/${resident.id}/after-water`
            }
          >
            {after
              ? 'Return to the spoiler-free introduction'
              : 'I’ve finished Water — revisit the atrium'}
          </Link>
        </div>
      </section>
    </div>
  );
}
