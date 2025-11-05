<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
    <!-- Top Header -->
    <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200/50 shadow-sm">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <router-link to="/" class="text-2xl">🏠</router-link>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Shopping Lists
              </h1>
              <p class="text-xs text-gray-500">{{ householdStore.currentHousehold?.name || 'No household' }}</p>
            </div>
          </div>
          <router-link
            to="/households"
            class="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </router-link>
        </div>
      </div>
    </header>

    <main class="px-4 py-6 max-w-2xl mx-auto">
      <!-- No Household Warning -->
      <div v-if="!householdStore.currentHousehold" class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
        <div class="text-4xl mb-3">🏡</div>
        <h3 class="text-lg font-bold mb-2">No Household Selected</h3>
        <p class="text-white/90 text-sm mb-4">Please select a household to manage shopping lists.</p>
        <router-link
          to="/households"
          class="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-white text-orange-600 rounded-full hover:shadow-lg transition-all"
        >
          Go to Households →
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-else-if="shoppingListStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading lists...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="shoppingListStore.lists.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">🛒</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Lists Yet</h3>
        <p class="text-gray-500 text-sm mb-6">Create your first shopping list!</p>
        <button
          @click="showCreateListModal = true"
          class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          + Create List
        </button>
      </div>

      <!-- Shopping Lists -->
      <div v-else class="space-y-4">
        <div
          v-for="list in shoppingListStore.lists"
          :key="list.id"
          class="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
        >
          <!-- List Header -->
          <div class="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-1">{{ list.name }}</h3>
                <div class="flex items-center space-x-2 text-white/80 text-xs">
                  <span class="px-2 py-0.5 bg-white/20 rounded-full">
                    {{ list.is_public ? '👥 Public' : '🔒 Private' }}
                  </span>
                  <span class="px-2 py-0.5 bg-white/20 rounded-full">
                    {{ list.items?.filter(i => !i.is_completed).length || 0 }} items
                  </span>
                </div>
              </div>
              <div v-if="list.user_id === authStore.user?.id" class="flex space-x-2">
                <button
                  @click="openEditListModal(list)"
                  class="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDeleteList(list)"
                  class="p-2 bg-white/20 hover:bg-red-500 rounded-full transition-all"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Add Item Form -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <form @submit.prevent="addItemToList(list.id)" class="flex space-x-2">
              <input
                v-model="newItems[list.id]"
                type="text"
                placeholder="Add item..."
                class="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </form>
          </div>

          <!-- Items List -->
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in list.items"
              :key="item.id"
              class="px-6 py-4 hover:bg-gray-50 transition-all"
              :class="{ 'opacity-60': item.is_completed }"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :checked="item.is_completed"
                  @change="toggleItem(item.id, list.id)"
                  class="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg cursor-pointer"
                >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <span
                      class="text-sm font-medium"
                      :class="{ 'line-through text-gray-400': item.is_completed, 'text-gray-900': !item.is_completed }"
                    >
                      {{ item.name }}
                    </span>
                    <span v-if="item.is_recurring" class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                      🔄 {{ item.recurrence_interval }}
                    </span>
                  </div>
                  <p v-if="item.quantity" class="text-xs text-gray-500 mt-0.5">
                    {{ item.quantity }}{{ item.unit ? ' ' + item.unit : '' }}
                  </p>
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="openEditItemModal(item)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteItem(item.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <p v-if="!list.items || list.items.length === 0" class="px-6 py-8 text-center text-sm text-gray-400">
              No items yet. Add your first item above!
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button
      v-if="householdStore.currentHousehold && !shoppingListStore.loading"
      @click="showCreateListModal = true"
      class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all active:scale-95 flex items-center justify-center z-30"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div class="flex justify-around items-center h-16 max-w-2xl mx-auto">
        <router-link
          to="/"
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-indigo-600 transition-colors"
          :class="{ 'text-indigo-600': $route.path === '/' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1 font-medium">Home</span>
        </router-link>

        <router-link
          to="/shopping-lists"
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-indigo-600 transition-colors"
          :class="{ 'text-indigo-600': $route.path === '/shopping-lists' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs mt-1 font-medium">Lists</span>
        </router-link>

        <router-link
          to="/households"
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-indigo-600 transition-colors"
          :class="{ 'text-indigo-600': $route.path === '/households' }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text-xs mt-1 font-medium">Household</span>
        </router-link>

        <button
          @click="handleLogout"
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-xs mt-1 font-medium">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Create/Edit List Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showCreateListModal || showEditListModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeModals"></div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="showCreateListModal || showEditListModal" class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div class="text-center mb-6">
                <div class="text-4xl mb-3">{{ showEditListModal ? '✏️' : '✨' }}</div>
                <h3 class="text-2xl font-bold text-gray-900">
                  {{ showEditListModal ? 'Edit' : 'Create' }} List
                </h3>
              </div>

              <form @submit.prevent="showEditListModal ? handleEditList() : handleCreateList()">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">List Name</label>
                    <input
                      id="name"
                      v-model="listForm.name"
                      type="text"
                      required
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      placeholder="e.g., Weekly Groceries"
                    >
                  </div>
                  <div class="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <input
                      id="is_public"
                      v-model="listForm.is_public"
                      type="checkbox"
                      class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                    <label for="is_public" class="ml-3 text-sm font-medium text-gray-700">
                      👥 Public (visible to all household members)
                    </label>
                  </div>
                </div>

                <div class="mt-8 flex space-x-3">
                  <button
                    type="submit"
                    :disabled="shoppingListStore.loading"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    {{ showEditListModal ? 'Update' : 'Create' }}
                  </button>
                  <button
                    type="button"
                    @click="closeModals"
                    class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Edit Item Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showEditItemModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeItemModal"></div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="showEditItemModal" class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div class="text-center mb-6">
                <div class="text-4xl mb-3">🛒</div>
                <h3 class="text-2xl font-bold text-gray-900">Edit Item</h3>
              </div>

              <form @submit.prevent="handleEditItem">
                <div class="space-y-4">
                  <div>
                    <label for="item_name" class="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                    <input
                      id="item_name"
                      v-model="itemForm.name"
                      type="text"
                      required
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      placeholder="e.g., Milk"
                    >
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label for="quantity" class="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                      <input
                        id="quantity"
                        v-model="itemForm.quantity"
                        type="text"
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        placeholder="e.g., 2"
                      >
                    </div>
                    <div>
                      <label for="unit" class="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                      <input
                        id="unit"
                        v-model="itemForm.unit"
                        type="text"
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        placeholder="e.g., L"
                      >
                    </div>
                  </div>

                  <div class="border-t-2 border-gray-100 pt-4">
                    <div class="flex items-center p-4 bg-indigo-50 rounded-2xl mb-3">
                      <input
                        id="is_recurring"
                        v-model="itemForm.is_recurring"
                        type="checkbox"
                        class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      >
                      <label for="is_recurring" class="ml-3 text-sm font-medium text-gray-900">
                        🔄 Recurring item (auto-recreate when completed)
                      </label>
                    </div>

                    <div v-if="itemForm.is_recurring">
                      <label for="recurrence_interval" class="block text-sm font-semibold text-gray-700 mb-2">Recurrence</label>
                      <select
                        id="recurrence_interval"
                        v-model="itemForm.recurrence_interval"
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex space-x-3">
                  <button
                    type="submit"
                    :disabled="shoppingListStore.loading"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    Update Item
                  </button>
                  <button
                    type="button"
                    @click="closeItemModal"
                    class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHouseholdStore } from '@/stores/household'
