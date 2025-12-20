<template>
  <div 
    class="resume" 
    :style="desktopBackgroundStyle"
    @mousedown="handleDesktopMouseDown"
    @mousemove="handleDesktopMouseMove"
    @mouseup="handleDesktopMouseUp"
    @click="handleDesktopClick"
    @contextmenu.prevent="handleContextMenu"
  >
    <div class="desktop-icons-container">
      <ResumeDesktopIcon
        v-for="(icon, i) in visibleIcons"
        :key="`icon-${i}-${icon.title}`"
        :ref="el => setIconRef(el, i)"
        :icon-props="getIconProps(icon, i)"
        :icon="getIconPath(icon)"
        :label="icon.title"
        :initial-x="icon.x || '50px'"
        :initial-y="icon.y || '50px'"
        :is-selected="selectedIconIndices.includes(i)"
        :is-trash="icon.isTrash || false"
      />
    </div>
    <div 
      v-if="selectionBox.visible"
      class="selection-box"
      :style="{
        left: `${selectionBox.left}px`,
        top: `${selectionBox.top}px`,
        width: `${selectionBox.width}px`,
        height: `${selectionBox.height}px`
      }"
    ></div>
    <Window
      v-for="window in windows"
      :key="`windows-${window.id}`"
      :title="window.title"
      :icon="window.icon"
      :state="window.state"
      :app="window.app"
      :app-props="window.appProps"
      :window-id="window.id"
      :width="window.width"
      :height="window.height"
      :left="window.left"
      :top="window.top"
    />
    <ResumeTaskbar 
      @open-app="handleOpenApp"
      @shutdown="handleShutdown"
    />
    <DesktopContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @close="closeContextMenu"
      @background-changed="handleBackgroundChanged"
      @background-reset="handleBackgroundReset"
      @navbar-toggled="handleNavbarToggled"
      @reset-all="handleResetAll"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import ResumeDesktopIcon from '@/components/Resume/ResumeDesktopIcon.vue';
import Window from '@/components/Window/Window.vue';
import ResumeTaskbar from '@/components/Resume/ResumeTaskbar.vue';
import DesktopContextMenu from '@/components/Resume/DesktopContextMenu.vue';
import { onDoubleClick, dragParentElement, dragParentElementWithTrash } from '@/utilities/window';
import windowConfig from '@/json/windowConfig.json';
import { trashStore } from '@/stores/trashStore';
import { navStore } from '@/stores/navStore';
import { cubeStore } from '@/stores/cubeStore';
import { windowStore } from '@/stores/windowStore';

const defaultBackground = 'url(/images/resume/windows_xp_background.webp)';
const desktopBackground = ref(localStorage.getItem('r_desktopBackground') || defaultBackground);

const desktopBackgroundStyle = computed(() => {
  const bg = desktopBackground.value;
  if (bg.startsWith('data:') || bg.startsWith('http')) {
    return { backgroundImage: `url(${bg})` };
  }
  return { backgroundImage: bg };
});

// Selection box state
const selectionBox = ref({
  visible: false,
  startX: 0,
  startY: 0,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
});

const isSelecting = ref(false);
const selectedIconIndices = ref([]);
const iconRefs = ref([]);
const isDraggingSelection = ref(false);
const selectionDragStart = ref({ x: 0, y: 0 });
const selectionInitialPositions = ref([]);
const justFinishedSelecting = ref(false);

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
});

function setIconRef(el, index) {
  if (el) {
    iconRefs.value[index] = el;
  }
}

// Use window store for windows
const windows = computed(() => windowStore.getWindows);


