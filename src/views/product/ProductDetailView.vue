<script setup lang="ts">
import PriceComponent from "@/components/common/commerce/PriceComponent.vue";
import QuantitySelector from "@/components/common/commerce/QuantitySelector.vue";
import RatingComponent from "@/components/common/feedback/RatingComponent.vue";
import ReviewCard from "@/components/common/feedback/ReviewCard.vue";
import ReviewSubmitDialog from "@/components/common/feedback/ReviewSubmitDialog.vue";
import ProductGallery from "@/components/common/product/ProductGallery.vue";
import ProductGrid from "@/components/common/product/ProductGrid.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import { useToast } from "@/composables/useToast";
import { productsService } from "@/services/api/products.service";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import type { Product } from "@/types/product.types";
import {
  CheckCircle2,
  ChevronLeft,
  Heart,
  Loader2,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const { toast } = useToast();

const product = ref<Product | null>(null);
const loading = ref(true);
const quantity = ref(1);
const adding = ref(false);
const activeTab = ref<"description" | "specs" | "reviews">("description");
const isReviewDialogOpen = ref(false);

const reviewsList = ref([
  {
    id: "rev_1",
    authorName: "Emma Johnson",
    rating: 5,
    title: "Absolutely stunning quality",
    body: "I was blown away by the build quality and design. Worth every penny — this feels like a premium product from a world-class brand.",
    date: "2026-05-14T10:00:00Z",
    verified: true,
    helpful: 24,
  },
  {
    id: "rev_2",
    authorName: "James Martinez",
    rating: 4,
    title: "Exceptional, with minor caveats",
    body: "Almost perfect — the performance is outstanding and the packaging was beautiful. Delivery was slightly delayed but support was helpful.",
    date: "2026-04-22T14:00:00Z",
    verified: true,
    helpful: 11,
  },
]);

async function fetchProductDetails(slug: string) {
  loading.value = true;
  try {
    const res = await productsService.getBySlug(slug);
    if (res.data?.success && res.data?.data?.product) {
      product.value = res.data.data.product;
      document.title = `${product.value.name} - Luxora`;
    } else {
      router.push({ name: "not-found" });
    }
  } catch (err) {
    console.error("Error fetching product details:", err);
    router.push({ name: "not-found" });
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      fetchProductDetails(newSlug as string);
    }
  }
);

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) {
    fetchProductDetails(slug);
  }
});

const relatedProducts = computed(() =>
  []
);

const isOutOfStock = computed(() => product.value?.stock === 0);
const isWishlisted = computed(() =>
  product.value ? wishlistStore.isInWishlist(product.value.id) : false,
);

async function addToCart() {
  if (!product.value || isOutOfStock.value || adding.value) return;
  adding.value = true;
  try {
    await cartStore.addItem({
      productId: product.value.id,
      quantity: quantity.value,
    });
    toast({
      title: "Added to cart!",
      description: `${product.value.name} × ${quantity.value}`,
    });
  } finally {
    adding.value = false;
  }
}

async function toggleWishlist() {
  if (!product.value) return;
  if (!authStore.isAuthenticated) {
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }
  await wishlistStore.toggle(product.value.id);
  toast({
    title: isWishlisted.value ? "Added to wishlist" : "Removed from wishlist",
    description: product.value.name,
  });
}

