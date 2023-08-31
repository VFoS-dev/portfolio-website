# Fruit Ninja

This game is comprised of 21 functions: proj, distanceSegmentToPoint, generateElements, gameStart, setup, dismount, generateFruit, updateData, slicedCheck, updateSlice, addVectorTouch, addVector, drawSlice, populateFruit, delaySpawnCount, drawFruit, gameTick, add, sub, dot, hypot2, and gameEnd

```js
// Define some common functions for working with vectors
const add = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
const sub = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
const dot = (a, b) => a.x * b.x + a.y * b.y;
const hypot2 = (a, b) => dot(sub(a, b), sub(a, b));
const gameEnd = () => gameState = false;
```

```js
// Function for projecting some vector a onto b
function proj(a, b) {
    const k = dot(a, b) / dot(b, b);
    return {x: k * b.x, y: k * b.y};
}
```

```js
function distanceSegmentToPoint(A, B, C) {
    // Compute vectors AC and AB
    const AC = sub(C, A);
    const AB = sub(B, A);

    // Get point D by taking the projection of AC onto AB then adding the offset of A
    const D = add(proj(AC, AB), A);

    const AD = sub(D, A);
    // D might not be on AB so calculate k of D down AB (aka solve AD = k * AB)
    // We can use either component, but choose larger value to reduce the chance of dividing by zero
    const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

    // Check if D is off either end of the line segment
    if (k <= 0.0) {
        return Math.sqrt(hypot2(C, A));
    } else if (k >= 1.0) {
        return Math.sqrt(hypot2(C, B));
    }

    return Math.sqrt(hypot2(C, D));
}
```

```js
function generateElements() {
    let img = {}
    Object.keys(fruitData).forEach(d => {
        for (const t of Object.keys(fruitData[d])) {
            let name = t !== 'base' ? `${d}-${t}` : d;
            var test = document.createElement('img');
            test.id = 'canvas-img';
            test.src = fruitData[d][t];
            img[name] = test;
        }
    })
    return img;
}
```

```js
function gameStart() {
    imgSet = generateElements()
    gameState = true
}
```

```js
function setup(_canvas) {
    canvas = _canvas
    ctx = canvas.getContext("2d");
    if (activePage) {
        document.onmousemove = addVector;
        document.ontouchmove = addVectorTouch;
        requestAnimationFrame(gameTick);
    }
}
```

```js
function dismount() {
    if (activePage) {
        document.onmousemove = null;
        document.ontouchmove = null;
        exiting = true;
    }
}
```

```js
function generateFruit() {
    let diameter = DIAMETER,
        left = Math.random() * canvas.width,
        side = canvas.width / 2 >= left,
        maxY = canvas.height / 60,
        chances = Object.keys(fruitData)

    fruitSliced++
    checkAchievement('fruitCheck1', fruitSliced)
    checkAchievement('fruitCheck2', fruitSliced)
    checkAchievement('fruitCheck3', fruitSliced)

    fruits.push({
        type: chances[Math.floor(Math.random() * chances.length)].split('-')[0],
        top: canvas.height + diameter,
        diameter,
        left,
        velX: (side * 2 - 1) * (Math.random() * 10 + 2),
        velY: -(30 + Math.random() * maxY),
        rot: 360 * Math.random(),
        velZ: (Math.random() * 2 - 1) * 5,
        frame: 0
    })
}
```

```js
function updateData() {
    for (let [i, fruit] of fruits.reverse().entries()) {
        const { top, left, velX, velY, rot, velZ, frame, diameter } = fruit;
        if (velY > 0 && top - diameter > canvas.height) {
            fruits.splice(i, 1);
            // loose health here
            fruitMissed++
            checkAchievement('fruitEscape', fruitMissed)
            continue;
        }
        fruits[i] = {
            ...fruit,
            top: top + velY,
            left: left + velX,
            rot: rot + velZ,
            frame: frame + 1,
            velY: Math.min(15, velY + GRAVITY)
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
            velY: Math.min(15, velY + GRAVITY)
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
```

