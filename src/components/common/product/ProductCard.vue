<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, Eye } from '@lucide/vue'
import PriceComponent from './PriceComponent.vue'
import WishlistButton from './WishlistButton.vue'
import RatingComponent from '@/components/common/feedback/RatingComponent.vue'
import { useCartStore } from '@/stores/cart.store'
import { useToast } from '@/composables/useToast'
import type { Product } from '@/types/product.types'

const props = defineProps<{
  product: Product
  orientation?: 'vertical' | 'horizontal'
}>()

const cartStore = useCartStore()
const { toast } = useToast()
const adding = ref(false)
const imageLoaded = ref(false)

const isOutOfStock = computed(() => props.product.stock === 0)

async function addToCart() {
  if (isOutOfStock.value || adding.value) return
  adding.value = true
  try {
    await cartStore.addItem({ productId: props.product.id, quantity: 1 })
    toast({ title: 'Added to cart', description: props.product.name })
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div
    class="group relative bg-card rounded-2xl overflow-hidden card-elevated card-hover border border-border/50 flex"
    :class="orientation === 'horizontal' ? 'flex-row' : 'flex-col'"
  >
    <!-- Image Area -->
    <div
      class="relative overflow-hidden bg-muted/30"
      :class="orientation === 'horizontal' ? 'w-36 flex-shrink-0' : 'aspect-square'"
    >
      <RouterLink :to="`/products/${product.slug}`" class="block w-full h-full">
        <img
          :src="product.thumbnail"
          :alt="product.name"
          loading="lazy"
          @load="imageLoaded = true"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          :class="{ 'opacity-0': !imageLoaded }"
        />
        <!-- Skeleton placeholder -->
        <div
          v-if="!imageLoaded"
          class="absolute inset-0 bg-muted animate-pulse"
        />
      </RouterLink>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <span v-if="product.isFeatured" class="px-2 py-0.5 rounded-full text-xs font-semibold gradient-primary text-white shadow-sm">
          Featured
        </span>
        <span v-if="isOutOfStock" class="px-2 py-0.5 rounded-full text-xs font-semibold bg-foreground/80 text-background shadow-sm">
          Sold Out
        </span>
      </div>

      <!-- Wishlist Button -->
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <WishlistButton :productId="product.id" size="sm" />
      </div>

      <!-- Quick Actions -->
      <div
        v-if="orientation !== 'horizontal'"
        class="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
      >
        <button
          @click="addToCart"
          :disabled="isOutOfStock || adding"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl gradient-primary text-white shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
        >
          <ShoppingCart :size="15" />
          {{ adding ? 'Adding…' : isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
        </button>
        <RouterLink
          :to="`/products/${product.slug}`"
          class="p-2.5 rounded-xl bg-white/90 hover:bg-white text-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5"
          aria-label="View product"
        >
          <Eye :size="15" />
        </RouterLink>
      </div>
    </div>

    <!-- Info Area -->
    <div class="flex flex-col gap-2 p-4 flex-1 min-w-0">
      <!-- Category -->
      <span class="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
        {{ product.category.name }}
      </span>

      <!-- Title -->
      <RouterLink
        :to="`/products/${product.slug}`"
        class="font-semibold text-foreground text-sm leading-snug line-clamp-2 hover:text-primary transition-colors duration-200"
      >
        {{ product.name }}
      </RouterLink>

      <!-- Rating -->
      <RatingComponent
        v-if="product.rating.count > 0"
        :average="product.rating.average"
        :count="product.rating.count"
        size="sm"
        showCount
      />

      <!-- Price -->
      <PriceComponent :amount="product.price" :currency="product.currency" class="mt-auto pt-1" />

      <!-- Horizontal add to cart -->
      <button
        v-if="orientation === 'horizontal'"
        @click="addToCart"
        :disabled="isOutOfStock || adding"
        class="mt-2 py-2 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {{ adding ? 'Adding…' : isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>
