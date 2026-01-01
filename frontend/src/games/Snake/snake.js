import { fn } from '@/utilities/defaults';
import { gameLoop } from '@/utilities/game';
import sUtil from './snake-util';
import { cubeStore } from '@/stores/cubeStore';

export function snakeGameSetup(canvas, gameEnded = fn) {
  let tickDelay = 500;
  let loopEnded = true;
  let isPlayer = false;
  let alive = false;
  
  // Cache snake colors and only update when navigation history changes
  let snakeColors = cubeStore.getSnakeColors;
  let lastHistoryLength = cubeStore.getHistoryLength;
  
  const updateSnakeColors = () => {
    const currentLength = cubeStore.getHistoryLength;
    // Only update if navigation history actually changed
    if (currentLength !== lastHistoryLength) {
      snakeColors = cubeStore.getSnakeColors;
      lastHistoryLength = currentLength;
    }
  };
  const player = sUtil.inputPlayer();
  const aiPlayer = sUtil.inputPlayer();
  let update, board, cellSize, sizeRem, botDelay, aiDelay;
  let hamiltonianCycle = null;
  let isGeneratingCycle = false;
  // Track progress to detect unproductive loops
  let lastFoodPos = null;
  let lastDistanceToFood = null;
  let movesWithoutProgress = 0;
  // Backtracking state tracking
  let backtrackState = {
    isBacktracking: false,
    backtrackMovesRemaining: 0,
    recentDecisions: [], // Track recent path decisions
    deadEndDetected: false,
    lastSafePosition: null,
    consecutiveDeadEnds: 0
  };
  ({ update, board, cellSize, sizeRem } = sUtil.generateBoard(canvas));
  
  // Generate initial Hamiltonian cycle
  generateHamiltonianPath();

  const { start, restart, stop } = gameLoop(
    deltaTime => {
      tickDelay -= deltaTime;

      if (tickDelay > 0) return;

      if (isPlayer) {
        ({ update, board, alive, tickDelay } = sUtil.movePlayer(player, board, false));
      } else {
        // AI player
        updateAI();
        const result = sUtil.movePlayer(aiPlayer, board, true);
        update = result.update;
        board = result.board;
        alive = result.alive;
        tickDelay = result.tickDelay;
        
        // Track progress toward food
        if (alive) {
          const { head } = aiPlayer.getSnake();
          let foodPos = null;
          for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[0].length; y++) {
              if (board[x][y] === sUtil.BOARD_STATES.food) {
                foodPos = [x, y];
                break;
              }
            }
            if (foodPos) break;
          }
          
          if (foodPos) {
            const currentDistance = Math.abs(head.x - foodPos[0]) + Math.abs(head.y - foodPos[1]);
            
            // Check if food position changed (new food spawned)
            if (!lastFoodPos || lastFoodPos[0] !== foodPos[0] || lastFoodPos[1] !== foodPos[1]) {
              lastFoodPos = foodPos;
              lastDistanceToFood = currentDistance;
              movesWithoutProgress = 0;
            } else if (lastDistanceToFood !== null) {
              // Check if we're making progress
              if (currentDistance < lastDistanceToFood) {
                // Making progress - reset counter
                movesWithoutProgress = 0;
                lastDistanceToFood = currentDistance;
              } else {
                // No progress or getting further away
                movesWithoutProgress++;
                lastDistanceToFood = currentDistance;
              }
            } else {
              lastDistanceToFood = currentDistance;
            }
          }
        }
      }

      // Update snake colors from navigation history (only if it changed)
      updateSnakeColors();
      
      // draw changed
      update = sUtil.drawUpdated(canvas, board, update, cellSize, sizeRem, snakeColors);

      if (alive) return;

      // player has died
      stop();
      
      if (isPlayer) {
        // Player game ended - restart AI after 5 seconds
        gameEnded();
        restartBot(5000);
      } else {
        // AI game ended - restart immediately
        restartBot(1000);
      }
    },
    () => (loopEnded = true)
  );

  function generateHamiltonianPath() {
    if (isGeneratingCycle) return;
    isGeneratingCycle = true;
    
    // Generate path - use setTimeout for large boards to prevent freezing
    const boardSize = board.length * board[0].length;
    if (boardSize > 500) {
      // For large boards, generate asynchronously
      setTimeout(() => {
        hamiltonianCycle = sUtil.generateHamiltonianCycle(board.length, board[0].length, () => {
          isGeneratingCycle = false;
        });
      }, 0);
    } else {
      // For small boards, generate synchronously
      hamiltonianCycle = sUtil.generateHamiltonianCycle(board.length, board[0].length, () => {
        isGeneratingCycle = false;
      });
      isGeneratingCycle = false;
    }
  }

  function updateAI() {
    if (!hamiltonianCycle || isGeneratingCycle) {
      // If cycle not ready, use default direction
      if (hamiltonianCycle) {
        const { head } = aiPlayer.getSnake();
        if (hamiltonianCycle[head.x] && hamiltonianCycle[head.x][head.y]) {
          const defaultDir = hamiltonianCycle[head.x][head.y].dir || '+x';
          aiPlayer.direction(defaultDir, false);
        }
      }
      return;
    }
    
    const { head, segments } = aiPlayer.getSnake();
    
    // Check if cycle is ready
    if (!hamiltonianCycle[head.x] || !hamiltonianCycle[head.x][head.y] || 
        typeof hamiltonianCycle[head.x][head.y].index === 'undefined') {
      // Cycle not fully generated, use direction from cycle if available
      const defaultDir = hamiltonianCycle[head.x]?.[head.y]?.dir || '+x';
      aiPlayer.direction(defaultDir, false);
      return;
    }
    
    const pathResult = sUtil.getNextDirectionFromPath(
      hamiltonianCycle,
      head,
      segments,
      board,
      movesWithoutProgress, // Pass progress tracking
      backtrackState // Pass backtracking state
    );
    
    // Handle both object and string returns (backward compatibility)
    const result = typeof pathResult === 'string' 
      ? { direction: pathResult, backtrack: false }
      : pathResult;
    
    // Handle backtracking result
    if (result.backtrack) {
      // Dead end detected - initiate backtracking
      backtrackState.isBacktracking = true;
      backtrackState.backtrackMovesRemaining = Math.min(10, Math.max(3, segments.length / 3)); // Backtrack 3-10 moves
      backtrackState.consecutiveDeadEnds++;
      backtrackState.deadEndDetected = true;
      
      // Reset progress tracking to force Hamiltonian path
      movesWithoutProgress = 100; // Force Hamiltonian path following
      
      // Use Hamiltonian path direction as safe fallback
      const safeDir = hamiltonianCycle[head.x]?.[head.y]?.dir || '+x';
      aiPlayer.direction(safeDir, false);
    } else {
      // Normal path finding
      if (backtrackState.isBacktracking) {
        backtrackState.backtrackMovesRemaining--;
        if (backtrackState.backtrackMovesRemaining <= 0) {
          // Backtracking complete - reset state
          backtrackState.isBacktracking = false;
          backtrackState.consecutiveDeadEnds = 0;
          backtrackState.deadEndDetected = false;
          movesWithoutProgress = 0; // Reset progress tracking
        }
      }
      
      // Track recent decisions for backtracking analysis
      backtrackState.recentDecisions.push({
        direction: result.direction,
        head: { x: head.x, y: head.y },
        timestamp: Date.now()
      });
      
      // Keep only last 20 decisions
      if (backtrackState.recentDecisions.length > 20) {
        backtrackState.recentDecisions.shift();
      }
      
      aiPlayer.direction(result.direction, false);
    }
  }

      function gameStart(isBot = false) {
        // Stop any ongoing game
        stop();
        isPlayer = !isBot;
        if (botDelay) botDelay = clearTimeout(botDelay);
        if (aiDelay) aiDelay = clearTimeout(aiDelay);
        
        // Reset progress tracking
        lastFoodPos = null;
        lastDistanceToFood = null;
        movesWithoutProgress = 0;
        // Reset backtracking state
        backtrackState = {
          isBacktracking: false,
          backtrackMovesRemaining: 0,
          recentDecisions: [],
          deadEndDetected: false,
          lastSafePosition: null,
          consecutiveDeadEnds: 0
        };
        
        board = board.map(x => x.map(() => sUtil.BOARD_STATES.unset));

    // create snake
    const snake = sUtil.generateSnake(board);
    if (isPlayer) {
      player.setSnake(snake);
      player.direction('+x', true);
    } else {
      aiPlayer.setSnake(snake);
      aiPlayer.direction('+x', true);
    }

    ({ board } = sUtil.populateFood(board, isPlayer ? 5 : 1));

    // Update snake colors from navigation history before drawing
    updateSnakeColors();
    sUtil.fullDraw(canvas, board, cellSize, sizeRem, snakeColors);

    // start loop
    if (loopEnded) start();
    else restart();

    loopEnded = false;
    alive = true;
  }

  function updateDirection(e) {
    if (!isPlayer) return;

    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        return player.direction('-y');
      case 'ArrowDown':
      case 'KeyS':
        return player.direction('+y');
      case 'ArrowRight':
      case 'KeyD':
        return player.direction('+x');
      case 'ArrowLeft':
      case 'KeyA':
        return player.direction('-x');
      default:
        return;
    }
  }

  function restartBot(delay = 1000) {
    if (botDelay) botDelay = clearTimeout(botDelay);
    botDelay = setTimeout(() => {
      gameStart(true); // Start as bot
    }, delay);
  }

  function startAI() {
    if (isPlayer || alive) return; // Don't start AI if player is playing or already alive
    if (aiDelay) aiDelay = clearTimeout(aiDelay);
    gameStart(true); // Start as bot
  }

  function resumeAI() {
    if (isPlayer) return; // Don't resume AI if player is playing
    if (alive && !isPlayer) {
      // AI was playing and is still alive, just resume the game loop
      start();
    } else if (!isPlayer) {
      // AI was playing but died or never started, restart it
      startAI();
    }
  }

  function resized() {
    ({ update, board, cellSize, sizeRem } = sUtil.generateBoard(canvas));
    stop();
    alive = false;
    isPlayer = false;
    
    // Regenerate Hamiltonian path on resize
    generateHamiltonianPath();
    
    // If not in player mode, restart AI after a short delay
    if (!isPlayer) {
      if (aiDelay) aiDelay = clearTimeout(aiDelay);
      aiDelay = setTimeout(startAI, 500);
    }
    
    gameEnded();
  }

  addEventListener('resize', resized);
  addEventListener('keydown', updateDirection);

  return {
    updateDirection,
    gameStart,
    startAI,
    pause() {
      stop();
    },
    unpause() {
      if (isPlayer && alive) {
        start();
      } else if (!isPlayer) {
        // If AI was playing, resume it (or restart if it died)
        resumeAI();
      }
    },
    unmount() {
      stop();
      if (botDelay) botDelay = clearTimeout(botDelay);
      if (aiDelay) aiDelay = clearTimeout(aiDelay);
      removeEventListener('resize', resized);
      removeEventListener('keydown', updateDirection);
    },
  };
}

