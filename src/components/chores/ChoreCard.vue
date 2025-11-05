<template>
  <div class="p-5 hover:bg-gray-50 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-bold text-gray-900 mb-1">{{ chore.title }}</h3>
        <p v-if="chore.description" class="text-sm text-gray-600 mb-2">
          {{ chore.description }}
        </p>
        <div class="flex items-center gap-3 text-xs">
          <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {{ recurrenceText }}
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
        @click="$emit('edit', chore)"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chore } from '@/types/chore'

interface Props {
  chore: Chore
}

const props = defineProps<Props>()

defineEmits<{
  edit: [chore: Chore]
}>()

const recurrenceText = computed(() => {
  const translations: Record<string, string> = {
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    biweekly: 'Zweiwöchentlich',
    monthly: 'Monatlich',
    once: 'Einmalig',
  }
  return translations[props.chore.recurrence_type] || props.chore.recurrence_type
})
</script>
