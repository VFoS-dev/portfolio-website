<template>
  <component
    :is="contentComponent"
    v-bind="contentProps"
    @update:model-value="handleUpdate"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref, computed, defineAsyncComponent, inject } from 'vue';
import Fragment from '@/components/Fragment.vue';
import { windowStore } from '@/stores/windowStore';

const props = defineProps({
  // Component to render - can be a string path or component object
  component: {
    type: [String, Object],
    required: true,
  },
  // Props to pass to the component
  componentProps: {
    type: Object,
    default: () => ({}),
  },
  // Submit function - should be passed as a function reference in appProps
  onSubmit: {
    type: Function,
    default: null,
  },
  // Validation function - returns true if form is valid
  validate: {
    type: Function,
    default: () => true,
  },
  // Initial form data
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const isSubmitting = ref(false);
const formData = ref({ ...props.initialData });
const windowId = inject('windowId', null);

// Resolve component - if string, load dynamically; if object, use directly
const contentComponent = computed(() => {
  if (typeof props.component === 'string') {
    // Try to load from applications folder first (supports subdirectories)
    return defineAsyncComponent({
      loader: () => import(`@/applications/${props.component}.vue`).catch(() => {
        // If not found in applications, try components
        return import(`@/components/${props.component}.vue`).catch(() => {
          // If still not found, try as a direct path
          return import(`@/${props.component}.vue`);
        });
      }),
      errorComponent: Fragment,
      loadingComponent: Fragment,
    });
  }
  return props.component;
});

// Merge componentProps with formData and expose state/handlers
const contentProps = computed(() => ({
  ...props.componentProps,
  ...formData.value,
  isSubmitting: isSubmitting.value,
  isValid: isValid.value,
  onSubmit: handleSubmit,
}));

const isValid = computed(() => {
  return props.validate(formData.value);
});

function handleUpdate(value) {
  formData.value = { ...formData.value, ...value };
}

async function handleSubmit() {
  if (!isValid.value || isSubmitting.value || !props.onSubmit) return;

  isSubmitting.value = true;
  try {
    const result = await props.onSubmit(formData.value);
    return result;
  } catch (error) {
    console.error('Submit error:', error);
    throw error;
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  if (windowId) {
    windowStore.closeWindow(windowId);
  }
}

</script>
