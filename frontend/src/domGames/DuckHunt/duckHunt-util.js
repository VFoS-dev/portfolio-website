import { inBounds, random } from "@/utilities/game";
const { sign, round, abs, atan2, cos, sin, min, sqrt, floor } = Math;

export class Bird {
    id = -1;
    type = '';
    types = ['blue', 'brown', 'green'];
    alive = true;
    velocity = { x: 1, y: 7 };
    score = ''
    duration = 0
    difficulty = 0;
    direction = { x: 1, y: 0 };
    position = { top: 0, left: 0 };
    magnitude = 1;
    escapedCount = 0;

    constructor(id) {
        this.id = id;
        this.respawn();
    }

    respawn() {
        this.type = this.getRandomType(this.type);
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
            this.respawn();
            this.escapedCount++;
            return true
        }
    }

    hit(score) {
        this.escapedCount = 0;
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

    getRandomType(previousType) {
        const types = this.types.filter(t => t !== previousType)
        return types[floor(random(types.length))];
    }

    changeVelocity() {
        this.duration = 0;

        const randDir = (min = 0) => random(3, min) - 2;
        const tangent = atan2(-randDir(1), randDir());
        let y = -sin(tangent);
        let x = cos(tangent);

        const vertical = abs(sin(y)) > .8
        this.direction = {
            y: vertical ? -(y = sign(y)) : -round(y),
            x: vertical ? x = 0 : sign(x),
        }

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

export class Dog {
    id = -1;
    state = 'idle';
    direction = { x: 1 };
    position = { left: 100 };
    width = 59;
    states = ["idle", "walking", "sniffing", "jumping", "laughing", "show", "show_multiple"]
    duration = 0;
    speed = 2;
    stateDuration = 0;
    birds = [];
    timer;

    constructor(id) {
        this.id = id;
        this.toState('walking')
    }

    update(state) {
        this.duration += state.deltaTime;
        this[this.state]?.(state);
    }

    birdPickup(bird) {
        this.birds.push({ x: bird.position.left })
    }

    toState(nextState = 'idle') {
        this.timer = clearTimeout(this.timer);
        this[`${nextState}_start`]?.();
        this.state = nextState;
        this.duration = 0;
    }

    nextState({ animationName }) {
        switch (this.state) {
            case "show":
            case "show_multiple":
                if (animationName != 'dogUpDown') return;
                return this.toState("idle");
            case "jumping":
                if (animationName != 'dogJumping') return;
                return this.toState("idle");
        }
    }

    birdHit(bird) {
        if (['walking', 'sniffing'].includes(this.state)) {
            this.toState("jumping");
        }
        setTimeout(this.birdPickup.bind(this), getGroundedTime(bird), bird)
    }

    randomDirection() {
        this.direction.x = round(random()) * 2 - 1
    }

    changeDirection(start = false) {
        const { x } = this.direction
        const { left } = this.position

        if (start) {
            this.randomDuration()
        } else if (x > 0 && left + this.width > innerWidth) {
            this.direction.x = -this.direction.x
        } else if (x < 0 && left < 0) {
            this.direction.x = -this.direction.x
        }
    }

    randomDuration(range = 10, min = 2, magnitude = 1000) {
        this.stateDuration = random(range, min, magnitude)
    }

    walking_start() {
        this.randomDuration()
        this.changeDirection(true)
        if (this.state === 'idle') {
            this.position.left = {
                1: innerWidth + this.width,
                0: -this.width,
            }[round(random())]
        }
    }

    walking() {
        this.position.left += this.direction.x * this.speed;

        if (this.duration >= this.stateDuration) {
            return this.toState("sniffing")
        }
        this.changeDirection()
    }

    sniffing_start() {
        this.randomDuration(3, 1)
    }

    sniffing() {
        if (this.duration >= this.stateDuration) {
            return this.toState("walking")
        }
    }

    show_start() {
        const { x } = this.birds.shift();
        this.position.left = x;
    }

    show_multiple_start() {
        let total = 0;
        const amount = 2;

        for (let i = 0; i < amount; i++) {
            const { x } = this.birds.shift();
            total += x
        }

        this.position.left = total / amount;

        const birds = []
        while (birds.length <= 6 && this.birds.length) {
            birds.push(this.birds.shift())
        }

        this.birds = birds.reverse();
    }

    idle_start() {
        this.randomDuration(2, 1, 250);
        this.randomDirection();
    }

    idle({ alive }) {
        if (this.duration < this.stateDuration) return;

        const count = this.birds.length
        if (count) return this.toState(count > 1
            ? "show_multiple"
            : "show"
        )

        if (alive && !this.timer) {
            this.timer = setTimeout(this.toState.bind(this), 6000, "walking")
        }
    }

    getObject() {
        return {
            id: this.id,
            state: this.state,
            direction: this.direction,
            position: this.position,
        }
    }
}

export function getBirdCount(score) {
    return floor(score / 40) + 3
}

export function reId(birds, bird) {
    for (let id = 1; id <= birds.count; id++) {
        if (!birds[id]) {
            delete birds[bird.id]
            return birds[bird.id = id] = bird
        }
    }
}

export function getGroundedTime(bird) {
    const hangDelay = 700;
    const animationSeconds = 4000;
    const { top: birdHeight } = bird.position;

    return hangDelay + animationSeconds * (innerHeight - birdHeight) / innerHeight
}