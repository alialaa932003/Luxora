<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  amount: number
  currency?: string
  originalPrice?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  currency: 'USD',
  size: 'md',
})

const formatted = computed(() =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(props.amount)
)

const originalFormatted = computed(() =>
  props.originalPrice
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: props.currency }).format(props.originalPrice)
    : null
)

const discountPct = computed(() => {
  if (!props.originalPrice || props.originalPrice <= props.amount) return null
  return Math.round(((props.originalPrice - props.amount) / props.originalPrice) * 100)
})

const sizeClass = computed(() => ({
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
}[props.size]))
</script>

<template>
  <div class="flex items-baseline gap-2 flex-wrap">
    <span :class="['font-bold text-foreground', sizeClass]">{{ formatted }}</span>
    <span v-if="originalFormatted" class="text-sm text-muted-foreground line-through">
      {{ originalFormatted }}
    </span>
    <span v-if="discountPct" class="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive">
      -{{ discountPct }}%
    </span>
  </div>
</template>
