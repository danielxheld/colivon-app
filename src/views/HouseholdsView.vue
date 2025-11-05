<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200/50 shadow-sm">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="text-2xl">🏠</div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Households
              </h1>
              <p class="text-xs text-gray-500">Manage your communities</p>
            </div>
          </router-link>
          <div class="flex items-center space-x-2">
            <button
              @click="showJoinModal = true"
              class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Join Household"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 py-6 max-w-2xl mx-auto">
      <!-- Loading State -->
      <div v-if="householdStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading households...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="householdStore.households.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">🏡</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Households Yet</h3>
        <p class="text-gray-500 text-sm mb-6 text-center px-4">Create a new household or join an existing one with an invite code.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="showCreateModal = true"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            + Create Household
          </button>
          <button
            @click="showJoinModal = true"
            class="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Join with Code
          </button>
        </div>
      </div>

      <!-- Households Grid -->
      <div v-else class="space-y-4">
        <!-- Current Household -->
        <div
          v-for="household in householdStore.households"
          :key="household.id"
          class="bg-white rounded-3xl shadow-lg overflow-hidden border transition-all cursor-pointer group"
          :class="householdStore.currentHousehold?.id === household.id ? 'border-2 border-indigo-500' : 'border border-gray-100 hover:border-indigo-300 hover:shadow-xl'"
          @click="selectHousehold(household)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="text-xl font-bold text-gray-900">{{ household.name }}</h3>
                  <span
                    v-if="householdStore.currentHousehold?.id === household.id"
                    class="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full"
                  >
                    ACTIVE
                  </span>
                </div>
                <p v-if="household.description" class="text-gray-600 text-sm mb-3">
                  {{ household.description }}
                </p>
              </div>
              <div class="text-4xl ml-4">🏡</div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span class="font-medium">{{ household.members?.length || 0 }} members</span>
                </div>
              </div>
              <div
                class="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform"
              >
                {{ householdStore.currentHousehold?.id === household.id ? 'Current' : 'Select' }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- Invite Code -->
            <div class="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-2xl p-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Invite Code</p>
                  <p class="text-sm font-mono font-bold text-gray-900">{{ household.invite_code }}</p>
                </div>
                <button
                  @click.stop="copyInviteCode(household.invite_code)"
                  class="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                  title="Copy code"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button
      v-if="!householdStore.loading"
      @click="showCreateModal = true"
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
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1 font-medium">Home</span>
        </router-link>

        <router-link
          to="/shopping-lists"
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs mt-1 font-medium">Lists</span>
        </router-link>

        <router-link
          to="/households"
          class="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 transition-colors"
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

    <!-- Create Household Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showCreateModal = false"></div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="showCreateModal" class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div class="text-center mb-6">
                <div class="text-4xl mb-3">🏡</div>
                <h3 class="text-2xl font-bold text-gray-900">Create Household</h3>
              </div>

              <form @submit.prevent="handleCreateHousehold">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Household Name</label>
                    <input
                      id="name"
                      v-model="createForm.name"
                      type="text"
                      required
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      placeholder="e.g., My Awesome WG"
                    >
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
                    <textarea
                      id="description"
                      v-model="createForm.description"
                      rows="3"
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                      placeholder="Tell us about your household"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-8 flex space-x-3">
                  <button
                    type="submit"
                    :disabled="householdStore.loading"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    @click="showCreateModal = false"
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

    <!-- Join Household Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showJoinModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="showJoinModal = false"></div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="showJoinModal" class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div class="text-center mb-6">
                <div class="text-4xl mb-3">🎫</div>
                <h3 class="text-2xl font-bold text-gray-900">Join Household</h3>
                <p class="text-sm text-gray-500 mt-2">Enter the invite code to join an existing household</p>
              </div>

              <form @submit.prevent="handleJoinHousehold">
                <div class="space-y-4">
                  <div>
                    <label for="invite_code" class="block text-sm font-semibold text-gray-700 mb-2">Invite Code</label>
                    <input
                      id="invite_code"
                      v-model="joinForm.inviteCode"
                      type="text"
                      required
                      class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-mono text-lg tracking-wider uppercase text-center"
                      placeholder="XXXXXXXX"
                      maxlength="8"
                    >
                  </div>
                </div>

                <div v-if="householdStore.error" class="mt-4 rounded-2xl bg-red-50 border-2 border-red-200 p-4">
                  <p class="text-sm text-red-800 font-medium">{{ householdStore.error }}</p>
                </div>

                <div class="mt-8 flex space-x-3">
                  <button
                    type="submit"
                    :disabled="householdStore.loading"
                    class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    @click="showJoinModal = false"
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

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showCopiedToast"
        class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50"
      >
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-medium">Copied to clipboard!</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHouseholdStore } from '@/stores/household'
import type { Household } from '@/types/household'

const router = useRouter()
const authStore = useAuthStore()
const householdStore = useHouseholdStore()

const showCreateModal = ref(false)
const showJoinModal = ref(false)
const showCopiedToast = ref(false)

const createForm = ref({
  name: '',
  description: '',
})

const joinForm = ref({
  inviteCode: '',
})

onMounted(async () => {
  await householdStore.fetchHouseholds()
})

async function handleCreateHousehold() {
  try {
    await householdStore.createHousehold(createForm.value.name, createForm.value.description)
    showCreateModal.value = false
    createForm.value = { name: '', description: '' }
    router.push('/')
  } catch (error) {
    console.error('Failed to create household:', error)
  }
}

async function handleJoinHousehold() {
  try {
    await householdStore.joinHousehold(joinForm.value.inviteCode.toUpperCase())
    showJoinModal.value = false
    joinForm.value = { inviteCode: '' }
    router.push('/')
  } catch (error) {
    console.error('Failed to join household:', error)
  }
}

function selectHousehold(household: Household) {
  householdStore.setCurrentHousehold(household)
  router.push('/')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

async function copyInviteCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    showCopiedToast.value = true
    setTimeout(() => {
      showCopiedToast.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>