function handleNewWindow(windowConfig) {
  // If this is a saved Word document, load its content from localStorage
  if (windowConfig.isCustom && windowConfig.title) {
    // Extract fileName - handle both with and without .doc extension
    let fileName = windowConfig.title;
    if (fileName.endsWith('.doc')) {
      fileName = fileName.slice(0, -4); // Remove .doc extension
    }
    
    try {
      const localStorageKey = `r_wordDocument_${fileName}`;
      const savedData = localStorage.getItem(localStorageKey);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        windowConfig.appProps = {
          ...windowConfig.appProps,
          content: data.content || windowConfig.appProps?.content || '', // Use localStorage content, fallback to appProps
          isCustom: true, // Mark as custom icon
          originalTitle: windowConfig.title,
        };
      } else {
        // If no localStorage data, use appProps content as fallback
        windowConfig.appProps = {
          ...windowConfig.appProps,
          isCustom: true,
          originalTitle: windowConfig.title,
        };
      }
    } catch (e) {
      console.warn('Failed to load saved document content', e);
      // On error, still set the props
      windowConfig.appProps = {
        ...windowConfig.appProps,
        isCustom: true,
        originalTitle: windowConfig.title,
      };
    }
  } else {
    // For non-custom apps, check if a modified version exists
    const fileName = windowConfig.title.replace('.doc', '');
    const modifiedKey = `r_wordDocument_modified_${fileName}`;
    
    try {
      const modifiedData = localStorage.getItem(modifiedKey);
      const originalContent = windowConfig.appProps?.content || ''; // Store original content from JSON
      if (modifiedData) {
        // Modified version exists, use it instead of original
        const data = JSON.parse(modifiedData);
        windowConfig.appProps = {
          ...windowConfig.appProps,
          content: data.content || windowConfig.appProps?.content || '', // Use modified content
          isCustom: false, // Still non-custom (from JSON config)
          originalTitle: windowConfig.title, // Store original title
          originalContent: originalContent, // Store original content for reset
        };
      } else {
        // No modified version, use original content
        windowConfig.appProps = {
          ...windowConfig.appProps,
          isCustom: false, // Mark as non-custom (from JSON config)
          originalTitle: windowConfig.title, // Store original title
          originalContent: originalContent, // Store original content for reset
        };
      }
    } catch (e) {
      console.warn('Failed to check for modified document', e);
      // On error, use original content
      windowConfig.appProps = {
        ...windowConfig.appProps,
        isCustom: false,
        originalTitle: windowConfig.title,
        originalContent: windowConfig.appProps?.content || '',
      };
    }
  }
  
  windowStore.createWindow(windowConfig);
}

const iconRefreshKey = ref(0);
const savedIconsRefreshKey = ref(0); // Separate key for saved icons updates

// Store original icon positions from windowConfig
const originalIconPositions = new Map();
windowConfig.icons.forEach(icon => {
  originalIconPositions.set(icon.title, { x: icon.x, y: icon.y });
});

// Load saved icons from localStorage
function loadSavedIcons() {
  try {
    const savedIconsJson = localStorage.getItem('r_savedWordIcons');
    if (savedIconsJson) {
      return JSON.parse(savedIconsJson);
    }
  } catch (e) {
    console.warn('Failed to load saved icons from localStorage', e);
  }
  return [];
}

// Save icon positions to localStorage
function saveIconPositionsToLocalStorage() {
  try {
    const positions = {};
    // Save positions from windowConfig icons
    windowConfig.icons.forEach(icon => {
      if (icon.x && icon.y) {
        positions[icon.title] = { x: icon.x, y: icon.y };
      }
    });
    // Save positions from custom icons
    const savedIcons = loadSavedIcons();
    savedIcons.forEach(icon => {
      if (icon.x && icon.y) {
        positions[icon.title] = { x: icon.x, y: icon.y };
      }
    });
    localStorage.setItem('r_iconPositions', JSON.stringify(positions));
  } catch (e) {
    console.warn('Failed to save icon positions to localStorage', e);
  }
}

// Load icon positions from localStorage
function loadIconPositions() {
  try {
    const positionsJson = localStorage.getItem('r_iconPositions');
    if (positionsJson) {
      return JSON.parse(positionsJson);
    }
  } catch (e) {
    console.warn('Failed to load icon positions from localStorage', e);
  }
  return {};
}

