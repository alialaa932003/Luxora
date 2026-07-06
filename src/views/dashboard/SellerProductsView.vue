<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Search, ChevronLeft, ChevronRight, Trash2, Edit2, Package, Star, Plus, X } from 'lucide-vue-next'
import { sellerService } from '@/services/api/admin.service'
import { useAuthStore } from '@/stores/auth.store'
import type { AdminProduct, AdminPaginatedResult } from '@/types/admin.types'

const authStore = useAuthStore()
const vendorId = computed(() => authStore.user?.id || 'vendor-1')

const loading = ref(true)
const result = ref<AdminPaginatedResult<AdminProduct> | null>(null)
const search = ref('')
const page = ref(1)
const limit = 10
const actionLoading = ref(false)

// Modals state
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const selectedProductId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

// Form fields
const formName = ref('')
const formPrice = ref(0)
const formStock = ref(0)
const formCategory = ref('Electronics')
const formThumbnail = ref('')

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Sports', 'Home & Garden', 'Beauty', 'Toys', 'Automotive']

async function fetchProducts(showSpinner = true) {
  if (showSpinner) {
    loading.value = true
  }
  try {
    result.value = await sellerService.getProducts(vendorId.value, {
      page: page.value,
      limit,
      search: search.value,
    })
  } finally {
    if (showSpinner) {
      loading.value = false
    }
  }
}

onMounted(() => fetchProducts(true))
watch(page, () => fetchProducts(true))

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchProducts(true) }, 350)
}

function openAddModal() {
  formMode.value = 'add'
  selectedProductId.value = null
  formName.value = ''
  formPrice.value = 29.99
  formStock.value = 50
  formCategory.value = 'Electronics'
  formThumbnail.value = ''
  isFormModalOpen.value = true
}

function openEditModal(prod: AdminProduct) {
  formMode.value = 'edit'
  selectedProductId.value = prod.id
  formName.value = prod.name
  formPrice.value = prod.price
  formStock.value = prod.stock
  formCategory.value = prod.category.name
  formThumbnail.value = prod.thumbnail
  isFormModalOpen.value = true
}

async function submitForm() {
  actionLoading.value = true
  try {
    if (formMode.value === 'add') {
      await sellerService.addProduct(vendorId.value, {
        name: formName.value,
        price: formPrice.value,
        stock: formStock.value,
        categoryName: formCategory.value,
        thumbnail: formThumbnail.value || undefined,
      })
    } else {
      if (selectedProductId.value) {
        await sellerService.updateProduct(vendorId.value, selectedProductId.value, {
          name: formName.value,
          price: formPrice.value,
          stock: formStock.value,
          categoryName: formCategory.value,
          thumbnail: formThumbnail.value || undefined,
        })
      }
    }
    isFormModalOpen.value = false
    await fetchProducts(false) // silent background update
  } finally {
    actionLoading.value = false
  }
}

