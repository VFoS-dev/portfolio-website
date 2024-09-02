<template>
    <div class="cube" :class="{ animated }" :style="style" @transitionend="reduceRot">
        <section class="home">
            <slot name="Home"> Home
                {{ cubeStore.current }}
            </slot>
        </section>
        <section class="socials">
            <slot name="Socials"> Socials
                {{ cubeStore.current }}
            </slot>
        </section>
        <section class="resume">
            <slot name="Resume"> Resume
                {{ cubeStore.current }}
            </slot>
        </section>
        <section class="about">
            <slot name="About"> About
                {{ cubeStore.current }}
            </slot>
        </section>
        <section class="skills">
            <slot name="Skills"> Skills
                {{ cubeStore.current }}
            </slot>
        </section>
        <section class="projects">
            <slot name="Projects"> Projects
                {{ cubeStore.current }}
            </slot>
        </section>
    </div>
</template>

<script setup>
import { cubeStore } from '@/stores/cubeStore';
import { computed, onMounted, ref } from 'vue';

const animated = ref(false);
const style = computed(() => {
    return { "--matrix": `matrix3d(${cubeStore.current.getMatrix().toString()})` }
})

function reduceRot() {
    cubeStore.reset()
}

function animate(pre = () => { }) {
    animated.value = false
    pre()
    setTimeout(() => animated.value = true, 0);
}

onMounted(() => {
    document.addEventListener('keydown', cubeStore.keyRot)
    animate()
})
</script>

<style scoped lang="less">
.cube {
    --cube-size: 50vmin;
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: center;
    animation: testCube 10s linear infinite;
    transform: var(--matrix);

    &.animated {
        transition: transform .5s ease-out;
    }

    .home {
        --background: blue;
        background-color: var(--background);
        transform: translateZ(var(--half-size));
    }

    .socials {
        --background: green;
        background-color: var(--background);
        transform: rotate3d(1, 0, 0, 90deg) translateZ(var(--half-size));
    }

    .resume {
        --background: yellow;
        background-color: var(--background);
        transform: rotate3d(0, 1, 0, 90deg) translateZ(var(--half-size));
    }

    .about {
        --background: red;
        background-color: var(--background);
        transform: rotate3d(1, 0, 0, 180deg) translateZ(var(--half-size));
    }

    .skills {
        --background: magenta;
        background-color: var(--background);
        transform: rotate3d(0, 1, 0, 270deg) translateZ(var(--half-size));
    }

    .projects {
        --background: orange;
        background-color: var(--background);
        transform: rotate3d(1, 0, 0, -90deg) translateZ(var(--half-size));
    }

    &>section {
        position: fixed;
        transform-origin: center;
        --half-size: calc(var(--cube-size) / 2);
        translate: -50% -50%;
        width: var(--cube-size);
        height: var(--cube-size);

        .full-size {
            width: 100dvw;
            height: 100dvh;
        }
    }
}
</style>