<template>
    <div birds :class="{ active }">
        <Duck v-for="bird of Object.values(birds)" v-bind="bird.getObject?.() ?? bird" :key="bird.id"
            @removeDuck="duckHunt?.removeDuck" @hitDuck="duckHunt?.hitDuck" />
    </div>
    <div grass :class="{ active }">
        <ActiveBirds :birds="birds" />
        <Score :score="score" />
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import Duck from './Duck.vue';
import { duckHuntSetup } from '@/domGames/DuckHunt/duckHunt';
import Score from './Score.vue';
import ActiveBirds from './ActiveBirds.vue';

const birds = reactive({})
const props = defineProps({
    active: { type: Boolean, default: false }
})
const duckHunt = ref()
const score = ref(0)

watch(() => props.active, (state) => {
    setTimeout(() => {
        if (!duckHunt.value) duckHunt.value = duckHuntSetup(birds);
        if (state) duckHunt.value.unpause?.();
        else duckHunt.value.pause?.();
    }, 0)
})

onMounted(() => {
    duckHunt.value = duckHuntSetup(birds, (val) => score.value = val);
})

onBeforeUnmount(() => {
    duckHunt.value.unmount?.();
})
</script>

<style scoped lang="less">
div:not(.active) :deep(div[type]) {

    &::after,
    &::before {
        animation-play-state: paused !important;
    }

    animation-play-state: paused !important;
}

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