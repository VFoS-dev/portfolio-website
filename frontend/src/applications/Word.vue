<template>
  <div class="word-app">
    <MenuBar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :has-been-modified="hasBeenModified"
      :show-reset="!isCustom"
      @save="handleSave"
      @save-as="handleSaveAs"
      @undo="handleUndo"
      @redo="handleRedo"
      @reset="handleReset"
    />

    <StandardToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      @new="handleNew"
      @open="handleOpen"
      @save="handleSave"
      @cut="handleCut"
      @copy="handleCopy"
      @paste="handlePaste"
      @undo="handleUndo"
      @redo="handleRedo"
    />

    <FormattingToolbar
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import PagedEditor from './WordComponents/PagedEditor/PagedEditor.vue';
import MenuBar from './WordComponents/MenuBar.vue';
import StandardToolbar from './WordComponents/StandardToolbar.vue';
import FormattingToolbar from './WordComponents/FormattingToolbar.vue';
import { cubeStore } from '@/stores/cubeStore';
import { useEditorCommands } from './WordComponents/composables/useEditorCommands.js';
import { useFonts } from './WordComponents/composables/useFonts.js';
import { useFileOperations } from './WordComponents/composables/useFileOperations.js';
import { DOMParser } from 'prosemirror-model';

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
  selectedFont,
  selectedFontSize,
  updateToolbarState,
  toggleBold,
  toggleItalic,
  toggleUnderline,
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
  handleOpen,
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
    
    // Set up update interval to check editor state
    updateInterval = setInterval(() => {
      if (editorView) {
        updateToolbarState();
      }
    }, 100);
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
  cubeStore.toggleKeyRotate(true);
});

function handleCut() {
  document.execCommand('cut');
}

function handleCopy() {
  document.execCommand('copy');
}

function handlePaste() {
  document.execCommand('paste');
}

function handleReset() {
  if (!hasBeenModified.value) {
    return;
  }
  
  if (confirm('Are you sure you want to reset the document to its original state? All unsaved changes will be lost.')) {
    // Reset editor content to original
    editorContent.value = originalContent.value;
    
    // Update the editor view with original content
    const view = editorRef.value?.getEditorView();
    if (view) {
      const schema = editorRef.value.getSchema();
      if (schema) {
        const parser = DOMParser.fromSchema(schema);
        const dom = new DOMParser().parseFromString(originalContent.value, 'text/html');
        const doc = parser.parse(dom);
        const tr = view.state.tr.replace(0, view.state.doc.content.size, doc.content);
        view.dispatch(tr);
      }
    }
  }
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
