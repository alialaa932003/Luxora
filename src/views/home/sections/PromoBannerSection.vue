<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, Sparkles } from '@lucide/vue'
</script>

<template>
  <section class="py-12 container mx-auto px-4 lg:px-8">
    <div class="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-start p-8 md:p-16 card-elevated">
      <!-- Background Image -->
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop"
        alt="Premium lifestyle banner"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Dark Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/75 to-transparent" />

      <!-- Decorative mesh gradient blob -->
      <div class="blob absolute w-80 h-80 bg-accent/20 right-10 top-10 pointer-events-none" />

      <!-- Content -->
      <div class="relative z-10 max-w-lg flex flex-col gap-6 text-white">
        <div class="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles :size="12" class="text-accent" /> Exclusive Deal
        </div>
        <h2 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Refine Your Space With Curated Living
        </h2>
        <p class="text-white/70 text-sm md:text-base leading-relaxed">
          Upgrade your home aesthetics with up to 30% off our handpicked minimalist furniture and luxury ceramic tableware.
        </p>
        <div class="pt-2">
          <RouterLink
            to="/products?category=home-living"
            class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-md"
          >
            Explore Living <ArrowRight :size="16" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
