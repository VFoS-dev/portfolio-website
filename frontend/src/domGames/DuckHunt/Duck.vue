<template>
    <div :id="props.id" :type="props.type" :alive="props.alive" :class="classes" :style="props.position"
        @animationend="handleAnimationEnd"></div>
</template>

<script setup>
import { computed } from 'vue';
const emit = defineEmits(['removeDuck', 'hitDuck'])

const props = defineProps({
    id: [String, Number],
    type: { type: String, default: 'blue' },
    alive: { type: Boolean, default: true },
    direction: { type: Object, default: () => ({ x: 1, y: 0 }) },
    position: { type: String, default: () => ({ top: `${50}%`, left: `${50}%` }) }
})

const classes = computed(() => {
    const sign = (v) => v < 0 ? '-' : '';

    const dir = [];
    const { x, y } = props.direction;

    if (x) dir.push(`${sign(x)}x`);
    if (y) dir.push(`${sign(y)}y`);

    return dir
})

function handleAnimationEnd({ animationName }) {
    switch (animationName) {
        case 'duckFalling': return emit('removeDuck', props.id)
    }
}
</script>

<style scoped lang="less">
div {
    --size: 120;
    width: calc(var(--size) * 1px);
    height: calc(var(--size) * 1px);
    pointer-events: all;
    cursor: pointer;
    position: absolute;

    /* default blue bird */
    --y-start: -120px;
    --y-end: -120px;
    --x-start: 0px;
    --x-end: -121px;

    &[type=blue] {
        --x-start: 0px;
        --x-end: -121px;
    }

    &[type=green] {
        --x-start: -130px;
        --x-end: -251.66px;
    }

    &[type=brown] {
        --x-start: -260px;
        --x-end: -380px;
    }

    &::before {
        --scale: calc(var(--size) / 35);
        scale: var(--scale);
        transform-origin: top left;
        content: '';
        position: absolute;
        width: 35px;
        height: 35px;
        background: url(/images/about/sprite_sheet.webp);
    }

    /* flying left */
    &.-x {
        scale: -1 1;
    }

    &[alive='true'] {
        &::before {
            animation: duckFlapping 0.4s steps(3) infinite;
        }

        /* flying diagonally */
        &:is(.-y, .y):is(.x, .-x) {
            --y-start: -155px;
            --y-end: -155px;

            &.-y {
                rotate: calc(var(--dir, 1) * 90deg);
            }

            &.-x {
                --dir: -1;
            }
        }

        /* flying vertically */
        &:not(.-x, .x) {
            &:is(.-y, .y) {
                --y-start: -195px;
                --y-end: -195px;
            }

            /* flying down */
            &.-y {
                scale: 1 -1;
            }
        }
    }

    &[alive='false'] {
        pointer-events: none !important;
        cursor: auto !important;
        animation: duckDeath 500ms steps(1) .7s infinite;
        --y-start: -236px;
        --y-end: -236px;
        --x-middle: var(--x-start);

        &::before {
            animation: duckFalling 4s linear .7s forwards;
            background-position-y: var(--y-start) !important;
            background-position-x: var(--x-middle) !important;
        }
    }
}
</style>

<style>
@keyframes duckFlapping {
    from {
        background-position-y: var(--y-start);
        background-position-x: var(--x-start);
    }

    to {
        background-position-y: var(--y-end);
        background-position-x: var(--x-end);
    }
}

@keyframes duckDeath {
    0% {
        scale: 1 1;
    }

    50% {
        scale: -1 1;
    }

    100% {
        scale: 1 1;
    }
}

@keyframes duckFalling {
    from {
        --x-middle: calc(var(--x-start) - 35px);
    }

    to {
        transform: translateY(100vh);
    }
}
</style>