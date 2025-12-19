<template>
  <div class="paged-editor">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { EditorView } from 'prosemirror-view';
import { getState, pagedEditorSchema } from './scripts/service.js';
import { serializeContent, getPageContentHeight, generateId } from './scripts/helpers.js';
import { setTextAlign as setTextAlignCommand, getTextAlign as getTextAlignCommand } from './scripts/commands.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  topMargin: {
    type: String,
    default: '1in',
  },
  bottomMargin: {
    type: String,
    default: '1in',
  },
  pageSpacing: {
    type: String,
    default: '40px',
  },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const editorRef = ref(null);
const editorViewRef = { current: null };
let editorView = null;
let lastEmittedContent = '';

function cleanAndSend() {
  const value = serializeContent(editorView);
  if (value !== lastEmittedContent) {
    lastEmittedContent = value;
    emit('update:modelValue', value);
  }
}

onMounted(() => {
  nextTick(() => {
    if (!editorRef.value) return;
    
    const getPageHeight = () => getPageContentHeight(props.topMargin, props.bottomMargin);
    
    const state = getState(props.modelValue || '', {
      generateId,
      getPageContentHeight: getPageHeight,
      editorViewRef,
      onContentChange: cleanAndSend,
    });
    
    editorView = new EditorView(editorRef.value, {
      state,
      dispatchTransaction(transaction) {
        const { state: newState, transactions } = editorView.state.applyTransaction(transaction);
        editorView.updateState(newState);
        
        const docChanged = transactions.some(t => t.docChanged);
        if (docChanged) {
          cleanAndSend();
        }
      },
    });
    
    editorViewRef.current = editorView;
    
    // Force an update to ensure rendering
    editorView.updateState(state);
    
    editorView.dom.addEventListener('focus', () => {
      emit('focus');
    });
    
    editorView.dom.addEventListener('blur', () => {
      emit('blur');
    });
  });
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorView) return;
    
    // Skip if this is the content we just emitted
    if (newValue === lastEmittedContent) {
      return;
    }
    
    const currentContent = serializeContent(editorView);
    if (currentContent !== newValue) {
      const getPageHeight = () => getPageContentHeight(props.topMargin, props.bottomMargin);
      
      const newState = getState(newValue || '', {
        generateId,
        getPageContentHeight: getPageHeight,
        editorViewRef,
        onContentChange: cleanAndSend,
      });
      editorView.updateState(newState);
      lastEmittedContent = newValue;
    }
  }
);

function setTextAlign(alignment) {
  if (!editorView) return false;
  const { state, dispatch } = editorView;
  return setTextAlignCommand(alignment)(state, dispatch);
}

function getTextAlign() {
  if (!editorView) return 'left';
  return getTextAlignCommand(editorView.state);
}

function getContent() {
  return serializeContent(editorView);
}

// Expose editor view and methods for parent component
defineExpose({
  getEditorView: () => editorView,
  getSchema: () => pagedEditorSchema,
  getContent,
  setTextAlign,
  getTextAlign,
});
</script>

<style lang="less" scoped>
.paged-editor {
  background: #ece9d8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: v-bind('props.pageSpacing');
}

.editor-container {
  width: 100%;
  max-width: 8.5in;
  display: flex;
  flex-direction: column;
  gap: v-bind('props.pageSpacing');
  
  :deep(.ProseMirror) {
    outline: none;
    
    .page-node {
      width: 100%;
      max-width: 8.5in;
      min-width: 8.5in;
      min-height: 11in;
      max-height: 11in;
      background: white;
      box-shadow: 4px 4px 0 black;
      border: 1px solid black;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      box-sizing: border-box;
      position: relative;
      padding-top: v-bind('props.topMargin');
      padding-bottom: v-bind('props.bottomMargin');
      padding-left: 1in;
      padding-right: 1in;
      margin-bottom: v-bind('props.pageSpacing');
      
      p {
        margin: 0;
        margin-bottom: 0.25em;
        
        &:first-child {
          margin-top: 0;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 0.5em 0;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      ul, ol {
        margin: 0.5em 0;
        padding-left: 2em;
      }
      
      li {
        margin: 0.25em 0;
      }
      
      blockquote {
        border-left: 3px solid #ccc;
        margin: 0.5em 0;
        padding-left: 1em;
        color: #666;
        font-style: italic;
      }
      
      code {
        background: #f4f4f4;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 11pt;
      }
      
      pre {
        background: #f4f4f4;
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5em 0;
        
        code {
          background: none;
          padding: 0;
        }
      }
      
      strong {
        font-weight: bold;
      }
      
      em {
        font-style: italic;
      }
      
      u {
        text-decoration: underline;
      }
    }
  }
}
</style>
