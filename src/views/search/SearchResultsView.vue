<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { Search } from "lucide-vue-next";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ProductGrid from "@/components/common/product/ProductGrid.vue";
import SortDropdown from "@/components/common/display/SortDropdown.vue";
import SkeletonGrid from "@/components/common/display/SkeletonGrid.vue";
import EmptyState from "@/components/common/feedback/EmptyState.vue";
import Pagination from "@/components/common/display/Pagination.vue";
import { productsService } from "@/services/api/products.service";
import type { Product } from "@/types/product.types";

const route = useRoute();
const loading = ref(true);
const sort = ref<'popularity' | 'rating' | 'price_asc' | 'price_desc' | 'newest'>('popularity');
const page = ref(1);

const query = computed(() => (route.query.q as string) || "");

const results = ref<Product[]>([]);
const totalResults = ref(0);
const totalPages = ref(1);

const fetchResults = async () => {
  loading.value = true;
  try {
    const res = await productsService.getAll({
      q: query.value,
      sort: sort.value,
      page: page.value,
      limit: 12
    });
    
    results.value = res.data.data.products;
    totalResults.value = res.data.meta.total;
    totalPages.value = Math.ceil(res.data.meta.total / (res.data.meta.limit || 12));
  } catch (error) {
    console.error("Failed to load search results", error);
  } finally {
    loading.value = false;
  }
};

watch([query, sort, page], () => {
  document.title = `Search: "${query.value}" - Luxora`;
  fetchResults();
});

onMounted(() => {
  document.title = `Search: "${query.value}" - Luxora`;
  fetchResults();
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div
        class="bg-primary/5 rounded-4xl border border-border/30 px-6 py-8 md:px-12 md:py-10 mb-10 text-center md:text-left flex flex-col gap-2"
      >
        <p
          class="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-1 justify-center md:justify-start"
        >
          <Search :size="12" /> Search Results
        </p>
        <h1
          class="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight"
        >
          "{{ query }}"
        </h1>
        <p class="text-sm text-muted-foreground">
          Found
          <span class="font-bold text-foreground">{{ totalResults }}</span>
          {{ totalResults === 1 ? "product" : "products" }}
        </p>
      </div>

      <div
        class="flex items-center justify-between mb-6 gap-4 flex-wrap"
        v-if="results.length"
      >
        <div class="flex gap-2 flex-wrap">
        </div>
        <SortDropdown v-model="sort" />
      </div>

      <SkeletonGrid v-if="loading" />

      <EmptyState
        v-else-if="!results.length"
        title="No results found"
        :description="`We couldn't find anything for &quot;${query}&quot;. Try different keywords or browse our categories.`"
        action-label="Browse All Products"
        action-to="/products"
      />

      <ProductGrid v-else :products="results" />

      <div v-if="totalPages > 1" class="mt-10">
        <Pagination
          v-model:page="page"
          :total-pages="totalPages"
          :total="totalResults"
        />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
