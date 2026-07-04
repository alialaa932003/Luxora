<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import { useQuery } from '@tanstack/vue-query'
import { productsService } from '@/services/api/products.service'

const { data, isLoading, error } = useQuery({
  queryKey: ['products', 'featured'],
  queryFn: () => productsService.getFeatured(),
  staleTime: 5 * 60 * 1000,
})

const featuredProducts = computed(() => {
  return data.value?.data.data.products ?? []
})
</script>

<template>
  <section v-if="featuredProducts.length > 0 || isLoading" class="py-20 bg-muted/20 border-y border-border/40">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-sm font-semibold text-primary/70 uppercase tracking-widest mb-2">Curated selection</p>
          <h2 class="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Featured Products</h2>
        </div>
        <RouterLink
          to="/products"
          class="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
        >
          Explore All <ArrowRight :size="15" />
        </RouterLink>
      </div>

      <ProductGrid
        :products="featuredProducts"
        :loading="isLoading"
        :columns="4"
      />
    </div>
  </section>
</template>
