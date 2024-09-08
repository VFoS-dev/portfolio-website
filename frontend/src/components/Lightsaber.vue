<template>
    <div class="saber" :class="{ on: props.on }">
        <div class="light" :style="styles"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    on: { type: Boolean, default: true },
    percent: { type: Number, default: 100 },
    auraColor: { type: String, default: 'blue' },
    innerColor: { type: String, default: 'white' },
    lightColor: { type: String, default: 'white' },
})

const styles = computed(() => {
    const { percent, auraColor, innerColor, lightColor } = props
    return {
        '--percent': `${percent}%`,
        '--aura-color': auraColor,
        '--inner-color': innerColor,
        '--light-color': lightColor,
    }
})
</script>

<style lang="less" scoped>
.saber {
    --hilt-width: 92px;
    --hilt-height: 16px;

    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: var(--hilt-width);
    height: var(--hilt-height);
    position: relative;
    width: 700px;

    &::before {
        content: '';
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
    box-shadow: 0 0 5px var(--inner-color), 0 0 8px var(--inner-color), 0 0 12px var(--inner-color), 0 0 15px var(--aura-color), 0 0 25px var(--aura-color);
}
</style>
