<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
    <!-- Hero Header -->
    <header class="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white">
      <div class="px-6 py-12 max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              🎲
            </div>
            <div>
              <h1 class="text-2xl font-bold">Aufgaben</h1>
              <p class="text-white/80 text-sm">Gamification & Chores</p>
            </div>
          </div>
          <button
            @click="showCreateModal = true"
            class="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Quick Stats -->
        <div v-if="myStats" class="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-white/70 text-xs font-medium">Dein Level</p>
              <h2 class="text-3xl font-bold">{{ myStats.level }}</h2>
            </div>
            <div class="text-right">
              <p class="text-white/70 text-xs font-medium">{{ myStats.title }}</p>
              <p class="text-sm font-semibold">{{ myStats.total_xp }} XP</p>
            </div>
          </div>
          <div class="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              class="bg-white h-full transition-all duration-300"
              :style="{ width: myStats.level_progress + '%' }"
            ></div>
          </div>
          <div class="flex justify-between items-center mt-3 text-xs">
            <span class="text-white/70">{{ myStats.current_streak }} 🔥 Streak</span>
            <span class="text-white/90 font-semibold">{{ myStats.current_month_chores }} diesen Monat</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="px-4 py-8 max-w-2xl mx-auto text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Lade Aufgaben...</p>
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
          Wähle oder erstelle einen Haushalt, um Aufgaben zu verwalten.
        </p>
        <router-link
          to="/households"
          class="inline-flex items-center px-5 py-2.5 text-sm font-semibold bg-white text-orange-600 rounded-full hover:shadow-lg transition-all"
        >
          Zu Haushalten →
        </router-link>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-3 gap-3">
        <button
          @click="handleRunRoulette"
          :disabled="!householdStore.currentHousehold"
          class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="text-3xl mb-2">🎰</div>
          <p class="font-semibold text-sm">Roulette</p>
          <p class="text-xs text-white/80">Verteilen</p>
        </button>

        <router-link
          to="/chores/leaderboard"
          class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all block"
        >
          <div class="text-3xl mb-2">🏆</div>
          <p class="font-semibold text-sm">Leaderboard</p>
          <p class="text-xs text-white/80">Rangliste</p>
        </router-link>

        <router-link
          to="/chores/preferences"
          class="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all block"
        >
          <div class="text-3xl mb-2">❤️</div>
          <p class="font-semibold text-sm">Präferenzen</p>
          <p class="text-xs text-white/80">Vorlieben</p>
        </router-link>
      </div>

      <!-- My Assignments -->
      <section class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <h2 class="text-xl font-bold">Meine Aufgaben</h2>
          <p class="text-white/80 text-sm">{{ myAssignments.length }} zugewiesen</p>
        </div>

        <div v-if="myAssignments.length === 0" class="p-8 text-center">
          <div class="text-4xl mb-3">✨</div>
          <p class="text-gray-500">Keine Aufgaben zugewiesen</p>
          <p class="text-gray-400 text-sm mt-1">Genieße deine freie Zeit!</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="assignment in myAssignments"
            :key="assignment.id"
            class="p-5 hover:bg-gray-50 transition-colors"
            :class="{
              'bg-red-50': assignment.is_overdue && assignment.status !== 'completed',
              'opacity-60': assignment.status === 'completed'
            }"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {{ assignment.chore?.title }}
                  <span v-if="assignment.status === 'completed'" class="text-green-500">✓</span>
                </h3>
                <p v-if="assignment.chore?.description" class="text-sm text-gray-600 mb-2">
                  {{ assignment.chore.description }}
                </p>
                <div class="flex items-center gap-3 text-xs">
                  <span class="px-2 py-1 rounded-full" :class="getStatusClass(assignment.status)">
                    {{ translateStatus(assignment.status) }}
                  </span>
                  <span class="text-gray-500">
                    📅 {{ formatDate(assignment.due_date) }}
                  </span>
                  <span v-if="assignment.chore?.difficulty_points" class="text-yellow-600">
                    {{ '⭐'.repeat(assignment.chore.difficulty_points) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Completion Info -->
            <div v-if="assignment.status === 'completed' && assignment.completion" class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Erledigt am {{ formatDate(assignment.completion.completed_at) }}</span>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  +{{ assignment.completion.xp_earned }} XP
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-else-if="assignment.status !== 'completed'" class="mt-3 flex gap-2">
              <button
                @click="handleCompleteChore(assignment)"
                class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                ✓ Erledigt
              </button>
              <button
                v-if="assignment.chore?.requires_photo"
                @click="handleCompleteWithPhoto(assignment)"
                class="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-200 transition-all"
              >
                📷
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- All Chores -->
      <section class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <h2 class="text-xl font-bold">Alle Aufgaben</h2>
          <p class="text-white/80 text-sm">{{ chores.length }} im Haushalt</p>
        </div>

        <div v-if="chores.length === 0" class="p-8 text-center">
          <div class="text-4xl mb-3">📝</div>
          <p class="text-gray-500">Keine Aufgaben vorhanden</p>
          <button
            @click="showCreateModal = true"
            class="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-full font-semibold text-sm hover:bg-indigo-600 transition-all"
          >
            + Erste Aufgabe erstellen
          </button>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="chore in chores"
            :key="chore.id"
            class="p-5 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 mb-1">{{ chore.title }}</h3>
                <p v-if="chore.description" class="text-sm text-gray-600 mb-2">
                  {{ chore.description }}
                </p>
                <div class="flex items-center gap-3 text-xs">
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {{ translateRecurrence(chore.recurrence_type) }}
                  </span>
                  <span class="text-yellow-600">
                    {{ '⭐'.repeat(chore.difficulty_points) }}
                  </span>
                  <span v-if="chore.current_assignment?.user" class="text-blue-600">
                    👤 {{ chore.current_assignment.user.name }}
                  </span>
                </div>
              </div>
              <button
                @click="handleEditChore(chore)"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Create Chore Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="showCreateModal = false">
          <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl" @click.stop>
            <div class="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-3xl">
              <h2 class="text-xl font-bold">Neue Aufgabe erstellen</h2>
            </div>

            <form @submit.prevent="handleCreateChore" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Titel *</label>
                <input
                  v-model="newChore.title"
                  type="text"
                  required
                  placeholder="z.B. Bad putzen"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  v-model="newChore.description"
                  rows="3"
                  placeholder="Details zur Aufgabe..."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Wiederholung *</label>
                  <select
                    v-model="newChore.recurrence_type"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="biweekly">Zweiwöchentlich</option>
                    <option value="monthly">Monatlich</option>
                    <option value="once">Einmalig</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Schwierigkeit *</label>
                  <select
                    v-model.number="newChore.difficulty_points"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option :value="1">⭐ Leicht</option>
                    <option :value="2">⭐⭐ Einfach</option>
                    <option :value="3">⭐⭐⭐ Mittel</option>
                    <option :value="4">⭐⭐⭐⭐ Schwer</option>
                    <option :value="5">⭐⭐⭐⭐⭐ Sehr schwer</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Zuweisung *</label>
                <select
                  v-model="newChore.assignment_mode"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="manual">Manuell zuweisen</option>
                  <option value="auto">Automatisch (Round-Robin)</option>
                  <option value="roulette">Roulette (Präferenzen)</option>
                </select>
              </div>

              <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <input
                  v-model="newChore.requires_photo"
                  type="checkbox"
                  id="requires_photo"
                  class="w-5 h-5 text-blue-500 rounded"
                />
                <label for="requires_photo" class="text-sm font-medium text-gray-700 cursor-pointer">
                  Foto-Nachweis erforderlich 📷
                </label>
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="showCreateModal = false"
                  class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo Upload Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPhotoModal && selectedAssignment" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="cancelPhotoModal">
          <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl" @click.stop>
            <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-3xl">
              <h2 class="text-xl font-bold">Aufgabe abschließen</h2>
              <p class="text-white/90 text-sm mt-1">{{ selectedAssignment.chore?.title }}</p>
            </div>

            <div class="p-6 space-y-4">
              <!-- Photo Upload -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Foto hochladen {{ selectedAssignment.chore?.requires_photo ? '*' : '(optional)' }}
                </label>

                <div v-if="photoPreview" class="relative mb-3">
                  <img :src="photoPreview" alt="Preview" class="w-full h-48 object-cover rounded-xl" />
                  <button
                    @click="selectedPhoto = null; photoPreview = null"
                    class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <label v-else class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors cursor-pointer bg-gray-50">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm text-gray-600 font-semibold mb-1">Klicke zum Hochladen</p>
                    <p class="text-xs text-gray-500">PNG, JPG bis zu 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handlePhotoSelect"
                  />
                </label>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Notizen (optional)</label>
                <textarea
                  v-model="completionNotes"
                  rows="3"
                  placeholder="Zusätzliche Bemerkungen..."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <!-- XP Info -->
              <div class="p-4 bg-green-50 rounded-xl">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Erhältst du:</span>
                  <span class="text-2xl font-bold text-green-600">
                    +{{ (selectedAssignment.chore?.difficulty_points || 1) * 10 }} XP
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="cancelPhotoModal"
                  class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Abbrechen
                </button>
                <button
                  @click="submitPhotoCompletion"
                  :disabled="selectedAssignment.chore?.requires_photo && !selectedPhoto"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abschließen ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChoreStore } from '@/stores/chore'
import { useHouseholdStore } from '@/stores/household'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import type { ChoreAssignment } from '@/types/chore'

const choreStore = useChoreStore()
const householdStore = useHouseholdStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const { chores, myAssignments, myStats, loading, error } = storeToRefs(choreStore)
const { currentHousehold } = storeToRefs(householdStore)

const showCreateModal = ref(false)
const showPhotoModal = ref(false)
const selectedAssignment = ref<ChoreAssignment | null>(null)
const selectedPhoto = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const completionNotes = ref('')

const newChore = ref({
  title: '',
  description: '',
  recurrence_type: 'weekly',
  difficulty_points: 3,
  assignment_mode: 'manual',
  requires_photo: false,
})

onMounted(async () => {
  if (!currentHousehold.value) {
    await householdStore.fetchHouseholds()
  }

  if (currentHousehold.value) {
    await Promise.all([
      choreStore.fetchChores(currentHousehold.value.id),
      choreStore.fetchMyAssignments(),
      choreStore.fetchMyStats(currentHousehold.value.id),
    ])
  }
})

async function handleCreateChore() {
  if (!currentHousehold.value) return

  try {
    await choreStore.createChore({
      household_id: currentHousehold.value.id,
      ...newChore.value,
    })

    showCreateModal.value = false
    newChore.value = {
      title: '',
      description: '',
      recurrence_type: 'weekly',
      difficulty_points: 3,
      assignment_mode: 'manual',
      requires_photo: false,
    }

    toast.success('Aufgabe erfolgreich erstellt!')
  } catch (err) {
    toast.error('Fehler beim Erstellen der Aufgabe')
  }
}

async function handleCompleteChore(assignment: ChoreAssignment) {
  try {
    await choreStore.completeAssignment(assignment.id)
    toast.success(`+${assignment.chore?.difficulty_points! * 10} XP erhalten!`)

    if (currentHousehold.value) {
      await choreStore.fetchMyStats(currentHousehold.value.id)
    }
  } catch (err) {
    toast.error('Fehler beim Abschließen der Aufgabe')
  }
}

function handleCompleteWithPhoto(assignment: ChoreAssignment) {
  selectedAssignment.value = assignment
  showPhotoModal.value = true
}

function handlePhotoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedPhoto.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function submitPhotoCompletion() {
  if (!selectedAssignment.value) return

  try {
    await choreStore.completeAssignment(
      selectedAssignment.value.id,
      selectedPhoto.value || undefined,
      completionNotes.value || undefined
    )

    toast.success(`+${selectedAssignment.value.chore?.difficulty_points! * 10} XP erhalten!`)

    // Reset modal state
    showPhotoModal.value = false
    selectedAssignment.value = null
    selectedPhoto.value = null
    photoPreview.value = null
    completionNotes.value = ''

    if (currentHousehold.value) {
      await choreStore.fetchMyStats(currentHousehold.value.id)
    }
  } catch (err) {
    toast.error('Fehler beim Abschließen der Aufgabe')
  }
}

function cancelPhotoModal() {
  showPhotoModal.value = false
  selectedAssignment.value = null
  selectedPhoto.value = null
  photoPreview.value = null
  completionNotes.value = ''
}

function handleEditChore(chore: any) {
  // TODO: Implement edit modal
  toast.info('Bearbeitung kommt bald!')
}

async function handleRunRoulette() {
  if (!currentHousehold.value) return

  try {
    const assignments = await choreStore.runRoulette(currentHousehold.value.id)
    toast.success(`${assignments.length} Aufgaben neu verteilt!`)
    await choreStore.fetchChores(currentHousehold.value.id)
  } catch (err) {
    toast.error('Fehler beim Roulette')
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
  })
}

function translateStatus(status: string) {
  const translations: Record<string, string> = {
    pending: 'Ausstehend',
    in_progress: 'In Arbeit',
    completed: 'Erledigt',
    overdue: 'Überfällig',
  }
  return translations[status] || status
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function translateRecurrence(type: string) {
  const translations: Record<string, string> = {
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    biweekly: 'Zweiwöchentlich',
    monthly: 'Monatlich',
    once: 'Einmalig',
  }
  return translations[type] || type
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
