<script setup lang="ts">
import { computed } from 'vue'
import { Package, Search, ShoppingCart, Heart, AlertCircle, Inbox } from '@lucide/vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: 'package' | 'search' | 'cart' | 'heart' | 'error' | 'inbox'
  actionLabel?: string
  onAction?: () => void
}>(), {
  title: 'Nothing here yet',
  description: 'Check back later.',
  icon: 'inbox',
})

const iconComponent = computed(() => ({
  package: Package,
  search: Search,
  cart: ShoppingCart,
  heart: Heart,
  error: AlertCircle,
  inbox: Inbox,
}[props.icon]))
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div class="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-6">
      <component :is="iconComponent" :size="28" class="text-muted-foreground/60" />
    </div>
    <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>
    <p class="text-sm text-muted-foreground max-w-sm mb-6">{{ description }}</p>
    <button
      v-if="actionLabel && onAction"
      @click="onAction"
      class="px-6 py-2.5 text-sm font-semibold rounded-xl gradient-primary text-white shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
