import { distanceSegmentToPoint } from "../utils";

const data = {
    gapple: {
        base: "/images/socials/game/GAppleW.png",
        top: "/images/socials/game/GAppleB.png",
        bottom: "/images/socials/game/GAppleT.png",
        splat: "/images/socials/game/splat.png",
    }
}

const DIAMETER = 100;

function generateElements() {
    let img = {}
    Object.keys(data).forEach(d => {
        for (const t of Object.keys(data[d])) {
            let name = t !== 'base' ? `${d}-${t}` : d;
            var test = document.createElement('img');
            test.id = 'canvas-img';
            test.src = data[d][t];
            img[name] = test;
        }
    })
    return img;
}

export function fruitNinja(activePage = false) {
    const GRAVITY = 1, SIZE = 4, TAIL_MAX = 5;

    // visuals
    let canvas,
        ctx,
        path = [],
        exiting = false,
        imgSet = generateElements();

    // game data
    let gameState = false,
        prevTime,
        deltaTime,
        tick = true,
        splats = [],
        sliced = [],
        fruits = [],
        queue = [];

    const gameStart = () => gameState = true;
    const gameEnd = () => gameState = false;

    function setup(_canvas) {
        canvas = _canvas
        ctx = canvas.getContext("2d");
        if (activePage) {
            document.onmousemove = addVector
            requestAnimationFrame(gameTick);
        }
    }

    function dismount() {
        if (activePage) {
            document.onmousemove = null;
            exiting = true;
        }
    }

    function generateFruit() {
        let diameter = DIAMETER,
            left = Math.random() * canvas.width,
            side = canvas.width / 2 >= left,
            maxY = canvas.height / 60,
            chances = Object.keys(data)

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

    function updateData() {
        for (let [i, fruit] of fruits.reverse().entries()) {
            const { top, left, velX, velY, rot, velZ, frame, diameter } = fruit;
            if (velY > 0 && top - diameter > canvas.height) {
                fruits.splice(i, 1);
                // loose health here
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
            indexes.push(i);
            update = true;
        }

        if (update) {
            console.log('here');
            let slope = (y1 - y2) / (x1 - x2);
            updateSlice(fruits, indexes, slope);
        }
    }

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

    function addVector(e) {
        if (path.length > TAIL_MAX) path.shift();
        path = [{ x: e.pageX, y: e.pageY }, ...path];
        if (path.length > 1) slicedCheck()
    }

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

    function populateFruit() {
        let count = delaySpawnCount(deltaTime);
        for (const _ of new Array(count)) generateFruit()
    }

    function delaySpawnCount(time, count = 0) {
        if (!queue.length) queue.push(Math.random() * 990 + 10);
        queue[0] -= time;
        if (queue[0] <= 0) {
            time = -queue.shift();
            return delaySpawnCount(time, count + 1)
        }
        return count;
    }

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

    return {
        setup,
        gameStart,
        dismount,
    }
}