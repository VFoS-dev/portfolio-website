<template>
    <div type="dog" :state="props.state" :class="classes" :style="style" @animationend="nextState" />
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['nextState'])

const props = defineProps({
    id: [String, Number],
    state: { type: String, default: 'idle' },
    direction: { type: Object, default: () => ({}) },
    position: { type: Object, default: () => ({}) },
})

const classes = computed(() => {
    const sign = (v) => v < 0 ? '-' : '';

    const dir = [];
    const { x } = props.direction;

    if (x) dir.push(`${sign(x)}x`);

    return dir
})

const style = computed(() => {
    const { left } = props.position;
    return {
        left: `${left}px`
    }
})

const nextState = (e) => emit('nextState', e, props.id)
</script>

<style scoped lang="less">
div {
    position: absolute;
    bottom: 1rem;
    display: none;
    width: var(--width);
    height: var(--height);
    --height: 47px;
    --width: 59px;


    &:not([state="idle"]) {
        z-index: 2;
        display: block;
    }

    &::before {
        content: "";
        display: block;
        transform-origin: bottom;
        scale: 2;
        width: var(--width);
        height: var(--height);
        background: url(/images/about/sprite_sheet.webp);
    }

    &.-x {
        scale: -1 1;
    }

    &[state="walking"] {
        --x-end: -362px;

        &::before {
            animation: spriteLoop .5s steps(3) infinite;
        }
    }

    &[state="sniffing"] {
        --x-start: 195px;
        --x-end: 73px;

        &::before {
            animation: spriteLoop .5s steps(2) infinite;
        }
    }

    &[state="jumping"] {
        --height: 50px;
        --x-end: -120px;
        --y-start: -59px;
        --duration: .75s;
        --delay: calc(var(--duration) / 2);
        z-index: 2;
        animation: dogJumping var(--duration) calc(2 * var(--delay)) forwards ease-out;

        &.-x {
            --to: -90px;
        }

        &::before {
            background-position-x: var(--x-start);
            background-position-y: var(--y-start);
            animation: spriteLoop2 var(--duration) steps(2) var(--delay) forwards;
        }
    }

    &[state^="show"] {
        --x-start: -316px;
        animation: dogUpDown 2s linear forwards;
        z-index: 0;
        bottom: 100px;

        &[state="show2"] {
            --y-start: -60px;
        }

        &[state="show3"] {
            --y-start: -60px;
            --x-start: -240px;
        }

        &[state="show4+"] {
            --y-start: -53px;
            --x-start: -180px;
            --height: 54px;
        }

        &::before {
            background-position-x: var(--x-start);
            background-position-y: var(--y-start);
        }
    }
}
</style>

<style>
@keyframes dogJumping {
    from {
        bottom: 1rem;
    }

    66% {
        bottom: 90px;
        z-index: 2;
    }

    to {
        bottom: -10px;
        translate: var(--to, 90px);
        z-index: 0;
    }
}

@keyframes dogUpDown {

    33%,
    66% {
        bottom: 65px;
    }

    to,
    from {
        bottom: -100px;
    }
}
</style>