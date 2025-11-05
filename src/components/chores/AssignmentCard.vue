<template>
  <div
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
          <span class="px-2 py-1 rounded-full" :class="statusClass">
            {{ statusText }}
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
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600">Erledigt am {{ formatDate(assignment.completion.completed_at) }}</span>
        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
          +{{ assignment.completion.xp_earned }} XP
        </span>
      </div>

      <!-- Photo Thumbnail -->
      <div v-if="assignment.completion.photo_url" class="mt-2">
        <img
          :src="assignment.completion.photo_url"
          alt="Completion photo"
          loading="lazy"
          class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="$emit('view-photo', assignment.completion.photo_url)"
        />
      </div>

      <!-- Notes -->
      <div v-if="assignment.completion.notes" class="mt-2 p-2 bg-gray-50 rounded-lg">
        <p class="text-xs text-gray-600">{{ assignment.completion.notes }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-else-if="assignment.status !== 'completed'" class="mt-3 flex gap-2">
      <button
        @click="$emit('complete', assignment)"
        class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
      >
        ✓ Erledigt
      </button>
      <button
        v-if="assignment.chore?.requires_photo"
        @click="$emit('complete-with-photo', assignment)"
        class="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-200 transition-all"
      >
        📷
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChoreAssignment } from '@/types/chore'

interface Props {
  assignment: ChoreAssignment
}

const props = defineProps<Props>()

defineEmits<{
  complete: [assignment: ChoreAssignment]
  'complete-with-photo': [assignment: ChoreAssignment]
  'view-photo': [url: string]
}>()

const statusClass = computed(() => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  }
  return classes[props.assignment.status] || 'bg-gray-100 text-gray-700'
})

const statusText = computed(() => {
  const translations: Record<string, string> = {
    pending: 'Ausstehend',
    in_progress: 'In Arbeit',
    completed: 'Erledigt',
    overdue: 'Überfällig',
  }
  return translations[props.assignment.status] || props.assignment.status
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
  })
}
</script>
