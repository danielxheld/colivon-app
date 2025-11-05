<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pb-20">
    <!-- Hero Header -->
    <header class="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
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
              ❤️
            </div>
            <div>
              <h1 class="text-2xl font-bold">Präferenzen</h1>
              <p class="text-white/80 text-sm">Aufgaben-Vorlieben</p>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
          <p class="text-white/90 text-sm leading-relaxed">
            Gib an, wie gerne du bestimmte Aufgaben erledigst. Das Roulette berücksichtigt deine Präferenzen
            bei der Zuweisung und sorgt trotzdem für Fairness.
          </p>
          <div class="grid grid-cols-5 gap-2 mt-4">
            <div class="text-center">
              <div class="text-2xl mb-1">😍</div>
              <p class="text-xs text-white/80">Liebe</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">😊</div>
              <p class="text-xs text-white/80">Mag ich</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">😐</div>
              <p class="text-xs text-white/80">Neutral</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">😕</div>
              <p class="text-xs text-white/80">Mag nicht</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">🤮</div>
              <p class="text-xs text-white/80">Hasse</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="px-4 py-8 max-w-2xl mx-auto text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Lade Präferenzen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-4 py-8 max-w-2xl mx-auto">
      <div class="bg-red-100 border-2 border-red-200 rounded-3xl p-6 text-center">
        <div class="text-4xl mb-3">❌</div>
        <h3 class="text-lg font-bold text-red-800 mb-2">Fehler</h3>
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <!-- No Household Warning -->
      <div v-if="!householdStore.currentHousehold" class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-lg font-bold mb-2">Kein Haushalt ausgewählt</h3>
        <p class="text-white/90 text-sm mb-4">
          Wähle einen Haushalt, um Präferenzen zu verwalten.
        </p>
        <router-link
          to="/households"
          class="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-white text-orange-600 rounded-full hover:shadow-lg transition-all"
        >
          Zu Haushalten →
        </router-link>
      </div>

      <!-- No Chores -->
      <div v-else-if="chores.length === 0" class="bg-white rounded-3xl p-8 text-center shadow-lg">
        <div class="text-4xl mb-3">📝</div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Keine Aufgaben vorhanden</h3>
        <p class="text-gray-600 text-sm mb-4">
          Erstelle zuerst Aufgaben, um Präferenzen festzulegen.
        </p>
        <router-link
          to="/chores"
          class="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-purple-500 text-white rounded-full hover:shadow-lg transition-all"
        >
          Zu Aufgaben →
        </router-link>
      </div>

      <!-- Preferences List -->
      <section v-else class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h2 class="text-xl font-bold">Meine Vorlieben</h2>
          <p class="text-white/80 text-sm">{{ chores.length }} Aufgaben</p>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="chore in chores"
            :key="chore.id"
            class="p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="mb-4">
              <h3 class="font-bold text-gray-900 mb-1">{{ chore.title }}</h3>
              <p v-if="chore.description" class="text-sm text-gray-600 mb-2">
                {{ chore.description }}
              </p>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-gray-500">{{ translateRecurrence(chore.recurrence_type) }}</span>
                <span class="text-yellow-600">{{ '⭐'.repeat(chore.difficulty_points) }}</span>
              </div>
            </div>

            <!-- Preference Selector -->
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="pref in preferences"
                :key="pref.value"
                @click="setPreference(chore.id, pref.value)"
                class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
                :class="getPreferenceClass(chore.id, pref.value)"
              >
                <div class="text-2xl mb-1">{{ pref.emoji }}</div>
                <p class="text-xs font-medium">{{ pref.label }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ pref.weight }}x</p>
              </button>
            </div>

            <!-- Current Preference Info -->
            <div v-if="getChorePreference(chore.id)" class="mt-3 p-3 bg-purple-50 rounded-xl">
              <p class="text-sm text-purple-800">
                <span class="font-semibold">Aktuell:</span>
                {{ getPreferenceLabel(getChorePreference(chore.id)?.preference) }}
                • {{ getChorePreference(chore.id)?.weight }}x Wahrscheinlichkeit im Roulette
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Card -->
      <div v-if="chores.length > 0" class="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white shadow-xl">
        <h3 class="text-lg font-bold mb-4">Deine Präferenz-Statistiken</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div class="text-3xl mb-2">😍</div>
            <p class="text-2xl font-bold">{{ getPreferenceCount('love') }}</p>
            <p class="text-xs text-white/80">Liebe</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div class="text-3xl mb-2">😊</div>
            <p class="text-2xl font-bold">{{ getPreferenceCount('like') }}</p>
            <p class="text-xs text-white/80">Mag ich</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div class="text-3xl mb-2">😐</div>
            <p class="text-2xl font-bold">{{ getPreferenceCount('neutral') }}</p>
            <p class="text-xs text-white/80">Neutral</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div class="text-3xl mb-2">😕</div>
            <p class="text-2xl font-bold">{{ getPreferenceCount('dislike') }}</p>
            <p class="text-xs text-white/80">Mag nicht</p>
          </div>
        </div>
        <div class="mt-4 bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
          <div class="text-3xl mb-2">🤮</div>
          <p class="text-2xl font-bold">{{ getPreferenceCount('hate') }}</p>
          <p class="text-xs text-white/80">Hasse</p>
        </div>
      </div>
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
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChoreStore } from '@/stores/chore'
import { useHouseholdStore } from '@/stores/household'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import type { ChorePreference } from '@/types/chore'

