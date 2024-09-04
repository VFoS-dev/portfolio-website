<template>
    <nav>
        <AnimatedLogo :hasScroll="false" :scrollPercent=".7" />
        <section>
            <CheckPoints @reset="console.log('reset')" />
            <Portal to="#mobile-nav" :disabled="!isMobile">
                <ul>
                    <li v-if="isMobile">
                        <NavLink to="home">Home</NavLink>
                    </li>
                    <li v-for="link of links">
                        <NavLink :to="link">{{ link }}</NavLink>
                    </li>
                </ul>
            </Portal>
            <HambergerMenu id="mobile-switch" @click="toggleNav" />
        </section>
    </nav>
    <div id="mobile-nav" :class="{ open: navStore.open }"> </div>
</template>

<script setup>
import AnimatedLogo from "@/components/Navigation/AnimatedLogo.vue";
import NavLink from "@/components/Navigation/NavLink.vue";
import CheckPoints from "@/components/CheckPoints/CheckPoints.vue";
import Portal from "@/components/Portal.vue";
import { inject } from "vue";
import provideInject from "@/enums/provideInject";
import { navStore } from "@/stores/navStore";
import HambergerMenu from "./HambergerMenu.vue";

const links = ['projects', 'skills', 'resume', 'about', 'socials']
const isMobile = inject(provideInject.isMobile)

function toggleNav() {
    if (!navStore.toggleOpen()) return;

    addEventListener('click', clickedBackDrop);
}

function clickedBackDrop({ target }) {
    if (target.id !== 'app') return;

    removeEventListener('click', clickedBackDrop);
    navStore.toggleOpen(false);
}
</script>

<style lang="less" scoped>
nav {
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100dvw;
    z-index: var(--nav-z);
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

:root[data-mobile="false"] {
    #mobile-nav {
        display: none;
    }

    #mobile-switch {
        display: none;
    }
}

#mobile-switch {
    z-index: 20;
}

:root[data-mobile="true"] {
    section {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

#mobile-nav {
    position: absolute;
    top: 0;
    right: 0;
    width: min(100%, 300px);
    padding: 1rem;
    background: grey;
    z-index: var(--nav-mobile-z);
    height: 100%;
    border-left: black solid 1px;
    transform: translateX(100%);
    transition: transform .5s;

    &.open {
        transform: translateX(0%);
    }

    ul {
        flex-direction: column;
        gap: .5rem;
    }
}


@media (prefers-reduced-motion) {
    #mobile-nav {
        transition: none;
    }
}
</style>

<style>
#app::before {
    content: '';
    pointer-events: none;
    cursor: pointer;
    z-index: var(--nav-backdrop-z);
    position: absolute;
    background: black;
    width: 100dvw;
    height: 100dvh;
    transition: opacity .5s;
    opacity: 0;
}

@media (prefers-reduced-motion) {
    #app::before {
        transition: none;
    }
}

#app:has(#mobile-nav.open)::before {
    pointer-events: all;
    opacity: .75;
    backdrop-filter: blur(100px);
}
</style>