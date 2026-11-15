import type { Metadata } from 'next';
import { ResidentPage } from '@/components/arcology/ResidentPage';
import { isResident, residents, residentPath } from '@/lib/arcology-world';
type Props = { params: Promise<{ floor: string; resident: string }> };
export function generateStaticParams() {
  return ['mel', 'pell'].map((resident) => ({ floor: '318', resident }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { floor, resident } = await params;
  if (floor !== '318' || !isResident(resident)) return { title: 'Place not found' };
  return {
    title: `Meet ${residents[resident].name} on Floor 318`,
    description: residents[resident].introduction,
    alternates: { canonical: residentPath(resident) },
    openGraph: { images: ['/images/arcology/318-garden-storybook.webp'] },
  };
}
export default async function Page({ params }: Props) {
  return <ResidentPage {...await params} />;
}
