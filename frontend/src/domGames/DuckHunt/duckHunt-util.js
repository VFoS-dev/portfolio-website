import { inBounds, random } from "@/utilities/game";
const { sign, round, abs, atan2, cos, sin, min, sqrt, floor } = Math;

export class Bird {
    id = -1;
    type = 'blue';
    types = ['blue', 'brown', 'green'];
    alive = true;
    velocity = { x: 1, y: 7 };
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
        this.score = '';
        const canDodge = random() > .7;
        const vmin = innerHeight > innerWidth ? innerWidth : innerHeight;
        const seconds = random(5 + !canDodge * 5, 4);
        this.magnitude = vmin / seconds;
        this.difficulty = canDodge && min(seconds * random(30, 5, 100), 1000 / sqrt(random()));
        this.changeVelocity();
        this.startPosition();
    }

    move(deltaTime) {
        if (!this.alive) return;

        const deltaSecond = deltaTime / 1000;

        this.duration = deltaTime + this.duration;
        if (this.difficulty && this.duration > this.difficulty) {
            this.changeVelocity();
        }

        const { x, y } = this.velocity;
        const { top, left } = this.position;

        this.position = {
            left: left + x * deltaSecond,
            top: top + y * deltaSecond,
        }

        if (!inBounds({ x: this.position.left, y: this.position.top }, { yMax: innerHeight, xMax: innerWidth, xMin: -100, yMin: -100 })) {
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
        return this.types[floor(random(this.types.length))];
    }

    changeVelocity() {
        this.duration = 0;

        const randDir = (min = 0) => random(3, min) - 2;
        const tangent = atan2(-randDir(1), randDir());
        const y = -sin(tangent);
        const x = cos(tangent);

        this.direction.y = -round(y)
        this.direction.x = sign(x) * +(abs(sin(y)) < .97)

        this.velocity = {
            x: x * this.magnitude,
            y: y * this.magnitude,
        };
    }

    startPosition() {
        const dirY = sign(this.velocity.y);
        if (dirY > 0) {
            this.velocity.y = -this.velocity.y;
            this.direction.y = -this.direction.y
        }
        const { x, y } = this.direction;
        let top = innerHeight, left = -100;

        switch (2 * x + y) {
            case -2: // -x
                left = innerWidth
            case 2: //   x
                top = random(innerHeight / 5 * 4, innerHeight / 5)
                break
            case -1: // -x y
                left = random(innerWidth, innerWidth / 2)
                break
            case 3: //   x y     
                left = random(innerWidth / 2)
                break;
            case 1: //   y
                left = random(innerWidth / 3 * 2, innerWidth / 3)
                break;
        }

        this.position = { top, left, };
    }
}

export function getBirdCount(score) {
    return min(floor(score / 80 + 2), 125)
}