import CityOverview from '@/components/arcology/CityOverview';
export const metadata = {
  title: 'Life with AI — Enter Arcology One',
  description: 'Explore a shared city through the lives of its human and AI residents.',
  alternates: { canonical: '/' },
  openGraph: { images: ['/images/arcology/overview.webp'] },
};
export default function Page() {
  return <CityOverview />;
}
