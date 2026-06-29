<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight, Check, Sparkles, Star } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  }
}

const checklists = [
  'Free shipping on orders over $99',
  '100% secure checkout systems',
  '24/7 dedicated customer support',
]
</script>

<template>
  <section class="relative bg-background min-h-[85vh] flex items-center overflow-hidden py-12 lg:py-20">
    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Left content -->
        <div class="flex flex-col gap-6 max-w-xl">
          <!-- Tagline badge -->
          <div class="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Discover the New Collection
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight text-balance">
            Shop with purpose,<br />live with
            <span class="text-primary">style.</span>
          </h1>

          <!-- Description -->
          <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Curated collections from the world's best brands. Premium quality, honest prices, delivered directly to your door.
          </p>

          <!-- Search bar -->
          <div class="relative w-full max-w-md mt-2">
            <div class="flex items-center bg-white rounded-full shadow-md border border-border/80 p-1.5 pl-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Search :size="18" class="text-muted-foreground mr-2.5 flex-shrink-0" />
              <input
                v-model="searchQuery"
                @keydown.enter="handleSearch"
                type="text"
                placeholder="Search headphones, wallets, mugs, face oil..."
                class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none py-2"
              />
              <button
                @click="handleSearch"
                class="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all duration-150 flex items-center gap-1.5 shadow-sm flex-shrink-0"
              >
                <span>Search</span>
                <ArrowRight :size="12" />
              </button>
            </div>
          </div>

          <!-- Checklist features -->
          <div class="flex flex-col gap-2.5 mt-2">
            <div
              v-for="item in checklists"
              :key="item"
              class="flex items-center gap-2.5 text-sm text-muted-foreground font-medium"
            >
              <div class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Check :size="12" class="stroke-[3]" />
              </div>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- Right Visual (Redesigned Premium E-Commerce Layout) -->
        <div class="flex items-center justify-center relative">
          <!-- Main Hero Image (Headphones lifestyle mockup) -->
          <div class="w-full max-w-[480px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg border border-border/40 relative bg-muted/10">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop"
              alt="Premium Headphones"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          <!-- Floating Badge 1 (Top Right) -->
          <div class="absolute -top-4 -right-2 sm:right-4 bg-white/95 backdrop-blur rounded-2xl p-3.5 shadow-md border border-border/30 max-w-[210px] animate-bounce" style="animation-duration: 3s;">
            <div class="flex items-start gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles :size="15" />
              </div>
              <div>
                <p class="text-xs font-bold text-foreground leading-tight">3,000+ items</p>
                <p class="text-[10px] text-muted-foreground mt-0.5">New arrivals added this week</p>
              </div>
            </div>
          </div>

          <!-- Floating Badge 2 (Bottom Left) -->
          <div class="absolute -bottom-4 -left-2 sm:left-4 bg-white/95 backdrop-blur rounded-2xl px-4 py-3.5 shadow-md border border-border/30 max-w-[200px]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                <Star :size="16" fill="currentColor" />
              </div>
              <div>
                <p class="text-[10px] text-muted-foreground">Trusted Platform</p>
                <p class="text-sm font-extrabold text-foreground mt-0.5">Rating 4.9 (250K+)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
