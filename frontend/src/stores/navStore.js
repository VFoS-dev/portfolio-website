import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { cubeStore } from './cubeStore';

const useNavStore = defineStore('navStore', {
  state: () => {
    return {
      open: false,
      hide: false,
    };
  },
  getters: {
    getScroll() {
      return cubeStore.getActiveScroll;
    },
  },
  actions: {
    activeGame(bool) {
      this.hide = bool;
      if (bool && this.open) this.open = false;
    },
    toggleOpen(bool) {
      return (this.open = bool ?? !this.open);
    },
    toggleHide(bool) {
      this.hide = bool ?? !this.hide;
    },
    navigated() {
      this.open = false;
    },
  },
});

export const navStore = useNavStore(pinia);
