<template>
  <PagedEditor v-model="editorContent" @focus="handleEditorFocus" @blur="handleEditorBlur" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import PagedEditor from './WordComponents/PagedEditor.vue';
import { cubeStore } from '@/stores/cubeStore';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const editorContent = ref(props.content || '');

// Watch for external content changes
watch(
  () => props.content,
  (newContent) => {
    if (newContent !== editorContent.value) {
      editorContent.value = newContent;
    }
  }
);

// Initialize with content if provided
onMounted(() => {
  if (props.content) {
    editorContent.value = props.content;
  }
});

// Handle editor focus - disable cube rotation
function handleEditorFocus() {
  cubeStore.toggleKeyRotate(false);
}

// Handle editor blur - re-enable cube rotation
function handleEditorBlur() {
  cubeStore.toggleKeyRotate(true);
}

// Ensure cube rotation is re-enabled when component is unmounted
onBeforeUnmount(() => {
  cubeStore.toggleKeyRotate(true);
});
</script>
