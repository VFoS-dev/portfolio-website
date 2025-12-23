import { gameLoop } from '@/utilities/game';
import { generateQueue, moveShape, newActiveShape, rotateShape, movePiece, canPieceMove, clearLines } from './tetris-utils';
import { fn } from '@/utilities/defaults';

export function tetrisSetup(game = { blocks: [], queue: [], hold: {} }, gameEnded = fn) {
  let randomPool = [];
  let currentShape = null;
  let setPeices = {};
  let gameActive = false;
  const bounds = { yMax: 23, xMax: 9, xMin: 0, yMin: 0, xMid: 4 };
  let heldShape = null;
  let tick = 500; // Slower tick for better gameplay
  let time = 0;
  let canHold = true;

  const { start, restart, stop } = gameLoop(deltaTime => {
    if (!gameActive) return;
    if ((time += deltaTime) < tick) return;
    time %= tick;

    if (!currentShape) {
      ({ currentShape, randomPool, gameActive } = newActiveShape(
        game,
        setPeices,
        randomPool,
        bounds
      ));
      canHold = true;
      if (!gameActive) {
        gameEnded();
        return;
      }
    } else {
      const result = moveShape(setPeices, currentShape, bounds);
      currentShape = result.currentShape;
      setPeices = result.setPeices;
      
      // Clear lines if piece was placed
      if (!currentShape) {
        const cleared = clearLines(setPeices, bounds);
        setPeices = cleared.setPeices;
        // Force immediate update after clearing
        const clearedBlocks = Object.values(setPeices).flat();
        game.blocks = clearedBlocks.length > 0 ? [...clearedBlocks] : [];
        return; // Skip the general update below since we just updated
      }
    }

    // Update display - create new array to ensure reactivity
    const allBlocks = currentShape 
      ? [...currentShape, ...Object.values(setPeices).flat()] 
      : [...Object.values(setPeices).flat()];
    game.blocks = allBlocks;
  });

  function handleKeyPress(e) {
    if (!gameActive || !currentShape) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        currentShape = movePiece(currentShape, setPeices, bounds, -1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        currentShape = movePiece(currentShape, setPeices, bounds, 1, 0);
        break;
      case 'ArrowDown':
      case 's':
      case 'S': {
        e.preventDefault();
        const result = moveShape(setPeices, currentShape, bounds);
        currentShape = result.currentShape;
        setPeices = result.setPeices;
        if (!currentShape) {
          const cleared = clearLines(setPeices, bounds);
          setPeices = cleared.setPeices;
          // Update display immediately after clearing - create new array
          game.blocks = [...Object.values(setPeices).flat()];
        } else {
          // Update display
          game.blocks = [...currentShape, ...Object.values(setPeices).flat()];
        }
        time = tick; // Force next tick
        break;
      }
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        currentShape = rotateShape(currentShape, setPeices, bounds);
        break;
      case ' ': {
        e.preventDefault();
        // Hard drop
        while (currentShape && canPieceMove(currentShape, setPeices, bounds, 0, 1)) {
          currentShape.forEach(block => block.y++);
        }
        const dropResult = moveShape(setPeices, currentShape, bounds);
        currentShape = dropResult.currentShape;
        setPeices = dropResult.setPeices;
        if (!currentShape) {
          const cleared = clearLines(setPeices, bounds);
          setPeices = cleared.setPeices;
          // Update display immediately after clearing - create new array
          game.blocks = [...Object.values(setPeices).flat()];
        } else {
          // Update display
          game.blocks = [...currentShape, ...Object.values(setPeices).flat()];
        }
        time = tick;
        break;
      }
      case 'c':
      case 'C':
        e.preventDefault();
        // Hold piece
        if (canHold && currentShape && currentShape.length > 0) {
          const shapeType = currentShape[0]?.item;
          if (shapeType) {
            if (heldShape) {
              // Swap
              const temp = { ...heldShape };
              heldShape = { item: shapeType, color: currentShape[0].color };
              currentShape = null;
              // Place held shape next
              const newShape = newActiveShape(game, setPeices, randomPool, bounds, temp.item);
              currentShape = newShape.currentShape;
              randomPool = newShape.randomPool;
            } else {
              heldShape = { item: shapeType, color: currentShape[0].color };
              currentShape = null;
            }
            canHold = false;
            game.hold = heldShape;
            // Update display
            const allBlocks = currentShape ? [...currentShape, ...Object.values(setPeices).flat()] : Object.values(setPeices).flat();
            game.blocks = allBlocks;
          }
        }
        break;
    }

    // Update display
    const allBlocks = currentShape ? [...currentShape, ...Object.values(setPeices).flat()] : Object.values(setPeices).flat();
    game.blocks = allBlocks;
  }

  function play() {
    randomPool = generateQueue(game);
    currentShape = null;
    heldShape = null;
    gameActive = true;
    setPeices = {};
    game.blocks = [];
    game.hold = { item: '', color: '' };
    time = 0;
    canHold = true;
  }

  window.addEventListener('keydown', handleKeyPress);

  return {
    start,
    pause: stop,
    unpause: restart,
    unmount: () => {
      stop();
      window.removeEventListener('keydown', handleKeyPress);
    },
    play,
  };
}

