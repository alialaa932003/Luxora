<script setup lang="ts">
import { ref } from "vue";
import { Tag, X } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const props = withDefaults(
  defineProps<{
    showCheckoutButton?: boolean;
  }>(),
  {
    showCheckoutButton: true,
  },
);
import PriceComponent from "./PriceComponent.vue";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";

const cartStore = useCartStore();
const { toast } = useToast();
const couponCode = ref("");
const applyingCoupon = ref(false);

const authStore = useAuthStore();
const pointsToApply = ref<number | "">("");
const applyingPoints = ref(false);

async function applyPoints() {
  const pts = typeof pointsToApply.value === 'string' ? parseInt(pointsToApply.value) : pointsToApply.value;
  if (!pts || applyingPoints.value) return;
  applyingPoints.value = true;
  try {
    await cartStore.applyPoints(pts);
    pointsToApply.value = "";
    toast({ title: "Points applied!", variant: "success" });
  } catch (err: any) {
    toast({ title: err.response?.data?.message || "Failed to apply points", variant: "destructive" });
  } finally {
    applyingPoints.value = false;
  }
}

async function removePoints() {
  await cartStore.removePoints();
}

async function applyCoupon() {
  if (!couponCode.value.trim() || applyingCoupon.value) return;
  applyingCoupon.value = true;
  try {
    await cartStore.applyCoupon(couponCode.value.trim());
    couponCode.value = "";
    toast({ title: "Coupon applied!", variant: "success" });
  } catch {
    toast({ title: "Invalid coupon code", variant: "destructive" });
  } finally {
    applyingCoupon.value = false;
  }
}

async function removeCoupon() {
  await cartStore.removeCoupon();
}
</script>

<template>
  <div
    v-if="cartStore.summary"
    class="bg-card rounded-2xl border border-border/50 card-elevated p-6 space-y-4"
  >
    <h3 class="font-semibold text-foreground text-base">Order Summary</h3>

    <div class="space-y-2.5 text-sm">
      <div class="flex justify-between text-muted-foreground">
        <span>Subtotal ({{ cartStore.summary.itemCount }} items)</span>
        <PriceComponent :amount="cartStore.summary.subtotal" size="sm" />
      </div>
      <div class="flex justify-between text-muted-foreground">
        <span>Shipping</span>
        <span
          v-if="cartStore.summary.shipping === 0"
          class="text-green-600 font-medium"
          >Free</span
        >
        <PriceComponent v-else :amount="cartStore.summary.shipping" size="sm" />
      </div>
      <div class="flex justify-between text-muted-foreground">
        <span>Tax</span>
        <PriceComponent :amount="cartStore.summary.tax" size="sm" />
      </div>
      <div
        v-if="cartStore.summary.couponDiscount > 0"
        class="flex justify-between text-green-600 font-medium"
      >
        <span class="flex items-center gap-1.5">
          <Tag :size="13" />
          Coupon ({{ cartStore.coupon?.code }})
        </span>
        <span
          >-
          <PriceComponent :amount="cartStore.summary.couponDiscount" size="sm"
        /></span>
      </div>
      <div
        v-if="cartStore.summary.pointsDiscount && cartStore.summary.pointsDiscount > 0"
        class="flex justify-between text-primary font-medium"
      >
        <span class="flex items-center gap-1.5">
          Loyalty Points ({{ cartStore.cart?.pointsUsed }})
        </span>
        <span
          >-
          <PriceComponent :amount="cartStore.summary.pointsDiscount" size="sm"
        /></span>
      </div>
    </div>

    <Separator />

    <div class="flex justify-between font-bold text-foreground text-base">
      <span>Total</span>
      <PriceComponent :amount="cartStore.summary.total" size="md" />
    </div>

    <div v-if="!cartStore.coupon" class="pt-1">
      <div class="flex gap-2 flex-wrap">
        <input
          v-model="couponCode"
          @keydown.enter="applyCoupon"
          type="text"
          placeholder="Promo code"
          class="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button
          @click="applyCoupon"
          :disabled="applyingCoupon || !couponCode.trim()"
          class="lg:flex-1 xl:flex-none px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {{ applyingCoupon ? "…" : "Apply" }}
        </button>
      </div>
    </div>
    <div
      v-else
      class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 text-sm"
    >
      <span class="flex items-center gap-2 text-green-700 font-medium">
        <Tag :size="13" />
        {{ cartStore.coupon.code }} applied
      </span>
      <button
        @click="removeCoupon"
        class="text-green-600 hover:text-green-800 transition-colors"
      >
        <X :size="14" />
      </button>
    </div>

    <!-- Loyalty Points Section -->
    <div v-if="authStore.user" class="pt-1">
      <div v-if="!(cartStore.cart?.pointsUsed && cartStore.cart?.pointsUsed > 0)">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-muted-foreground">Available Points</span>
          <span class="font-bold text-primary">{{ authStore.user.rewardPoints || 0 }}</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input
            v-model="pointsToApply"
            @keydown.enter="applyPoints"
            type="number"
            min="1"
            :max="authStore.user.rewardPoints || 0"
            placeholder="Points to use"
            class="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            @click="applyPoints"
            :disabled="applyingPoints || !pointsToApply || Number(pointsToApply) <= 0 || Number(pointsToApply) > (authStore.user.rewardPoints || 0)"
            class="lg:flex-1 xl:flex-none px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            {{ applyingPoints ? "…" : "Redeem" }}
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 text-sm"
      >
        <span class="flex items-center gap-2 text-primary font-medium">
          {{ cartStore.cart.pointsUsed }} points applied
        </span>
        <button
          @click="removePoints"
          class="text-primary hover:text-primary/70 transition-colors"
        >
          <X :size="14" />
        </button>
      </div>
    </div>

    <slot name="actions" />
  </div>
</template>
