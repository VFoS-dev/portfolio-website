import { fn } from "@/utilities/defaults";
import { gameLoop } from "@/utilities/game";
import { Bird, getBirdCount } from "./duckHunt-util";

export function duckHuntSetup(ducks = {}, scoreBoard = fn) {
    for (var i = 0; i < 2; i++) ducks[i] = new Bird(i);
    let score = 0;
    let delay = 5;
    let tick = 0;
    let birdCount = Object.keys(ducks).length;
    const { start, stop } = gameLoop((deltaTime) => {
        if (tick++ % delay) return;
        tick %= delay

        Object.values(ducks).forEach(duck => duck.move(deltaTime * delay))
    })

    function hitDuck(id) {
        if (!ducks[id]) return
        const _score = Math.round(5 + 15 * Math.random());
        ducks[id].hit(_score + '00')
        scoreBoard((score += _score) + '00')
    }

    function removeDuck(id) {
        ducks[id].respawn();
        if (birdCount < getBirdCount(score)) {
            ducks[birdCount] = new Bird(birdCount);
            birdCount = Object.keys(ducks).length;
        }
    }

    return {
        pause: stop,
        unpause: start,
        unmount: stop,
        removeDuck,
        hitDuck,
    }
}