import { inBounds } from "@/utilities/game";
const { round, min, sqrt, floor, random } = Math;

export class Bird {
    id = -1;
    type = 'blue';
    types = ['blue', 'brown', 'green'];
    alive = true;
    vel = { x: 1, y: 7 };
    score = ''
    duration = 0
    difficulty = 0;
    direction = { x: 1, y: 0 };
    position = { top: 0, left: 0 };
    magnitude = 1;

    constructor(id) {
        this.id = id;
        this.respawn();
    }

    respawn() {
        this.type = this.getRandomType();
        this.alive = true;
        this.score = ''
        const canDodge = random() > .7;
        this.difficulty = canDodge && min(20000, 1000 / sqrt(random()));
        const vmin = innerHeight > innerWidth ? innerWidth : innerHeight;
        this.magnitude = vmin / (3 + 5 * random())
        this.changeVelocity();
        this.startPosition();
    }

    move(deltaTime) {
        if (!this.alive) return;
        const deltaSecond = deltaTime / 1000
        this.duration = deltaTime + this.duration;
        if (this.difficulty && this.duration > this.difficulty) {
            this.changeVelocity();
        }

        const { x, y } = this.vel;
        const { top, left } = this.position;

        this.position = {
            left: left + x * deltaSecond,
            top: top + y * deltaSecond,
        }

        if (!inBounds({ x: this.position.left, y: this.position.top }, { yMax: innerHeight, xMax: innerWidth, xMin: -200, yMin: -200 })) {
            this.respawn()
        }
    }

    hit(score) {
        this.score = score;
        this.alive = false;
    }

    getObject() {
        return {
            id: this.id,
            type: this.type,
            alive: this.alive,
            score: this.score,
            direction: this.direction,
            position: this.position,
        }
    }

    getRandomType() {
        return this.types[floor(this.types.length * random())];
    }

    changeVelocity() {
        this.duration = 0;
        let x = random() * 3 - 2;
        let y = random() * 3 - 2;
        this.direction = { x: round(x), y: -round(y) };

        const normal = Math.sqrt(x * x + y * y);
        if (normal !== 0) {
            x /= normal;
            y /= normal;
        }

        this.vel = {
            x: x * this.magnitude,
            y: y * this.magnitude,
        };
    }

    startPosition() {
        this.position = {
            top: innerHeight / 2,
            left: innerWidth / 2,
        };
    }
}

export function getBirdCount(score) {
    return Math.floor(score / 80 + 2)
}