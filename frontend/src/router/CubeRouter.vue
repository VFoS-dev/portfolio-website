<template>
  <div
    id="cube"
    :class="cubeStore.state"
    :style="style"
    @transitionstart="cubeRotationStarted"
    @transitionend="cubeRotationFinished"
  >
    <Teleport
      v-for="key of cubeStore.getList()"
      :key="key"
      to="#app"
      :disabled="teleportDisabled(key)"
    >
      <section
        :id="key"
        :ref="elementRefs(key)"
        @animationstart="panelStartedShrinking"
        @animationend="panelHasShrunk"
        @transitionend="panelHasExpanded"
      >
        <slot :name="key">
          <div class="empty">{{ key }}</div>
        </slot>
      </section>
    </Teleport>
  </div>
</template>

<script setup>
import { cubeStore } from '@/stores/cubeStore';
import { reactive, computed, onMounted, ref } from 'vue';

const style = computed(() => ({ '--transfrom': cubeStore.getTransformation() }));
const animating = reactive([false, false]);
const isAnimating = () => animating[0] + animating[1];
const elements = reactive({});
const elementRefs = key => el => (elements[key] = el);
const hasMounted = ref(false);

onMounted(() => {
  addEventListener('keydown', cubeStore.keyRot);
  addEventListener('keyup', cubeStore.keyRot);
  addEventListener('resize', cubeStore.resized);
  setTimeout(() => {
    cubeStore.getList().forEach(teleportDisabled);
    hasMounted.value = true;
  }, 0);
});

function cubeRotationStarted({ propertyName }) {
  // Only track transform transitions
  if (propertyName !== 'transform') return;
  animating[0] = true;
}

function cubeRotationFinished({ propertyName }) {
  if (propertyName !== 'transform') return;

  animating[1] = false;
  cubeStore.reset();
}

function panelHasExpanded({ target, propertyName }) {
  // Only handle width/height transitions, ignore other properties
  if (propertyName !== 'width' && propertyName !== 'height') return;
  
  const { [target.id]: active, expand } = cubeStore.state;
  if (!active || !expand) return;

  // Only process once per expansion (check if already has 'in' class)
  if (target.classList.contains('in')) return;

  animating[0] = false;
  target.classList.add('in');
}

function panelStartedShrinking({ animationName }) {
  if (animationName !== 'side-in') return;

  animating[1] = true;
}

function panelHasShrunk({ animationName, target }) {
  if (animationName !== 'side-in') return;

  animating[0] = false;
  target.classList.remove('in');
}

function teleportDisabled(side) {
  const { [side]: active, expand, animated } = cubeStore.state;
  const parent = elements[side]?.parentNode;

  if (!animated || !hasMounted.value) {
    return !active;
  }

  // Only add 'in' class if section is active, expanded, teleported, and doesn't already have it
  if (active && expand && parent?.id === 'app' && !elements[side]?.classList.contains('in')) {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (elements[side] && elements[side].parentNode?.id === 'app') {
        elements[side].classList.add('in');
      }
    });
  }

  return !active || !expand || isAnimating();
}
</script>

<style>
@keyframes side-in {
  0% {
    width: 100dvw;
    height: 100dvh;
  }

  100% {
    width: var(--cube-size);
    height: var(--cube-size);
  }
}
</style>

<style scoped lang="less">
:is(#app, #cube) > section > div.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 10rem;
}

#app > section {
  position: absolute;
  width: 100dvw;
  height: 100dvh;
  background-color: var(--background);
  transform: none;
}

#cube {
  --cube-size: 50vmin;
  --half-size: calc(var(--cube-size) / 2);
  pointer-events: none;
  transform-style: preserve-3d;
  transform: translateZ(calc(-1 * var(--half-size))) var(--transfrom);

  & > section {
    position: fixed;
    transform-origin: center;
    translate: -50% -50%;
    width: var(--cube-size);
    height: var(--cube-size);
    background-color: var(--background);
    transition: width, height;
    transition-duration: 0.25s;
    overflow: clip;
    outline: 1px solid black;

    &.in {
      animation: side-in 0.5s forwards ease;
    }
  }

  &.expand.home > section#home,
  &.expand.socials > section#socials,
  &.expand.resume > section#resume,
  &.expand.about > section#about,
  &.expand.skills > section#skills,
  &.expand.projects > section#projects {
    width: 100dvw;
    height: 100dvh;
    z-index: 2;
    scale: 1;
  }

  &.expand > section {
    scale: 0.9 0.9 0.9;
  }

  &.instant {
    transition: none !important;

    * {
      transition: none !important;
    }
  }

  &.animated {
    transition: transform 0.5s ease-out;
  }
}

#home {
  --background: #020212;
  transform: translateZ(var(--half-size));
}

#socials {
  --background: green;
  transform: rotate3d(1, 0, 0, 90deg) translateZ(var(--half-size));
}

#resume {
  --background: yellow;
  transform: rotate3d(0, 1, 0, 90deg) translateZ(var(--half-size));
}

#about {
  --background: #32b5fc;
  transform: rotate3d(1, 0, 0, 180deg) translateZ(var(--half-size));
}

#skills {
  --background: #242424;
  --scrollbar-color: #ffffff74;
  transform: rotate3d(0, 1, 0, 270deg) translateZ(var(--half-size));
}

#projects {
  --background: orange;
  transform: rotate3d(1, 0, 0, -90deg) translateZ(var(--half-size));
}
</style>
