<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import {
  ShoppingBag,
  Heart,
  Bell,
  Search,
  Menu,
  X,
  User,
  Sparkles,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useUiStore } from "@/stores/ui.store";
import { useNotificationsStore } from "@/stores/notifications.store";

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const uiStore = useUiStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();

const isScrolled = ref(false);
const searchQuery = ref("");

function handleScroll() {
  isScrolled.value = window.scrollY > 8;
}

onMounted(() =>
  window.addEventListener("scroll", handleScroll, { passive: true }),
);
onUnmounted(() => window.removeEventListener("scroll", handleScroll));

async function handleLogout() {
  await authStore.logout();
  router.push({ name: "home" });
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: "search", query: { q: searchQuery.value.trim() } });
  }
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Marketplace", to: "/products" },
  { label: "Categories", to: "/categories" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300 border-b border-border/40 bg-white backdrop-blur-md"
    :class="{ 'shadow-sm bg-white/50': isScrolled }"
  >
    <nav
      class="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-6 shrink-0">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div
            class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200"
          >
            <Sparkles :size="16" class="text-white" />
          </div>
          <span
            class="font-bold text-xl tracking-tight text-foreground hidden sm:block"
            >Luxora</span
          >
        </RouterLink>

        <div class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-150"
            active-class="text-foreground bg-muted/60 font-semibold"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

      <div class="hidden md:flex flex-1 max-w-md mx-4">
        <div class="relative w-full">
          <Search
            :size="16"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            v-model="searchQuery"
            @keydown.enter="handleSearch"
            type="text"
            placeholder="Search products, brands, categories..."
            class="w-full h-9 pl-9 pr-4 rounded-full border border-border/85 bg-muted/30 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="uiStore.openSearchOverlay"
          class="md:hidden p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Search"
        >
          <Search :size="18" />
        </button>

        <RouterLink
          to="/account/wishlist"
          class="relative p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Wishlist"
        >
          <Heart :size="18" />
          <span
            v-if="wishlistStore.itemCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center animate-bounce"
          >
            {{ wishlistStore.itemCount > 9 ? "9+" : wishlistStore.itemCount }}
          </span>
        </RouterLink>

        <button
          v-if="authStore.isAuthenticated"
          @click="uiStore.toggleNotificationsSheet"
          class="relative p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell :size="18" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{
              notificationsStore.unreadCount > 9
                ? "9+"
                : notificationsStore.unreadCount
            }}
          </span>
        </button>

        <button
          @click="uiStore.openCartSheet"
          class="relative p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Cart"
        >
          <ShoppingBag :size="18" />
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ cartStore.itemCount > 9 ? "9+" : cartStore.itemCount }}
          </span>
        </button>

        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/account/profile"
            class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted/80 transition-all duration-200 group"
          >
            <div
              v-if="authStore.user?.avatar"
              class="w-6.5 h-6.5 rounded-full overflow-hidden ring-1 ring-border"
            >
              <img
                :src="authStore.user.avatar"
                :alt="authStore.user.firstName"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-6.5 h-6.5 rounded-full bg-primary flex items-center justify-center"
            >
              <User :size="12" class="text-white" />
            </div>
            <span class="text-xs font-semibold text-foreground hidden xl:block">
              {{ authStore.user?.firstName }}
            </span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
          >
            <User :size="14" />
            <span>Sign in</span>
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="px-4 py-2 text-xs font-bold rounded-full bg-primary text-white hover:opacity-90 transition-all duration-150"
          >
            Join
          </RouterLink>
        </template>

        <button
          @click="uiStore.toggleMobileMenu"
          class="lg:hidden p-2 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          :aria-label="uiStore.mobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <X v-if="uiStore.mobileMenuOpen" :size="18" />
          <Menu v-else :size="18" />
        </button>
      </div>
    </nav>

    <Transition name="slide-down">
      <div
        v-if="uiStore.mobileMenuOpen"
        class="lg:hidden bg-white border-t border-border/60 shadow-md"
      >
        <div class="container mx-auto px-4 py-4 flex flex-col gap-1">
          <div class="relative w-full mb-3 flex md:hidden">
            <Search
              :size="15"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              v-model="searchQuery"
              @keydown.enter="
                handleSearch();
                uiStore.closeMobileMenu();
              "
              type="text"
              placeholder="Search products, brands, categories..."
              class="w-full h-9 pl-9 pr-4 rounded-full border border-border/85 bg-muted/40 text-sm focus:outline-none focus:border-primary/40 focus:bg-white"
            />
          </div>

          <RouterLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            @click="uiStore.closeMobileMenu"
            class="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all duration-150"
          >
            {{ link.label }}
          </RouterLink>
          <div class="pt-2 border-t border-border mt-2 flex flex-col gap-1">
            <RouterLink
              v-if="authStore.isAuthenticated"
              to="/account/profile"
              @click="uiStore.closeMobileMenu"
              class="px-4 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-muted/50 transition-all"
            >
              My Account
            </RouterLink>
            <button
              v-if="authStore.isAuthenticated"
              @click="
                handleLogout();
                uiStore.closeMobileMenu();
              "
              class="px-4 py-2.5 text-sm font-medium text-left text-destructive rounded-xl hover:bg-destructive/10 transition-all"
            >
              Sign Out
            </button>
            <RouterLink
              v-else
              to="/auth/login"
              @click="uiStore.closeMobileMenu"
              class="px-4 py-2.5 text-sm font-medium text-foreground rounded-xl hover:bg-muted/50 transition-all"
            >
              Sign In
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
