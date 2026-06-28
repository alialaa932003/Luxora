<script setup lang="ts">
import { computed } from 'vue'
import { Star } from '@lucide/vue'

const props = withDefaults(defineProps<{
  average: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  distribution?: Record<string, number>
}>(), {
  size: 'md',
  showCount: false,
})

const stars = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const val = i + 1
    if (val <= Math.floor(props.average)) return 'full'
    if (val - props.average < 1 && val > props.average) return 'partial'
    return 'empty'
  })
})

const fillPct = computed(() => ((props.average % 1) * 100).toFixed(0) + '%')

const iconSize = computed(() => ({ sm: 12, md: 15, lg: 18 }[props.size]))
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div class="flex items-center gap-0.5">
      <span v-for="(type, i) in stars" :key="i" class="relative inline-flex">
        <Star
          :size="iconSize"
          class="text-muted-foreground/30"
          :fill="'currentColor'"
        />
        <span
          v-if="type === 'full'"
          class="absolute inset-0 flex"
        >
          <Star :size="iconSize" class="text-amber-400" fill="currentColor" />
        </span>
        <span
          v-else-if="type === 'partial'"
          class="absolute inset-0 flex overflow-hidden"
          :style="{ width: fillPct }"
        >
          <Star :size="iconSize" class="text-amber-400 flex-shrink-0" fill="currentColor" />
        </span>
      </span>
    </div>
    <span v-if="showCount && count !== undefined" class="text-xs text-muted-foreground font-medium">
      {{ average.toFixed(1) }} ({{ count.toLocaleString() }})
    </span>
    <span v-else-if="average > 0" class="text-xs text-muted-foreground font-medium">
      {{ average.toFixed(1) }}
    </span>
  </div>
</template>
