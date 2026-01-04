import { gameLoop } from '@/utilities/game';

const SIZE = 4;
const TAIL_MAX = 5;

export function setupSlashEffect(canvas, gameCanvas = null) {
  let ctx = canvas.getContext('2d');
  let path = [];
  let exiting = false;
  let tick = true;
  let isPaused = false;
  let isActive = false;
  let gameCanvasRef = gameCanvas;

  // Initialize with current mouse position or center of screen
  function initializePath() {
    const rect = canvas.getBoundingClientRect();
    // Use canvas-relative coordinates
    const initialX = window.mouseX ? window.mouseX - rect.left : canvas.width / 2;
    const initialY = window.mouseY ? window.mouseY - rect.top : canvas.height / 2;
    
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
    if (!isActive || isPaused) return;
    // Prevent default to stop scrolling and browser UI movement when game is active
    // Only prevent if touching the game canvas, not other elements like options
    if (gameCanvasRef && gameCanvasRef.style.display !== 'none') {
      const touch = e.targetTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      // Only prevent default if touching the game canvas or its children
      if (target && (target === gameCanvasRef || gameCanvasRef.contains(target))) {
        e.preventDefault();
      }
    }
    // Use clientX/clientY for consistent coordinates with canvas
    const rect = canvas.getBoundingClientRect();
    const newPoint = { 
      x: e.targetTouches[0].clientX - rect.left, 
      y: e.targetTouches[0].clientY - rect.top 
    };
    if (path.length > TAIL_MAX) path.shift();
    path = [newPoint, ...path];
    
    // Ensure we always have at least 2 points for drawing
    if (path.length === 1) {
      path.push({ ...newPoint });
    }
  }

  function addVector(e) {
    if (!isActive || isPaused) return;
    // Use clientX/clientY and account for canvas position
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Store mouse position globally for initialization (use client coordinates)
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
    
    const newPoint = { x: clientX, y: clientY };
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
    // Check exiting first to avoid any work
    if (exiting) return;
    if (isPaused || !isActive) return;
    
    if ((tick = !tick)) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    if (path.length > 1) drawSlice();
  }

  // Track if listeners are attached
  let listenersAttached = false;
  let touchStartHandler = null;

  function attachListeners() {
    if (!isActive || listenersAttached) return;
    document.addEventListener('mousemove', addVector);
    // Remove passive: true to allow preventDefault when game is active
    document.addEventListener('touchmove', addVectorTouch, { passive: false });
    // Store touchstart handler reference for cleanup
    touchStartHandler = (e) => {
      // Prevent default touchstart when game is active, but only for touches on the game canvas
      if (gameCanvasRef && gameCanvasRef.style.display !== 'none') {
        const touch = e.touches[0];
        if (touch) {
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          // Only prevent default if touching the game canvas or its children
          if (target && (target === gameCanvasRef || gameCanvasRef.contains(target))) {
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('touchstart', touchStartHandler, { passive: false });
    listenersAttached = true;
  }

  function detachListeners() {
    if (!listenersAttached) return;
    document.removeEventListener('mousemove', addVector);
    document.removeEventListener('touchmove', addVectorTouch);
    if (touchStartHandler) {
      document.removeEventListener('touchstart', touchStartHandler);
      touchStartHandler = null;
    }
    listenersAttached = false;
  }

  const { start, stop } = gameLoop(gameTick, () => (exiting = true));
  const loopControl = { start, stop };
  
  // Start automatically when created
  isActive = true;
  isPaused = false;
  attachListeners();
  start();

  return {
    setGameCanvas(newGameCanvas) {
      gameCanvasRef = newGameCanvas;
    },
    pause() {
      isPaused = true;
      isActive = false;
      detachListeners();
      // Stop the game loop to save CPU
      if (loopControl) {
        loopControl.stop();
      }
      // Clear canvas when paused
      const { clientWidth, clientHeight } = document.documentElement;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      ctx.clearRect(0, 0, clientWidth, clientHeight);
    },
    unpause() {
      isPaused = false;
      isActive = true;
      attachListeners();
      // Start the game loop
      if (loopControl) {
        loopControl.start();
      }
    },
    stop() {
      // Set exiting first to stop gameTick from doing any work
      exiting = true;
      isActive = false;
      isPaused = true;
      detachListeners();
      // Stop the game loop
      if (loopControl) {
        loopControl.stop();
      }
      // Clear canvas
      try {
        const { clientWidth, clientHeight } = document.documentElement;
        canvas.width = clientWidth;
        canvas.height = clientHeight;
        ctx.clearRect(0, 0, clientWidth, clientHeight);
      } catch (e) {
        // Canvas might be invalid, ignore
      }
    },
  };
}

