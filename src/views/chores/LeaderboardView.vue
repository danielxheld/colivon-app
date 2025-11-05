<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-20">
    <!-- Hero Header -->
    <header class="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white">
      <div class="px-6 py-12 max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <button
              @click="router.back()"
              class="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              🏆
            </div>
            <div>
              <h1 class="text-2xl font-bold">Leaderboard</h1>
              <p class="text-white/80 text-sm">Rangliste & Rankings</p>
            </div>
          </div>
        </div>

        <!-- Tab Selector -->
        <div class="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <button
            @click="currentTab = 'monthly'"
            class="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            :class="
              currentTab === 'monthly'
                ? 'bg-white text-orange-600'
                : 'text-white/80 hover:text-white'
            "
          >
            📅 Diesen Monat
          </button>
          <button
            @click="currentTab = 'alltime'"
            class="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            :class="
              currentTab === 'alltime'
                ? 'bg-white text-orange-600'
                : 'text-white/80 hover:text-white'
            "
          >
            ⏳ All-Time
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="px-4 py-8 max-w-2xl mx-auto text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Lade Rangliste...</p>
    </div>

    <!-- Main Content -->
    <main v-else class="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <!-- My Rank Card -->
      <div
        v-if="myRank"
        class="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white shadow-xl"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-white/80 text-sm font-medium mb-1">Dein Rang</p>
            <h2 class="text-4xl font-bold mb-2">#{{ myRank.rank }}</h2>
            <p class="text-white/90 text-sm">von {{ myRank.total_members }} Mitgliedern</p>
          </div>
          <div class="text-right">
            <p class="text-white/80 text-xs font-medium mb-1">{{ myRank.stats.title }}</p>
            <p class="text-2xl font-bold">Level {{ myRank.stats.level }}</p>
            <p class="text-white/90 text-sm mt-1">
              {{ currentTab === 'monthly' ? myRank.stats.current_month_xp : myRank.stats.total_xp }} XP
            </p>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <section class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <h2 class="text-xl font-bold">
            {{ currentTab === 'monthly' ? 'Monats-Rangliste' : 'All-Time Rangliste' }}
          </h2>
          <p class="text-white/80 text-sm">
            {{ leaderboard.length }} Mitglieder
          </p>
        </div>

        <div v-if="leaderboard.length === 0" class="p-8 text-center">
          <div class="text-4xl mb-3">📊</div>
          <p class="text-gray-500">Noch keine Daten vorhanden</p>
          <p class="text-gray-400 text-sm mt-1">Erledige Aufgaben um Punkte zu sammeln!</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="(stat, index) in leaderboard"
            :key="stat.id"
            class="p-5 hover:bg-gray-50 transition-colors"
            :class="{
              'bg-yellow-50': index === 0,
              'bg-gray-50/50': index === 1 || index === 2,
              'bg-indigo-50': stat.user_id === authStore.user?.id
            }"
          >
            <div class="flex items-center gap-4">
              <!-- Rank Badge -->
              <div class="flex-shrink-0">
                <div
                  v-if="index < 3"
                  class="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
                  :class="{
                    'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white': index === 0,
                    'bg-gradient-to-br from-gray-300 to-gray-500 text-white': index === 1,
                    'bg-gradient-to-br from-orange-400 to-orange-600 text-white': index === 2,
                  }"
                >
                  {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 truncate">
                    {{ stat.user?.name || 'Unknown' }}
                  </h3>
                  <span
                    v-if="stat.user_id === authStore.user?.id"
                    class="px-2 py-0.5 bg-indigo-500 text-white text-xs font-bold rounded-full"
                  >
                    DU
                  </span>
                </div>
                <p class="text-sm text-gray-600">
                  {{ stat.title }} • Level {{ stat.level }}
                </p>
                <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{{ stat.total_chores_completed }} Aufgaben</span>
                  <span v-if="stat.current_streak > 0">{{ stat.current_streak }} 🔥</span>
                </div>
              </div>

              <!-- XP Display -->
              <div class="text-right flex-shrink-0">
                <p class="text-2xl font-bold text-gray-900">
                  {{ currentTab === 'monthly' ? stat.current_month_xp : stat.total_xp }}
                </p>
                <p class="text-xs text-gray-500">XP</p>
              </div>
            </div>

            <!-- Progress Bar for Top 3 -->
            <div v-if="index < 3 && leaderboard.length > 1" class="mt-4">
              <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full transition-all duration-300"
                  :class="{
                    'bg-gradient-to-r from-yellow-400 to-yellow-600': index === 0,
                    'bg-gradient-to-r from-gray-400 to-gray-600': index === 1,
                    'bg-gradient-to-r from-orange-400 to-orange-600': index === 2,
                  }"
                  :style="{
                    width: ((currentTab === 'monthly' ? stat.current_month_xp : stat.total_xp) / (currentTab === 'monthly' ? leaderboard[0].current_month_xp : leaderboard[0].total_xp)) * 100 + '%'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Fun Facts -->
      <div v-if="leaderboard.length > 0" class="grid grid-cols-2 gap-3">
        <div class="bg-white rounded-2xl p-4 shadow-lg text-center">
          <div class="text-3xl mb-2">🔥</div>
          <p class="text-2xl font-bold text-gray-900">
            {{ Math.max(...leaderboard.map(s => s.longest_streak)) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">Längster Streak</p>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-lg text-center">
          <div class="text-3xl mb-2">✅</div>
          <p class="text-2xl font-bold text-gray-900">
            {{ leaderboard.reduce((sum, s) => sum + s.total_chores_completed, 0) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">Gesamt Aufgaben</p>
        </div>
      </div>

      <!-- My Awards -->
      <section v-if="myAwards.length > 0" class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <h2 class="text-xl font-bold">Meine Awards</h2>
          <p class="text-white/80 text-sm">{{ myAwards.length }} freigeschaltet</p>
        </div>
        <div class="grid grid-cols-3 gap-3 p-6">
          <div
            v-for="award in myAwards"
            :key="award.id"
            class="flex flex-col items-center p-3 rounded-2xl"
            :class="{
              'bg-yellow-50 border-2 border-yellow-400': award.award.rarity === 'legendary',
              'bg-purple-50 border-2 border-purple-400': award.award.rarity === 'epic',
              'bg-blue-50 border-2 border-blue-400': award.award.rarity === 'rare',
              'bg-gray-50 border-2 border-gray-300': award.award.rarity === 'common',
            }"
          >
            <div class="text-4xl mb-2">{{ award.award.icon }}</div>
            <p class="text-xs font-bold text-center text-gray-900">{{ award.award.name }}</p>
          </div>
        </div>
      </section>
    </main>

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
          to="/chores"
          class="flex flex-col items-center justify-center flex-1 h-full text-blue-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs mt-1 font-medium">Tasks</span>
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
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChoreStore } from '@/stores/chore'
import { useHouseholdStore } from '@/stores/household'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const choreStore = useChoreStore()
const householdStore = useHouseholdStore()
const authStore = useAuthStore()
const router = useRouter()

const { monthlyLeaderboard, loading } = storeToRefs(choreStore)
const { currentHousehold } = storeToRefs(householdStore)

const currentTab = ref<'monthly' | 'alltime'>('monthly')
const allTimeLeaderboard = ref<any[]>([])
const myRank = ref<any>(null)
const myAwards = ref<any[]>([])

const leaderboard = computed(() => {
  return currentTab.value === 'monthly' ? monthlyLeaderboard.value : allTimeLeaderboard.value
})

onMounted(async () => {
  if (!currentHousehold.value) {
    await householdStore.fetchHouseholds()
  }

  if (currentHousehold.value) {
    await loadLeaderboards()
  }
})

watch(currentTab, async () => {
  if (currentHousehold.value) {
    await loadMyRank()
  }
})

async function loadLeaderboards() {
  if (!currentHousehold.value) return

  try {
    await Promise.all([
      choreStore.fetchMonthlyLeaderboard(currentHousehold.value.id),
      fetchAllTimeLeaderboard(),
      loadMyAwards(),
    ])

    await loadMyRank()
  } catch (err) {
    console.error('Failed to load leaderboards:', err)
  }
}

async function loadMyAwards() {
  if (!currentHousehold.value) return

  try {
    const response = await api.get('/awards/my', {
      params: { household_id: currentHousehold.value.id },
    })
    myAwards.value = response.data.data
  } catch (err) {
    console.error('Failed to load awards:', err)
  }
}

async function fetchAllTimeLeaderboard() {
  if (!currentHousehold.value) return

  try {
    const response = await api.get('/gamification/leaderboard/all-time', {
      params: { household_id: currentHousehold.value.id },
    })
    allTimeLeaderboard.value = response.data.data
  } catch (err) {
    console.error('Failed to load all-time leaderboard:', err)
  }
}

async function loadMyRank() {
  if (!currentHousehold.value) return

  try {
    const rankData = await choreStore.fetchMyStats(currentHousehold.value.id)
    myRank.value = rankData
  } catch (err) {
    console.error('Failed to load my rank:', err)
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
