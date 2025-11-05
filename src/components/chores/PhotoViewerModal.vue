<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue && photoUrl" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" @click="handleClose">
        <button
          @click="handleClose"
          class="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="photoUrl"
          alt="Photo"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  photoUrl: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleClose() {
  emit('update:modelValue', false)
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
