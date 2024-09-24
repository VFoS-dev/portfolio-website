import { fn } from "@/utilities/defaults";
import { gameLoop, nextId, random } from "@/utilities/game";
import { Bird, Dog, getBirdCount, reId } from "./duckHunt-util";

export function duckHuntSetup(ducks = {}, dogs = {}, scoreBoard = fn) {
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

        if (!Object.keys(dogs).length) {
            dogs[1] = new Dog(1)
        }
    }

    const { restart, stop } = gameLoop((deltaTime) => {
        tick += deltaTime;
        if (delay > tick) return;
        let allAlive = true;
        Object.values(birds).forEach(bird => {
            const escaped = bird.move(tick);
            if (!bird.alive) allAlive = false
            if (bird.id > birds.count) reId(birds, bird)
            if (!escaped || bird.escapedCount < 3) return;
            if (birds.count <= 3) return;

            delete birds[bird.id]
        })

        Object.values(dogs).forEach(dog => {
            dog.update({ deltaTime: tick, alive: allAlive })
        })

        tick -= delay;
    })

    function hitDuck(id) {
        if (!birds[id]) return

        Object.values(dogs).forEach(dog => {
            dog.birdHit(birds[id])
        })

        const _score = Math.round(random(20, 5));
        birds[id].hit(_score + '00')
        scoreBoard((score += _score) + '00')

        if (birds.count < getBirdCount(score)) {
            const id = nextId(birds)
            birds[id] = new Bird(id);
        }
    }

    function removeDuck(id) {
        console.log('duck respawned');

        birds[id].respawn();
    }

    init()

    return {
        pause: stop,
        unpause: restart,
        unmount: stop,
        removeDuck,
        hitDuck,
        dogNextState: (e) => {
            Object.values(dogs).forEach(dog => {
                dog.nextState(e)
            })
        },
    }
}