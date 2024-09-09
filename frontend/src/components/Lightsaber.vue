<template>
    <div class="saber" :class="{ on: power }" @click="toggle">
        <div class="light" :style="styles" 
            @transitionstart="animating = true" @transitionend="animating = false">
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
    on: { type: Boolean, default: true },
    percent: { type: Number, default: 100 },
    auraColor: { type: String, default: 'blue' },
    innerColor: { type: String, default: 'white' },
    lightColor: { type: String, default: 'white' },
    getColors: Function,
})

const power = ref(props.on)
const animating = ref(false)
const colors = reactive({
    auraColor: props.auraColor,
    innerColor: props.innerColor,
    lightColor: props.lightColor,
})

const styles = computed(() => {
    const { percent } = props
    return {
        '--percent': `${percent}%`,
        '--aura-color': colors.auraColor,
        '--inner-color': colors.innerColor,
        '--light-color': colors.lightColor,
    }
})

function toggle() {
    power.value = !power.value

    if (power.value && props.getColors && !animating.value) {
        Object.assign(colors, props.getColors())
    }
}
</script>

<style lang="less" scoped>
.saber {
    --hilt-width: 92px;
    --hilt-height: 16px;
    pointer-events: none;
    cursor: pointer;

    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: var(--hilt-width);
    height: var(--hilt-height);
    position: relative;

    &::before {
        content: '';
        pointer-events: all;
        background-image: var(--hilt, url(/images/skills/hilt.png));
        background-repeat: no-repeat;
        background-size: contain;
        width: var(--hilt-width);
        height: var(--hilt-height);
        position: absolute;
        left: calc(-1 * var(--hilt-width));
        z-index: 1;
    }

    &:not(.on) {
        .light {
            width: 0%;
        }
    }
}

.light {
    position: absolute;
    height: 40%;

    border-radius: 2px 7px 7px 2px;
    width: var(--percent, 100%);
    transition: width .5s ease-out;
    background-color: var(--light-color);
    box-shadow: 0 0 5px var(--inner-color), 0 0 12px var(--inner-color), 0 0 15px var(--aura-color), 0 0 35px var(--aura-color);
}
</style>
