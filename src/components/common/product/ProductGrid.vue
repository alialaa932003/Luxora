<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import SkeletonCard from '@/components/common/display/SkeletonCard.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import type { Product } from '@/types/product.types'

defineProps<{
  products: Product[]
  loading?: boolean
  columns?: 2 | 3 | 4 | 5
  emptyTitle?: string
  emptyDescription?: string
}>()
</script>

<template>
  <div>
    <div
      class="grid gap-4 sm:gap-5"
      :class="{
        'grid-cols-1 sm:grid-cols-2': columns === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': !columns || columns === 3,
        'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4': columns === 4,
        'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': columns === 5,
      }"
    >
      <template v-if="loading">
        <SkeletonCard v-for="i in (columns ?? 3) * 2" :key="i" />
      </template>
      <template v-else-if="products.length > 0">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </template>
    </div>

    <EmptyState
      v-if="!loading && products.length === 0"
      :title="emptyTitle ?? 'No products found'"
      :description="emptyDescription ?? 'Try adjusting your search or filters.'"
      icon="package"
    />
  </div>
</template>
