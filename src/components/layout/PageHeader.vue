<template>
  <header :class="['text-white', gradientClass]">
    <div class="px-6 py-12 max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
            {{ icon }}
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-white/80 text-sm">{{ subtitle }}</p>
          </div>
        </div>
        <slot name="actions" />
      </div>

      <slot name="content" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  icon: string
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  gradient: 'blue'
})

const gradientClass = computed(() => {
  const gradients = {
    blue: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    purple: 'bg-gradient-to-r from-teal-700 to-emerald-700',
    green: 'bg-gradient-to-r from-emerald-600 to-green-600',
    orange: 'bg-gradient-to-r from-green-700 to-emerald-700',
    pink: 'bg-gradient-to-r from-teal-600 to-green-600'
  }
  return gradients[props.gradient]
})
</script>
