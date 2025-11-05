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

      <!-- Templates -->
      <div v-if="householdStore.currentHousehold && templates.length > 0" class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-gray-700 flex items-center">
            <span class="mr-2">📋</span> List Templates
          </h3>
          <button
            @click="handleReactivateRecurring"
            class="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-all"
          >
            🔄 Reactivate Recurring
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="template in templates"
            :key="template.id"
            @click="openCreateFromTemplateModal(template)"
            class="p-4 bg-white border-2 border-blue-200 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-bold text-gray-900">{{ template.template_name || template.name }}</span>
              <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                {{ template.items?.length || 0 }} items
              </span>
            </div>
            <p v-if="template.store" class="text-xs text-gray-500">🏪 {{ template.store }}</p>
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
          v-for="list in shoppingListStore.lists.filter(l => !l.is_template)"
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

            <!-- Shopping Mode Actions & Status -->
            <div class="mt-3 flex items-center justify-between gap-3">
              <div v-if="list.currently_shopping_by_id" class="flex-1">
                <div class="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-white/30 rounded-full text-white text-xs font-medium">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  <span>🛒 {{ list.currently_shopping_by?.name || 'Someone' }} is shopping</span>
                  <span v-if="list.shopping_started_at" class="text-white/60">
                    • {{ getShoppingDuration(list.shopping_started_at) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- Expense Button -->
                <button
                  v-if="getCompletedItems(list).length > 0"
                  @click="showExpenseModal(list)"
                  class="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-xs font-medium transition-all"
                >
                  💶 Expenses
                </button>

                <!-- Shopping Mode Toggle -->
                <button
                  v-if="!list.currently_shopping_by_id"
                  @click="startShoppingMode(list.id)"
                  class="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-xs font-medium transition-all"
                >
                  🛒 Start Shopping
                </button>
                <button
                  v-else-if="list.currently_shopping_by_id === authStore.user?.id"
                  @click="stopShoppingMode(list.id)"
                  class="px-3 py-1.5 bg-red-500/30 hover:bg-red-500/50 rounded-full text-white text-xs font-medium transition-all"
                >
                  ✓ Done Shopping
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

          <!-- Active Items (Grouped by Category) -->
          <div class="divide-y divide-gray-100">
            <template v-for="category in getActiveGroupedItems(list)" :key="category.name">
              <div v-if="category.items.length > 0" class="px-6 py-3 bg-gray-50/50">
                <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {{ category.name }}
                </h4>
              </div>
              <div
                v-for="item in category.items"
                :key="item.id"
                class="px-6 py-4 hover:bg-gray-50 transition-all"
                :class="{ 'bg-blue-50/30': item.claimed_by_id === authStore.user?.id }"
              >
                <div class="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    :checked="item.is_completed"
                    @change="toggleItem(item.id, list.id)"
                    class="h-6 w-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-lg cursor-pointer mt-0.5 flex-shrink-0"
                  >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 flex-wrap mb-1">
                      <span class="text-sm font-medium text-gray-900">
                        {{ item.name }}
                      </span>

                      <!-- Badges -->
                      <span v-if="!item.shared_cost" class="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full font-medium">
                        👤 Personal
                      </span>
                      <span v-if="item.is_recurring" class="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-medium">
                        🔄 {{ item.recurrence_interval }}
                      </span>
                      <span v-if="item.price" class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-bold">
                        ~{{ item.price }}€
                      </span>
                      <span v-if="item.claimed_by" class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        🙋 {{ item.claimed_by.name }}
                      </span>
                    </div>

                    <div class="mt-1 space-y-1">
                      <p v-if="item.quantity" class="text-xs text-gray-500">
                        📦 {{ item.quantity }}{{ item.unit ? ' ' + item.unit : '' }}
                      </p>
                      <p v-if="item.note" class="text-xs text-gray-600 italic">
                        💬 {{ item.note }}
                      </p>
                      <p v-if="item.notes_for_shopper" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        🛒 For shopper: {{ item.notes_for_shopper }}
                      </p>
                    </div>

                    <!-- Claim Actions -->
                    <div v-if="list.currently_shopping_by_id" class="mt-2 flex items-center gap-2">
                      <button
                        v-if="!item.claimed_by_id"
                        @click="claimItemAction(item.id)"
                        class="text-xs px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full font-medium transition-all"
                      >
                        🙋 I'll buy this
                      </button>
                      <button
                        v-else-if="item.claimed_by_id === authStore.user?.id"
                        @click="unclaimItemAction(item.id)"
                        class="text-xs px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full font-medium transition-all"
                      >
                        ✖ Unclaim
                      </button>
                      <button
                        v-if="item.claimed_by_id === authStore.user?.id && list.currently_shopping_by_id === authStore.user?.id"
                        @click="openMarkBoughtModal(item)"
                        class="text-xs px-3 py-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-full font-medium transition-all"
                      >
                        ✓ Mark Bought
                      </button>
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

            <p v-if="getActiveItems(list).length === 0 && getCompletedItems(list).length === 0" class="px-6 py-8 text-center text-sm text-gray-400">
              No items yet. Add your first item above!
            </p>
          </div>

          <!-- Completed Items Section -->
          <div v-if="getCompletedItems(list).length > 0" class="border-t-4 border-gray-100">
            <div class="px-6 py-3 bg-gray-50/80">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed ({{ getCompletedItems(list).length }})
                </span>
                <span v-if="getTotalActualSpent(list) > 0" class="text-gray-600 font-bold">
                  Total: {{ getTotalActualSpent(list).toFixed(2) }}€
                </span>
              </h4>
            </div>
            <div class="divide-y divide-gray-50">
              <div
                v-for="item in getCompletedItems(list)"
                :key="item.id"
                class="px-6 py-3 bg-gray-50/30 hover:bg-gray-50 transition-all opacity-60"
              >
                <div class="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    :checked="item.is_completed"
                    @change="toggleItem(item.id, list.id)"
                    class="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer mt-0.5 flex-shrink-0"
                  >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 flex-wrap mb-1">
                      <span class="text-sm font-medium line-through text-gray-400">
                        {{ item.name }}
                      </span>
                      <span v-if="item.actual_price" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                        {{ item.actual_price }}€
                      </span>
                      <span v-if="item.bought_by" class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        💳 {{ item.bought_by.name }}
                      </span>
                      <span v-if="!item.shared_cost" class="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full font-medium">
                        👤 Personal
                      </span>
                      <span v-if="item.is_recurring && item.next_recurrence_date" class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                        📅 Returns {{ formatDate(item.next_recurrence_date) }}
                      </span>
                    </div>
                    <p v-if="item.quantity" class="text-xs text-gray-400">
                      {{ item.quantity }}{{ item.unit ? ' ' + item.unit : '' }}
                    </p>
                  </div>
                  <button
                    @click="deleteItem(item.id)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
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

    <!-- Mark as Bought Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showMarkBoughtModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeMarkBoughtModal"></div>

          <div class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div class="text-center mb-6">
              <div class="text-4xl mb-3">💳</div>
              <h3 class="text-2xl font-bold text-gray-900">Mark as Bought</h3>
              <p class="text-sm text-gray-600 mt-2">{{ markBoughtItem?.name }}</p>
            </div>

            <form @submit.prevent="handleMarkBought()">
              <div class="space-y-4">
                <div>
                  <label for="actual_price" class="block text-sm font-semibold text-gray-700 mb-2">
                    Actual Price (€)
                  </label>
                  <input
                    id="actual_price"
                    v-model.number="markBoughtForm.actual_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter actual price..."
                    class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  >
                  <p v-if="markBoughtItem?.price" class="text-xs text-gray-500 mt-1">
                    Estimated: {{ markBoughtItem.price }}€
                  </p>
                </div>

                <div class="flex space-x-3 pt-4">
                  <button
                    type="button"
                    @click="closeMarkBoughtModal"
                    class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:shadow-lg transition-all active:scale-95"
                  >
                    ✓ Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Expense Breakdown Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showExpensesModal && currentExpenses" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeExpensesModal"></div>

          <div class="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="text-center mb-6">
              <div class="text-4xl mb-3">💶</div>
              <h3 class="text-2xl font-bold text-gray-900">Expense Breakdown</h3>
            </div>

            <!-- Total Summary -->
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white mb-6">
              <div class="text-center">
                <p class="text-white/80 text-sm mb-1">Total Spent</p>
                <p class="text-4xl font-bold">{{ currentExpenses.total_spent.toFixed(2) }}€</p>
                <p class="text-white/60 text-xs mt-2">{{ currentExpenses.total_items }} items</p>
              </div>
            </div>

            <!-- Shared vs Personal -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 rounded-2xl p-4">
                <p class="text-xs text-blue-600 font-semibold mb-1">👥 Shared Costs</p>
                <p class="text-2xl font-bold text-blue-700">{{ currentExpenses.shared_cost_total.toFixed(2) }}€</p>
              </div>
              <div class="bg-purple-50 rounded-2xl p-4">
                <p class="text-xs text-purple-600 font-semibold mb-1">👤 Personal Costs</p>
                <p class="text-2xl font-bold text-purple-700">{{ currentExpenses.personal_cost_total.toFixed(2) }}€</p>
              </div>
            </div>

            <!-- By Person -->
            <div class="mb-6">
              <h4 class="text-sm font-bold text-gray-700 mb-3">By Person</h4>
              <div class="space-y-3">
                <div
                  v-for="person in currentExpenses.by_person"
                  :key="person.user.id"
                  class="bg-gray-50 rounded-2xl p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-gray-900">{{ person.user.name }}</span>
                    <span class="text-lg font-bold text-emerald-600">{{ person.total_spent.toFixed(2) }}€</span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>👥 Shared: {{ person.shared_items_total.toFixed(2) }}€</span>
                    <span>👤 Personal: {{ person.personal_items_total.toFixed(2) }}€</span>
                    <span>📦 {{ person.items_count }} items</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Split Calculation -->
            <div class="border-t-2 border-gray-100 pt-6">
              <h4 class="text-sm font-bold text-gray-700 mb-3">Fair Split Calculation</h4>
              <div class="space-y-3">
                <div
                  v-for="split in currentExpenses.split_calculation"
                  :key="split.user.id"
                  class="flex items-center justify-between p-4 rounded-2xl"
                  :class="split.balance < 0 ? 'bg-green-50' : split.balance > 0 ? 'bg-red-50' : 'bg-gray-50'"
                >
                  <div>
                    <p class="font-semibold text-gray-900">{{ split.user.name }}</p>
                    <p class="text-xs text-gray-600">Paid: {{ split.paid.toFixed(2) }}€ • Should pay: {{ split.should_pay.toFixed(2) }}€</p>
                  </div>
                  <div class="text-right">
                    <p
                      class="text-lg font-bold"
                      :class="split.balance < 0 ? 'text-green-600' : split.balance > 0 ? 'text-red-600' : 'text-gray-600'"
                    >
                      {{ split.balance < 0 ? '+' : split.balance > 0 ? '-' : '' }}{{ Math.abs(split.balance).toFixed(2) }}€
                    </p>
                    <p class="text-xs" :class="split.balance < 0 ? 'text-green-600' : split.balance > 0 ? 'text-red-600' : 'text-gray-600'">
                      {{ split.balance < 0 ? 'Gets back' : split.balance > 0 ? 'Owes' : 'Even' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="closeExpensesModal"
              class="w-full mt-6 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

                  <div class="border-t-2 border-gray-100 pt-4">
                    <div class="flex items-center p-4 bg-blue-50 rounded-2xl mb-3">
                      <input
                        id="is_template"
                        v-model="listForm.is_template"
                        type="checkbox"
                        class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label for="is_template" class="ml-3 text-sm font-medium text-gray-900">
                        📋 Save as Template (reuse this list later)
                      </label>
                    </div>

                    <div v-if="listForm.is_template">
                      <label for="template_name" class="block text-sm font-semibold text-gray-700 mb-2">Template Name</label>
                      <input
                        id="template_name"
                        v-model="listForm.template_name"
                        type="text"
                        required
                        class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="e.g., Weekly Groceries, Party Shopping"
                      >
                    </div>
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

                  <div>
                    <label for="notes_for_shopper" class="block text-sm font-semibold text-gray-700 mb-2">🛒 Notes for Shopper</label>
                    <textarea
                      id="notes_for_shopper"
                      v-model="itemForm.notes_for_shopper"
                      rows="2"
                      class="block w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="e.g., Get the organic one, check expiration date"
                    ></textarea>
                  </div>

                  <div class="flex items-center p-4 bg-purple-50 rounded-2xl">
                    <input
                      id="shared_cost"
                      v-model="itemForm.shared_cost"
                      type="checkbox"
                      class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    >
                    <label for="shared_cost" class="ml-3 text-sm font-medium text-gray-900">
                      👥 Shared Cost (split between household members)
                    </label>
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

    <!-- Create from Template Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showCreateFromTemplateModal && selectedTemplate" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeCreateFromTemplateModal"></div>

          <div class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div class="text-center mb-6">
              <div class="text-4xl mb-3">📋</div>
              <h3 class="text-2xl font-bold text-gray-900">Create from Template</h3>
              <p class="text-sm text-gray-600 mt-2">{{ selectedTemplate.template_name || selectedTemplate.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ selectedTemplate.items?.length || 0 }} items will be copied</p>
            </div>

            <form @submit.prevent="handleCreateFromTemplate()">
              <div class="space-y-4">
                <div>
                  <label for="template_list_name" class="block text-sm font-semibold text-gray-700 mb-2">New List Name</label>
                  <input
                    id="template_list_name"
                    v-model="templateListName"
                    type="text"
                    required
                    class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="e.g., Weekly Groceries - Jan 15"
                  >
                </div>

                <div class="flex space-x-3 pt-4">
                  <button
                    type="button"
                    @click="closeCreateFromTemplateModal"
                    class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="shoppingListStore.loading"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    Create List
                  </button>
                </div>
              </div>
            </form>
          </div>
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
  is_template: false,
  template_name: '',
})

// Templates
const templates = ref<ShoppingList[]>([])
const showCreateFromTemplateModal = ref(false)
const selectedTemplate = ref<ShoppingList | null>(null)
const templateListName = ref('')

const newItems = ref<Record<number, string>>({})

const showEditItemModal = ref(false)
const editingItem = ref<ShoppingListItem | null>(null)

const itemForm = reactive({
  name: '',
  quantity: '',
  unit: '',
  category: '',
  note: '',
  notes_for_shopper: '',
  price: null as number | null,
  is_recurring: false,
  recurrence_interval: 'weekly' as RecurrenceInterval,
  shared_cost: true,
})

// WG Shopping Mode State
const showMarkBoughtModal = ref(false)
const showExpensesModal = ref(false)
const markBoughtItem = ref<ShoppingListItem | null>(null)
const markBoughtForm = reactive({
  actual_price: null as number | null,
})
const currentExpenses = ref<any>(null)

onMounted(async () => {
  if (householdStore.currentHousehold) {
    await shoppingListStore.fetchLists(householdStore.currentHousehold.id)
    await shoppingListStore.fetchFavorites(householdStore.currentHousehold.id)
    templates.value = await shoppingListStore.fetchTemplates(householdStore.currentHousehold.id)
  }
})

async function handleCreateList() {
  if (!householdStore.currentHousehold) return

  try {
    const list = await shoppingListStore.createList(
      householdStore.currentHousehold.id,
      listForm.name,
      listForm.is_public
    )

    // Update to template if needed
    if (listForm.is_template && listForm.template_name) {
      await shoppingListStore.updateList(list.id, {
        is_template: true,
        template_name: listForm.template_name,
      })
      // Refresh templates list
      templates.value = await shoppingListStore.fetchTemplates(householdStore.currentHousehold.id)
    }

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
  listForm.is_template = list.is_template
  listForm.template_name = list.template_name || ''
  showEditListModal.value = true
}

async function handleEditList() {
  if (!editingList.value || !householdStore.currentHousehold) return

  try {
    await shoppingListStore.updateList(editingList.value.id, {
      name: listForm.name,
      is_public: listForm.is_public,
      store: listForm.store || undefined,
      is_template: listForm.is_template,
      template_name: listForm.is_template ? listForm.template_name : undefined,
    })

    // Refresh templates list if template status changed
    if (listForm.is_template || editingList.value.is_template) {
      templates.value = await shoppingListStore.fetchTemplates(householdStore.currentHousehold.id)
    }

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
  listForm.is_template = false
  listForm.template_name = ''
}

// Template functions
function openCreateFromTemplateModal(template: ShoppingList) {
  selectedTemplate.value = template
  templateListName.value = `${template.template_name || template.name} - ${new Date().toLocaleDateString()}`
  showCreateFromTemplateModal.value = true
}

async function handleCreateFromTemplate() {
  if (!selectedTemplate.value || !householdStore.currentHousehold) return

  try {
    await shoppingListStore.createFromTemplate(selectedTemplate.value.id, templateListName.value)
    closeCreateFromTemplateModal()
  } catch (error) {
    console.error('Failed to create list from template:', error)
  }
}

function closeCreateFromTemplateModal() {
  showCreateFromTemplateModal.value = false
  selectedTemplate.value = null
  templateListName.value = ''
}

async function handleReactivateRecurring() {
  if (!householdStore.currentHousehold) return

  try {
    const count = await shoppingListStore.reactivateRecurringItems()
    if (count > 0) {
      await shoppingListStore.fetchLists(householdStore.currentHousehold.id)
      alert(`${count} recurring item(s) were reactivated!`)
    } else {
      alert('No recurring items to reactivate.')
    }
  } catch (error) {
    console.error('Failed to reactivate recurring items:', error)
  }
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
  itemForm.notes_for_shopper = item.notes_for_shopper || ''
  itemForm.price = item.price || null
  itemForm.is_recurring = item.is_recurring
  itemForm.recurrence_interval = item.recurrence_interval || 'weekly'
  itemForm.shared_cost = item.shared_cost
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
      notes_for_shopper: itemForm.notes_for_shopper || undefined,
      price: itemForm.price || undefined,
      is_recurring: itemForm.is_recurring,
      recurrence_interval: itemForm.is_recurring ? itemForm.recurrence_interval : undefined,
      shared_cost: itemForm.shared_cost,
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
  itemForm.notes_for_shopper = ''
  itemForm.price = null
  itemForm.is_recurring = false
  itemForm.recurrence_interval = 'weekly'
  itemForm.shared_cost = true
}

function getActiveItems(list: ShoppingList): ShoppingListItem[] {
  if (!list.items) return []
  return list.items.filter(item => !item.is_completed)
}

function getCompletedItems(list: ShoppingList): ShoppingListItem[] {
  if (!list.items) return []
  return list.items.filter(item => item.is_completed)
}

function getActiveGroupedItems(list: ShoppingList) {
  const activeItems = getActiveItems(list)
  const grouped: { [key: string]: ShoppingListItem[] } = {}

  activeItems.forEach(item => {
    const category = item.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })

  return Object.entries(grouped).map(([name, items]) => ({
    name,
    items: items
  })).sort((a, b) => a.name === 'Other' ? 1 : b.name === 'Other' ? -1 : a.name.localeCompare(b.name))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Reset time for comparison
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) {
    return 'today'
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'tomorrow'
  } else if (date < today) {
    return 'overdue'
  } else {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }
}

function getListTotal(list: ShoppingList): number {
  if (!list.items) return 0
  return list.items
    .filter(item => !item.is_completed && item.price)
    .reduce((sum, item) => sum + (item.price || 0), 0)
}

// WG Shopping Mode Functions
async function startShoppingMode(listId: number) {
  try {
    await shoppingListStore.startShopping(listId)
  } catch (error) {
    console.error('Failed to start shopping mode:', error)
  }
}

async function stopShoppingMode(listId: number) {
  try {
    await shoppingListStore.stopShopping(listId)
  } catch (error) {
    console.error('Failed to stop shopping mode:', error)
  }
}

async function claimItemAction(itemId: number) {
  try {
    await shoppingListStore.claimItem(itemId)
  } catch (error) {
    console.error('Failed to claim item:', error)
  }
}

async function unclaimItemAction(itemId: number) {
  try {
    await shoppingListStore.unclaimItem(itemId)
  } catch (error) {
    console.error('Failed to unclaim item:', error)
  }
}

function openMarkBoughtModal(item: ShoppingListItem) {
  markBoughtItem.value = item
  markBoughtForm.actual_price = item.price || null
  showMarkBoughtModal.value = true
}

function closeMarkBoughtModal() {
  showMarkBoughtModal.value = false
  markBoughtItem.value = null
  markBoughtForm.actual_price = null
}

async function handleMarkBought() {
  if (!markBoughtItem.value) return

  try {
    await shoppingListStore.markAsBought(
      markBoughtItem.value.id,
      markBoughtForm.actual_price || undefined
    )
    closeMarkBoughtModal()
  } catch (error) {
    console.error('Failed to mark item as bought:', error)
  }
}

async function showExpenseModal(list: ShoppingList) {
  try {
    const expenses = await shoppingListStore.getExpenses(list.id)
    currentExpenses.value = expenses
    showExpensesModal.value = true
  } catch (error) {
    console.error('Failed to load expenses:', error)
  }
}

function closeExpensesModal() {
  showExpensesModal.value = false
  currentExpenses.value = null
}

function getShoppingDuration(startTime: string): string {
  const start = new Date(startTime)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) {
    return `${diffMins}m`
  } else {
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }
}

function getTotalActualSpent(list: ShoppingList): number {
  if (!list.items) return 0
  return list.items
    .filter(item => item.is_completed && item.actual_price)
    .reduce((sum, item) => sum + (item.actual_price || 0), 0)
}
</script>
