import fruitData from '@/json/fruitData.json';
import { distanceSegmentToPoint } from '@/utilities/math';
import { gameLoop } from '@/utilities/game';

const DIAMETER = 100;
const MIN_DIAMETER = 60;
const MAX_DIAMETER = 140;

function generateElements() {
  const img = {};
  const defaultSplatPath = '/images/socials/game/splat.webp';
  const basePath = '/images/socials/game/fruit';
  const imageTypes = ['whole', 'top', 'bottom'];
  
  fruitData.forEach((fruitName) => {
    // Create images for whole, top, and bottom
    imageTypes.forEach((type) => {
      const imageName = type !== 'whole' ? `${fruitName}-${type}` : fruitName;
      const imgElement = document.createElement('img');
      imgElement.id = 'canvas-img';
      imgElement.src = `${basePath}/${fruitName}/${type}.webp`;
      img[imageName] = imgElement;
    });
    
    // Create splat image with fallback logic
    const splatImg = document.createElement('img');
    splatImg.id = 'canvas-img';
    const fruitSplatPath = `${basePath}/${fruitName}/splat.webp`;
    
    // Try fruit-specific splat first, fallback to default
    splatImg.onerror = function() {
      // Only fallback if we haven't already tried the default
      if (this.src !== defaultSplatPath) {
        this.src = defaultSplatPath;
      }
    };
    splatImg.src = fruitSplatPath;
    
    img[`${fruitName}-splat`] = splatImg;
  });
  return img;
}

