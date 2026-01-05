<template>
  <section :key="colors" :style="styles">
    <header>
      <AlphaNumericButton :clicked="state === 'alphabetical'" @click="toggleSort" />
      <h1>{{ props.header }}</h1>
      <Saber @click="changeColors" />
    </header>
    <div class="sabers" :style="{ '--count': props.skills.length }" :state="state">
      <div
        v-for="({ name, percent }, index) of props.skills"
        :key="index"
        class="sorted"
        :style="sorted[name]"
      >
        <header>
          <h2>{{ name }}</h2>
          <span>{{ percent }}%</span>
        </header>
        <Lightsaber :percent="percent" v-bind="colors" :get-colors="props.getColors" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import Lightsaber from './Lightsaber.vue';
import AlphaNumericButton from '@/components/Buttons/AlphaNumericButton.vue';
import Saber from './Buttons/Saber.vue';

const props = defineProps({
  header: String,
  skills: Array,
  getColors: Function,
});

const trigger = ref(false);
const colors = computed(() => ({ trigger: trigger.value, ...props.getColors() }));
const styles = computed(() => {
  const { textColor, auraColor, innerColor, lightColor } = colors.value;
  return {
    '--text-color': textColor,
    '--aura-color': auraColor,
    '--inner-color': innerColor,
    '--light-color': lightColor,
  };
});
const state = ref('alphabetical');
const sorted = computed(() => {
  const { skills } = props;

  const table = {};
  const names = skills.map(({ name }, i) => ((table[name] = i), name));
  const skill = i => skills[table[i]];
  const toObject = arr => arr.reduce((t, c, i) => ((t[c] = i), t), {});

  const byPercent = toObject(names.sort((a, b) => skill(b).percent - skill(a).percent));
  const byName = toObject(names.sort((a, b) => skill(a).name.localeCompare(skill(b).name)));

  return names.reduce((t, c) => ((t[c] = { '--value': byPercent[c], '--name': byName[c] }), t), {});
});

function toggleSort() {
  state.value = {
    alphabetical: 'numerical',
    numerical: 'alphabetical',
  }[state.value];
}

function changeColors() {
  trigger.value = !trigger.value;
}
</script>

<style lang="less" scoped>
.sorted header {
  align-items: baseline;
  margin-bottom: 0.5rem;
}

header {
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  h1 {
    font-size: 2.5rem;
    line-height: 2.5rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 2rem;
  }

  span {
    font-size: 1rem;
    line-height: 1rem;
  }
  
  // Mobile responsive font sizes
  @media (max-width: 991px) {
    h1 {
      font-size: clamp(1.5rem, 5vw, 2rem);
      line-height: clamp(1.5rem, 5vw, 2rem);
    }
    
    h2 {
      font-size: clamp(1.25rem, 4vw, 1.75rem);
      line-height: clamp(1.25rem, 4vw, 1.75rem);
    }
    
    span {
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      line-height: clamp(0.875rem, 2.5vw, 1rem);
    }
  }
}

* {
  color: var(--text-color, white);
  font-weight: bold;
}

section {
  background-color: var(--background);
  border-radius: 30px;
  padding: 30px;
  border: 1px solid var(--light-color);
  box-shadow:
    var(--inner-color, white) 0px 0px 5px,
    var(--aura-color) 0px 0px 15px;
  opacity: 0.9;
  transition: opacity 1s 4s;

  &:hover {
    transition-delay: 0s;
    opacity: 1;
  }
  
  // Mobile responsive adjustments
  @media (max-width: 991px) {
    padding: clamp(1.5rem, 4vw, 2rem);
    border-radius: clamp(20px, 5vw, 30px);
  }
}

.sabers {
  --cell-size: calc(2rem + 16px);
  --cell-padding: 0.5rem;
  height: calc(var(--count) * calc(2 * var(--cell-padding) + var(--cell-size)));
  position: relative;

  .sorted {
    position: absolute;
    width: 100%;
    top: calc(
      var(--index) * calc(2 * var(--cell-padding) + var(--cell-size)) + var(--cell-padding)
    );
    transition: top 0.25s;
  }

  &[state='alphabetical'] .sorted {
    --index: var(--name);
  }

  &[state='numerical'] .sorted {
    --index: var(--value);
  }
}
</style>
