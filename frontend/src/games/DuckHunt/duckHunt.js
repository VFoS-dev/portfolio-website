import { fn } from '@/utilities/defaults';
import { gameLoop, nextId, random } from '@/utilities/game';
import { Bird, Dog, getBirdCount, reId } from './duckHunt-util';

export function duckHuntSetup(ducks = {}, dogs = {}, scoreBoard = fn) {
  let count = 0;
  let score = 0;
  const delay = 33; // Reduced from 50ms to 33ms (~30fps update rate for smoother movement)
  let tick = 0;
  let isPaused = false;

  // Cache arrays to avoid repeated Object.values() calls
  let birdsArray = [];
  let dogsArray = [];
  let arraysDirty = true; // Flag to track if arrays need updating
  
  function updateArrays() {
    birdsArray = Object.values(ducks);
    dogsArray = Object.values(dogs);
    arraysDirty = false;
  }

  const birds = new Proxy(ducks, {
    get: (bird, id) => (id === 'count' ? count : bird[id]),
    set: (...args) => {
      Reflect.set(...args);
      count = Object.keys(ducks).length;
      arraysDirty = true; // Mark arrays as dirty
      return true;
    },
    deleteProperty: (bird, id) => {
      delete bird[id];
      count = Object.keys(ducks).length;
      arraysDirty = true; // Mark arrays as dirty
      return true;
    },
  });

  function init() {
    while (birds.count < 3) {
      const id = nextId(birds);
      birds[id] = new Bird(id);
      const bird = birds[id];
      bird.type = bird.types[id % bird.types.length];
    }

    if (!Object.keys(dogs).length) {
      dogs[1] = new Dog(1);
    }
    updateArrays(); // Initialize arrays
  }

  const { restart, stop } = gameLoop(deltaTime => {
    if (isPaused) return;
    
    tick += deltaTime;
    if (delay > tick) return;
    
    // Update cached arrays if they're dirty
    if (arraysDirty) {
      updateArrays();
    }
    
    let allAlive = true;
    // Use for loop instead of forEach for better performance
    for (let i = 0; i < birdsArray.length; i++) {
      const bird = birdsArray[i];
      if (!bird) continue; // Skip if bird was deleted
      
      const escaped = bird.move(tick);
      if (!bird.alive) allAlive = false;
      if (bird.id > birds.count) reId(birds, bird);
      if (!escaped || bird.escapedCount < 3) continue;
      if (birds.count <= 3) continue;

      delete birds[bird.id];
      arraysDirty = true; // Mark arrays as dirty after deletion
    }

    for (let i = 0; i < dogsArray.length; i++) {
      dogsArray[i].update({ deltaTime: tick, alive: allAlive });
    }

    tick -= delay;
  });

  function hitDuck(id) {
    if (!birds[id]) return;

    // Update arrays if dirty
    if (arraysDirty) updateArrays();
    
    for (let i = 0; i < dogsArray.length; i++) {
      dogsArray[i].birdHit(birds[id]);
    }

    const _score = Math.round(random(20, 5));
    birds[id].hit(_score + '00');
    scoreBoard((score += _score) + '00');

    if (birds.count < getBirdCount(score)) {
      const id = nextId(birds);
      birds[id] = new Bird(id);
      arraysDirty = true; // Mark as dirty when new bird is added
    }
  }

  function removeDuck(id) {
    console.log('duck respawned');

    birds[id].respawn();
    arraysDirty = true; // Mark as dirty after respawn
  }

  init();

  return {
    pause: () => {
      isPaused = true;
      stop();
    },
    unpause: () => {
      isPaused = false;
      updateArrays(); // Refresh arrays when resuming
      restart();
    },
    unmount: () => {
      isPaused = true;
      stop();
    },
    removeDuck,
    hitDuck,
    dogNextState: e => {
      // Update arrays if dirty
      if (arraysDirty) updateArrays();
      for (let i = 0; i < dogsArray.length; i++) {
        dogsArray[i].nextState(e);
      }
    },
  };
}
