// A build's project page, sheet by sheet. Server components: every word comes from the project's words file
// (words/projects/<id>.md, read by src/content/<id>.ts) and the site's words; the model (src/content/<id>.model.json),
// prepared by src/lib/project-model.ts, gives the drawing its shapes.
// Ported from the studio's round 4 template (page.html and page.js).
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { stages } from '@/lib/site';
import { topicById } from '@/lib/topic-words';
import { html, type WordsTable } from '@/lib/words';
import { fill, type ProjectPage, type ReceiptKey } from '@/lib/project';
import type { DrawingData, Measurements, PartsList } from '@/lib/project-model';
import { TopicIcon } from '@/components/site/TopicIcons';
import ProjectDrawing from '@/components/site/drawing/ProjectDrawing';
import { Paras, Rich } from './Rich';
import { WiringDiagram } from './WiringDiagram';
import './project.css';

type P = { page: ProjectPage };

function Ladder({ page, full }: { page: ProjectPage; full?: boolean }) {
  const w = page.words;
  return (
    <ol className={full ? 'ladder full' : 'ladder'} aria-label={w.stageLadder}>
      {stages().map((s) => {
        const on = s.id === page.stage;
        return (
          <li key={s.id} className={on ? 'on' : undefined} aria-current={on ? 'step' : undefined}>
            {on && <span className="lflag" aria-hidden="true" />}
            <span className="ll">
              {s.label}
              {on && <span className="vh"> {w.stageThisBuild}</span>}
            </span>
            {full && <span className="lm">{s.means}</span>}
          </li>
        );
      })}
    </ol>
  );
}

