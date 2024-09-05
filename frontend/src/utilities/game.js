import { fn } from "./defaults";

export function boardXY(board) {
    return `${board.length},${board[0]?.length}`
}


export function gameLoop(callback = fn, hasStopped = fn) {
    let pastTime = 0;
    let active = false;

    function loop(currentTime = 0) {
        const deltaTime = currentTime - pastTime;
        pastTime = currentTime;

        if (!active) {
            hasStopped()
            return
        }

        callback(deltaTime);
        requestAnimationFrame(loop)
    }

    return {
        start() {
            if (active) return;
            pastTime = 0;
            active = true;
            loop();
        },
        stop() {
            active = false
        },
    }
}