const choreStore = useChoreStore()
const householdStore = useHouseholdStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const { chores, loading, error } = storeToRefs(choreStore)
const { currentHousehold } = storeToRefs(householdStore)

const userPreferences = ref<Record<number, any>>({})

const preferences = [
  { value: 'love', emoji: '😍', label: 'Liebe', weight: 2.0 },
  { value: 'like', emoji: '😊', label: 'Mag ich', weight: 1.5 },
  { value: 'neutral', emoji: '😐', label: 'Neutral', weight: 1.0 },
  { value: 'dislike', emoji: '😕', label: 'Mag nicht', weight: 0.5 },
  { value: 'hate', emoji: '🤮', label: 'Hasse', weight: 0.1 },
]

onMounted(async () => {
  if (!currentHousehold.value) {
    await householdStore.fetchHouseholds()
  }

  if (currentHousehold.value) {
    await Promise.all([
      choreStore.fetchChores(currentHousehold.value.id),
      loadUserPreferences(),
    ])
  }
})

async function loadUserPreferences() {
  if (!currentHousehold.value) return

  try {
    const response = await choreStore.$nuxt.$api.get('/chore-preferences', {
      params: { household_id: currentHousehold.value.id },
    })

    // Convert array to map for easier lookup
    const prefsMap: Record<number, any> = {}
    response.data.data.forEach((pref: any) => {
      prefsMap[pref.chore_id] = pref
    })
    userPreferences.value = prefsMap
  } catch (err) {
    console.error('Failed to load preferences:', err)
  }
}

async function setPreference(choreId: number, preference: ChorePreference) {
  if (!currentHousehold.value) return

  try {
    const response = await choreStore.$nuxt.$api.post('/chore-preferences', {
      chore_id: choreId,
      preference: preference,
    })

    userPreferences.value[choreId] = response.data.data
    toast.success('Präferenz gespeichert!')
  } catch (err) {
    toast.error('Fehler beim Speichern der Präferenz')
  }
}

function getChorePreference(choreId: number) {
  return userPreferences.value[choreId]
}

function getPreferenceClass(choreId: number, preference: string) {
  const current = getChorePreference(choreId)?.preference
  const isSelected = current === preference

  const colorMap: Record<string, string> = {
    love: isSelected ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 hover:border-pink-300',
    like: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
    neutral: isSelected ? 'border-gray-500 bg-gray-50 text-gray-700' : 'border-gray-200 hover:border-gray-300',
    dislike: isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300',
    hate: isSelected ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300',
  }

  return colorMap[preference] || 'border-gray-200'
}

function getPreferenceLabel(preference?: string) {
  const pref = preferences.find(p => p.value === preference)
  return pref ? `${pref.emoji} ${pref.label}` : 'Nicht festgelegt'
}

function getPreferenceCount(preference: string) {
  return Object.values(userPreferences.value).filter(p => p.preference === preference).length
}

function translateRecurrence(type: string) {
  const translations: Record<string, string> = {
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    biweekly: 'Zweiwöchentlich',
    monthly: 'Monatlich',
    once: 'Einmalig',
    custom: 'Benutzerdefiniert',
  }
  return translations[type] || type
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
