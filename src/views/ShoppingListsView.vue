<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-indigo-600">Colivon</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/households"
              class="text-sm text-gray-600 hover:text-gray-900"
            >
              {{ householdStore.currentHousehold?.name || 'Select Household' }}
            </router-link>
            <span class="text-gray-400">|</span>
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div v-if="!householdStore.currentHousehold" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-2">No Household Selected</h3>
          <p class="text-yellow-700 mb-4">Please select a household to manage shopping lists.</p>
          <router-link
            to="/households"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
          >
            Go to Households
          </router-link>
        </div>

        <div v-else>
          <div class="mb-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Shopping Lists</h2>
            <button
              @click="showCreateListModal = true"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create List
            </button>
          </div>

          <div v-if="shoppingListStore.loading" class="text-center py-12">
            <p class="text-gray-600">Loading...</p>
          </div>

          <div v-else-if="shoppingListStore.lists.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-600 mb-4">No shopping lists yet.</p>
            <p class="text-gray-500 text-sm">Create your first shopping list!</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="list in shoppingListStore.lists"
              :key="list.id"
              class="bg-white rounded-lg shadow p-6"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ list.name }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ list.is_public ? 'Public' : 'Private' }} • {{ list.items?.filter(i => !i.is_completed).length || 0 }} items
                  </p>
                </div>
                <div class="flex space-x-2">
                  <button
                    v-if="list.user_id === authStore.user?.id"
                    @click="openEditListModal(list)"
                    class="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    v-if="list.user_id === authStore.user?.id"
                    @click="confirmDeleteList(list)"
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <form @submit.prevent="addItemToList(list.id)" class="flex space-x-2">
                  <input
                    v-model="newItems[list.id]"
                    type="text"
                    placeholder="Add item..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="item in list.items"
                  :key="item.id"
                  class="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  :class="{ 'opacity-50': item.is_completed }"
                >
                  <div class="flex items-center flex-1">
                    <input
                      type="checkbox"
                      :checked="item.is_completed"
                      @change="toggleItem(item.id, list.id)"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    >
                    <span
                      class="ml-3 text-sm"
                      :class="{ 'line-through text-gray-500': item.is_completed }"
                    >
                      {{ item.name }}
                      <span v-if="item.quantity" class="text-gray-500">
                        ({{ item.quantity }}{{ item.unit ? ' ' + item.unit : '' }})
                      </span>
                      <span v-if="item.is_recurring" class="ml-2 text-xs text-indigo-600">
                        🔄 {{ item.recurrence_interval }}
                      </span>
                    </span>
                  </div>
                  <button
                    @click="deleteItem(item.id)"
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>

                <p v-if="!list.items || list.items.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No items yet. Add your first item above!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit List Modal -->
    <div v-if="showCreateListModal || showEditListModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModals"></div>

        <div class="relative bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditListModal ? 'Edit' : 'Create' }} Shopping List
          </h3>

          <form @submit.prevent="showEditListModal ? handleEditList() : handleCreateList()">
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  v-model="listForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Weekly Groceries"
                >
              </div>
              <div class="flex items-center">
                <input
                  id="is_public"
                  v-model="listForm.is_public"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label for="is_public" class="ml-2 block text-sm text-gray-700">
                  Public (visible to all household members)
                </label>
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <button
                type="submit"
                :disabled="shoppingListStore.loading"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ showEditListModal ? 'Update' : 'Create' }}
              </button>
              <button
                type="button"
                @click="closeModals"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHouseholdStore } from '@/stores/household'
import { useShoppingListStore } from '@/stores/shopping-list'
import type { ShoppingList } from '@/types/shopping-list'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()
const shoppingListStore = useShoppingListStore()

const showCreateListModal = ref(false)
const showEditListModal = ref(false)
const editingList = ref<ShoppingList | null>(null)

const listForm = reactive({
  name: '',
  is_public: true,
})

const newItems = ref<Record<number, string>>({})

onMounted(async () => {
  if (householdStore.currentHousehold) {
    await shoppingListStore.fetchLists(householdStore.currentHousehold.id)
  }
})

async function handleCreateList() {
  if (!householdStore.currentHousehold) return

  try {
    await shoppingListStore.createList(
      householdStore.currentHousehold.id,
      listForm.name,
      listForm.is_public
    )
    closeModals()
  } catch (error) {
    console.error('Failed to create list:', error)
  }
}

function openEditListModal(list: ShoppingList) {
  editingList.value = list
  listForm.name = list.name
  listForm.is_public = list.is_public
  showEditListModal.value = true
}

async function handleEditList() {
  if (!editingList.value) return

  try {
    await shoppingListStore.updateList(
      editingList.value.id,
      listForm.name,
      listForm.is_public
    )
    closeModals()
  } catch (error) {
    console.error('Failed to update list:', error)
  }
}

function confirmDeleteList(list: ShoppingList) {
  if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
    shoppingListStore.deleteList(list.id)
  }
}

function closeModals() {
  showCreateListModal.value = false
  showEditListModal.value = false
  editingList.value = null
  listForm.name = ''
  listForm.is_public = true
}

async function addItemToList(listId: number) {
  const itemName = newItems.value[listId]?.trim()
  if (!itemName) return

  try {
    await shoppingListStore.addItem(listId, itemName)
    newItems.value[listId] = ''
  } catch (error) {
    console.error('Failed to add item:', error)
  }
}

async function toggleItem(itemId: number, listId: number) {
  try {
    await shoppingListStore.toggleItemComplete(itemId, listId)
  } catch (error) {
    console.error('Failed to toggle item:', error)
  }
}

async function deleteItem(itemId: number) {
  if (confirm('Delete this item?')) {
    try {
      await shoppingListStore.deleteItem(itemId)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }
}
</script>
