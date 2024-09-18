import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getAbout } from '@/services/api-service';
import { shouldFetch } from '@/utilities/persistence';

const useAboutStore = defineStore('aboutStore', {
    state: () => {
        return {
            lastFetched: 0,
            content: ''
        }
    },
    getters: {
        getContent(state) {
            if (shouldFetch(state.lastFetched)) {
                getAbout()
                    .then(text => Object.assign(state, { content: text, lastFetched: new Date(), }))
            }

            return state.content;
        }
    },
    actions: {
    }
});

export const aboutStore = useAboutStore(pinia);