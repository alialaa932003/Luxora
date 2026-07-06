<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Package, ChevronLeft, MapPin, Truck, Calendar, ShoppingBag, XCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import PriceComponent from '@/components/common/commerce/PriceComponent.vue'

const route = useRoute();
const router = useRouter();
const { toast } = useToast();

const orderId = computed(() => route.params.orderId as string);
const loading = ref(true);

// Mock orders database
const ordersDb = ref<Record<string, any>>({
  ord_001: {
    id: "ord_001",
    orderNumber: "ORD-20260115-7845",
    status: "delivered",
    createdAt: "2026-05-15T14:00:00Z",
    shippingAddress: {
      firstName: "Ali",
      lastName: "Hassan",
      addressLine1: "Room 402, Oak Residence",
      city: "Stanford",
      state: "CA",
      postalCode: "94305",
      country: "US",
    },
    items: [
      {
        id: "item_1",
        name: "Sony WH-1000XM4 Headphones",
        thumbnail:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
        price: 180.0,
        quantity: 1,
      },
      {
        id: "item_2",
        name: "Calculus: Early Transcendentals (8th ed.)",
        thumbnail:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop",
        price: 38.0,
        quantity: 1,
      },
    ],
    subtotal: 218.0,
    shipping: 10.0,
    discount: 15.0, // applied coupon
    total: 213.0,
  },
  ord_002: {
    id: "ord_002",
    orderNumber: "ORD-20260220-3321",
    status: "shipped",
    createdAt: "2026-06-20T10:00:00Z",
    shippingAddress: {
      firstName: "Ali",
      lastName: "Hassan",
      addressLine1: "Room 402, Oak Residence",
      city: "Stanford",
      state: "CA",
      postalCode: "94305",
      country: "US",
    },
    items: [
      {
        id: "item_3",
        name: "Vintage City Bike — Lavender",
        thumbnail:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=150&h=150&fit=crop",
        price: 250.0,
        quantity: 1,
      },
    ],
    subtotal: 250.0,
    shipping: 25.0,
    discount: 0.0,
    total: 275.0,
  },
  ord_003: {
    id: "ord_003",
    orderNumber: "ORD-20260625-1109",
    status: "pending",
    createdAt: "2026-06-25T08:00:00Z",
    shippingAddress: {
      firstName: "Ali",
      lastName: "Hassan",
      addressLine1: "Room 402, Oak Residence",
      city: "Stanford",
      state: "CA",
      postalCode: "94305",
      country: "US",
    },
    items: [
      {
        id: "item_4",
        name: "CS Society Hackathon Kit",
        thumbnail:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&h=150&fit=crop",
        price: 18.0,
        quantity: 1,
      },
    ],
    subtotal: 18.0,
    shipping: 5.0,
    discount: 0.0,
    total: 23.0,
  },
});

const order = computed(() => ordersDb.value[orderId.value]);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    if (order.value) {
      document.title = `Order ${order.value.orderNumber} - Luxora`;
    }
  }, 350);
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Stepper items based on status
const steps = [
  { key: "pending", label: "Order Placed", desc: "Awaiting confirmation" },
  { key: "confirmed", label: "Confirmed", desc: "Preparing item" },
  { key: "shipped", label: "Shipped", desc: "Out for delivery" },
  { key: "delivered", label: "Delivered", desc: "Handed to resident" },
];

const currentStepIndex = computed(() => {
  if (!order.value) return 0;
  const status = order.value.status;
  if (status === "pending") return 0;
  if (status === "processing" || status === "confirmed") return 1;
  if (status === "shipped") return 2;
  if (status === "delivered") return 3;
  return -1; // Cancelled
});

function cancelOrder() {
  if (!order.value) return;
  order.value.status = "cancelled";
  toast({
    title: "Order Cancelled",
    description: `Order ${order.value.orderNumber} has been successfully cancelled.`,
  });
}
</script>

