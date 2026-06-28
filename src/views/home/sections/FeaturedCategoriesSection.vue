<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import CategoryCard from '@/components/common/product/CategoryCard.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/vue-query'
import { categoriesService } from '@/services/api/products.service'

const { data, isLoading } = useQuery({
  queryKey: ['categories', 'featured'],
  queryFn: () => categoriesService.getAll({ featured: true, limit: 8 }),
  staleTime: 5 * 60 * 1000,
})

const categories = () => data.value?.data.data.categories ?? []
</script>

<template>
  <section class="py-20 container mx-auto px-4 lg:px-8">
    <div class="flex items-end justify-between mb-10">
      <div>
        <p class="text-sm font-semibold text-primary/70 uppercase tracking-widest mb-2">Browse by</p>
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Popular Categories</h2>
      </div>
      <RouterLink
        to="/products"
        class="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
      >
        View all <ArrowRight :size="15" />
      </RouterLink>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <template v-if="isLoading">
        <Skeleton v-for="i in 8" :key="i" class="aspect-square rounded-2xl" />
      </template>
      <template v-else>
        <CategoryCard
          v-for="category in categories()"
          :key="category.id"
          :category="category"
        />
      </template>
    </div>
  </section>
</template>
