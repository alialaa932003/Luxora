<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SlidersHorizontal, Grid3x3, List } from "lucide-vue-next";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ProductGrid from "@/components/common/product/ProductGrid.vue";
import FilterSidebar from "@/components/common/display/FilterSidebar.vue";
import SortDropdown from "@/components/common/display/SortDropdown.vue";
import Pagination from "@/components/common/display/Pagination.vue";
import SkeletonGrid from "@/components/common/display/SkeletonGrid.vue";
import EmptyState from "@/components/common/feedback/EmptyState.vue";
import { productsService } from "@/services/api/products.service";
import type { Product } from "@/types/product.types";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const sort = ref("popularity");
const page = ref(1);
const filtersOpen = ref(false);

const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const priceMin = ref(0);
const priceMax = ref(5000);
const selectedRating = ref<number | null>(null);
const inStockOnly = ref(false);

function resetFilters() {
  selectedCategories.value = [];
  selectedBrands.value = [];
  priceMin.value = 0;
  priceMax.value = 5000;
  selectedRating.value = null;
  inStockOnly.value = false;
}

const products = ref<Product[]>([]);
const totalProducts = ref(0);
const totalPages = ref(1);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await productsService.getAll({
      page: page.value,
      limit: 12,
      sort: sort.value as any,
      minPrice: priceMin.value > 0 ? priceMin.value : undefined,
      maxPrice: priceMax.value < 5000 ? priceMax.value : undefined,
      inStock: inStockOnly.value ? true : undefined,
      category: selectedCategories.value.length ? selectedCategories.value.join(',') : undefined
    });
    
    products.value = res.data.data.products;
    totalProducts.value = res.data.meta.total;
    totalPages.value = Math.ceil(res.data.meta.total / (res.data.meta.limit || 12));
  } catch (error) {
    console.error("Failed to load products", error);
  } finally {
    loading.value = false;
  }
};

watch([page, sort, priceMin, priceMax, inStockOnly, selectedCategories], () => {
  fetchProducts();
});

fetchProducts();
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <div
        class="bg-primary/5 rounded-4xl border border-border/30 px-6 py-10 md:px-12 md:py-12 mb-10 text-center md:text-left flex flex-col gap-3"
      >
        <p
          class="text-xs font-extrabold uppercase tracking-widest text-primary"
        >
          Marketplace
        </p>
        <h1
          class="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight"
        >
          Find your next campus essential
        </h1>
        <p class="text-sm sm:text-base text-muted-foreground max-w-xl">
          Search thousands of listings from verified students at universities
          across the country.
        </p>
      </div>

      <div class="flex gap-8">
        <div class="hidden lg:block">
          <FilterSidebar
            v-model:selectedCategories="selectedCategories"
            v-model:selectedBrands="selectedBrands"
            v-model:priceMin="priceMin"
            v-model:priceMax="priceMax"
            v-model:selectedRating="selectedRating"
            v-model:inStockOnly="inStockOnly"
            @reset="resetFilters"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold text-foreground">{{
                totalProducts
              }}</span>
              products
            </p>
            <div class="flex items-center gap-3">
              <button
                @click="filtersOpen = !filtersOpen"
                class="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                style="border-color: oklch(0.88 0.008 85)"
              >
                <SlidersHorizontal :size="16" /> Filters
              </button>
              <SortDropdown v-model="sort" />
            </div>
          </div>

          <div
            v-if="filtersOpen"
            class="lg:hidden mb-6 p-4 rounded-2xl border"
            style="border-color: oklch(0.88 0.008 85)"
          >
            <FilterSidebar
              v-model:selectedCategories="selectedCategories"
              v-model:selectedBrands="selectedBrands"
              v-model:priceMin="priceMin"
              v-model:priceMax="priceMax"
              v-model:selectedRating="selectedRating"
              v-model:inStockOnly="inStockOnly"
              @reset="resetFilters"
            />
          </div>

          <SkeletonGrid v-if="loading" />
          <EmptyState
            v-else-if="!products.length"
            title="No products found"
            description="Try adjusting your filters or browse other categories."
            action-label="Clear Filters"
            @action="resetFilters"
          />
          <ProductGrid v-else :products="products" />

          <div v-if="totalPages > 1" class="mt-10">
            <Pagination
              v-model:page="page"
              :total-pages="totalPages"
              :total="totalProducts"
            />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
