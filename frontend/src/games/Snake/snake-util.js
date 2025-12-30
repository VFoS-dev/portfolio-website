import { inBounds } from '@/utilities/game';

export const CELLS = 34;
export const COLORS = {
  unset: '#151024',
  gold: '#f8df01',
  food: '#28d7eb',
  green: '#09ff00',
  red: '#f32222',
  white: '#ffffff',
};
export const BOARD_STATES = {
  unset: 'unset',
  food: 'food',
  snake: Number, // converted to a number on move
};

export const getColor = color => COLORS[color] ?? COLORS.unset;

export function generateBoard(canvas) {
  const { innerHeight, innerWidth } = window;
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const size =
    innerHeight > innerWidth
      ? {
          longer: innerHeight,
          shorter: innerWidth,
          x: 'shorter',
          y: 'longer',
          longerCount: 0,
          shorterCount: 0,
        }
      : {
          longer: innerWidth,
          shorter: innerHeight,
          x: 'longer',
          y: 'shorter',
          longerCount: 0,
          shorterCount: 0,
        };

  const cellSize = size.longer / CELLS;
  size.longerCount = CELLS;
  size.shorterCount = Math.max(2, Math.floor(size.shorter / cellSize));
  if (size.shorterCount % 2) size.shorterCount--;

  const sizeRem = {
    x: (size[`${size.x}Count`] * cellSize - size[`${size.x}`]) / 2,
    y: (size[`${size.y}Count`] * cellSize - size[`${size.y}`]) / 2,
  };

  const board = [];
  for (let x = 0; x < size[`${size.x}Count`]; x++) {
    board.push(new Array(size[`${size.y}Count`]).fill('unset'));
  }

  fullDraw(canvas, board, cellSize, sizeRem);

  return {
    board,
    cellSize,
    sizeRem,
    update: [],
  };
}

export function fullDraw(canvas, board, cellSize, sizeRem, snakeColors = ['green', 'gold', -1]) {
  const ctx = canvas.getContext('2d');
  const halfSize = cellSize / 2;
  board.forEach((col, ix) => {
    col.forEach((cell, iy) => {
      const x = ix * cellSize + halfSize - sizeRem.x;
      const y = iy * cellSize + halfSize - sizeRem.y;

      let color = getColor(cell);
      if (typeof cell === 'number') {
        if (
          (cell >= snakeColors.length && typeof snakeColors[snakeColors.length - 1] !== 'string') ||
          typeof snakeColors[cell % snakeColors.length] !== 'string'
        ) {
          color = getColor('white');
        } else {
          color = getColor(snakeColors[cell % snakeColors.length]);
        }
      }

      const gradient = color != getColor('unset') && color != getColor('white');

      drawCell(ctx, x, y, halfSize, cellSize, color, gradient);
    });
  });
}

export function drawUpdated(canvas, board, updated, cellSize, sizeRem, snakeColors) {
  const ctx = canvas.getContext('2d');
  const halfSize = cellSize / 2;
  for (const { x: ix, y: iy } of updated) {
    const x = ix * cellSize + halfSize - sizeRem.x;
    const y = iy * cellSize + halfSize - sizeRem.y;
    const cell = board[ix][iy];

    let color = getColor(cell);
    if (typeof cell === 'number') {
      if (
        (cell >= snakeColors.length && typeof snakeColors[snakeColors.length - 1] !== 'string') ||
        typeof snakeColors[cell % snakeColors.length] !== 'string'
      ) {
        color = getColor('white');
      } else {
        color = getColor(snakeColors[cell % snakeColors.length]);
      }
    }

    const gradient = color != getColor('unset') && color != getColor('white');

    drawCell(ctx, x, y, halfSize, cellSize, color, gradient);
  }

  return [];
}

export function drawCell(ctx, x, y, halfSize, cellSize, color, hasGradient) {
  // clear
  ctx.clearRect(x - halfSize, y - halfSize, cellSize, cellSize);

  // fill in gradient
  if (hasGradient) {
    const gradient = ctx.createRadialGradient(x, y, halfSize / 3, x, y, halfSize);
    gradient.addColorStop(0, color + '7E');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - cellSize, y - cellSize, x + cellSize, y + cellSize);
  }

  // fill initial cell
  ctx.beginPath();
  ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function dirToXY(_dir) {
  const [vel, dir] = _dir;
  const opp = { x: 'y', y: 'x' };
  const mag = { '+': 1, '-': -1 };

  return {
    [dir]: mag[vel],
    [opp[dir]]: 0,
  };
}

export function inputPlayer() {
  let dir = '+x';
  let head = { x: 1, y: 1 };
  let segments = [];

  return {
    direction(value, force = false) {
      if (!segments.length || force) return (dir = value);
      const { x: dx, y: dy } = dirToXY(value);
      const { x, y } = head;
      const { x: sx, y: sy } = segments[0];

      if (x + dx === sx && y + dy === sy) return;

      dir = value;
    },
    getDirection() {
      return dir;
    },
    snakeMoved(pos = { x: 0, y: 0 }, grow = false) {
      segments.unshift(head);
      head = pos;
      if (!grow) {
        segments.pop();
      }
    },
    setSnake({ head: h, segments: s = [] }) {
      head = h;
      segments = s;
    },
    getSnake() {
      return { head, segments };
    },
  };
}

export function generateSnake(board, length = 5) {
  const head = {
    x: Math.round(board.length / 2),
    y: Math.round(board[0].length / 2),
  };

  return {
    head,
    segments: [...new Array(length - 1)].fill(head),
  };
}

