<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm pointer-events-auto min-w-[300px] max-w-md"
          :class="getToastClass(toast.type)"
        >
          <span class="text-xl flex-shrink-0">{{ getIcon(toast.type) }}</span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            @click="remove(toast.id)"
            class="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, remove } = useToast()

function getToastClass(type: ToastType): string {
  const classes = {
    success: 'bg-green-500/90 text-white',
    error: 'bg-red-500/90 text-white',
    warning: 'bg-amber-500/90 text-white',
    info: 'bg-indigo-500/90 text-white',
  }
  return classes[type]
}

function getIcon(type: ToastType): string {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }
  return icons[type]
}
</script>
