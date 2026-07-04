<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import { useQuery } from '@tanstack/vue-query'
import { productsService } from '@/services/api/products.service'

const { data, isLoading } = useQuery({
  queryKey: ['products', 'trending'],
  queryFn: () => productsService.getAll({ sort: 'popularity', limit: 4 }),
  staleTime: 5 * 60 * 1000,
})

const trendingProducts = computed(() => {
  return data.value?.data.data.products ?? []
})
</script>

<template>
  <section v-if="trendingProducts.length > 0 || isLoading" class="py-20 container mx-auto px-4 lg:px-8">
    <div class="flex items-end justify-between mb-10">
      <div>
        <p class="text-sm font-semibold text-primary/70 uppercase tracking-widest mb-2">What's hot</p>
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Trending Now</h2>
      </div>
      <RouterLink
        to="/products?sort=popularity"
        class="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
      >
        View All <ArrowRight :size="15" />
      </RouterLink>
    </div>

    <ProductGrid
      :products="trendingProducts"
      :loading="isLoading"
      :columns="4"
    />
  </section>
</template>
