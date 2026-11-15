'use client';
// The drawing of a build: mounts the drawing engine on an empty element once the page is in the browser, and tears it
// down when the page goes. The model data and every word arrive as props, prepared when the page is built.
import { useEffect, useId, useRef } from 'react';
import type { DrawingData } from '@/lib/project-model';
import type { ProjectWords } from '@/lib/project';
import { mount } from './engine.js';
import './drawing.css';

export default function ProjectDrawing({ data, words }: { data: DrawingData; words: ProjectWords }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = 'pd' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const engine = mount(root, data, { words, id });
    return () => engine.destroy();
  }, [data, words, id]);
  // React owns the outer element; the engine owns everything inside the inner one.
  return (
    <div className="pd">
      <noscript>
        <p className="small">{words.noScript}</p>
      </noscript>
      <div ref={ref} className="pd-root" />
    </div>
  );
}
