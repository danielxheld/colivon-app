<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-green-50/30 pb-20">
    <!-- Hero Header -->
    <PageHeader
      title="Colivon"
      subtitle="Your smart household app"
      icon="🏠"
      gradient="blue"
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

      <template #content>
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
      </template>
    </PageHeader>

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
        <!-- Shopping Lists -->
        <router-link
          to="/shopping-lists"
          class="block group"
        >
          <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-emerald-200 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  🛒
                </div>
                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  ACTIVE
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Shopping Lists
              </h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                Create and share shopping lists with your household. Set recurring items and never forget the essentials.
              </p>
              <div class="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                Open Lists
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Chores & Tasks -->
        <router-link
          to="/chores"
          class="block group"
        >
          <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-teal-200 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-green-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  ✅
                </div>
                <span class="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                  ACTIVE
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                Chores & Tasks
              </h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                Gamified chore management with XP, levels, and leaderboards. Make housework fun with achievements and streaks!
              </p>
              <div class="flex items-center text-teal-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                View Tasks
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Household Management -->
        <router-link
          to="/households"
          class="block group"
        >
          <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-green-200 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  👥
                </div>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Household Management
              </h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                Create households, invite members, and manage your shared living spaces together.
              </p>
              <div class="flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                Manage Household
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Quick Stats -->
      <div v-if="householdStore.currentHousehold" class="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-emerald-50 rounded-2xl p-4">
            <div class="text-2xl mb-2">👥</div>
            <p class="text-2xl font-bold text-emerald-700">{{ householdStore.currentHousehold.members?.length || 0 }}</p>
            <p class="text-xs text-gray-600 mt-1">Members</p>
          </div>
          <div class="bg-teal-50 rounded-2xl p-4">
            <div class="text-2xl mb-2">🏡</div>
            <p class="text-lg font-bold text-teal-700">{{ householdStore.currentHousehold.name }}</p>
            <p class="text-xs text-gray-600 mt-1">Household</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHouseholdStore } from '@/stores/household'
import PageHeader from '@/components/layout/PageHeader.vue'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'

const authStore = useAuthStore()
const householdStore = useHouseholdStore()

onMounted(async () => {
  if (!householdStore.currentHousehold) {
    await householdStore.fetchHouseholds()
  }
})
</script>
