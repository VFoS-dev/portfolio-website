import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useTrashStore = defineStore('trashStore', {
  state: () => {
    // Load deleted icons from localStorage on initialization
    let deletedIcons = [];
    let permanentlyDeletedIcons = [];
    try {
      const savedDeleted = localStorage.getItem('trashStore_deletedIcons');
      if (savedDeleted) {
        deletedIcons = JSON.parse(savedDeleted);
      }
      const savedPermanentlyDeleted = localStorage.getItem('trashStore_permanentlyDeletedIcons');
      if (savedPermanentlyDeleted) {
        permanentlyDeletedIcons = JSON.parse(savedPermanentlyDeleted);
        // Filter out any custom saved Word documents (only keep JSON config icons)
        permanentlyDeletedIcons = permanentlyDeletedIcons.filter(icon => !icon.isCustom);
        // Save back the filtered list
        localStorage.setItem('trashStore_permanentlyDeletedIcons', JSON.stringify(permanentlyDeletedIcons));
      }
    } catch (e) {
      console.warn('Failed to load trash store from localStorage', e);
    }
    
    return {
      deletedIcons: deletedIcons, // Array of deleted icon configs with deletion timestamp (can be restored)
      permanentlyDeletedIcons: permanentlyDeletedIcons, // Array of permanently deleted icons from JSON config only (cannot be restored)
    };
  },
  getters: {
    getDeletedIcons() {
      return this.deletedIcons;
    },
    getTrashCount() {
      return this.deletedIcons.length;
    },
    getAllDeletedIconTitles() {
      // Returns titles of both deleted and permanently deleted icons
      const deletedTitles = this.deletedIcons.map(icon => icon.title);
      const permanentlyDeletedTitles = this.permanentlyDeletedIcons.map(icon => icon.title);
      return [...deletedTitles, ...permanentlyDeletedTitles];
    },
  },
  actions: {
    deleteIcon(iconConfig) {
      // Add deletion timestamp
      const deletedIcon = {
        ...iconConfig,
        deletedAt: Date.now(),
        originalIndex: this.deletedIcons.length,
      };
      this.deletedIcons.push(deletedIcon);
      // Persist to localStorage
      this.saveToLocalStorage();
    },
    restoreIcon(iconConfig) {
      const index = this.deletedIcons.findIndex(
        (icon) => icon.deletedAt === iconConfig.deletedAt && icon.title === iconConfig.title
      );
      if (index !== -1) {
        this.deletedIcons.splice(index, 1);
        // Persist to localStorage
        this.saveToLocalStorage();
        // Return the icon config without the deletion metadata
        const restoredIcon = { ...iconConfig };
        delete restoredIcon.deletedAt;
        delete restoredIcon.originalIndex;
        return restoredIcon;
      }
      return null;
    },
    emptyTrash() {
      // Get all icons that will be permanently deleted
      const iconsToPermanentlyDelete = [...this.deletedIcons];
      
      // Only add icons from JSON config (not custom saved Word documents) to permanently deleted list
      // Custom saved Word documents should be completely removed, not tracked
      const jsonConfigIcons = iconsToPermanentlyDelete.filter(icon => !icon.isCustom);
      this.permanentlyDeletedIcons.push(...jsonConfigIcons);
      this.deletedIcons = [];
      
      // Persist to localStorage
      this.saveToLocalStorage();
      
      // Emit event with icons to permanently delete so ResumeView can clean up localStorage
      window.dispatchEvent(new CustomEvent('icons-permanently-deleted', {
        detail: iconsToPermanentlyDelete
      }));
    },
    saveToLocalStorage() {
      // Save deleted and permanently deleted icons to localStorage
      // Only save permanently deleted icons from JSON config (not custom saved Word documents)
      try {
        localStorage.setItem('trashStore_deletedIcons', JSON.stringify(this.deletedIcons));
        // Filter out custom saved Word documents from permanently deleted icons before saving
        const jsonConfigPermanentlyDeleted = this.permanentlyDeletedIcons.filter(icon => !icon.isCustom);
        localStorage.setItem('trashStore_permanentlyDeletedIcons', JSON.stringify(jsonConfigPermanentlyDeleted));
      } catch (e) {
        console.warn('Failed to save trash store to localStorage', e);
      }
    },
  },
});

export const trashStore = useTrashStore(pinia);

