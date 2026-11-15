import CityOverview from '@/components/arcology/CityOverview';
export const metadata = {
  title: 'Arcology One',
  description: 'Explore a shared city through the lives of its human and AI residents.',
  alternates: { canonical: '/arcology' },
  openGraph: { images: ['/images/arcology/overview-storybook.webp'] },
};
export default function Page() {
  return <CityOverview />;
}
