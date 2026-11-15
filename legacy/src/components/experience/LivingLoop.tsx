'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { LivingLoopExperience } from '@/lib/types';
import { availableLoopSteps } from '@/lib/living-loop';
import './living-loop.css';

export default function LivingLoop({ experience: exp }: { experience: LivingLoopExperience }) {
  const [placeId, setPlaceId] = useState(exp.places[0].id);
  const [routeId, setRouteId] = useState(exp.routes[0].id);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stacked, setStacked] = useState(false);
  const noteRef = useRef<HTMLHeadingElement>(null);
  const place = exp.places.find(p => p.id === placeId)!;
  const route = exp.routes.find(r => r.id === routeId)!;
  const activeSteps = availableLoopSteps(route.steps, paused);

  function choosePlace(id: string, focusNote = false) {
    setPlaceId(id);
    if (focusNote) requestAnimationFrame(() => noteRef.current?.focus());
  }

  function sources(ids: string[]) {
    return ids.map(id => {
      const source = exp.sources.find(s => s.id === id)!;
      return <a key={id} href={`#source-${id}`}>{source.title.split(' · ')[0]} <span aria-hidden="true">↗</span></a>;
    });
  }

  return (
    <div className="city living-loop" id="reader-content">
      <div className="loop-wayfinding">
        <Link href="/arcology/floors/318/mel">← Back to Mel & Pell’s garden</Link>
        <Link href="/arcology">View the whole city ↗</Link>
      </div>
      <header className="loop-heading">
        <div><p className="loop-eyebrow">Behind the garden · An interactive field guide</p>
          <h1>{exp.title}</h1>
          <p className="loop-subtitle">{exp.subtitle}</p></div>
        <div className="loop-intro"><p>{exp.intro}</p><a href="#loop-companies">Who is building this today? ↓</a><br /><a href="#loop-research">What is this based on? ↓</a></div>
      </header>

      <section className="loop-explore" aria-label="Explore the farm rooms">
        <div className="loop-visual-column">
          <div className="loop-map" id="loop-map">
            <Image src={exp.image} width={1536} height={1024} priority
              sizes="(max-width: 1000px) 100vw, 70vw"
              alt="A Storybook cutaway of six farm rooms with doors omitted: a drone scouts vegetables, one floating monitor tends each fish tank, and ceiling-mounted arms load mushrooms into a quad’s back container. A worker shovels compost into a dirt-hauling quad’s square bucket. A water workshop and insect nursery share the corridor." />
            {showRoutes && <svg className="loop-route-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs><marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
              {activeSteps.map(step => {
                const from = exp.places.find(p => p.id === step.from)?.position;
                const to = exp.places.find(p => p.id === step.to)?.position;
                if (!from || !to) return null;
                const self = step.from === step.to;
                const d = self ? `M ${from.x-3} ${from.y} C ${from.x-12} ${from.y-17}, ${from.x+12} ${from.y-17}, ${from.x+3} ${from.y}`
                  : `M ${from.x} ${from.y} Q ${(from.x+to.x)/2+5} ${(from.y+to.y)/2+(from.x > to.x ? 7 : -7)}, ${to.x} ${to.y}`;
                return <g key={step.id}><path className="loop-path-halo" d={d} /><path className={`loop-path loop-path-${routeId}`} d={d} markerEnd="url(#loop-arrow)" /></g>;
              })}
            </svg>}
            {exp.places.map((p, i) => <button key={p.id} className="loop-pin"
              style={{ left: `${p.position.x}%`, top: `${p.position.y}%` }}
              aria-label={`Explore ${p.label}`} aria-pressed={placeId === p.id} aria-controls="loop-place-note"
              onClick={() => choosePlace(p.id, true)}><span>{i + 1}</span><b>{p.shortLabel}</b></button>)}
          </div>
          <div className="loop-map-caption"><span>{showRoutes ? `${route.label} · Paths show exchanges, not pipework.` : 'Choose a room to look closer.'}</span><span>Illustrated cutaway · Not to scale</span></div>
          <div className="loop-place-index" aria-label="Farm room index">
            {exp.places.map((p, i) => <button key={p.id} aria-pressed={p.id === placeId} aria-controls="loop-place-note" onClick={() => choosePlace(p.id, true)}><span>{i + 1}</span>{p.shortLabel}</button>)}
          </div>
          <p className="loop-proposal">{exp.proposal} Roofs, front walls and doors are omitted for visibility; production rooms would have controlled boundaries.</p>
        </div>

        <aside className="loop-note" id="loop-place-note" aria-labelledby="loop-place-heading">
          <p className="loop-eyebrow">{place.eyebrow}</p>
          <h2 id="loop-place-heading" ref={noteRef} tabIndex={-1}>{place.label}</h2>
          <p>{place.description}</p>
          <h3>What passes through</h3><p>{place.exchange}</p>
          <button className="loop-ai-button" aria-expanded={showAI} aria-controls="loop-care" onClick={() => setShowAI(!showAI)}>{showAI ? '−' : '+'} The people & AI keeping it alive</button>
          {showAI && <div id="loop-care" className="loop-care"><p>{place.care}</p><p>{place.ai}</p><h3>Quality, not just quantity</h3><p>{place.quality}</p></div>}
          <div className="loop-evidence"><span>Research & practice</span>{sources(place.sourceIds)}</div>
          {place.companyIds.length > 0 && <div className="loop-evidence"><span>Company examples · Deployment & fit below</span>{sources(place.companyIds)}</div>}
        </aside>
      </section>

      <section className="loop-transfers" aria-labelledby="loop-transfer-title">
        <div className="loop-section-heading"><div><p className="loop-eyebrow">Nothing disappears into an arrow</p><h2 id="loop-transfer-title">Follow an exchange.</h2></div>
          <p>Food, water and residues take different paths. Choose one to see what travels, what is checked, and where it stops.</p></div>
        <div className="loop-controls">
          <div className="loop-segment" aria-label="Choose an exchange">
            {exp.routes.map(r => <button key={r.id} aria-pressed={r.id === routeId} aria-controls="loop-route-detail" onClick={() => { setRouteId(r.id); setShowRoutes(true); }}>{r.label}</button>)}
          </div>
          <label className="loop-checkbox"><input type="checkbox" checked={showRoutes} onChange={e => setShowRoutes(e.target.checked)} /> Trace paths on the illustration</label>
          {showRoutes && <a className="loop-view-map" href="#loop-map">View traced map ↑</a>}
        </div>
        <div id="loop-route-detail">
          <h3 className="loop-route-title">{route.intro}</h3>
          <ol className="loop-steps">{route.steps.map((step, i) => <li key={step.id} className={paused && step.canIsolate ? 'loop-step-paused' : ''}>
            <span className="loop-step-number">{String(i + 1).padStart(2, '0')}</span>
            <div><h4>{step.label}{paused && step.canIsolate && <em>Transfer on hold</em>}</h4><p>{step.detail}</p>
              {exp.places.some(p => p.id === step.to) && <button className="loop-text-button" onClick={() => choosePlace(step.to, true)}>Visit {exp.places.find(p => p.id === step.to)!.shortLabel.toLowerCase()} ↑</button>}</div>
          </li>)}</ol>
          <p className="loop-boundary">{route.boundary}</p>
        </div>
        {routeId === 'water' && <div className="loop-isolation">
          <div><p className="loop-eyebrow">Try a design decision</p><h3>What if we pause the fish-to-plant transfer?</h3>
          <p>A demonstration of the proposed plumbing logic. This is not a live farm simulation.</p></div>
          <button className="loop-solid-button" aria-pressed={paused} onClick={() => { setPaused(!paused); setShowRoutes(true); }}>{paused ? 'Resume nutrient transfer' : 'Pause nutrient transfer'}</button>
          <p role="status">{paused ? 'Transfer closed. Fish water still recirculates through treatment. Plants still use their own reservoir; staff must maintain their separate nutrient and water supply. Backup life support remains essential.' : 'Transfer available. Only checked water moves into the plant circuit. No plant drainage returns to the fish.'}</p>
        </div>}
      </section>

      <section className="loop-layout" aria-labelledby="loop-layout-title">
        <div className="loop-section-heading"><div><p className="loop-eyebrow">Where does it all fit?</p><h2 id="loop-layout-title">Close neighbors.<br />Separate environments.</h2></div><p>One floor is a sensible starting point for this neighborhood. A larger food system may need a cluster of adjacent decks. Neither arrangement requires one shared water loop.</p></div>
        <div className="loop-segment" aria-label="Compare floor arrangements"><button aria-pressed={!stacked} aria-controls="loop-layout-detail" onClick={() => setStacked(false)}>One farm deck</button><button aria-pressed={stacked} aria-controls="loop-layout-detail" onClick={() => setStacked(true)}>Adjacent farm decks</button></div>
        <div id="loop-layout-detail" className="loop-layout-detail">
          <div className={`loop-decks ${stacked ? 'loop-decks-stacked' : ''}`} aria-label={stacked ? 'Concept: plants on the light-facing deck, fungi and insects in enclosed rooms, fish and recovery on a service deck.' : 'Concept: six separately enclosed rooms share one deck.'}>
            <div className="loop-deck"><span className="loop-deck-caption">{stacked ? 'Light-facing deck' : 'Shared farm deck'}</span><div><b>Plants & soil garden</b>{!stacked && <><b>Mushrooms</b><b>Insects</b><b>Fish</b><b>Water care</b><b>Recovery bay</b></>}</div></div>
            {stacked && <><div className="loop-riser">Controlled transfers · Service riser & goods lift</div><div className="loop-deck"><span className="loop-deck-caption">Enclosed growing rooms</span><div><b>Mushrooms</b><b>Insects</b></div></div><div className="loop-riser">Independent air, drains and local water loops</div><div className="loop-deck"><span className="loop-deck-caption">Engineered service deck</span><div><b>Fish & water care</b><b>Recovery bay</b></div></div></>}
            <small>Arrangement study · No floor numbers or dimensions assigned</small>
          </div>
          <div className="loop-layout-copy">
            <h3>{stacked ? 'Specialize the rooms; minimize what moves.' : 'Begin with a compact cluster.'}</h3>
            <p>{stacked ? 'Keep each high-flow water circuit on its own deck. Move only the planned nutrient transfer through an isolatable service riser; carry solids and harvests in contained batches by a goods lift.' : 'Short service runs and nearby growers simplify inspection and exchange. Fish, plants, mushrooms and insects still need distinct operating conditions; composting belongs behind a controlled service boundary.'}</p>
            <dl><dt>What it makes easier</dt><dd>{stacked ? 'More room for each process, crop access to daylight, and dedicated structural and climate zones.' : 'Maintenance access, short transfers, shared staff and a clear relationship between the garden and its support rooms.'}</dd>
              <dt>What it costs</dt><dd>{stacked ? 'More pumping head, risers, penetrations, containment, goods movement and coordination. Gravity does not eliminate the return-pumping or control problem.' : 'A large contiguous area, concentrated water loads, and careful separation of humidity, odors, pests and clean produce handling.'}</dd>
              <dt>Before choosing</dt><dd>Calculate crop area, diet contribution, water and nutrient balances, structural loads, light, cooling, labor and failure recovery. A one-metre depth of water alone adds about one tonne per square metre; tanks and equipment add more.</dd></dl>
            <p className="loop-small">Our design inference, informed by <a href="#source-decoupled">separate-loop trials</a> and <a href="#source-hydraulics">hydraulic design research</a>. It needs site-specific engineering. Larger composting and digestion may be shared city utilities.</p>
          </div>
        </div>
      </section>

      <section className="loop-companies" id="loop-companies" aria-labelledby="loop-companies-title">
        <div className="loop-section-heading"><div><p className="loop-eyebrow">From the drawing into the world</p><h2 id="loop-companies-title">Who is building<br />pieces of this?</h2></div><p>Real companies, organized by room. Follow a link to the equipment, the grower or the trial behind it. These examples support individual parts of our proposal; the complete Arcology farm has yet to be demonstrated.</p></div>
        <p className="loop-company-key">AI makes predictions or guides decisions. Robotics moves and handles things. Process automation controls equipment. They can work together, but one does not imply the others.</p>
        {exp.places.map((p, i) => <section key={p.id} className="loop-company-phase" aria-labelledby={`company-phase-${p.id}`}>
          <div className="loop-company-room"><span className="loop-eyebrow">Room {String(i + 1).padStart(2, '0')}</span><h3 id={`company-phase-${p.id}`}>{p.shortLabel}</h3><button className="loop-text-button" onClick={() => choosePlace(p.id, true)}>Explore this room ↑</button></div>
          <div className="loop-company-examples">{p.companyIds.map(id => {
            const s = exp.sources.find(source => source.id === id)!;
            const company = s.company!;
            return <article key={id} id={`source-${id}`} className="loop-company-example">
              <h4><a href={s.url} target="_blank" rel="noreferrer">{s.title.split(' · ')[0]} ↗</a></h4>
              <p className="loop-company-tech">{company.technologies.join(' · ')}</p>
              <p>{company.application}</p>
              <p className="loop-company-status">{company.status}</p>
              <details><summary>Deployment & fit<span className="sr-only">: {s.title.split(' · ')[0]}</span></summary><p>{company.deployment}</p><p>{s.scope}</p><ul>{company.evidence.map(e => <li key={e.url}><a href={e.url} target="_blank" rel="noreferrer">{e.title} ↗</a></li>)}</ul></details>
            </article>;
          })}</div>
        </section>)}
        <p className="loop-review-date">Reviewed 13 September 2026 · Status reflects the linked evidence, usually a company account. Performance claims are not independent evaluations. Our skimmers, ceiling arms and bucket-carrying quad remain concept designs.</p>
      </section>

      <section className="loop-research" id="loop-research" aria-labelledby="loop-research-title">
        <div className="loop-section-heading"><div><p className="loop-eyebrow">The notebook stays open</p><h2 id="loop-research-title">Built on evidence.<br />Open to revision.</h2></div><p>Research supports individual processes. Connecting all of them inside an Arcology remains a design proposal. Company links describe specific tools, not endorsements or proof of this whole system.</p></div>
        <details className="loop-audit"><summary>What changed in the research?</summary><p>Removed unsupported blanket claims for feeding an entire floor, fish stocking and final weight, crop yields without a time basis, AI health accuracy, energy savings and nutrient recovery. Feed conversion and feed-to-growing-area ratios need defined species, diets and trials.</p><p>Separated aerobic composting, anaerobic digestion and liquid nutrient recovery. The proposed farm imports energy, feed, water and supplementary nutrients, and exports food and unrecoverable material. Its actual capacity and resource savings have not been calculated.</p><p>Use crop-relevant light measurements and a full energy balance before promising lighting savings. Yield alone does not establish flavor, nutrition or shelf life.</p></details>
        <p className="loop-review-date">Sources reviewed 13 September 2026 · Scope and limitations accompany each link.</p>
        <div className="loop-source-list">{exp.sources.filter(s => s.kind !== 'Company').map(s => <article key={s.id} id={`source-${s.id}`}><div className="loop-source-type">{s.kind}<span>{s.year}</span></div><div><h3><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></h3><p>{s.scope}</p></div></article>)}</div>
        <div className="loop-bottom"><Link className="loop-solid-button" href="/arcology/floors/318/mel">Back to the community garden</Link><Link href="/stories/water">Read Water →</Link><Link href="/arcology/research">Explore more engineering research ↗</Link></div>
      </section>
    </div>
  );
}
