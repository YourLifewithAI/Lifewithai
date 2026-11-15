import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

export const CHART_COLORS = {
  tickColor: '#6b6b7b',
  gridColor: '#1e1e28',
  tooltipBg: '#1c1c24',
  tooltipBorder: '#2a2a35',
  tooltipText: '#e8e8ed',
};
