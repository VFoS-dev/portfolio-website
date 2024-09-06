import { fn } from "@/utilities/defaults";
import { gameLoop } from "@/utilities/game";
import { drawUpdated, generateBoard, inputPlayer, generateSnake, movePlayer, fullDraw, BOARD_STATES, populateFood } from "./snake-util";

export function snakeGameSetup(canvas, gameEnded = fn) {
    let tickDelay = 500;
    let loopEnded = true;
    let isPlayer = false;
    let alive = false;
    let snakeColors = ['green', 'gold', -1]
    const player = inputPlayer();
    let update, board, cellSize, sizeRem, botDelay;
    ({ update, board, cellSize, sizeRem } = generateBoard(canvas));

    const { start, restart, stop } = gameLoop((deltaTime) => {
        tickDelay -= deltaTime;

        if (tickDelay > 0) return;

        if (isPlayer) {
            ({ update, board, alive, tickDelay } = movePlayer(player, board));
        }

        // draw changed 
        update = drawUpdated(canvas, board, update, cellSize, sizeRem, snakeColors)

        if (alive) return;

        // player has died
        stop()
        restartBot()

        if (isPlayer) {
            gameEnded()
        }
    }, () => loopEnded = true)

    function gameStart(isBot = false) {
        if (isBot) return console.log('bot');
        isPlayer = !isBot;
        if (botDelay) botDelay = clearTimeout(botDelay)
        board = board.map(x => x.map(y => BOARD_STATES.unset));

        // create snake
        const snake = generateSnake(board);
        player.setSnake(snake);
        player.direction('+x', true);

        ({ board } = populateFood(board, !isBot * 4 + 1));

        fullDraw(canvas, board, cellSize, sizeRem);

        // start loop
        if (loopEnded) start();
        else restart();

        loopEnded = false;
    }

    function updateDirection(e) {
        if (!isPlayer) return;

        switch (e.code) {
            case 'ArrowUp': case 'KeyW': return player.direction('-y');
            case 'ArrowDown': case 'KeyS': return player.direction('+y');
            case 'ArrowRight': case 'KeyD': return player.direction('+x');
            case 'ArrowLeft': case 'KeyA': return player.direction('-x');
            default: return;
        }
    }

    function restartBot() {
        botDelay = setTimeout(gameStart, 1000, true)
    }

    function resized() {
        ({ update, board, cellSize, sizeRem } = generateBoard(canvas));
        stop()
        gameEnded()
    }

    addEventListener('resize', resized);
    addEventListener('keydown', updateDirection);

    return {
        updateDirection,
        gameStart,
        pause() {
            stop();
            console.log('pause');
        },
        unpause() {
            if (alive) start();
            else gameStart(true)
            console.log('pause');

        },
        unmount() {
            stop();
            removeEventListener('resize', resized);
            removeEventListener('keydown', updateDirection);
        },
    }
}
