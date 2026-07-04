<script setup lang="ts">
import { onMounted } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import HeroSection from './sections/HeroSection.vue'
import FeaturedCategoriesSection from './sections/FeaturedCategoriesSection.vue'
import FeaturedProductsSection from './sections/FeaturedProductsSection.vue'
import PromoBannerSection from './sections/PromoBannerSection.vue'
import TrendingProductsSection from './sections/TrendingProductsSection.vue'
import BrandsSection from './sections/BrandsSection.vue'
import TrustBadgesSection from './sections/TrustBadgesSection.vue'
import NewsletterSection from './sections/NewsletterSection.vue'

// Title
onMounted(() => { document.title = 'Luxora - Premium Shopping Experience' })
</script>

<template>
  <div class="min-h-screen bg-background">
    <AnnouncementBar />
    <AppNavbar />
    <main>
      <HeroSection />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <PromoBannerSection />
      <TrendingProductsSection />
      <BrandsSection />
      <TrustBadgesSection />
      <NewsletterSection />
    </main>
    <AppFooter />
  </div>
</template>
