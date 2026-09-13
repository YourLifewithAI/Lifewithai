import { notFound } from 'next/navigation';
import SceneExplorer from './SceneExplorer';
import { isResident, residents, sceneFor, type SceneMoment } from '@/lib/arcology-world';
export function ResidentPage({
  floor,
  resident,
  moment = 'intro',
}: {
  floor: string;
  resident: string;
  moment?: SceneMoment;
}) {
  if (floor !== '318' || !isResident(resident)) notFound();
  return (
    <SceneExplorer
      key={`${resident}-${moment}`}
      resident={residents[resident]}
      after={moment === 'after-water'}
      {...sceneFor(moment)}
    />
  );
}
