<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
    <!-- Hero Header -->
    <PageHeader
      title="Aufgaben"
      subtitle="Gamification & Chores"
      icon="🎲"
      gradient="blue"
    >
      <template #actions>
        <button
          @click="showCreateModal = true"
          class="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-sm transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </template>

      <template #content>
        <StatsCard v-if="myStats" :stats="myStats" />
      </template>
    </PageHeader>

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
          <AssignmentCard
            v-for="assignment in myAssignments"
            :key="assignment.id"
            :assignment="assignment"
            @complete="handleCompleteChore"
            @complete-with-photo="handleCompleteWithPhoto"
            @view-photo="handleViewPhoto"
          />
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
          <ChoreCard
            v-for="chore in chores"
            :key="chore.id"
            :chore="chore"
            @edit="handleEditChore"
          />
        </div>
      </section>

    </main>

    <!-- Modals -->
    <ChoreFormModal
      v-model="showCreateModal"
      @submit="handleCreateChore"
    />

    <ChoreFormModal
      v-model="showEditModal"
      :chore="editingChore"
      @submit="handleUpdateChore"
    />

    <PhotoUploadModal
      v-model="showPhotoModal"
      :assignment="selectedAssignment"
      @submit="handlePhotoSubmit"
    />

    <PhotoViewerModal
      v-model="showPhotoViewer"
      :photo-url="viewPhotoUrl"
    />

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChoreStore } from '@/stores/chore'
import { useHouseholdStore } from '@/stores/household'
import { useToast } from '@/composables/useToast'
import type { ChoreAssignment, Chore } from '@/types/chore'

import PageHeader from '@/components/layout/PageHeader.vue'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import StatsCard from '@/components/chores/StatsCard.vue'
import AssignmentCard from '@/components/chores/AssignmentCard.vue'
import ChoreCard from '@/components/chores/ChoreCard.vue'
import ChoreFormModal from '@/components/chores/ChoreFormModal.vue'
import PhotoUploadModal from '@/components/chores/PhotoUploadModal.vue'
import PhotoViewerModal from '@/components/chores/PhotoViewerModal.vue'

const choreStore = useChoreStore()
const householdStore = useHouseholdStore()
const toast = useToast()

const { chores, myAssignments, myStats, loading, error } = storeToRefs(choreStore)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPhotoModal = ref(false)
const showPhotoViewer = ref(false)
const selectedAssignment = ref<ChoreAssignment | null>(null)
const editingChore = ref<Chore | null>(null)
const viewPhotoUrl = ref<string | null>(null)

onMounted(async () => {
  if (!householdStore.currentHousehold) {
    await householdStore.fetchHouseholds()
  }

  if (householdStore.currentHousehold) {
    await Promise.all([
      choreStore.fetchChores(householdStore.currentHousehold.id),
      choreStore.fetchMyAssignments(),
      choreStore.fetchMyStats(householdStore.currentHousehold.id),
    ])
  }
})

async function handleCreateChore(data: any) {
  if (!householdStore.currentHousehold) return

  try {
    await choreStore.createChore({
      household_id: householdStore.currentHousehold.id,
      ...data,
    })

    showCreateModal.value = false
    toast.success('Aufgabe erfolgreich erstellt!')
  } catch (err) {
    toast.error('Fehler beim Erstellen der Aufgabe')
  }
}

async function handleEditChore(chore: Chore) {
  editingChore.value = chore
  showEditModal.value = true
}

async function handleUpdateChore(data: any) {
  if (!editingChore.value) return

  try {
    await choreStore.updateChore(editingChore.value.id, data)
    showEditModal.value = false
    editingChore.value = null
    toast.success('Aufgabe aktualisiert!')

    if (householdStore.currentHousehold) {
      await choreStore.fetchChores(householdStore.currentHousehold.id)
    }
  } catch (err) {
    toast.error('Fehler beim Aktualisieren der Aufgabe')
  }
}

async function handleCompleteChore(assignment: ChoreAssignment) {
  try {
    await choreStore.completeAssignment(assignment.id)
    toast.success(`+${assignment.chore?.difficulty_points! * 10} XP erhalten!`)

    if (householdStore.currentHousehold) {
      await choreStore.fetchMyStats(householdStore.currentHousehold.id)
    }
  } catch (err) {
    toast.error('Fehler beim Abschließen der Aufgabe')
  }
}

function handleCompleteWithPhoto(assignment: ChoreAssignment) {
  selectedAssignment.value = assignment
  showPhotoModal.value = true
}

async function handlePhotoSubmit(data: { photo: File | null, notes: string }) {
  if (!selectedAssignment.value) return

  try {
    await choreStore.completeAssignment(
      selectedAssignment.value.id,
      data.photo || undefined,
      data.notes || undefined
    )

    toast.success(`+${selectedAssignment.value.chore?.difficulty_points! * 10} XP erhalten!`)

    showPhotoModal.value = false
    selectedAssignment.value = null

    if (householdStore.currentHousehold) {
      await choreStore.fetchMyStats(householdStore.currentHousehold.id)
    }
  } catch (err) {
    toast.error('Fehler beim Abschließen der Aufgabe')
  }
}

function handleViewPhoto(url: string) {
  viewPhotoUrl.value = url
  showPhotoViewer.value = true
}

async function handleRunRoulette() {
  if (!householdStore.currentHousehold) return

  try {
    const assignments = await choreStore.runRoulette(householdStore.currentHousehold.id)
    toast.success(`${assignments.length} Aufgaben neu verteilt!`)
    await choreStore.fetchChores(householdStore.currentHousehold.id)
  } catch (err) {
    toast.error('Fehler beim Roulette')
  }
}
</script>