// Listen for saved icons updates and permanent deletions
onMounted(() => {
  // Load icon positions from localStorage and apply them
  const savedPositions = loadIconPositions();
  if (Object.keys(savedPositions).length > 0) {
    // Apply positions to windowConfig icons
    windowConfig.icons.forEach(icon => {
      if (savedPositions[icon.title]) {
        icon.x = savedPositions[icon.title].x;
        icon.y = savedPositions[icon.title].y;
      }
    });
    // Apply positions to custom icons
    const savedIcons = loadSavedIcons();
    savedIcons.forEach(icon => {
      if (savedPositions[icon.title]) {
        icon.x = savedPositions[icon.title].x;
        icon.y = savedPositions[icon.title].y;
      }
    });
    // Update saved icons with positions
    if (savedIcons.length > 0) {
      localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
    }
    iconRefreshKey.value++;
  }
  
  window.addEventListener('saved-icons-updated', () => {
    iconRefreshKey.value++;
    savedIconsRefreshKey.value++; // Also refresh saved icons
  });
  
  window.addEventListener('icons-permanently-deleted', (event) => {
    const iconsToDelete = event.detail || [];
    iconsToDelete.forEach(iconConfig => {
      permanentlyDeleteIcon(iconConfig);
    });
    iconRefreshKey.value++;
    savedIconsRefreshKey.value++; // Also refresh saved icons
  });
  
  // Open default window on mount if specified
  if (windowConfig.defaultWindow && windowConfig.defaultWindow.iconTitle) {
    // Wait for icons to be loaded
    nextTick(() => {
      // Find the icon by title
      const allIconsList = allIcons.value;
      const defaultIcon = allIconsList.find(icon => icon.title === windowConfig.defaultWindow.iconTitle);
      
      if (defaultIcon) {
        // Open the icon using handleNewWindow
        handleNewWindow(defaultIcon);
      }
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('saved-icons-updated', () => {
    iconRefreshKey.value++;
    savedIconsRefreshKey.value++;
  });
  
  window.removeEventListener('icons-permanently-deleted', (event) => {
    const iconsToDelete = event.detail || [];
    iconsToDelete.forEach(iconConfig => {
      permanentlyDeleteIcon(iconConfig);
    });
    iconRefreshKey.value++;
    savedIconsRefreshKey.value++;
  });
});

// Get all icons (from config + saved from localStorage)
// Make it reactive to savedIconsRefreshKey so it re-reads from localStorage when positions are updated
const allIcons = computed(() => {
  savedIconsRefreshKey.value; // Make this computed property reactive to saved icons updates
  const savedIcons = loadSavedIcons();
  return [...windowConfig.icons, ...savedIcons];
});

const visibleIcons = computed(() => {
  // Filter out icons that have been deleted (both temporarily and permanently)
  const deletedTitles = trashStore.getAllDeletedIconTitles;
  const filtered = allIcons.value.filter(icon => !deletedTitles.includes(icon.title));
  // Force reactivity by including refresh key and trash count
  iconRefreshKey.value;
  trashStore.getTrashCount; // Make it reactive to trash count changes
  return filtered;
});

function handleIconRestored(event) {
  // Get the restored icon from the event detail
  const restoredIcon = event?.detail;
  if (restoredIcon) {
    // Calculate position starting from bottom left, stacking vertically and wrapping horizontally
    const iconWidth = 70; // Icon width in pixels
    const iconHeight = 100; // Approximate icon height (icon + padding + text)
    const horizontalSpacing = 80; // Horizontal spacing between columns
    const verticalSpacing = 110; // Vertical spacing between rows
    const startX = 10; // Starting x position from left
    const taskbarHeight = 40; // Approximate taskbar height
    const bottomPadding = 10; // Padding from bottom
    
    // Get available height (viewport height minus taskbar)
    const availableHeight = window.innerHeight - taskbarHeight;
    
    // Count non-trash icons that will be visible after restore (including the one being restored)
    // We need to count icons that are not deleted and not trash
    // Use allIcons to include both config icons and saved Word document icons
    const deletedTitles = trashStore.getAllDeletedIconTitles;
    const allNonTrashIcons = allIcons.value.filter(icon => !icon.isTrash && !deletedTitles.includes(icon.title));
    // The restored icon is already removed from trash, so it should be in this list
    const restoredCount = allNonTrashIcons.length - 1; // -1 to get 0-indexed position for the restored icon
    
    // Calculate how many icons fit per column (from bottom to top)
    const iconsPerColumn = Math.max(1, Math.floor((availableHeight - bottomPadding - iconHeight) / verticalSpacing) + 1);
    
    // Calculate grid position
    // Start from bottom and stack upward, wrapping to the right when needed
    const column = Math.floor(restoredCount / iconsPerColumn);
    const row = restoredCount % iconsPerColumn;
    
    // Calculate x and y positions
    const x = startX + (column * horizontalSpacing);
    const y = `calc(100% - ${taskbarHeight + bottomPadding + iconHeight + (row * verticalSpacing)}px)`;
    
    // Update the icon's position in windowConfig or saved icons
    if (restoredIcon.isCustom) {
      // Update saved icon position
      const savedIcons = loadSavedIcons();
      const savedIcon = savedIcons.find(icon => icon.title === restoredIcon.title);
      if (savedIcon) {
        savedIcon.x = `${x}px`;
        savedIcon.y = y;
        localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
        savedIconsRefreshKey.value++; // Trigger reactivity update
      }
    } else {
      // Update windowConfig icon position
      const configIcon = windowConfig.icons.find(icon => icon.title === restoredIcon.title);
      if (configIcon) {
        configIcon.x = `${x}px`;
        configIcon.y = y;
      }
    }
  }
  
  // Force refresh of visible icons
  iconRefreshKey.value++;
  // Update trash can icon if needed
  updateTrashCanIcon();
}

function getIconPath(icon) {
  // Update trash can icon based on whether it's empty or full
  if (icon.isTrash) {
    const hasItems = trashStore.getTrashCount > 0;
    return hasItems 
      ? '/images/resume/recyclebin_full.svg' 
      : '/images/resume/recyclebin_empty.svg';
  }
  return icon['desktop-icon'];
}

function updateTrashCanIcon() {
  // Force refresh to update trash can icon
  iconRefreshKey.value++;
}

function handleContextMenu(e) {
  // Only show context menu if clicking on desktop background, not on icons or windows
  const target = e.target;
  if (target.closest('.windows-icon') || target.closest('.window') || target.closest('.taskbar')) {
    return;
  }
  
  const rect = e.currentTarget.getBoundingClientRect();
  contextMenu.value = {
    visible: true,
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function closeContextMenu() {
  contextMenu.value.visible = false;
}

function handleBackgroundChanged(imageData) {
  desktopBackground.value = imageData;
}

function handleBackgroundReset() {
  desktopBackground.value = defaultBackground;
  localStorage.removeItem('r_desktopBackground');
}

function handleNavbarToggled() {
  // Navbar toggle is handled by the context menu component via navStore
  // This is just for any additional logic if needed
}

function handleResetAll() {
  // Remove all localStorage keys that start with r_
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('r_')) {
      localStorage.removeItem(key);
    }
  });

  // Reset icon positions to original positions from windowConfig
  windowConfig.icons.forEach(icon => {
    const originalPos = originalIconPositions.get(icon.title);
    if (originalPos) {
      icon.x = originalPos.x;
      icon.y = originalPos.y;
    }
  });

  // Reset trash store state
  trashStore.deletedIcons = [];
  trashStore.permanentlyDeletedIcons = [];

  // Reset desktop background
  desktopBackground.value = defaultBackground;

  // Refresh icons and windows
  iconRefreshKey.value++;
  savedIconsRefreshKey.value++;

  // Don't close open windows - keep apps open
  // windows.value = [];
}

function handleDocumentClick(e) {
  // Close context menu if clicking outside of it
  if (!e.target.closest('.context-menu')) {
    closeContextMenu();
  }
}

onMounted(() => {
  window.addEventListener('icon-restored', handleIconRestored);
  // Close context menu on click outside
  document.addEventListener('click', handleDocumentClick);
  // Load background from localStorage
    const savedBackground = localStorage.getItem('r_desktopBackground');
  if (savedBackground) {
    desktopBackground.value = savedBackground;
  }
  // Disable cube rotation if navbar is hidden
  if (navStore.hide) {
    cubeStore.toggleKeyRotate(false);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('icon-restored', handleIconRestored);
  document.removeEventListener('click', handleDocumentClick);
  // Reset navbar visibility when leaving resume page
  if (navStore.hide) {
    navStore.toggleHide(false);
    // Re-enable cube rotation when navbar is shown again
    cubeStore.toggleKeyRotate(true);
  }
});

function handleTrashDrop(iconConfig) {
  trashStore.deleteIcon(iconConfig);
  
  // Remove saved document data from localStorage if it's a custom saved Word document
  if (iconConfig.isCustom && iconConfig.title) {
    // Extract fileName by removing .doc extension if present
    const fileName = iconConfig.title.endsWith('.doc') 
      ? iconConfig.title.slice(0, -4) 
      : iconConfig.title;
    
    // Remove wordDocument entries
      localStorage.removeItem(`r_wordDocument_${fileName}`);
    
    // Also check for any wordDocument entries that might match (with or without .doc)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('r_wordDocument_')) {
        const keyFileName = key.replace('r_wordDocument_', '');
        // Match if the key fileName matches the icon's fileName (with or without .doc)
        if (keyFileName === fileName || keyFileName === iconConfig.title || 
            keyFileName === `${fileName}.doc` || keyFileName === iconConfig.title.replace('.doc', '')) {
          localStorage.removeItem(key);
        }
      }
    });
  }
  
  // Force refresh of visible icons
  iconRefreshKey.value++;
  updateTrashCanIcon();
}

