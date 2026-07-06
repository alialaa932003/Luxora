<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { DollarSign, ShoppingBag, Package, Star, TrendingUp, ArrowUpRight } from 'lucide-vue-next'
import { sellerService } from '@/services/api/admin.service'
import { useAuthStore } from '@/stores/auth.store'
import type { AdminProduct, AdminOrder, RevenueChartPoint } from '@/types/admin.types'

const authStore = useAuthStore()
const vendorId = computed(() => authStore.user?.id || 'vendor-1')

const loading = ref(true)
const stats = ref<{ totalRevenue: number; totalSold: number; totalProducts: number; rating: number } | null>(null)
const chartData = ref<RevenueChartPoint[]>([])
const recentOrders = ref<AdminOrder[]>([])
const topProducts = ref<AdminProduct[]>([])

// SVG Line Chart animation properties
const LINE_WIDTH = 600
const LINE_HEIGHT = 180
const PADDING = { top: 20, right: 20, bottom: 30, left: 50 }
const linePathEl = ref<SVGPathElement | null>(null)
const linePathLength = ref(0)
const lineDrawn = ref(false)

onMounted(async () => {
  try {
    const [s, r, p, o] = await Promise.all([
      sellerService.getStats(vendorId.value),
      sellerService.getRevenueChart(vendorId.value),
      sellerService.getProducts(vendorId.value, { limit: 5 }),
      sellerService.getOrders(vendorId.value, { limit: 5 }),
    ])
    stats.value = s
    chartData.value = r
    topProducts.value = p.data.sort((a, b) => b.totalSold - a.totalSold)
    recentOrders.value = o.data
  } finally {
    loading.value = false
  }

  // Animation triggers
  await nextTick()
  if (linePathEl.value) {
    linePathLength.value = linePathEl.value.getTotalLength()
  }
  setTimeout(() => {
    lineDrawn.value = true
  }, 100)
})

// Revenue Chart calculations
const revenuePoints = computed(() => {
  if (!chartData.value.length) return []
  const maxVal = Math.max(...chartData.value.map(d => d.revenue))
  const minVal = Math.min(...chartData.value.map(d => d.revenue))
  const range = maxVal - minVal || 1
  const w = LINE_WIDTH - PADDING.left - PADDING.right
  const h = LINE_HEIGHT - PADDING.top - PADDING.bottom

  return chartData.value.map((d, i) => ({
    x: PADDING.left + (i / (chartData.value.length - 1)) * w,
    y: PADDING.top + h - ((d.revenue - minVal) / range) * h,
    label: d.month,
    value: d.revenue,
  }))
})

