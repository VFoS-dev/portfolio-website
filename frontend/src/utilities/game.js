import { fn } from "./defaults";

export function boardXY(board) {
    return `${board.length},${board[0]?.length}`
}


export function gameLoop(callback = fn, hasStopped = fn) {
    let pastTime = 0;
    let active = false;
    let shouldRestart = false;

    function loop(currentTime = 0) {
        let deltaTime = currentTime - pastTime;
        if (deltaTime > 100) deltaTime = 0; // most likely background tab -> refocus
        pastTime = currentTime;

        if (!active) {
            stopping()
            return
        }

        callback(deltaTime);
        requestAnimationFrame(loop)
    }

    function stopping() {
        if (shouldRestart) {
            pastTime = 0;
            active = true;
            shouldRestart = false;
            loop()
        } else hasStopped()
    }

    return {
        start() {
            if (active) return;
            pastTime = 0;
            active = true;
            loop();
        },
        restart() {
            pastTime = 0;
            if (!active) {
                shouldRestart = true;
                loop();
            }
        },
        stop() {
            active = false
        },
    }
}

export function inBounds({ x, y }, { yMax, xMax, xMin = 0, yMin = 0 }) {
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
}

export function random(range = 1, min = 0, magnifier = 1) {
    return (Math.random() * (range - min) + min) * magnifier
}

export function nextId(obj = {}) {
    return Math.max(...Object.keys(obj ?? {}).filter(n => !isNaN(n)), 0) + 1
}

export function randomArray(arr) {
    return arr[Math.floor(random(arr.length))]
}