// Function to permanently delete an icon (called when emptying trash)
function permanentlyDeleteIcon(iconConfig) {
  // Remove from localStorage if it's a saved Word document
  if (iconConfig.isCustom) {
    const savedIcons = loadSavedIcons();
    const updatedIcons = savedIcons.filter(icon => icon.title !== iconConfig.title);
    localStorage.setItem('r_savedWordIcons', JSON.stringify(updatedIcons));
  }
  
  // Also remove any associated localStorage entries (document data)
  if (iconConfig.isCustom && iconConfig.title) {
    // Extract fileName by removing .doc extension if present
    const fileName = iconConfig.title.endsWith('.doc') 
      ? iconConfig.title.slice(0, -4) 
      : iconConfig.title;
    
    // Remove wordDocument entries
      localStorage.removeItem(`r_wordDocument_${fileName}`);
    
    // Also check for any wordDocument entries that might match (with or without .doc)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('r_wordDocument_')) {
        const keyFileName = key.replace('r_wordDocument_', '');
        // Match if the key fileName matches the icon's fileName (with or without .doc)
        if (keyFileName === fileName || keyFileName === iconConfig.title || 
            keyFileName === `${fileName}.doc` || keyFileName === iconConfig.title.replace('.doc', '')) {
          localStorage.removeItem(key);
        }
      }
    });
  }
}

