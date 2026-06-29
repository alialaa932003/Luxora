<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Store } from 'lucide-vue-next'
import RatingComponent from '@/components/common/feedback/RatingComponent.vue'
import { useCartStore } from '@/stores/cart.store'
import { useToast } from '@/composables/useToast'
import type { Product } from '@/types/product.types'
import PriceComponent from '../commerce/PriceComponent.vue'
import WishlistButton from '../commerce/WishlistButton.vue'

const props = defineProps<{
  product: Product
  orientation?: 'vertical' | 'horizontal'
}>()

const cartStore = useCartStore()
const { toast } = useToast()
const adding = ref(false)
const imageLoaded = ref(false)

const isOutOfStock = computed(() => props.product.stock === 0)
const hasDiscount = computed(() => props.product.originalPrice && props.product.originalPrice > props.product.price)

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
    class="group bg-white rounded-[1.75rem] overflow-hidden card-elevated card-hover border border-border/40 flex flex-col h-full"
    :class="orientation === 'horizontal' ? 'sm:flex-row' : 'flex-col'"
  >
    <!-- Image Area -->
    <div
      class="relative overflow-hidden bg-muted/20"
      :class="orientation === 'horizontal' ? 'sm:w-48 flex-shrink-0 aspect-square sm:aspect-auto' : 'aspect-square'"
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

      <!-- Badges Floating Top-Left -->
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
        <span
          v-if="hasDiscount"
          class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-500 text-white shadow-sm"
        >
          Sale
        </span>
        <span
          v-if="product.isFeatured"
          class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-primary text-white shadow-sm"
        >
          Featured
        </span>
        <span
          v-if="isOutOfStock"
          class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-foreground/80 text-background shadow-sm"
        >
          Out of Stock
        </span>
      </div>

      <!-- Wishlist Button Floating Top-Right -->
      <div class="absolute top-3 right-3 z-10">
        <WishlistButton :productId="product.id" size="sm" />
      </div>
    </div>

    <!-- Info Area -->
    <div class="flex flex-col p-5 flex-1 justify-between gap-4">
      <div class="flex flex-col gap-2">
        <!-- Category -->
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
          {{ product.category.name }}
        </span>

        <!-- Title & Price (Aligned horizontally) -->
        <div class="flex justify-between items-start gap-4">
          <RouterLink
            :to="`/products/${product.slug}`"
            class="font-bold text-foreground text-sm sm:text-base leading-snug line-clamp-2 hover:text-primary transition-colors duration-150 animate-pulse-once"
          >
            {{ product.name }}
          </RouterLink>
          
          <div class="flex flex-col items-end flex-shrink-0">
            <!-- Price Component -->
            <PriceComponent :amount="product.price" :currency="product.currency" class="text-sm sm:text-base font-extrabold text-foreground" />
            <!-- Slashed Original Price -->
            <span
              v-if="hasDiscount"
              class="text-xs text-muted-foreground line-through mt-0.5"
            >
              ${{ product.originalPrice }}
            </span>
          </div>
        </div>

        <!-- Rating (if exists) -->
        <div v-if="product.rating.count > 0" class="flex items-center gap-1.5 mt-1">
          <RatingComponent
            :average="product.rating.average"
            :count="product.rating.count"
            size="sm"
            showCount
          />
        </div>
      </div>

      <!-- Seller Details Footer Row -->
      <div class="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
        <div class="flex items-center gap-2">
          <!-- Seller Icon -->
          <div class="w-5.5 h-5.5 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <Store :size="10" class="text-primary" />
          </div>
          <span class="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer leading-none">
            {{ product.vendor.storeName }}
          </span>
        </div>
        <button
          @click="addToCart"
          :disabled="isOutOfStock || adding"
          class="px-3.5 py-1.5 text-[10px] font-extrabold rounded-full bg-primary text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          {{ adding ? '...' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>
