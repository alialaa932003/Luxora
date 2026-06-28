<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="rounded-2xl overflow-hidden border border-border/50 bg-card">
    <Skeleton class="aspect-square w-full" />
    <div class="p-4 space-y-3">
      <Skeleton class="h-3 w-1/3 rounded-full" />
      <Skeleton class="h-4 w-3/4 rounded-full" />
      <Skeleton class="h-3 w-1/2 rounded-full" />
      <div class="flex items-center justify-between pt-1">
        <Skeleton class="h-5 w-1/4 rounded-full" />
        <Skeleton class="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
</template>
