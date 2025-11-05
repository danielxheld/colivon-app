<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-green-50/30 pb-20">
    <!-- Hero Header -->
    <PageHeader
      title="Shopping Lists"
      :subtitle="householdStore.currentHousehold?.name || 'No household'"
      icon="🛒"
      gradient="green"
    >
      <template #actions>
        <router-link
          to="/households"
          class="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </router-link>
      </template>
    </PageHeader>

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

      <!-- Favorites Quick-Add -->
      <div v-if="householdStore.currentHousehold && shoppingListStore.favorites.length > 0" class="mb-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center">
          <span class="mr-2">⭐</span> Quick Add Favorites
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="fav in shoppingListStore.favorites.slice(0, 10)"
            :key="fav.id"
            @click="addFavoriteToList(fav)"
            class="px-4 py-2 bg-white border-2 border-emerald-200 rounded-full text-sm font-medium text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
          >
            {{ fav.category ? fav.category.split(' ')[0] : '📦' }} {{ fav.name }}
            <span v-if="fav.usage_count > 1" class="ml-1 text-xs text-gray-400">({{ fav.usage_count }})</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="shoppingListStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading lists...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="shoppingListStore.lists.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">🛒</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Lists Yet</h3>
        <p class="text-gray-500 text-sm mb-6">Create your first shopping list!</p>
        <button
          @click="showCreateListModal = true"
          class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
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
          <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-1">{{ list.name }}</h3>
                <div class="flex flex-wrap items-center gap-2 text-white/80 text-xs">
                  <span class="px-2 py-0.5 bg-white/20 rounded-full">
                    {{ list.is_public ? '👥 Public' : '🔒 Private' }}
                  </span>
                  <span class="px-2 py-0.5 bg-white/20 rounded-full">
                    {{ list.items?.filter(i => !i.is_completed).length || 0 }} items
                  </span>
                  <span v-if="list.store" class="px-2 py-0.5 bg-white/20 rounded-full">
                    🏪 {{ list.store }}
                  </span>
                  <span v-if="getListTotal(list) > 0" class="px-2 py-0.5 bg-white/20 rounded-full font-bold">
                    💰 {{ getListTotal(list).toFixed(2) }}€
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

            <!-- Shopping Mode Badge -->
            <div v-if="list.currently_shopping_by_id" class="mt-2">
              <div class="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-white/30 rounded-full text-white text-xs font-medium">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span>{{ list.currently_shopping_by?.name || 'Someone' }} is shopping now</span>
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
                class="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              >
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                +
              </button>
            </form>
          </div>

          <!-- Items List (Grouped by Category) -->
          <div class="divide-y divide-gray-100">
            <template v-for="category in getGroupedItems(list)" :key="category.name">
              <div v-if="category.items.length > 0" class="px-6 py-3 bg-gray-50/50">
                <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {{ category.name }}
                </h4>
              </div>
              <div
                v-for="item in category.items"
                :key="item.id"
                class="px-6 py-4 hover:bg-gray-50 transition-all"
                :class="{ 'opacity-60': item.is_completed }"
              >
                <div class="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    :checked="item.is_completed"
                    @change="toggleItem(item.id, list.id)"
                    class="h-6 w-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-lg cursor-pointer mt-0.5 flex-shrink-0"
                  >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 flex-wrap">
                      <span
                        class="text-sm font-medium"
                        :class="{ 'line-through text-gray-400': item.is_completed, 'text-gray-900': !item.is_completed }"
                      >
                        {{ item.name }}
                      </span>
                      <span v-if="item.is_recurring" class="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-medium">
                        🔄 {{ item.recurrence_interval }}
                      </span>
                      <span v-if="item.price" class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold">
                        {{ item.price }}€
                      </span>
                    </div>
                    <div class="mt-1 space-y-0.5">
                      <p v-if="item.quantity" class="text-xs text-gray-500">
                        📦 {{ item.quantity }}{{ item.unit ? ' ' + item.unit : '' }}
                      </p>
                      <p v-if="item.note" class="text-xs text-gray-600 italic">
                        💬 {{ item.note }}
                      </p>
                    </div>
                  </div>
                  <div class="flex space-x-1 flex-shrink-0">
                    <button
                      @click="openEditItemModal(item)"
                      class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
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
            </template>

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
      class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all active:scale-95 flex items-center justify-center z-30"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Bottom Navigation -->
    <BottomNavigation />

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
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="e.g., Weekly Groceries"
                    >
                  </div>

                  <div>
                    <label for="store" class="block text-sm font-semibold text-gray-700 mb-2">Store (optional)</label>
                    <select
                      id="store"
                      v-model="listForm.store"
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                      <option value="">Select store...</option>
                      <option v-for="store in stores" :key="store" :value="store">{{ store }}</option>
                    </select>
                  </div>

                  <div class="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <input
                      id="is_public"
                      v-model="listForm.is_public"
                      type="checkbox"
                      class="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
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
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
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
            <div v-if="showEditItemModal" class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
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
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="e.g., Milk"
                    >
                  </div>

                  <div>
                    <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      id="category"
                      v-model="itemForm.category"
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                      <option value="">No category</option>
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label for="quantity" class="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                      <input
                        id="quantity"
                        v-model="itemForm.quantity"
                        type="text"
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                        placeholder="e.g., 2"
                      >
                    </div>
                    <div>
                      <label for="unit" class="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                      <input
                        id="unit"
                        v-model="itemForm.unit"
                        type="text"
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                        placeholder="e.g., L"
                      >
                    </div>
                  </div>

                  <div>
                    <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">Price (€)</label>
                    <input
                      id="price"
                      v-model.number="itemForm.price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                      placeholder="e.g., 2.99"
                    >
                  </div>

                  <div>
                    <label for="note" class="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                    <textarea
                      id="note"
                      v-model="itemForm.note"
                      rows="2"
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                      placeholder="e.g., Bio, nur wenn im Angebot"
                    ></textarea>
                  </div>

                  <div class="border-t-2 border-gray-100 pt-4">
                    <div class="flex items-center p-4 bg-emerald-50 rounded-2xl mb-3">
                      <input
                        id="is_recurring"
                        v-model="itemForm.is_recurring"
                        type="checkbox"
                        class="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
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
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
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
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
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
import type { ShoppingList, ShoppingListItem, RecurrenceInterval, FavoriteItem } from '@/types/shopping-list'
import { ITEM_CATEGORIES, STORES } from '@/types/shopping-list'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()
const shoppingListStore = useShoppingListStore()
const router = useRouter()

