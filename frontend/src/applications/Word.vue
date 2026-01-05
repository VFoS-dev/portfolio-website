<template>
  <div class="word-app">
    <MenuBar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :has-been-modified="hasBeenModified"
      :show-reset="!isCustom"
      @save="handleSave"
      @save-as="handleSaveAs"
      @export="handleExport"
      @undo="handleUndo"
      @redo="handleRedo"
      @reset="handleReset"
    />

    <StandardToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      @new="handleNew"
      @save="handleSave"
      @cut="handleCut"
      @copy="handleCopy"
      @paste="handlePaste"
      @undo="handleUndo"
      @redo="handleRedo"
    />

    <FormattingToolbar
      v-model:selected-heading="selectedHeading"
      v-model:selected-font="selectedFont"
      v-model:selected-font-size="selectedFontSize"
      :available-fonts="availableFonts"
      :font-sizes="fontSizes"
      :is-bold="isBold"
      :is-italic="isItalic"
      :is-underline="isUnderline"
      :is-left-align="isLeftAlign"
      :is-center-align="isCenterAlign"
      :is-right-align="isRightAlign"
      :is-justify-align="isJustifyAlign"
      :is-bullet-list="isBulletList"
      :is-ordered-list="isOrderedList"
      @heading-change="applyHeading"
      @font-change="applyFont"
      @font-size-change="applyFontSize"
      @toggle-bold="toggleBold"
      @toggle-italic="toggleItalic"
      @toggle-underline="toggleUnderline"
      @align-left="alignLeft"
      @align-center="alignCenter"
      @align-right="alignRight"
      @align-justify="alignJustify"
      @toggle-bullet-list="toggleBulletList"
      @toggle-ordered-list="toggleOrderedList"
    />

    <!-- Editor -->
    <div class="editor-wrapper">
      <PagedEditor
        ref="editorRef"
        v-model="editorContent"
        @focus="handleEditorFocus"
        @blur="handleEditorBlur"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch, inject } from 'vue';
import PagedEditor from './Word/PagedEditor/PagedEditor.vue';
import MenuBar from './Word/MenuBar.vue';
import StandardToolbar from './Word/StandardToolbar.vue';
import FormattingToolbar from './Word/FormattingToolbar.vue';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();
import { useWindowStore } from '@/stores/windowStore';

const windowStore = useWindowStore();
import { useEditorCommands } from './Word/composables/useEditorCommands.js';
import { useFonts } from './Word/composables/useFonts.js';
import { useFileOperations } from './Word/composables/useFileOperations.js';
import { getState } from './Word/PagedEditor/scripts/service.js';
import { generateId, getPageContentHeight } from './Word/PagedEditor/scripts/helpers.js';
import ResetConfirmationForm from './Word/ResetConfirmationForm.vue';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  originalTitle: {
    type: String,
    default: '',
  },
  originalContent: {
    type: String,
    default: '',
  },
});

const editorRef = ref(null);
const editorContent = ref(props.content || '');
const originalContent = ref(props.originalContent || props.content || '');
const windowId = inject('windowId', null);

// Watch for changes to props.content and update editorContent
watch(() => props.content, (newContent) => {
  if (newContent !== undefined && newContent !== null && newContent !== editorContent.value) {
    editorContent.value = newContent;
    if (!props.originalContent) {
      originalContent.value = newContent;
    }
  }
});

// Watch for originalContent prop changes
watch(() => props.originalContent, (newOriginalContent) => {
  if (newOriginalContent !== undefined && newOriginalContent !== null) {
    originalContent.value = newOriginalContent;
  }
});

// Use composables
const { availableFonts, fontSizes } = useFonts();
const {
  isBold,
  isItalic,
  isUnderline,
  isLeftAlign,
  isCenterAlign,
  isRightAlign,
  isJustifyAlign,
  isBulletList,
  isOrderedList,
  canUndo,
  canRedo,
  selectedHeading,
  selectedFont,
  selectedFontSize,
  updateToolbarState,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  applyHeading,
  applyFont,
  applyFontSize,
  alignLeft,
  alignCenter,
  alignRight,
  alignJustify,
  toggleBulletList,
  toggleOrderedList,
  handleUndo,
  handleRedo,
} = useEditorCommands(editorRef);

const {
  handleSave,
  handleSaveAs,
  handleNew,
  handleExport,
} = useFileOperations(editorRef, editorContent, props);

// Check if document has been modified
const hasBeenModified = computed(() => {
  const currentContent = editorRef.value?.getContent() || editorContent.value;
  return currentContent !== originalContent.value;
});

let editorView = null;
let updateInterval = null;