export function fruitNinja(activePage = false, checkAchievement = () => {}, onLivesUpdate = null, onGameEnd = null, onScoreUpdate = null) {
  const GRAVITY = 1;
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
  let score = 0;
  let frozen = false; // Freeze game state but keep drawing
  let onLivesChange = onLivesUpdate;
  let onGameOver = onGameEnd;
  let onScoreChange = onScoreUpdate;

  function createBombImage() {
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
    return bombImg;
  }

  function createScorchMarkImage() {
    const scorchImg = document.createElement('img');
    scorchImg.id = 'canvas-img';
    // Create scorch mark using canvas (black/burnt appearance)
    const canvas = document.createElement('canvas');
    canvas.width = DIAMETER * 2.5;
    canvas.height = DIAMETER * 2.5;
    const ctx = canvas.getContext('2d');
    
    // Draw scorch mark (dark, charred appearance)
    const gradient = ctx.createRadialGradient(
      DIAMETER * 1.25, DIAMETER * 1.25, 0,
      DIAMETER * 1.25, DIAMETER * 1.25, DIAMETER * 1.25
    );
    gradient.addColorStop(0, '#1a1a1a'); // Very dark center
    gradient.addColorStop(0.2, '#2d2d2d'); // Dark gray
    gradient.addColorStop(0.5, '#3d3d3d'); // Medium dark gray
    gradient.addColorStop(0.8, '#4a4a4a'); // Lighter gray edges
    gradient.addColorStop(1, 'rgba(74, 74, 74, 0)'); // Fade to transparent
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(DIAMETER * 1.25, DIAMETER * 1.25, DIAMETER * 1.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Add some irregular char marks for texture
    ctx.fillStyle = '#0a0a0a';
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = DIAMETER * (0.3 + Math.random() * 0.5);
      const x = DIAMETER * 1.25 + Math.cos(angle) * distance;
      const y = DIAMETER * 1.25 + Math.sin(angle) * distance;
      const size = 3 + Math.random() * 5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add some darker spots for depth
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = DIAMETER * (0.2 + Math.random() * 0.4);
      const x = DIAMETER * 1.25 + Math.cos(angle) * distance;
      const y = DIAMETER * 1.25 + Math.sin(angle) * distance;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    scorchImg.src = canvas.toDataURL();
    return scorchImg;
  }

  function gameStart() {
    imgSet = generateElements();
    // Add bomb images
    imgSet['bomb'] = createBombImage();
    imgSet['bomb-scorch'] = createScorchMarkImage();
    gameState = true;
    frozen = false;
    lives = 3;
    score = 0;
    // Reset game arrays
    fruits = [];
    sliced = [];
    splats = [];
    path = [];
    queue = [];
    if (onLivesChange) onLivesChange(lives);
    if (onScoreChange) onScoreChange(score);
  }

  const gameEnd = () => {
    gameState = false;
  };

  let loopControl = null;

  function setup(_canvas) {
    canvas = _canvas;
    ctx = canvas.getContext('2d');
    if (activePage) {
      // Store existing listeners (from slash effect) to chain them
      const existingMouseMove = document.onmousemove;
      const existingTouchMove = document.ontouchmove;
      
      // Set up game's listeners that also call existing ones
      document.onmousemove = (e) => {
        addVector(e);
        if (existingMouseMove && existingMouseMove !== addVector) {
          existingMouseMove(e);
        }
      };
      document.ontouchmove = (e) => {
        addVectorTouch(e);
        if (existingTouchMove && existingTouchMove !== addVectorTouch) {
          existingTouchMove(e);
        }
      };
      const { start, stop, restart } = gameLoop(gameTick, () => (exiting = true));
      loopControl = { start, stop, restart };
    }
  }

  function dismount() {
    if (activePage) {
      // Don't clear document listeners - let slash effect keep them
      // The slash effect should always be active
      exiting = true;
      if (loopControl) {
        loopControl.stop();
      }
    }
  }

  function generateFruit() {
    // Random diameter between MIN and MAX for size variation
    const diameter = Math.random() * (MAX_DIAMETER - MIN_DIAMETER) + MIN_DIAMETER;
    const left = Math.random() * canvas.width;
    const side = canvas.width / 2 >= left;
    const maxY = canvas.height / 60;
    const chances = fruitData;
    
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
        // Decrement score only if it's not a bomb
        if (!fruit.isBomb) {
          score = Math.max(0, score - 1);
          if (onScoreChange) onScoreChange(score);
        }
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
        lives--;
        if (onLivesChange) onLivesChange(lives);
        if (lives <= 0) {
          gameState = false;
          frozen = true; // Freeze the game state
          if (onGameOver) onGameOver();
        }
        // Create scorch mark effect (no separation, just a burnt mark)
        const bomb = fruits.splice(i, 1)[0];
        
        // Add scorch mark splatter (longer lasting than fruit splatter)
        splats.push({
          ...bomb,
          type: 'bomb-scorch',
          tick: 400, // Longer lasting scorch mark
        });
        continue;
      }

      checkAchievement('fruitcomplete', fruit.type);

      indexes.push(i);
      update = true;
    }

    if (update) {
      // Calculate score based on fruit size - smaller fruits give more points
      // Score formula: base score * (MAX_DIAMETER / fruit diameter)
      // This means smaller fruits (lower diameter) give higher scores
      let pointsEarned = 0;
      indexes.forEach(i => {
        const fruit = fruits[i];
        // Calculate points: smaller fruits = more points
        // Base score of 2, multiplied by size ratio (larger ratio for smaller fruits)
        const sizeMultiplier = MAX_DIAMETER / fruit.diameter;
        const fruitPoints = Math.max(1, Math.floor(2 * sizeMultiplier));
        pointsEarned += fruitPoints;
      });
      score += pointsEarned;
      if (onScoreChange) onScoreChange(score);
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
      if (!imgSet[type]) continue;
      const img = imgSet[type];
      // Check if image is loaded and not broken
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) continue;
      const radius = diameter;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -radius, -radius);
      ctx.restore();
    }
  }

  function gameTick(delta) {
    deltaTime = delta;

    if ((tick = !tick) && !frozen) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    // Only update if not frozen
    if (!frozen) {
      updateData();
      if (gameState) populateFruit();
    }
    // Always draw the current state
    drawFruit();
    // Don't draw slice - slash effect handles its own rendering
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
    pause: () => {
      if (loopControl) {
        loopControl.stop();
      }
    },
    unpause: () => {
      if (loopControl && !exiting) {
        // Use start() which works whether loop was started or not
        loopControl.start();
      }
    },
    getLives: () => lives,
    getScore: () => score,
    isFrozen: () => frozen,
  };
}

