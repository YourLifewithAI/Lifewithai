import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import { SITE, STAGES } from '@/lib/site';
import { pageMeta } from '@/lib/meta';

export const metadata: Metadata = pageMeta({
  title: 'About',
  description: 'Who runs Life with AI, what it is, how a piece is made, and the rules it keeps.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="sheet">
      <div className="sheet-body">
        <div className="page-head">
          <h1>About</h1>
        </div>
        <div className="doc">
          <p className="lead">{SITE.sub}</p>

          <h2 id="who">Who</h2>
          <p>
            {SITE.host}. He builds too. His own build is <Link href="/projects/asher">Asher</Link>, a small robot
            car that Claude drives, hears and speaks through.
          </p>

          <h2 id="what">What the site is</h2>
          <p>
            Most people meet AI as a chatbot: a box you type into. This site is about the rest of it. It follows AI
            off the screen and into real work: on the farm, on the job site, at the bench, in the repair bay, in
            the kitchen, and in the aids people build for themselves.
          </p>
          <p>
            The site has six topics: <Link href="/topics/growing">Growing</Link>,{' '}
            <Link href="/topics/building">Building</Link>, <Link href="/topics/making">Making</Link>,{' '}
            <Link href="/topics/fixing">Fixing</Link>, <Link href="/topics/feeding">Feeding</Link> and{' '}
            <Link href="/topics/living">Living</Link>.
          </p>

          <h2 id="how">How a piece is made</h2>
          <p>
            Pieces are about real people doing the work, told in their own words. Every piece follows the same plan.
          </p>
          <dl>
            <dt>Then</dt>
            <dd>A little history: how this work used to be done.</dd>
            <dt>Now</dt>
            <dd>How most people do it today.</dd>
            <dt>Next</dt>
            <dd>What this builder does differently, with AI and something physical they made.</dd>
            <dt>The receipt</dt>
            <dd>What it cost, and what broke along the way.</dd>
            <dt>The core</dt>
            <dd>
              For people who want the details: the parts list, the wiring, the AI model used and the power it
              needs.
            </dd>
          </dl>
          <p>Every build shows how far along it is:</p>
          <dl>
            {STAGES.map((s) => (
              <Fragment key={s.id}>
                <dt>{s.label}</dt>
                <dd>{s.means}</dd>
              </Fragment>
            ))}
          </dl>

          <h2 id="rules">The rules</h2>
          <h3>Sponsors</h3>
          <p>
            We only take sponsors whose product Ben has used on his own bench, and we show where. A sponsor never
            buys a story or a mention. If a sponsor&apos;s product appears in a story, that story says so.
          </p>
          <h3>A guest&apos;s build</h3>
          <p>
            On a guest&apos;s build, the links are theirs. We use the guest&apos;s own shop or partner links. If they have none, we use plain links and a
            &ldquo;Support this builder&rdquo; link. The site&apos;s own paying links go only on Ben&apos;s own
            builds.
          </p>

          <h2 id="ai">How AI is used here</h2>
          <p>
            This site and Asher are built with Claude, an AI model made by Anthropic. Facts are checked against
            sources.
          </p>

          <h2 id="contact">Contact</h2>
          <p>
            Write to{' '}
            <a className="addr" href={`mailto:${SITE.contact}`}>
              {SITE.contact}
            </a>
            . If you do this kind of work, we would like to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}