function handleReviewSubmit(review: {
  rating: number;
  title: string;
  body: string;
}) {
  reviewsList.value.unshift({
    id: `rev_${Date.now()}`,
    authorName:
      `${authStore.user?.firstName || "Anonymous"} ${authStore.user?.lastName || ""}`.trim(),
    rating: review.rating,
    title: review.title,
    body: review.body,
    date: new Date().toISOString(),
    verified: true,
    helpful: 0,
  });
  isReviewDialogOpen.value = false;
  toast({
    title: "Review submitted!",
    description: "Thank you for your feedback.",
  });
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-8" v-if="product">
      <RouterLink
        to="/products"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ChevronLeft :size="16" />
        <span>Back to marketplace</span>
      </RouterLink>

      <div class="grid lg:grid-cols-12 gap-10 xl:gap-14 mb-16">
        <div class="lg:col-span-7">
          <div
            class="rounded-4xl overflow-hidden border border-border/40 shadow-sm bg-white"
          >
            <ProductGallery
              :images="
                product.images.length
                  ? product.images
                  : [{ url: product.thumbnail?.url || product.images?.[0]?.url || '', alt: product.name }]
              "
              :product-name="product.name"
            />
          </div>
        </div>

        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
            >
              {{ product.category.name }}
            </span>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold bg-white border border-border/80 text-foreground shadow-sm"
            >
              {{ product.condition || "Good" }}
            </span>
            <span class="text-xs text-muted-foreground ml-auto font-medium">
              Posted {{ product.postedAge || "2d ago" }}
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <h1
              class="text-3xl xl:text-4xl font-extrabold text-foreground tracking-tight leading-tight"
            >
              {{ product.name }}
            </h1>
            <div class="flex items-baseline gap-3 mt-1">
              <PriceComponent
                :amount="product.price"
                :currency="product.currency"
                class="text-3xl font-extrabold text-primary"
              />
              <span
                v-if="product.originalPrice"
                class="text-base text-muted-foreground line-through font-medium"
              >
                ${{ product.originalPrice }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <RatingComponent
              :average="product.rating.average"
              :count="product.rating.count"
              show-count
            />
          </div>

          <p class="text-muted-foreground leading-relaxed text-sm">
            {{ product.description }}
          </p>

          <div class="grid grid-cols-2 gap-3.5 mt-2">
            <div
              class="bg-white border border-border/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0"
              >
                <Store :size="20" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Brand
                </p>
                <p class="text-xs font-bold text-foreground truncate mt-0.5">
                  {{ product.vendor.storeName }}
                </p>
              </div>
            </div>

            <div
              class="bg-white border border-border/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0"
              >
                <Truck :size="20" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Delivery
                </p>
                <p class="text-xs font-bold text-foreground truncate mt-0.5">
                  Free Shipping
                </p>
              </div>
            </div>

            <div
              class="bg-white border border-border/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0"
              >
                <ShieldCheck :size="20" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Security
                </p>
                <p class="text-xs font-bold text-foreground truncate mt-0.5">
                  Secure Checkout
                </p>
              </div>
            </div>

            <div
              class="bg-white border border-border/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0"
              >
                <CheckCircle2 :size="20" class="text-primary" />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
                >
                  Warranty
                </p>
                <p class="text-xs font-bold text-foreground truncate mt-0.5">
                  100% Genuine
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 mt-2">
            <span class="text-sm font-bold text-foreground">Quantity:</span>
            <QuantitySelector
              v-model="quantity"
              :max="product.stock"
              :disabled="isOutOfStock"
            />
            <span
              :class="product.stock > 0 ? 'text-emerald-600' : 'text-red-500'"
              class="text-xs font-semibold"
            >
              {{
                product.stock > 5
                  ? "In Stock"
                  : product.stock > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"
              }}
            </span>
          </div>

          <div class="flex gap-3.5 mt-2">
            <button
              @click="addToCart"
              :disabled="isOutOfStock || adding"
              class="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-white bg-primary hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all duration-150 shadow-sm"
            >
              <Loader2 v-if="adding" :size="18" class="animate-spin" />
              <template v-else>
                <ShoppingCart :size="18" />
                <span>{{ isOutOfStock ? "Out of Stock" : "Add to Cart" }}</span>
              </template>
            </button>

            <button
              @click="toggleWishlist"
              class="h-12 px-4 rounded-xl border border-border bg-white text-foreground hover:bg-muted/50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
              :aria-label="isWishlisted ? 'Saved' : 'Save'"
            >
              <Heart
                :size="18"
                :fill="isWishlisted ? 'currentColor' : 'none'"
                :class="isWishlisted ? 'text-red-500' : 'text-muted-foreground'"
              />
              <span>{{ isWishlisted ? "Saved" : "Save" }}</span>
            </button>

            <button
              class="h-12 w-12 rounded-xl border border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95 transition-all duration-150 flex items-center justify-center shadow-sm"
              aria-label="Share product"
            >
              <Share2 :size="18" />
            </button>
          </div>

          <div class="h-px bg-border/50" />

          <div
            class="bg-white border border-border/50 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-sm"
          >
            <div class="flex items-center gap-3.5">
              <div
                class="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10 bg-primary/5 flex items-center justify-center text-primary font-bold"
              >
                {{ product.vendor.storeName.charAt(0) }}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-extrabold text-sm text-foreground">{{
                    product.vendor.storeName
                  }}</span>
                  <span
                    class="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-primary/10 text-primary uppercase font-mono"
                    >Official Partner</span
                  >
                </div>
                <p class="text-[10px] text-muted-foreground mt-0.5">
                  Authorised Brand Store
                </p>
                <div class="flex items-center gap-1 mt-1">
                  <Star :size="10" class="text-amber-400" fill="currentColor" />
                  <span class="text-[10px] font-bold text-foreground">{{
                    product.vendor.rating || "4.8"
                  }}</span>
                  <span class="text-[9px] text-muted-foreground"
                    >(Brand rating)</span
                  >
                </div>
              </div>
            </div>
            <RouterLink
              :to="`/vendors/${product.vendor.storeSlug || product.vendor.id}`"
              class="px-4 py-2 rounded-xl border border-border hover:bg-muted/50 font-bold text-xs text-foreground transition-all duration-150 shadow-sm"
            >
              View store
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="mb-14">
        <div class="flex border-b border-border/60 gap-1">
          <button
            v-for="tab in ['description', 'specs', 'reviews'] as const"
            :key="tab"
            @click="activeTab = tab"
            class="px-5 py-3 text-sm font-semibold capitalize transition-all duration-150 border-b-2 -mb-px"
            :style="
              activeTab === tab
                ? 'border-color: var(--primary); color: var(--primary); font-weight: 700;'
                : 'border-color: transparent; color: var(--muted-foreground);'
            "
          >
            {{ tab }}{{ tab === "reviews" ? ` (${reviewsList.length})` : "" }}
          </button>
        </div>

        <div class="py-8">
          <div
            v-if="activeTab === 'description'"
            class="max-w-3xl leading-relaxed text-muted-foreground text-sm"
          >
            <p>{{ product.description }}</p>
          </div>

          <div v-else-if="activeTab === 'specs'" class="max-w-lg">
            <div class="divide-y divide-border/50">
              <div
                v-for="(spec, i) in [
                  ['Brand', product.vendor.storeName],
                  ['Category', product.category.name],
                  ['Stock', `${product.stock} units`],
                  ['SKU', product.id],
                  ['Condition', product.condition || 'Good'],
                ]"
                :key="i"
                class="flex py-3 justify-between"
              >
                <span class="text-sm text-muted-foreground font-semibold">{{
                  spec[0]
                }}</span>
                <span class="text-sm text-foreground font-bold">{{
                  spec[1]
                }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'reviews'" class="space-y-6 max-w-3xl">
            <div class="flex items-center justify-between gap-4 mb-4">
              <h3 class="font-bold text-foreground text-base">
                Customer Reviews
              </h3>
              <button
                @click="isReviewDialogOpen = true"
                class="px-4.5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-90 transition-all duration-150 shadow-sm"
              >
                Write a review
              </button>
            </div>

            <div class="space-y-4">
              <ReviewCard
                v-for="review in reviewsList"
                :key="review.id"
                v-bind="review"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length">
        <h2 class="text-2xl font-extrabold text-foreground mb-6 tracking-tight">
          You might also like
        </h2>
        <ProductGrid :products="relatedProducts" />
      </div>
    </main>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <Loader2 :size="32" class="animate-spin text-primary" />
    </div>

    <ReviewSubmitDialog
      v-if="product"
      :is-open="isReviewDialogOpen"
      :product-name="product.name"
      @close="isReviewDialogOpen = false"
      @submit="handleReviewSubmit"
    />

    <AppFooter />
  </div>
</template>
