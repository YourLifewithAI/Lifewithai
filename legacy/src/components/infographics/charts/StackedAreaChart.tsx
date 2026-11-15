'use client';

import { Line } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import './ChartRegistry';
import { CHART_COLORS } from './ChartRegistry';
import type { GenesisProjectionYear } from '@/lib/types';

interface StackedAreaChartProps {
  projections: GenesisProjectionYear[];
}

export default function StackedAreaChart({ projections }: StackedAreaChartProps) {
  const data = {
    labels: projections.map((p) => p.year),
    datasets: [
      {
        label: 'Coal & Unmitigated Gas',
        data: projections.map((p) => p.coalAndGas),
        borderColor: '#6b6b7b',
        backgroundColor: 'rgba(107, 107, 123, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Advanced Nuclear',
        data: projections.map((p) => p.nuclear),
        borderColor: '#48CAE4',
        backgroundColor: 'rgba(72, 202, 228, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Renewables (Solar/Wind/Hydro)',
        data: projections.map((p) => p.renewables),
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Natural Gas (with CCS)',
        data: projections.map((p) => p.naturalGasCCS),
        borderColor: '#F4A261',
        backgroundColor: 'rgba(244, 162, 97, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Percentage of Grid Mix (%)', color: CHART_COLORS.tickColor },
        grid: { color: CHART_COLORS.gridColor },
        ticks: { color: CHART_COLORS.tickColor },
      },
      x: {
        grid: { display: false },
        ticks: { color: CHART_COLORS.tickColor, font: { weight: 'bold' as const } },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          color: CHART_COLORS.tickColor,
        },
      },
      tooltip: {
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        borderWidth: 1,
        titleColor: CHART_COLORS.tooltipText,
        bodyColor: CHART_COLORS.tooltipText,
        padding: 12,
        callbacks: {
          label: (context: TooltipItem<'line'>) =>
            ` ${context.dataset.label || ''}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}
