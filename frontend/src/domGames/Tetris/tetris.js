import { gameLoop } from "@/utilities/game";
import { generateQueue, moveShape, newActiveShape } from "./tetris-utils";
import { fn } from "@/utilities/defaults";

export function tetrisSetup(game = { blocks: [], queue: [], hold: {} }, gameEnded = fn) {
    let randomPool = [];
    let currentShape;
    let shadowShape;
    let setPeices = {};
    let gameActive = false;
    const bounds = { yMax: 23, xMax: 9, xMin: 0, yMin: 0, xMid: 4 }
    let heldShape;
    let tick = 50;
    let time = 0;

    const { restart, stop } = gameLoop((deltaTime) => {
        if (!gameActive) return;
        if ((time += deltaTime) < tick) return
        time %= tick;

        if (!currentShape) {

            ({ currentShape, shadowShape, randomPool, gameActive } = newActiveShape(game, setPeices, randomPool, bounds));
            if (!gameActive) gameEnded()
        } else ({ currentShape, setPeices } = moveShape(setPeices, currentShape, bounds));



        game.blocks = [
            ...currentShape ?? [],
            ...Object.values(setPeices)
        ].flat()
    })

    function play() {
        randomPool = generateQueue(game)
        shadowShape = currentShape = heldShape = null;
        gameActive = true;
        setPeices = {};
        time = 0
    }

    return {
        pause: stop,
        unpause: restart,
        unmount: stop,
        play,
    }
}