// ---- 1. the title sheet ---------------------------------------------------------------------------------------------
export function TitleSheet({ page, photo }: P & { photo?: StaticImageData }) {
  const w = page.words;
  const topic = topicById(page.topic);
  const jumps: [string, string][] = [
    ['cando', w.jumpCanDo],
    ['journal', w.jumpJournal],
    ['receipt', w.jumpReceipt],
    ['core', w.jumpCore],
  ];
  const shown = !!(photo && page.photo);
  return (
    <section className="sheet" id="top" aria-labelledby="p-name">
      {/* With a photo, the hook and the intro sit beside it on a wide screen (project.css), so the sheet has no empty
          half; on a phone the photo comes under the intro. */}
      <div className={shown ? 'sheet-body title-body has-photo' : 'sheet-body title-body'}>
        <p className="verbline">
          <TopicIcon id={page.topic} className="vicon" />
          <span>{topic?.verb}</span>
        </p>
        <h1 id="p-name">{page.name}</h1>
        <div className="title-words">
          <p className="lead">
            <Rich text={page.hook} />
          </p>
          <div className="intro copy">
            <Paras items={page.intro} />
          </div>
        </div>
        {shown ? (
          <figure className="photo title-photo">
            <Image
              src={photo}
              alt={page.photo!.alt}
              sizes="(min-width: 1112px) 440px, (min-width: 860px) calc((100vw - 120px) * 0.44), min(560px, calc(100vw - 80px))"
              loading="eager"
              fetchPriority="high"
            />
            <figcaption>
              <Rich text={page.photo!.caption} />
            </figcaption>
          </figure>
        ) : null}
        <nav className="jumps" aria-label={w.jumpsLabel}>
          {jumps.map(([to, label]) => (
            <a key={to} href={`#${to}`}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="tbl">
        <b>{w.stage}</b>
        <Ladder page={page} />
        <span className="tbl-note">
          <Rich text={page.stageNote} />
        </span>
      </div>
      <div className="tb">
        <div>
          <b>{w.topic}</b>
          <span>
            <Link href={`/topics/${page.topic}`}>{topic?.verb}</Link>
          </span>
        </div>
        <div>
          <b>{w.updated}</b>
          <span>{page.updated}</span>
        </div>
        <div>
          <b>{w.credit}</b>
          <span>{fill(w.builtBy, { builder: page.builder })}</span>
        </div>
        <div>
          <b>{w.status}</b>
          <span>{page.status}</span>
        </div>
      </div>
    </section>
  );
}

// ---- 2. the drawing ---------------------------------------------------------------------------------------------------
const COLOURS = [
  ['compute', 'colourComputer'],
  ['board', 'colourBoards'],
  ['sensor', 'colourSensors'],
  ['power', 'colourPower'],
  ['drive', 'colourDrive'],
  ['structure', 'colourPlates'],
  ['pillar', 'colourPillars'],
] as const;

// photo: a picture of the build as it is, shown beside the drawing on a wide screen and under it on a phone. sizes: under
// 900 px the figure is the sheet's width, at most 560 px; from 900 px it is the narrower of two columns (drawing.css).
// It sits at the fold on a desktop, so it loads straight away. The figure carries a key because it is handed to a client
// component (ProjectDrawing), whose children React checks as a list.
export function DrawingSheet({ page, drawing }: P & { drawing: DrawingData }) {
  const w = page.words, d = page.drawing;
  return (
    <section className="sheet" id="drawing" aria-labelledby="h-drawing">
      <div className="sheet-body drawing-body">
        <h2 className="sheet-title" id="h-drawing">
          {d.title}
        </h2>
        <p className="sheet-sub">
          <Rich text={d.sub} />
        </p>
        <ProjectDrawing data={drawing} words={w} />
        <p className="pending">
          <Rich text={d.pending} />
        </p>
        <details className="howto">
          <summary>
            <h3>{w.howToTitle}</h3>
          </summary>
          <div className="howto-body">
            <Paras items={d.howTo} />
            <p className="ckey">
              {COLOURS.map(([fam, key]) => (
                <span key={fam}>
                  <i style={{ background: `var(--f-${fam})` }} aria-hidden="true" />
                  {w[key]}
                </span>
              ))}
            </p>
          </div>
        </details>
      </div>
      <div className="tb two">
        <div>
          <b>{w.drawnFrom}</b>
          <span>{d.drawnFrom}</span>
        </div>
        <div>
          <b>{w.scale}</b>
          <span>{d.scale}</span>
        </div>
      </div>
    </section>
  );
}

// ---- 3. what runs where: left out when the page has none ----------------------------------------------------------------
// A table from the words file: the first row names the columns, the first cell of each row names the row.
function RowsTable({ t, className }: { t: WordsTable; className: string }) {
  return (
    <table className={`rows-t ${className}`}>
      <thead>
        <tr>
          {t.head.map((h, i) => (
            <th key={i} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {t.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) =>
              j === 0 ? (
                <th key={j} scope="row" data-label={t.head[0]}>
                  {cell}
                </th>
              ) : (
                <td key={j} data-label={t.head[j]}>
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Markdown from the words file (paragraphs, "- " lists), rendered by src/lib/words.ts
const Md = ({ md, className }: { md: string; className: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html(md) }} />
);

export function WhatRunsWhere({ page }: P) {
  const w = page.words, r = page.whatRunsWhere;
  if (!r) return null;
  return (
    <section className="sheet" id="runs" aria-labelledby="h-runs">
      <div className="sheet-body">
        <h2 className="sheet-title" id="h-runs">
          {w.whatRunsWhere}
        </h2>
        <Md md={r.intro} className="runs-text" />
        <RowsTable t={r.glance} className="runs" />
        <div className="runs-grid">
          {r.sections.map((s, i) => (
            <section key={i} className="runs-s" aria-labelledby={`h-runs-${i + 1}`}>
              <h3 id={`h-runs-${i + 1}`}>{s.heading}</h3>
              <Md md={s.body} className="runs-text" />
            </section>
          ))}
        </div>
        <h3 className="runs-h">{r.gpuHeading}</h3>
        <RowsTable t={r.gpu} className="runs gpu" />
        <Md md={r.inShort} className="runs-text" />
      </div>
    </section>
  );
}

// ---- 4. what it can do today ---------------------------------------------------------------------------------------------
export function CanDo({ page }: P) {
  const w = page.words, c = page.canDo;
  return (
    <section className="sheet" id="cando" aria-labelledby="h-cando">
      <div className="sheet-body">
        <h2 className="sheet-title" id="h-cando">
          {w.canDo}
        </h2>
        <table className="rows-t cando">
          <thead>
            <tr>
              {c.cols.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r, i) => (
              <tr key={i}>
                <td className="can" data-label={c.cols[0]}>
                  <Rich text={r.can} />
                </td>
                <td className="last" data-label={c.cols[1]}>
                  <time dateTime={r.last}>{r.last}</time>
                  {r.lastNote && (
                    <small>
                      <Rich text={r.lastNote} />
                    </small>
                  )}
                </td>
                <td className="how" data-label={c.cols[2]}>
                  <Rich text={r.how} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small muted">
          <Rich text={c.note} />
        </p>
      </div>
    </section>
  );
}

// ---- 5. then, now, next ----------------------------------------------------------------------------------------------------
export function Arc({ page }: P) {
  const w = page.words;
  return (
    <div className="arc">
      {page.arc.map((a) => (
        <section key={a.id} className="sheet arc-s" id={a.id} aria-labelledby={`h-${a.id}`}>
          <div className="sheet-body">
            <h2 className="sheet-title" id={`h-${a.id}`}>
              {a.label}
              <small>{a.title}</small>
            </h2>
            <div className="arc-text">
              <Paras items={a.text} />
            </div>
            {a.steps && a.steps.length > 0 && (
              <ol className="miles">
                {a.steps.map((s) => {
                  const st = s.state ?? 'todo';
                  return (
                    <li key={s.label} className={st}>
                      <span className="mk" aria-hidden="true" />
                      <span className="ml">{s.label}</span>
                      {s.when ? (
                        <span className="when">{st === 'done' ? fill(w.milestoneReached, { when: s.when }) : s.when}</span>
                      ) : st === 'next' ? (
                        <span className="when">{w.milestoneNext}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// ---- 6. the journal, newest first ----------------------------------------------------------------------------------------
export function Journal({ page }: P) {
  const w = page.words;
  return (
    <section className="sheet" id="journal" aria-labelledby="h-journal">
      <div className="sheet-body">
        <h2 className="sheet-title" id="h-journal">
          {w.journal}
        </h2>
        <p className="sheet-sub">{w.journalSub}</p>
        <ol className="journal">
          {page.journal.map((j, i) => (
            <li key={i}>
              <details open={i < 3}>
                <summary>
                  <span className="jd">{j.date}</span>
                  <h3 className="jt">{j.title}</h3>
                </summary>
                <div className="jb">
                  <div>
                    <h4>{w.changed}</h4>
                    <ul>
                      {j.changed.map((t, k) => (
                        <li key={k}>
                          <Rich text={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="wrong">{w.wrong}</h4>
                    <ul>
                      {j.wrong.map((t, k) => (
                        <li key={k}>
                          <Rich text={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---- 7. the receipt --------------------------------------------------------------------------------------------------------
const RECEIPT: [ReceiptKey, 'receiptCost' | 'receiptTime' | 'receiptAiPart' | 'receiptBroke' | 'receiptChecked' | 'receiptGaps'][] = [
  ['cost', 'receiptCost'],
  ['time', 'receiptTime'],
  ['aiPart', 'receiptAiPart'],
  ['broke', 'receiptBroke'],
  ['checked', 'receiptChecked'],
  ['gaps', 'receiptGaps'],
];
export function Receipt({ page }: P) {
  const w = page.words;
  return (
    <section className="sheet" id="receipt" aria-labelledby="h-receipt">
      <div className="sheet-body">
        <h2 className="sheet-title" id="h-receipt">
          {w.receipt}
        </h2>
        <p className="sheet-sub">{w.receiptSub}</p>
        <dl className="receipt">
          {RECEIPT.filter(([k]) => page.receipt[k]?.length).map(([k, label]) => (
            <div className="row" key={k}>
              <dt className="rk">{w[label]}</dt>
              <dd className="rv">
                <Paras items={page.receipt[k]!} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ---- 8. the core -------------------------------------------------------------------------------------------------------------
export function Core({ page, parts, meas }: P & { parts: PartsList; meas: Measurements }) {
  const w = page.words, c = page.core;
  const nodeLabel = Object.fromEntries(c.wiring.nodes.map((n) => [n.id, n.label]));
  return (
    <section className="core" id="core" aria-labelledby="h-core">
      <div className="corehead">
        <h2 className="sec" id="h-core">
          {w.core}
        </h2>
        <p className="copy">
          <Rich text={c.intro} />
        </p>
        <Ladder page={page} full />
        <p className="copy small muted">
          <Rich text={page.stageNote} />
        </p>
      </div>

      <div className="coregrid">
        <section className="sheet wide" aria-labelledby="h-safety">
          <div className="sheet-body notes2">
            <div className="notes-col">
              <h3 className="sheet-title" id="h-safety">
                {w.safetyTitle}
              </h3>
              <p>{w.safetyLine}</p>
              <ul className="checks">
                {c.safety.checks.map((t, i) => (
                  <li key={i}>
                    <Rich text={t} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="notes-col">
              <h3 className="sheet-title">{w.licenceTitle}</h3>
              {c.licence.chosen === 'copy' && <p>{w.licenceCopy}</p>}
              <p>
                <Rich text={c.licence.note} />
              </p>
            </div>
          </div>
        </section>

        <section className="sheet" aria-labelledby="h-energy">
          <div className="sheet-body">
            <h3 className="sheet-title" id="h-energy">
              {w.energy}
            </h3>
            <div className="lines">
              <Paras items={c.energy} />
            </div>
          </div>
        </section>

        <section className="sheet" aria-labelledby="h-materials">
          <div className="sheet-body">
            <h3 className="sheet-title" id="h-materials">
              {w.materials}
            </h3>
            <div className="lines">
              <Paras items={c.materials} />
            </div>
          </div>
        </section>

        <section className="sheet wide" id="parts" aria-labelledby="h-parts">
          <div className="sheet-body parts-body">
            <h3 className="sheet-title" id="h-parts">
              {w.parts}
            </h3>
            <p className="copy">
              <Rich text={c.partsLine} />
            </p>
            <div className="partsgrid">
              <PartsTable page={page} parts={parts} />
              <MeasurementsBlock page={page} meas={meas} />
            </div>
          </div>
        </section>

        <section className="sheet wide" aria-labelledby="h-wired">
          <div className="sheet-body">
            <h3 className="sheet-title" id="h-wired">
              {w.wired}
            </h3>
            <div className="wiregrid">
              <figure className="fig wirefig">
                <WiringDiagram nodes={c.wiring.nodes} links={c.wiring.links} boxLabel={c.wiring.boxLabel} markerId={`wa-${page.id}`} />
              </figure>
              <div className="wire-col">
                <p className="small">
                  <Rich text={c.wiring.key} />
                </p>
                <div className="tablebox">
                  <table className="plain-t">
                    <thead>
                      <tr>
                        <th scope="col">{w.wiredFrom}</th>
                        <th scope="col">{w.wiredTo}</th>
                        <th scope="col">{w.wiredHow}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.wiring.links.map((l, i) => (
                        <tr key={i}>
                          <td>{nodeLabel[l.from]}</td>
                          <td>{nodeLabel[l.to]}</td>
                          <td>{l.how}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <p className="small muted">
        <Rich text={page.footerNote} />
      </p>
    </section>
  );
}

function PartsTable({ page, parts }: P & { parts: PartsList }) {
  const w = page.words;
  return (
    <div className="pblock">
      <h4 className="sub">{w.partsList}</h4>
      <p className="small muted">{fill(w.partsListSub, { date: parts.checkedOn })}</p>
      <div className="tablebox">
        <table className="plain-t parts-t">
          <thead>
            <tr>
              <th scope="col">{w.partsPart}</th>
              <th scope="col" className="num">
                {w.partsPrice}
              </th>
            </tr>
          </thead>
          <tbody>
            {parts.rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <span className="pn">{r.part}</span>
                  {r.has && <span className="pslot">{r.has}</span>}
                  {r.role && (
                    <span className="pslot">
                      <span className="vh">{w.partsRole}: </span>
                      {r.role}
                    </span>
                  )}
                </td>
                <td className="num">
                  {r.price}
                  {r.foot && <span aria-hidden="true">*</span>}
                  {r.est && <span className="est"> {w.est}</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{fill(w.partsTotal, { name: page.name })}</th>
              <td className="num">
                {parts.total}
                {parts.totalEst && <span className="est"> {w.est}</span>}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {parts.foot && <p className="small foot-note">* {parts.foot}</p>}
      <p className="small muted">{parts.note}</p>
    </div>
  );
}

function MeasurementsBlock({ page, meas }: P & { meas: Measurements }) {
  const w = page.words;
  return (
    <div className="pblock">
      <h4 className="sub">{w.measurements}</h4>
      <p className="small muted">{w.measurementsSub}</p>
      <p className="small">{meas.note}</p>
      <dl className="figs">
        {meas.figs.map((f) => (
          <div key={f.dt}>
            <dt>{f.dt}</dt>
            <dd>
              {f.dd}
              {f.est && <span className="est"> {f.est}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <h5>{w.levelsTitle}</h5>
      <div className="tablebox">
        <table className="plain-t meas">
          <thead>
            <tr>
              <th scope="col">{w.levelCol}</th>
              <th scope="col" className="num">
                {w.levelSizeCol}
              </th>
            </tr>
          </thead>
          <tbody>
            {meas.levels.map((lv, i) => (
              <tr key={i}>
                <td>
                  <span className="pn">
                    {i + 1}. {lv.name}
                  </span>
                  <span className="mnote">{lv.holds}</span>
                </td>
                <td className="num">
                  {lv.size}
                  <span className="mnote">{lv.sizeFrom}</span>
                  <span className="mnote">
                    {lv.top}, {lv.topFrom}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h5>{w.everySize}</h5>
      <p className="small">{meas.counts}</p>
      {meas.groups.map((g) => (
        <details className="meas-g" key={g.heading}>
          <summary>
            {g.heading} <span className="small muted">({g.rows.length})</span>
          </summary>
          <div className="tablebox">
            <table className="plain-t meas">
              <thead>
                <tr>
                  <th scope="col">{w.sizeCol}</th>
                  <th scope="col" className="num">
                    {w.valueCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <span className="pn">{r.name}</span>
                      {r.note && <span className="mnote">{r.note}</span>}
                    </td>
                    <td className="num">
                      {r.value} <span className={`pst src-${r.source.replace(/\s+/g, '-')}`}>{r.sourceWords}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}
