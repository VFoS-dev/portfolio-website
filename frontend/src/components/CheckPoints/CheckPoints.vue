<template>
    <div class="checkpoints" @click="reset">
        <Point v-for="(a, index) of array" :state="a" :key="index" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Point from './Point.vue';

const emit = defineEmits(['reset'])
const props = defineProps({
    amount: { type: Number, default: 7 },
    correctArray: { type: Array, default: [0, 1, , 1] },
})

const reset = () => emit('reset')
const array = computed(() => {
    return [...props.correctArray, ...(new Array(Math.max(0, props.amount - props.correctArray.length)))]
})
</script>

<style scoped lang="less">
.checkpoints {
    display: flex;
    gap: .125rem;
    flex-direction: row;
    pointer-events: none;
}
</style>
