import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useNavStore = defineStore('navStore', {
    state: () => {
        return {
            open: false,
        }
    },
    actions: {
        toggleOpen(bool) {
           return this.open = bool ?? !this.open
        },
        navigated() {
            this.open = false
        }
    }
});

export const navStore = useNavStore(pinia);