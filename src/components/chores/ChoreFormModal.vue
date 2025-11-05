<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="handleClose">
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-3xl sticky top-0 z-10">
            <h2 class="text-xl font-bold">{{ isEdit ? 'Aufgabe bearbeiten' : 'Neue Aufgabe erstellen' }}</h2>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Titel *</label>
              <input
                v-model="formData.title"
                type="text"
                required
                :placeholder="isEdit ? '' : 'z.B. Bad putzen'"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Beschreibung</label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="Details zur Aufgabe..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Wiederholung *</label>
                <select
                  v-model="formData.recurrence_type"
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
                  v-model.number="formData.difficulty_points"
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
                v-model="formData.assignment_mode"
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
                v-model="formData.requires_photo"
                type="checkbox"
                :id="`requires_photo_${isEdit ? 'edit' : 'create'}`"
                class="w-5 h-5 text-blue-500 rounded"
              />
              <label :for="`requires_photo_${isEdit ? 'edit' : 'create'}`" class="text-sm font-medium text-gray-700 cursor-pointer">
                Foto-Nachweis erforderlich 📷
              </label>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {{ isEdit ? 'Speichern' : 'Erstellen' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import type { Chore } from '@/types/chore'

interface Props {
  modelValue: boolean
  chore?: Chore | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.chore)

const formData = ref({
  title: '',
  description: '',
  category: '',
  recurrence_type: 'weekly',
  difficulty_points: 3,
  assignment_mode: 'manual',
  requires_photo: false,
})

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.chore) {
    formData.value = {
      title: props.chore.title,
      description: props.chore.description || '',
      category: props.chore.category || '',
      recurrence_type: props.chore.recurrence_type,
      difficulty_points: props.chore.difficulty_points,
      assignment_mode: props.chore.assignment_mode,
      requires_photo: props.chore.requires_photo,
    }
  } else if (newValue && !props.chore) {
    formData.value = {
      title: '',
      description: '',
      category: '',
      recurrence_type: 'weekly',
      difficulty_points: 3,
      assignment_mode: 'manual',
      requires_photo: false,
    }
  }
})

function handleClose() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  emit('submit', { ...formData.value })
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
</style>
