<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { TrendingUp, ShoppingBag, Users, Package, Store } from 'lucide-vue-next'
import { adminService } from '@/services/api/admin.service'
import type { RevenueChartPoint, ChartDataPoint, DashboardStats } from '@/types/admin.types'

const loading = ref(true)
const stats = ref<DashboardStats | null>(null)
const revenueData = ref<RevenueChartPoint[]>([])
const categoryData = ref<ChartDataPoint[]>([])
const statusData = ref<ChartDataPoint[]>([])

// SVG/Animation states referenced in the template
const linePathEl = ref<SVGPathElement | null>(null)
const linePathLength = ref(0)
const lineDrawn = ref(false)
const donutVisible = ref(false)
const chartsVisible = ref(false)

onMounted(async () => {
  try {
    const [s, r, c, os] = await Promise.all([
      adminService.getStats(),
      adminService.getRevenueChart(),
      adminService.getCategoryChart(),
      adminService.getOrderStatusChart(),
    ])
    stats.value = s
    revenueData.value = r
    categoryData.value = c
    statusData.value = os
  } finally {
    loading.value = false
  }

  // Once loading is false and DOM is rendered, measure path and trigger animations
  await nextTick()
  if (linePathEl.value) {
    linePathLength.value = linePathEl.value.getTotalLength()
  }
  
  // Use a small timeout so the transition executes smoothly
  setTimeout(() => {
    lineDrawn.value = true
    donutVisible.value = true
    chartsVisible.value = true
  }, 100)
})

// ─── Revenue line chart ───────────────────────────────────────────────────────
const LINE_WIDTH = 600
const LINE_HEIGHT = 180
const PADDING = { top: 20, right: 20, bottom: 30, left: 50 }

