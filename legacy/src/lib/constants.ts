// ============================================================
// Arcology Knowledge Node — Constants
// ============================================================

import type { Domain } from './types';

export const DOMAIN_COLORS: Record<Domain, string> = {
  'structural-engineering': '#E63946',
  'energy-systems': '#F4A261',
  'environmental-systems': '#2A9D8F',
  'mechanical-electrical': '#457B9D',
  'ai-compute-infrastructure': '#7B2CBF',
  'institutional-design': '#E9C46A',
  'construction-logistics': '#E76F51',
  'urban-design-livability': '#48CAE4',
};

export const DOMAIN_NAMES: Record<Domain, string> = {
  'structural-engineering': 'Structural Engineering',
  'energy-systems': 'Energy Systems',
  'environmental-systems': 'Environmental Systems',
  'mechanical-electrical': 'Mechanical & Electrical',
  'ai-compute-infrastructure': 'AI & Compute Infrastructure',
  'institutional-design': 'Institutional Design',
  'construction-logistics': 'Construction & Logistics',
  'urban-design-livability': 'Urban Design & Livability',
};

export const DOMAIN_ICONS: Record<Domain, string> = {
  'structural-engineering': 'building',
  'energy-systems': 'zap',
  'environmental-systems': 'leaf',
  'mechanical-electrical': 'settings',
  'ai-compute-infrastructure': 'cpu',
  'institutional-design': 'scale',
  'construction-logistics': 'hard-hat',
  'urban-design-livability': 'home',
};

export const SITE_NAME = 'Life with AI';
export const SITE_DESCRIPTION = 'Speculative fiction and collaborative engineering for human-AI futures.';
export const SITE_URL = 'https://lifewithai.ai';
