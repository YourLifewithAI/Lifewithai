'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartRegistry';
import { CHART_COLORS } from './ChartRegistry';
import type { GenesisRegionalData } from '@/lib/types';

interface BarChartProps {
  regions: GenesisRegionalData[];
}

export default function RegionalBarChart({ regions }: BarChartProps) {
  const [metric, setMetric] = useState<'funding' | 'projects'>('funding');

  const data = {
    labels: regions.map((r) => r.region),
    datasets: [
      {
        label: metric === 'funding' ? 'Funding Allocated ($ Billions)' : 'Active Projects',
        data: regions.map((r) => (metric === 'funding' ? r.funding : r.projects)),
        backgroundColor: metric === 'funding' ? '#48CAE4' : '#2A9D8F',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: CHART_COLORS.gridColor },
        ticks: { color: CHART_COLORS.tickColor },
      },
      x: {
        grid: { display: false },
        ticks: { color: CHART_COLORS.tickColor, font: { weight: 'bold' as const } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        borderWidth: 1,
        titleColor: CHART_COLORS.tooltipText,
        bodyColor: CHART_COLORS.tooltipText,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 12,
      },
    },
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as 'funding' | 'projects')}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground outline-none focus:border-accent"
        >
          <option value="funding">View Funding ($ Billions)</option>
          <option value="projects">View Active Projects</option>
        </select>
      </div>
      <div className="h-[350px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
