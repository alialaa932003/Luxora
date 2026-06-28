<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Trash2 } from '@lucide/vue'
import QuantitySelector from './QuantitySelector.vue'
import PriceComponent from './PriceComponent.vue'
import { useCartStore } from '@/stores/cart.store'
import type { CartItem as CartItemType } from '@/types/cart.types'

const props = defineProps<{
  item: CartItemType
}>()

const cartStore = useCartStore()
const updating = ref(false)

async function updateQty(qty: number) {
  if (updating.value) return
  updating.value = true
  try {
    await cartStore.updateItem(props.item.id, qty)
  } finally {
    updating.value = false
  }
}

async function remove() {
  await cartStore.removeItem(props.item.id)
}
</script>

<template>
  <div class="flex items-start gap-4 py-4 border-b border-border/60 last:border-0">
    <!-- Product image -->
    <RouterLink :to="`/products/${item.product.slug}`" class="flex-shrink-0">
      <div class="w-20 h-20 rounded-xl overflow-hidden bg-muted/30 border border-border/50">
        <img
          :src="item.product.thumbnail"
          :alt="item.product.name"
          loading="lazy"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
    </RouterLink>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <RouterLink
        :to="`/products/${item.product.slug}`"
        class="text-sm font-semibold text-foreground hover:text-primary line-clamp-2 transition-colors duration-200"
      >
        {{ item.product.name }}
      </RouterLink>
      <PriceComponent :amount="item.unitPrice" class="mt-1.5" size="sm" />

      <div class="flex items-center gap-3 mt-3">
        <QuantitySelector
          :modelValue="item.quantity"
          @update:modelValue="updateQty"
          :disabled="updating"
          size="sm"
          :max="99"
        />
        <button
          @click="remove"
          class="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          aria-label="Remove item"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <!-- Total price -->
    <PriceComponent :amount="item.totalPrice" size="sm" class="flex-shrink-0 font-bold" />
  </div>
</template>
