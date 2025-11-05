import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { ShoppingList, ShoppingListItem, RecurrenceInterval, FavoriteItem } from '@/types/shopping-list'

export const useShoppingListStore = defineStore('shoppingList', () => {
  const lists = ref<ShoppingList[]>([])
  const currentList = ref<ShoppingList | null>(null)
  const favorites = ref<FavoriteItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLists(householdId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/shopping-lists', {
        params: { household_id: householdId },
      })
      lists.value = response.data.data // API Resources return data in 'data' key
      return response.data.data
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

  async function updateList(
    listId: number,
    data: {
      name?: string
      is_public?: boolean
      store?: string
      is_template?: boolean
      template_name?: string
      estimated_total?: number
      actual_total?: number
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/shopping-lists/${listId}`, data)

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
    data: {
      name: string
      quantity?: string
      unit?: string
      category?: string
      note?: string
      price?: number
      aisle_order?: number
      is_recurring?: boolean
      recurrence_interval?: RecurrenceInterval
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/shopping-lists/${listId}/items`, {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        category: data.category,
        note: data.note,
        price: data.price,
        aisle_order: data.aisle_order,
        is_recurring: data.is_recurring ?? false,
        recurrence_interval: data.recurrence_interval,
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
    data: {
      name?: string
      quantity?: string
      unit?: string
      category?: string
      note?: string
      price?: number
      aisle_order?: number
      is_recurring?: boolean
      recurrence_interval?: RecurrenceInterval
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/shopping-list-items/${itemId}`, data)

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

  // Favorites functions
  async function fetchFavorites(householdId: number) {
    try {
      const response = await api.get('/favorite-items', {
        params: { household_id: householdId },
      })
      favorites.value = response.data.data // API Resources return data in 'data' key
      return response.data.data
    } catch (err: any) {
      console.error('Failed to fetch favorites:', err)
      return []
    }
  }

  async function addFavorite(householdId: number, name: string, category?: string, quantity?: string, unit?: string) {
    try {
      const response = await api.post('/favorite-items', {
        household_id: householdId,
        name,
        category,
        quantity,
        unit,
      })

      // Update or add to local favorites
      const existingIndex = favorites.value.findIndex(f => f.name === name)
      if (existingIndex !== -1) {
        favorites.value[existingIndex] = response.data.favorite
      } else {
        favorites.value.push(response.data.favorite)
      }

      // Sort by usage count
      favorites.value.sort((a, b) => b.usage_count - a.usage_count)

      return response.data.favorite
    } catch (err: any) {
      console.error('Failed to add favorite:', err)
      throw err
    }
  }

  async function deleteFavorite(favoriteId: number) {
    try {
      await api.delete(`/favorite-items/${favoriteId}`)
      favorites.value = favorites.value.filter(f => f.id !== favoriteId)
    } catch (err: any) {
      console.error('Failed to delete favorite:', err)
      throw err
    }
  }

  // Shopping mode functions
  async function startShopping(listId: number) {
    try {
      const response = await api.post(`/shopping-lists/${listId}/start-shopping`)

      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = response.data.shopping_list
      }

      if (currentList.value?.id === listId) {
        currentList.value = response.data.shopping_list
      }

      return response.data.shopping_list
    } catch (err: any) {
      console.error('Failed to start shopping:', err)
      throw err
    }
  }

  async function stopShopping(listId: number) {
    try {
      const response = await api.post(`/shopping-lists/${listId}/stop-shopping`)

      const index = lists.value.findIndex((l) => l.id === listId)
      if (index !== -1) {
        lists.value[index] = response.data.shopping_list
      }

      if (currentList.value?.id === listId) {
        currentList.value = response.data.shopping_list
      }

      return response.data.shopping_list
    } catch (err: any) {
      console.error('Failed to stop shopping:', err)
      throw err
    }
  }

  return {
    lists,
    currentList,
    favorites,
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
    fetchFavorites,
    addFavorite,
    deleteFavorite,
    startShopping,
    stopShopping,
  }
})
