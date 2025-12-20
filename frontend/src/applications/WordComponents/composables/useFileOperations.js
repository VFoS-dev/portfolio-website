/**
 * Composable for file operations (save, load, etc.)
 */
import { inject } from 'vue';
import { windowStore } from '@/stores/windowStore';
import SaveAsForm from '../SaveAsForm.vue';

export function useFileOperations(editorRef, editorContent, props) {
  // Inject windowId from Window component
  const windowId = inject('windowId', null);
  function handleSave() {
    const content = editorRef.value?.getContent() || editorContent.value;
    
    // If this is a non-custom app (from JSON config), save as modified version
    if (!props.isCustom && props.originalTitle) {
      const fileName = props.originalTitle.replace('.doc', '');
      const modifiedKey = `r_wordDocument_modified_${fileName}`;
      
      localStorage.setItem(modifiedKey, JSON.stringify({
        name: fileName,
        content: content,
        timestamp: Date.now(),
        isModified: true,
        originalTitle: props.originalTitle,
      }));
      
      return;
    }
    
    // For custom icons, use existing logic
    const defaultName = 'Document';
    const fileName = defaultName;
    
    // Save document content
    localStorage.setItem(`wordDocument_${fileName}`, JSON.stringify({
      name: fileName,
      content: content,
      timestamp: Date.now(),
    }));
    
    // Create or update icon entry
    createOrUpdateWordIcon(fileName, content);
    
  }

  function handleSaveAs() {
    const content = editorRef.value?.getContent() || editorContent.value;
    
    // Calculate center position for the window
    const windowWidth = 240;
    const windowHeight = 196;
    const left = (window.innerWidth - windowWidth) / 2;
    const top = (window.innerHeight - windowHeight) / 2;
    
    // Create a Submittable window for file name input
    const saveAsWindow = windowStore.createWindow({
      title: 'Save As',
      icon: '/images/resume/wordIcon.png',
      app: 'Submittable',
      width: windowWidth,
      height: windowHeight,
      left: left,
      top: top,
      appProps: {
        component: SaveAsForm,
        componentProps: {},
        initialData: { fileName: '' },
        validate: (data) => {
          return data.fileName && data.fileName.trim().length > 0;
        },
        onSubmit: async (data) => {
          const fileName = data.fileName.trim();
          if (!fileName) return;
          
          // Save document content
          localStorage.setItem(`r_wordDocument_${fileName}`, JSON.stringify({
            name: fileName,
            content: content,
            timestamp: Date.now(),
          }));
          
          // Create or update icon entry
          createOrUpdateWordIcon(fileName, content);
          
          
          // Update the current window's title and appProps using the injected windowId
          if (windowId) {
            // Get the current window from the store
            const currentWindow = windowStore.windows[windowId];
            if (currentWindow) {
              // Preserve originalContent if it existed previously
              const updatedAppProps = {
                ...currentWindow.appProps,
                content: content,
                isCustom: true,
                originalTitle: fileName,
              };
              
              // Only preserve originalContent if it existed before
              if (currentWindow.appProps.originalContent !== undefined) {
                updatedAppProps.originalContent = currentWindow.appProps.originalContent;
              }
              
              windowStore.updateWindow(windowId, {
                title: fileName,
                appProps: updatedAppProps,
              });
              // Refocus the Word window
              windowStore.focusWindow(windowId);
            }
          }
          
          // Close the Save As window using the stored window ID
          windowStore.closeWindow(saveAsWindow.id);
          
          return { success: true };
        },
      },
    });
  }

  function createOrUpdateWordIcon(fileName, content) {
    // Load existing saved icons
    let savedIcons = [];
    try {
      const savedIconsJson = localStorage.getItem('r_savedWordIcons');
      if (savedIconsJson) {
        savedIcons = JSON.parse(savedIconsJson);
      }
    } catch (e) {
      console.warn('Failed to load saved icons', e);
    }
    // Check if icon already exists
    const existingIndex = savedIcons.findIndex(icon => icon.title === fileName);
    
    // Calculate unique position for new icons (using same grid logic as ResumeView)
    function calculateIconPosition(iconCount) {
      const iconWidth = 70;
      const iconHeight = 100;
      const horizontalSpacing = 80;
      const verticalSpacing = 110;
      const startX = 10;
      const taskbarHeight = 40;
      const bottomPadding = 10;
      const availableHeight = window.innerHeight - taskbarHeight;
      const iconsPerColumn = Math.max(1, Math.floor((availableHeight - bottomPadding - iconHeight) / verticalSpacing) + 1);
      
      const column = Math.floor(iconCount / iconsPerColumn);
      const row = iconCount % iconsPerColumn;
      
      const x = startX + (column * horizontalSpacing);
      const y = `calc(100% - ${taskbarHeight + bottomPadding + iconHeight + (row * verticalSpacing)}px)`;
      
      return { x: `${x}px`, y };
    }
    
    const iconConfig = {
      title: fileName,
      'desktop-icon': '/images/resume/wordicon_destop.svg',
      icon: '/images/resume/wordIcon.png',
      app: 'Word',
      appProps: {
        content: content,
      },
      isCustom: true,
      savedAt: Date.now(),
    };
    
    if (existingIndex !== -1) {
      // Update existing icon - preserve its position
      const existingIcon = savedIcons[existingIndex];
      savedIcons[existingIndex] = {
        ...existingIcon,
        ...iconConfig,
        x: existingIcon.x || iconConfig.x,
        y: existingIcon.y || iconConfig.y,
        appProps: {
          ...existingIcon.appProps,
          content: content,
        },
      };
    } else {
      // Add new icon with calculated position
      // Count existing icons to determine position
      const iconCount = savedIcons.length;
      const position = calculateIconPosition(iconCount);
      iconConfig.x = position.x;
      iconConfig.y = position.y;
      savedIcons.push(iconConfig);
    }
    
    // Save back to localStorage
    localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
    
    // Emit event to refresh desktop icons
    window.dispatchEvent(new CustomEvent('saved-icons-updated'));
  }

  function handleNew() {
     // Create a new Word window with "Untitled document" title
     // The "- Microsoft Word" suffix will be added automatically by the window store
    windowStore.createWindow({
      title: 'Untitled document',
      icon: '/images/resume/wordIcon.png',
      app: 'Word',
      appProps: {
        content: '',
        isCustom: true,
      },
    });
  }

  function handleExport() {
    const view = editorRef.value?.getEditorView();
    if (!view) return;
    
    try {
      // Get the HTML content string (same as what getContent() returns)
      const htmlContent = editorRef.value?.getContent() || editorContent.value;
      
      // Copy to clipboard
      navigator.clipboard.writeText(htmlContent).then(() => {
        // Optional: Show a brief notification (you could use a toast/alert here)
        console.log('HTML content exported to clipboard');
      }).catch((error) => {
        console.error('Failed to copy to clipboard:', error);
        // Fallback: try using execCommand
        const textarea = document.createElement('textarea');
        textarea.value = htmlContent;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          console.log('HTML content exported to clipboard (fallback)');
        } catch (fallbackError) {
          console.error('Fallback copy also failed:', fallbackError);
        }
        document.body.removeChild(textarea);
      });
    } catch (error) {
      console.error('Failed to export HTML content:', error);
    }
  }

  return {
    handleSave,
    handleSaveAs,
    handleNew,
    handleExport,
  };
}