function handleDesktopMouseDown(e) {
  // Don't start selection on right-click (button 2) or middle-click (button 1)
  // Only allow left-click (button 0) for selection
  if (e.button !== 0 && e.button !== undefined) {
    return;
  }
  
  // Only start selection if clicking on desktop background (not on icons, windows, or taskbar)
  const target = e.target;
  const isDesktop = target.classList.contains('resume') || 
                    target.classList.contains('desktop-icons-container') ||
                    (target.tagName === 'DIV' && !target.closest('.windows-icon') && !target.closest('.window') && !target.closest('.taskbar'));
  
  if (isDesktop) {
    // Check if we're clicking on an icon or its children
    const iconElement = target.closest('.windows-icon');
    if (iconElement) {
      // If clicking on an icon, don't start selection
      return;
    }

    // Clear previous selection
    selectedIconIndices.value = [];
    selectionBox.value.visible = false;

    // Start selection box
    const rect = e.currentTarget.getBoundingClientRect();
    selectionBox.value = {
      visible: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      left: e.clientX - rect.left,
      top: e.clientY - rect.top,
      width: 0,
      height: 0,
    };
    isSelecting.value = true;
  }
}

function handleDesktopMouseMove(e) {
  if (isSelecting.value) {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    selectionBox.value.left = Math.min(selectionBox.value.startX, currentX);
    selectionBox.value.top = Math.min(selectionBox.value.startY, currentY);
    selectionBox.value.width = Math.abs(currentX - selectionBox.value.startX);
    selectionBox.value.height = Math.abs(currentY - selectionBox.value.startY);

    // Update selected icons based on selection box
    updateSelectedIcons();
  } else if (isDraggingSelection.value) {
    // Drag all selected icons together
    const deltaX = e.movementX || 0;
    const deltaY = e.movementY || 0;

    selectedIconIndices.value.forEach(index => {
      const iconRef = iconRefs.value[index];
      if (iconRef && iconRef.$el) {
        const iconElement = iconRef.$el.querySelector('.windows-icon');
        if (iconElement) {
          const currentLeft = parseFloat(iconElement.style.left) || parseFloat(getComputedStyle(iconElement).left) || 0;
          const currentTop = parseFloat(iconElement.style.top) || parseFloat(getComputedStyle(iconElement).top) || 0;
          iconElement.style.left = `${currentLeft + deltaX}px`;
          iconElement.style.top = `${currentTop + deltaY}px`;
        }
      }
    });

    // Check if over trash
    checkSelectionOverTrash();
  }
}

function handleDesktopMouseUp() {
  if (isSelecting.value) {
    isSelecting.value = false;
    // Always hide selection box when mouse is released (even if icons are selected)
    selectionBox.value.visible = false;
    // Mark that we just finished selecting to prevent immediate clearing
    justFinishedSelecting.value = true;
    // Reset the flag after a short delay
    setTimeout(() => {
      justFinishedSelecting.value = false;
    }, 200);
    return; // Don't clear selection right after finishing selection
  }
  
  // Don't clear selection on mouseup - let click handler do it if needed
}

function handleDesktopClick(e) {
  // Don't clear selection if clicking on context menu
  if (e.target.closest('.context-menu')) {
    return;
  }
  
  // Clear selection when clicking on desktop (not on icons)
  // But don't clear if we just finished selecting
  if (justFinishedSelecting.value) {
    return;
  }
  
  const target = e.target;
  const isDesktop = target.classList.contains('resume') || 
                    target.classList.contains('desktop-icons-container');
  
  // Only clear if clicking on empty desktop (not on icons or selection box)
  if (isDesktop && !target.closest('.windows-icon') && !target.closest('.selection-box')) {
    selectedIconIndices.value = [];
    selectionBox.value.visible = false;
  }
}

function updateSelectedIcons() {
  if (!selectionBox.value.visible || selectionBox.value.width < 5 || selectionBox.value.height < 5) {
    return;
  }

  const container = document.querySelector('.desktop-icons-container');
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const boxRect = {
    left: selectionBox.value.left,
    top: selectionBox.value.top,
    right: selectionBox.value.left + selectionBox.value.width,
    bottom: selectionBox.value.top + selectionBox.value.height,
  };

  const newSelection = [];
  visibleIcons.value.forEach((icon, index) => {
    const iconRef = iconRefs.value[index];
    if (iconRef && iconRef.$el) {
      const iconElement = iconRef.$el.querySelector('.windows-icon');
      if (iconElement) {
        const iconRect = iconElement.getBoundingClientRect();
        const iconLeft = iconRect.left - containerRect.left;
        const iconTop = iconRect.top - containerRect.top;
        const iconRight = iconLeft + iconRect.width;
        const iconBottom = iconTop + iconRect.height;
        const iconCenterX = iconLeft + iconRect.width / 2;
        const iconCenterY = iconTop + iconRect.height / 2;

        // Check if icon center or any corner is within selection box
        if (
          (iconCenterX >= boxRect.left && iconCenterX <= boxRect.right &&
           iconCenterY >= boxRect.top && iconCenterY <= boxRect.bottom) ||
          (iconLeft >= boxRect.left && iconRight <= boxRect.right &&
           iconTop >= boxRect.top && iconBottom <= boxRect.bottom)
        ) {
          newSelection.push(index);
        }
      }
    }
  });

  selectedIconIndices.value = newSelection;
}

