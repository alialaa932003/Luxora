<script setup lang="ts">
const brands = [
  { name: 'Apple', logo: '' },
  { name: 'Zara', logo: 'ZARA' },
  { name: 'Aesop', logo: 'Aesop' },
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Stripe', logo: 'stripe' },
  { name: 'COS', logo: 'C O S' },
]
</script>

<template>
  <section class="py-12 border-y border-border/40 bg-muted/10">
    <div class="container mx-auto px-4 lg:px-8">
      <p class="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-8">
        Collaborating with the finest labels
      </p>
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
        <div
          v-for="brand in brands"
          :key="brand.name"
          class="text-xl md:text-2xl font-bold tracking-widest text-foreground grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 select-none cursor-pointer"
        >
          {{ brand.logo }}
        </div>
      </div>
    </div>
  </section>
</template>
