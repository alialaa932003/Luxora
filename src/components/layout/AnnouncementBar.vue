<script setup lang="ts">
import { ref } from 'vue'
import { X } from '@lucide/vue'

const dismissed = ref(false)

defineProps<{
  message?: string
  linkText?: string
  linkHref?: string
}>()
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="!dismissed"
      class="gradient-primary text-white py-2.5 px-4 text-center text-sm font-medium relative"
    >
      <span>{{ message ?? '🎉 Free shipping on orders over $99 — Limited time only!' }}</span>
      <a
        v-if="linkText && linkHref"
        :href="linkHref"
        class="ml-2 underline underline-offset-2 font-semibold hover:no-underline"
      >
        {{ linkText }}
      </a>
      <button
        @click="dismissed = true"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X :size="14" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
  max-height: 0;
}
</style>