export function movePlayer(player, board, isAI = false) {
  const dead = { board, tickDelay: isAI ? 200 : 500, alive: false, update: [] };

  // get snake
  let head, x, y, segments, update;
  const { x: dx, y: dy } = dirToXY(player.getDirection());
  ({ head, segments } = player.getSnake());
  ({ x, y } = head);

  // out of bounds
  if (!inBounds({ x: dx + x, y: dy + y }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
    return dead;
  }

  // butt moved
  const { x: sx, y: sy } = segments[segments.length - 1];
  board[sx][sy] = BOARD_STATES.unset;

  // check spot
  const newPos = board[x + dx][y + dy];
  if (![BOARD_STATES.unset, BOARD_STATES.food].includes(newPos)) {
    return dead;
  }

  // update all positions of the snake
  update = [head, ...segments, { x: x + dx, y: y + dy }];

  const ateFood = BOARD_STATES.food === newPos;

  // move player
  player.snakeMoved({ x: x + dx, y: y + dy }, ateFood);
  ({ head, segments } = player.getSnake());
  
  // Calculate tick delay - AI is faster and gains speed faster
  const tickDelay = isAI 
    ? Math.max(50, 200 - 12 * (segments.length - 4))  // AI: much faster start (200ms), faster acceleration (12ms per segment), minimum 50ms
    : Math.max(125, 500 - 10 * (segments.length - 4)); // Player: normal speed (500ms start, 10ms per segment, minimum 125ms)

  if (ateFood) {
    let updates;
    ({ board, updates } = populateFood(board, 1));
    update = [...update, ...updates];
  }

  // update board state based on the players poition
  board[head.x][head.y] = 0;
  for (let i = 0; i < segments.length; i++) {
    const { x, y } = segments[i];
    board[x][y] = i + 1;
  }

  return {
    update,
    board,
    alive: true,
    tickDelay,
  };
}

export function populateFood(board, count = 0) {
  const possibleSpots = [];
  const updates = [];
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[0].length; y++) {
      const cell = board[x][y];
      // Only allow food placement on unset cells
      // Snake body is represented as numbers (0 for head, 1+ for segments), so they won't match BOARD_STATES.unset
      // This ensures food is never placed on the snake
      if (cell === BOARD_STATES.unset) {
        possibleSpots.push({ x, y });
      }
    }
  }

  for (var f = 0; f < count; f++) {
    if (!possibleSpots.length) break;
    const random = Math.floor(possibleSpots.length * Math.random());
    const [{ x, y }] = possibleSpots.splice(random, 1);
    // Double-check that the cell is still unset before placing food
    // This prevents race conditions if the snake moves while we're placing food
    if (board[x][y] === BOARD_STATES.unset) {
      board[x][y] = BOARD_STATES.food;
      updates.push({ x, y });
    }
  }

  return { board, updates };
}

// Direction mappings for Hamiltonian path
const MOVE_DIRECTIONS = {
  '+x': { dx: 1, dy: 0 },
  '-x': { dx: -1, dy: 0 },
  '+y': { dx: 0, dy: 1 },
  '-y': { dx: 0, dy: -1 },
};

// Convert direction string to move direction
function dirToMoveDir(dir) {
  return MOVE_DIRECTIONS[dir] || MOVE_DIRECTIONS['+x'];
}

// Generate Hamiltonian cycle - always synchronous but can be called with setTimeout for large boards
export function generateHamiltonianCycle(width, height, callback = null) {
  const result = generateHamiltonianCycleSync(width, height);
  if (callback) {
    // Call callback asynchronously to allow UI to update
    setTimeout(() => callback(1), 0);
  }
  return result;
}

// Synchronous version for immediate use (smaller boards)
export function generateHamiltonianCycleSync(width, height) {
  const temp = new Array(width).fill(false).map((_, x) =>
    new Array(height).fill(false).map((_, y) => {
      if (!x && !y) return { dir: '+y' };
      if (!y) return { dir: '-x' };
      if (y === 1 && x === width - 1) return { dir: '-y' };
      if (!(x % 2) && y === height - 1) return { dir: '+x' };
      if (x % 2 && y === height - 1) return { dir: '-y' };
      if (!(x % 2) && y === 1) return { dir: '+y' };
      if (x % 2 && y === 1) return { dir: '+x' };
      if (!x) return { dir: '+y' };
      if (!(x % 2)) return { dir: '+y' };
      if (x % 2) return { dir: '-y' };
    })
  );

  let x = 0;
  let y = 0;
  let index = 0;
  const boardSize = width * height;

  while (index < boardSize) {
    temp[x][y].index = index;
    index++;
    
    if (index >= boardSize) break;
    
    const next = dirToMoveDir(temp[x][y].dir);
    x = x + next.dx;
    y = y + next.dy;
  }

  // Apply random transformations
  let result = temp;
  
  if (Math.round(Math.random())) {
    result = result.map(t => t.reverse());
  }

  if (Math.round(Math.random())) {
    result = result.reverse();
    const swap = { '+x': '-x', '-x': '+x' };
    result = result.map(t => t.map(a => ({ ...a, dir: swap[a.dir] || a.dir })));
  }

  return result;
}

// Convert direction string to React-style direction
function dirToReactDir(dir) {
  const map = {
    '+x': 'right',
    '-x': 'left',
    '+y': 'bottom',
    '-y': 'top',
  };
  return map[dir] || 'right';
}

// Convert React-style direction to direction string
function reactDirToDir(reactDir) {
  const map = {
    'right': '+x',
    'left': '-x',
    'bottom': '+y',
    'top': '-y',
  };
  return map[reactDir] || '+x';
}

// React-style move directions
const REACT_MOVE = {
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
  top: { dx: 0, dy: -1 },
  bottom: { dx: 0, dy: 1 },
};

