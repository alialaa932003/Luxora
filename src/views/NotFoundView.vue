<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

// Static content based on the design
const pageTitle = "Uh oh! Nothing found here.";
const pageSubtitle = "Either this page doesn't exist, or it has been moved.";
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />

    <main class="container mx-auto px-4 lg:px-8 py-20">
      <div
        class="max-w-2xl mx-auto flex flex-col items-center text-center gap-6"
      >
        <div class="relative">
          <div
            class="absolute -inset-4 rounded-full bg-primary/10blur-sm"
            aria-hidden="true"
          />
          <div
            class="relative w-32 h-32 rounded-full bg-muted flex items-center justify-center text-primary border border-border/20"
          >
            <svg
              class="w-16 h-16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-4-8 4v7c0 6 8 10 8 10z"></path>
              <line x1="9" y1="12" x2="11" y2="14"></line>
              <line x1="13" y1="14" x2="15" y2="12"></line>
            </svg>
          </div>
        </div>

        <div>
          <h1
            class="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2"
          >
            {{ pageTitle }}
          </h1>
          <p class="text-lg text-muted-foreground max-w-md mx-auto">
            {{ pageSubtitle }}
          </p>
        </div>

        <div
          class="h-px w-full max-w-xs bg-border/20 my-4"
          aria-hidden="true"
        />

        <div class="flex flex-col sm:flex-row gap-3">
          <RouterLink
            to="/"
            class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </RouterLink>
          <RouterLink
            to="/collections"
            class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Browse Collections
          </RouterLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
