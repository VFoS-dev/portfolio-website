import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getAbout } from '@/services/api-service';
import { shouldFetch } from '@/utilities/persistence';
import { cubeStore } from './cubeStore';
import sides from '@/enums/sides';

const useAboutStore = defineStore('aboutStore', {
  state: () => {
    return {
      scroll: 0,
      lastFetched: 0,
      content: '',
    };
  },
  getters: {
    getContent(state) {
      if (shouldFetch(state.lastFetched)) {
        getAbout().then(text => Object.assign(state, { content: text, lastFetched: new Date() }));
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
