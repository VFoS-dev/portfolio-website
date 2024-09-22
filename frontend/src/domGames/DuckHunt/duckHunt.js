import { fn } from "@/utilities/defaults";
import { gameLoop, nextId, random } from "@/utilities/game";
import { Bird, getBirdCount } from "./duckHunt-util";

export function duckHuntSetup(ducks = {}, scoreBoard = fn) {
    let count = 0;
    let score = 0;
    const delay = 24;
    let tick = 0;

    const birds = new Proxy(ducks, {
        get: (bird, id) => (id === 'count') ? count : bird[id],
        set: (...args) => (Reflect.set(...args), count = Object.keys(ducks).length, true),
        deleteProperty: (bird, id) => (delete bird[id], count = Object.keys(ducks).length, true),
    })

    function init() {
        while (birds.count < 3) {
            const id = nextId(birds)
            birds[id] = new Bird(id);
            const bird = birds[id]
            bird.type = bird.types[id % bird.types.length]
        }
    }

    const { restart, stop } = gameLoop((deltaTime) => {
        tick += deltaTime;
        if (delay > tick) return;
        Object.values(birds).forEach(bird => {
            bird.move(tick);
            if (bird.escapedCount < 2) return;
            if (birds.count <= 3) return;

            delete birds[bird.id]
        })
        tick -= delay;
    })

    function hitDuck(id) {
        if (!birds[id]) return

        const _score = Math.round(random(20, 5));
        birds[id].hit(_score + '00')
        scoreBoard((score += _score) + '00')

        if (birds.count < getBirdCount(score)) {
            const id = nextId(birds)
            birds[id] = new Bird(id);
        }
    }

    function removeDuck(id) {
        birds[id].respawn();
    }

    init()

    return {
        pause: stop,
        unpause: restart,
        unmount: stop,
        removeDuck,
        hitDuck,
    }
}