function startSelectionDrag(e) {
  if (selectedIconIndices.value.length > 1) {
    e.preventDefault();
    e.stopPropagation();
    isDraggingSelection.value = true;
    
    const container = document.querySelector('.desktop-icons-container');
    const containerRect = container.getBoundingClientRect();
    selectionDragStart.value = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };
    
    // Store initial positions
    selectionInitialPositions.value = [];
    selectedIconIndices.value.forEach(index => {
      const iconRef = iconRefs.value[index];
      if (iconRef && iconRef.$el) {
        const iconElement = iconRef.$el.querySelector('.windows-icon');
        if (iconElement) {
          const rect = iconElement.getBoundingClientRect();
          selectionInitialPositions.value[index] = {
            left: rect.left - containerRect.left,
            top: rect.top - containerRect.top,
          };
          iconElement.style.position = 'absolute';
        }
      }
    });

    // Add global mouse move and up handlers
    document.addEventListener('mousemove', handleSelectionDrag);
    document.addEventListener('mouseup', handleSelectionDragEnd);
  }
}

function handleSelectionDrag(e) {
  if (!isDraggingSelection.value) return;
  
  const container = document.querySelector('.desktop-icons-container');
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  
  const currentX = e.clientX - containerRect.left;
  const currentY = e.clientY - containerRect.top;
  const deltaX = currentX - selectionDragStart.value.x;
  const deltaY = currentY - selectionDragStart.value.y;

  selectedIconIndices.value.forEach(index => {
    const iconRef = iconRefs.value[index];
    if (iconRef && iconRef.$el) {
      const iconElement = iconRef.$el.querySelector('.windows-icon');
      if (iconElement && selectionInitialPositions.value[index]) {
        const initial = selectionInitialPositions.value[index];
        iconElement.style.left = `${initial.left + deltaX}px`;
        iconElement.style.top = `${initial.top + deltaY}px`;
      }
    }
  });

  checkSelectionOverTrash();
}

function handleSelectionDragEnd() {
  if (isDraggingSelection.value) {
    isDraggingSelection.value = false;
    document.removeEventListener('mousemove', handleSelectionDrag);
    document.removeEventListener('mouseup', handleSelectionDragEnd);
    
    // Save positions of dragged icons
    saveIconPositions();
    
    handleSelectionTrashDrop();
    selectionInitialPositions.value = [];
  }
}

function saveIconPositions() {
  // Save current icon positions to windowConfig for selected icons
  selectedIconIndices.value.forEach(index => {
    const icon = visibleIcons.value[index];
    const iconRef = iconRefs.value[index];
    if (iconRef && iconRef.$el && icon) {
      const iconElement = iconRef.$el.querySelector('.windows-icon');
      if (iconElement) {
        const left = iconElement.style.left || getComputedStyle(iconElement).left;
        const top = iconElement.style.top || getComputedStyle(iconElement).top;
        
        // Find the icon in windowConfig or saved icons and update its position
        if (icon.isCustom) {
          const savedIcons = loadSavedIcons();
          const savedIcon = savedIcons.find(cfgIcon => cfgIcon.title === icon.title);
          if (savedIcon) {
            savedIcon.x = left;
            savedIcon.y = top;
            localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
            savedIconsRefreshKey.value++; // Trigger reactivity update
          }
        } else {
          const configIcon = windowConfig.icons.find(cfgIcon => cfgIcon.title === icon.title);
          if (configIcon) {
            configIcon.x = left;
            configIcon.y = top;
            // Save icon positions to localStorage
            saveIconPositionsToLocalStorage();
          }
        }
      }
    }
  });
}

