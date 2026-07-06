<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Store,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  ExternalLink,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const navItems = [
  { label: 'Overview', to: '/admin/overview', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Vendors', to: '/admin/vendors', icon: Store },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'AD'
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex" style="background: #FAF7F1;">
    <!-- Mobile overlay -->
    <Transition name="fade-overlay">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 lg:hidden"
        style="background: oklch(0 0 0 / 0.4);"
        @click="closeSidebar"
      />
    </Transition>

    <!-- ─── Sidebar ──────────────────────────────────────────────────── -->
    <aside
      class="fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      style="
        width: 260px;
        background: #fff;
        border-right: 1px solid oklch(0.88 0.008 85);
      "
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5" style="border-bottom: 1px solid oklch(0.88 0.008 85);">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base"
          style="background: oklch(0.51 0.22 291);">
          L
        </div>
        <div>
          <p class="font-bold text-sm" style="color: oklch(0.14 0.02 280); letter-spacing: -0.02em;">Luxora</p>
          <p class="text-xs font-medium" style="color: oklch(0.52 0.015 285);">Admin Panel</p>
        </div>
        <button class="ml-auto lg:hidden p-1 rounded-lg" @click="closeSidebar"
          style="color: oklch(0.52 0.015 285);">
          <X :size="18" />
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :style="isActive(item.to)
            ? 'background: oklch(0.51 0.22 291 / 0.08); color: oklch(0.51 0.22 291); font-weight: 600;'
            : 'color: oklch(0.52 0.015 285);'"
          @click="closeSidebar"
        >
          <component
            :is="item.icon"
            :size="17"
            :style="isActive(item.to) ? 'color: oklch(0.51 0.22 291);' : 'color: oklch(0.65 0.015 285);'"
          />
          {{ item.label }}

          <!-- Active indicator dot -->
          <span
            v-if="isActive(item.to)"
            class="ml-auto w-1.5 h-1.5 rounded-full"
            style="background: oklch(0.51 0.22 291);"
          />
        </RouterLink>
      </nav>

      <!-- Divider -->
      <div style="border-top: 1px solid oklch(0.88 0.008 85);" class="px-3 py-3 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style="color: oklch(0.52 0.015 285);"
          target="_blank"
        >
          <ExternalLink :size="16" />
          View Storefront
        </RouterLink>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style="color: oklch(0.57 0.24 27);"
        >
          <LogOut :size="16" />
          Sign Out
        </button>
      </div>

      <!-- User card -->
      <div class="px-4 py-4" style="border-top: 1px solid oklch(0.88 0.008 85);">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="authStore.user.firstName" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-white text-xs font-bold"
              style="background: oklch(0.51 0.22 291);">
              {{ getInitials(`${authStore.user?.firstName ?? 'A'} ${authStore.user?.lastName ?? 'D'}`) }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">
              {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
            </p>
            <p class="text-xs truncate" style="color: oklch(0.52 0.015 285);">Administrator</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ─── Main Content ────────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-h-screen lg:pl-[260px]">
      <!-- Top Bar -->
      <header class="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style="background: rgba(250,247,241,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid oklch(0.88 0.008 85);">
        <!-- Mobile hamburger -->
        <button
          class="lg:hidden p-2 rounded-xl transition-colors"
          style="color: oklch(0.52 0.015 285);"
          @click="sidebarOpen = true"
        >
          <Menu :size="20" />
        </button>

        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm">
          <span style="color: oklch(0.52 0.015 285);">Admin</span>
          <ChevronRight :size="14" style="color: oklch(0.70 0.015 285);" />
          <span class="font-semibold" style="color: oklch(0.14 0.02 280);">
            {{ navItems.find(n => isActive(n.to))?.label ?? 'Dashboard' }}
          </span>
        </div>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Actions -->
        <button class="p-2 rounded-xl transition-colors hover:bg-white relative" style="color: oklch(0.52 0.015 285);">
          <Bell :size="18" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style="background: oklch(0.51 0.22 291);" />
        </button>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 200ms ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* Force sidebar to be correctly positioned on large screens */
@media (min-width: 1024px) {
  aside {
    transform: translateX(0) !important;
  }
}
</style>
