import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getSocials } from '@/services/api-service';
import { shouldFetch } from '@/utilities/persistence';

const useSocialStore = defineStore('socialStore', {
  state: () => ({
    lastFetched: 0,
    socials: [],
  }),
  getters: {
    getSocials(state) {
      if (shouldFetch(state.lastFetched)) {
        getSocials()
          .then(socials => {
            state.socials = socials;
            state.lastFetched = new Date();
          })
          .catch(error => {
            console.error('Failed to fetch socials:', error);
          });
      }
      return state.socials;
    },
  },
  actions: {},
});

export const socialStore = useSocialStore(pinia);
