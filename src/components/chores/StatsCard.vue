<template>
  <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-5 border border-white/20">
    <div class="flex items-center justify-between mb-3">
      <div>
        <p class="text-white/70 text-xs font-medium">Dein Level</p>
        <h2 class="text-3xl font-bold">{{ stats.level }}</h2>
      </div>
      <div class="text-right">
        <p class="text-white/70 text-xs font-medium">{{ stats.title }}</p>
        <p class="text-sm font-semibold">{{ stats.total_xp }} XP</p>
      </div>
    </div>
    <div class="bg-white/20 rounded-full h-2 overflow-hidden">
      <div
        class="bg-white h-full transition-all duration-300"
        :style="{ width: stats.level_progress + '%' }"
      ></div>
    </div>
    <div class="flex justify-between items-center mt-3 text-xs">
      <span class="text-white/70">{{ stats.current_streak }} 🔥 Streak</span>
      <span class="text-white/90 font-semibold">{{ stats.current_month_chores }} diesen Monat</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GamificationStat } from '@/types/chore'

interface Props {
  stats: GamificationStat
}

defineProps<Props>()
</script>
