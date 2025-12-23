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

export function newActiveShape(game, setPeices = {}, randomPool = [], bounds = { xMid: 4 }, heldItem = null) {
  let shapeToUse;
  
  if (heldItem) {
    shapeToUse = shapes.find(s => s.item === heldItem);
  } else {
    if (game.queue.length === 0) {
      randomPool = generateQueue(game, randomPool);
    }
    shapeToUse = game.queue.shift();
    
    let shape;
    ({ randomPool, shape } = newShape(randomPool));
    game.queue.push(shape);
  }

  let currentShape = setPosition(shapeToUse, { x: bounds.xMid, y: 0 });

  let gameActive = canPieceMoveDown(currentShape, bounds, setPeices);
  if (!gameActive) {
    currentShape = null;
  } else if (gameActive < 0) {
    currentShape.forEach(block => block.y--);
  }

  return {
    currentShape,
    randomPool,
    gameActive: !!gameActive,
  };
}

export function generateShadow(currentShape, setPeices, bounds) {
  if (!currentShape) return null;
  // Simple shadow - could be enhanced later
  return null;
}

export function movePiece(currentShape, setPeices, bounds, dx, dy) {
  if (!currentShape) return null;
  
  const newShape = currentShape.map(block => ({
    ...block,
    x: block.x + dx,
    y: block.y + dy,
  }));
  
  if (canPieceMove(newShape, setPeices, bounds, 0, 0)) {
    return newShape;
  }
  return currentShape;
}

export function canPieceMove(currentShape, setPeices, bounds, dx, dy) {
  if (!currentShape) return false;
  
  for (const block of currentShape) {
    const newX = block.x + dx;
    const newY = block.y + dy;
    
    if (!inBounds({ x: newX, y: newY }, bounds)) {
      return false;
    }
    
    // Check collision with placed pieces
    if (setPeices[newX]) {
      for (const placed of setPeices[newX]) {
        if (placed.y === newY) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function rotateShape(currentShape, setPeices, bounds) {
  if (!currentShape || currentShape.length === 0) return currentShape;
  
  const shapeType = currentShape[0].item;
  
  // O piece doesn't rotate
  if (shapeType === 'O') return currentShape;
  
  // Get center of rotation
  const centerX = Math.round(currentShape.reduce((sum, b) => sum + b.x, 0) / currentShape.length);
  const centerY = Math.round(currentShape.reduce((sum, b) => sum + b.y, 0) / currentShape.length);
  
  // Rotate 90 degrees clockwise
  const rotated = currentShape.map(block => {
    const relX = block.x - centerX;
    const relY = block.y - centerY;
    return {
      ...block,
      x: centerX - relY,
      y: centerY + relX,
    };
  });
  
  // Check if rotation is valid
  if (canPieceMove(rotated, setPeices, bounds, 0, 0)) {
    return rotated;
  }
  
  // Try wall kicks (simple version - just shift left/right)
  for (const offset of [-1, 1, -2, 2]) {
    const kicked = rotated.map(block => ({ ...block, x: block.x + offset }));
    if (canPieceMove(kicked, setPeices, bounds, 0, 0)) {
      return kicked;
    }
  }
  
  return currentShape;
}

export function clearLines(setPeices, bounds) {
  // First, collect all blocks and organize by row
  const blocksByRow = {};
  for (const x in setPeices) {
    for (const block of setPeices[x]) {
      const y = block.y;
      if (!blocksByRow[y]) {
        blocksByRow[y] = [];
      }
      blocksByRow[y].push(block);
    }
  }
  
  // Find full rows (rows with blocks in all columns from xMin to xMax)
  const fullRows = [];
  const totalColumns = bounds.xMax - bounds.xMin + 1; // Should be 10 (0-9)
  
  for (const y in blocksByRow) {
    const rowY = parseInt(y);
    const blocksInRow = blocksByRow[rowY];
    
    // Check if this row has blocks in all columns
    const columnsInRow = new Set(blocksInRow.map(b => b.x));
    
    // Verify that every column from xMin to xMax has a block
    let isFull = true;
    for (let x = bounds.xMin; x <= bounds.xMax; x++) {
      if (!columnsInRow.has(x)) {
        isFull = false;
        break;
      }
    }
    
    if (isFull) {
      fullRows.push(rowY);
    }
  }
  
  if (fullRows.length === 0) {
    return { setPeices };
  }
  
  // Sort full rows from bottom to top (highest y first)
  fullRows.sort((a, b) => b - a);
  
  // Remove full rows and shift down all blocks above them
  const newSetPeices = {};
  
  // Rebuild the structure column by column
  for (const x in setPeices) {
    const columnBlocks = setPeices[x];
    const filteredBlocks = [];
    
    for (const block of columnBlocks) {
      // Skip blocks in cleared rows
      if (!fullRows.includes(block.y)) {
        // Count how many cleared rows are BELOW this block (rows with larger y values)
        // Blocks above cleared rows need to move DOWN (increase y)
        const rowsClearedBelow = fullRows.filter(row => row > block.y).length;
        filteredBlocks.push({
          ...block,
          y: block.y + rowsClearedBelow, // Add because blocks move down (y increases)
        });
      }
    }
    
    // Sort blocks by y coordinate
    filteredBlocks.sort((a, b) => a.y - b.y);
    
    if (filteredBlocks.length > 0) {
      newSetPeices[x] = filteredBlocks;
    }
  }
  
  return { setPeices: newSetPeices };
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