// Check path to food (React algorithm)
function checkPath(cycle, snakeHead, fruit, gamefield, callback = () => {}) {
  const { x: _x, y: _y } = snakeHead;
  const [fx, fy] = fruit;
  const boardSize = gamefield.length * gamefield[0].length;
  const headIndex = cycle[_x][_y].index;
  let fruitIndex = (cycle[fx][fy].index - headIndex) % boardSize;
  if (fruitIndex < 0) fruitIndex += boardSize;
  
  let closest = { index: 0, dir: dirToReactDir(cycle[_x][_y].dir) };
  
  Object.keys(REACT_MOVE).forEach(m => {
    const { dx, dy } = REACT_MOVE[m];
    const x = _x + dx;
    const y = _y + dy;
    
    try {
      const spotData = gamefield[x][y];
      if (spotData !== BOARD_STATES.unset && spotData !== BOARD_STATES.food) return;
    } catch {
      return;
    }

    if (!cycle[x] || !cycle[x][y] || typeof cycle[x][y].index === 'undefined') return;

    let dirIndex = (cycle[x][y].index - headIndex) % boardSize;
    if (dirIndex < 0) dirIndex += boardSize;
    
    if (callback({ fruitIndex, dirIndex, closeIndex: closest.index, dir: m })) {
      closest = {
        index: dirIndex,
        dir: m,
      };
    }
  });
  
  return closest;
}

// Count available cells recursively (React algorithm)
function countRecursive(cycle, _x, _y, gamefield = [], fruit, endif = 0, currentSet = new Set()) {
  currentSet.add(`${_x},${_y}`);
  if (currentSet.size < endif) {
    try {
      let closest = checkPath2(cycle, { x: _x, y: _y }, fruit, gamefield, currentSet,
        ({ fruitIndex, dirIndex, closeIndex }) => fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));
      if (!closest.index) {
        closest = checkPath2(cycle, { x: _x, y: _y }, fruit, gamefield, currentSet,
          ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
      }

      const { dx, dy } = REACT_MOVE[closest.dir];
      let x = _x + dx;
      let y = _y + dy;

      switch (gamefield[x][y]) {
        case BOARD_STATES.food:
          if (!currentSet.has(`${x},${y}`)) endif++;
          // fall through
        case BOARD_STATES.unset:
          if (!currentSet.has(`${x},${y}`) && gamefield[x][y] === BOARD_STATES.unset) {
            currentSet = new Set([...currentSet, ...countRecursive(cycle, x, y, gamefield, fruit, endif, currentSet)]);
          }
          break;
        default:
          break;
      }
    } catch {
      return currentSet;
    }
  }
  return currentSet;
}

// Check path 2 (React algorithm)
function checkPath2(cycle, snakeHead, fruit, gamefield, currentSet, callback = () => {}) {
  const { x: _x, y: _y } = snakeHead;
  const [fx, fy] = fruit;
  const boardSize = gamefield.length * gamefield[0].length;
  const headIndex = cycle[_x][_y].index;
  let fruitIndex = (cycle[fx][fy].index - headIndex) % boardSize;
  if (fruitIndex < 0) fruitIndex += boardSize;
  
  let closest = { index: 0, dir: dirToReactDir(cycle[_x][_y].dir) };
  
  Object.keys(REACT_MOVE).forEach(m => {
    const { dx, dy } = REACT_MOVE[m];
    const x = _x + dx;
    const y = _y + dy;
    
    try {
      const spotData = gamefield[x][y];
      if (spotData !== BOARD_STATES.unset && spotData !== BOARD_STATES.food || !currentSet.has(`${x},${y}`)) return;
    } catch {
      return;
    }

    if (!cycle[x] || !cycle[x][y] || typeof cycle[x][y].index === 'undefined') return;

    let dirIndex = (cycle[x][y].index - headIndex) % boardSize;
    if (dirIndex < 0) dirIndex += boardSize;
    
    if (callback({ fruitIndex, dirIndex, closeIndex: closest.index })) {
      closest = {
        index: dirIndex,
        dir: m,
      };
    }
  });
  
  return closest;
}

// Count available cells in each direction (React algorithm)
function countAvailable(cycle, snake, fruit, gamefield) {
  const { head: { x: _x, y: _y }, segments } = snake;
  let mustHave = segments.length + 5;
  let dir = { max: { count: 0 } };
  
  Object.keys(REACT_MOVE).forEach(m => {
    const { dx, dy } = REACT_MOVE[m];
    let x = _x + dx;
    let y = _y + dy;
    let set = new Set([`${_x},${_y}`, `${x},${y}`, ...segments.map(({ x, y }) => `${x},${y}`)]);
    
    if (x < 0 || x >= gamefield.length || y < 0 || y >= gamefield[0].length || 
        (gamefield[x][y] !== BOARD_STATES.unset && gamefield[x][y] !== BOARD_STATES.food)) {
      return dir[m] = 0;
    }
    
    dir[m] = countRecursive(cycle, x, y, gamefield, fruit, mustHave, set).size - 1;
    if (dir.max.count < dir[m]) dir.max = { count: dir[m], dir: m };
  });
  
  return dir;
}

// Check if a move would create a deadly loop (immediate death check - must be strict)
function wouldCreateDeadlyLoop(cycle, head, segments, direction, board, snakeLength) {
  const { dx, dy } = REACT_MOVE[direction];
  const nextX = head.x + dx;
  const nextY = head.y + dy;
  
  // Check bounds - out of bounds is always deadly
  if (!inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
    return true; // Out of bounds = deadly
  }
  
  const cellState = board[nextX][nextY];
  
  // Check if it's food - that's safe (snake will grow)
  if (cellState === BOARD_STATES.food) {
    return false; // Food is safe
  }
  
  // Check if it's unset - that's safe
  if (cellState === BOARD_STATES.unset) {
    return false; // Empty cell is safe
  }
  
  // If it's a number, it's part of the snake body
  if (typeof cellState === 'number') {
    // The tail segment (index = snakeLength - 1) will move forward, so it will be free
    // Only segments with index < snakeLength - 1 are deadly (they won't move)
    if (cellState < snakeLength - 1) {
      return true; // Blocked by body that won't move = deadly
    }
    // If cellState >= snakeLength - 1, it's the tail which will move, so it's safe
    return false;
  }
  
  // Any other state is considered blocked/deadly
  return true;
}

