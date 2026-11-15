'use client';

import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import './ChartRegistry';
import { CHART_COLORS } from './ChartRegistry';
import type { GenesisBudgetCategory } from '@/lib/types';

interface DonutChartProps {
  categories: GenesisBudgetCategory[];
}

export default function DonutChart({ categories }: DonutChartProps) {
  const [selected, setSelected] = useState<GenesisBudgetCategory | null>(null);

  const data = {
    labels: categories.map((c) => c.category),
    datasets: [
      {
        data: categories.map((c) => c.percentage),
        backgroundColor: categories.map((c) => c.color),
        borderWidth: 2,
        borderColor: '#141419',
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: CHART_COLORS.tickColor,
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
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
          label: (context: TooltipItem<'doughnut'>) =>
            ` ${context.label}: ${context.raw}% ($${(((context.raw as number) / 100) * 50).toFixed(1)}B)`,
        },
      },
    },
    onClick: (_e: unknown, activeElements: Array<{ index: number }>) => {
      if (activeElements.length > 0) {
        setSelected(categories[activeElements[0].index]);
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="w-full h-[350px]">
        <Doughnut data={data} options={options} />
      </div>

      <div className="rounded-xl border border-border bg-background p-6 min-h-[200px] flex flex-col justify-center">
        {selected ? (
          <>
            <div className="text-3xl mb-3">{selected.icon}</div>
            <div className="uppercase tracking-wide text-xs font-bold text-muted mb-1">
              Allocation: {selected.amount}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{selected.category}</h3>
            <p className="text-muted leading-relaxed">{selected.description}</p>
          </>
        ) : (
          <>
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Select a Category</h3>
            <p className="text-muted">
              Click on the donut chart to view detailed information about each funding category.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
