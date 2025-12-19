/**
 * Composable for file operations (save, load, etc.)
 */
export function useFileOperations(editorRef, editorContent, props) {
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
      
      alert(`Document saved!`);
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
    
    alert('Document saved!');
  }

  function handleSaveAs() {
    const fileName = prompt('Enter file name:', 'document');
    if (fileName) {
      const content = editorRef.value?.getContent() || editorContent.value;
      
      // Save document content
      localStorage.setItem(`r_wordDocument_${fileName}`, JSON.stringify({
        name: fileName,
        content: content,
        timestamp: Date.now(),
      }));
      
      // Create or update icon entry
      createOrUpdateWordIcon(fileName, content);
      
      alert(`Document saved as "${fileName}"!`);
    }
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
    
    // Create icon title with .doc extension
    const iconTitle = fileName.endsWith('.doc') ? fileName : `${fileName}.doc`;
    
    // Check if icon already exists
    const existingIndex = savedIcons.findIndex(icon => icon.title === iconTitle);
    
    const iconConfig = {
      title: iconTitle,
      'desktop-icon': '/images/resume/wordicon_destop.svg',
      icon: '/images/resume/wordIcon.png',
      app: 'Word',
      x: '10px',
      y: '150px',
      appProps: {
        content: content,
      },
      isCustom: true,
      savedAt: Date.now(),
    };
    
    if (existingIndex !== -1) {
      // Update existing icon
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
      // Add new icon
      savedIcons.push(iconConfig);
    }
    
    // Save back to localStorage
    localStorage.setItem('r_savedWordIcons', JSON.stringify(savedIcons));
    
    // Emit event to refresh desktop icons
    window.dispatchEvent(new CustomEvent('saved-icons-updated'));
  }

  function handleNew() {
    if (confirm('Create a new document? Unsaved changes will be lost.')) {
      editorContent.value = '';
      const view = editorRef.value?.getEditorView();
      if (view) {
        const schema = editorRef.value.getSchema();
        if (schema) {
          // Import EditorState dynamically to avoid unused import warning
          import('prosemirror-state').then(({ EditorState }) => {
            const state = EditorState.create({
              schema,
              plugins: view.state.plugins,
            });
            view.updateState(state);
          });
        }
      }
    }
  }

  function handleOpen() {
    const fileName = prompt('Enter file name to open:', 'document');
    if (fileName) {
      const saved = localStorage.getItem(`r_wordDocument_${fileName}`);
      if (saved) {
        const data = JSON.parse(saved);
        editorContent.value = data.content;
      } else {
        alert('File not found!');
      }
    }
  }

  return {
    handleSave,
    handleSaveAs,
    handleNew,
    handleOpen,
  };
}
