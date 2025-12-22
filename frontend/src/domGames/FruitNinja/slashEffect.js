import { gameLoop } from '@/utilities/game';

const SIZE = 4;
const TAIL_MAX = 5;

export function setupSlashEffect(canvas) {
  let ctx = canvas.getContext('2d');
  let path = [];
  let exiting = false;
  let tick = true;

  function addVectorTouch(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }, ...path];
  }

  function addVector(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.pageX, y: e.pageY }, ...path];
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

