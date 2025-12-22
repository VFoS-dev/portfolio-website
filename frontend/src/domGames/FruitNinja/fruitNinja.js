import fruitData from '@/json/fruitData.json';
import { distanceSegmentToPoint } from '@/utilities/math';
import { gameLoop } from '@/utilities/game';

const DIAMETER = 100;

function generateElements() {
  const img = {};
  Object.keys(fruitData).forEach((d) => {
    for (const t of Object.keys(fruitData[d])) {
      const name = t !== 'base' ? `${d}-${t}` : d;
      const test = document.createElement('img');
      test.id = 'canvas-img';
      test.src = fruitData[d][t];
      img[name] = test;
    }
  });
  return img;
}

export function fruitNinja(activePage = false, checkAchievement = () => {}, onLivesUpdate = null, onGameEnd = null) {
  const GRAVITY = 1;
  const SIZE = 4;
  const TAIL_MAX = 5;
  const RANDOM_DELAY = 1250;

  // visuals
  let canvas;
  let ctx;
  let path = [];
  let exiting = false;
  let imgSet;

  // game data
  let gameState = false;
  let fruitMissed = 0;
  let fruitSliced = 0;
  let deltaTime = 0;
  let tick = true;
  let splats = [];
  let sliced = [];
  let fruits = [];
  let queue = [];
  let lives = 3;
  let onLivesChange = onLivesUpdate;
  let onGameOver = onGameEnd;

  function gameStart() {
    imgSet = generateElements();
    // Add bomb image
    const bombImg = document.createElement('img');
    bombImg.id = 'canvas-img';
    // Try webp first, then svg, then fallback to canvas
    bombImg.src = '/images/socials/game/bomb.webp';
    bombImg.onerror = () => {
      bombImg.src = '/images/socials/game/bomb.svg';
      bombImg.onerror = () => {
        // If bomb image doesn't exist, create a simple canvas representation
        const canvas = document.createElement('canvas');
        canvas.width = DIAMETER * 2;
        canvas.height = DIAMETER * 2;
        const ctx = canvas.getContext('2d');
        // Draw a simple bomb (black circle with fuse)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(DIAMETER, DIAMETER, DIAMETER * 0.8, 0, Math.PI * 2);
        ctx.fill();
        // Draw fuse
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(DIAMETER, DIAMETER * 0.2);
        ctx.lineTo(DIAMETER * 0.7, DIAMETER * 0.1);
        ctx.stroke();
        // Draw spark
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(DIAMETER * 0.7, DIAMETER * 0.1, 3, 0, Math.PI * 2);
        ctx.fill();
        bombImg.src = canvas.toDataURL();
      };
    };
    imgSet['bomb'] = bombImg;
    gameState = true;
    lives = 3;
    if (onLivesChange) onLivesChange(lives);
  }

  const gameEnd = () => {
    gameState = false;
  };

  let loopControl = null;

  function setup(_canvas) {
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    if (activePage) {
      document.onmousemove = addVector;
      document.ontouchmove = addVectorTouch;
      const { start, stop, restart } = gameLoop(gameTick, () => (exiting = true));
      loopControl = { start, stop, restart };
    }
  }

  function dismount() {
    if (activePage) {
      document.onmousemove = null;
      document.ontouchmove = null;
      exiting = true;
      if (loopControl) {
        loopControl.stop();
      }
    }
  }

  function generateFruit() {
    const diameter = DIAMETER;
    const left = Math.random() * canvas.width;
    const side = canvas.width / 2 >= left;
    const maxY = canvas.height / 60;
    const chances = Object.keys(fruitData);
    
    // 10% chance to spawn a bomb
    const isBomb = Math.random() < 0.1;

    if (!isBomb) {
      fruitSliced++;
      checkAchievement('fruitCheck1', fruitSliced);
      checkAchievement('fruitCheck2', fruitSliced);
      checkAchievement('fruitCheck3', fruitSliced);
    }

    fruits.push({
      type: isBomb ? 'bomb' : chances[Math.floor(Math.random() * chances.length)].split('-')[0],
      top: canvas.height + diameter,
      diameter,
      left,
      velX: (side * 2 - 1) * (Math.random() * 10 + 2),
      velY: -(30 + Math.random() * maxY),
      rot: 360 * Math.random(),
      velZ: (Math.random() * 2 - 1) * 5,
      frame: 0,
      isBomb,
    });
  }

  function updateData() {
    for (let [i, fruit] of fruits.reverse().entries()) {
      const { top, left, velX, velY, rot, velZ, frame, diameter } = fruit;
      if (velY > 0 && top - diameter > canvas.height) {
        fruits.splice(i, 1);
        // loose health here
        fruitMissed++;
        checkAchievement('fruitEscape', fruitMissed);
        continue;
      }
      fruits[i] = {
        ...fruit,
        top: top + velY,
        left: left + velX,
        rot: rot + velZ,
        frame: frame + 1,
        velY: Math.min(15, velY + GRAVITY),
      };
    }
    for (let [i, slice] of sliced.reverse().entries()) {
      const { top, left, velX, velY, rot, velZ, frame, diameter } = slice;
      if (velY > 0 && top - diameter > canvas.height) {
        sliced.splice(i, 1);
        continue;
      }
      sliced[i] = {
        ...slice,
        top: top + velY,
        left: left + velX,
        rot: rot + velZ,
        frame: frame + 1,
        velY: Math.min(15, velY + GRAVITY),
      };
    }
    for (let [i, splat] of splats.reverse().entries()) {
      if (splat.tick <= 1) {
        splats.splice(i, 1);
        continue;
      }
      splats[i] = { ...splat, tick: splat.tick - 1 };
    }
  }

  function slicedCheck() {
    if (path.length < 2) return;
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = path;
    let update = false;
    const indexes = [];
    let hasBomb = false;

    for (let [i, fruit] of fruits.entries()) {
      const { left: Cx, top: Cy } = fruit;
      const distance = distanceSegmentToPoint(
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: Cx, y: Cy }
      );

      if (isNaN(distance) || distance > fruit.diameter) continue;

      // Check if it's a bomb
      if (fruit.isBomb) {
        hasBomb = true;
        lives--;
        if (onLivesChange) onLivesChange(lives);
        if (lives <= 0) {
          gameState = false;
          if (onGameOver) onGameOver();
        }
        // Remove bomb without slicing animation
        fruits.splice(i, 1);
        continue;
      }

      checkAchievement('fruitcomplete', fruit.type);

      indexes.push(i);
      update = true;
    }

    if (update) {
      const slope = (y1 - y2) / (x1 - x2);
      updateSlice(fruits, indexes, slope);
    }
  }

  function updateSlice(fruits, indexes, slope) {
    const rotate = Math.atan(slope) + Math.PI / 2;
    const offsetX = Math.cos(rotate) * 10;
    const offsetY = Math.sin(rotate) * 10;
    const rot = (Math.tan(slope) * 180) / Math.PI;
    indexes.reverse().forEach((i) => {
      const splat = fruits.splice(i, 1)[0];
      splats.push({
        ...splat,
        type: `${splat.type}-splat`,
        tick: 200,
      });
      sliced.push({
        ...splat,
        rot,
        type: `${splat.type}-top`,
        top: splat.top + offsetY,
        left: splat.left + offsetX,
        velX: offsetX,
        velY: offsetY * 2,
      });
      sliced.push({
        ...splat,
        rot,
        type: `${splat.type}-bottom`,
        top: splat.top - offsetY,
        left: splat.left - offsetX,
        velX: -offsetX,
        velY: -offsetY * 2,
      });
    });
  }

  function addVectorTouch(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }, ...path];
    if (path.length > 1) slicedCheck();
  }

  function addVector(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.pageX, y: e.pageY }, ...path];
    if (path.length > 1) slicedCheck();
  }

  function drawSlice() {
    const colors = ['#4d4d4d', '#6e6e6e', '#969696', '#ffffff'];
    ctx.lineJoin = 'round';

    const vector = [];

    let x = path[0].x;
    let y = path[0].y;

    path.forEach(function (v, index) {
      const { x: dx, y: dy } = path[index + 1] || path[0];

      v.x = x;
      v.y = y;

      vector.push({ x, y });

      x += (dx - v.x) * 0.6;
      y += (dy - v.y) * 0.6;
    });

    vector.reverse();

    colors.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';

      vector.forEach((set, vIndex, sets) => {
        ctx.beginPath();
        ctx.lineTo(set.x, set.y);
        if (vIndex) ctx.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
        ctx.lineWidth =
          SIZE + ((10 * (colors.length - index)) / colors.length) * 2 * ((vIndex + 1) / vector.length);
        ctx.stroke();
      });
    });
  }

  function populateFruit() {
    const count = delaySpawnCount(deltaTime);
    checkAchievement('fruitCatapult', count);
    for (let i = 0; i < count; i++) {
      generateFruit();
    }
  }

  function delaySpawnCount(time, count = 0) {
    if (!queue.length) queue.push(Math.random() * RANDOM_DELAY + 10);
    if (count >= 50) return 50;
    queue[0] -= time;
    if (queue[0] <= 0) {
      const remainingTime = -queue.shift();
      return delaySpawnCount(remainingTime, count + 1);
    }
    return count;
  }

  function drawFruit() {
    for (const { type, top, left, diameter, rot } of [splats, sliced, fruits].flat()) {
      if (!imgSet[type] || !imgSet[type].complete) continue;
      const radius = diameter;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(imgSet[type], -radius, -radius);
      ctx.restore();
    }
  }

  function gameTick(delta) {
    deltaTime = delta;

    if ((tick = !tick)) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    updateData();
    if (gameState) populateFruit();
    drawFruit();
    if (path.length > 1) drawSlice();
    if (exiting) {
      loopControl?.stop();
      return;
    }
  }

  return {
    setup,
    gameEnd,
    gameStart,
    dismount,
    pause: () => loopControl?.stop(),
    unpause: () => {
      if (loopControl && !exiting) {
        // Use start() which works whether loop was started or not
        loopControl.start();
      }
    },
    getLives: () => lives,
  };
}