const revenuePoints = computed(() => {
  if (!revenueData.value.length) return []
  const maxVal = Math.max(...revenueData.value.map(d => d.revenue))
  const minVal = Math.min(...revenueData.value.map(d => d.revenue))
  const range = maxVal - minVal || 1
  const w = LINE_WIDTH - PADDING.left - PADDING.right
  const h = LINE_HEIGHT - PADDING.top - PADDING.bottom

  return revenueData.value.map((d, i) => ({
    x: PADDING.left + (i / (revenueData.value.length - 1)) * w,
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

// ─── Donut chart for order statuses ──────────────────────────────────────────
const DONUT_SIZE = 140
const DONUT_CX = DONUT_SIZE / 2
const DONUT_CY = DONUT_SIZE / 2
const DONUT_R = 50
const STROKE_W = 28

const DONUT_COLORS = [
  'oklch(0.75 0.14 85)',
  'oklch(0.51 0.22 291)',
  'oklch(0.72 0.08 160)',
  'oklch(0.65 0.15 145)',
  'oklch(0.57 0.24 27)',
]

const circumference = computed(() => 2 * Math.PI * DONUT_R)

const donutSlices = computed(() => {
  const total = statusData.value.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0
  return statusData.value.map((d, i) => {
    const pct = d.value / total
    const dash = pct * circumference.value
    const slice = { offset, dash, label: d.label, value: d.value, color: DONUT_COLORS[i % DONUT_COLORS.length] }
    offset += dash
    return slice
  })
})

// ─── Bar chart for categories ─────────────────────────────────────────────────
const catMax = computed(() => Math.max(...categoryData.value.map(d => d.value), 1))

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Analytics</h1>
      <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">Platform performance at a glance</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="w-10 h-10 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
    </div>

    <template v-else>
      <!-- Summary stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(card, idx) in [
            { icon: TrendingUp, label: 'Revenue', value: '$128.4k', growth: stats?.revenueGrowth, bg: 'oklch(0.51 0.22 291 / 0.10)', color: 'oklch(0.51 0.22 291)' },
            { icon: ShoppingBag, label: 'Orders', value: stats?.totalOrders, growth: stats?.ordersGrowth, bg: 'oklch(0.85 0.12 50 / 0.15)', color: 'oklch(0.65 0.16 50)' },
            { icon: Users, label: 'Users', value: stats?.totalUsers, growth: stats?.usersGrowth, bg: 'oklch(0.72 0.08 160 / 0.15)', color: 'oklch(0.42 0.12 160)' },
            { icon: Package, label: 'Products', value: stats?.totalProducts, growth: stats?.productsGrowth, bg: 'oklch(0.78 0.12 85 / 0.15)', color: 'oklch(0.58 0.14 85)' },
          ]"
          :key="card.label"
          class="rounded-2xl border p-5 stat-card"
          style="background: #fff; border-color: oklch(0.88 0.008 85);"
          :style="{ animationDelay: `${idx * 80}ms` }"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: card.bg }">
              <component :is="card.icon" :size="16" :style="{ color: card.color }" />
            </div>
            <p class="text-sm font-medium" style="color: oklch(0.52 0.015 285);">{{ card.label }}</p>
          </div>
          <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ card.value }}</p>
          <p class="text-xs mt-1" style="color: oklch(0.65 0.015 285);">↑ {{ card.growth }}% vs last period</p>
        </div>
      </div>

      <!-- Revenue Line Chart -->
      <div class="rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
        <div class="mb-5">
          <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Revenue Trend</h2>
          <p class="text-xs mt-0.5" style="color: oklch(0.52 0.015 285);">Monthly revenue — last 12 months</p>
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

            <!-- Area fill (fades in after line draws) -->
            <path
              :d="areaPath"
              fill="url(#areaGrad)"
              :class="lineDrawn ? 'area-visible' : 'area-hidden'"
            />

            <!-- Line (draws itself) -->
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

            <!-- Data points (pop in with delay) -->
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
              v-for="(p, i) in revenuePoints"
              :key="`label-${p.label}`"
              :x="p.x" :y="LINE_HEIGHT - 4"
              text-anchor="middle"
              font-size="10"
              fill="oklch(0.65 0.015 285)"
            >{{ p.label }}</text>
          </svg>
        </div>
      </div>

      <!-- Donut + Category Bar Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Orders by Status Donut -->
        <div class="rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <h2 class="font-bold mb-5" style="color: oklch(0.14 0.02 280);">Orders by Status</h2>
          <div class="flex items-center gap-8">
            <!-- SVG Donut -->
            <div class="flex-shrink-0">
              <svg :viewBox="`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`" style="width: 140px; height: 140px;">
                <!-- Background track -->
                <circle :cx="DONUT_CX" :cy="DONUT_CY" :r="DONUT_R"
                  fill="none" stroke="oklch(0.92 0.005 85)" :stroke-width="STROKE_W" />
                <!-- Colored segments (spin in one-by-one) -->
                <circle
                  v-for="(slice, i) in donutSlices"
                  :key="i"
                  :cx="DONUT_CX" :cy="DONUT_CY" :r="DONUT_R"
                  fill="none"
                  :stroke="slice.color"
                  :stroke-width="STROKE_W"
                  :stroke-dasharray="`${slice.dash} ${circumference - slice.dash}`"
                  :stroke-dashoffset="donutVisible ? -slice.offset : circumference"
                  style="transform: rotate(-90deg); transform-origin: 50% 50%;"
                  :style="{ transition: `stroke-dashoffset 700ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 120}ms` }"
                />
                <!-- Center text -->
                <text :x="DONUT_CX" :y="DONUT_CY - 4" text-anchor="middle" font-size="18" font-weight="700" fill="oklch(0.14 0.02 280)">
                  {{ statusData.reduce((s, d) => s + d.value, 0) }}
                </text>
                <text :x="DONUT_CX" :y="DONUT_CY + 14" text-anchor="middle" font-size="9" fill="oklch(0.52 0.015 285)">orders</text>
              </svg>
            </div>
            <!-- Legend -->
            <div class="space-y-2.5 flex-1">
              <div v-for="(slice, i) in donutSlices" :key="slice.label" class="flex items-center gap-2.5">
                <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ background: slice.color }" />
                <p class="text-sm flex-1 capitalize" style="color: oklch(0.52 0.015 285);">{{ slice.label }}</p>
                <p class="text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ slice.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Products Bar Chart -->
        <div class="rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <h2 class="font-bold mb-5" style="color: oklch(0.14 0.02 280);">Products by Category</h2>
          <div class="space-y-3">
            <div
              v-for="(cat, idx) in categoryData"
              :key="cat.label"
              class="space-y-1 cat-row"
              :style="{ animationDelay: `${idx * 60}ms` }"
            >
              <div class="flex items-center justify-between">
                <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">{{ cat.label }}</p>
                <p class="text-xs font-semibold" style="color: oklch(0.14 0.02 280);">{{ cat.value }}</p>
              </div>
              <div class="h-2 rounded-full overflow-hidden" style="background: oklch(0.92 0.005 85);">
                <div
                  class="h-full rounded-full"
                  style="background: oklch(0.51 0.22 291); transition: width 700ms cubic-bezier(0.22, 1, 0.36, 1);"
                  :style="{ width: chartsVisible ? `${(cat.value / catMax) * 100}%` : '0%',
                            transitionDelay: `${idx * 60}ms` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vendor stats -->
      <div class="rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
        <h2 class="font-bold mb-5" style="color: oklch(0.14 0.02 280);">Vendor Health</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="text-center p-4 rounded-xl" style="background: oklch(0.65 0.15 145 / 0.08);">
            <p class="text-3xl font-bold mb-1" style="color: oklch(0.40 0.14 145);">
              {{ stats?.totalVendors ? Math.round((stats.totalVendors - stats.pendingVendors) / stats.totalVendors * 100) : 0 }}%
            </p>
            <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">Approval Rate</p>
          </div>
          <div class="text-center p-4 rounded-xl" style="background: oklch(0.51 0.22 291 / 0.08);">
            <p class="text-3xl font-bold mb-1" style="color: oklch(0.51 0.22 291);">{{ stats?.totalVendors }}</p>
            <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">Total Vendors</p>
          </div>
          <div class="text-center p-4 rounded-xl" style="background: oklch(0.75 0.14 85 / 0.10);">
            <p class="text-3xl font-bold mb-1" style="color: oklch(0.50 0.14 85);">{{ stats?.pendingVendors }}</p>
            <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">Pending Review</p>
          </div>
          <div class="text-center p-4 rounded-xl" style="background: oklch(0.85 0.12 50 / 0.12);">
            <p class="text-3xl font-bold mb-1" style="color: oklch(0.55 0.16 50);">
              {{ stats?.totalProducts }}</p>
            <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">Active Listings</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Stat cards entrance ────────────────────────────────────── */
.stat-card {
  animation: statFadeUp 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes statFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Line chart area fade ────────────────────────────────── */
.area-hidden { opacity: 0; }
.area-visible {
  opacity: 1;
  transition: opacity 600ms ease 1000ms;
}

/* ── Data point dots pop in ──────────────────────────────── */
.data-dot {
  animation: dotPop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes dotPop {
  from { r: 0; opacity: 0; }
  to   { r: 4; opacity: 1; }
}

/* ── Category bar rows fade in ────────────────────────────── */
.cat-row {
  animation: catFade 350ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes catFade {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
