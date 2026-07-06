<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Check } from 'lucide-vue-next'
import { adminService } from '@/services/api/admin.service'
import type { AdminOrder, AdminPaginatedResult } from '@/types/admin.types'
import type { OrderStatus } from '@/types/order.types'

const loading = ref(true)
const result = ref<AdminPaginatedResult<AdminOrder> | null>(null)
const search = ref('')
const statusFilter = ref('all')
const page = ref(1)
const limit = 10
const actionLoadingId = ref<string | null>(null)

const STATUSES = ['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled']

async function fetchOrders(showSpinner = true) {
  if (showSpinner === true) {
    loading.value = true
  }
  try {
    result.value = await adminService.getOrders({
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

onMounted(() => fetchOrders(true))
watch([statusFilter, page], () => fetchOrders(true))

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchOrders(true) }, 350)
}

async function changeStatus(orderId: string, newStatus: string) {
  const order = result.value?.data.find(o => o.id === orderId)
  if (!order) return

  const previousStatus = order.status
  // Optimistic UI update
  order.status = newStatus as any

  actionLoadingId.value = orderId
  try {
    await adminService.updateOrderStatus(orderId, newStatus)
    await fetchOrders(false)
  } catch (error) {
    order.status = previousStatus
  } finally {
    actionLoadingId.value = null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getInitials(o: AdminOrder) {
  return `${o.customer.firstName[0]}${o.customer.lastName[0]}`.toUpperCase()
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  placed:     { bg: 'oklch(0.75 0.14 85 / 0.12)', text: 'oklch(0.50 0.14 85)' },
  processing: { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
  shipped:    { bg: 'oklch(0.72 0.08 160 / 0.12)', text: 'oklch(0.42 0.12 160)' },
  delivered:  { bg: 'oklch(0.65 0.15 145 / 0.12)', text: 'oklch(0.40 0.14 145)' },
  cancelled:  { bg: 'oklch(0.57 0.24 27 / 0.10)', text: 'oklch(0.57 0.24 27)' },
  paid:       { bg: 'oklch(0.65 0.15 145 / 0.12)', text: 'oklch(0.40 0.14 145)' },
  pending:    { bg: 'oklch(0.75 0.14 85 / 0.12)', text: 'oklch(0.50 0.14 85)' },
  failed:     { bg: 'oklch(0.57 0.24 27 / 0.10)', text: 'oklch(0.57 0.24 27)' },
  refunded:   { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Orders</h1>
      <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
        Manage platform orders · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
      </p>
    </div>

    <!-- Status tabs + search -->
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
          placeholder="Order # or customer email…"
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
        <ShoppingBag :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
        <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No orders found</p>
        <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Try adjusting your filters</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid oklch(0.88 0.008 85); background: oklch(0.975 0.005 85);">
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Order</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style="color: oklch(0.52 0.015 285);">Customer</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Total</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style="color: oklch(0.52 0.015 285);">Payment</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Status</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style="color: oklch(0.52 0.015 285);">Date</th>
              <th class="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in result?.data"
              :key="order.id"
              style="border-bottom: 1px solid oklch(0.93 0.004 85);"
            >
              <!-- Order # -->
              <td class="px-6 py-4">
                <p class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ order.orderNumber }}</p>
                <p class="text-xs" style="color: oklch(0.52 0.015 285);">{{ order.itemCount }} item{{ order.itemCount !== 1 ? 's' : '' }}</p>
              </td>

              <!-- Customer -->
              <td class="px-6 py-4 hidden sm:table-cell">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img v-if="order.customer.avatar" :src="order.customer.avatar" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                       style="background: oklch(0.51 0.22 291);">
                      {{ getInitials(order) }}
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
                    <p class="text-xs" style="color: oklch(0.52 0.015 285);">{{ order.customer.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Total -->
              <td class="px-6 py-4">
                <span class="text-sm font-bold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(order.total) }}</span>
              </td>

              <!-- Payment status -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                  :style="{ background: STATUS_COLORS[order.paymentStatus]?.bg, color: STATUS_COLORS[order.paymentStatus]?.text }">
                  {{ order.paymentStatus }}
                </span>
              </td>

              <!-- Order Status (editable via dropdown list) -->
              <td class="px-6 py-4">
                <select
                  :value="order.status"
                  @change="changeStatus(order.id, ($event.target as HTMLSelectElement).value)"
                  :disabled="actionLoadingId === order.id"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291)] transition-colors pr-7 appearance-none"
                  style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 8px center;"
                  :style="{ backgroundColor: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.text, borderColor: STATUS_COLORS[order.status]?.text + '20' }"
                >
                  <option v-for="s in ['placed','processing','shipped','delivered','cancelled']" :key="s" :value="s"
                    style="background: #fff; color: oklch(0.14 0.02 280);">
                    {{ s }}
                  </option>
                </select>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 hidden lg:table-cell text-sm" style="color: oklch(0.52 0.015 285);">{{ formatDate(order.createdAt) }}</td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
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
