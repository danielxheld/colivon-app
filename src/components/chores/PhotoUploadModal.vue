<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue && assignment" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="handleClose">
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl" @click.stop>
          <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-3xl">
            <h2 class="text-xl font-bold">Aufgabe abschließen</h2>
            <p class="text-white/90 text-sm mt-1">{{ assignment.chore?.title }}</p>
          </div>

          <div class="p-6 space-y-4">
            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Foto hochladen {{ assignment.chore?.requires_photo ? '*' : '(optional)' }}
              </label>

              <div v-if="photoPreview" class="relative mb-3">
                <img :src="photoPreview" alt="Preview" class="w-full h-48 object-cover rounded-xl" />
                <button
                  @click="clearPhoto"
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
                v-model="notes"
                rows="3"
                placeholder="Zusätzliche Bemerkungen..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <!-- XP Info -->
            <div class="p-4 bg-green-50 rounded-xl">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Erhältst du:</span>
                <span class="text-2xl font-bold text-green-600">
                  +{{ (assignment.chore?.difficulty_points || 1) * 10 }} XP
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Abbrechen
              </button>
              <button
                @click="handleSubmit"
                :disabled="assignment.chore?.requires_photo && !selectedPhoto"
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChoreAssignment } from '@/types/chore'

interface Props {
  modelValue: boolean
  assignment: ChoreAssignment | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: { photo: File | null, notes: string }]
}>()

const selectedPhoto = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const notes = ref('')

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    clearPhoto()
    notes.value = ''
  }
})

function handlePhotoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    selectedPhoto.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function clearPhoto() {
  selectedPhoto.value = null
  photoPreview.value = null
}

function handleClose() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  emit('submit', {
    photo: selectedPhoto.value,
    notes: notes.value
  })
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