```js
function slicedCheck() {
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = path;
    let update = false,
        indexes = [];

    for (let [i, fruit] of fruits.entries()) {
        const { left: Cx, top: Cy } = fruit;
        let distance = distanceSegmentToPoint(
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: Cx, y: Cy }
        );

        if (isNaN(distance) || distance > fruit.diameter) continue;

        checkAchievement('fruitcomplete', fruit.type);

        indexes.push(i);
        update = true;
    }

    if (update) {
        let slope = (y1 - y2) / (x1 - x2);
        updateSlice(fruits, indexes, slope);
    }
}
```

```js
function updateSlice(fruits, indexes, slope) {
    let rotate = Math.atan(slope) + Math.PI / 2;
    let offsetX = Math.cos(rotate) * 10;
    let offsetY = Math.sin(rotate) * 10;
    let rot = Math.tan(slope) * 180 / Math.PI;
    indexes.reverse().forEach(i => {
        let splat = fruits.splice(i, 1)[0]
        splats.push({
            ...splat,
            type: `${splat.type}-splat`,
            tick: 200
        });
        sliced.push({
            ...splat, rot,
            type: `${splat.type}-top`,
            top: splat.top + offsetY,
            left: splat.left + offsetX,
            velX: offsetX,
            velY: offsetY * 2,
        });
        sliced.push({
            ...splat, rot,
            type: `${splat.type}-bottom`,
            top: splat.top - offsetY,
            left: splat.left - offsetX,
            velX: -offsetX,
            velY: -offsetY * 2,
        });
    });
}
```

```js
function addVectorTouch(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }, ...path];
    if (path.length > 1) slicedCheck()
}
```

```js
function addVector(e) {
    if (path.length > TAIL_MAX) path.shift();
    path = [{ x: e.pageX, y: e.pageY }, ...path];
    if (path.length > 1) slicedCheck()
}
```

```js
function drawSlice() {
    const colors = [
        '#4d4d4d',
        "#6e6e6e",
        "#969696",
        "#ffffff",
    ];
    ctx.lineJoin = "round";

    let vector = [];

    let x = path[0].x, y = path[0].y;

    path.forEach(function (v, index) {
        let { x: dx, y: dy } = path[index + 1] || path[0];

        v.x = x;
        v.y = y;

        vector.push({ x: x, y: y });

        x += (dx - v.x) * 0.6;
        y += (dy - v.y) * 0.6;
    });

    vector.reverse();

    colors.forEach((color, index) => {
        ctx.strokeStyle = color;
        ctx.lineCap = "round";

        vector.forEach((set, vIndex, sets) => {
            ctx.beginPath();
            ctx.lineTo(set.x, set.y);
            if (vIndex) ctx.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
            ctx.lineWidth = SIZE + (10 * (colors.length - index) / colors.length) * 2 * (vIndex + 1) / vector.length;
            ctx.stroke();
        });
    });
}
```

```js
function populateFruit() {
    let count = delaySpawnCount(deltaTime);
    checkAchievement('fruitCatapult', count);
    for (const _ of new Array(count)) generateFruit()
}
```

```js
function delaySpawnCount(time, count = 0) {
    if (!queue.length) queue.push(Math.random() * RANDOM_DELAY + 10);
    if (count >= 50) return 50;
    queue[0] -= time;
    if (queue[0] <= 0) {
        time = -queue.shift();
        return delaySpawnCount(time, count + 1)
    }
    return count;
}
```

```js
function drawFruit() {
    for (const { type, top, left, diameter, rot, frame } of [splats, sliced, fruits].flat()) {
        let radius = diameter;
        ctx.translate(left, top);
        ctx.rotate(rot * Math.PI / 180);
        ctx.drawImage(imgSet[type], -radius, -radius);
        ctx.rotate(-rot * Math.PI / 180);
        ctx.translate(-left, -top);
    }
}
```

```js
function gameTick(time) {
    if (!prevTime) prevTime = time;
    deltaTime = time - prevTime;
    prevTime = time;

    if (tick = !tick) path.pop();

    const { clientWidth, clientHeight } = document.documentElement;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    updateData();
    if (gameState) populateFruit();
    drawFruit();
    if (path.length > 1) drawSlice();
    if (!exiting) requestAnimationFrame(gameTick);
}
```