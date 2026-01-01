import { ref } from 'vue'

/**
 * Composable for common CRUD operations
 * @param {Object} apiService - The API service object with CRUD methods
 * @param {Object} options - Configuration options
 */
export function useCrud(apiService, options = {}) {
  const {
    loadMethod = 'get',
    createMethod = 'create',
    updateMethod = 'update',
    deleteMethod = 'delete',
    itemName = 'item',
    loadParams = null
  } = options

  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const showCreateForm = ref(false)
  const editingItem = ref(null)

  const loadItems = async () => {
    loading.value = true
    error.value = null
    try {
      const method = apiService[loadMethod]
      if (!method) {
        throw new Error(`Method ${loadMethod} not found on API service`)
      }
      
      const response = loadParams 
        ? await method(...loadParams)
        : await method()
      
      if (response.status === 200) {
        items.value = Array.isArray(response.data) ? response.data : [response.data]
      } else {
        error.value = response.message || `Failed to load ${itemName}s`
      }
    } catch (err) {
      error.value = err.message || `Error loading ${itemName}s`
    } finally {
      loading.value = false
    }
  }

  const handleCreate = async (newItem) => {
    loading.value = true
    error.value = null
    try {
      const method = apiService[createMethod]
      if (!method) {
        throw new Error(`Method ${createMethod} not found on API service`)
      }
      
      const response = await method(newItem)
      if (response.status === 201 || response.status === 200) {
        await loadItems()
        cancelCreate()
        alert(`${itemName} created successfully!`)
        return true
      } else {
        error.value = response.message || `Failed to create ${itemName}`
        return false
      }
    } catch (err) {
      error.value = err.message || `Error creating ${itemName}`
      return false
    } finally {
      loading.value = false
    }
  }

  const startEdit = (item) => {
    editingItem.value = { ...item }
    showCreateForm.value = false
  }

  const handleUpdate = async (updatedItem) => {
    if (!editingItem.value?._id) return false
    
    loading.value = true
    error.value = null
    try {
      const method = apiService[updateMethod]
      if (!method) {
        throw new Error(`Method ${updateMethod} not found on API service`)
      }
      
      const itemToUpdate = updatedItem || editingItem.value
      const response = await method(editingItem.value._id, itemToUpdate)
      if (response.status === 200) {
        await loadItems()
        cancelEdit()
        alert(`${itemName} updated successfully!`)
        return true
      } else {
        error.value = response.message || `Failed to update ${itemName}`
        return false
      }
    } catch (err) {
      error.value = err.message || `Error updating ${itemName}`
      return false
    } finally {
      loading.value = false
    }
  }

  const cancelEdit = () => {
    editingItem.value = null
  }

  const toggleDeactivated = async (item) => {
    if (!item._id) return
    
    const action = item.deactivated ? 'activate' : 'deactivate'
    const itemTitle = item.name || item.title || item.id || itemName
    if (!confirm(`Are you sure you want to ${action} "${itemTitle}"?`)) {
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const method = apiService[updateMethod]
      if (!method) {
        throw new Error(`Method ${updateMethod} not found on API service`)
      }
      
      const response = await method(item._id, {
        ...item,
        deactivated: !item.deactivated,
      })
      if (response.status === 200) {
        await loadItems()
        alert(`${itemName} ${action}d successfully!`)
      } else {
        error.value = response.message || `Failed to ${action} ${itemName}`
      }
    } catch (err) {
      error.value = err.message || `Error ${action}ing ${itemName}`
    } finally {
      loading.value = false
    }
  }

  const handleDelete = async (item) => {
    if (!item._id) return
    
    const itemTitle = item.name || item.title || item.id || itemName
    if (!confirm(`Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`)) {
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const method = apiService[deleteMethod]
      if (!method) {
        throw new Error(`Method ${deleteMethod} not found on API service`)
      }
      
      const response = await method(item._id)
      if (response.status === 200) {
        await loadItems()
        alert(`${itemName} deleted successfully!`)
      } else {
        error.value = response.message || `Failed to delete ${itemName}`
      }
    } catch (err) {
      error.value = err.message || `Error deleting ${itemName}`
    } finally {
      loading.value = false
    }
  }

  const cancelCreate = () => {
    showCreateForm.value = false
  }

  return {
    items,
    loading,
    error,
    showCreateForm,
    editingItem,
    loadItems,
    handleCreate,
    startEdit,
    handleUpdate,
    cancelEdit,
    toggleDeactivated,
    handleDelete,
    cancelCreate
  }
}

