<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, ChevronLeft, ChevronRight, Trash2, Star, Package, ExternalLink } from 'lucide-vue-next'
import { adminService } from '@/services/api/admin.service'
import type { AdminProduct, AdminPaginatedResult } from '@/types/admin.types'

const loading = ref(true)
const result = ref<AdminPaginatedResult<AdminProduct> | null>(null)
const search = ref('')
const categoryFilter = ref('all')
const featuredFilter = ref<'all' | 'featured' | 'normal'>('all')
const page = ref(1)
const limit = 10
const deletingId = ref<string | null>(null)
const actionLoading = ref(false)

const CATEGORIES = ['all', 'Electronics', 'Fashion', 'Books', 'Sports', 'Home & Garden', 'Beauty', 'Toys', 'Automotive']

async function fetchProducts(showSpinner = true) {
  if (showSpinner === true) {
    loading.value = true
  }
  try {
    result.value = await adminService.getProducts({
      page: page.value,
      limit,
      category: categoryFilter.value,
      search: search.value,
      featured: featuredFilter.value === 'all' ? undefined : featuredFilter.value === 'featured',
    })
  } finally {
    if (showSpinner === true) {
      loading.value = false
    }
  }
}

onMounted(() => fetchProducts(true))
watch([categoryFilter, featuredFilter, page], () => fetchProducts(true))

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchProducts(true) }, 350)
}

async function toggleFeatured(productId: string) {
  const product = result.value?.data.find(p => p.id === productId)
  if (!product) return

  // Optimistic UI update
  const previousState = product.isFeatured
  product.isFeatured = !previousState

  try {
    await adminService.toggleProductFeatured(productId)
    // Silently refresh data in background to match the server state
    await fetchProducts(false)
  } catch (error) {
    // Revert if API call fails
    product.isFeatured = previousState
  }
}

async function confirmDelete(productId: string) {
  actionLoading.value = true
  try {
    await adminService.deleteProduct(productId)
    deletingId.value = null
    await fetchProducts(false)
  } finally {
    actionLoading.value = false
  }
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Products</h1>
      <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
        Manage all product listings · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
          <input
            v-model="search"
            @input="onSearchInput"
            placeholder="Search products…"
            class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280); --tw-ring-color: oklch(0.51 0.22 291 / 0.25);"
          />
        </div>

        <!-- Featured filter -->
        <div class="flex gap-2">
          <button
            v-for="f in [{ label: 'All', value: 'all' }, { label: 'Featured', value: 'featured' }, { label: 'Normal', value: 'normal' }]"
            :key="f.value"
            @click="featuredFilter = f.value as any; page = 1"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border"
            :style="featuredFilter === f.value
              ? 'background: oklch(0.51 0.22 291); color: #fff; border-color: oklch(0.51 0.22 291);'
              : 'background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);'"
          >{{ f.label }}</button>
        </div>
      </div>

      <!-- Category chips -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          @click="categoryFilter = cat; page = 1"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border"
          :style="categoryFilter === cat
            ? 'background: oklch(0.51 0.22 291 / 0.08); color: oklch(0.51 0.22 291); border-color: oklch(0.51 0.22 291 / 0.25);'
            : 'background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);'"
        >{{ cat === 'all' ? 'All Categories' : cat }}</button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden" style="background: #fff; border-color: oklch(0.88 0.008 85);">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
      </div>

      <div v-else-if="!result?.data.length" class="text-center py-20">
        <Package :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
        <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No products found</p>
        <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Try adjusting your filters</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid oklch(0.88 0.008 85); background: oklch(0.975 0.005 85);">
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Product</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style="color: oklch(0.52 0.015 285);">Vendor</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Price</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style="color: oklch(0.52 0.015 285);">Stock</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style="color: oklch(0.52 0.015 285);">Rating</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Featured</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prod in result?.data"
              :key="prod.id"
              style="border-bottom: 1px solid oklch(0.93 0.004 85);"
            >
              <!-- Product -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border" style="border-color: oklch(0.88 0.008 85);">
                    <img :src="prod.thumbnail" :alt="prod.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ prod.name }}</p>
                    <p class="text-xs" style="color: oklch(0.52 0.015 285);">{{ prod.category.name }}</p>
                  </div>
                </div>
              </td>

              <!-- Vendor -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-sm" style="color: oklch(0.52 0.015 285);">{{ prod.vendor.storeName }}</span>
              </td>

              <!-- Price -->
              <td class="px-6 py-4">
                <span class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(prod.price) }}</span>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4 hidden sm:table-cell">
                <span
                  class="text-sm font-medium px-2.5 py-1 rounded-full"
                  :style="prod.stock === 0
                    ? 'background: oklch(0.57 0.24 27 / 0.10); color: oklch(0.57 0.24 27);'
                    : prod.stock < 10
                    ? 'background: oklch(0.85 0.12 50 / 0.15); color: oklch(0.55 0.16 50);'
                    : 'background: oklch(0.65 0.15 145 / 0.10); color: oklch(0.40 0.14 145);'"
                >{{ prod.stock === 0 ? 'Out' : prod.stock }}</span>
              </td>

              <!-- Rating -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <div class="flex items-center gap-1">
                  <Star :size="13" style="color: oklch(0.75 0.14 85);" fill="oklch(0.75 0.14 85)" />
                  <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ prod.rating }}</span>
                </div>
              </td>

              <!-- Featured toggle -->
              <td class="px-6 py-4">
                <button
                  @click="toggleFeatured(prod.id)"
                  class="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer focus:outline-none"
                  :style="prod.isFeatured ? 'background: oklch(0.51 0.22 291);' : 'background: oklch(0.88 0.008 85);'"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    :style="prod.isFeatured ? 'transform: translateX(20px);' : 'transform: translateX(0);'"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <a :href="`/products/${prod.slug}`" target="_blank"
                    class="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors"
                    style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
                    title="View product">
                    <ExternalLink :size="13" />
                  </a>
                  <div v-if="deletingId === prod.id" class="flex items-center gap-1.5">
                    <span class="text-xs" style="color: oklch(0.57 0.24 27);">Delete?</span>
                    <button @click="confirmDelete(prod.id)" :disabled="actionLoading"
                      class="text-xs px-2 py-1 rounded-lg font-semibold"
                      style="background: oklch(0.57 0.24 27); color: #fff;">Yes</button>
                    <button @click="deletingId = null" class="text-xs px-2 py-1 rounded-lg font-semibold border"
                      style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">No</button>
                  </div>
                  <button
                    v-else
                    @click="deletingId = prod.id"
                    class="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors"
                    style="border-color: oklch(0.88 0.008 85); color: oklch(0.57 0.24 27);"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-4" style="border-top: 1px solid oklch(0.88 0.008 85);">
          <p class="text-sm" style="color: oklch(0.52 0.015 285);">
            Showing {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, result?.total ?? 0) }} of {{ result?.total ?? 0 }}
          </p>
          <div class="flex items-center gap-2">
            <button @click="page--" :disabled="page === 1"
              class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors disabled:opacity-40"
              style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">
              <ChevronLeft :size="16" />
            </button>
            <span class="text-sm font-semibold px-3" style="color: oklch(0.14 0.02 280);">{{ page }} / {{ result?.totalPages }}</span>
            <button @click="page++" :disabled="page === result?.totalPages"
              class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors disabled:opacity-40"
              style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
