<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, Store, ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { adminService } from '@/services/api/admin.service'
import type { DashboardStats, RevenueChartPoint, RecentOrder, TopProduct, RecentUser } from '@/types/admin.types'

// ─── State ────────────────────────────────────────────────────────────────────
const loading = ref(true)
const stats = ref<DashboardStats | null>(null)
const revenueChart = ref<RevenueChartPoint[]>([])
const recentOrders = ref<RecentOrder[]>([])
const topProducts = ref<TopProduct[]>([])
const recentUsers = ref<RecentUser[]>([])

onMounted(async () => {
  try {
    const [s, rc, ro, tp, ru] = await Promise.all([
      adminService.getStats(),
      adminService.getRevenueChart(),
      adminService.getRecentOrders(),
      adminService.getTopProducts(),
      adminService.getRecentUsers(),
    ])
    stats.value = s
    revenueChart.value = rc
    recentOrders.value = ro
    topProducts.value = tp
    recentUsers.value = ru
  } finally {
    loading.value = false
  }
})

// ─── KPI cards config ─────────────────────────────────────────────────────────
const kpiCards = computed(() => {
  if (!stats.value) return []
  return [
    {
      label: 'Total Revenue',
      value: `$${stats.value.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: stats.value.revenueGrowth,
      icon: DollarSign,
      iconBg: 'oklch(0.51 0.22 291 / 0.10)',
      iconColor: 'oklch(0.51 0.22 291)',
    },
    {
      label: 'Total Orders',
      value: stats.value.totalOrders.toLocaleString(),
      growth: stats.value.ordersGrowth,
      icon: ShoppingBag,
      iconBg: 'oklch(0.85 0.12 50 / 0.15)',
      iconColor: 'oklch(0.65 0.16 50)',
    },
    {
      label: 'Active Users',
      value: stats.value.totalUsers.toLocaleString(),
      growth: stats.value.usersGrowth,
      icon: Users,
      iconBg: 'oklch(0.72 0.08 160 / 0.15)',
      iconColor: 'oklch(0.52 0.12 160)',
    },
    {
      label: 'Products Listed',
      value: stats.value.totalProducts.toLocaleString(),
      growth: stats.value.productsGrowth,
      icon: Package,
      iconBg: 'oklch(0.78 0.12 85 / 0.15)',
      iconColor: 'oklch(0.58 0.14 85)',
    },
  ]
})

// ─── Revenue bar chart ────────────────────────────────────────────────────────
const chartMax = computed(() => Math.max(...revenueChart.value.map(d => d.revenue), 1))
const chartHeight = 160

function barHeight(value: number) {
  return Math.max(4, (value / chartMax.value) * chartHeight)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
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

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:    { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
  seller:   { bg: 'oklch(0.85 0.12 50 / 0.15)', text: 'oklch(0.55 0.16 50)' },
  customer: { bg: 'oklch(0.88 0.008 85)', text: 'oklch(0.52 0.015 285)' },
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Overview</h1>
      <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Welcome back — here's what's happening with your platform today.</p>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="rounded-2xl border p-6 animate-pulse" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <div class="h-4 w-24 rounded-lg mb-4" style="background: oklch(0.92 0.005 85);" />
          <div class="h-8 w-32 rounded-lg" style="background: oklch(0.92 0.005 85);" />
        </div>
      </div>
    </template>

    <template v-else>
      <!-- ─── KPI Cards ─────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          v-for="(card, i) in kpiCards"
          :key="card.label"
          class="rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 kpi-card"
          style="background: #fff; border-color: oklch(0.88 0.008 85);"
          :style="{ animationDelay: `${i * 80}ms` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ background: card.iconBg }">
              <component :is="card.icon" :size="18" :style="{ color: card.iconColor }" />
            </div>
            <!-- Growth badge -->
            <div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              :style="card.growth >= 0
                ? 'background: oklch(0.65 0.15 145 / 0.10); color: oklch(0.40 0.14 145);'
                : 'background: oklch(0.57 0.24 27 / 0.10); color: oklch(0.57 0.24 27);'"
            >
              <TrendingUp v-if="card.growth >= 0" :size="11" />
              <TrendingDown v-else :size="11" />
              {{ Math.abs(card.growth) }}%
            </div>
          </div>
          <p class="text-sm font-medium mb-1" style="color: oklch(0.52 0.015 285);">{{ card.label }}</p>
          <p class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">{{ card.value }}</p>
          <p class="text-xs mt-1" style="color: oklch(0.65 0.015 285);">vs. last period</p>
        </div>
      </div>

      <!-- ─── Revenue Chart + Vendor Alert ─────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <!-- Revenue Bar Chart -->
        <div class="xl:col-span-2 rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="font-bold text-base" style="color: oklch(0.14 0.02 280);">Revenue Overview</h2>
              <p class="text-xs mt-0.5" style="color: oklch(0.52 0.015 285);">Last 12 months</p>
            </div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full" style="background: oklch(0.51 0.22 291 / 0.08); color: oklch(0.51 0.22 291);">Monthly</span>
          </div>

          <!-- SVG Bar Chart -->
          <div class="relative" style="height: 200px;">
            <div class="flex items-end gap-1.5 h-full">
              <div
                v-for="(point, i) in revenueChart"
                :key="point.month"
                class="flex-1 flex flex-col items-center gap-1 group"
              >
                <!-- Bar -->
                <div class="relative w-full flex flex-col justify-end" style="height: 160px;">
                  <div
                    class="w-full rounded-t-lg relative overflow-hidden bar-grow"
                    :style="{
                      height: barHeight(point.revenue) + 'px',
                      background: i === revenueChart.length - 1
                        ? 'oklch(0.51 0.22 291)'
                        : 'oklch(0.51 0.22 291 / 0.25)',
                      animationDelay: `${i * 60}ms`,
                    }"
                  >
                    <!-- Shine sweep on hover -->
                    <div class="bar-shine" />
                    <!-- Tooltip on hover -->
                    <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                      style="min-width: 80px;">
                      <div class="rounded-lg px-2 py-1 text-center text-xs font-semibold whitespace-nowrap"
                        style="background: oklch(0.14 0.02 280); color: #fff;">
                        ${{ (point.revenue / 1000).toFixed(1) }}k
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Label -->
                <p class="text-xs font-medium" style="color: oklch(0.65 0.015 285);">{{ point.month }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vendor Pending Card + Quick Stats -->
        <div class="flex flex-col gap-4">
          <!-- Pending Vendors Alert -->
          <div class="rounded-2xl border p-6" style="background: #fff; border-color: oklch(0.88 0.008 85);">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                style="background: oklch(0.85 0.12 50 / 0.15);">
                <Store :size="18" style="color: oklch(0.65 0.16 50);" />
              </div>
              <div>
                <p class="font-bold text-sm" style="color: oklch(0.14 0.02 280);">Vendor Requests</p>
                <p class="text-xs" style="color: oklch(0.52 0.015 285);">Pending approval</p>
              </div>
            </div>
            <p class="text-4xl font-bold tracking-tight mb-1" style="color: oklch(0.14 0.02 280);">
              {{ stats?.pendingVendors }}
            </p>
            <p class="text-xs mb-4" style="color: oklch(0.52 0.015 285);">out of {{ stats?.totalVendors }} total vendors</p>
            <RouterLink to="/admin/vendors"
              class="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style="color: oklch(0.51 0.22 291);">
              Review vendors <ArrowRight :size="14" />
            </RouterLink>
          </div>

          <!-- Mini stat boxes -->
          <div class="rounded-2xl border p-5 flex items-center gap-4" style="background: #fff; border-color: oklch(0.88 0.008 85);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: oklch(0.51 0.22 291 / 0.08);">
              <Package :size="17" style="color: oklch(0.51 0.22 291);" />
            </div>
            <div class="flex-1">
              <p class="text-xs" style="color: oklch(0.52 0.015 285);">Total Products</p>
              <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ stats?.totalProducts }}</p>
            </div>
            <RouterLink to="/admin/products" class="text-xs font-semibold" style="color: oklch(0.51 0.22 291);">View →</RouterLink>
          </div>

          <div class="rounded-2xl border p-5 flex items-center gap-4" style="background: #fff; border-color: oklch(0.88 0.008 85);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: oklch(0.72 0.08 160 / 0.12);">
              <Users :size="17" style="color: oklch(0.42 0.12 160);" />
            </div>
            <div class="flex-1">
              <p class="text-xs" style="color: oklch(0.52 0.015 285);">Registered Users</p>
              <p class="text-xl font-bold" style="color: oklch(0.14 0.02 280);">{{ stats?.totalUsers }}</p>
            </div>
            <RouterLink to="/admin/users" class="text-xs font-semibold" style="color: oklch(0.51 0.22 291);">View →</RouterLink>
          </div>
        </div>
      </div>

      <!-- ─── Recent Orders ─────────────────────────────────────────── -->
      <div class="rounded-2xl border" style="background: #fff; border-color: oklch(0.88 0.008 85);">
        <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid oklch(0.88 0.008 85);">
          <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Recent Orders</h2>
          <RouterLink to="/admin/orders" class="text-sm font-semibold flex items-center gap-1" style="color: oklch(0.51 0.22 291);">
            View all <ArrowRight :size="14" />
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr style="border-bottom: 1px solid oklch(0.88 0.008 85);">
                <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Order</th>
                <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Customer</th>
                <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Amount</th>
                <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Status</th>
                <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="transition-colors hover:bg-muted/40"
                style="border-bottom: 1px solid oklch(0.92 0.004 85);"
              >
                <td class="px-6 py-4 text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ order.orderNumber }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img v-if="order.customerAvatar" :src="order.customerAvatar" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                        style="background: oklch(0.51 0.22 291);">
                        {{ getInitials(order.customerName) }}
                      </div>
                    </div>
                    <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ order.customerName }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold" style="color: oklch(0.14 0.02 280);">{{ formatCurrency(order.total) }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                    :style="{ background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.text }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm" style="color: oklch(0.52 0.015 285);">{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── Top Products + Recent Users ───────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Top Products -->
        <div class="rounded-2xl border" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid oklch(0.88 0.008 85);">
            <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Top Products</h2>
            <RouterLink to="/admin/products" class="text-sm font-semibold flex items-center gap-1" style="color: oklch(0.51 0.22 291);">
              View all <ArrowRight :size="14" />
            </RouterLink>
          </div>
          <div class="divide-y" style="--tw-divide-color: oklch(0.92 0.004 85);">
            <div v-for="(prod, idx) in topProducts" :key="prod.id"
              class="flex items-center gap-4 px-6 py-4">
              <span class="text-xs font-bold w-5 text-right flex-shrink-0" style="color: oklch(0.65 0.015 285);">{{ idx + 1 }}</span>
              <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border" style="border-color: oklch(0.88 0.008 85);">
                <img :src="prod.thumbnail" :alt="prod.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ prod.name }}</p>
                <p class="text-xs" style="color: oklch(0.52 0.015 285);">{{ prod.category }} · {{ prod.unitsSold }} sold</p>
              </div>
              <p class="text-sm font-bold flex-shrink-0" style="color: oklch(0.51 0.22 291);">{{ formatCurrency(prod.revenue) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="rounded-2xl border" style="background: #fff; border-color: oklch(0.88 0.008 85);">
          <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid oklch(0.88 0.008 85);">
            <h2 class="font-bold" style="color: oklch(0.14 0.02 280);">Recent Users</h2>
            <RouterLink to="/admin/users" class="text-sm font-semibold flex items-center gap-1" style="color: oklch(0.51 0.22 291);">
              View all <ArrowRight :size="14" />
            </RouterLink>
          </div>
          <div class="divide-y" style="--tw-divide-color: oklch(0.92 0.004 85);">
            <div v-for="user in recentUsers" :key="user.id"
              class="flex items-center gap-4 px-6 py-4">
              <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                  style="background: oklch(0.51 0.22 291);">
                  {{ getInitials(`${user.firstName} ${user.lastName}`) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ user.firstName }} {{ user.lastName }}</p>
                <p class="text-xs truncate" style="color: oklch(0.52 0.015 285);">{{ user.email }}</p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  :style="{ background: ROLE_COLORS[user.role]?.bg, color: ROLE_COLORS[user.role]?.text }">
                  {{ user.role }}
                </span>
                <span class="text-xs" style="color: oklch(0.65 0.015 285);">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── KPI cards: fade + slide up on mount ────────────────────── */
.kpi-card {
  animation: kpiFadeUp 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes kpiFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Bar chart: grow from bottom ────────────────────────────── */
.bar-grow {
  transform-origin: center bottom;
  animation: barGrowUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes barGrowUp {
  from { transform: scaleY(0); opacity: 0; }
  to   { transform: scaleY(1); opacity: 1; }
}

/* ── Bar shine sweep on hover ───────────────────────────────── */
.bar-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
  background-size: 200% 100%;
  background-position: 200% 0;
  transition: background-position 400ms ease;
}
.group:hover .bar-shine {
  background-position: -200% 0;
}
</style>
