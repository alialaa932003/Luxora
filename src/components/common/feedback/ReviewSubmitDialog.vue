<script setup lang="ts">
import { ref } from 'vue'
import { Star, X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  productName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { rating: number; title: string; body: string }): void
}>()

const rating = ref(5)
const hoverRating = ref(0)
const title = ref('')
const body = ref('')

function handleSubmit() {
  if (!body.value.trim() || !title.value.trim()) return
  emit('submit', {
    rating: rating.value,
    title: title.value.trim(),
    body: body.value.trim(),
  })
  // reset
  title.value = ''
  body.value = ''
  rating.value = 5
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        @click="emit('close')"
        class="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <!-- Content -->
      <div
        class="relative bg-white rounded-[2rem] max-w-lg w-full p-6 md:p-8 shadow-xl border border-border/50 z-10 animate-in scale-in duration-200"
      >
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X :size="18" />
        </button>

        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-xl font-extrabold text-foreground tracking-tight">Write a Review</h2>
          <p class="text-xs text-muted-foreground mt-1">for {{ props.productName }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Rating Selector -->
          <div class="space-y-2">
            <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
              Overall Rating
            </label>
            <div class="flex items-center gap-1.5">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="rating = i"
                @mouseenter="hoverRating = i"
                @mouseleave="hoverRating = 0"
                class="p-0.5 text-amber-400 transition-transform duration-100 hover:scale-115 active:scale-90"
              >
                <Star
                  :size="28"
                  :fill="(hoverRating ? i <= hoverRating : i <= rating) ? 'currentColor' : 'none'"
                  :class="(hoverRating ? i <= hoverRating : i <= rating) ? 'text-amber-400' : 'text-muted-foreground/30'"
                  class="stroke-[2.5]"
                />
              </button>
              <span class="text-xs font-bold text-muted-foreground ml-2">
                {{ ['Select', 'Poor', 'Fair', 'Average', 'Good', 'Stunning'][hoverRating || rating] }}
              </span>
            </div>
          </div>

          <!-- Title Input -->
          <div class="space-y-2">
            <label for="review-title" class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
              Review Title
            </label>
            <input
              id="review-title"
              v-model="title"
              type="text"
              required
              placeholder="Summarize your review in a few words..."
              class="w-full h-11 px-4 rounded-xl border border-border/80 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-white text-foreground"
            />
          </div>

          <!-- Body Textarea -->
          <div class="space-y-2">
            <label for="review-body" class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
              Review Body
            </label>
            <textarea
              id="review-body"
              v-model="body"
              required
              rows="4"
              placeholder="Tell us what you liked or disliked about this product..."
              class="w-full p-4 rounded-xl border border-border/80 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-white text-foreground resize-none"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3.5 pt-2">
            <button
              type="button"
              @click="emit('close')"
              class="px-5 py-2.5 rounded-xl border border-border bg-white text-foreground font-bold text-xs hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!body.trim() || !title.trim()"
              class="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              Submit review
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
