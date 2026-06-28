<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import type { Category } from '@/types/product.types'

defineProps<{
  category: Category
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <RouterLink
    :to="`/categories/${category.slug}`"
    class="group relative overflow-hidden rounded-2xl block aspect-square card-elevated card-hover"
  >
    <!-- Background Image -->
    <img
      :src="category.image"
      :alt="category.name"
      loading="lazy"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

    <!-- Content -->
    <div class="absolute inset-0 p-5 flex flex-col justify-end">
      <h3 class="font-bold text-background text-lg leading-tight group-hover:text-accent transition-colors duration-200">
        {{ category.name }}
      </h3>
      <div class="flex items-center justify-between mt-1">
        <span class="text-xs text-background/70 font-medium">
          {{ category.productCount?.toLocaleString() ?? 0 }} products
        </span>
        <span class="flex items-center gap-1 text-xs font-semibold text-background/80 group-hover:text-accent transition-all duration-200 translate-x-0 group-hover:translate-x-1">
          Shop <ArrowRight :size="12" />
        </span>
      </div>
    </div>
  </RouterLink>
</template>
