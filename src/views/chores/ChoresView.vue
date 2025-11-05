<template>
  <div class="chores-view">
    <div class="header">
      <h1>Aufgaben</h1>
      <button @click="showCreateModal = true" class="btn-primary">+ Neue Aufgabe</button>
    </div>

    <div v-if="loading" class="loading">Laden...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="chores-container">
      <!-- My Assignments Section -->
      <section class="my-assignments">
        <h2>Meine Aufgaben</h2>
        <div v-if="myAssignments.length === 0" class="empty">
          Keine Aufgaben zugewiesen
        </div>
        <div v-else class="assignments-list">
          <div
            v-for="assignment in myAssignments"
            :key="assignment.id"
            class="assignment-card"
            :class="{ overdue: assignment.is_overdue, completed: assignment.status === 'completed' }"
          >
            <h3>{{ assignment.chore?.title }}</h3>
            <p v-if="assignment.chore?.description">{{ assignment.chore.description }}</p>
            <div class="assignment-meta">
              <span class="due-date">Fällig: {{ formatDate(assignment.due_date) }}</span>
              <span class="status" :class="assignment.status">{{ translateStatus(assignment.status) }}</span>
            </div>
            <div v-if="assignment.status !== 'completed'" class="assignment-actions">
              <button @click="completeChore(assignment)" class="btn-success">
                Erledigt markieren
              </button>
            </div>
            <div v-else-if="assignment.completion" class="completion-info">
              <span class="xp-earned">+{{ assignment.completion.xp_earned }} XP</span>
            </div>
          </div>
        </div>
      </section>

      <!-- All Chores Section -->
      <section class="all-chores">
        <h2>Alle Aufgaben</h2>
        <div v-if="chores.length === 0" class="empty">
          Keine Aufgaben vorhanden
        </div>
        <div v-else class="chores-list">
          <div v-for="chore in chores" :key="chore.id" class="chore-card">
            <h3>{{ chore.title }}</h3>
            <p v-if="chore.description">{{ chore.description }}</p>
            <div class="chore-meta">
              <span class="recurrence">{{ translateRecurrence(chore.recurrence_type) }}</span>
              <span class="difficulty">
                {{ chore.difficulty_points }} ⭐
              </span>
              <span v-if="chore.current_assignment" class="assigned-to">
                Zugewiesen an: {{ chore.current_assignment.user?.name }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Gamification Section -->
      <section v-if="myStats" class="gamification">
        <h2>Meine Stats</h2>
        <div class="stats-card">
          <div class="level-info">
            <span class="level">Level {{ myStats.level }}</span>
            <span class="title">{{ myStats.title }}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-progress" :style="{ width: myStats.level_progress + '%' }"></div>
          </div>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-label">Total XP</span>
              <span class="stat-value">{{ myStats.total_xp }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Aufgaben</span>
              <span class="stat-value">{{ myStats.total_chores_completed }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Streak</span>
              <span class="stat-value">{{ myStats.current_streak }} 🔥</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Create Chore Modal (simplified) -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <h2>Neue Aufgabe erstellen</h2>
        <form @submit.prevent="handleCreateChore">
          <input v-model="newChore.title" placeholder="Titel" required />
          <textarea v-model="newChore.description" placeholder="Beschreibung"></textarea>
          <select v-model="newChore.recurrence_type" required>
            <option value="daily">Täglich</option>
            <option value="weekly">Wöchentlich</option>
            <option value="biweekly">Zweiwöchentlich</option>
            <option value="monthly">Monatlich</option>
            <option value="once">Einmalig</option>
          </select>
          <input v-model.number="newChore.difficulty_points" type="number" min="1" max="5" placeholder="Schwierigkeit (1-5)" />
          <select v-model="newChore.assignment_mode">
            <option value="manual">Manuell zuweisen</option>
            <option value="auto">Automatisch (Round-Robin)</option>
            <option value="roulette">Roulette (Präferenzen)</option>
          </select>
          <div class="modal-actions">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">Abbrechen</button>
            <button type="submit" class="btn-primary">Erstellen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChoreStore } from '@/stores/chore'
import { useHouseholdStore } from '@/stores/household'
import type { ChoreAssignment } from '@/types/chore'

const choreStore = useChoreStore()
const householdStore = useHouseholdStore()

const { chores, myAssignments, myStats, loading, error } = storeToRefs(choreStore)
const { currentHousehold } = storeToRefs(householdStore)

const showCreateModal = ref(false)
const newChore = ref({
  title: '',
  description: '',
  recurrence_type: 'weekly',
  difficulty_points: 3,
  assignment_mode: 'manual',
})

onMounted(async () => {
  if (!currentHousehold.value) return

  await Promise.all([
    choreStore.fetchChores(currentHousehold.value.id),
    choreStore.fetchMyAssignments(),
    choreStore.fetchMyStats(currentHousehold.value.id),
  ])
})

async function handleCreateChore() {
  if (!currentHousehold.value) return

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
  }
}

async function completeChore(assignment: ChoreAssignment) {
  await choreStore.completeAssignment(assignment.id)
  if (currentHousehold.value) {
    await choreStore.fetchMyStats(currentHousehold.value.id)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE')
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
.chores-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.chores-container {
  display: grid;
  gap: 30px;
}

.my-assignments,
.all-chores,
.gamification {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.assignments-list,
.chores-list {
  display: grid;
  gap: 15px;
  margin-top: 15px;
}

.assignment-card,
.chore-card {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.assignment-card:hover,
.chore-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.assignment-card.overdue {
  border-left: 4px solid #f44336;
}

.assignment-card.completed {
  opacity: 0.7;
  background: #f5f5f5;
}

.assignment-meta,
.chore-meta {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

.status.completed {
  background: #4caf50;
  color: white;
}

.status.overdue {
  background: #f44336;
  color: white;
}

.assignment-actions {
  margin-top: 10px;
}

.completion-info {
  margin-top: 10px;
}

.xp-earned {
  color: #4caf50;
  font-weight: bold;
}

.stats-card {
  margin-top: 15px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.level {
  font-size: 1.5em;
  font-weight: bold;
}

.xp-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.xp-progress {
  height: 100%;
  background: linear-gradient(to right, #4caf50, #8bc34a);
  transition: width 0.3s;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85em;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

input,
textarea,
select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary,
.btn-success {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover {
  background: #1976d2;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #f44336;
}
</style>