async function confirmDelete(productId: string) {
  actionLoading.value = true
  try {
    await sellerService.deleteProduct(vendorId.value, productId)
    deletingId.value = null
    await fetchProducts(false)
  } finally {
    actionLoading.value = false
  }
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">My Products</h1>
        <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
          Manage your catalog items · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
        </p>
      </div>
      <button
        @click="openAddModal"
        class="h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all focus:outline-none"
        style="background: oklch(0.51 0.22 291); color: #fff;"
      >
        <Plus :size="16" /> Add Product
      </button>
    </div>

    <!-- Filter/Search Bar -->
    <div class="relative max-w-sm">
      <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
      <input
        v-model="search"
        @input="onSearchInput"
        placeholder="Search products…"
        class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none"
        style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
      />
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden bg-white" style="border-color: oklch(0.88 0.008 85);">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
      </div>

      <div v-else-if="!result?.data.length" class="text-center py-20">
        <Package :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
        <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No products found</p>
        <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Add new items to start selling</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid oklch(0.88 0.008 85); background: oklch(0.975 0.005 85);">
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Product</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Price</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Stock</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Sold</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Rating</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in result?.data" :key="prod.id" style="border-bottom: 1px solid oklch(0.93 0.004 85);">
              <!-- Product info -->
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

              <!-- Price -->
              <td class="px-6 py-4">
                <span class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(prod.price) }}</span>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4">
                <span
                  class="text-xs font-semibold px-2.5 py-1 rounded-full"
                  :style="prod.stock === 0
                    ? 'background: oklch(0.57 0.24 27 / 0.10); color: oklch(0.57 0.24 27);'
                    : prod.stock < 10
                    ? 'background: oklch(0.85 0.12 50 / 0.15); color: oklch(0.55 0.16 50);'
                    : 'background: oklch(0.65 0.15 145 / 0.10); color: oklch(0.40 0.14 145);'"
                >{{ prod.stock === 0 ? 'Out' : prod.stock }}</span>
              </td>

              <!-- Sold -->
              <td class="px-6 py-4">
                <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ prod.totalSold }}</span>
              </td>

              <!-- Rating -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <Star :size="13" style="color: oklch(0.75 0.14 85);" fill="oklch(0.75 0.14 85)" />
                  <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ prod.rating }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <!-- Edit Button -->
                  <button
                    @click="openEditModal(prod)"
                    class="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors cursor-pointer"
                    style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
                    title="Edit Item"
                  >
                    <Edit2 :size="13" />
                  </button>

                  <!-- Delete Dialog confirmation inside row -->
                  <div v-if="deletingId === prod.id" class="flex items-center gap-1.5">
                    <span class="text-xs" style="color: oklch(0.57 0.24 27);">Delete?</span>
                    <button @click="confirmDelete(prod.id)" :disabled="actionLoading"
                      class="text-xs px-2 py-1 rounded-lg font-semibold cursor-pointer"
                      style="background: oklch(0.57 0.24 27); color: #fff;">Yes</button>
                    <button @click="deletingId = null" class="text-xs px-2 py-1 rounded-lg font-semibold border cursor-pointer"
                      style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">No</button>
                  </div>
                  <button
                    v-else
                    @click="deletingId = prod.id"
                    class="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors cursor-pointer"
                    style="border-color: oklch(0.88 0.008 85); color: oklch(0.57 0.24 27);"
                    title="Delete Item"
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

    <!-- Modal Form (Add / Edit Product) -->
    <Transition name="fade">
      <div v-if="isFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-3xl p-6 w-full max-w-md border shadow-2xl relative" style="border-color: oklch(0.88 0.008 85);">
          <!-- Close Button -->
          <button @click="isFormModalOpen = false" class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <X :size="18" style="color: oklch(0.52 0.015 285);" />
          </button>

          <!-- Title -->
          <h3 class="text-lg font-bold mb-4" style="color: oklch(0.14 0.02 280);">
            {{ formMode === 'add' ? 'Add Catalog Product' : 'Edit Product Details' }}
          </h3>

          <!-- Form Fields -->
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold mb-1" style="color: oklch(0.52 0.015 285);">Product Name</label>
              <input
                v-model="formName"
                required
                type="text"
                placeholder="Premium Leather Bag…"
                class="w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291/0.2)]"
                style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold mb-1" style="color: oklch(0.52 0.015 285);">Price ($)</label>
                <input
                  v-model="formPrice"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  class="w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                  style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1" style="color: oklch(0.52 0.015 285);">Stock Level</label>
                <input
                  v-model="formStock"
                  required
                  type="number"
                  min="0"
                  class="w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                  style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1" style="color: oklch(0.52 0.015 285);">Category</label>
              <select
                v-model="formCategory"
                class="w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
              >
                <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1" style="color: oklch(0.52 0.015 285);">Image URL (Optional)</label>
              <input
                v-model="formThumbnail"
                type="text"
                placeholder="https://unsplash.com/…"
                class="w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
              />
            </div>

            <!-- Submit buttons -->
            <div class="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-4 py-2 border rounded-xl text-sm font-semibold cursor-pointer"
                style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="actionLoading"
                class="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer text-white disabled:opacity-40"
                style="background: oklch(0.51 0.22 291);"
              >
                {{ formMode === 'add' ? 'Save Product' : 'Apply Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