// Initialize editor view reference
onMounted(async () => {
  await nextTick();
  if (editorRef.value) {
    editorView = editorRef.value.getEditorView();
    
    // Update toolbar state immediately
    updateToolbarState();
    
    // Set up update interval to check editor state (more frequent for responsive updates)
    updateInterval = setInterval(() => {
      if (editorView) {
        updateToolbarState();
      }
    }, 50); // Reduced from 100ms to 50ms for more responsive updates
    
    // Also update on selection changes for immediate feedback
    if (editorView && editorView.dom) {
      editorView.dom.addEventListener('selectionchange', updateToolbarState);
      // Also listen to mouse and keyboard events for immediate updates
      editorView.dom.addEventListener('mouseup', updateToolbarState);
      editorView.dom.addEventListener('keyup', updateToolbarState);
    }
  }
  
  // Load saved content if available
  const savedContent = localStorage.getItem('r_wordDocument');
  if (savedContent && !props.content) {
    editorContent.value = savedContent;
    originalContent.value = savedContent;
  } else if (props.originalContent) {
    originalContent.value = props.originalContent;
  } else if (props.content) {
    originalContent.value = props.content;
  }
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  if (editorView && editorView.dom) {
    editorView.dom.removeEventListener('selectionchange', updateToolbarState);
    editorView.dom.removeEventListener('mouseup', updateToolbarState);
    editorView.dom.removeEventListener('keyup', updateToolbarState);
  }
  cubeStore.toggleKeyRotate(true);
});

function handleCut() {
  document.execCommand('cut');
}

function handleCopy() {
  document.execCommand('copy');
}

async function handlePaste() {
  const view = editorRef.value?.getEditorView();
  if (!view) return;
  
  try {
    // Focus the editor first
    view.focus();
    
    // Read text from clipboard using Clipboard API
    const text = await navigator.clipboard.readText();
    
    if (text) {
      // Insert text at the current selection/cursor position
      const { state, dispatch } = view;
      const { from, to } = state.selection;
      
      // Use ProseMirror's insertText command
      const transaction = state.tr.insertText(text, from, to);
      dispatch(transaction);
    }
  } catch (error) {
    // Fallback: try to trigger a paste event on the editor
    console.warn('Clipboard API failed, trying fallback:', error);
      // Try to get clipboard data via execCommand fallback
    try {
      // Create a temporary textarea to capture paste
      const textarea = document.createElement('textarea');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      
      // Trigger paste
      if (document.execCommand('paste')) {
        const pastedText = textarea.value;
        if (pastedText) {
          const { state, dispatch } = view;
          const { from, to } = state.selection;
          const transaction = state.tr.insertText(pastedText, from, to);
          dispatch(transaction);
        }
      }
      
      document.body.removeChild(textarea);
    } catch (fallbackError) {
      console.error('Paste fallback also failed:', fallbackError);
    }
  }
}

function handleReset() {
  if (!hasBeenModified.value) {
    return;
  }
  
  // Calculate center position for the window
  const windowWidth = 280;
  const windowHeight = 160;
  const left = (window.innerWidth - windowWidth) / 2;
  const top = (window.innerHeight - windowHeight) / 2;
  
  // Create a Submittable window for reset confirmation
  const resetWindow = windowStore.createWindow({
    title: 'Reset to Original',
    icon: '/images/resume/wordIcon.png',
    app: 'Submittable',
    width: windowWidth,
    height: windowHeight,
    left: left,
    top: top,
    appProps: {
      component: ResetConfirmationForm,
      componentProps: {},
      initialData: {},
      validate: () => true,
      onSubmit: async () => {
        // Reset editor content to original
        editorContent.value = originalContent.value;
        
        // Update the editor view with original content using the same mechanism as PagedEditor
        const view = editorRef.value?.getEditorView();
        if (view) {
          // Use getState to properly parse and structure the content
          const getPageHeight = () => getPageContentHeight('1in', '1in'); // Default margins
          
          const newState = getState(originalContent.value || '', {
            generateId,
            getPageContentHeight: getPageHeight,
            editorViewRef: { current: view },
          });
          
          // Update the view with the new state
          view.updateState(newState);
        }
        
        // Delete the modified version from localStorage if it exists
        if (!props.isCustom && props.originalTitle) {
          const fileName = props.originalTitle.replace('.doc', '');
          const modifiedKey = `r_wordDocument_modified_${fileName}`;
          localStorage.removeItem(modifiedKey);
        }
        
        // Close the Reset window
        windowStore.closeWindow(resetWindow.id);
        
        // Refocus the Word window
        if (windowId) {
          windowStore.focusWindow(windowId);
        }
        
        return { success: true };
      },
    },
  });
}

function handleEditorFocus() {
  cubeStore.toggleKeyRotate(false);
}

function handleEditorBlur() {
  cubeStore.toggleKeyRotate(true);
}
</script>

<style lang="less" scoped>
.word-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: 'MS Sans Serif', sans-serif;
}

.editor-wrapper {
  flex: 1;
  overflow: auto;
}
</style>
