import { rots } from "../_reducers/rotation";

export const setKey = (key) => touchKey = key;

let keyCodes = {
    38: 'top', 87: "top",
    37: 'left', 65: "left",
    40: 'bottom', 83: "bottom",
    39: 'right', 68: "right",
};

let touchKey;

export function snakeGame(activePage = false, endGame = () => { }, checkAchievement = () => { }) {
    const CELLS = 34,
        COLORS = {
            unset: '#151024',
            gold: '#f8df01',
            food: '#28d7eb',
            green: '#09ff00',
            red: '#f32222',
            white: '#ffffff',
        };
    let canvas, sizeRemX, sizeRemY, cellSize, aFruit, player, ctx, snake,
        gamefield = [], update = [],
        step = 500,
        currentStep = step,
        exiting = false,
        deltaTime = 0, pastTime = 0;

    function setup(_canvas) {
        canvas = _canvas;
        generateBoard()

        if (activePage) {
            document.addEventListener('keydown', keyPress);
            window.addEventListener('resize', generateBoard);
            gameStart(false);
        }
    }

    const noRotate = (bool) => window.dispatchEvent(new CustomEvent("custom-changeRot", { detail: bool }));
    const hideNavbar = (bool) => window.dispatchEvent(new CustomEvent("custom-hideNavbar", { detail: bool }));
    const getColor = (color) => COLORS[color] ?? COLORS.unset;

    function generateBoard({ type = null } = {}) {
        const { clientHeight, clientWidth } = document.documentElement;
        let size = (clientHeight > clientWidth) ?
            { longer: clientHeight, shorter: clientWidth, x: 'shorter', y: 'longer', longerCount: 0, shorterCount: 0 } :
            { longer: clientWidth, shorter: clientHeight, x: 'longer', y: 'shorter', longerCount: 0, shorterCount: 0 }

        canvas.height = clientHeight;
        canvas.width = clientWidth;
        ctx = canvas.getContext('2d');

        cellSize = size.longer / CELLS;
        size.longerCount = CELLS;
        size.shorterCount = Math.max(2, Math.floor(size.shorter / cellSize));
        if (size.shorterCount % 2) size.shorterCount--;

        sizeRemX = (size[`${size.x}Count`] * cellSize - size[`${size.x}`]) / 2;
        sizeRemY = (size[`${size.y}Count`] * cellSize - size[`${size.y}`]) / 2;

        let originSize = `${gamefield?.length},${gamefield[0]?.length}`;

        gamefield = [];
        for (let x = 0; x < size[`${size.x}Count`]; x++)
            gamefield.push(new Array(size[`${size.y}Count`]).fill('unset'));

        if (originSize != `${gamefield.length},${gamefield[0].length}`)
            cycle = generateHamiltonianCycle(size[`${size.x}Count`], size[`${size.y}Count`]);
        update = [];
        fullreDraw();
        if (snake) gameLost(type);
    }

    function fullreDraw() {
        let halfSize = cellSize / 2;
        const { clientHeight, clientWidth } = document.documentElement;
        ctx.clearRect(0, 0, clientWidth, clientHeight);
        gamefield.forEach((col, ix) => {
            col.forEach((color, iy) => {
                let x = ix * cellSize + halfSize - sizeRemX;
                let y = iy * cellSize + halfSize - sizeRemY;

                // fill initial cell
                ctx.beginPath();
                ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
                ctx.fillStyle = getColor(color);
                ctx.fill();
            });
        });
    }

    function draw() {
        let halfSize = cellSize / 2;
        for (const { x: ix, y: iy } of update) {
            let x = ix * cellSize + halfSize - sizeRemX;
            let y = iy * cellSize + halfSize - sizeRemY;

            // clear
            ctx.clearRect(x - halfSize, y - halfSize, cellSize, cellSize);
            let color = gamefield[ix][iy];

            // fill in gradient
            if (color != 'unset' && color != 'white') {
                const gradient = ctx.createRadialGradient(x, y, halfSize / 3, x, y, halfSize);
                gradient.addColorStop(0, getColor(color) + '7E');
                gradient.addColorStop(1, getColor(color) + '00');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - cellSize, y - cellSize, x + cellSize, y + cellSize);
            }

            // fill initial cell
            ctx.beginPath();
            ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
            ctx.fillStyle = getColor(color);
            ctx.fill();
        }
        update = [];
    }

    function populateFood(total = 1) {
        let available = []
        gamefield.forEach((r, x) => r.forEach((color, y) => { if (color == 'unset') available.push({ x, y }) }));
        while (total--) {
            if (!available.length) {
                console.log('no available food you win!');
                break;
            }
            let index = Math.floor(Math.random() * available.length)
            let { x, y } = available[index];
            if (!player) aFruit = [x, y];
            update.push({ x, y })
            available.splice(index, 1)
            gamefield[x][y] = 'food';
        }
    }

    function keyPress({ keyCode }) {
        let k = keyCodes[keyCode];
        if (!k) return;
        const { head: { x, y }, segments, player } = snake;
        if (!player) return;
        const { dx, dy } = move[k];
        const { x: sx, y: sy } = segments.length ? segments[0] : {};
        if (!(sx == x + dx && sy == y + dy)) snake.dir = k;
    }

    function gameStart(_player = true) {
        touchKey = null;
        const { hLength, checkpoints, secretLength } = rots;
        player = _player
        pastTime = 0;
        exiting = false;
        gamefield = gamefield.map(a => a.map(b => 'unset'));
        fullreDraw();
        step = 200 * player + 100;

        let x = Math.floor(gamefield.length / 4);
        let y = Math.floor(gamefield[x].length / 2);
        update.push({ x, y });
        let segments = [];
        if (player) {
            noRotate(true);
            hideNavbar(true);
            [... new Array(9)].forEach((a, i) => segments.push(newSegment(x, y, i + 1)))
            document.addEventListener('keydown', keyPress);
            if (!hLength) checkAchievement('snakeStar');
            if (secretLength === hLength) {
                checkAchievement('snakeLights')
                if (!checkpoints.includes(false)) checkAchievement('snakeGolden')
            }
        }
        snake = { dir: 'right', segments, head: newSegment(x, y, 0), player };
        gamefield[x][y] = 'gold';
        populateFood(player * 5 + !player);

        requestAnimationFrame(gameLoop);
    }

    function newSegment(x, y, length) {
        const { hLength, checkpoints, secretLength } = rots
        if (secretLength === hLength && !checkpoints.includes(false) || !hLength && !length) {
            return { x, y, color: 'gold' };
        }
        if ((length >= hLength && secretLength > hLength)) {
            return { x, y, color: 'white' };
        }
        if (checkpoints[length % hLength]) {
            return { x, y, color: 'green' };
        } else {
            return { x, y, color: 'red' };
        }
    }

    function updateAi() {
        if (player) return;
        let counts, closest
        counts = countAvailable(snake, aFruit, gamefield);
        closest = checkPath(snake.head, aFruit, gamefield, ({ fruitIndex, dirIndex, closeIndex, dir }) => counts[dir] >= snake.segments.length && fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));
        if (!closest.index) {
            closest = checkPath(snake.head, aFruit, gamefield, ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
        }

        if (counts[closest.dir] < snake.segments.length + 1) {
            closest.dir = counts.max.dir ?? closest.dir;
        }
        snake.dir = closest.dir;
    }

    function updateMovement() {
        currentStep = step;
        const { dir, segments, head } = snake;
        snake.segments = segments.map(({ x, y, color }, i) => {
            update.push({ x, y });
            gamefield[x][y] = 'unset';
            let pos = i ? { ...segments[i - 1], color } : { ...head, color };
            gamefield[pos.x][pos.y] = color;
            return pos;
        })
        snake.segments.forEach(({ x, y, color }) => gamefield[x][y] = color)

        const { x, y, color } = head;
        update.push({ x, y });
        const { dx, dy } = move[dir];
        let tx = x + dx;
        let ty = y + dy;

        if (tx < 0 || tx >= gamefield.length || ty < 0 || ty >= gamefield[0].length)
            return gameLost()
        switch (gamefield[tx][ty]) {
            case 'unset': break;
            case 'food':
                snake.segments.push(newSegment(x, y, snake.segments.length + 1));
                gamefield[tx][ty] = color;
                update.push({ x, y });
                step = Math.max(75 * player + 50, step - 5);
                populateFood(1);
                break;
            default:
                if (player) checkAchievement('snakeOuroboros')
                return gameLost();
        }

        snake.head = { color, x: tx, y: ty, }
        update.push({ x: tx, y: ty, });
        if (!segments.length) gamefield[x][y] = 'unset';
        gamefield[tx][ty] = color;
    }

    let resetTimer;
    function gameLost(e) {
        if (snake) {
            const { head, segments } = snake;
            [head, ...segments].forEach(({ x, y }) => {
                gamefield[x][y] = 'unset'
                update.push({ x, y })
            })
            snake = null;
        }

        if (resetTimer) resetTimer = clearTimeout(resetTimer)

        if (player) {
            noRotate(false);
            hideNavbar(false);
            exiting = true;
            document.removeEventListener('keydown', keyPress);
            endGame();
            resetTimer = setTimeout(() => gameStart(false), !e * 3000 + 1000)
        } else {
            if (e != 'resize') checkAchievement('snakeAI')
            cycle = generateHamiltonianCycle(gamefield.length, gamefield[0].length);
            resetTimer = setTimeout(() => gameStart(false), !!e * 1000);
            endGame();
        }
    }

    function gameLoop(time = 0) {
        deltaTime = time - pastTime;
        pastTime = time;
        currentStep -= deltaTime;

        if (touchKey) {
            keyPress({ keyCode: touchKey })
            touchKey = null;
        }

        if (currentStep <= 0 && snake) {
            updateAi()
            updateMovement(currentStep);
        }
        if (!exiting) {
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    function dismount() {
        noRotate(false);
        hideNavbar(false);
        document.removeEventListener('keydown', keyPress);
        exiting = true;
    }

    return {
        setup,
        gameStart,
        dismount,
    }
}
let move = {
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
    top: { dx: 0, dy: -1 },
    bottom: { dx: 0, dy: 1 },
}

let cycle = {}

function generateHamiltonianCycle(_x, _y) {
    let temp = new Array(_x).fill(false).map((a, x) => new Array(_y).fill(false).map((a, y) => {
        if (!x && !y) return { dir: 'bottom' };
        if (!y) return { dir: 'left' };
        if (y == 1 && x == _x - 1) return { dir: 'top' };
        if (!(x % 2) && y == _y - 1) return { dir: 'right' };
        if (x % 2 && y == _y - 1) return { dir: 'top' };
        if (!(x % 2) && y == 1) return { dir: 'bottom' };
        if (x % 2 && y == 1) return { dir: 'right' };
        if (!x) return { dir: 'bottom' };
        if (!(x % 2)) return { dir: 'bottom' };
        if (x % 2) return { dir: 'top' };
    }));

    let x = 0, y = 0, index = 0;
    let next = move[temp[x][y].dir]
    temp[x][y].index = index;
    x = x + next.dx;
    y = y + next.dy;
    index += 1;
    while (x || y) {
        let next = move[temp[x][y].dir]
        temp[x][y].index = index;
        x = x + next.dx;
        y = y + next.dy;
        index += 1;
    }

    // flip upside down
    if (Math.round(Math.random()))
        temp = temp.map(t => t.reverse())

    // flip horizontally
    if (Math.round(Math.random())) {
        temp = temp.reverse()
        let swap = { right: 'left', left: 'right', }
        temp = temp.map(t => t.map(a => swap[a] ?? a))
    }

    return temp
}

function checkPath(snakeHead, fruit, gamefield, callback = () => { }) {
    const { x: _x, y: _y } = snakeHead;
    const [fx, fy] = fruit;
    const boardSize = gamefield.length * gamefield[0].length;
    const headIndex = cycle[_x][_y].index;
    let fruitIndex = (cycle[fx][fy].index - headIndex) % boardSize; // prevents -0
    if (fruitIndex < 0) fruitIndex += boardSize;
    let closest = { index: 0, dir: cycle[_x][_y].dir }
    Object.keys(move).forEach(m => {
        const { dx, dy } = move[m];
        const x = _x + dx, y = _y + dy;
        try {
            const spotData = gamefield[x][y]
            if (spotData != 'unset' && spotData != 'food') return;
        } catch { return; }

        let dirIndex = (cycle[x][y].index - headIndex) % boardSize;
        if (dirIndex < 0) dirIndex += boardSize;
        if (callback({ fruitIndex, dirIndex, closeIndex: closest.index, dir: m })) {
            closest = {
                index: dirIndex,
                dir: m,
            }
        }
    })
    return closest;
}

function countAvailable(snake, fruit, gamefield) {
    const { head: { x: _x, y: _y }, segments } = snake;
    let mustHave = segments.length + 5;
    let dir = { max: { count: 0 } }
    Object.keys(move).forEach(m => {
        const { dx, dy } = move[m];
        let x = _x + dx, y = _y + dy;
        let set = new Set([`${_x},${_y}`, `${x},${y}`, ...segments.map(({ x, y }) => `${x},${y}`)])
        if (x < 0 || x >= gamefield.length || y < 0 || y >= gamefield[0].length || (gamefield[x][y] != 'unset' && gamefield[x][y] != 'food')) return dir[m] = 0
        dir[m] = countRecursive(x, y, gamefield, fruit, mustHave, set).size - 1;
        if (dir.max.count < dir[m]) dir.max = { count: dir[m], dir: m };
    })
    return dir;
}

function countRecursive(_x, _y, gamefield = [], fruit, endif = 0, currentSet = new Set()) {
    currentSet.add(`${_x},${_y}`);
    if (currentSet.size < endif) {

        try {
            let closest = checkPath2({ x: _x, y: _y }, fruit, gamefield, currentSet,
                ({ fruitIndex, dirIndex, closeIndex }) => fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));
            if (!closest.index) {
                closest = checkPath2({ x: _x, y: _y }, fruit, gamefield, currentSet,
                    ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
            }

            const { dx, dy } = move[closest.dir];
            let x = _x + dx, y = _y + dy;

            switch (gamefield[x][y]) {
                case 'food': if (!currentSet.has(`${x},${y}`)) endif++;
                case 'unset':
                    if (!currentSet.has(`${x},${y}`) && gamefield[x][y] === 'unset')
                        currentSet = new Set([...currentSet, ...countRecursive(x, y, gamefield, fruit, endif, currentSet)]);
                default:
                    break;
            }
        } catch { return currentSet; }
    }
    return currentSet;
}

function checkPath2(snakeHead, fruit, gamefield, currentSet, callback = () => { }) {
    const { x: _x, y: _y } = snakeHead;
    const [fx, fy] = fruit;
    const boardSize = gamefield.length * gamefield[0].length;
    const headIndex = cycle[_x][_y].index;
    let fruitIndex = (cycle[fx][fy].index - headIndex) % boardSize; // prevents -0
    if (fruitIndex < 0) fruitIndex += boardSize;
    let closest = { index: 0, dir: cycle[_x][_y].dir }
    Object.keys(move).forEach(m => {
        const { dx, dy } = move[m];
        const x = _x + dx, y = _y + dy;
        try {
            const spotData = gamefield[x][y]
            if (spotData != 'unset' && spotData != 'food' || !currentSet.has(`${x},${y}`)) return;
        } catch { return; }

        let dirIndex = (cycle[x][y].index - headIndex) % boardSize;
        if (dirIndex < 0) dirIndex += boardSize;
        if (callback({ fruitIndex, dirIndex, closeIndex: closest.index })) {
            closest = {
                index: dirIndex,
                dir: m,
            }
        }
    })
    return closest;
}