import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { wishlistService } from '@/services/api/wishlist.service'
import { useCartStore } from './cart.store'
import type { WishlistItem } from '@/types/cart.types'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const itemCount = ref(0)
  const loading = ref(false)

  const productIds = computed(() => items.value.map((i) => i.product.id))

  function isInWishlist(productId: string) {
    return productIds.value.includes(productId)
  }

  async function fetchWishlist() {
    loading.value = true
    try {
      const res = await wishlistService.get()
      items.value = res.data.data.wishlist.items
      itemCount.value = res.data.data.wishlist.itemCount
    } finally {
      loading.value = false
    }
  }

  async function toggle(productId: string) {
    if (isInWishlist(productId)) {
      await removeItem(productId)
    } else {
      await addItem(productId)
    }
  }

  async function addItem(productId: string) {
    items.value.push({ id: '', product: { id: productId, name: '', slug: '', price: 0, thumbnail: '', stock: 0 }, addedAt: '' })
    itemCount.value++
    try {
      const res = await wishlistService.addItem(productId)
      itemCount.value = res.data.data.itemCount
      await fetchWishlist()
    } catch {
      items.value = items.value.filter((i) => i.product.id !== productId)
      itemCount.value--
    }
  }

  async function removeItem(productId: string) {
    const prev = [...items.value]
    const prevCount = itemCount.value
    items.value = items.value.filter((i) => i.product.id !== productId)
    itemCount.value--
    try {
      const res = await wishlistService.removeItem(productId)
      itemCount.value = res.data.data.itemCount
    } catch {
      items.value = prev
      itemCount.value = prevCount
    }
  }

  async function moveToCart(productId: string) {
    const cartStore = useCartStore()
    await wishlistService.moveToCart(productId)
    items.value = items.value.filter((i) => i.product.id !== productId)
    itemCount.value--
    await cartStore.fetchCart()
  }

  return { items, itemCount, loading, productIds, isInWishlist, fetchWishlist, toggle, addItem, removeItem, moveToCart }
})
