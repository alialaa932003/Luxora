<script setup lang="ts">
import { ref } from 'vue'
import { Tag, X } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const props = withDefaults(defineProps<{
  showCheckoutButton?: boolean
}>(), {
  showCheckoutButton: true,
})
import PriceComponent from './PriceComponent.vue'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart.store'
import { useToast } from '@/composables/useToast'

const cartStore = useCartStore()
const { toast } = useToast()
const couponCode = ref('')
const applyingCoupon = ref(false)

async function applyCoupon() {
  if (!couponCode.value.trim() || applyingCoupon.value) return
  applyingCoupon.value = true
  try {
    await cartStore.applyCoupon(couponCode.value.trim())
    couponCode.value = ''
    toast({ title: 'Coupon applied!', variant: 'success' })
  } catch {
    toast({ title: 'Invalid coupon code', variant: 'destructive' })
  } finally {
    applyingCoupon.value = false
  }
}

async function removeCoupon() {
  await cartStore.removeCoupon()
}
</script>

<template>
  <div v-if="cartStore.summary" class="bg-card rounded-2xl border border-border/50 card-elevated p-6 space-y-4">
    <h3 class="font-semibold text-foreground text-base">Order Summary</h3>

    <div class="space-y-2.5 text-sm">
      <div class="flex justify-between text-muted-foreground">
        <span>Subtotal ({{ cartStore.summary.itemCount }} items)</span>
        <PriceComponent :amount="cartStore.summary.subtotal" size="sm" />
      </div>
      <div class="flex justify-between text-muted-foreground">
        <span>Shipping</span>
        <span v-if="cartStore.summary.shipping === 0" class="text-green-600 font-medium">Free</span>
        <PriceComponent v-else :amount="cartStore.summary.shipping" size="sm" />
      </div>
      <div class="flex justify-between text-muted-foreground">
        <span>Tax</span>
        <PriceComponent :amount="cartStore.summary.tax" size="sm" />
      </div>
      <div v-if="cartStore.summary.couponDiscount > 0" class="flex justify-between text-green-600 font-medium">
        <span class="flex items-center gap-1.5">
          <Tag :size="13" />
          Coupon ({{ cartStore.coupon?.code }})
        </span>
        <span>- <PriceComponent :amount="cartStore.summary.couponDiscount" size="sm" /></span>
      </div>
    </div>

    <Separator />

    <div class="flex justify-between font-bold text-foreground text-base">
      <span>Total</span>
      <PriceComponent :amount="cartStore.summary.total" size="md" />
    </div>

    <!-- Coupon input -->
    <div v-if="!cartStore.coupon" class="pt-1">
      <div class="flex gap-2">
        <input
          v-model="couponCode"
          @keydown.enter="applyCoupon"
          type="text"
          placeholder="Promo code"
          class="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button
          @click="applyCoupon"
          :disabled="applyingCoupon || !couponCode.trim()"
          class="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {{ applyingCoupon ? '…' : 'Apply' }}
        </button>
      </div>
    </div>
    <div v-else class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-sm">
      <span class="flex items-center gap-2 text-green-700 font-medium">
        <Tag :size="13" />
        {{ cartStore.coupon.code }} applied
      </span>
      <button @click="removeCoupon" class="text-green-600 hover:text-green-800 transition-colors">
        <X :size="14" />
      </button>
    </div>


    <RouterLink
      v-if="props.showCheckoutButton"
      to="/checkout"
      class="block w-full text-center py-3 rounded-xl bg-primary text-white hover:opacity-90 font-semibold text-sm transition-all duration-150 shadow-sm hover:-translate-y-0.5 mt-2"
    >
      Proceed to Checkout
    </RouterLink>
    <slot name="actions" />
  </div>
</template>
