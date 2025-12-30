import { fn } from '@/utilities/defaults';
import { gameLoop } from '@/utilities/game';
import sUtil from './snake-util';

export function snakeGameSetup(canvas, gameEnded = fn) {
  let tickDelay = 500;
  let loopEnded = true;
  let isPlayer = false;
  let alive = false;
  let snakeColors = ['green', 'gold', -1];
  const player = sUtil.inputPlayer();
  const aiPlayer = sUtil.inputPlayer();
  let update, board, cellSize, sizeRem, botDelay, aiDelay;
  let hamiltonianCycle = null;
  let isGeneratingCycle = false;
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
        ({ update, board, alive, tickDelay } = sUtil.movePlayer(aiPlayer, board, true));
      }

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
    
    const nextDir = sUtil.getNextDirectionFromPath(
      hamiltonianCycle,
      head,
      null, // food position will be found in the function
      board,
      segments.length + 1
    );
    
    aiPlayer.direction(nextDir, false);
  }

  function gameStart(isBot = false) {
    // Stop any ongoing game
    stop();
    isPlayer = !isBot;
    if (botDelay) botDelay = clearTimeout(botDelay);
    if (aiDelay) aiDelay = clearTimeout(aiDelay);
    
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
        // If AI was playing, restart it
        startAI();
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

