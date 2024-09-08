<template>
    new skills
    <Canvas ref="canvas"/>
</template>

<script setup>
import Canvas from '@/components/Canvas.vue'
import { onMounted, ref } from 'vue';
const canvas = ref()

onMounted(() => {
    console.log(canvas.value.canvas);

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
