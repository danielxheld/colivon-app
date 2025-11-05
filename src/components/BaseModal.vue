<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          @click="close"
        ></div>

        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            :class="contentClass"
          >
            <!-- Header -->
            <div class="text-center mb-6">
              <div class="text-4xl mb-3">{{ icon }}</div>
              <h3 class="text-2xl font-bold text-gray-900">{{ title }}</h3>
              <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
            </div>

            <!-- Body -->
            <slot></slot>

            <!-- Footer (optional) -->
            <slot name="footer">
              <div class="mt-8 flex space-x-3">
                <button
                  v-if="!hideConfirm"
                  type="button"
                  @click="confirm"
                  :disabled="loading"
                  class="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                >
                  {{ confirmText }}
                </button>
                <button
                  v-if="!hideCancel"
                  type="button"
                  @click="close"
                  :disabled="loading"
                  class="flex-1 px-6 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 disabled:opacity-50 transition-all active:scale-95"
                >
                  {{ cancelText }}
                </button>
              </div>
            </slot>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  subtitle?: string
  icon?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  hideConfirm?: boolean
  hideCancel?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '✨',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  hideConfirm: false,
  hideCancel: false,
  contentClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'close': []
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function confirm() {
  emit('confirm')
}
</script>
