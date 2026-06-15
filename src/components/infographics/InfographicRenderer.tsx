'use client';

import dynamic from 'next/dynamic';
import type { GenesisInfographicData, InfographicMeta } from '@/lib/types';

// Lazy-load chart-heavy components to avoid SSR issues with Chart.js
const GenesisMission = dynamic(() => import('./GenesisMission'), { ssr: false });
// Iframe embed of the standalone World Energy dashboard.
const WorldEnergyEmbed = dynamic(() => import('./WorldEnergyEmbed'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, React.ComponentType<{ data: any }>> = {
  'genesis-mission': GenesisMission as React.ComponentType<{ data: GenesisInfographicData }>,
  'world-energy': WorldEnergyEmbed,
};

interface InfographicRendererProps {
  data: { meta: InfographicMeta; [key: string]: unknown };
}

export default function InfographicRenderer({ data }: InfographicRendererProps) {
  const Component = COMPONENT_MAP[data.meta.componentId];

  if (!Component) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="text-muted">Unknown infographic type: {data.meta.componentId}</p>
      </div>
    );
  }

  return <Component data={data} />;
}