// Check if a greedy move would trap the snake in an inescapable loop
function wouldTrapInLoop(cycle, head, segments, direction, foodPos, board, snakeLength) {
  const { dx, dy } = REACT_MOVE[direction];
  const nextX = head.x + dx;
  const nextY = head.y + dy;
  
  // Check bounds
  if (!inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
    return true; // Out of bounds = trap
  }
  
  const cellState = board[nextX][nextY];
  
  // If it's blocked by body (not tail), it's a trap
  if (typeof cellState === 'number' && cellState < snakeLength - 1) {
    return true;
  }
  
  // Check if we're eating food (snake will grow)
  const willEatFood = nextX === foodPos[0] && nextY === foodPos[1];
  const newSnakeLength = willEatFood ? snakeLength + 1 : snakeLength;
  
  // Simulate the snake at the new position
  // Create a new snake object with the head at the next position
  const newSnake = {
    head: { x: nextX, y: nextY },
    segments: segments.map((seg, i) => ({ x: seg.x, y: seg.y }))
  };
  
  // Only check for traps for longer snakes - shorter snakes can be more adventurous
  // For very short snakes, rely on lookAheadSafe instead
  if (snakeLength < 15) {
    return false; // Let small snakes be more natural
  }
  
  // Count available space from the new position
  // We need to check if there's enough space for the snake to escape
  const newCounts = countAvailable(cycle, newSnake, foodPos, board);
  
  // Check if any direction has enough accessible space
  // Be more lenient - only require enough space for the snake to continue, not a huge buffer
  // For longer snakes, be more strict; for medium snakes, be lenient
  const minRequiredSpace = snakeLength > 50 
    ? newSnakeLength + 2  // Very long snakes need more buffer
    : Math.max(newSnakeLength * 0.5, 5); // Medium snakes need less - allow more natural movement
  
  const hasEnoughSpace = Object.keys(REACT_MOVE).some(dir => {
    const { dx: dDx, dy: dDy } = REACT_MOVE[dir];
    const testX = nextX + dDx;
    const testY = nextY + dDy;
    
    // Check if direction is valid
    if (!inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
      return false;
    }
    
    const testState = board[testX][testY];
    // Check if cell is available (not blocked by body that won't move)
    if (typeof testState === 'number' && testState < newSnakeLength - 1) {
      return false; // Blocked by body
    }
    
    // Check if this direction has enough accessible space
    return newCounts[dir] >= minRequiredSpace;
  });
  
  // If no direction has enough space, we're trapped
  // But only if it's a clear trap - if we have some space, allow it
  if (!hasEnoughSpace) {
    // Check if we have ANY valid direction at all
    const hasAnyValidDirection = Object.keys(REACT_MOVE).some(dir => {
      const { dx: dDx, dy: dDy } = REACT_MOVE[dir];
      const testX = nextX + dDx;
      const testY = nextY + dDy;
      if (!inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
        return false;
      }
      const testState = board[testX][testY];
      return testState === BOARD_STATES.unset || testState === BOARD_STATES.food || 
             (typeof testState === 'number' && testState >= newSnakeLength - 1);
    });
    
    // Only trap if we have NO valid directions at all
    return !hasAnyValidDirection;
  }
  
  // Also check if we can still reach the Hamiltonian path
  // If the cycle cell exists at the new position, we can follow the path
  if (!cycle[nextX] || !cycle[nextX][nextY] || typeof cycle[nextX][nextY].index === 'undefined') {
    // Can't reach Hamiltonian path - but if we have enough space, it's okay
    // Only trap if we have very little space
    const maxSpace = Math.max(...Object.values(newCounts).filter(v => typeof v === 'number'));
    // Only trap if we have less than half the snake length in space
    return maxSpace < Math.max(newSnakeLength * 0.3, 3);
  }
  
  return false; // Not trapped
}

