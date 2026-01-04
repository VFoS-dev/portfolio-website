import fruitData from '@/json/fruitData.json';
import { distanceSegmentToPoint } from '@/utilities/math';
import { gameLoop } from '@/utilities/game';

const DIAMETER = 100;
const MIN_DIAMETER = 60;
const MAX_DIAMETER = 140;

// Reference screen dimensions for scaling (1920x1080)
const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

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
  const TAIL_MAX = 5;
  const RANDOM_DELAY = 1250;
  
  // Calculate scale factor based on screen size
  // Use the smaller dimension to ensure consistent scaling
  function getScaleFactor() {
    // Fallback to window dimensions if canvas isn't set up yet
    const screenWidth = canvas?.width || window.innerWidth;
    const screenHeight = canvas?.height || window.innerHeight;
    // Use the smaller dimension to maintain aspect ratio
    const scaleX = screenWidth / REFERENCE_WIDTH;
    const scaleY = screenHeight / REFERENCE_HEIGHT;
    // Use minimum to ensure fruits aren't too large on small screens
    return Math.min(scaleX, scaleY, 1.5); // Cap at 1.5x for very large screens
  }
  
  // Get velocity scale factor - more aggressive scaling for smaller screens
  // Uses power function to make velocities decrease more on small screens
  function getVelocityScale() {
    const baseScale = getScaleFactor();
    // Use power of 1.5 to make velocities decrease more aggressively on small screens
    // This prevents fruits from falling too fast on smaller screens
    // Example: scale=0.5 -> velocityScale=0.5^1.5≈0.35 (much slower)
    return Math.pow(baseScale, 1.5);
  }
  
  // Get scaled values
  function getGravity() {
    // Use velocity scale for gravity to slow down falling on small screens
    return 1 * getVelocityScale();
  }
  
  function getScaledDiameter() {
    const scale = getScaleFactor();
    return {
      min: MIN_DIAMETER * scale,
      max: MAX_DIAMETER * scale,
      base: DIAMETER * scale,
    };
  }

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
  let freezeDelay = 0; // Delay before freezing to show bomb explosion
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
        // Use scaled diameter for bomb size
        const scaledDiam = getScaledDiameter();
        const bombSize = scaledDiam.base * 2;
        const canvas = document.createElement('canvas');
        canvas.width = bombSize;
        canvas.height = bombSize;
        const ctx = canvas.getContext('2d');
        // Draw a simple bomb (black circle with fuse)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(scaledDiam.base, scaledDiam.base, scaledDiam.base * 0.8, 0, Math.PI * 2);
        ctx.fill();
        // Draw fuse
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(scaledDiam.base, scaledDiam.base * 0.2);
        ctx.lineTo(scaledDiam.base * 0.7, scaledDiam.base * 0.1);
        ctx.stroke();
        // Draw spark
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(scaledDiam.base * 0.7, scaledDiam.base * 0.1, 3, 0, Math.PI * 2);
        ctx.fill();
        bombImg.src = canvas.toDataURL();
      };
    };
    return bombImg;
  }

  function createScorchMarkImage() {
    const scorchImg = document.createElement('img');
    scorchImg.id = 'canvas-img';
    // Load SVG scorch mark
    scorchImg.src = '/images/socials/game/bomb-scorch.svg';
    return scorchImg;
  }

  function gameStart() {
    imgSet = generateElements();
    // Add bomb images
    imgSet['bomb'] = createBombImage();
    imgSet['bomb-scorch'] = createScorchMarkImage();
    gameState = true;
    frozen = false;
    freezeDelay = 0;
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
      const existingTouchStart = document.ontouchstart;
      
      // Set up game's listeners that also call existing ones
      document.onmousemove = (e) => {
        addVector(e);
        if (existingMouseMove && existingMouseMove !== addVector) {
          existingMouseMove(e);
        }
      };
      document.ontouchmove = (e) => {
        // Prevent default to stop scrolling and browser UI movement
        if (gameState && !frozen) {
          e.preventDefault();
        }
        addVectorTouch(e);
        if (existingTouchMove && existingTouchMove !== addVectorTouch) {
          existingTouchMove(e);
        }
      };
      
      // Also prevent touchstart default to prevent pull-to-refresh and other gestures
      document.ontouchstart = (e) => {
        if (gameState && !frozen) {
          e.preventDefault();
        }
        if (existingTouchStart && existingTouchStart !== document.ontouchstart) {
          existingTouchStart(e);
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
    const scale = getScaleFactor();
    const scaledDiam = getScaledDiameter();
    // Random diameter between MIN and MAX for size variation (scaled)
    const diameter = Math.random() * (scaledDiam.max - scaledDiam.min) + scaledDiam.min;
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

    const velocityScale = getVelocityScale();
    // Calculate initial upward velocity to ensure fruits can reach full height
    // Use base scale for initial velocity (less aggressive) so fruits can reach the top
    // The base velocity should scale with screen height to ensure full coverage
    const baseVelocity = 30 + Math.random() * maxY;
    // Scale initial velocity less aggressively - use linear scale instead of power scale
    // This ensures fruits can still reach the top on smaller screens
    const initialVelY = -baseVelocity * scale;
    
    fruits.push({
      type: isBomb ? 'bomb' : chances[Math.floor(Math.random() * chances.length)].split('-')[0],
      top: canvas.height + diameter,
      diameter,
      left,
      // Scale horizontal and rotation velocities with velocity scale
      velX: (side * 2 - 1) * (Math.random() * 10 + 2) * velocityScale,
      velY: initialVelY, // Use less aggressive scaling for initial upward velocity
      rot: 360 * Math.random(),
      velZ: (Math.random() * 2 - 1) * 5 * velocityScale,
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
        velY: Math.min(15 * getVelocityScale(), velY + getGravity()),
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
        velY: Math.min(15 * getVelocityScale(), velY + getGravity()),
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
    
    // Check all line segments in the path, not just the first two points
    // This allows cutting all fruits along the entire slash line
    let update = false;
    const indexes = new Set(); // Use Set to avoid duplicate indexes
    const hitFruits = new Set(); // Track which fruits have been hit

    // Iterate through all consecutive pairs of points in the path
    for (let j = 0; j < path.length - 1; j++) {
      const point1 = path[j];
      const point2 = path[j + 1];
      
      for (let [i, fruit] of fruits.entries()) {
        // Skip if this fruit was already hit
        if (hitFruits.has(i)) continue;
        
        const { left: Cx, top: Cy, diameter } = fruit;
        const distance = distanceSegmentToPoint(
          { x: point1.x, y: point1.y },
          { x: point2.x, y: point2.y },
          { x: Cx, y: Cy }
        );

        // Check if fruit intersects with the line segment
        // Use 1.5x diameter as threshold for more forgiving cutting (allows near misses)
        const hitThreshold = diameter * 1.5;
        if (isNaN(distance) || distance > hitThreshold) continue;

        // Mark fruit as hit
        hitFruits.add(i);
        indexes.add(i);
        update = true;

        // Check if it's a bomb
        if (fruit.isBomb) {
          lives--;
          if (onLivesChange) onLivesChange(lives);
          // Create scorch mark effect (no separation, just a burnt mark)
          const bomb = fruits.splice(i, 1)[0];
          
          // Add scorch mark splatter (longer lasting than fruit splatter)
          splats.push({
            ...bomb,
            type: 'bomb-scorch',
            tick: 400, // Longer lasting scorch mark
          });
          
          // Remove from indexes since we already processed it
          indexes.delete(i);
          
          if (lives <= 0) {
            gameState = false;
            // Delay freezing to show bomb explosion animation
            freezeDelay = 300; // 300ms delay to see the explosion
            if (onGameOver) {
              // Delay the game over callback slightly
              setTimeout(() => {
                if (onGameOver) onGameOver();
              }, freezeDelay);
            }
          }
          continue;
        }

        checkAchievement('fruitcomplete', fruit.type);
      }
    }

    if (update) {
      // Calculate score based on fruit size - smaller fruits give more points
      // Score formula: base score * (MAX_DIAMETER / fruit diameter)
      // This means smaller fruits (lower diameter) give higher scores
      const scaledDiam = getScaledDiameter();
      let pointsEarned = 0;
      
      // Convert Set to Array and sort in reverse order for safe removal
      const indexesArray = Array.from(indexes).sort((a, b) => b - a);
      
      indexesArray.forEach(i => {
        const fruit = fruits[i];
        // Calculate points: smaller fruits = more points
        // Base score of 2, multiplied by size ratio (larger ratio for smaller fruits)
        const sizeMultiplier = scaledDiam.max / fruit.diameter;
        const fruitPoints = Math.max(1, Math.floor(2 * sizeMultiplier));
        pointsEarned += fruitPoints;
      });
      
      score += pointsEarned;
      if (onScoreChange) onScoreChange(score);
      
      // Calculate average slope from the path for slice direction
      // Use the first and last points of the path for overall slash direction
      if (path.length >= 2) {
        const firstPoint = path[0];
        const lastPoint = path[path.length - 1];
        const slope = (firstPoint.y - lastPoint.y) / (firstPoint.x - lastPoint.x);
        updateSlice(fruits, indexesArray, slope);
      }
    }
  }

  function updateSlice(fruits, indexes, slope) {
    const velocityScale = getVelocityScale();
    const rotate = Math.atan(slope) + Math.PI / 2;
    const offsetX = Math.cos(rotate) * 10 * velocityScale;
    const offsetY = Math.sin(rotate) * 10 * velocityScale;
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
    // Use canvas-relative coordinates
    const rect = canvas.getBoundingClientRect();
    path = [{ 
      x: e.targetTouches[0].clientX - rect.left, 
      y: e.targetTouches[0].clientY - rect.top 
    }, ...path];
    if (path.length > 1) slicedCheck();
  }

  function addVector(e) {
    if (path.length > TAIL_MAX) path.shift();
    // Use canvas-relative coordinates for consistency
    const rect = canvas.getBoundingClientRect();
    path = [{ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    }, ...path];
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
    // Sort splats by tick (ascending) so older splats (lower tick) are drawn first (behind)
    const sortedSplats = [...splats].sort((a, b) => (a.tick || 0) - (b.tick || 0));
    
    // Draw in order: splats (background, sorted by age), sliced (middle), fruits (foreground)
    // In canvas, things drawn later appear on top, so fruits will be above splats
    for (const { type, top, left, diameter, rot } of [sortedSplats, sliced, fruits].flat()) {
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

    // Handle freeze delay for bomb explosion
    if (freezeDelay > 0) {
      freezeDelay -= delta;
      if (freezeDelay <= 0) {
        frozen = true; // Freeze after delay
      }
    }

    if ((tick = !tick) && !frozen && freezeDelay <= 0) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    // Update animations during freeze delay (to show bomb explosion), but stop spawning
    if (!frozen || freezeDelay > 0) {
      updateData();
      // Only spawn new fruits if game is active and not in freeze delay
      if (gameState && freezeDelay <= 0) {
        populateFruit();
      }
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
      // Don't pause if there's a freeze delay active (bomb explosion animation)
      if (freezeDelay > 0) {
        return;
      }
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

