import { createEvent } from '@/utilities/event';
import { useCubeStore } from '@/stores/cubeStore';

export const prefersLessMotion = createEvent();

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReduceMotionChange(e) {
  prefersLessMotion(e.matches);
}

// Listen for changes
mediaQuery.addEventListener('change', handleReduceMotionChange);

// Initial check after first pass
const cubeStore = useCubeStore();
setTimeout(handleReduceMotionChange, 0, mediaQuery);
prefersLessMotion.subscribe(cubeStore.reducedMotion);
