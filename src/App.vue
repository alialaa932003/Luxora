<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import CartSheet from '@/components/common/commerce/CartSheet.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.allSettled([
      authStore.fetchMe(),
      cartStore.fetchCart(),
      wishlistStore.fetchWishlist(),
    ])
  } else {
    await cartStore.fetchCart()
  }
})
</script>

<template>
  <RouterView />
  <CartSheet />
  <Toaster position="top-right" :expand="true" rich-colors />
</template>
