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
  state: () => {
    // Load saved window positions and dimensions from localStorage
    let savedWindowLayouts = {};
    try {
      const saved = localStorage.getItem('r_windowLayouts');
      if (saved) {
        savedWindowLayouts = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved window layouts:', e);
    }

    return {
      windows: {}, // Object with unique IDs as keys
      savedLayouts: savedWindowLayouts, // Saved positions/dimensions keyed by window ID
    };
  },
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

      // Check for saved layout for this window ID (in case window was reopened)
      const savedLayout = this.savedLayouts[id];
      
      // Automatically add "- Microsoft Word" suffix to Word application titles
      // Only add suffix if title doesn't already start with "Microsoft Word"
      let windowTitle = windowConfig.title || '';
      if (windowConfig.app === 'Word' && !windowTitle.startsWith('Microsoft Word')) {
        if (!windowTitle.endsWith(' - Microsoft Word')) {
          windowTitle = `${windowTitle} - Microsoft Word`;
        }
      }
      
      // Use saved layout if available, otherwise use provided config
      const finalConfig = {
        ...windowConfig,
        title: windowTitle,
        ...(savedLayout && {
          width: savedLayout.width,
          height: savedLayout.height,
          left: savedLayout.left,
          top: savedLayout.top,
        }),
      };

      // Create new window
      const newWindow = {
        ...finalConfig,
        id, // Use 'id' as the unique identifier
        state: {
          fullscreened: false,
          focused: true,
          minimized: false,
        },
      };

      // Store window in object with ID as key
      this.windows[id] = newWindow;
      
      // Save initial dimensions if provided (and no saved layout exists)
      // This ensures new windows with explicit dimensions are saved
      if (!savedLayout && (finalConfig.width !== undefined || finalConfig.height !== undefined || 
          finalConfig.left !== undefined || finalConfig.top !== undefined)) {
        this.saveWindowLayout(id, {
          width: finalConfig.width,
          height: finalConfig.height,
          left: finalConfig.left,
          top: finalConfig.top,
        });
      }
      
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
     * Saves the window's current position before minimizing so it can be restored
     * @param {string} id - Window unique ID
     */
    minimizeWindow(id) {
      const window = this.windows[id];

      if (window) {
        // If window is about to be minimized (not already minimized), save its position
        if (!window.state.minimized) {
          // Find the window element and save its current position
          const minimizeButton = document.getElementById(`minimize-${id}`);
          if (minimizeButton) {
            const windowElement = minimizeButton.closest('.window');
            if (windowElement) {
              const rect = windowElement.getBoundingClientRect();
              this.updateWindow(id, {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
              });
            }
          }
        }
        
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
        // Remove saved layout for this window when it's closed
        if (this.savedLayouts[id]) {
          delete this.savedLayouts[id];
          // Persist the updated layouts to localStorage
          try {
            localStorage.setItem('r_windowLayouts', JSON.stringify(this.savedLayouts));
          } catch (e) {
            console.warn('Failed to save window layouts after closing window:', e);
          }
        }
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
          // Remove saved layout for this window
          if (this.savedLayouts[id]) {
            delete this.savedLayouts[id];
          }
        }
      });
      // Persist the updated layouts to localStorage after closing all windows
      try {
        localStorage.setItem('r_windowLayouts', JSON.stringify(this.savedLayouts));
      } catch (e) {
        console.warn('Failed to save window layouts after closing windows:', e);
      }
    },

    /**
     * Update window properties by unique ID
     * @param {string} id - Window unique ID
     * @param {Object} updates - Properties to update
     */
    updateWindow(id, updates) {
      const window = this.windows[id];
      if (window) {
        // Automatically add "- Microsoft Word" suffix to Word application titles when updating
        // Only add suffix if title doesn't already start with "Microsoft Word"
        if (updates.title !== undefined && window.app === 'Word' && !updates.title.startsWith('Microsoft Word')) {
          if (!updates.title.endsWith(' - Microsoft Word')) {
            updates.title = `${updates.title} - Microsoft Word`;
          }
        }
        
        // Save position and dimensions BEFORE updating, using the new values from updates
        // This ensures we save the correct values even if clearDefaultPositionAndSize is called after
        if (updates.width !== undefined || updates.height !== undefined || 
            updates.left !== undefined || updates.top !== undefined) {
          // Use values from updates, falling back to current window values if not in updates
          this.saveWindowLayout(id, {
            width: updates.width !== undefined ? updates.width : window.width,
            height: updates.height !== undefined ? updates.height : window.height,
            left: updates.left !== undefined ? updates.left : window.left,
            top: updates.top !== undefined ? updates.top : window.top,
          });
        }
        
        // Now update the window with the new values
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
        // Get current DOM position/size before clearing defaults
        // This will be handled by the Resizable component's stopResize
        // Remove default values so window uses current DOM position/size
        delete window.left;
        delete window.top;
        delete window.width;
        delete window.height;
      }
    },

    /**
     * Save window layout (position and dimensions) for a window ID
     * @param {string} windowId - Window unique ID
     * @param {Object} layout - Layout object with width, height, left, top
     */
    saveWindowLayout(windowId, layout) {
      if (!windowId) return;
      
      this.savedLayouts[windowId] = {
        width: layout.width,
        height: layout.height,
        left: layout.left,
        top: layout.top,
      };
      
      // Persist to localStorage
      try {
        localStorage.setItem('r_windowLayouts', JSON.stringify(this.savedLayouts));
      } catch (e) {
        console.warn('Failed to save window layout:', e);
      }
    },

    /**
     * Get saved window layout for a window ID
     * @param {string} windowId - Window unique ID
     * @returns {Object|null} Saved layout or null if not found
     */
    getSavedLayout(windowId) {
      return this.savedLayouts[windowId] || null;
    },
  },
});

export const windowStore = useWindowStore(pinia);
