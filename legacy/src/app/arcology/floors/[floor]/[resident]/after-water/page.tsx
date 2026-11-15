import type { Metadata } from 'next';
import { ResidentPage } from '@/components/arcology/ResidentPage';
export const metadata: Metadata = {
  title: 'Floor 318 — After Water',
  description: 'Return to the atrium after reading Water. Contains story spoilers.',
  robots: { index: false, follow: true },
  openGraph: { images: ['/images/arcology/318-garden-storybook.webp'] },
};
export function generateStaticParams() {
  return ['mel', 'pell'].map((resident) => ({ floor: '318', resident }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ floor: string; resident: string }>;
}) {
  return <ResidentPage {...await params} moment="after-water" />;
}