const categories = ITEM_CATEGORIES
const stores = STORES

const showCreateListModal = ref(false)
const showEditListModal = ref(false)
const editingList = ref<ShoppingList | null>(null)

const listForm = reactive({
  name: '',
  is_public: true,
  store: '',
})

const newItems = ref<Record<number, string>>({})

const showEditItemModal = ref(false)
const editingItem = ref<ShoppingListItem | null>(null)

const itemForm = reactive({
  name: '',
  quantity: '',
  unit: '',
  category: '',
  note: '',
  price: null as number | null,
  is_recurring: false,
  recurrence_interval: 'weekly' as RecurrenceInterval,
})

onMounted(async () => {
  if (householdStore.currentHousehold) {
    await shoppingListStore.fetchLists(householdStore.currentHousehold.id)
    await shoppingListStore.fetchFavorites(householdStore.currentHousehold.id)
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
  listForm.store = list.store || ''
  showEditListModal.value = true
}

async function handleEditList() {
  if (!editingList.value) return

  try {
    await shoppingListStore.updateList(editingList.value.id, {
      name: listForm.name,
      is_public: listForm.is_public,
      store: listForm.store || undefined,
    })
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
  listForm.store = ''
}

async function addItemToList(listId: number) {
  const itemName = newItems.value[listId]?.trim()
  if (!itemName) return

  try {
    await shoppingListStore.addItem(listId, { name: itemName })
    newItems.value[listId] = ''

    // Track as favorite if household exists
    if (householdStore.currentHousehold) {
      await shoppingListStore.addFavorite(householdStore.currentHousehold.id, itemName)
    }
  } catch (error) {
    console.error('Failed to add item:', error)
  }
}

async function addFavoriteToList(favorite: FavoriteItem) {
  // Find first list or prompt user
  const list = shoppingListStore.lists[0]
  if (!list) return

  try {
    await shoppingListStore.addItem(list.id, {
      name: favorite.name,
      category: favorite.category || undefined,
      quantity: favorite.quantity || undefined,
      unit: favorite.unit || undefined,
    })

    // Increment favorite usage
    if (householdStore.currentHousehold) {
      await shoppingListStore.addFavorite(
        householdStore.currentHousehold.id,
        favorite.name,
        favorite.category || undefined,
        favorite.quantity || undefined,
        favorite.unit || undefined
      )
    }
  } catch (error) {
    console.error('Failed to add favorite to list:', error)
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
  itemForm.category = item.category || ''
  itemForm.note = item.note || ''
  itemForm.price = item.price || null
  itemForm.is_recurring = item.is_recurring
  itemForm.recurrence_interval = item.recurrence_interval || 'weekly'
  showEditItemModal.value = true
}

async function handleEditItem() {
  if (!editingItem.value) return

  try {
    await shoppingListStore.updateItem(editingItem.value.id, {
      name: itemForm.name,
      quantity: itemForm.quantity || undefined,
      unit: itemForm.unit || undefined,
      category: itemForm.category || undefined,
      note: itemForm.note || undefined,
      price: itemForm.price || undefined,
      is_recurring: itemForm.is_recurring,
      recurrence_interval: itemForm.is_recurring ? itemForm.recurrence_interval : undefined,
    })
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
  itemForm.category = ''
  itemForm.note = ''
  itemForm.price = null
  itemForm.is_recurring = false
  itemForm.recurrence_interval = 'weekly'
}

function getGroupedItems(list: ShoppingList) {
  if (!list.items) return []

  const grouped: { [key: string]: ShoppingListItem[] } = {}

  list.items.forEach(item => {
    const category = item.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })

  return Object.entries(grouped).map(([name, items]) => ({
    name,
    items: items.sort((a, b) => (a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1))
  })).sort((a, b) => a.name === 'Other' ? 1 : b.name === 'Other' ? -1 : a.name.localeCompare(b.name))
}

function getListTotal(list: ShoppingList): number {
  if (!list.items) return 0
  return list.items
    .filter(item => !item.is_completed && item.price)
    .reduce((sum, item) => sum + (item.price || 0), 0)
}
</script>
