import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getSkills, getSabers } from '@/services/api-service';
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
      sabers: 0,
    },
    skills: {},
    sabers: [],
  }),
  getters: {
    getSkills(state) {
      if (shouldFetch(state.lastFetched.skills)) {
        this.getColors; // Trigger saber fetch
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
      // Keep getColors name for backward compatibility with components
      if (shouldFetch(state.lastFetched.sabers)) {
        getSabers()
          .then(sabers => {
            state.lastFetched.sabers = new Date();
            state.sabers = sabers;
          })
          .catch(error => {
            console.error('Failed to fetch sabers:', error);
          });
      }

      return state.sabers;
    },
  },
  actions: {
    randomColor() {
      return randomIndex(this.sabers) ?? {};
    },
    updateScroll({ scroll, percent, mount }) {
      this.scroll = scroll;
      cubeStore.updateScroll(sides.skills, percent, mount);
    },
  },
});

export const skillStore = useSkillStore(pinia);
