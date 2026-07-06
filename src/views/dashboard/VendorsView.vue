<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, ChevronLeft, ChevronRight, Store, Star, BadgeCheck } from 'lucide-vue-next'
import { adminService } from '@/services/api/admin.service'
import type { AdminVendor, AdminPaginatedResult } from '@/types/admin.types'

const loading = ref(true)
const result = ref<AdminPaginatedResult<AdminVendor> | null>(null)
const search = ref('')
const statusFilter = ref('all')
const page = ref(1)
const limit = 10
const actionLoadingId = ref<string | null>(null)

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'suspended']

async function fetchVendors(showSpinner = true) {
  if (showSpinner === true) {
    loading.value = true
  }
  try {
    result.value = await adminService.getVendors({
      page: page.value,
      limit,
      status: statusFilter.value,
      search: search.value,
    })
  } finally {
    if (showSpinner === true) {
      loading.value = false
    }
  }
}

onMounted(() => fetchVendors(true))
watch([statusFilter, page], () => fetchVendors(true))

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchVendors(true) }, 350)
}

async function changeStatus(vendorId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'suspended') {
  const vendor = result.value?.data.find(v => v.id === vendorId)
  if (!vendor) return

  const previousStatus = vendor.status
  // Optimistic UI update
  vendor.status = newStatus

  actionLoadingId.value = vendorId
  try {
    await adminService.updateVendorStatus(vendorId, newStatus)
    await fetchVendors(false)
  } catch (error) {
    vendor.status = previousStatus
  } finally {
    actionLoadingId.value = null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'oklch(0.75 0.14 85 / 0.12)', text: 'oklch(0.50 0.14 85)' },
  approved:  { bg: 'oklch(0.65 0.15 145 / 0.12)', text: 'oklch(0.40 0.14 145)' },
  rejected:  { bg: 'oklch(0.57 0.24 27 / 0.10)', text: 'oklch(0.57 0.24 27)' },
  suspended: { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Vendors</h1>
      <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
        Manage seller accounts · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3">
      <!-- Status tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="s in STATUSES"
          :key="s"
          @click="statusFilter = s; page = 1"
          class="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-150 border"
          :style="statusFilter === s
            ? 'background: oklch(0.51 0.22 291); color: #fff; border-color: oklch(0.51 0.22 291);'
            : 'background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);'"
        >{{ s }}</button>
      </div>

      <!-- Search -->
      <div class="relative max-w-sm">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
        <input
          v-model="search"
          @input="onSearchInput"
          placeholder="Store name or email…"
          class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none"
          style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden" style="background: #fff; border-color: oklch(0.88 0.008 85);">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
      </div>

      <div v-else-if="!result?.data.length" class="text-center py-20">
        <Store :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
        <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No vendors found</p>
        <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Try adjusting your filters</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid oklch(0.88 0.008 85); background: oklch(0.975 0.005 85);">
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Store</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style="color: oklch(0.52 0.015 285);">Owner</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style="color: oklch(0.52 0.015 285);">Products</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style="color: oklch(0.52 0.015 285);">Revenue</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style="color: oklch(0.52 0.015 285);">Rating</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vendor in result?.data"
              :key="vendor.id"
              style="border-bottom: 1px solid oklch(0.93 0.004 85);"
            >
              <!-- Store -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border" style="border-color: oklch(0.88 0.008 85);">
                    <img v-if="vendor.logo" :src="vendor.logo" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center font-bold text-sm"
                      style="background: oklch(0.51 0.22 291 / 0.08); color: oklch(0.51 0.22 291);">
                      {{ vendor.storeName[0] }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ vendor.storeName }}</p>
                      <BadgeCheck v-if="vendor.isVerified" :size="13" style="color: oklch(0.51 0.22 291); flex-shrink: 0;" />
                    </div>
                    <p class="text-xs truncate" style="color: oklch(0.52 0.015 285);">{{ vendor.businessEmail }}</p>
                  </div>
                </div>
              </td>

              <!-- Owner -->
              <td class="px-6 py-4 hidden md:table-cell text-sm" style="color: oklch(0.52 0.015 285);">{{ vendor.ownerName }}</td>

              <!-- Products -->
              <td class="px-6 py-4 hidden sm:table-cell">
                <span class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ vendor.productCount }}</span>
              </td>

              <!-- Revenue -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(vendor.totalRevenue) }}</span>
              </td>

              <!-- Rating -->
              <td class="px-6 py-4 hidden md:table-cell">
                <div class="flex items-center gap-1">
                  <Star :size="13" style="color: oklch(0.75 0.14 85);" fill="oklch(0.75 0.14 85)" />
                  <span class="text-sm" style="color: oklch(0.14 0.02 280);">{{ vendor.rating }}</span>
                </div>
              </td>

              <!-- Status badge (editable via dropdown list) -->
              <td class="px-6 py-4">
                <select
                  :value="vendor.status"
                  @change="changeStatus(vendor.id, ($event.target as HTMLSelectElement).value as any)"
                  :disabled="actionLoadingId === vendor.id"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291)] transition-colors pr-7 appearance-none"
                  style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 8px center;"
                  :style="{ backgroundColor: STATUS_STYLES[vendor.status]?.bg, color: STATUS_STYLES[vendor.status]?.text, borderColor: STATUS_STYLES[vendor.status]?.text + '20' }"
                >
                  <option v-for="s in ['pending', 'approved', 'rejected', 'suspended']" :key="s" :value="s"
                    style="background: #fff; color: oklch(0.14 0.02 280);">
                    {{ s }}
                  </option>
                </select>
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
