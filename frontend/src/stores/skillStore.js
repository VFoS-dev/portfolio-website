import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getSkills, getColors } from '@/services/api-service';
import { randomIndex } from '@/utilities/arrays';
import { shouldFetch } from '@/utilities/persistence';
import { cubeStore } from './cubeStore';
import sides from '@/enums/sides';

const useSkillStore = defineStore('skillStore', {
  state: () => ({
    scroll: 0,
    loading: true,
    lastFetched: {
      skills: 0,
      colors: 0,
    },
    skills: {},
    colors: [],
  }),
  getters: {
    getSkills(state) {
      if (shouldFetch(state.lastFetched.skills)) {
        this.getColors;
        getSkills()
          .then(skills => {
            state.lastFetched.skills = new Date();
            const sGroups = {};
            const order = new Set();

            for (const { group, name, percent } of skills) {
              order.add(group);
              if (!sGroups[group]) {
                sGroups[group] = [];
              }

              sGroups[group].push({ name, percent });
            }

            state.skills = {};
            for (const group of [...order].sort()) {
              state.skills[group] = sGroups[group];
            }
            state.loading = false;
          })
          .catch(error => {
            console.error('Failed to fetch skills:', error);
            state.loading = false;
          });
      }
      return state.skills;
    },
    getColors(state) {
      if (shouldFetch(state.lastFetched.colors)) {
        getColors()
          .then(colors => {
            state.lastFetched.colors = new Date();
            state.colors = colors;
          })
          .catch(error => {
            console.error('Failed to fetch colors:', error);
          });
      }

      return state.colors;
    },
  },
  actions: {
    randomColor() {
      return randomIndex(this.colors) ?? {};
    },
    updateScroll({ scroll, percent, mount }) {
      this.scroll = scroll;
      cubeStore.updateScroll(sides.skills, percent, mount);
    },
  },
});

export const skillStore = useSkillStore(pinia);
