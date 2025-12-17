import { inBounds, random } from '@/utilities/game';

export const shapes = [
  { item: 'I', color: 'cyan' },
  { item: 'J', color: 'blue' },
  { item: 'L', color: 'orange' },
  { item: 'O', color: 'yellow' },
  { item: 'S', color: 'green' },
  { item: 'T', color: 'purple' },
  { item: 'Z', color: 'red' },
];

export const shapeDeltas = {
  I: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
  ],
  J: [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  L: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
  ],
  O: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
  S: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
  ],
  T: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ],
  Z: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 1 },
  ],
};

export function newShape(randomPool = []) {
  if (!randomPool.length) {
    randomPool = [...shapes];
  }

  const [_shape] = randomPool.splice(Math.floor(random(randomPool.length)), 1);

  return {
    randomPool,
    shape: _shape,
  };
}

export function generateQueue(game, randomPool = []) {
  const queue = [];
  for (let i = 0; i < 4; i++) {
    let shape;
    ({ shape, randomPool } = newShape(randomPool));

    queue.push(shape);
  }

  game.queue = queue;

  return randomPool;
}

export function setPosition(shape, { x = 4, y = 0 } = {}) {
  return shapeDeltas[shape.item].map(({ x: dx, y: dy }) => ({
    ...shape,
    x: x + dx,
    y: y + dy,
  }));
}

export function newActiveShape(game, setPeices = {}, randomPool = [], bounds = { xMid: 4 }) {
  let currentShape = setPosition(game.queue.shift(), { x: bounds.xMid });

  let shape;
  ({ randomPool, shape } = newShape(randomPool));

  game.queue.push(shape);
  game.blocks = currentShape;
  let gameActive = canPieceMoveDown(currentShape, bounds, setPeices);
  if (!gameActive) currentShape = null;
  if (gameActive < 0) {
    currentShape.forEach(shape => shape.y--);
  }

  return {
    currentShape,
    randomPool,
    gameActive,
    shadowShape: generateShadow(currentShape, setPeices, bounds),
  };
}

export function generateShadow(currentShape, setPeices, bounds) {
  console.log(currentShape, setPeices, bounds);
}

export function moveShape(setPeices, currentShape, bounds) {
  if (canPieceMoveDown(currentShape, bounds, setPeices) <= 0) {
    const xs = new Set();

    // add peices to setPeices
    for (const block of currentShape) {
      xs.add(block.x);
      setPeices[block.x] = [block, ...(setPeices[block.x] ?? [])];
      console.log(setPeices[block.x]);
    }

    // sort setPeices vertially
    for (const x of xs) {
      console.log(x);

      setPeices[x] = setPeices[x].sort((a, b) => {
        return a.y - b.y;
      });
    }

    return {
      currentShape: null,
      setPeices,
    };
  }

  currentShape.forEach(shape => shape.y++);

  return {
    currentShape,
    setPeices,
  };
}

export function canPieceMoveDown(currentShape, bounds, setPeices = {}) {
  for (const block of currentShape) {
    if (!inBounds({ y: block.y + 1, x: block.x }, bounds)) {
      return false;
    }
    if (setPeices[block.x]) {
      for (const set of setPeices[block.x]) {
        if (set.y == block.y + 1) {
          return -1;
        }
        if (set.y == block.y) {
          return false;
        }
      }
    }
  }

  return true;
}