function checkSelectionOverTrash() {
  const trashElement = document.querySelector('[data-is-trash="true"]');
  if (!trashElement || selectedIconIndices.value.length === 0) return;

  // Check if trash is in the selection - if so, don't highlight
  const hasTrashInSelection = selectedIconIndices.value.some(index => {
    const iconConfig = visibleIcons.value[index];
    return iconConfig && iconConfig.isTrash;
  });

  if (hasTrashInSelection) {
    trashElement.classList.remove('trash-highlight');
    return;
  }

  let anyOverTrash = false;
  // Only check non-trash icons for overlap with trash
  selectedIconIndices.value.forEach(index => {
    const iconConfig = visibleIcons.value[index];
    // Skip trash icon in the check
    if (iconConfig && iconConfig.isTrash) return;
    
    const iconRef = iconRefs.value[index];
    if (iconRef && iconRef.$el) {
      const iconElement = iconRef.$el.querySelector('.windows-icon');
      if (iconElement) {
        const iconRect = iconElement.getBoundingClientRect();
        const trashRect = trashElement.getBoundingClientRect();
        const isOver = !(
          iconRect.right < trashRect.left ||
          iconRect.left > trashRect.right ||
          iconRect.bottom < trashRect.top ||
          iconRect.top > trashRect.bottom
        );
        if (isOver) {
          anyOverTrash = true;
        }
      }
    }
  });

  if (anyOverTrash) {
    trashElement.classList.add('trash-highlight');
  } else {
    trashElement.classList.remove('trash-highlight');
  }
}

function handleSelectionTrashDrop() {
  const trashElement = document.querySelector('[data-is-trash="true"]');
  if (!trashElement || selectedIconIndices.value.length === 0) return;

  // Check if trash is in the selection
  const hasTrashInSelection = selectedIconIndices.value.some(index => {
    const iconConfig = visibleIcons.value[index];
    return iconConfig && iconConfig.isTrash;
  });

  // If trash is in selection, don't delete other icons - just move them
  if (hasTrashInSelection) {
    if (trashElement) {
      trashElement.classList.remove('trash-highlight');
    }
    return;
  }

  let anyOverTrash = false;
  // Only check non-trash icons for overlap with trash
  selectedIconIndices.value.forEach(index => {
    const iconConfig = visibleIcons.value[index];
    // Skip trash icon in the check
    if (iconConfig && iconConfig.isTrash) return;
    
    const iconRef = iconRefs.value[index];
    if (iconRef && iconRef.$el) {
      const iconElement = iconRef.$el.querySelector('.windows-icon');
      if (iconElement) {
        const iconRect = iconElement.getBoundingClientRect();
        const trashRect = trashElement.getBoundingClientRect();
        const isOver = !(
          iconRect.right < trashRect.left ||
          iconRect.left > trashRect.right ||
          iconRect.bottom < trashRect.top ||
          iconRect.top > trashRect.bottom
        );
        if (isOver) {
          anyOverTrash = true;
        }
      }
    }
  });

  if (anyOverTrash) {
    // Delete all selected non-trash icons
    const iconsToDelete = selectedIconIndices.value.map(index => visibleIcons.value[index]);
    iconsToDelete.forEach(iconConfig => {
      if (!iconConfig.isTrash) {
        handleTrashDrop(iconConfig);
      }
    });
    selectedIconIndices.value = [];
    selectionBox.value.visible = false;
  }

  if (trashElement) {
    trashElement.classList.remove('trash-highlight');
  }
}

function handleIconDragEnd(element) {
  // Save icon position when drag ends
  if (element) {
    // element is the .windows-icon div
    const left = element.style.left || getComputedStyle(element).left;
    const top = element.style.top || getComputedStyle(element).top;
    const labelElement = element.querySelector('p');
    if (labelElement) {
      const label = labelElement.textContent.trim();
      
      // Check if it's a saved Word document icon
      const savedIcons = loadSavedIcons();
      const savedIcon = savedIcons.find(icon => icon.title === label);
      if (savedIcon) {
        savedIcon.x = left;
        savedIcon.y = top;
        localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
        savedIconsRefreshKey.value++; // Trigger reactivity update
        return;
      }
      
      // Otherwise, check windowConfig icons
      const configIcon = windowConfig.icons.find(icon => icon.title === label);
      if (configIcon) {
        configIcon.x = left;
        configIcon.y = top;
        // Save icon positions to localStorage
        saveIconPositionsToLocalStorage();
      }
    }
  }
}


function getIconProps(iconConfig, index) {
  // Trash icon can be dragged and selected like other icons, but shouldn't be deletable (can't drop on itself)
  let dragProps;
  if (iconConfig.isTrash) {
    dragProps = dragParentElement(true, true, () => {}, '', handleIconDragEnd); // Trash can be dragged
  } else {
    dragProps = dragParentElementWithTrash(true, true, handleTrashDrop, iconConfig, handleIconDragEnd);
  }
  
  // Wrap the mousedown handler to check for multi-select (applies to all icons including trash)
  const originalOnMousedown = dragProps.onMousedown;
  const customOnMousedown = function(e) {
    // Check if multiple icons are selected and this is one of them
    if (selectedIconIndices.value.length > 1 && selectedIconIndices.value.includes(index)) {
      // Start multi-icon drag instead
      e.preventDefault();
      e.stopPropagation();
      startSelectionDrag(e);
      return;
    }
    
    // Clear selection if this icon isn't selected
    if (!selectedIconIndices.value.includes(index)) {
      selectedIconIndices.value = [];
      selectionBox.value.visible = false;
    }
    
    // Use normal drag for single icon
    if (originalOnMousedown) {
      originalOnMousedown.call(this, e);
    }
  };

  // Wrap touch handler similarly
  const originalOnTouchstart = dragProps.onTouchstart;
  const customOnTouchstart = function(e) {
    if (selectedIconIndices.value.length > 1 && selectedIconIndices.value.includes(index)) {
      e.preventDefault();
      e.stopPropagation();
      startSelectionDrag(e);
      return;
    }
    if (originalOnTouchstart) {
      originalOnTouchstart.call(this, e);
    }
  };

  // All icons (including trash) can be dragged and selected
  return {
    ...onDoubleClick(handleNewWindow, [iconConfig]),
    ...dragProps,
    onMousedown: customOnMousedown,
    onTouchstart: customOnTouchstart,
  };
}

