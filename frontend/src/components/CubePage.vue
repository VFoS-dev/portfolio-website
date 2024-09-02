<template>
    <div class="cube" :class="cubeStore.state" :style="style" @transitionend="reduceRot">
        <section class="home">
            <slot name="Home">
                <div class="empty">Home</div>
            </slot>
        </section>
        <section class="socials">
            <slot name="Socials">
                <div class="empty">Socials</div>
            </slot>
        </section>
        <section class="resume">
            <slot name="Resume">
                <div class="empty">Resume</div>
            </slot>
        </section>
        <section class="about">
            <slot name="About">
                <div class="empty">About</div>
            </slot>
        </section>
        <section class="skills">
            <slot name="Skills">
                <div class="empty">Skills</div>
            </slot>
        </section>
        <section class="projects">
            <slot name="Projects">
                <div class="empty">Projects</div>
            </slot>
        </section>
    </div>
</template>

<script setup>
import { cubeStore } from '@/stores/cubeStore';
import { computed, onMounted } from 'vue';

const style = computed(() => ({ "--transfrom": cubeStore.getTransformation() }))

function reduceRot({ propertyName }) {
    if (propertyName !== 'transform') return
    cubeStore.reset()
}

onMounted(() => {
    addEventListener('keydown', cubeStore.keyRot)
    addEventListener('keyup', cubeStore.keyRot)
})
</script>

<style scoped lang="less">
.cube {
    --cube-size: 50vmin;
    position: absolute;
    transform-style: preserve-3d;
    transform: var(--transfrom);

    &.animated {
        transition: transform .5s ease-out;
    }

    .home {
        --background: blue;
        background-color: var(--background);
        transform: translateZ(var(--half-size));

        color: white;
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

    &.expand.home>section.home,
    &.expand.socials>section.socials,
    &.expand.resume>section.resume,
    &.expand.about>section.about,
    &.expand.skills>section.skills,
    &.expand.projects>section.projects {
        width: 100dvw;
        height: 100dvh;
        transition-delay: .25s;
    }

    &>section {
        position: fixed;
        transform-origin: center;
        --half-size: calc(var(--cube-size) / 2 + 1px);
        translate: -50% -50%;
        width: var(--cube-size);
        height: var(--cube-size);
        transition: width, height;
        transition-duration: .25s;
        overflow: auto;

        &>div.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 10rem;
        }

        color:black;
    }

    &.instant {
        * {
            transition: none !important;
        }
    }
}
</style>