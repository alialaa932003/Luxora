<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import { useWishlistStore } from '@/stores/wishlist.store'

const wishlistStore = useWishlistStore()

onMounted(() => {
  document.title = 'Wishlist - Luxora'
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
        <Heart :size="22" />
        Wishlist
        <span class="text-lg font-normal text-muted-foreground">({{ wishlistStore.itemCount }})</span>
      </h1>
      <p class="text-muted-foreground text-sm mt-1">Your saved items</p>
    </div>

    <EmptyState
      v-if="!wishlistStore.itemCount"
      title="Your wishlist is empty"
      description="Save items you love to come back to them later."
      action-label="Browse Products"
      action-to="/products"
    />

    <p v-else class="text-muted-foreground text-sm">
      Wishlist products would display here when connected to a live backend.
    </p>
  </div>
</template>
