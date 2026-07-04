<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Mail, MapPin, Phone } from "@lucide/vue";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-vue-next";

const footerLinks = {
  shop: [
    { label: "All Products", to: "/products" },
    { label: "New Arrivals", to: "/products?sort=newest" },
    { label: "Best Sellers", to: "/products?sort=popularity" },
    { label: "Sale", to: "/products?featured=true" },
    { label: "Categories", to: "/products" },
  ],
  account: [
    { label: "My Profile", to: "/account/profile" },
    { label: "My Orders", to: "/account/orders" },
    { label: "Wishlist", to: "/account/wishlist" },
    { label: "My Reviews", to: "/account/reviews" },
    { label: "Security", to: "/account/security" },
  ],
  support: [
    { label: "Help Center", to: "#" },
    { label: "Contact Us", to: "#" },
    { label: "Shipping Info", to: "#" },
    { label: "Returns & Exchanges", to: "#" },
    { label: "Track Your Order", to: "/account/orders" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const trustBadges = [
  { icon: "🔒", label: "Secure Payments" },
  { icon: "🚚", label: "Free Shipping" },
  { icon: "↩️", label: "30-Day Returns" },
  { icon: "⭐", label: "Top Rated" },
];
</script>

<template>
  <footer class="bg-foreground text-background/80 mt-24">
    <div class="border-b border-white/10">
      <div class="container mx-auto px-4 lg:px-8 py-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            v-for="badge in trustBadges"
            :key="badge.label"
            class="flex items-center gap-3"
          >
            <span class="text-2xl">{{ badge.icon }}</span>
            <span class="text-sm font-medium text-background/70">{{
              badge.label
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div class="lg:col-span-2">
          <RouterLink to="/" class="flex items-center gap-2 mb-5 group w-fit">
            <div
              class="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"
            >
              <span class="text-white font-bold">L</span>
            </div>
            <span class="font-bold text-2xl text-background tracking-tight"
              >Luxora</span
            >
          </RouterLink>
          <p class="text-background/60 text-sm leading-relaxed max-w-xs mb-6">
            A premium modern marketplace built for people who care about
            quality, design, and community.
          </p>

          <div class="flex flex-col gap-3 mb-8">
            <div class="flex items-center gap-3 text-sm text-background/60">
              <Mail :size="15" class="text-background/40 shrink-0" />
              <span>hello@luxora.shop</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-background/60">
              <Phone :size="15" class="text-background/40 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-background/60">
              <MapPin :size="15" class="text-background/40 shrink-0" />
              <span>Cairo, Egypt</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            >
              <component :is="social.icon" :size="16" />
            </a>
          </div>
        </div>

        <div v-for="(links, section) in footerLinks" :key="section">
          <h4
            class="font-semibold text-background text-sm uppercase tracking-widest mb-5"
          >
            {{ section.charAt(0).toUpperCase() + section.slice(1) }}
          </h4>
          <ul class="flex flex-col gap-3">
            <li v-for="link in links" :key="link.label">
              <RouterLink
                :to="link.to"
                class="text-sm text-background/60 hover:text-background transition-colors duration-200"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div
        class="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-xs text-background/40">
          &copy; {{ new Date().getFullYear() }} Luxora. All rights reserved.
        </p>
        <div class="flex items-center gap-4 text-xs text-background/40">
          <a href="#" class="hover:text-background/70 transition-colors"
            >Privacy Policy</a
          >
          <a href="#" class="hover:text-background/70 transition-colors"
            >Terms of Service</a
          >
          <a href="#" class="hover:text-background/70 transition-colors"
            >Cookie Policy</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
