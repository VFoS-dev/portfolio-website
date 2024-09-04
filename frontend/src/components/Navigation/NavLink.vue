<template>
    <RouterLink :to="to">
        <span v-for="state of states" :class="state">
            <slot></slot>
        </span>
    </RouterLink>
</template>

<script setup>
defineProps({ to: String })

const states = [
    'default',
    'hover',
    'active',
]
</script>

<style scoped lang="less">
a {
    --gradiant: white, orange, white;
    --active: #38495a, white, #38495a;
    --hover: orange, white, orange;

    --default-opacity: 1;
    --hover-opacity: 0;
    --active-opacity: 0;

    position: relative;
    font-family: 'lato', sans-serif;
    font-size: 1.875rem;
    text-decoration: none;
    
    &:hover {
        --hover-opacity: 1;
        --active-opacity: 0;
    }

    &.router-link-active:not(:hover) {
        --hover-opacity: 0;
        --active-opacity: 1;
    }

    span {
        display: block;
        background: -webkit-linear-gradient(var(--gradiant));
        transition: background .5s;
        text-transform: capitalize;
        transition: opacity .25s linear;

        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &.active,
        &.hover {
            position: absolute;
            top: 0;
            left: 0;
        }

        &.active {
            --gradiant: var(--active);
            opacity: var(--active-opacity);
            text-shadow: rgb(183, 211, 223) 1px 0 10px;
        }

        &.hover {
            --gradiant: var(--hover);
            opacity: var(--hover-opacity);
            text-shadow: rgb(221, 196, 94) 1px 0 10px;
        }

        &.default {
            opacity: 1;
        }
    }
}
</style>