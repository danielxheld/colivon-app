<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHouseholdStore } from '@/stores/household'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()
const router = useRouter()

onMounted(async () => {
  await householdStore.fetchHouseholds()
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-indigo-600">Colivon</h1>
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
        <div v-if="!householdStore.currentHousehold" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-2">No Household Selected</h3>
          <p class="text-yellow-700 mb-4">
            You need to create or join a household to start using Colivon features.
          </p>
          <router-link
            to="/households"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
          >
            Go to Households
          </router-link>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Colivon!
          </h2>
          <p v-if="householdStore.currentHousehold" class="text-gray-600 mb-6">
            Managing household: <span class="font-semibold">{{ householdStore.currentHousehold.name }}</span>
          </p>
          <p class="text-gray-600 mb-6">
            Your household management app is ready. Available features:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
              to="/shopping-lists"
              class="border-2 border-indigo-200 bg-indigo-50 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
            >
              <h3 class="text-lg font-semibold text-indigo-900 mb-2">🛒 Shopping Lists</h3>
              <p class="text-indigo-700 text-sm mb-2">
                Create and share shopping lists with your household
              </p>
              <span class="text-xs font-medium text-indigo-600">Available now →</span>
            </router-link>

            <div class="border border-gray-200 rounded-lg p-4 opacity-60">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Chore Roulette</h3>
              <p class="text-gray-600 text-sm">
                Tasks automatically rotated with AI learning and gamification
              </p>
              <span class="text-xs font-medium text-gray-500">Coming soon</span>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 opacity-60">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Silent Hours</h3>
              <p class="text-gray-600 text-sm">
                Automatic quiet time reminders with decibel measurement
              </p>
              <span class="text-xs font-medium text-gray-500">Coming soon</span>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 opacity-60">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Fair Split</h3>
              <p class="text-gray-600 text-sm">
                Photo receipt for auto-split with dietary preferences
              </p>
              <span class="text-xs font-medium text-gray-500">Coming soon</span>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 opacity-60">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Passive Aggressive Mode</h3>
              <p class="text-gray-600 text-sm">
                Anonymous complaints with diplomatic AI rephrasing
              </p>
              <span class="text-xs font-medium text-gray-500">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