import { useShoppingListStore } from '@/stores/shopping-list'
import { useRouter } from 'vue-router'
import type { ShoppingList, ShoppingListItem, RecurrenceInterval } from '@/types/shopping-list'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()
const shoppingListStore = useShoppingListStore()
const router = useRouter()

const showCreateListModal = ref(false)
const showEditListModal = ref(false)
const editingList = ref<ShoppingList | null>(null)

const listForm = reactive({
  name: '',
  is_public: true,
})

const newItems = ref<Record<number, string>>({})

const showEditItemModal = ref(false)
const editingItem = ref<ShoppingListItem | null>(null)

const itemForm = reactive({
  name: '',
  quantity: '',
  unit: '',
  is_recurring: false,
  recurrence_interval: 'weekly' as RecurrenceInterval,
})

onMounted(async () => {
  if (householdStore.currentHousehold) {
    await shoppingListStore.fetchLists(householdStore.currentHousehold.id)
  }
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

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

function openEditItemModal(item: ShoppingListItem) {
  editingItem.value = item
  itemForm.name = item.name
  itemForm.quantity = item.quantity || ''
  itemForm.unit = item.unit || ''
  itemForm.is_recurring = item.is_recurring
  itemForm.recurrence_interval = item.recurrence_interval || 'weekly'
  showEditItemModal.value = true
}

async function handleEditItem() {
  if (!editingItem.value) return

  try {
    await shoppingListStore.updateItem(
      editingItem.value.id,
      itemForm.name,
      itemForm.quantity || undefined,
      itemForm.unit || undefined,
      itemForm.is_recurring,
      itemForm.is_recurring ? itemForm.recurrence_interval : undefined
    )
    closeItemModal()
  } catch (error) {
    console.error('Failed to update item:', error)
  }
}

function closeItemModal() {
  showEditItemModal.value = false
  editingItem.value = null
  itemForm.name = ''
  itemForm.quantity = ''
  itemForm.unit = ''
  itemForm.is_recurring = false
  itemForm.recurrence_interval = 'weekly'
}
</script>
