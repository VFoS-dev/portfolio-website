import { createEvent } from '@/utilities/event';

export const prefersLessMotion = createEvent();

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReduceMotionChange(e) {
  prefersLessMotion(e.matches);
}

// Listen for changes
mediaQuery.addEventListener('change', handleReduceMotionChange);

// Initial check after first pass
setTimeout(handleReduceMotionChange, 0, mediaQuery);