function handleOpenApp(appConfig) {
  // If this is the defaultWindow menu item from start menu, use the defaultWindow icon
  if (appConfig.iconTitle && windowConfig.defaultWindow && appConfig.iconTitle === windowConfig.defaultWindow.iconTitle) {
    const defaultIcon = windowConfig.icons.find(icon => icon.title === appConfig.iconTitle);
    if (defaultIcon) {
      // Replace appConfig with the default icon configuration
      Object.assign(appConfig, {
        title: defaultIcon.title,
        app: defaultIcon.app,
        appProps: defaultIcon.appProps || {},
        width: defaultIcon.width,
        height: defaultIcon.height,
      });
    }
  }
  
  // If this is a saved Word document, load its content from localStorage
  if (appConfig.isCustom && appConfig.title) {
    // Extract fileName - handle both with and without .doc extension
    let fileName = appConfig.title;
    if (fileName.endsWith('.doc')) {
      fileName = fileName.slice(0, -4); // Remove .doc extension
    }
    
    try {
      const localStorageKey = `r_wordDocument_${fileName}`;
      const savedData = localStorage.getItem(localStorageKey);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        appConfig.appProps = {
          ...appConfig.appProps,
          content: data.content || appConfig.appProps?.content || '', // Use localStorage content, fallback to appProps
          isCustom: true, // Mark as custom icon
          originalTitle: appConfig.title,
        };
      } else {
        // If no localStorage data, use appProps content as fallback
        appConfig.appProps = {
          ...appConfig.appProps,
          isCustom: true,
          originalTitle: appConfig.title,
        };
      }
    } catch (e) {
      console.warn('Failed to load saved document content', e);
      // On error, still set the props
      appConfig.appProps = {
        ...appConfig.appProps,
        isCustom: true,
        originalTitle: appConfig.title,
      };
    }
  } else {
    // For non-custom apps, check if a modified version exists
    const fileName = appConfig.title.replace('.doc', '');
    const modifiedKey = `r_wordDocument_modified_${fileName}`;
    
      try {
        const modifiedData = localStorage.getItem(modifiedKey);
        const originalContent = appConfig.appProps?.content || ''; // Store original content from JSON
        if (modifiedData) {
          // Modified version exists, use it instead of original
          const data = JSON.parse(modifiedData);
          appConfig.appProps = {
            ...appConfig.appProps,
            content: data.content || appConfig.appProps?.content || '', // Use modified content
            isCustom: false, // Still non-custom (from JSON config)
            originalTitle: appConfig.title, // Store original title
            originalContent: originalContent, // Store original content for reset
          };
        } else {
          // No modified version, use original content
          appConfig.appProps = {
            ...appConfig.appProps,
            isCustom: false, // Mark as non-custom (from JSON config)
            originalTitle: appConfig.title, // Store original title
            originalContent: originalContent, // Store original content for reset
          };
        }
      } catch (e) {
        console.warn('Failed to check for modified document', e);
        // On error, use original content
        appConfig.appProps = {
          ...appConfig.appProps,
          isCustom: false,
          originalTitle: appConfig.title,
          originalContent: appConfig.appProps?.content || '',
        };
      }
  }
  
  windowStore.createWindow(appConfig);
}

function handleShutdown() {
  // Handle shutdown - could show a dialog or navigate away
  if (confirm('Are you sure you want to shut down?')) {
    // You can add shutdown logic here, like navigating away or closing the app
    console.log('Shutting down...');
  }
}
</script>

<style lang="less" scoped>
.resume {
  background-image: linear-gradient(lightblue, lightgreen);
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: center;
  transition: transform 0.25s ease-out;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.desktop-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.selection-box {
  position: absolute;
  border: 1px dashed #0066cc;
  background-color: rgba(0, 102, 204, 0.1);
  pointer-events: none;
  z-index: 10;
  box-sizing: border-box;
  border-style: dashed;
  border-color: #0066cc;
  background: rgba(0, 102, 204, 0.08);
}
</style>
