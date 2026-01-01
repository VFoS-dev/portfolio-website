import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getAbout } from '@/services/api-service';
import { shouldFetch } from '@/utilities/persistence';
import { cubeStore } from './cubeStore';
import sides from '@/enums/sides';

const useAboutStore = defineStore('aboutStore', {
  state: () => ({
    scroll: 0,
    lastFetched: 0,
    content: '',
  }),
  getters: {
    getContent(state) {
      if (shouldFetch(state.lastFetched)) {
        getAbout()
          .then(text => {
            state.content = text;
            state.lastFetched = new Date();
          })
          .catch(error => {
            console.error('Failed to fetch about data:', error);
          });
      }

      return state.content;
    },
  },
  actions: {
    updateScroll({ scroll, percent, mount }) {
      this.scroll = scroll;
      cubeStore.updateScroll(sides.about, percent, mount);
    },
  },
});

export const aboutStore = useAboutStore(pinia);