// Look ahead to check if a path is safe (simulates shorter distance, allows natural movement)
function lookAheadSafe(cycle, startX, startY, direction, foodPos, board, snakeLength, boardSize) {
  // For natural movement, only look ahead a shorter distance (not full snake length)
  // This allows more freedom while still preventing immediate traps
  const lookAheadSteps = Math.min(snakeLength + 1, Math.max(5, Math.floor(snakeLength / 2) + 3));
  
  let currentX = startX;
  let currentY = startY;
  let steps = 0;
  let currentSnakeLength = snakeLength; // Track current length (grows when eating)
  
  // Move along the path for lookAheadSteps
  while (steps < lookAheadSteps) {
    // Get next position - allow natural movement toward food, not just Hamiltonian path
    let nextX, nextY;
    
    if (steps === 0) {
      // First step: use the given direction
      const { dx, dy } = REACT_MOVE[direction];
      nextX = currentX + dx;
      nextY = currentY + dy;
    } else {
      // Subsequent steps: try to move toward food naturally, fallback to Hamiltonian path
      const dx = foodPos[0] - currentX;
      const dy = foodPos[1] - currentY;
      
      // Try natural direction toward food
      let naturalDir = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        naturalDir = dx > 0 ? 'right' : 'left';
      } else if (dy !== 0) {
        naturalDir = dy > 0 ? 'bottom' : 'top';
      }
      
      if (naturalDir) {
        const { dx: nDx, dy: nDy } = REACT_MOVE[naturalDir];
        const testX = currentX + nDx;
        const testY = currentY + nDy;
        
        // Check if natural direction is valid
        if (inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
          const testState = board[testX][testY];
          const isFood = testX === foodPos[0] && testY === foodPos[1];
          const isBody = typeof testState === 'number';
          
          // Calculate which tail segment will be at this position when we reach it
          // After 'steps' moves, tail has moved forward 'steps' times
          // So segments with index >= (currentSnakeLength - 1 - steps) will have moved
          const minTailIndexAtStep = currentSnakeLength - 1 - steps;
          
          if (isFood || testState === BOARD_STATES.unset || (isBody && testState >= minTailIndexAtStep)) {
            nextX = testX;
            nextY = testY;
          } else {
            // Natural direction blocked, use Hamiltonian path
            if (!cycle[currentX] || !cycle[currentX][currentY]) return false;
            const nextDir = dirToMoveDir(cycle[currentX][currentY].dir);
            nextX = currentX + nextDir.dx;
            nextY = currentY + nextDir.dy;
          }
        } else {
          // Natural direction out of bounds, use Hamiltonian path
          if (!cycle[currentX] || !cycle[currentX][currentY]) return false;
          const nextDir = dirToMoveDir(cycle[currentX][currentY].dir);
          nextX = currentX + nextDir.dx;
          nextY = currentY + nextDir.dy;
        }
      } else {
        // No natural direction, use Hamiltonian path
        if (!cycle[currentX] || !cycle[currentX][currentY]) return false;
        const nextDir = dirToMoveDir(cycle[currentX][currentY].dir);
        nextX = currentX + nextDir.dx;
        nextY = currentY + nextDir.dy;
      }
    }
    
    // Check bounds
    if (!inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
      return false;
    }
    
    // Check if we reached food (snake grows)
    const isFood = nextX === foodPos[0] && nextY === foodPos[1];
    if (isFood) {
      currentSnakeLength++; // Snake grows when eating
    }
    
    // Check if cell is available (accounting for tail movement)
    const cellState = board[nextX][nextY];
    
    // If it's the snake body, check if it's the tail that will move
    if (typeof cellState === 'number') {
      // After 'steps' moves, the tail has moved forward 'steps' times
      // So segments with index >= (currentSnakeLength - 1 - steps) will have moved
      // Note: currentSnakeLength already accounts for food eaten during this look-ahead
      const minTailIndexAtThisStep = currentSnakeLength - 1 - steps;
      
      if (cellState < minTailIndexAtThisStep) {
        // This is body that won't move, collision!
        return false;
      }
    } else if (cellState !== BOARD_STATES.unset && !isFood) {
      // Blocked by something else
      return false;
    }
    
    // Move to next position
    currentX = nextX;
    currentY = nextY;
    steps++;
  }
  
  // After lookAheadSteps, check if we have enough space to continue
  // Use a simpler check - just verify there's at least one valid direction
  const finalLength = currentSnakeLength; // Use the final length after all steps
  const hasEnoughSpace = Object.keys(REACT_MOVE).some(dir => {
    const { dx, dy } = REACT_MOVE[dir];
    const checkX = currentX + dx;
    const checkY = currentY + dy;
    if (!inBounds({ x: checkX, y: checkY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
      return false;
    }
    const cellState = board[checkX][checkY];
    // Check if cell is available or is tail that will move
    return cellState === BOARD_STATES.unset || cellState === BOARD_STATES.food || 
           (typeof cellState === 'number' && cellState >= finalLength - 1);
  });
  
  return hasEnoughSpace;
}

// Get direct direction to food (for natural movement when small)
function getDirectDirection(head, foodPos) {
  const dx = foodPos[0] - head.x;
  const dy = foodPos[1] - head.y;
  
  if (dx > 0) return 'right';
  if (dx < 0) return 'left';
  if (dy > 0) return 'bottom';
  if (dy < 0) return 'top';
  
  return null;
}

// Find next direction using Hamiltonian path (React algorithm with natural movement for small snakes)
export function getNextDirectionFromPath(cycle, head, segments, board, movesWithoutProgress = 0, backtrackState = null) {
  if (!cycle || !cycle[head.x] || !cycle[head.x][head.y]) {
    return backtrackState ? { direction: '+x', backtrack: false } : '+x'; // fallback
  }

  const headCell = cycle[head.x][head.y];
  
  // Check if cycle is fully generated (has index property)
  if (typeof headCell.index === 'undefined') {
    // Cycle not ready yet, use default direction
    const dir = headCell.dir || '+x';
    return backtrackState ? { direction: dir, backtrack: false } : dir;
  }

  // Find food position
  let foodPos = null;
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (board[x][y] === BOARD_STATES.food) {
        if (cycle[x] && cycle[x][y] && typeof cycle[x][y].index !== 'undefined') {
          foodPos = [x, y];
          break;
        }
      }
    }
    if (foodPos) break;
  }

  if (!foodPos) {
    // No food found, just follow the path
    return backtrackState ? { direction: headCell.dir, backtrack: false } : headCell.dir;
  }

  // Create snake object in React format
  const snake = {
    head: { x: head.x, y: head.y },
    segments: segments || [],
  };

  const snakeLength = snake.segments.length;
  const boardSize = board.length * board[0].length;
  const snakePercentage = (snakeLength / boardSize) * 100;
  
  // Count available cells in each direction (needed for all strategies)
  const counts = countAvailable(cycle, snake, foodPos, board);
  
  // If snake hasn't made progress in many moves, force Hamiltonian path to break loop
  // Increased threshold to allow more natural movement before forcing path
  const MAX_MOVES_WITHOUT_PROGRESS = 25; // After 25 moves without progress, use Hamiltonian path
  const forceHamiltonianPath = movesWithoutProgress >= MAX_MOVES_WITHOUT_PROGRESS;
  
  // Check if going for food would create a death loop - if so, prioritize safety and reset to path
  // This prevents the snake from being too greedy when it's in a dangerous position
  const checkIfFoodPathIsDangerous = () => {
    // Check all directions that would get closer to food
    const dx = foodPos[0] - head.x;
    const dy = foodPos[1] - head.y;
    const directionsToFood = [];
    
    if (Math.abs(dx) > 0) {
      directionsToFood.push(dx > 0 ? 'right' : 'left');
    }
    if (Math.abs(dy) > 0) {
      directionsToFood.push(dy > 0 ? 'bottom' : 'top');
    }
    
    // Check if ALL paths to food are dangerous (would create death loops or traps)
    let allPathsDangerous = true;
    let hasAnySafePath = false;
    
    for (const dir of directionsToFood) {
      const { dx: dDx, dy: dDy } = REACT_MOVE[dir];
      const nextX = head.x + dDx;
      const nextY = head.y + dDy;
      
      if (!inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
        continue; // Out of bounds, skip
      }
      
      const cellState = board[nextX][nextY];
      const isDeadly = wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength);
      const isTrap = snakeLength >= 15 && wouldTrapInLoop(cycle, head, snake.segments, dir, foodPos, board, snakeLength);
      const isSafe = lookAheadSafe(cycle, head.x, head.y, dir, foodPos, board, snakeLength, boardSize);
      const hasEnoughSpace = counts[dir] >= Math.max(snakeLength * 0.5, 3);
      
      // If this direction is safe and has enough space, we have a safe path
      if (!isDeadly && !isTrap && isSafe && hasEnoughSpace && 
          (cellState === BOARD_STATES.food || cellState === BOARD_STATES.unset)) {
        hasAnySafePath = true;
        allPathsDangerous = false;
        break;
      }
    }
    
    // If all paths to food are dangerous, we should reset to Hamiltonian path
    return !hasAnySafePath;
  };
  
  const shouldResetToPath = checkIfFoodPathIsDangerous();
  
  // Use natural movement based on board size percentage
  // Allow natural movement for most snakes - only use strict path when very large
  // Threshold: snake < 70% of board size for natural movement (allows longer snakes to take shortcuts)
  // For very natural movement: snake < 50% of board size
  const naturalMovementThreshold = 0.70; // 70% of board - allows natural movement for longer snakes
  const veryNaturalThreshold = 0.50; // 50% of board - very natural movement
  
  // If going for food would create a death loop, skip greediness and reset to Hamiltonian path
  // This prevents the snake from trapping itself
  if (shouldResetToPath) {
    // Skip all greedy movement - go straight to Hamiltonian path
    // This will position the snake safely on the path to prevent death loops
  } else if (!forceHamiltonianPath && snakePercentage < naturalMovementThreshold * 100) {
    // Try direct path to food if it's safe and has enough space
    const directDir = getDirectDirection(head, foodPos);
    if (directDir) {
      const { dx, dy } = REACT_MOVE[directDir];
      const nextX = head.x + dx;
      const nextY = head.y + dy;
      
      // Check bounds
      if (inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
        const cellState = board[nextX][nextY];
        // If it's food or unset, check look-ahead safety before taking direct path
        if (cellState === BOARD_STATES.food || cellState === BOARD_STATES.unset) {
          // Be more lenient with space requirements - allow more natural movement
          // Only require enough space to not immediately die
          const requiredSpace = snakeLength < 15 
            ? Math.max(snakeLength * 0.5, 3)  // Small snakes: very lenient
            : snakeLength < 30 
              ? Math.max(snakeLength * 0.6, 5)  // Medium snakes: lenient
              : Math.max(snakeLength * 0.7, 10); // Long snakes: still lenient but more careful
          
          // Check if this move would create a deadly loop or trap the snake
          // Only check trap for longer snakes to allow more natural movement
          const shouldCheckTrap = snakeLength >= 15;
          const isTrap = shouldCheckTrap && wouldTrapInLoop(cycle, head, snake.segments, directDir, foodPos, board, snakeLength);
          
          if (!wouldCreateDeadlyLoop(cycle, head, snake.segments, directDir, board, snakeLength) &&
              !isTrap &&
              lookAheadSafe(cycle, head.x, head.y, directDir, foodPos, board, snakeLength, boardSize) &&
              counts[directDir] >= requiredSpace) {
            const dir = reactDirToDir(directDir);
            return backtrackState ? { direction: dir, backtrack: false } : dir;
          }
        }
      }
    }
    
    // For very natural movement (< 50% of board), also try directions that get closer to food
    // Add variety by considering multiple directions, not just the closest
    // Only if we're making progress (not stuck in a loop)
    if (!forceHamiltonianPath && snakePercentage < veryNaturalThreshold * 100) {
      const dx = foodPos[0] - head.x;
      const dy = foodPos[1] - head.y;
      
      // Calculate distance to food for each direction
      const getDistanceToFood = (dir) => {
        const { dx: dDx, dy: dDy } = REACT_MOVE[dir];
        const nextX = head.x + dDx;
        const nextY = head.y + dDy;
        return Math.abs(foodPos[0] - nextX) + Math.abs(foodPos[1] - nextY);
      };
      
      // Collect all valid directions that move toward food
      const validDirections = [];
      
      // Try horizontal movement if food is horizontally aligned
      if (Math.abs(dx) > 0) {
        const horizontalDir = dx > 0 ? 'right' : 'left';
        const { dx: hDx, dy: hDy } = REACT_MOVE[horizontalDir];
        const nextX = head.x + hDx;
        const nextY = head.y + hDy;
        
        if (inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
          const cellState = board[nextX][nextY];
          const distanceAfterMove = getDistanceToFood(horizontalDir);
          const currentDistance = Math.abs(dx) + Math.abs(dy);
          
          // Only consider directions that actually get closer to food (or are at food)
          // Be more lenient with trap checking for natural movement
          const shouldCheckTrap = snakeLength >= 15;
          const isTrap = shouldCheckTrap && wouldTrapInLoop(cycle, head, snake.segments, horizontalDir, foodPos, board, snakeLength);
          const requiredSpace = snakeLength < 15 ? Math.max(snakeLength * 0.5, 3) : Math.max(snakeLength * 0.6, 5);
          
          if ((cellState === BOARD_STATES.food || cellState === BOARD_STATES.unset) && 
              (distanceAfterMove < currentDistance || cellState === BOARD_STATES.food) &&
              !wouldCreateDeadlyLoop(cycle, head, snake.segments, horizontalDir, board, snakeLength) &&
              !isTrap &&
              lookAheadSafe(cycle, head.x, head.y, horizontalDir, foodPos, board, snakeLength, boardSize) &&
              counts[horizontalDir] >= requiredSpace) {
            validDirections.push({ dir: horizontalDir, priority: Math.abs(dx), space: counts[horizontalDir], distance: distanceAfterMove });
          }
        }
      }
      
      // Try vertical movement if food is vertically aligned
      if (Math.abs(dy) > 0) {
        const verticalDir = dy > 0 ? 'bottom' : 'top';
        const { dx: vDx, dy: vDy } = REACT_MOVE[verticalDir];
        const nextX = head.x + vDx;
        const nextY = head.y + vDy;
        
        if (inBounds({ x: nextX, y: nextY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
          const cellState = board[nextX][nextY];
          const distanceAfterMove = getDistanceToFood(verticalDir);
          const currentDistance = Math.abs(dx) + Math.abs(dy);
          
          // Only consider directions that actually get closer to food (or are at food)
          // Be more lenient with trap checking for natural movement
          const shouldCheckTrap = snakeLength >= 15;
          const isTrap = shouldCheckTrap && wouldTrapInLoop(cycle, head, snake.segments, verticalDir, foodPos, board, snakeLength);
          const requiredSpace = snakeLength < 15 ? Math.max(snakeLength * 0.5, 3) : Math.max(snakeLength * 0.6, 5);
          
          if ((cellState === BOARD_STATES.food || cellState === BOARD_STATES.unset) && 
              (distanceAfterMove < currentDistance || cellState === BOARD_STATES.food) &&
              !wouldCreateDeadlyLoop(cycle, head, snake.segments, verticalDir, board, snakeLength) &&
              !isTrap &&
              lookAheadSafe(cycle, head.x, head.y, verticalDir, foodPos, board, snakeLength, boardSize) &&
              counts[verticalDir] >= requiredSpace) {
            validDirections.push({ dir: verticalDir, priority: Math.abs(dy), space: counts[verticalDir], distance: distanceAfterMove });
          }
        }
      }
      
      // If we have valid directions, choose one that gets closer to food
      if (validDirections.length > 0) {
        // For longer snakes, be more lenient with space requirements
        const requiredSpace = snakeLength < 20 ? snakeLength + 1 : Math.max(snakeLength * 0.7, 10);
        
        // Filter to only directions with enough space
        const safeDirections = validDirections.filter(d => d.space >= requiredSpace);
        const directionsToChoose = safeDirections.length > 0 ? safeDirections : validDirections;
        
        // Sort by distance to food first (closer is better), then by space
        directionsToChoose.sort((a, b) => {
          // Prioritize getting closer to food
          if (a.distance !== b.distance) {
            return a.distance - b.distance;
          }
          // Then prefer more space
          return b.space - a.space;
        });
        
        const dir = reactDirToDir(directionsToChoose[0].dir);
        return backtrackState ? { direction: dir, backtrack: false } : dir;
      }
    }
  }
  
  // Find closest direction to food along Hamiltonian path
  // If we're resetting to path (food path is dangerous), prioritize safety over food
  let closest;
  if (shouldResetToPath) {
    // When resetting, prioritize directions that:
    // 1. Are safe (not deadly)
    // 2. Have good space
    // 3. Follow the Hamiltonian path (get us back on track)
    closest = checkPath(cycle, snake.head, foodPos, board, 
      ({ dirIndex, closeIndex, dir }) => {
        // Prioritize safe directions with good space that follow the path
        const isSafe = !wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength);
        const hasGoodSpace = counts[dir] >= Math.max(snake.segments.length * 0.7, 5);
        return isSafe && hasGoodSpace && (closeIndex < dirIndex || !closeIndex);
      });
    
    // If no good path found, just find any safe direction on the Hamiltonian path
    if (!closest.index) {
      closest = checkPath(cycle, snake.head, foodPos, board, 
        ({ dirIndex, dir }) => {
          return !wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength);
        });
    }
    
    // Fallback to default Hamiltonian path direction if still nothing
    if (!closest.index) {
      closest = { index: 0, dir: dirToReactDir(headCell.dir) };
    }
  } else {
    // Normal behavior - find closest direction to food
    closest = checkPath(cycle, snake.head, foodPos, board, 
      ({ fruitIndex, dirIndex, closeIndex, dir }) => 
        counts[dir] >= snake.segments.length && fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));

    if (!closest.index) {
      closest = checkPath(cycle, snake.head, foodPos, board, 
        ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
    }
  }

  // Collect alternative directions that are also good and safe
  const alternativeDirs = [];
  Object.keys(REACT_MOVE).forEach(dir => {
    const { dx, dy } = REACT_MOVE[dir];
    const testX = head.x + dx;
    const testY = head.y + dy;
    
    if (inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
      const testState = board[testX][testY];
      // Only consider safe directions (not deadly)
      if (!wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength) &&
          (testState === BOARD_STATES.unset || testState === BOARD_STATES.food) &&
          counts[dir] >= Math.max(snake.segments.length * 0.8, 5)) {
        alternativeDirs.push({ dir, space: counts[dir] });
      }
    }
  });

  // Check if the chosen direction is deadly - if so, find a safe alternative
  if (closest.dir && wouldCreateDeadlyLoop(cycle, head, snake.segments, closest.dir, board, snakeLength)) {
    // Current direction is deadly, find a safe alternative
    if (alternativeDirs.length > 0) {
      alternativeDirs.sort((a, b) => b.space - a.space);
      closest.dir = alternativeDirs[0].dir;
    } else {
      // No safe alternatives found, try to find ANY safe direction
      let safeDir = null;
      Object.keys(REACT_MOVE).forEach(dir => {
        if (!wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength)) {
          const { dx, dy } = REACT_MOVE[dir];
          const testX = head.x + dx;
          const testY = head.y + dy;
          if (inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
            const testState = board[testX][testY];
            if (testState === BOARD_STATES.unset || testState === BOARD_STATES.food || 
                (typeof testState === 'number' && testState >= snakeLength - 1)) {
              safeDir = dir;
            }
          }
        }
      });
      if (safeDir) {
        closest.dir = safeDir;
      }
      // If still no safe direction, fall back to Hamiltonian path direction (better than nothing)
    }
  }

  // If we have alternatives and the chosen one doesn't have enough space, consider alternatives
  if (counts[closest.dir] < snake.segments.length + 1 && alternativeDirs.length > 0) {
    // Sort alternatives by space, add randomness for variety
    alternativeDirs.sort((a, b) => {
      const randomFactor = Math.random() * 0.3;
      return (b.space + randomFactor) - (a.space + randomFactor);
    });
    closest.dir = alternativeDirs[0].dir;
  } else if (counts[closest.dir] < snake.segments.length + 1) {
    // Fallback to max space direction (but only if it's safe)
    if (counts.max && counts.max.dir && 
        !wouldCreateDeadlyLoop(cycle, head, snake.segments, counts.max.dir, board, snakeLength)) {
      closest.dir = counts.max.dir;
    }
  }

  // Final safety check - never return a deadly direction
  if (closest.dir && wouldCreateDeadlyLoop(cycle, head, snake.segments, closest.dir, board, snakeLength)) {
    // Last resort: find ANY safe direction
    for (const dir of Object.keys(REACT_MOVE)) {
      if (!wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength)) {
        const { dx, dy } = REACT_MOVE[dir];
        const testX = head.x + dx;
        const testY = head.y + dy;
        if (inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
          return { direction: reactDirToDir(dir), backtrack: false };
        }
      }
    }
    // If absolutely no safe direction exists, detect dead end and trigger backtracking
    const fallbackDir = reactDirToDir(closest.dir || headCell.dir || '+x');
    if (backtrackState) {
      return { direction: fallbackDir, backtrack: true };
    }
    // Fallback if no backtrack state provided
    return fallbackDir;
  }

  // Dead-end detection: Check if we're heading into a dangerous situation
  // This detects when all safe directions lead to traps or have insufficient space
  if (backtrackState && !backtrackState.isBacktracking && foodPos) {
    const allDirections = Object.keys(REACT_MOVE);
    let safeDirections = 0;
    let trulySafeDirections = 0;
    
    for (const dir of allDirections) {
      const { dx, dy } = REACT_MOVE[dir];
      const testX = head.x + dx;
      const testY = head.y + dy;
      
      // Check bounds
      if (!inBounds({ x: testX, y: testY }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
        continue;
      }
      
      const testState = board[testX][testY];
      const isDeadly = wouldCreateDeadlyLoop(cycle, head, snake.segments, dir, board, snakeLength);
      
      if (!isDeadly && (testState === BOARD_STATES.unset || testState === BOARD_STATES.food || 
          (typeof testState === 'number' && testState >= snakeLength - 1))) {
        safeDirections++;
        
        // Check if this direction is truly safe (not a trap and has enough space)
        const isTrap = snakeLength >= 15 && wouldTrapInLoop(cycle, head, snake.segments, dir, foodPos, board, snakeLength);
        const isLookAheadSafe = lookAheadSafe(cycle, head.x, head.y, dir, foodPos, board, snakeLength, boardSize);
        const dirSpace = counts[dir] || 0;
        const hasEnoughSpace = dirSpace >= Math.max(snakeLength * 0.5, 3);
        
        if (!isTrap && isLookAheadSafe && hasEnoughSpace) {
          trulySafeDirections++;
        }
      }
    }
    
    // Dead end detected if:
    // 1. No truly safe directions (all lead to traps or have insufficient space)
    // 2. OR very few safe directions and we're in a dangerous position
    // 3. OR consecutive dead ends detected (getting stuck in loops)
    const closestDirSpace = counts[closest.dir] || 0;
    const isDeadEnd = (trulySafeDirections === 0 && safeDirections > 0) || 
                      (trulySafeDirections === 0 && safeDirections === 0) ||
                      (trulySafeDirections <= 1 && snakeLength > 20 && closestDirSpace < snakeLength * 0.3);
    
    if (isDeadEnd) {
      // Check if we've been in similar positions recently (loop detection)
      const recentSimilarPositions = (backtrackState.recentDecisions || []).filter(dec => {
        const distance = Math.abs(dec.head.x - head.x) + Math.abs(dec.head.y - head.y);
        return distance <= 3; // Within 3 cells
      }).length;
      
      // Trigger backtracking if dead end detected and we're in a loop
      if (recentSimilarPositions >= 3 || (backtrackState.consecutiveDeadEnds || 0) >= 2) {
        return { direction: reactDirToDir(closest.dir || headCell.dir || '+x'), backtrack: true };
      }
    }
  }

  // Normal return - no backtracking needed
  return { direction: reactDirToDir(closest.dir), backtrack: false };
}

export default {
  CELLS,
  COLORS,
  BOARD_STATES,
  getColor,
  generateBoard,
  fullDraw,
  drawUpdated,
  drawCell,
  dirToXY,
  inputPlayer,
  generateSnake,
  movePlayer,
  populateFood,
  generateHamiltonianCycle,
  generateHamiltonianCycleSync,
  getNextDirectionFromPath,
};


