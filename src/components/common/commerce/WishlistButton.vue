<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from '@lucide/vue'
import { useWishlistStore } from '@/stores/wishlist.store'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const props = defineProps<{
  productId: string
  size?: 'sm' | 'md' | 'lg'
}>()

const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const router = useRouter()

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.productId))

const iconSize = computed(() => ({ sm: 14, md: 18, lg: 22 }[props.size ?? 'md']))

async function toggle() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  await wishlistStore.toggle(props.productId)
}
</script>

<template>
  <button
    @click.prevent="toggle"
    :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
    :aria-pressed="isWishlisted"
    class="group p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
    :class="isWishlisted
      ? 'bg-red-50 hover:bg-red-100 text-red-500'
      : 'bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm'"
  >
    <Heart
      :size="iconSize"
      :fill="isWishlisted ? 'currentColor' : 'none'"
      class="transition-all duration-200"
      :class="{ 'animate-ping-once': isWishlisted }"
    />
  </button>
</template>

<style scoped>
@keyframes ping-once {
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
.animate-ping-once {
  animation: ping-once 300ms ease-out;
}
</style>
