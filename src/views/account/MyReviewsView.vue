<script setup lang="ts">
import { onMounted } from 'vue'
import { Star } from 'lucide-vue-next'
import EmptyState from '@/components/common/feedback/EmptyState.vue'
import ReviewCard from '@/components/common/feedback/ReviewCard.vue'

onMounted(() => { document.title = 'My Reviews - Luxora' })

const reviews = [
  {
    id: 'r1',
    authorName: 'Me',
    rating: 5,
    title: 'Exceptional quality, would buy again',
    body: 'The product exceeded my expectations in every way. The build quality is phenomenal and the packaging was pristine.',
    date: '2026-05-20T10:00:00Z',
    verified: true,
    helpful: 8,
  },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
        <Star :size="22" /> My Reviews
      </h1>
      <p class="text-muted-foreground text-sm mt-1">Reviews you've written</p>
    </div>

    <EmptyState
      v-if="!reviews.length"
      title="No reviews yet"
      description="After purchasing products, share your experience to help other shoppers."
      action-label="Shop Now"
      action-to="/products"
    />

    <div v-else class="space-y-4 max-w-2xl">
      <ReviewCard
        v-for="r in reviews"
        :key="r.id"
        v-bind="r"
      />
    </div>
  </div>
</template>
