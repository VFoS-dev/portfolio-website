import { inBounds } from "@/utilities/game";

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

export const getColor = (color) => COLORS[color] ?? COLORS.unset;

export function generateBoard(canvas) {
    const { innerHeight, innerWidth } = window;
    canvas.width = innerWidth
    canvas.height = innerHeight

    const size = (innerHeight > innerWidth) ?
        { longer: innerHeight, shorter: innerWidth, x: 'shorter', y: 'longer', longerCount: 0, shorterCount: 0 } :
        { longer: innerWidth, shorter: innerHeight, x: 'longer', y: 'shorter', longerCount: 0, shorterCount: 0 }

    const cellSize = size.longer / CELLS;
    size.longerCount = CELLS;
    size.shorterCount = Math.max(2, Math.floor(size.shorter / cellSize));
    if (size.shorterCount % 2) size.shorterCount--;

    const sizeRem = {
        x: (size[`${size.x}Count`] * cellSize - size[`${size.x}`]) / 2,
        y: (size[`${size.y}Count`] * cellSize - size[`${size.y}`]) / 2,
    }

    const board = [];
    for (let x = 0; x < size[`${size.x}Count`]; x++) {
        board.push(new Array(size[`${size.y}Count`]).fill('unset'));
    }

    fullDraw(canvas, board, cellSize, sizeRem)

    return {
        board, cellSize, sizeRem,
        update: [],
    }
}

export function fullDraw(canvas, board, cellSize, sizeRem) {
    const ctx = canvas.getContext('2d');
    const halfSize = cellSize / 2;
    board.forEach((col, ix) => {
        col.forEach((cell, iy) => {
            const x = ix * cellSize + halfSize - sizeRem.x;
            const y = iy * cellSize + halfSize - sizeRem.y;

            let color = getColor(cell)
            if (typeof cell === 'number') {
                if ((cell >= snakeColors.length && typeof snakeColors[snakeColors.length - 1] !== 'string') || typeof snakeColors[cell % snakeColors.length] !== 'string') {
                    color = getColor('white')
                } else {
                    color = getColor(snakeColors[cell % snakeColors.length])
                }
            }

            const gradient = color != getColor('unset') && color != getColor('white')

            drawCell(ctx, x, y, halfSize, cellSize, color, gradient)
        });
    });
}

export function drawUpdated(canvas, board, updated, cellSize, sizeRem, snakeColors) {
    const ctx = canvas.getContext('2d')
    const halfSize = cellSize / 2;
    for (const { x: ix, y: iy } of updated) {
        const x = ix * cellSize + halfSize - sizeRem.x;
        const y = iy * cellSize + halfSize - sizeRem.y;
        const cell = board[ix][iy];

        let color = getColor(cell)
        if (typeof cell === 'number') {
            if ((cell >= snakeColors.length && typeof snakeColors[snakeColors.length - 1] !== 'string') || typeof snakeColors[cell % snakeColors.length] !== 'string') {
                color = getColor('white')
            } else {
                color = getColor(snakeColors[cell % snakeColors.length])
            }
        }

        const gradient = color != getColor('unset') && color != getColor('white')

        drawCell(ctx, x, y, halfSize, cellSize, color, gradient)
    }

    return []
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
    }
}

export function inputPlayer() {
    let dir = '+x';
    let head = { x: 1, y: 1 };
    let segments = []

    return {
        direction(value, force = false) {
            if (!segments.length || force) return dir = value;
            const { x: dx, y: dy } = dirToXY(value)
            const { x, y } = head
            const { x: sx, y: sy } = segments[0]

            if (x + dx === sx && y + dy === sy) return;

            dir = value
        },
        getDirection() {
            return dir
        },
        snakeMoved(pos = { x: 0, y: 0 }, grow = false) {
            segments.unshift(head)
            head = pos
            if (!grow) {
                segments.pop()
            }
        },
        setSnake({ head: h, segments: s = [] }) {
            head = h
            segments = s
        },
        getSnake() {
            return { head, segments };
        }
    }
}

export function generateSnake(board, length = 5) {
    const head = {
        x: Math.round(board.length / 2),
        y: Math.round(board[0].length / 2),
    }

    return {
        head,
        segments: [...new Array(length - 1)].fill(head)
    }
}

export function movePlayer(player, board) {
    const dead = { board, tickDelay: 500, alive: false, update: [], }

    // get snake
    let head, x, y, segments, update;
    const { x: dx, y: dy } = dirToXY(player.getDirection());
    ({ head, segments } = player.getSnake());
    ({ x, y } = head);

    // out of bounds
    if (!inBounds({ x: dx + x, y: dy + y, }, { xMax: board.length - 1, yMax: board[0].length - 1 })) {
        return dead
    }

    // butt moved
    const { x: sx, y: sy } = segments[segments.length - 1]
    board[sx][sy] = BOARD_STATES.unset

    // check spot
    const newPos = board[x + dx][y + dy]
    if (![BOARD_STATES.unset, BOARD_STATES.food].includes(newPos)) {
        return dead
    }

    // update all positions of the snake
    update = [head, ...segments, { x: x + dx, y: y + dy }]

    const ateFood = BOARD_STATES.food === newPos;

    // move player
    player.snakeMoved({ x: x + dx, y: y + dy }, ateFood);
    ({ head, segments } = player.getSnake());
    const tickDelay = Math.max(125, 500 - 10 * (segments.length - 4))

    if (ateFood) {
        let updates;
        ({ board, updates } = populateFood(board, 1))
        update = [...update, ...updates]
    }

    // update board state based on the players poition
    board[head.x][head.y] = 0;
    for (let i = 0; i < segments.length; i++) {
        const { x, y } = segments[i]
        board[x][y] = i + 1
    }

    return {
        update, board,
        alive: true,
        tickDelay,
    }
}

export function populateFood(board, count = 0) {
    const possibleSpots = []
    const updates = []
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board.length; y++) {
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
        updates.push({ x, y })
    }

    return { board, updates }
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
}