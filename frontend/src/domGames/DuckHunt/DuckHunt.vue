<template>
    <div birds>
        <Duck v-for="bird of birds" v-bind="bird" :key="bird.id" />
    </div>
    <div grass></div>
</template>

<script setup>
import { ref } from 'vue';
import Duck from './Duck.vue';
const birds = ref([])
</script>

<style scoped lang="less">
div[grass] {
    position: absolute;
    height: 90px;
    background-color: aliceblue;
    width: 100vw;
    bottom: 0;
    z-index: 2;
    background: url(/images/about/grass.webp);
    background-repeat: repeat, no-repeat;
}

div[birds] {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>