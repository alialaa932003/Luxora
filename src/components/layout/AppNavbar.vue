<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ShoppingBag, Heart, Bell, Search, Menu, X, User } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'
import { useUiStore } from '@/stores/ui.store'
import { useNotificationsStore } from '@/stores/notifications.store'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const uiStore = useUiStore()
const notificationsStore = useNotificationsStore()
const router = useRouter()

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}

const navLinks = [
  { label: 'Shop', to: '/products' },
  { label: 'Categories', to: '/products' },
  { label: 'Brands', to: '/products' },
  { label: 'Sale', to: '/products?featured=true' },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'glass shadow-md' : 'bg-transparent'"
  >
    <nav class="container mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 mr-4 flex-shrink-0 group">
        <div class="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
          <span class="text-white font-bold text-sm">L</span>
        </div>
        <span class="font-bold text-xl tracking-tight text-foreground hidden sm:block">Lumina</span>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <div class="hidden lg:flex items-center gap-1 flex-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all duration-200"
          active-class="text-foreground bg-accent/50"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-1 ml-auto">
        <!-- Search -->
        <button
          @click="uiStore.openSearchOverlay"
          class="p-2.5 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          aria-label="Search"
        >
          <Search :size="20" class="group-hover:scale-110 transition-transform duration-200" />
        </button>

        <!-- Wishlist -->
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/account/wishlist"
          class="relative p-2.5 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          aria-label="Wishlist"
        >
          <Heart :size="20" class="group-hover:scale-110 transition-transform duration-200" />
          <span
            v-if="wishlistStore.itemCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ wishlistStore.itemCount > 9 ? '9+' : wishlistStore.itemCount }}
          </span>
        </RouterLink>

        <!-- Notifications -->
        <button
          v-if="authStore.isAuthenticated"
          @click="uiStore.toggleNotificationsSheet"
          class="relative p-2.5 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          aria-label="Notifications"
        >
          <Bell :size="20" class="group-hover:scale-110 transition-transform duration-200" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
          </span>
        </button>

        <!-- Cart -->
        <button
          @click="uiStore.openCartSheet"
          class="relative p-2.5 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          aria-label="Cart"
        >
          <ShoppingBag :size="20" class="group-hover:scale-110 transition-transform duration-200" />
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
          </span>
        </button>

        <!-- Auth -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/account/profile"
            class="ml-1 flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl hover:bg-accent/60 transition-all duration-200 group"
            aria-label="My account"
          >
            <div v-if="authStore.user?.avatar" class="w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <img :src="authStore.user.avatar" :alt="authStore.user.firstName" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-7 h-7 rounded-full gradient-primary flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <User :size="14" class="text-white" />
            </div>
            <span class="text-sm font-medium text-foreground hidden xl:block">
              {{ authStore.user?.firstName }}
            </span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="ml-1 px-4 py-2 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
          >
            Sign in
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="px-4 py-2 text-sm font-semibold rounded-xl gradient-primary text-white shadow-sm hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            Join
          </RouterLink>
        </template>

        <!-- Mobile Menu Toggle -->
        <button
          @click="uiStore.toggleMobileMenu"
          class="lg:hidden ml-1 p-2.5 rounded-xl hover:bg-accent/60 text-muted-foreground hover:text-foreground transition-all duration-200"
          :aria-label="uiStore.mobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <X v-if="uiStore.mobileMenuOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="uiStore.mobileMenuOpen" class="lg:hidden glass border-t border-border">
        <div class="container mx-auto px-4 py-4 flex flex-col gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            @click="uiStore.closeMobileMenu"
            class="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent/50 transition-all duration-200"
          >
            {{ link.label }}
          </RouterLink>
          <div class="pt-2 border-t border-border mt-2 flex flex-col gap-1">
            <RouterLink v-if="authStore.isAuthenticated" to="/account/profile" @click="uiStore.closeMobileMenu" class="px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-accent/50 transition-all">
              My Account
            </RouterLink>
            <button v-if="authStore.isAuthenticated" @click="handleLogout" class="px-4 py-3 text-sm font-medium text-left text-destructive rounded-xl hover:bg-destructive/10 transition-all">
              Sign Out
            </button>
            <RouterLink v-else to="/auth/login" @click="uiStore.closeMobileMenu" class="px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-accent/50 transition-all">
              Sign In
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Spacer for fixed navbar -->
  <div class="h-16" />
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