<template>
  <div class="py-2">
    <RouterLink
      to="/account/orders"
      class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-all duration-150"
    >
      <ChevronLeft :size="16" />
      <span>Back to My Orders</span>
    </RouterLink>

    <div v-if="loading" class="flex items-center justify-center py-24">
      <Loader2 :size="28" class="animate-spin text-primary" />
    </div>

    <div
      v-else-if="!order"
      class="text-center py-20 bg-white border border-border/50 rounded-3xl"
    >
      <XCircle :size="36" class="mx-auto text-destructive mb-3" />
      <h2 class="text-lg font-bold text-foreground">Order not found</h2>
      <p class="text-xs text-muted-foreground mt-1">
        Please verify the order ID or go back to history.
      </p>
    </div>

    <div v-else class="space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-border/40 rounded-3xl shadow-sm"
      >
        <div class="flex items-start gap-3.5">
          <div
            class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
          >
            <Package :size="22" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-extrabold text-foreground leading-none">
                {{ order.orderNumber }}
              </h1>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize leading-none"
                :class="
                  order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-700'
                    : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : order.status === 'shipped'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-amber-100 text-amber-700'
                "
              >
                {{ order.status }}
              </span>
            </div>
            <p
              class="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5"
            >
              <Calendar :size="12" />
              <span>Placed on {{ formatDate(order.createdAt) }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            v-if="order.status === 'pending'"
            @click="cancelOrder"
            class="px-4.5 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 hover:text-red-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel Order
          </button>
        </div>
      </div>

      <div
        v-if="order.status !== 'cancelled'"
        class="p-6 md:p-8 bg-white border border-border/40 rounded-3xl shadow-sm"
      >
        <h2
          class="text-sm font-extrabold uppercase tracking-wider text-muted-foreground mb-8"
        >
          Delivery Progress
        </h2>

        <div
          class="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 md:px-4"
        >
          <div
            class="hidden md:block absolute left-10 right-10 top-5 h-[3px] bg-muted/60 z-0"
          >
            <div
              class="h-full bg-primary transition-all duration-500 z-10"
              :style="{ width: `${(currentStepIndex / 3) * 100}%` }"
            />
          </div>

          <div
            v-for="(step, idx) in steps"
            :key="step.key"
            class="flex md:flex-col items-center gap-4 md:gap-2.5 z-10 relative md:text-center group flex-1"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-extrabold text-sm border-2"
              :class="
                idx <= currentStepIndex
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white border-muted-foreground/30 text-muted-foreground/50'
              "
            >
              <CheckCircle2 v-if="idx < currentStepIndex" :size="18" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex flex-col md:items-center">
              <span
                class="text-sm font-extrabold text-foreground leading-tight"
                >{{ step.label }}</span
              >
              <span
                class="text-[10px] text-muted-foreground mt-0.5 max-w-[130px]"
                >{{ step.desc }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="p-5 bg-red-50/50 border border-red-100 rounded-3xl flex items-center gap-3.5 text-red-700"
      >
        <XCircle :size="20" class="shrink-0" />
        <div>
          <p class="text-sm font-bold">This order has been cancelled</p>
          <p class="text-xs text-red-600/90 mt-0.5">
            Refunds or listings changes have been processed. No further action
            is required.
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-12 gap-6">
        <div
          class="md:col-span-7 bg-white border border-border/40 rounded-3xl p-6 shadow-sm space-y-4"
        >
          <h2
            class="text-sm font-extrabold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/30"
          >
            Order Items
          </h2>
          <div class="divide-y divide-border/35">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div class="flex items-center gap-3.5">
                <div
                  class="w-14 h-14 rounded-2xl overflow-hidden border border-border/40 bg-muted/20 shrink-0"
                >
                  <img
                    :src="item.thumbnail"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p
                    class="font-bold text-foreground text-sm line-clamp-1 leading-tight"
                  >
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    Qty: {{ item.quantity }}
                  </p>
                </div>
              </div>
              <PriceComponent
                :amount="item.price"
                class="text-sm font-bold text-foreground"
              />
            </div>
          </div>
        </div>

        <div class="md:col-span-5 flex flex-col gap-6">
          <div
            class="bg-white border border-border/40 rounded-3xl p-6 shadow-sm flex flex-col gap-3.5"
          >
            <h2
              class="text-sm font-extrabold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/30"
            >
              Delivery Address
            </h2>
            <div class="flex items-start gap-2.5">
              <MapPin
                :size="16"
                class="text-muted-foreground mt-0.5 shrink-0"
              />
              <div
                class="text-xs text-foreground font-semibold leading-relaxed"
              >
                <p class="font-bold">
                  {{ order.shippingAddress.firstName }}
                  {{ order.shippingAddress.lastName }}
                </p>
                <p class="text-muted-foreground mt-0.5">
                  {{ order.shippingAddress.addressLine1 }}
                </p>
                <p class="text-muted-foreground">
                  {{ order.shippingAddress.city }},
                  {{ order.shippingAddress.state }}
                  {{ order.shippingAddress.postalCode }}
                </p>
                <p class="text-muted-foreground">
                  {{ order.shippingAddress.country }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white border border-border/40 rounded-3xl p-6 shadow-sm flex flex-col gap-3.5"
          >
            <h2
              class="text-sm font-extrabold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/30"
            >
              Payment Summary
            </h2>
            <div class="space-y-2.5 text-xs">
              <div
                class="flex justify-between font-semibold text-muted-foreground"
              >
                <span>Subtotal</span>
                <span>${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div
                class="flex justify-between font-semibold text-muted-foreground"
              >
                <span>Shipping</span>
                <span>${{ order.shipping.toFixed(2) }}</span>
              </div>
              <div
                v-if="order.discount > 0"
                class="flex justify-between font-semibold text-emerald-600"
              >
                <span>Discount (Coupon)</span>
                <span>-${{ order.discount.toFixed(2) }}</span>
              </div>
              <div class="h-px bg-border/40 my-2" />
              <div
                class="flex justify-between text-sm font-extrabold text-foreground"
              >
                <span>Total Amount</span>
                <span class="text-primary">${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
