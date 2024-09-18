<template>
    <Canvas ref="canvasRef" :state="starFieldState" />
    <Wrapper :scrollTop="skillStore.scroll" @scroll="skillStore.updateScroll">
        <SkillGroup v-for="([name, value]) of Object.entries(skillStore.getSkills)" :header="name" :skills="value"
            :getColors="skillStore.randomColor" />
    </Wrapper>
</template>

<script setup>
import { setupStarField } from '@/canvas/starfield';
import Canvas from '@/components/Canvas.vue'
import SkillGroup from '@/components/SkillGroup.vue';
import { cubeStore } from '@/stores/cubeStore';
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
import { skillStore } from '@/stores/skillStore';
import Wrapper from '@/components/Wrapper.vue';

const canvasRef = ref()
const starField = ref({})

const starFieldState = computed(() => {
    const state = cubeStore.state.skills;
    if (state) starField.value.unpause?.();
    else starField.value.pause?.();
    return state;
})

onMounted(() => {
    starField.value = setupStarField(canvasRef.value.canvas);
})

onBeforeUnmount(() => {
    starField.value.unmount?.();
})
</script>

<style lang="less" scoped>
.wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 7rem;

    &>* {
        flex-grow: 1;
        flex-basis: 700px;
        max-width: min(100%, 900px);
    }
}
</style>