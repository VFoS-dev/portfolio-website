<template>
  <div class="stack-input-container">
    <input
      ref="inputRef"
      v-model="searchQuery"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keydown="handleKeydown"
      type="text"
      class="stack-search-input"
      :placeholder="placeholder"
    />
    <div v-if="dropdownOpen && filteredOptions.length > 0" class="stack-dropdown">
      <div
        v-for="(option, index) in filteredOptions"
        :key="getOptionId(option)"
        @mousedown.prevent="selectOption(option)"
        :class="['stack-dropdown-item', { 'highlighted': index === highlightedIndex }]"
      >
        {{ getOptionLabel(option) }}
      </div>
    </div>
    <div v-if="dropdownOpen && filteredOptions.length === 0 && searchQuery" class="stack-dropdown">
      <div class="stack-dropdown-item no-results">No options found</div>
    </div>
    <div class="stack-chips-container" v-if="modelValue && modelValue.length > 0">
      <div
        v-for="(item, index) in modelValue"
        :key="`${getItemId(item)}-${index}`"
        :draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent="handleDragOver($event, index)"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
        class="stack-chip"
      >
        <slot name="chip" :item="item" :label="getItemLabelComputed(item)">
          <span>{{ getItemLabelComputed(item) }}</span>
        </slot>
        <button
          @click="removeItem(index)"
          type="button"
          class="chip-remove"
          @mousedown.prevent
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const inputRef = ref(null)

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Type to search...'
  },
  getOptionId: {
    type: Function,
    default: (option) => option._id || option.id || option
  },
  getOptionLabel: {
    type: Function,
    default: (option) => option.name || option.label || option
  },
  getItemId: {
    type: Function,
    default: (item) => item._id || item.id || item
  },
  getItemLabel: {
    type: Function,
    default: null // Will be computed if not provided
  }
})

const emit = defineEmits(['update:modelValue', 'enter'])

const searchQuery = ref('')
const dropdownOpen = ref(false)
const highlightedIndex = ref(-1)

// Drag and drop state
const draggedIndex = ref(null)

// Helper to get the actual option object from an ID
const getOptionById = (itemId) => {
  return props.options.find(opt => {
    const optId = props.getOptionId(opt)
    const idStr = typeof optId === 'object' ? optId.toString() : optId
    const itemIdStr = typeof itemId === 'object' ? itemId.toString() : itemId
    return idStr === itemIdStr
  })
}

// Computed function to get item label, with fallback logic
const getItemLabelComputed = (item) => {
  if (props.getItemLabel) {
    return props.getItemLabel(item)
  }
  
  // Try to find the option object if item is just an ID
  const option = getOptionById(item)
  if (option) {
    return props.getOptionLabel(option)
  }
  
  // Fallback to item itself or its properties
  return item?.name || item?.label || item
}

// Filter options based on search and exclude already selected items
const filteredOptions = computed(() => {
  const selectedIds = props.modelValue.map(item => {
    const id = props.getItemId(item)
    return typeof id === 'object' ? id.toString() : id
  })
  
  let filtered = props.options.filter(option => {
    const optionId = props.getOptionId(option)
    const idStr = typeof optionId === 'object' ? optionId.toString() : optionId
    return !selectedIds.includes(idStr)
  })
  
  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase()
    filtered = filtered.filter(option => {
      const label = props.getOptionLabel(option).toLowerCase()
      return label.includes(searchLower)
    })
  }
  
  return filtered
})

const handleFocus = () => {
  dropdownOpen.value = true
  highlightedIndex.value = -1
}

const handleBlur = () => {
  // Delay to allow click events to fire
  setTimeout(() => {
    dropdownOpen.value = false
    highlightedIndex.value = -1
  }, 200)
}

const handleInput = () => {
  dropdownOpen.value = true
  highlightedIndex.value = -1
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
      // Select highlighted option
      selectOption(filteredOptions.value[highlightedIndex.value])
    } else if (searchQuery.value.trim()) {
      // Emit enter event with search query
      emit('enter', searchQuery.value.trim())
      searchQuery.value = ''
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
      dropdownOpen.value = true
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      dropdownOpen.value = true
    }
  } else if (event.key === 'Escape') {
    dropdownOpen.value = false
    highlightedIndex.value = -1
  }
}

const selectOption = (option) => {
  const optionId = props.getOptionId(option)
  const currentValue = [...(props.modelValue || [])]
  
  // Check if already selected
  const selectedIds = currentValue.map(item => {
    const id = props.getItemId(item)
    return typeof id === 'object' ? id.toString() : id
  })
  const idStr = typeof optionId === 'object' ? optionId.toString() : optionId
  
  if (!selectedIds.includes(idStr)) {
    currentValue.push(optionId)
    emit('update:modelValue', currentValue)
  }
  
  searchQuery.value = ''
  dropdownOpen.value = true // Keep dropdown open for more selections
  highlightedIndex.value = -1
  
  // Refocus the input to allow continued typing
  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }, 10)
}

const removeItem = (index) => {
  const newValue = [...props.modelValue]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}

// Drag and drop handlers
const handleDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.target.style.opacity = '0.5'
}

const handleDragOver = (event, index) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  
  if (draggedIndex.value === null) return
  
  const newValue = [...props.modelValue]
  if (draggedIndex.value !== index) {
    const draggedItem = newValue[draggedIndex.value]
    newValue.splice(draggedIndex.value, 1)
    newValue.splice(index, 0, draggedItem)
    draggedIndex.value = index
    emit('update:modelValue', newValue)
  }
}

const handleDrop = (event, index) => {
  event.preventDefault()
  event.target.style.opacity = '1'
}

const handleDragEnd = (event) => {
  event.target.style.opacity = '1'
  draggedIndex.value = null
}
</script>

<style scoped>
.stack-input-container {
  position: relative;
  width: 100%;
}

.stack-search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.stack-search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.stack-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
}

.stack-dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--color-border);
}

.stack-dropdown-item:last-child {
  border-bottom: none;
}

.stack-dropdown-item:hover,
.stack-dropdown-item.highlighted {
  background-color: var(--color-background-soft);
}

.stack-dropdown-item.no-results {
  color: #6c757d;
  cursor: default;
}

.stack-dropdown-item.no-results:hover {
  background-color: transparent;
}

.stack-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  min-height: 40px;
  padding: 0.5rem;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background-soft);
}

.stack-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: move;
  user-select: none;
  transition: all 0.2s;
}

.stack-chip:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stack-chip[draggable="true"] {
  cursor: grab;
}

.stack-chip[draggable="true"]:active {
  cursor: grabbing;
}

.chip-remove {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.chip-remove:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chip-remove:active {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>

