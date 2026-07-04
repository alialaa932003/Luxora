<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingBag, ArrowRight, X } from '@lucide/vue'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import CartItem from '@/components/common/commerce/CartItem.vue'
import CartSummary from '@/components/common/commerce/CartSummary.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import { useUiStore } from '@/stores/ui.store'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const uiStore = useUiStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

function goToCheckout() {
  uiStore.closeCartSheet()
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/checkout' } })
  } else {
    router.push({ name: 'checkout' })
  }
}
</script>

<template>
  <Sheet :open="uiStore.cartSheetOpen" @update:open="(v) => !v && uiStore.closeCartSheet()">
    <SheetContent side="right" :show-close-button="false" class="w-full sm:w-110 p-0 flex flex-col">
      <SheetHeader class="px-6 py-5 border-b border-border/60" >
        <div class="flex items-center justify-between">
          <SheetTitle class="flex items-center gap-2.5 text-lg font-bold">
            <div class="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <ShoppingBag :size="16" class="text-white" />
            </div>
            Cart
            <span v-if="cartStore.itemCount > 0" class="text-sm font-medium text-muted-foreground">({{ cartStore.itemCount }})</span>
          </SheetTitle>
          <button
            @click="uiStore.closeCartSheet"
            class="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X :size="18" />
          </button>
        </div>
        <SheetDescription class="sr-only">Your shopping cart</SheetDescription>
      </SheetHeader>

      <template v-if="cartStore.items.length === 0">
        <div class="flex-1 flex items-center justify-center">
          <EmptyState
            title="Your cart is empty"
            description="Discover products and add them to your cart."
            icon="shopping-bag"
            action-label="Start Shopping"
            :on-action="() => { uiStore.closeCartSheet(); router.push('/products') }"
          />
        </div>
      </template>

      <template v-else>
        <ScrollArea class="flex-1 px-6 min-h-0">
          <div class="py-2">
            <CartItem
              v-for="item in cartStore.items"
              :key="item.id"
              :item="item"
            />
          </div>
        </ScrollArea>

        <div class="px-6 pb-6 pt-4 border-t border-border/60 space-y-4">
          <CartSummary>
            <template #actions>
              <div class="flex flex-col gap-2 pt-2">
                <button
                  @click="goToCheckout"
                  class="w-full flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl gradient-primary text-white shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Proceed to checkout <ArrowRight :size="16" />
                </button>
                <RouterLink
                  to="/cart"
                  @click="uiStore.closeCartSheet"
                  class="w-full text-center py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View full cart
                </RouterLink>
              </div>
            </template>
          </CartSummary>
        </div>
      </template>
    </SheetContent>
  </Sheet>
</template>
