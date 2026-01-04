import fruitData from '@/json/fruitData.json';
import { distanceSegmentToPoint } from '@/utilities/math';
import { gameLoop } from '@/utilities/game';

const DIAMETER = 140;
const MIN_DIAMETER = 80;
const MAX_DIAMETER = 200;

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
    // Clamp between minimum and maximum to ensure fruits are always visible but not too large
    const minScale = 0.4; // Minimum 40% of reference size (prevents fruits from being too small)
    const maxScale = 1.5; // Maximum 150% of reference size (prevents fruits from being too large)
    const baseScale = Math.max(minScale, Math.min(scaleX, scaleY, maxScale));
    
    // Apply size multipliers: 2x for smaller screens, 1.5x for larger screens
    // Interpolate between 2x (at minScale) and 1.5x (at maxScale)
    const sizeMultiplier = 2.0 - (baseScale - minScale) / (maxScale - minScale) * 0.5;
    
    return baseScale * sizeMultiplier;
  }
  
  // Get the base scale factor (before size multipliers)
  function getBaseScaleFactor() {
    const screenWidth = canvas?.width || window.innerWidth;
    const screenHeight = canvas?.height || window.innerHeight;
    const scaleX = screenWidth / REFERENCE_WIDTH;
    const scaleY = screenHeight / REFERENCE_HEIGHT;
    const minScale = 0.4;
    const maxScale = 1.5;
    return Math.max(minScale, Math.min(scaleX, scaleY, maxScale));
  }

  // Get velocity scale factor - balanced scaling for all screen sizes
  // Uses vertical (height) scaling to keep velocities proportional to vertical space
  function getVelocityScale() {
    // Fallback to window dimensions if canvas isn't set up yet
    const screenHeight = canvas?.height || window.innerHeight;
    // Use vertical dimension for velocity scaling since movement is primarily vertical
    const scaleY = screenHeight / REFERENCE_HEIGHT;
    const minScale = 0.4;
    const maxScale = 1.5;
    // Clamp and return vertical-based scale
    return Math.max(minScale, Math.min(scaleY, maxScale));
  }
  
  // Get scaled values
  function getGravity() {
    // Increase gravity to balance the higher initial velocity
    // This makes fruits fall faster to create better arc trajectories
    return 1.2 * getVelocityScale();
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
  let fruitIndexCounter = 0;
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
    fruitIndexCounter = 0; // Reset index counter
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
        // Only prevent if touching the game canvas, not other elements
        if (gameState && !frozen && canvas) {
          const touch = e.targetTouches[0];
          if (touch) {
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            // Only prevent default if touching the game canvas or its children
            if (target && (target === canvas || canvas.contains(target))) {
              e.preventDefault();
            }
          }
        }
        addVectorTouch(e);
        if (existingTouchMove && existingTouchMove !== addVectorTouch) {
          existingTouchMove(e);
        }
      };
      
      // Also prevent touchstart default to prevent pull-to-refresh and other gestures
      document.ontouchstart = (e) => {
        // Only prevent if touching the game canvas, not other elements
        if (gameState && !frozen && canvas) {
          const touch = e.touches[0];
          if (touch) {
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            // Only prevent default if touching the game canvas or its children
            if (target && (target === canvas || canvas.contains(target))) {
              e.preventDefault();
            }
          }
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
    // Calculate initial upward velocity - balanced with increased gravity
    // The base velocity should scale with screen height to ensure good coverage
    const baseVelocity = 40 + Math.random() * maxY * 1.2;
    // Use velocity scale for initial velocity to match gravity scaling
    // This keeps upward and downward motion balanced
    const initialVelY = -baseVelocity * velocityScale;
    
    fruits.push({
      id: fruitIndexCounter++,
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
      const radius = diameter / 2;
      
      // Check if fruit goes below screen
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
      
      // Calculate new position
      let newTop = top + velY;
      let newLeft = left + velX;
      let newVelX = velX;
      let newVelY = velY;
      
      // Clamp position to keep fruit within screen bounds (sides only, allow going above top)
      // Left boundary: fruit center should not go left of radius
      if (newLeft < radius) {
        newLeft = radius;
        newVelX = Math.abs(velX); // Bounce off left wall
      }
      
      // Right boundary: fruit center should not go right of canvas.width - radius
      if (newLeft > canvas.width - radius) {
        newLeft = canvas.width - radius;
        newVelX = -Math.abs(velX); // Bounce off right wall
      }
      
      fruits[i] = {
        ...fruit,
        top: newTop,
        left: newLeft,
        rot: rot + velZ,
        frame: frame + 1,
        velX: newVelX,
        velY: Math.min(15 * getVelocityScale(), newVelY + getGravity()),
      };
    }
    for (let [i, slice] of sliced.reverse().entries()) {
      const { top, left, velX, velY, rot, velZ, frame, diameter } = slice;
      if (velY > 0 && top - diameter > canvas.height) {
        sliced.splice(i, 1);
        continue;
      }
      
      const radius = diameter / 2;
      let newTop = top + velY;
      let newLeft = left + velX;
      
      // Clamp sliced fruit pieces to screen bounds (sides only, allow going above top)
      if (newLeft < radius) {
        newLeft = radius;
      }
      if (newLeft > canvas.width - radius) {
        newLeft = canvas.width - radius;
      }
      
      sliced[i] = {
        ...slice,
        top: newTop,
        left: newLeft,
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

  // Simple line-circle intersection check
  function lineIntersectsCircle(lineStart, lineEnd, circleCenter, radius) {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const fx = lineStart.x - circleCenter.x;
    const fy = lineStart.y - circleCenter.y;
    
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = (fx * fx + fy * fy) - radius * radius;
    
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) return false;
    
    const sqrt = Math.sqrt(discriminant);
    const t1 = (-b - sqrt) / (2 * a);
    const t2 = (-b + sqrt) / (2 * a);
    
    // Check if intersection point is within the line segment
    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 < 0 && t2 > 1);
  }

  function slicedCheck() {
    // Don't allow slicing if game is not active or is frozen
    if (!gameState || frozen || path.length < 2) return;
    
    const hitFruits = new Set(); // Track hit fruits by reference
    const hitBombs = new Set();
    
    // Check all line segments in the path against all fruits
    for (let j = 0; j < path.length - 1; j++) {
      const point1 = path[j];
      const point2 = path[j + 1];
      
      for (const fruit of fruits) {
        // Skip if already hit
        if (hitFruits.has(fruit) || hitBombs.has(fruit)) continue;
        
        const { left: fruitX, top: fruitY, diameter } = fruit;
        const radius = diameter / 2;
        
        // Use line-circle intersection with a more forgiving threshold
        const hitRadius = radius * 1.2; // 20% larger hit radius for better feel
        const hit = lineIntersectsCircle(
          point1,
          point2,
          { x: fruitX, y: fruitY },
          hitRadius
        );
        
        if (hit) {
          if (fruit.isBomb) {
            hitBombs.add(fruit);
          } else {
            hitFruits.add(fruit);
            checkAchievement('fruitcomplete', fruit.type);
          }
        }
      }
    }
    
    // Process bombs first (they remove lives and can end the game)
    for (const bomb of hitBombs) {
      const bombIndex = fruits.indexOf(bomb);
      if (bombIndex === -1) continue; // Already removed
      
      lives--;
      if (onLivesChange) onLivesChange(lives);
      
      // Add scorch mark splatter
      splats.push({
        ...bomb,
        type: 'bomb-scorch',
        tick: 400,
      });
      
      // Remove bomb from fruits
      fruits.splice(bombIndex, 1);
      
      if (lives <= 0) {
        gameState = false;
        freezeDelay = 300;
        if (onGameOver) {
          setTimeout(() => {
            if (onGameOver) onGameOver();
          }, freezeDelay);
        }
        // Stop processing more fruits if game ended
        return;
      }
    }
    
    // Process regular fruits
    if (hitFruits.size > 0) {
      const scaledDiam = getScaledDiameter();
      let pointsEarned = 0;
      
      // Get indexes of hit fruits, sorted in reverse for safe removal
      const indexesArray = fruits
        .map((fruit, index) => hitFruits.has(fruit) ? index : -1)
        .filter(index => index !== -1)
        .sort((a, b) => b - a);
      
      // Calculate points
      indexesArray.forEach(i => {
        const fruit = fruits[i];
        const sizeMultiplier = scaledDiam.max / fruit.diameter;
        const fruitPoints = Math.max(1, Math.floor(2 * sizeMultiplier));
        pointsEarned += fruitPoints;
      });
      
      score += pointsEarned;
      if (onScoreChange) onScoreChange(score);
      
      // Calculate slope from path for slice direction
      if (path.length >= 2) {
        const firstPoint = path[0];
        const lastPoint = path[path.length - 1];
        const dx = lastPoint.x - firstPoint.x;
        const dy = lastPoint.y - firstPoint.y;
        // Avoid division by zero
        const slope = Math.abs(dx) > 0.001 ? dy / dx : 0;
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
        id: splat.id + 0.1, // Preserve the original fruit's id with small offset for top slice
        rot,
        type: `${splat.type}-top`,
        top: splat.top + offsetY,
        left: splat.left + offsetX,
        velX: offsetX,
        velY: offsetY * 2,
      });
      sliced.push({
        ...splat,
        id: splat.id + 0.2, // Preserve the original fruit's id with small offset for bottom slice
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
    // Don't add to path or check slicing if game is not active or frozen
    if (!gameState || frozen) return;
    if (path.length > TAIL_MAX) path.shift();
    // Use canvas-relative coordinates (canvas internal size now matches bounding rect)
    const rect = canvas.getBoundingClientRect();
    path = [{ 
      x: e.targetTouches[0].clientX - rect.left, 
      y: e.targetTouches[0].clientY - rect.top 
    }, ...path];
    if (path.length > 1) slicedCheck();
  }

  function addVector(e) {
    // Don't add to path or check slicing if game is not active or frozen
    if (!gameState || frozen) return;
    if (path.length > TAIL_MAX) path.shift();
    // Use canvas-relative coordinates (canvas internal size now matches bounding rect)
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
    
    // Sort fruits by static index to ensure consistent rendering order (prevent flickering)
    const sortedFruits = [...fruits].sort((a, b) => (a.id || 0) - (b.id || 0));
    
    // Sort sliced fruits by static index to ensure consistent rendering order (prevent flickering)
    const sortedSliced = [...sliced].sort((a, b) => (a.id || 0) - (b.id || 0));
    
    // Draw in order: splats (background, sorted by age), sliced (middle, sorted by index), fruits (foreground, sorted by index)
    // In canvas, things drawn later appear on top, so fruits will be above splats
    for (const { type, top, left, diameter, rot } of [sortedSplats, sortedSliced, sortedFruits].flat()) {
      if (!imgSet[type]) continue;
      const img = imgSet[type];
      // Check if image is loaded and not broken
      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) continue;
      const radius = diameter / 2;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -radius, -radius, diameter, diameter);
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

    // Use canvas element's bounding rect to ensure internal dimensions match CSS size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, rect.width, rect.height);

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

