<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-indigo-600">Colivon</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Hello, {{ authStore.user?.name }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">My Households</h2>
          <div class="space-x-2">
            <button
              @click="showCreateModal = true"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create Household
            </button>
            <button
              @click="showJoinModal = true"
              class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Join Household
            </button>
          </div>
        </div>

        <div v-if="householdStore.loading" class="text-center py-12">
          <p class="text-gray-600">Loading...</p>
        </div>

        <div v-else-if="householdStore.households.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
          <p class="text-gray-600 mb-4">You're not part of any household yet.</p>
          <p class="text-gray-500 text-sm">Create a new household or join an existing one with an invite code.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="household in householdStore.households"
            :key="household.id"
            class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="selectHousehold(household)"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ household.name }}</h3>
            <p v-if="household.description" class="text-gray-600 text-sm mb-4">{{ household.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">{{ household.members?.length || 0}} members</span>
              <span class="text-indigo-600 font-medium">Open →</span>
            </div>
            <div class="mt-4 pt-4 border-t">
              <p class="text-xs text-gray-500">Invite Code: <span class="font-mono font-semibold text-gray-700">{{ household.invite_code }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Household Modal -->
    <div v-if="showCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateModal = false"></div>

        <div class="relative bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Household</h3>

          <form @submit.prevent="handleCreateHousehold">
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  v-model="createForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., My Awesome WG"
                >
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  id="description"
                  v-model="createForm.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about your household"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <button
                type="submit"
                :disabled="householdStore.loading"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Create
              </button>
              <button
                type="button"
                @click="showCreateModal = false"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Join Household Modal -->
    <div v-if="showJoinModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showJoinModal = false"></div>

        <div class="relative bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Join Household</h3>

          <form @submit.prevent="handleJoinHousehold">
            <div class="space-y-4">
              <div>
                <label for="invite_code" class="block text-sm font-medium text-gray-700">Invite Code</label>
                <input
                  id="invite_code"
                  v-model="joinForm.inviteCode"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  placeholder="Enter invite code"
                >
              </div>
            </div>

            <div v-if="householdStore.error" class="mt-4 rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ householdStore.error }}</p>
            </div>

            <div class="mt-6 flex space-x-3">
              <button
                type="submit"
                :disabled="householdStore.loading"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Join
              </button>
              <button
                type="button"
                @click="showJoinModal = false"
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
    await householdStore.joinHousehold(joinForm.value.inviteCode)
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
</script>
