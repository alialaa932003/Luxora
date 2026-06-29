<script setup lang="ts">
import { computed } from 'vue'
import { SlidersHorizontal, X, Star } from 'lucide-vue-next'
import { dummyCategories } from '@/lib/dummyData'

interface Props {
  selectedCategories?: string[]
  priceMin?: number
  priceMax?: number
  selectedRating?: number | null
  inStockOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedCategories: () => [],
  priceMin: 0,
  priceMax: 5000,
  selectedRating: null,
  inStockOnly: false,
})

const emit = defineEmits<{
  'update:selectedCategories': [value: string[]]
  'update:priceMin': [value: number]
  'update:priceMax': [value: number]
  'update:selectedRating': [value: number | null]
  'update:inStockOnly': [value: boolean]
  'reset': []
}>()

function toggleCategory(slug: string) {
  const current = [...props.selectedCategories]
  const idx = current.indexOf(slug)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(slug)
  }
  emit('update:selectedCategories', current)
}

const hasActiveFilters = computed(() =>
  props.selectedCategories.length > 0 ||
  props.selectedRating !== null ||
  props.inStockOnly ||
  props.priceMin > 0 ||
  props.priceMax < 5000
)
</script>

<template>
  <aside class="w-64 flex-shrink-0 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <SlidersHorizontal :size="16" class="text-foreground stroke-[2.5]" />
        <h2 class="font-bold text-foreground text-sm uppercase tracking-wider">Filters</h2>
      </div>
      <button
        v-if="hasActiveFilters"
        @click="emit('reset')"
        class="text-xs font-bold flex items-center gap-1 text-primary hover:opacity-85 transition-opacity"
      >
        <X :size="12" /> Clear all
      </button>
    </div>

    <!-- Categories List -->
    <div class="space-y-2">
      <h3 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
      <div class="flex flex-col gap-1">
        <button
          v-for="cat in dummyCategories"
          :key="cat.slug"
          @click="toggleCategory(cat.slug)"
          class="w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl transition-all duration-150 text-left font-medium"
          :class="props.selectedCategories.includes(cat.slug)
            ? 'bg-primary/10 text-primary font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
        >
          <span>{{ cat.name }}</span>
          <span class="text-xs opacity-75">{{ cat.productCount }}</span>
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-border/50" />

    <!-- Price Range -->
    <div class="space-y-3">
      <h3 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Price Range</h3>
      <div class="flex items-center gap-2">
        <input
          :value="props.priceMin"
          @change="emit('update:priceMin', +($event.target as HTMLInputElement).value)"
          type="number"
          placeholder="Min"
          class="h-9 w-full rounded-xl border border-border/80 px-3 text-xs focus:outline-none focus:border-primary bg-white text-foreground"
        />
        <span class="text-xs text-muted-foreground">—</span>
        <input
          :value="props.priceMax"
          @change="emit('update:priceMax', +($event.target as HTMLInputElement).value)"
          type="number"
          placeholder="Max"
          class="h-9 w-full rounded-xl border border-border/80 px-3 text-xs focus:outline-none focus:border-primary bg-white text-foreground"
        />
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-border/50" />

    <!-- Min Rating -->
    <div class="space-y-2">
      <h3 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Min Rating</h3>
      <div class="flex flex-col gap-1.5">
        <button
          v-for="r in [4, 3, 2, 1]"
          :key="r"
          @click="emit('update:selectedRating', props.selectedRating === r ? null : r)"
          class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 text-left"
          :class="props.selectedRating === r
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
        >
          <span class="text-amber-400 flex">
            <Star v-for="i in r" :key="i" :size="12" fill="currentColor" class="stroke-[2.5]" />
            <Star v-for="i in (5 - r)" :key="i" :size="12" class="stroke-[2.5] text-muted-foreground/30" />
          </span>
          <span>& above</span>
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-border/50" />

    <!-- Stock -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">In Stock Only</span>
      <button
        role="switch"
        :aria-checked="props.inStockOnly"
        @click="emit('update:inStockOnly', !props.inStockOnly)"
        class="relative w-10 h-5 rounded-full transition-all duration-200"
        :class="props.inStockOnly ? 'bg-primary' : 'bg-muted-foreground/20'"
      >
        <div
          class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
          :style="props.inStockOnly ? 'left: 1.25rem;' : 'left: 0.125rem;'"
        />
      </button>
    </div>
  </aside>
</template>
