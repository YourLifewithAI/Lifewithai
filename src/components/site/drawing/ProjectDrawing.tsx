'use client';
// The drawing of a build: mounts the drawing engine on an empty element once the page is in the browser, and tears it
// down when the page goes. The model data and every word arrive as props, prepared when the page is built.
// aside: something the page shows with the drawing (a photo of the build). It sits beside the model on a wide screen and
// under it on a phone; drawing.css lays the engine's boxes and it out on one grid. So that the page reads in the order
// it shows (the model, the photo, then the part panel and the parts list), the engine fills two elements around the
// aside: the model before it, the panes after it.
import { useEffect, useId, useRef } from 'react';
import type { DrawingData } from '@/lib/project-model';
import type { ProjectWords } from '@/lib/project';
import { mount } from './engine.js';
import './drawing.css';

export default function ProjectDrawing({ data, words, aside }: { data: DrawingData; words: ProjectWords; aside?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const id = 'pd' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const hasAside = !!aside;
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const engine = mount(root, data, { words, id, after: hasAside ? after.current : null });
    return () => engine.destroy();
  }, [data, words, id, hasAside]);
  // React owns the outer element and the aside; the engine owns everything inside the inner ones.
  return (
    <div className={aside ? 'pd has-aside' : 'pd'}>
      <noscript>
        <p className="small">{words.noScript}</p>
      </noscript>
      <div ref={ref} className="pd-root" />
      {aside}
      {aside ? <div ref={after} className="pd-root" /> : null}
    </div>
  );
}
