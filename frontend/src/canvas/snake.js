import { fn } from "@/utilities/defaults";
import { boardXY } from "@/utilities/game";

const CELLS = 34;
const COLORS = {
    unset: '#151024',
    gold: '#f8df01',
    food: '#28d7eb',
    green: '#09ff00',
    red: '#f32222',
    white: '#ffffff',
};

export function snakeGameSetup(canvas, gameEnded = fn, achievement = fn) {
    let gameActive = false;
    let tickDelay = 500; // ms
    let playerDirection = '+x';
    let update, board, cellSize, hCycle, sizeRem;
    ({ update, board, cellSize, hCycle, sizeRem } = generateBoard(canvas));

    function updateDirection(e) {
        if (!gameActive) return;
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': return playerDirection = '+y';
            case 'ArrowDown': case 'KeyS': return playerDirection = '-y';
            case 'ArrowRight': case 'KeyD': return playerDirection = '+x';
            case 'ArrowLeft': case 'KeyA': return playerDirection = '-x';
            default: return;
        }
    }

    function resized() {
        ({ update, board, cellSize, hCycle, sizeRem } = generateBoard(canvas, board, hCycle));
    }

    addEventListener('resize', resized);
    addEventListener('keydown', updateDirection);

    return {
        updateDirection,
        pause() {
            gameActive = false;
        },
        unpause() {
            gameActive = true;
            resumeSnake();
        },
        gameStart() {

        },
        unmount() {
            removeEventListener('resize', resized)
            removeEventListener('keydown', updateDirection);
        },
    }
}

const getColor = (color) => COLORS[color] ?? COLORS.unset;

function generateBoard(canvas, currentBoard = [], hCycle = {}) {
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

    let originSize = boardXY(currentBoard);

    const board = [];
    for (let x = 0; x < size[`${size.x}Count`]; x++) {
        board.push(new Array(size[`${size.y}Count`]).fill('unset'));
    }

    if (originSize != boardXY(board)) {
        hCycle = generateHamiltonianCycle(size[`${size.x}Count`], size[`${size.y}Count`]);
    }

    fullDraw(canvas, board, cellSize, sizeRem)

    return {
        board, cellSize, hCycle, sizeRem,
        update: [],
    }
}

function fullDraw(canvas, board, cellSize, sizeRem) {
    console.log(canvas);
    const ctx = canvas.getContext('2d');
    let halfSize = cellSize / 2;
    const { innerHeight, innerWidth } = document.documentElement;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    board.forEach((col, ix) => {
        col.forEach((color, iy) => {
            let x = ix * cellSize + halfSize - sizeRem.x;
            let y = iy * cellSize + halfSize - sizeRem.y;

            // fill initial cell
            ctx.beginPath();
            ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
            ctx.fillStyle = getColor(color);
            ctx.fill();
        });
    });
}

function generateHamiltonianCycle() {

}