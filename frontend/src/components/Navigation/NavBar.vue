<template>
  <nav :class="{ hide: navStore.hide }">
    <AnimatedLogo :scroll-percent="scrollPercent" />
    <section>
      <Portal to="#mobile-nav" :disabled="!isMobile">
        <ul>
          <li v-if="isMobile">
            <NavLink to="home">Home</NavLink>
          </li>
          <li v-for="link of links" :key="link">
            <NavLink :to="link">{{ capitalize(link) }}</NavLink>
          </li>
        </ul>
      </Portal>
      <HambergerMenu id="mobile-switch" @click="toggleNav" />
    </section>
  </nav>
  <div id="mobile-nav" :class="{ open: navStore.open, hide: navStore.hide }"></div>
</template>

<script setup>
import AnimatedLogo from '@/components/Navigation/AnimatedLogo.vue';
import NavLink from '@/components/Navigation/NavLink.vue';
import Portal from '@/components/Portal.vue';
import { inject, computed } from 'vue';
import provideInject from '@/enums/provideInject';
import { useNavStore } from '@/stores/navStore';

const navStore = useNavStore();
import HambergerMenu from './HambergerMenu.vue';
import { capitalize } from '@/utilities/conversions';

const links = ['projects', 'skills', 'resume', 'about', 'socials'];
const isMobile = inject(provideInject.isMobile);

// Memoize scroll value to prevent unnecessary rerenders
const scrollPercent = computed(() => navStore.getScroll);

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
.hide {
  opacity: 0;
  pointer-events: none;
  
  * {
    pointer-events: none !important;
  }
}

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
  transition: opacity var(--hide-duration);
  pointer-events: none;

  * {
    pointer-events: all;
  }
  
  &.hide * {
    pointer-events: none !important;
  }

  &::before {
    content: '';

    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    background: -webkit-linear-gradient(rgba(1, 1, 1, 0.9), transparent);
    height: clamp(60px, 12vh, 80px);
  }
}

ul {
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  list-style-type: none;
}

:root[data-mobile='false'] {
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

section{
  pointer-events: none;
}

:root[data-mobile='true'] {
  section {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}

#mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  width: min(85%, 320px);
  padding: 2rem 1.5rem;
  padding-top: clamp(3rem, 8vh, 4rem);
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: var(--nav-mobile-z);
  height: 100vh;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5), -2px 0 8px rgba(0, 0, 0, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(180deg, rgba(1, 1, 1, 0.4) 0%, transparent 100%);
    pointer-events: none;
  }

  &.open {
    transform: translateX(0%);
  }

  ul {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      transform: translateX(-4px);
    }
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
  background: rgba(0, 0, 0, 0.6);
  width: 100dvw;
  height: 100dvh;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

@media (prefers-reduced-motion) {
  #app::before {
    transition: none;
  }
}

#app:has(#mobile-nav.open)::before {
  pointer-events: all;
  opacity: 1;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
