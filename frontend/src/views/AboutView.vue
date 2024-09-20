<template>
    <Wrapper :scrollTop="aboutStore.scroll" @scroll="aboutStore.updateScroll">
        <StringToHTML :string="aboutStore.getContent" :key="aboutStore.lastFetched" />
    </Wrapper>
    <Wrapper display>
        <DuckHunt />
    </Wrapper>
</template>

<script setup>
import { aboutStore } from '@/stores/aboutStore';
import StringToHTML from '@/components/StringToHTML.vue'
import Wrapper from '@/components/Wrapper.vue';
import DuckHunt from '@/domGames/DuckHunt/DuckHunt.vue';
</script>

<style lang="less" scoped>
.wrap {
    padding-left: 15vw;
    padding-right: 15vw;
    padding-bottom: 90px;
}

:deep(p) {
    margin-bottom: 1rem;
    margin-top: 0;
    color: #fff;
    font-family: VT323, latin;
    font-size: 2.5rem;
    pointer-events: none;

    &.tab {
        text-indent: calc(3rem + 1rem * var(--tabAmount, 0));
    }

    &[id] {
        margin-top: 4rem;
    }
}
</style>