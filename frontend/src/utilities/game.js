import { fn } from "./defaults";

export function boardXY(board) {
    return `${board.length},${board[0]?.length}`
}


export function gameLoop(callback = fn, hasStopped = fn) {
    let pastTime = 0;
    let active = false;
    let shouldRestart = false;

    function loop(currentTime = 0) {
        const deltaTime = currentTime - pastTime;
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
        } else {
            hasStopped()
        }
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
            if (active) {
                active = true;
                shouldRestart = true;
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