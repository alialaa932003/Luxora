<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingBag, ArrowRight } from 'lucide-vue-next'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartItem from '@/components/common/commerce/CartItem.vue'
import CartSummary from '@/components/common/commerce/CartSummary.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

function goToCheckout() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/checkout' } })
  } else {
    router.push({ name: 'checkout' })
  }
}

onMounted(() => {
  document.title = 'Your Cart - Luxora'
})

const items = computed(() => cartStore.items)
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <ShoppingBag :size="28" />
          Shopping Cart
          <span class="text-lg font-normal text-muted-foreground">({{ items.length }} items)</span>
        </h1>
      </div>

      <EmptyState
        v-if="!items.length"
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Start exploring our curated collection."
        action-label="Explore Products"
        action-to="/products"
      />

      <div v-else class="grid lg:grid-cols-3 gap-8 xl:gap-12">
        <div class="lg:col-span-2 space-y-4">
          <CartItem
            v-for="item in items"
            :key="item.id"
            :item="item"
          />
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CartSummary>
              <template #actions>
                <div class="mt-4">
                  <button
                    @click="goToCheckout"
                    class="w-full flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl gradient-primary text-white shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Proceed to checkout <ArrowRight :size="16" />
                  </button>
                </div>
              </template>
            </CartSummary>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
