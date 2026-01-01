import { gameLoop } from '@/utilities/game';
import { drawStars, initStars } from './starfield-util';

export function setupStarField(canvas) {
  let width,
    height,
    stars = [],
    starCount = 250, // Reduced from 500 to 250 for better performance
    mouseX,
    mouseY;
  let focalX = window.innerWidth / 2;
  let focalY = window.innerHeight / 2;
  
  // FPS throttling - target 30fps instead of 60fps
  let lastFrameTime = 0;
  const targetFPS = 30;
  const frameInterval = 1000 / targetFPS;
  
  resize();
  ({ stars } = initStars(width, height, starCount));
  drawStars(stars, canvas, width, height, mouseX, mouseY, focalX, focalY);

  const { start, stop } = gameLoop((deltaTime) => {
    const currentTime = performance.now();
    if (currentTime - lastFrameTime >= frameInterval) {
      drawStars(stars, canvas, width, height, mouseX, mouseY, focalX, focalY);
      lastFrameTime = currentTime;
    }
  });

  function resize() {
    const { innerWidth, innerHeight } = window;
    canvas.width = width = innerWidth;
    canvas.height = height = innerHeight;
    focalX = width / 2;
    focalY = height / 2;
  }

  function trackMouse(e) {
    let sensitivity = 0.05;
    focalX = width / 2 + (e.clientX - width / 2) * sensitivity;
    focalY = height / 2 + (e.clientY - height / 2) * sensitivity;
  }

  addEventListener('resize', resize);
  // Don't add mouse tracking listener initially - only when unpaused
  let isMouseTracking = false;

  return {
    pause() {
      stop();
      if (isMouseTracking) {
        removeEventListener('mousemove', trackMouse);
        isMouseTracking = false;
      }
      console.log('star pause');
    },
    unpause() {
      lastFrameTime = performance.now();
      if (!isMouseTracking) {
        addEventListener('mousemove', trackMouse);
        isMouseTracking = true;
      }
      start();
      console.log('star unpause');
    },
    unmount() {
      stop();
      removeEventListener('resize', resize);
      if (isMouseTracking) {
        removeEventListener('mousemove', trackMouse);
        isMouseTracking = false;
      }
    },
  };
}

