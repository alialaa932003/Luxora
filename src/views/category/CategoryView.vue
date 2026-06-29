<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import SortDropdown from '@/components/common/display/SortDropdown.vue'
import FilterSidebar from '@/components/common/display/FilterSidebar.vue'
import Pagination from '@/components/common/display/Pagination.vue'
import SkeletonGrid from '@/components/common/display/SkeletonGrid.vue'
import { dummyProducts } from '@/lib/dummyData'
import { categoriesService } from '@/services/api/categories.service'
import type { Category } from '@/types/product.types'

const route = useRoute()
const loading = ref(true)
const sort = ref('popularity')
const page = ref(1)
const category = ref<Category | undefined>(undefined)

const products = computed(() => {
  let filtered = dummyProducts.filter(p => p.category.slug === route.params.slug)
  if (sort.value === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort.value === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort.value === 'rating') filtered.sort((a, b) => b.rating.average - a.rating.average)
  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / 12)))
const paginatedProducts = computed(() => products.value.slice((page.value - 1) * 12, page.value * 12))

onMounted(async () => {
  category.value = await categoriesService.getBySlug(route.params.slug as string)
  if (category.value) {
    document.title = `${category.value.name} — Lumina`
  }
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <!-- Category Hero Banner -->
    <section class="container mx-auto px-4 lg:px-8 pt-6" v-if="category">
      <div class="relative h-48 rounded-[2rem] overflow-hidden border border-border/20 shadow-sm flex flex-col justify-end p-8 md:p-10">
        <img
          :src="category.image"
          :alt="category.name"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/45" />
        <div class="relative z-10 flex flex-col gap-1 text-white">
          <p class="text-xs font-bold uppercase tracking-widest text-white/85">{{ category.productCount }} products</p>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ category.name }}</h1>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <div class="hidden lg:block">
          <FilterSidebar />
        </div>

        <!-- Products -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold text-foreground">{{ products.length }}</span> products
            </p>
            <SortDropdown v-model="sort" />
          </div>

          <SkeletonGrid v-if="loading" />
          <ProductGrid v-else :products="paginatedProducts" />

          <div v-if="totalPages > 1" class="mt-10">
            <Pagination v-model:page="page" :total-pages="totalPages" :total="products.length" />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
