import type { Metadata } from 'next';
import { pieceById } from '@/lib/pieces';
import { pageMeta } from '@/lib/meta';
import { asherPage } from '@/content/asher';
import model from '@/content/asher.model.json';
import asherSide from '@/content/photos/asher-side.jpg';
import { loadProject, type Model } from '@/lib/project-model';
import { Arc, CanDo, Core, DrawingSheet, Journal, Receipt, TitleSheet, WhatRunsWhere } from '@/components/site/project/ProjectSheets';

export function generateMetadata(): Metadata {
  return pageMeta({ title: asherPage().name, description: pieceById('asher')!.hook, path: '/projects/asher' });
}

export default function AsherPage() {
  // The words (words/projects/asher.md and asher-drawing.md) and the model meet here, when the page is built: the reader's browser gets the
  // finished drawing data.
  const page = asherPage();
  const built = loadProject(model as unknown as Model, page);
  return (
    <article className="pp">
      <TitleSheet page={page} photo={asherSide} />
      <DrawingSheet page={page} drawing={built.drawing} />
      <WhatRunsWhere page={page} />
      <CanDo page={page} />
      <Arc page={page} />
      <Journal page={page} />
      <Receipt page={page} />
      <Core page={page} parts={built.parts} meas={built.measurements} />
    </article>
  );
}
