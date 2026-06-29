<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import SortDropdown from '@/components/common/display/SortDropdown.vue'
import SkeletonGrid from '@/components/common/display/SkeletonGrid.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import Pagination from '@/components/common/display/Pagination.vue'
import { dummyProducts } from '@/lib/dummyData'

const route = useRoute()
const loading = ref(true)
const sort = ref('popularity')
const page = ref(1)

const query = computed(() => (route.query.q as string) || '')

const results = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  let filtered = dummyProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.name.toLowerCase().includes(q)
  )
  if (sort.value === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort.value === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort.value === 'rating') filtered.sort((a, b) => b.rating.average - a.rating.average)
  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(results.value.length / 12)))
const paginatedResults = computed(() => results.value.slice((page.value - 1) * 12, page.value * 12))

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
  document.title = `Search: "${query.value}" — Luxora`
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <!-- Solid Page Header Banner (No Gradients!) -->
      <div class="bg-primary/5 rounded-[2rem] border border-border/30 px-6 py-8 md:px-12 md:py-10 mb-10 text-center md:text-left flex flex-col gap-2">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-1 justify-center md:justify-start">
          <Search :size="12" /> Search Results
        </p>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          "{{ query }}"
        </h1>
        <p class="text-sm text-muted-foreground">
          Found <span class="font-bold text-foreground">{{ results.length }}</span> {{ results.length === 1 ? 'product' : 'products' }}
        </p>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center justify-between mb-6 gap-4 flex-wrap" v-if="results.length">
        <div class="flex gap-2 flex-wrap">
          <!-- Could add filter chips here -->
        </div>
        <SortDropdown v-model="sort" />
      </div>

      <SkeletonGrid v-if="loading" />

      <EmptyState
        v-else-if="!results.length"
        title="No results found"
        :description="`We couldn't find anything for &quot;${query}&quot;. Try different keywords or browse our categories.`"
        action-label="Browse All Products"
        action-to="/products"
      />

      <ProductGrid v-else :products="paginatedResults" />

      <div v-if="totalPages > 1" class="mt-10">
        <Pagination v-model:page="page" :total-pages="totalPages" :total="results.length" />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
