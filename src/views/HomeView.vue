<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
    <!-- Hero Header -->
    <header class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div class="px-6 py-12 max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              🏠
            </div>
            <div>
              <h1 class="text-2xl font-bold">Colivon</h1>
              <p class="text-white/80 text-sm">Your smart household app</p>
            </div>
          </div>
          <router-link
            to="/households"
            class="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </router-link>
        </div>

        <div v-if="householdStore.currentHousehold" class="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
          <div class="flex items-center space-x-3">
            <div class="text-3xl">🏡</div>
            <div class="flex-1">
              <p class="text-white/70 text-xs font-medium">Current Household</p>
              <h2 class="text-lg font-bold">{{ householdStore.currentHousehold.name }}</h2>
            </div>
            <router-link
              to="/households"
              class="text-xs font-semibold px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
            >
              Switch
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 py-6 max-w-2xl mx-auto">
      <!-- No Household Warning -->
      <div v-if="!householdStore.currentHousehold" class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl mb-6">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-lg font-bold mb-2">No Household Selected</h3>
        <p class="text-white/90 text-sm mb-4">
          You need to create or join a household to start using Colivon features.
        </p>
        <router-link
          to="/households"
          class="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-white text-orange-600 rounded-full hover:shadow-lg transition-all"
        >
          Go to Households →
        </router-link>
      </div>

      <!-- Welcome Message -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'there' }}! 👋
        </h2>
        <p class="text-gray-600">
          Manage your household with smart features designed for modern living.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="space-y-4">
        <!-- Shopping Lists - Active -->
        <router-link
          to="/shopping-lists"
          class="block group"
        >
          <div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-indigo-200 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  🛒
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  ACTIVE
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Shopping Lists
              </h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                Create and share shopping lists with your household. Set recurring items and never forget the essentials.
              </p>
              <div class="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                Open Lists
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Chore Roulette - Coming Soon -->
        <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 overflow-hidden relative opacity-70">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full -mr-16 -mt-16"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg opacity-50">
                🎲
              </div>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                SOON
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Chore Roulette
            </h3>
            <p class="text-gray-600 text-sm mb-3 leading-relaxed">
              AI-powered task rotation with gamification. Fair distribution of household chores with learning preferences.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">🤖 AI Learning</span>
              <span class="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-lg">🏆 Gamification</span>
            </div>
          </div>
        </div>

        <!-- Silent Hours - Coming Soon -->
        <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 overflow-hidden relative opacity-70">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg opacity-50">
                🤫
              </div>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                SOON
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Silent Hours
            </h3>
            <p class="text-gray-600 text-sm mb-3 leading-relaxed">
              Automatic quiet time reminders with decibel measurement. Keep the peace during agreed silent hours.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg">📊 Decibel Meter</span>
              <span class="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">⏰ Auto Reminders</span>
            </div>
          </div>
        </div>

        <!-- Fair Split - Coming Soon -->
        <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 overflow-hidden relative opacity-70">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full -mr-16 -mt-16"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg opacity-50">
                💰
              </div>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                SOON
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Fair Split
            </h3>
            <p class="text-gray-600 text-sm mb-3 leading-relaxed">
              Photo receipt scanning for auto-split with dietary preferences. Fair expense sharing made simple.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">📸 Receipt Scan</span>
              <span class="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-lg">🍽️ Diet Aware</span>
            </div>
          </div>
        </div>

        <!-- Passive Aggressive Mode - Coming Soon -->
        <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 overflow-hidden relative opacity-70">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-full -mr-16 -mt-16"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg opacity-50">
                💬
              </div>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                SOON
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Passive Aggressive Mode
            </h3>
            <p class="text-gray-600 text-sm mb-3 leading-relaxed">
              Anonymous complaints with diplomatic AI rephrasing. Address issues without confrontation.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg">🎭 Anonymous</span>
              <span class="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-lg">🤖 AI Rephraser</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white shadow-xl">
        <div class="flex items-start space-x-4">
          <div class="text-3xl">✨</div>
          <div>
            <h3 class="font-bold mb-1">More Features Coming Soon</h3>
            <p class="text-white/90 text-sm leading-relaxed">
              We're constantly working on new features to make household management easier and more fun. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div class="flex justify-around items-center h-16 max-w-2xl mx-auto">
        <router-link
          to="/"
          class="flex flex-col items-center justify-center flex-1 h-full text-indigo-600 transition-colors"
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
          class="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-indigo-600 transition-colors"
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
  </div>
</template>

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
