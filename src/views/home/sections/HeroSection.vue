<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight, Star, Shield, Zap } from '@lucide/vue'

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  }
}

const stats = [
  { label: 'Products', value: '10,000+' },
  { label: 'Brands', value: '500+' },
  { label: 'Reviews', value: '250K+' },
]

const badges = [
  { icon: Star, text: '4.9 Rating', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { icon: Shield, text: 'Secure Checkout', color: 'bg-green-50 text-green-700 border-green-200' },
  { icon: Zap, text: 'Fast Delivery', color: 'bg-blue-50 text-blue-700 border-blue-200' },
]
</script>

<template>
  <section class="relative min-h-[85vh] flex items-center overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 gradient-hero" />
    <div class="blob absolute w-[600px] h-[600px] gradient-primary top-[-100px] right-[-100px] opacity-10" />
    <div class="blob absolute w-[400px] h-[400px] bg-accent top-[40%] left-[-80px] opacity-15" />

    <!-- Floating grid pattern -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="background-image: linear-gradient(oklch(0.32 0.09 295) 1px, transparent 1px), linear-gradient(90deg, oklch(0.32 0.09 295) 1px, transparent 1px); background-size: 40px 40px;"
    />

    <div class="container mx-auto px-4 lg:px-8 relative z-10 pt-16 pb-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left content -->
        <div class="flex flex-col gap-6">
          <!-- Tagline badge -->
          <div class="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Discover the New Collection
          </div>

          <!-- Headline -->
          <h1 class="text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight text-balance">
            Shop with
            <span class="text-gradient-primary"> purpose</span>,
            <br />live with style.
          </h1>

          <!-- Description -->
          <p class="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Curated collections from the world's best brands. Premium quality, honest prices, delivered to your door.
          </p>

          <!-- Search bar -->
          <div class="relative max-w-lg">
            <div class="flex items-center bg-background rounded-2xl shadow-lg border border-border/60 p-1.5">
              <Search :size="18" class="text-muted-foreground mx-3 flex-shrink-0" />
              <input
                v-model="searchQuery"
                @keydown.enter="handleSearch"
                type="search"
                placeholder="Search products, brands, categories…"
                class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none py-2"
              />
              <button
                @click="handleSearch"
                class="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md flex-shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="badge in badges"
              :key="badge.text"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
              :class="badge.color"
            >
              <component :is="badge.icon" :size="12" />
              {{ badge.text }}
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-8 pt-2">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col">
              <span class="text-2xl font-bold text-foreground">{{ stat.value }}</span>
              <span class="text-xs text-muted-foreground">{{ stat.label }}</span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex items-center gap-3 pt-2">
            <RouterLink
              to="/products"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
            >
              Shop Now <ArrowRight :size="16" />
            </RouterLink>
            <RouterLink
              to="/products?featured=true"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all duration-200"
            >
              View Featured
            </RouterLink>
          </div>
        </div>

        <!-- Right visual (floating product cards) -->
        <div class="hidden lg:flex items-center justify-center relative h-[520px]">
          <!-- Floating decorative product images -->
          <div class="absolute top-0 right-12 w-52 h-52 rounded-3xl overflow-hidden card-elevated rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" alt="Premium watch" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 right-0 p-3 glass">
              <p class="text-xs font-bold text-foreground">Premium Watch</p>
              <p class="text-xs text-muted-foreground">$299</p>
            </div>
          </div>

          <div class="absolute top-24 left-0 w-40 h-40 rounded-2xl overflow-hidden card-elevated -rotate-6 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop" alt="Skincare" class="w-full h-full object-cover" />
          </div>

          <div class="absolute bottom-12 right-0 w-44 h-56 rounded-3xl overflow-hidden card-elevated -rotate-2 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=350&h=450&fit=crop" alt="Sneakers" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 left-0 right-0 p-3 glass">
              <p class="text-xs font-bold text-foreground">Air Max Pro</p>
              <div class="flex items-center gap-1 mt-0.5">
                <Star :size="9" class="text-amber-400" fill="currentColor" />
                <span class="text-[10px] text-muted-foreground">4.9 (2.3k)</span>
              </div>
            </div>
          </div>

          <div class="absolute bottom-4 left-16 w-36 h-36 rounded-2xl overflow-hidden card-elevated rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop" alt="Headphones" class="w-full h-full object-cover" />
          </div>

          <!-- Floating badge -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-2xl p-4 shadow-xl border border-border/60">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap :size="18" class="text-white" />
              </div>
              <div>
                <p class="text-xs font-bold text-foreground">Flash Sale</p>
                <p class="text-[11px] text-muted-foreground">Up to 60% off today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
