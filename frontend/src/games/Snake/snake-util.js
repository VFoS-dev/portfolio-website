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
  const dead = { board, tickDelay: isAI ? 300 : 500, alive: false, update: [] };

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
    ? Math.max(75, 300 - 15 * (segments.length - 4))  // AI: faster start (300ms), faster acceleration (15ms per segment), minimum 75ms
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
      if (board[x][y] === BOARD_STATES.unset) {
        possibleSpots.push({ x, y });
      }
    }
  }

  for (var f = 0; f < count; f++) {
    if (!possibleSpots.length) break;
    const random = Math.floor(possibleSpots.length * Math.random());
    const [{ x, y }] = possibleSpots.splice(random, 1);
    board[x][y] = BOARD_STATES.food;
    updates.push({ x, y });
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

// Find next direction using Hamiltonian path (React algorithm)
export function getNextDirectionFromPath(cycle, head, segments, board) {
  if (!cycle || !cycle[head.x] || !cycle[head.x][head.y]) {
    return '+x'; // fallback
  }

  const headCell = cycle[head.x][head.y];
  
  // Check if cycle is fully generated (has index property)
  if (typeof headCell.index === 'undefined') {
    // Cycle not ready yet, use default direction
    return headCell.dir || '+x';
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
    return headCell.dir;
  }

  // Create snake object in React format
  const snake = {
    head: { x: head.x, y: head.y },
    segments: segments || [],
  };

  // Count available cells in each direction
  const counts = countAvailable(cycle, snake, foodPos, board);
  
  // Find closest direction to food
  let closest = checkPath(cycle, snake.head, foodPos, board, 
    ({ fruitIndex, dirIndex, closeIndex, dir }) => 
      counts[dir] >= snake.segments.length && fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));
  
  if (!closest.index) {
    closest = checkPath(cycle, snake.head, foodPos, board, 
      ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
  }

  // If chosen direction doesn't have enough space, use direction with max space
  if (counts[closest.dir] < snake.segments.length + 1) {
    closest.dir = counts.max.dir ?? closest.dir;
  }

  return reactDirToDir(closest.dir);
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

