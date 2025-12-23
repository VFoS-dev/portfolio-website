import { gameLoop } from '@/utilities/game';

const SIZE = 4;
const TAIL_MAX = 5;

export function setupSlashEffect(canvas) {
  let ctx = canvas.getContext('2d');
  let path = [];
  let exiting = false;
  let tick = true;

  // Initialize with current mouse position or center of screen
  function initializePath() {
    const { clientWidth, clientHeight } = document.documentElement;
    const initialX = window.mouseX ?? clientWidth / 2;
    const initialY = window.mouseY ?? clientHeight / 2;
    
    // Start with at least 2 points (required for drawing) at the current/cursor position
    // Duplicate the point so there's always something to draw
    path = [
      { x: initialX, y: initialY },
      { x: initialX, y: initialY }
    ];
  }

  // Initialize path immediately
  initializePath();

  function addVectorTouch(e) {
    const newPoint = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    if (path.length > TAIL_MAX) path.shift();
    path = [newPoint, ...path];
    
    // Ensure we always have at least 2 points for drawing
    if (path.length === 1) {
      path.push({ ...newPoint });
    }
  }

  function addVector(e) {
    // Store mouse position globally for initialization
    window.mouseX = e.pageX;
    window.mouseY = e.pageY;
    
    const newPoint = { x: e.pageX, y: e.pageY };
    if (path.length > TAIL_MAX) path.shift();
    path = [newPoint, ...path];
    
    // Ensure we always have at least 2 points for drawing
    if (path.length === 1) {
      path.push({ ...newPoint });
    }
  }

  function drawSlice() {
    if (path.length < 2) return;
    
    const colors = ['#4d4d4d', '#6e6e6e', '#969696', '#ffffff'];
    ctx.lineJoin = 'round';

    const vector = [];

    let x = path[0].x;
    let y = path[0].y;

    path.forEach(function (v, index) {
      const { x: dx, y: dy } = path[index + 1] || path[0];

      v.x = x;
      v.y = y;

      vector.push({ x, y });

      x += (dx - v.x) * 0.6;
      y += (dy - v.y) * 0.6;
    });

    vector.reverse();

    colors.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';

      vector.forEach((set, vIndex, sets) => {
        ctx.beginPath();
        ctx.lineTo(set.x, set.y);
        if (vIndex) ctx.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
        ctx.lineWidth =
          SIZE + ((10 * (colors.length - index)) / colors.length) * 2 * ((vIndex + 1) / vector.length);
        ctx.stroke();
      });
    });
  }

  function gameTick() {
    if ((tick = !tick)) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    if (path.length > 1) drawSlice();
    if (exiting) {
      loopControl?.stop();
      return;
    }
  }

  // Set up event listeners
  document.onmousemove = addVector;
  document.ontouchmove = addVectorTouch;

  const { start, stop } = gameLoop(gameTick, () => (exiting = true));
  const loopControl = { start, stop };
  start();

  return {
    stop() {
      document.onmousemove = null;
      document.ontouchmove = null;
      exiting = true;
      if (loopControl) {
        loopControl.stop();
      }
    },
  };
}

