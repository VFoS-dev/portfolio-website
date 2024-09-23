<template>
    <div :state="props.state" :class="classes" :style="style"> </div>
</template>

<script setup>

const props = defineProps({
    state: String,
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
    const { top, left } = props.position
    return {
        top: `${top}px`,
        left: `${left}px`
    }
})
</script>

<style scoped lang="less">
div {
    position: absolute;
    bottom: 1rem;
    display: none;

    &:not([state="idle"]) {
        z-index: 2;
        display: block;
    }

    &::before {
        content: "";
        display: block;
        transform-origin: bottom;
        scale: 2;
        height: 47px;
        width: 59px;
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
            height: 50px;
            background-position-x: var(--x-start);
            background-position-y: var(--y-start);
            animation: spriteLoop2 var(--duration) steps(2) var(--delay) forwards;
        }
    }

    &[state="laughing"] {
        --x-start: -180px;
        --x-end: -300px;
        --y-start: -59px;
        animation: dogUpDown 2s linear forwards;
        z-index: 0;

        &::before {
            animation: spriteLoop .5s steps(2) infinite;
        }
    }

    &[state="show-duck"] {
        --x-start: -316px;
        animation: dogUpDown 2s linear forwards;
        z-index: 0;
        bottom: 100px;

        &.multiple {
            --y-start: -60px;
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