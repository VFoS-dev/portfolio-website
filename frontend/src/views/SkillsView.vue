<template>
    new skills
    <Canvas ref="canvasRef" :state="starFieldState" />
</template>

<script setup>
import { setupStarField } from '@/canvas/starfield';
import Canvas from '@/components/Canvas.vue'
import { cubeStore } from '@/stores/cubeStore';
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';

const canvasRef = ref()
const starField = ref({})

const starFieldState = computed(() => {
    const state = cubeStore.state.skills;
    if (state) starField.value.unpause?.();
    else starField.value.pause?.();
    return state;
})

onMounted(() => {
    starField.value = setupStarField(canvasRef.value.canvas)
})

onBeforeUnmount(() => {
    starField.value.unmount?.();
})
</script>

<style lang="less" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 10%;
    left: 25%;
    gap: 2rem;
}
</style>
