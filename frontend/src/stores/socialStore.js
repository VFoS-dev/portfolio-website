import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useSocialStore = defineStore('socialStore', {
  state: () => {
    return {};
  },
  actions: {},
});

export const socialStore = useSocialStore(pinia);
