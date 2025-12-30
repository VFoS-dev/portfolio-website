import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getIcons, getDefaultWindow } from '@/services/api-service';
import { shouldFetch } from '@/utilities/persistence';

const useWindowConfigStore = defineStore('windowConfigStore', {
  state: () => ({
    lastFetched: {
      icons: 0,
      defaultWindow: 0,
    },
    icons: [],
    defaultWindow: {},
    shouldLoadDefaultWindow: false,
  }),
  getters: {
    getIcons(state) {
      if (shouldFetch(state.lastFetched.icons)) {
        getIcons()
          .then(icons => {
            state.icons = icons;
            state.lastFetched.icons = new Date();
            this.checkAndLoadDefaultWindow();
          })
          .catch(error => {
            console.error('Failed to fetch icons:', error);
          });
      }
      return state.icons;
    },
    getDefaultWindow(state) {
      if (shouldFetch(state.lastFetched.defaultWindow)) {
        getDefaultWindow()
          .then(defaultWindow => {
            state.defaultWindow = defaultWindow;
            state.lastFetched.defaultWindow = new Date();
            this.checkAndLoadDefaultWindow();
          })
          .catch(error => {
            console.error('Failed to fetch default window:', error);
          });
      }
      return state.defaultWindow;
    },
    getConfig(state) {
      // Return combined config for backwards compatibility
      return {
        icons: state.icons,
        defaultWindow: state.defaultWindow,
      };
    },
  },
  actions: {
    checkAndLoadDefaultWindow() {
      // Only load default window if both icons and defaultWindow are loaded
      if (this.icons.length > 0 && this.defaultWindow && this.defaultWindow.iconTitle && !this.shouldLoadDefaultWindow) {
        this.shouldLoadDefaultWindow = true;
        // Emit event to load default window
        window.dispatchEvent(new CustomEvent('load-default-window', {
          detail: {
            icons: this.icons,
            defaultWindow: this.defaultWindow,
          },
        }));
      }
    },
  },
});

export const windowConfigStore = useWindowConfigStore(pinia);