const linePath = computed(() => {
  if (!revenuePoints.value.length) return ''
  return revenuePoints.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (!revenuePoints.value.length) return ''
  const pts = revenuePoints.value
  const bottom = LINE_HEIGHT - PADDING.bottom
  const open = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return `${open} L ${pts[pts.length - 1].x} ${bottom} L ${pts[0].x} ${bottom} Z`
})

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  placed:     { bg: 'oklch(0.75 0.14 85 / 0.12)', text: 'oklch(0.50 0.14 85)' },
  processing: { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
  shipped:    { bg: 'oklch(0.72 0.08 160 / 0.12)', text: 'oklch(0.42 0.12 160)' },
  delivered:  { bg: 'oklch(0.65 0.15 145 / 0.12)', text: 'oklch(0.40 0.14 145)' },
  cancelled:  { bg: 'oklch(0.57 0.24 27 / 0.10)', text: 'oklch(0.57 0.24 27)' },
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Store Overview</h1>
      <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">Track sales, performance, and items</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="w-10 h-10 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
    </div>

    <template v-else>
      <!-- Summary stats cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Earnings -->
        <div class="rounded-2xl border p-5 bg-white stat-card" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-[oklch(0.51_0.22_291/0.10)]">
              <DollarSign :size="16" class="text-[oklch(0.51_0.22_291)]" />
            </div>
            <p class="text-sm font-medium" style="color: oklch(0.52 0.015 285);">Store Revenue</p>
          </div>
          <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(stats?.totalRevenue ?? 0) }}</p>
          <p class="text-xs mt-1 text-[oklch(0.40_0.14_145)]">↑ 12% vs last month</p>
        </div>

        <!-- Sales -->
        <div class="rounded-2xl border p-5 bg-white stat-card" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-[oklch(0.65_0.16_50/0.15)]">
              <ShoppingBag :size="16" class="text-[oklch(0.65_0.16_50)]" />
            </div>
            <p class="text-sm font-medium" style="color: oklch(0.52 0.015 285);">Units Sold</p>
          </div>
          <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ stats?.totalSold }}</p>
          <p class="text-xs mt-1 text-[oklch(0.40_0.14_145)]">↑ 8.3% vs last month</p>
        </div>

        <!-- Products -->
        <div class="rounded-2xl border p-5 bg-white stat-card" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-[oklch(0.42_0.12_160/0.15)]">
              <Package :size="16" class="text-[oklch(0.42_0.12_160)]" />
            </div>
            <p class="text-sm font-medium" style="color: oklch(0.52 0.015 285);">Live Listings</p>
          </div>
          <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ stats?.totalProducts }}</p>
          <p class="text-xs mt-1" style="color: oklch(0.52 0.015 285);">Active catalog items</p>
        </div>

        <!-- Rating -->
        <div class="rounded-2xl border p-5 bg-white stat-card" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-[oklch(0.75_0.14_85/0.15)]">
              <Star :size="16" class="text-[oklch(0.75_0.14_85)]" />
            </div>
            <p class="text-sm font-medium" style="color: oklch(0.52 0.015 285);">Rating</p>
          </div>
          <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ stats?.rating }} / 5.0</p>
          <p class="text-xs mt-1 text-[oklch(0.40_0.14_145)]">Highly Rated Seller</p>
        </div>
      </div>

      <!-- Monthly Earnings SVG Chart -->
      <div class="rounded-2xl border p-6 bg-white" style="border-color: oklch(0.88 0.008 85);">
        <div class="mb-5 flex justify-between items-center">
          <div>
            <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Monthly Earnings Trend</h2>
            <p class="text-xs mt-0.5" style="color: oklch(0.52 0.015 285);">Store earnings history — last 12 months</p>
          </div>
          <div class="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[oklch(0.51_0.22_291/0.08)] text-[oklch(0.51_0.22_291)]">
            <TrendingUp :size="13" />
            Active
          </div>
        </div>

        <div class="overflow-x-auto">
          <svg :viewBox="`0 0 ${LINE_WIDTH} ${LINE_HEIGHT}`" class="w-full" style="min-width: 400px; height: 200px;">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="oklch(0.51 0.22 291)" stop-opacity="0.15" />
                <stop offset="100%" stop-color="oklch(0.51 0.22 291)" stop-opacity="0.01" />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <line v-for="n in 4" :key="n"
              :x1="PADDING.left" :y1="PADDING.top + ((n - 1) / 3) * (LINE_HEIGHT - PADDING.top - PADDING.bottom)"
              :x2="LINE_WIDTH - PADDING.right" :y2="PADDING.top + ((n - 1) / 3) * (LINE_HEIGHT - PADDING.top - PADDING.bottom)"
              stroke="oklch(0.88 0.008 85)" stroke-width="1" />

            <!-- Area fill -->
            <path :d="areaPath" fill="url(#areaGrad)" :class="lineDrawn ? 'area-visible' : 'area-hidden'" />

            <!-- Line drawing path -->
            <path
              ref="linePathEl"
              :d="linePath"
              fill="none"
              stroke="oklch(0.51 0.22 291)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              :style="linePathLength > 0 ? {
                strokeDasharray: linePathLength,
                strokeDashoffset: lineDrawn ? 0 : linePathLength,
                transition: 'stroke-dashoffset 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
              } : {}"
            />

            <!-- Data point dots -->
            <circle
              v-for="(p, i) in revenuePoints"
              :key="p.label"
              :cx="p.x" :cy="p.y" r="4"
              fill="oklch(0.51 0.22 291)"
              stroke="#fff" stroke-width="2"
              class="data-dot"
              :style="{ animationDelay: `${400 + i * 60}ms` }"
            />

            <!-- X-axis labels -->
            <text
              v-for="p in revenuePoints"
              :key="`label-${p.label}`"
              :x="p.x" :y="LINE_HEIGHT - 4"
              text-anchor="middle"
              font-size="10"
              fill="oklch(0.65 0.015 285)"
            >{{ p.label }}</text>
          </svg>
        </div>
      </div>

      <!-- Bottom Columns: Recent Orders + Top Products -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="rounded-2xl border p-6 bg-white" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Recent Orders</h2>
            <RouterLink to="/seller/orders" class="text-xs font-semibold flex items-center gap-1 hover:underline text-[oklch(0.51_0.22_291)]">
              View All <ArrowUpRight :size="13" />
            </RouterLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-xs uppercase tracking-wide border-b" style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">
                  <th class="py-2.5">Order</th>
                  <th class="py-2.5">Date</th>
                  <th class="py-2.5">Total</th>
                  <th class="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[oklch(0.93_0.004_85)]">
                <tr v-for="order in recentOrders" :key="order.id" style="color: oklch(0.14 0.02 280);">
                  <td class="py-3 font-semibold">{{ order.orderNumber }}</td>
                  <td class="py-3" style="color: oklch(0.52 0.015 285);">{{ formatDate(order.createdAt) }}</td>
                  <td class="py-3 font-medium">{{ formatCurrency(order.total) }}</td>
                  <td class="py-3">
                    <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                      :style="{ background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.text }">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="rounded-2xl border p-6 bg-white" style="border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Top Performing Items</h2>
            <RouterLink to="/seller/products" class="text-xs font-semibold flex items-center gap-1 hover:underline text-[oklch(0.51_0.22_291)]">
              Manage Catalog <ArrowUpRight :size="13" />
            </RouterLink>
          </div>

          <div class="space-y-4">
            <div v-for="prod in topProducts" :key="prod.id" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0" style="border-color: oklch(0.88 0.008 85);">
                <img :src="prod.thumbnail" :alt="prod.name" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ prod.name }}</p>
                <p class="text-xs" style="color: oklch(0.52 0.015 285);">{{ prod.totalSold }} sold · {{ prod.stock }} left in stock</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(prod.price) }}</p>
                <p class="text-xs font-medium text-[oklch(0.40_0.14_145)]">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stat-card {
  animation: statFadeUp 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes statFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.area-hidden { opacity: 0; }
.area-visible {
  opacity: 1;
  transition: opacity 600ms ease 1000ms;
}

.data-dot {
  animation: dotPop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes dotPop {
  from { r: 0; opacity: 0; }
  to   { r: 4; opacity: 1; }
}
</style>
