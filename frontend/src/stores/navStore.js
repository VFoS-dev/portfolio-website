import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useNavStore = defineStore('navStore', {
    state: () => {
        return {
            open: false,
            hide: false,
        }
    },
    actions: {
        activeGame(bool) {
            this.hide = bool;
            if (bool && this.open) this.open = false;
        },
        toggleOpen(bool) {
            return this.open = bool ?? !this.open
        },
        navigated() {
            this.open = false
        }
    }
});

export const navStore = useNavStore(pinia);