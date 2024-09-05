<template>
    <canvas ref="canvas"></canvas>
    <div class="welcome">
        <h2>Hello</h2>
        <h1>I'm <span>Jon Kido</span></h1>
        <h3>Full Stack and Game Developer</h3>
        <div class="button-group">
            <StyledButton class="orange">
                Play Snake
            </StyledButton>
            <StyledButton class="blue" v-if="false">
                Play Muliplayer
            </StyledButton>
            <StyledButton @click="toResume">
                View Resume
            </StyledButton>
        </div>
    </div>
</template>

<script setup>
import StyledButton from '@/components/StyledButton.vue';
import router from '@/router';
import { ref } from 'vue';

const canvas = ref();
const toResume = () => router.push({ name: 'resume' })
</script>

<style lang="less" scoped>
.welcome {
    align-items: flex-start;
    color: #fff;
    display: inline-flex;
    flex-direction: column;
    font-family: Handjet;
    font-style: normal;
    gap: clamp(5px, 3vh, 30px);
    left: 10%;
    position: absolute;
    top: 53%;
    transform: translateY(-50%);
}

.button-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
}

h1,
h2,
h3,
span {
    font-family: Handjet;
    font-size: var(--font-size);
    font-weight: bold;
    line-height: var(--font-size);
}

h1 {
    --font-size: clamp(30px, 15vh, 120px);

    span {
        background: linear-gradient(180deg, #f5bf00, #ed4b05);
        background-clip: text;

        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
    }
}

h2 {
    --font-size: clamp(10px, 5vh, 40px);

    &::after {
        content: '';
        aspect-ratio: 1 / 1;
        background-image: url(/images/intro/wave.webp);
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        display: inline-block;
        height: var(--font-size);
        scale: 1.4;
        transform-origin: left center;
        margin-left: 1.5rem;
        top: 50%;
    }
}

h3 {
    color: #f32222;
    --font-size: clamp(14px, 7vh, 56px);
}
</style>