import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { createKey } from '@/utilities/window';

/**
 * Window Store
 * 
 * Manages all application windows in the desktop environment.
 * Applications can import this store to create new windows.
 * 
 * Example usage in an application:
 * ```javascript
 * import { windowStore } from '@/stores/windowStore';
 * 
 * // Create a new window (returns window object with unique 'id')
 * const newWindow = windowStore.createWindow({
 *   title: 'New Document',
 *   icon: '/images/resume/wordIcon.png',
 *   app: 'Word',
 *   appProps: { content: '' },
 *   width: '800px',
 *   height: '600px'
 * });
 * 
 * // Close window by ID
 * windowStore.closeWindow(newWindow.id);
 * 
 * // Close multiple windows
 * windowStore.closeWindows([id1, id2, id3]);
 * ```
 */
const useWindowStore = defineStore('windowStore', {
  state: () => ({
    windows: {}, // Object with unique IDs as keys
  }),
  getters: {
    /**
     * Get all windows as an array (for iteration)
     */
    getWindows() {
      return Object.values(this.windows);
    },
    /**
     * Get windows object (for direct access by ID)
     */
    getWindowsObject() {
      return this.windows;
    },
    /**
     * Get focused window
     */
    getFocusedWindow() {
      return Object.values(this.windows).find(w => w.state?.focused);
    },
    /**
     * Get window by unique ID
     * @param {string} id - Window unique ID
     */
    getWindowById(id) {
      return this.windows[id];
    },
  },
  actions: {
    /**
     * Create a new window from a window configuration
     * @param {Object} windowConfig - Window configuration object
     * @param {string} windowConfig.title - Window title
     * @param {string|Object} windowConfig.icon - Window icon
     * @param {string} windowConfig.app - Application name
     * @param {Object} windowConfig.appProps - Application props
     * @param {string|number} windowConfig.width - Window width
     * @param {string|number} windowConfig.height - Window height
     * @returns {Object} The created window object with unique ID
     */
    createWindow(windowConfig) {
      // Unfocus all existing windows
      Object.values(this.windows).forEach(w => {
        w.state.focused = false;
      });

      // Generate unique ID
      const existingIds = Object.keys(this.windows);
      const id = createKey(existingIds);

      // Create new window
      const newWindow = {
        ...windowConfig,
        id, // Use 'id' as the unique identifier
        state: {
          fullscreened: false,
          focused: true,
          minimized: false,
        },
      };

      // Store window in object with ID as key
      this.windows[id] = newWindow;
      return newWindow;
    },

    /**
     * Focus a window by unique ID
     * @param {string} id - Window unique ID
     */
    focusWindow(id) {
      const window = this.windows[id];
      if (window) {
        // Unminimize if minimized
        window.state.minimized = false;
        
        // Unfocus all windows
        Object.values(this.windows).forEach(w => {
          w.state.focused = w.id === id;
        });
      }
    },

    /**
     * Toggle minimize state of a window by unique ID
     * @param {string} id - Window unique ID
     */
    minimizeWindow(id) {
      const window = this.windows[id];
      if (window) {
        window.state.focused = false;
        window.state.minimized = !window.state.minimized;
      }
    },

    /**
     * Toggle maximize/fullscreen state of a window by unique ID
     * @param {string} id - Window unique ID
     */
    maximizeWindow(id) {
      const window = this.windows[id];
      if (window) {
        window.state.fullscreened = !window.state.fullscreened;
      }
    },

    /**
     * Close a window by unique ID
     * @param {string} id - Window unique ID
     */
    closeWindow(id) {
      if (this.windows[id]) {
        delete this.windows[id];
      }
    },

    /**
     * Close multiple windows by their unique IDs
     * @param {string[]} ids - Array of window unique IDs
     */
    closeWindows(ids) {
      ids.forEach(id => {
        if (this.windows[id]) {
          delete this.windows[id];
        }
      });
    },

    /**
     * Update window properties by unique ID
     * @param {string} id - Window unique ID
     * @param {Object} updates - Properties to update
     */
    updateWindow(id, updates) {
      const window = this.windows[id];
      if (window) {
        Object.assign(window, updates);
      }
    },

    /**
     * Update window appProps by unique ID
     * @param {string} id - Window unique ID
     * @param {Object} appProps - New appProps
     */
    updateWindowAppProps(id, appProps) {
      const window = this.windows[id];
      if (window) {
        window.appProps = { ...window.appProps, ...appProps };
      }
    },

    /**
     * Clear default position and size values from window
     * This prevents windows from snapping back to original position/size after user interaction
     * @param {string} id - Window unique ID
     */
    clearDefaultPositionAndSize(id) {
      const window = this.windows[id];
      if (window) {
        // Remove default values so window uses current DOM position/size
        delete window.left;
        delete window.top;
        delete window.width;
        delete window.height;
      }
    },
  },
});

export const windowStore = useWindowStore(pinia);
