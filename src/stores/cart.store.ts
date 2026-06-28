import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/api/cart.service'
import type { Cart, CartItem, AddToCartPayload } from '@/types/cart.types'

const GUEST_CART_KEY = 'guest_cart_id'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)

  const items = computed(() => cart.value?.items ?? [])
  const summary = computed(() => cart.value?.summary)
  const coupon = computed(() => cart.value?.coupon)
  const itemCount = computed(() => cart.value?.summary?.itemCount ?? 0)
  const guestCartId = computed(() => localStorage.getItem(GUEST_CART_KEY))

  async function fetchCart() {
    loading.value = true
    try {
      const res = await cartService.get()
      cart.value = res.data.data.cart
      if (cart.value?.id && !localStorage.getItem(GUEST_CART_KEY)) {
        localStorage.setItem(GUEST_CART_KEY, cart.value.id)
      }
    } finally {
      loading.value = false
    }
  }

  async function addItem(payload: AddToCartPayload) {
    const res = await cartService.addItem(payload)
    cart.value = res.data.data.cart
  }

  async function updateItem(itemId: string, quantity: number) {
    const res = await cartService.updateItem(itemId, { quantity })
    cart.value = res.data.data.cart
  }

  async function removeItem(itemId: string) {
    const res = await cartService.removeItem(itemId)
    cart.value = res.data.data.cart
  }

  async function clearCart() {
    await cartService.clear()
    cart.value = null
  }

  async function mergeGuestCart() {
    const guestId = localStorage.getItem(GUEST_CART_KEY)
    if (!guestId) return
    const res = await cartService.merge(guestId)
    cart.value = res.data.data.cart
    localStorage.removeItem(GUEST_CART_KEY)
  }

  async function applyCoupon(code: string) {
    const res = await cartService.applyCoupon(code)
    cart.value = res.data.data.cart
  }

  async function removeCoupon() {
    const res = await cartService.removeCoupon()
    cart.value = res.data.data.cart
  }

  return {
    cart, loading, items, summary, coupon, itemCount, guestCartId,
    fetchCart, addItem, updateItem, removeItem, clearCart, mergeGuestCart,
    applyCoupon, removeCoupon,
  }
})
