<template>
    <nav>
        <AnimatedLogo :hasScroll="false" :scrollPercent=".7" />
        <div>
            <ul>
                <li v-for="link of links">
                    <NavLink :to="link">{{ link }}</NavLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import AnimatedLogo from "@/components/Navigation/AnimatedLogo.vue";
import NavLink from "@/components/Navigation/NavLink.vue";

const links = ['projects', 'skills', 'resume', 'about', 'socials']
</script>

<style lang="less" scoped>
nav {
    position: absolute;
    display: flex;
    flex-direction: row;
    width: 100dvw;
    z-index: 12;
    top: 0;
    left: 0;
    padding: 10px 15px;

    &::before {
        content: "";
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
        background: -webkit-linear-gradient(rgba(1, 1, 1, 0.9), transparent);
        height: clamp(100px, 18vh, 120px);
    }
}

ul {
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    list-style-type: none;
}
</style>