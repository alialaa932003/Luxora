<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Package, ChevronRight, Loader2 } from 'lucide-vue-next'
import EmptyState from '@/components/common/feedback/EmptyState.vue'

const loading = ref(true)

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-violet-100 text-violet-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const dummyOrders = [
  { id: 'ord_001', orderNumber: 'ORD-20260115-7845', status: 'delivered', total: 449.98, itemCount: 2, createdAt: '2026-05-15T14:00:00Z' },
  { id: 'ord_002', orderNumber: 'ORD-20260220-3321', status: 'shipped', total: 99.99, itemCount: 1, createdAt: '2026-06-20T10:00:00Z' },
  { id: 'ord_003', orderNumber: 'ORD-20260625-1109', status: 'processing', total: 189.99, itemCount: 1, createdAt: '2026-06-25T08:00:00Z' },
]

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
  document.title = 'My Orders - Luxora'
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground tracking-tight">My Orders</h1>
      <p class="text-muted-foreground text-sm mt-1">Track and manage your order history</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 :size="28" class="animate-spin text-muted-foreground" />
    </div>

    <EmptyState
      v-else-if="!dummyOrders.length"
      title="No orders yet"
      description="When you place your first order, it will appear here."
      action-label="Start Shopping"
      action-to="/products"
    />

    <div v-else class="space-y-3">
      <div
        v-for="order in dummyOrders"
        :key="order.id"
        class="flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-200 hover:shadow-sm"
        style="border-color: oklch(0.88 0.008 85); background: oklch(0.975 0.006 85);"
      >
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background: oklch(0.32 0.09 295 / 0.08);">
            <Package :size="20" style="color: oklch(0.32 0.09 295);" />
          </div>
          <div>
            <p class="font-bold text-foreground text-sm">{{ order.orderNumber }}</p>
            <p class="text-xs text-muted-foreground">{{ formatDate(order.createdAt) }} · {{ order.itemCount }} item{{ order.itemCount > 1 ? 's' : '' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div>
            <p class="font-bold text-foreground text-sm text-right">${{ order.total.toFixed(2) }}</p>
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize mt-0.5" :class="statusColor[order.status]">
              {{ order.status }}
            </span>
          </div>
          <RouterLink
            :to="`/account/orders/${order.id}`"
            class="p-2 rounded-xl transition-all hover:bg-muted"
            aria-label="View order"
          >
            <ChevronRight :size="18" class="text-muted-foreground" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
