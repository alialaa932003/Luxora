<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SlidersHorizontal, Grid3x3, List } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import FilterSidebar from '@/components/common/display/FilterSidebar.vue'
import SortDropdown from '@/components/common/display/SortDropdown.vue'
import Pagination from '@/components/common/display/Pagination.vue'
import SkeletonGrid from '@/components/common/display/SkeletonGrid.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import { dummyProducts } from '@/lib/dummyData'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const sort = ref('popularity')
const page = ref(1)
const filtersOpen = ref(false)

const selectedCategories = ref<string[]>([])
const selectedBrands = ref<string[]>([])
const priceMin = ref(0)
const priceMax = ref(5000)
const selectedRating = ref<number | null>(null)
const inStockOnly = ref(false)

function resetFilters() {
  selectedCategories.value = []
  selectedBrands.value = []
  priceMin.value = 0
  priceMax.value = 5000
  selectedRating.value = null
  inStockOnly.value = false
}

const products = computed(() => {
  let result = [...dummyProducts]
  if (inStockOnly.value) result = result.filter(p => p.stock > 0)
  if (selectedCategories.value.length) result = result.filter(p => selectedCategories.value.includes(p.category.slug))
  result = result.filter(p => p.price >= priceMin.value && p.price <= priceMax.value)
  if (selectedRating.value) result = result.filter(p => p.rating.average >= selectedRating.value!)
  if (sort.value === 'price_asc') result.sort((a, b) => a.price - b.price)
  else if (sort.value === 'price_desc') result.sort((a, b) => b.price - a.price)
  else if (sort.value === 'rating') result.sort((a, b) => b.rating.average - a.rating.average)
  else if (sort.value === 'newest') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / 12)))
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * 12
  return products.value.slice(start, start + 12)
})

watch(sort, () => { page.value = 1 })
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <!-- Solid Page Header Banner (No Gradients!) -->
      <div class="bg-primary/5 rounded-[2rem] border border-border/30 px-6 py-10 md:px-12 md:py-12 mb-10 text-center md:text-left flex flex-col gap-3">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary">Marketplace</p>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Find your next campus essential</h1>
        <p class="text-sm sm:text-base text-muted-foreground max-w-xl">
          Search thousands of listings from verified students at universities across the country.
        </p>
      </div>

      <div class="flex gap-8">
        <!-- Filter Sidebar — Desktop -->
        <div class="hidden lg:block">
          <FilterSidebar
            v-model:selectedCategories="selectedCategories"
            v-model:selectedBrands="selectedBrands"
            v-model:priceMin="priceMin"
            v-model:priceMax="priceMax"
            v-model:selectedRating="selectedRating"
            v-model:inStockOnly="inStockOnly"
            @reset="resetFilters"
          />
        </div>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold text-foreground">{{ products.length }}</span> products
            </p>
            <div class="flex items-center gap-3">
              <!-- Mobile filter toggle -->
              <button
                @click="filtersOpen = !filtersOpen"
                class="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                style="border-color: oklch(0.88 0.008 85);"
              >
                <SlidersHorizontal :size="16" /> Filters
              </button>
              <SortDropdown v-model="sort" />
            </div>
          </div>

          <!-- Mobile filter panel -->
          <div v-if="filtersOpen" class="lg:hidden mb-6 p-4 rounded-2xl border" style="border-color: oklch(0.88 0.008 85);">
            <FilterSidebar
              v-model:selectedCategories="selectedCategories"
              v-model:selectedBrands="selectedBrands"
              v-model:priceMin="priceMin"
              v-model:priceMax="priceMax"
              v-model:selectedRating="selectedRating"
              v-model:inStockOnly="inStockOnly"
              @reset="resetFilters"
            />
          </div>

          <!-- Products -->
          <SkeletonGrid v-if="loading" />
          <EmptyState
            v-else-if="!paginatedProducts.length"
            title="No products found"
            description="Try adjusting your filters or browse other categories."
            action-label="Clear Filters"
            @action="resetFilters"
          />
          <ProductGrid v-else :products="paginatedProducts" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-10">
            <Pagination v-model:page="page" :total-pages="totalPages" :total="products.length" />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
