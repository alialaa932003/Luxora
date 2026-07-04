<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Check,
  ChevronRight,
  CreditCard,
  Truck,
  ClipboardList,
  Loader2,
} from "lucide-vue-next";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import CartSummary from "@/components/common/commerce/CartSummary.vue";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { paymentService } from "@/services/api/payment.service";
import { ordersService } from "@/services/api/orders.service";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const step = ref<1 | 2 | 3>(1);
const loading = ref(false);

const steps = [
  { id: 1, label: "Payment", icon: CreditCard },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Review", icon: ClipboardList },
];

const shippingForm = ref({
  firstName: authStore.user?.firstName ?? "",
  lastName: authStore.user?.lastName ?? "",
  email: authStore.user?.email ?? "",
  phone: "",
  address: "",
  city: "",
  country: "US",
  postalCode: "",
});

const paymentMethod = ref<"stripe" | "cash_on_delivery">("stripe");
const { toast } = useToast();

async function placeOrder() {
  loading.value = true;
  try {
    const address = {
      firstName: shippingForm.value.firstName,
      lastName: shippingForm.value.lastName,
      phone: shippingForm.value.phone,
      addressLine1: shippingForm.value.address,
      city: shippingForm.value.city,
      postalCode: shippingForm.value.postalCode,
      country: shippingForm.value.country,
    };

    if (paymentMethod.value === "stripe") {
      if (!cartStore.cart?.id) throw new Error("Cart ID missing");
      const res = await paymentService.createStripeCheckoutSession({
        cartId: cartStore.cart.id,
        shippingAddress: address as any,
      });
      window.location.href = res.data.data.url;
    } else {
      await ordersService.place({
        paymentMethod: "cash_on_delivery",
        shippingAddress: address,
      });
      cartStore.clearCart();
      router.push({ name: "order-success" });
    }
  } catch (error: any) {
    console.error("Order placement failed:", error);
    toast({
      title: "Checkout failed",
      description: error.response?.data?.message || "An error occurred during checkout.",
      variant: "destructive"
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-10">
      <h1 class="text-3xl font-extrabold text-foreground tracking-tight mb-8">
        Checkout
      </h1>

      <div class="flex items-center mb-10 gap-0">
        <template v-for="(s, i) in steps" :key="s.id">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2"
              :class="
                step > s.id
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : step === s.id
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white border-border/80 text-muted-foreground/50'
              "
            >
              <Check v-if="step > s.id" :size="16" />
              <component v-else :is="s.icon" :size="16" />
            </div>
            <span
              class="text-sm font-bold hidden sm:block transition-colors"
              :class="
                step === s.id ? 'text-primary' : 'text-muted-foreground/60'
              "
            >
              {{ s.label }}
            </span>
          </div>
          <div
            v-if="i < steps.length - 1"
            class="flex-1 h-px mx-3"
            :class="step > s.id ? 'bg-emerald-500' : 'bg-border/80'"
          />
        </template>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 xl:gap-12">
        <div class="lg:col-span-2">
          <div v-if="step === 1" class="space-y-6">
            <div class="p-6 bg-white rounded-4xl border border-border/40 shadow-sm">
              <h2 class="text-lg font-extrabold text-foreground mb-5">
                Payment Method
              </h2>
              <div class="space-y-3.5">
                <label v-for="method in [{id: 'stripe', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', emoji: '💳'}, {id: 'cash_on_delivery', label: 'Cash on Delivery', desc: 'Pay when you receive', emoji: '💵'}]" :key="method.id" class="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-150" :class="paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-muted/30'">
                  <input type="radio" :value="method.id" v-model="paymentMethod" class="accent-primary" />
                  <span class="text-xl">{{ method.emoji }}</span>
                  <div>
                    <p class="font-extrabold text-sm text-foreground leading-none">{{ method.label }}</p>
                    <p class="text-[11px] text-muted-foreground mt-1">{{ method.desc }}</p>
                  </div>
                </label>
              </div>

              <div v-if="paymentMethod === 'stripe'" class="mt-6 p-4 bg-blue-50 border border-blue-200/60 rounded-2xl animate-in fade-in duration-200 text-blue-800">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 rounded-full text-blue-600">
                    <CreditCard :size="20" />
                  </div>
                  <div>
                    <p class="font-bold text-sm">Secure Checkout via Stripe</p>
                    <p class="text-xs opacity-80 mt-0.5">
                      You will be securely redirected to Stripe to provide your shipping address and complete your payment.
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="paymentMethod === 'cash_on_delivery'" class="mt-6 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl animate-in fade-in duration-200 text-emerald-800">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-emerald-100 rounded-full text-emerald-600">
                    <Truck :size="20" />
                  </div>
                  <div>
                    <p class="font-bold text-sm">Cash on Delivery</p>
                    <p class="text-xs opacity-80 mt-0.5">
                      You will pay for your order in cash when the courier delivers it to your address.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button v-if="paymentMethod === 'stripe'" @click="placeOrder" :disabled="loading" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150">
                <Loader2 v-if="loading" :size="18" class="animate-spin" />
                <template v-else>Proceed to Stripe</template>
                <ChevronRight v-if="!loading" :size="16" />
              </button>
              <button v-else @click="step = 2" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all duration-150">
                <span>Continue to Shipping</span>
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>

          <div v-else-if="step === 2" class="space-y-6">
            <div class="p-6 bg-white rounded-4xl border border-border/40 shadow-sm">
              <h2 class="text-lg font-extrabold text-foreground mb-5">
                Shipping Address
              </h2>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">First Name</label>
                  <input v-model="shippingForm.firstName" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="Ali" />
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Last Name</label>
                  <input v-model="shippingForm.lastName" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="Hassan" />
                </div>
                <div class="space-y-1.5 col-span-2">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <input v-model="shippingForm.phone" type="tel" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="+1234567890" />
                </div>
                <div class="space-y-1.5 col-span-2">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Street Address</label>
                  <input v-model="shippingForm.address" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="123 Main Street" />
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">City</label>
                  <input v-model="shippingForm.city" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="Cairo" />
                </div>
                <div class="space-y-1.5 col-span-2 sm:col-span-1">
                  <label class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Postal Code</label>
                  <input v-model="shippingForm.postalCode" class="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary transition-all" placeholder="11511" />
                </div>
              </div>
            </div>
            <div class="flex gap-3">
              <button @click="step = 1" class="px-6 py-3 rounded-xl border border-border text-sm font-bold text-foreground bg-white hover:bg-muted/50 transition-colors">
                Back
              </button>
              <button @click="step = 3" :disabled="!shippingForm.firstName || !shippingForm.lastName || !shippingForm.phone || !shippingForm.address || !shippingForm.city || !shippingForm.postalCode" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150">
                <span>Review Order</span>
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="p-6 bg-white rounded-4xl border border-border/40 shadow-sm space-y-4">
              <h2 class="text-lg font-extrabold text-foreground">
                Order Review
              </h2>
              <div class="text-sm text-muted-foreground space-y-2">
                <p>
                  <span class="font-bold text-foreground">Ship to:</span>
                  {{ shippingForm.firstName }} {{ shippingForm.lastName }},
                  {{ shippingForm.address }}, {{ shippingForm.city }},
                  {{ shippingForm.postalCode }} <br />
                  <span class="font-bold text-foreground">Phone:</span> {{ shippingForm.phone }}
                </p>
                <p>
                  <span class="font-bold text-foreground">Payment Method:</span>
                  <span class="capitalize font-semibold text-primary">Cash on Delivery</span>
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <button @click="step = 2" class="px-6 py-3 rounded-xl border border-border text-sm font-bold text-foreground bg-white hover:bg-muted/50 transition-colors">
                Back
              </button>
              <button @click="placeOrder" :disabled="loading" class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150">
                <Loader2 v-if="loading" :size="18" class="animate-spin" />
                <template v-else>Place Order</template>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CartSummary :show-checkout-button="false" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
