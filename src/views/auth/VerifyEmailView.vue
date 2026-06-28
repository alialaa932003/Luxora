<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Check, XCircle, Loader2, MailOpen } from '@lucide/vue'
import { authService } from '@/services/api/auth.service'

const route = useRoute()
const status = ref<'loading' | 'success' | 'error' | 'no-token'>('loading')

onMounted(async () => {
  const token = route.query.token as string | undefined
  if (!token) {
    status.value = 'no-token'
    return
  }
  try {
    await authService.verifyEmail(token)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center gradient-hero p-6">
    <div class="w-full max-w-md text-center">
      <!-- Loading -->
      <div v-if="status === 'loading'" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p class="text-muted-foreground">Verifying your email…</p>
      </div>

      <!-- Success -->
      <Transition name="fade">
        <div v-if="status === 'success'" class="flex flex-col items-center gap-6">
          <div class="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg">
            <Check :size="36" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
            <p class="text-muted-foreground">Your account is now active. Sign in to start shopping.</p>
          </div>
          <RouterLink
            to="/auth/login"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </RouterLink>
        </div>
      </Transition>

      <!-- Error -->
      <div v-if="status === 'error'" class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle :size="36" class="text-destructive" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-foreground mb-2">Link Expired</h1>
          <p class="text-muted-foreground">This verification link is invalid or has expired.</p>
        </div>
        <RouterLink
          to="/auth/login"
          class="text-primary font-semibold hover:underline text-sm"
        >
          Return to sign in
        </RouterLink>
      </div>

      <!-- No token -->
      <div v-if="status === 'no-token'" class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <MailOpen :size="36" class="text-muted-foreground" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
          <p class="text-muted-foreground">We sent a verification link to your email address. Click the link to verify your account.</p>
        </div>
        <RouterLink to="/" class="text-primary font-semibold hover:underline text-sm">
          Go to home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 400ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
