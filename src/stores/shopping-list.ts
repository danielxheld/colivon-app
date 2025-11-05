import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { ShoppingList, ShoppingListItem, RecurrenceInterval } from '@/types/shopping-list'

export const useShoppingListStore = defineStore('shoppingList', () => {
  const lists = ref<ShoppingList[]>([])
  const currentList = ref<ShoppingList | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLists(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/shopping-lists', {
        params: { household_id: householdId },
      })
      lists.value = response.data.shopping_lists
      return response.data.shopping_lists
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch shopping lists'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createList(householdId: number, name: string, isPublic: boolean = true) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/shopping-lists', {
        household_id: householdId,
        name,
        is_public: isPublic,
      })

      lists.value.unshift(response.data.shopping_list)
      currentList.value = response.data.shopping_list

      return response.data.shopping_list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create shopping list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateList(listId: number, name: string, isPublic: boolean) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/shopping-lists/${listId}`, {
        name,
        is_public: isPublic,
      })

      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = response.data.shopping_list
      }

      if (currentList.value?.id === listId) {
        currentList.value = response.data.shopping_list
      }

      return response.data.shopping_list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update shopping list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteList(listId: number) {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/shopping-lists/${listId}`)

      lists.value = lists.value.filter((l) => l.id !== listId)

      if (currentList.value?.id === listId) {
        currentList.value = lists.value.length > 0 ? lists.value[0] : null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete shopping list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addItem(
    listId: number,
    name: string,
    quantity?: string,
    unit?: string,
    isRecurring: boolean = false,
    recurrenceInterval?: RecurrenceInterval
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/shopping-lists/${listId}/items`, {
        name,
        quantity,
        unit,
        is_recurring: isRecurring,
        recurrence_interval: recurrenceInterval,
      })

      // Update local list
      const list = lists.value.find((l) => l.id === listId)
      if (list && list.items) {
        list.items.unshift(response.data.item)
      }

      if (currentList.value?.id === listId && currentList.value.items) {
        currentList.value.items.unshift(response.data.item)
      }

      return response.data.item
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add item'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateItem(
    itemId: number,
    name: string,
    quantity?: string,
    unit?: string,
    isRecurring?: boolean,
    recurrenceInterval?: RecurrenceInterval
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/shopping-list-items/${itemId}`, {
        name,
        quantity,
        unit,
        is_recurring: isRecurring,
        recurrence_interval: recurrenceInterval,
      })

      // Update local lists
      lists.value.forEach((list) => {
        if (list.items) {
          const index = list.items.findIndex((i) => i.id === itemId)
          if (index !== -1) {
            list.items[index] = response.data.item
          }
        }
      })

      if (currentList.value?.items) {
        const index = currentList.value.items.findIndex((i) => i.id === itemId)
        if (index !== -1) {
          currentList.value.items[index] = response.data.item
        }
      }

      return response.data.item
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update item'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleItemComplete(itemId: number, listId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/shopping-list-items/${itemId}/toggle`)

      // Refresh the list to get updated items (including new recurring item if created)
      await refreshList(listId)

      return response.data.item
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle item'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(itemId: number) {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/shopping-list-items/${itemId}`)

      // Update local lists
      lists.value.forEach((list) => {
        if (list.items) {
          list.items = list.items.filter((i) => i.id !== itemId)
        }
      })

      if (currentList.value?.items) {
        currentList.value.items = currentList.value.items.filter((i) => i.id !== itemId)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete item'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshList(listId: number) {
    try {
      const response = await api.get(`/shopping-lists/${listId}`)

      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = response.data.shopping_list
      }

      if (currentList.value?.id === listId) {
        currentList.value = response.data.shopping_list
      }

      return response.data.shopping_list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to refresh list'
      throw err
    }
  }

  function setCurrentList(list: ShoppingList) {
    currentList.value = list
  }

  return {
    lists,
    currentList,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    toggleItemComplete,
    deleteItem,
    refreshList,
    setCurrentList,
  }
})
