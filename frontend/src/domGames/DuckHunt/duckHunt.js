import { fn } from "@/utilities/defaults";
import { gameLoop } from "@/utilities/game";
import { Bird, getBirdCount } from "./duckHunt-util";

export function duckHuntSetup(ducks = {}, scoreBoard = fn) {
    for (var i = 0; i < 3; i++) ducks[i] = new Bird(i);
    let score = 0;
    const delay = 24;
    let tick = 0
    let birdCount = Object.keys(ducks).length;

    const { restart, stop } = gameLoop((deltaTime) => {
        tick += deltaTime;
        if (delay > tick) return;
        Object.values(ducks).forEach(duck => duck.move(tick))
        tick -= delay
    })

    function hitDuck(id) {
        if (!ducks[id]) return
        const _score = Math.round(5 + 15 * Math.random());
        ducks[id].hit(_score + '00')
        scoreBoard((score += _score) + '00')

        if (birdCount < getBirdCount(score)) {
            ducks[birdCount] = new Bird(birdCount);
            birdCount = Object.keys(ducks).length;
        }
    }

    function removeDuck(id) {
        ducks[id].respawn();
    }

    return {
        pause: stop,
        unpause: restart,
        unmount: stop,
        removeDuck,
        hitDuck,
    }
}