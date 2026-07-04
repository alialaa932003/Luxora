<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { Sparkles, Loader2, ArrowRight } from "lucide-vue-next";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import { categoriesService } from "@/services/api/categories.service";
import type { Category } from "@/types/product.types";

const categories = ref<Category[]>([]);
const loading = ref(true);

onMounted(async () => {
  document.title = "Browse Categories - Luxora";
  categories.value = await categoriesService.getAll();
  loading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col justify-between">
    <div>
      <AppNavbar />

      <main class="container mx-auto px-4 lg:px-8 py-10">
        <div
          class="bg-primary/5 rounded-4xl border border-border/30 px-6 py-10 md:px-12 md:py-12 mb-10 text-center md:text-left flex flex-col gap-3"
        >
          <p
            class="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 justify-center md:justify-start"
          >
            <Sparkles :size="12" />
            <span>Discover Collections</span>
          </p>
          <h1
            class="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight"
          >
            Browse by Category
          </h1>
          <p class="text-sm sm:text-base text-muted-foreground max-w-xl">
            Explore our curated departments to find premium high-fidelity gear,
            apparel, design ware, and skin-care essentials.
          </p>
        </div>

        <div v-if="loading" class="flex justify-center py-24">
          <Loader2 :size="32" class="animate-spin text-primary" />
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/categories/${cat.slug}`"
            class="group relative aspect-square rounded-4xl overflow-hidden card-elevated card-hover border border-border/40 shadow-sm block bg-white"
          >
            <img
              :src="cat.image.url"
              :alt="cat.name"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300"
            />

            <div
              class="absolute inset-0 p-6 flex flex-col justify-end text-white z-10"
            >
              <span
                class="text-[10px] font-extrabold uppercase tracking-wider text-white/80"
              >
                {{ cat.productCount }} Products
              </span>
              <div class="flex items-center justify-between gap-2 mt-1">
                <h2 class="text-xl font-extrabold tracking-tight">
                  {{ cat.name }}
                </h2>
                <div
                  class="w-8 h-8 rounded-full bg-white/20 border border-white/25 flex items-center justify-center translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ArrowRight :size="14" class="text-white" />
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>
