import type { LivingLoopStep } from './types';

// Isolating the nutrient transfer must leave both local water circuits running.
export function availableLoopSteps(steps: LivingLoopStep[], transferPaused: boolean) {
  return steps.filter((step) => !(transferPaused && step.canIsolate));
}
