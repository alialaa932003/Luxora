<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import ProductGrid from '@/components/common/product/ProductGrid.vue'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import { useWishlistStore } from '@/stores/wishlist.store'
import type { Product } from '@/types/product.types'

const wishlistStore = useWishlistStore()

const displayProducts = computed<Product[]>(() => {
  return wishlistStore.items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    price: item.product.price,
    stock: item.product.stock,
    thumbnail: {
      url: item.product.thumbnail,
      publicId: '',
    },
    description: '',
    currency: 'USD',
    images: [
      {
        url: item.product.thumbnail,
        alt: item.product.name,
        order: 0,
      },
    ],
    category: {
      id: '',
      name: 'Uncategorized',
      slug: '',
    },
    vendor: {
      id: '',
      storeName: 'Unknown Vendor',
      storeSlug: '',
    },
    rating: {
      average: 0,
      count: 0,
    },
    isFeatured: false,
    createdAt: item.addedAt,
  }))
})

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

    <ProductGrid
      v-else
      :products="displayProducts"
      :loading="wishlistStore.loading"
      empty-title="No products in wishlist"
      empty-description="Your wishlist is empty"
    />
  </div>
</template>
