import { rots } from "../_reducers/rotation";

export function snakeGame(activePage = false, endGame = () => { }, checkAchievement = () => { }) {
    const CELLS = 34;
    let canvas,
        colors = {
            unset: '#151024',
            gold: '#f8df01',
            food: '#28d7eb',
            green: '#09ff00',
            red: '#f32222',
            white: '#ffffff',
        },
        gamefield = [],
        cellSize,
        ctx,
        step = 500,
        currentStep = step,
        snake = [],
        update = [],
        exiting = false,
        deltaTime = 0,
        pastTime = 0,
        aFruit, player;

    function setup(_canvas) {
        document.addEventListener('keydown', keyPress);
        canvas = _canvas;
        const { clientHeight, clientWidth } = document.documentElement;

        canvas.height = clientHeight;
        canvas.width = clientWidth;
        ctx = canvas.getContext('2d');

        cellSize = clientWidth / CELLS;
        let vertical = Math.floor(clientHeight / cellSize);

        for (let x = 0; x < CELLS; x++)
            gamefield.push(new Array(vertical).fill('unset'));

        // Example dimensions
        cycle = generateHamiltonianCycle(CELLS, vertical);

        fullreDraw();
        gameStart(false);
    }

    function fullreDraw() {
        let halfSize = cellSize / 2;
        const { clientHeight, clientWidth } = document.documentElement;
        ctx.clearRect(0, 0, clientWidth, clientHeight);
        gamefield.forEach((col, ix) => {
            col.forEach((color, iy) => {
                let x = ix * cellSize + halfSize;
                let y = iy * cellSize + halfSize;

                // fill initial cell
                ctx.beginPath();
                ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
                ctx.fillStyle = colors[color];
                ctx.fill();
            });
        });
    }

    function draw() {
        let halfSize = cellSize / 2;
        for (const { x: ix, y: iy } of update) {
            let x = ix * cellSize + halfSize;
            let y = iy * cellSize + halfSize;

            // clear
            ctx.clearRect(ix * cellSize, iy * cellSize, cellSize, cellSize);
            let color = gamefield[ix][iy];

            // fill in gradient
            if (color != 'unset' && color != 'white') {
                const gradient = ctx.createRadialGradient(x, y, halfSize / 3, x, y, halfSize);
                gradient.addColorStop(0, colors[color] + '7E');
                gradient.addColorStop(1, colors[color] + '00');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - cellSize, y - cellSize, x + cellSize, y + cellSize);
            }

            // fill initial cell
            ctx.beginPath();
            ctx.arc(x, y, halfSize / 3, 0, 2 * Math.PI);
            ctx.fillStyle = colors[color];
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
        let k = {
            87: "top",
            65: "left",
            83: "bottom",
            68: "right",
        }[keyCode];
        if (!k) return;
        const { head: { x, y }, segments, player } = snake;
        if (!player) return;
        const { dx, dy } = move[k];
        const { x: sx, y: sy } = segments.length ? segments[0] : {};
        if (!(sx == x + dx && sy == y + dy)) snake.dir = k;

    }

    function gameStart(_player = true) {
        player = _player
        pastTime = 0;
        exiting = false;
        gamefield = gamefield.map(a => a.map(b => 'unset'));
        fullreDraw();
        step = 500 * player + !player * 100;

        let x = Math.floor(gamefield.length / 4);
        let y = Math.floor(gamefield[x].length / 2);
        update.push({ x, y });
        let segments = []
        snake = { dir: 'right', segments, head: { x, y, color: 'gold' }, player };
        gamefield[x][y] = 'gold';
        populateFood(player * 5 + !player);

        requestAnimationFrame(gameLoop);
    }

    function newSegment(x, y, length) {
        const { hLength, checkpoints, secretLength } = rots
        if (!hLength || (length >= hLength && secretLength > hLength)) {
            return { x, y, color: 'white' };
        }
        if (secretLength === hLength && !checkpoints.includes(false)) {
            return { x, y, color: 'gold' };
        }
        if (checkpoints[length % hLength]) {
            return { x, y, color: 'green' };
        }
        else {
            return { x, y, color: 'red' };
        }
    }

    function updateAi() {
        if (player) return;

        let counts = countAvailable(snake, aFruit, gamefield);
        let closest = checkPath(snake.head, aFruit, gamefield, ({ fruitIndex, dirIndex, closeIndex, dir }) => counts[dir] >= snake.segments.length && fruitIndex >= dirIndex && (closeIndex < dirIndex || !closeIndex));
        if (!closest.index) {
            closest = checkPath(snake.head, aFruit, gamefield, ({ dirIndex, closeIndex }) => closeIndex < dirIndex);
        }

        console.log(counts[closest.dir], snake.segments.length);
        if (counts[closest.dir] < snake.segments.length + 1) {
            console.log(counts[closest.dir], snake.segments.length, closest.dir, counts, 'here');
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
                snake.segments.push(newSegment(x, y, snake.segments.length));
                gamefield[tx][ty] = color;
                update.push({ x, y });
                step = Math.max(100 * player + !player * 50, step * 10 / 11);
                populateFood(1);
                break;
            default:
                return gameLost();
        }

        snake.head = { color, x: tx, y: ty, }
        update.push({ x: tx, y: ty, });
        if (!segments.length) gamefield[x][y] = 'unset';
        gamefield[tx][ty] = color;

    }

    function gameLost() {
        const { head, segments } = snake;
        [head, ...segments].forEach(({ x, y }) => {
            gamefield[x][y] = 'unset'
            update.push({ x, y })
        })
        if (player) {
            exiting = true;
            document.removeEventListener('keydown', keyPress);
            endGame();
        } else {
            console.log('dege');
            cycle = generateHamiltonianCycle(gamefield.length, gamefield[0].length);
            gameStart(false)
        }
    }

    function gameLoop(time = 0) {
        deltaTime = time - pastTime;
        pastTime = time;
        currentStep -= deltaTime;

        if (currentStep <= 0) {
            updateAi()
            updateMovement(currentStep);
        }
        if (!exiting) {
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    function dismount() {
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
    console.log(dir, segments.length);
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