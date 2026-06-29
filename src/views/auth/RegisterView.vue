<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, ArrowRight, Loader2, Check, Gift, Truck, BadgePercent, HeartHandshake } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { registerSchema } from '@/lib/validators'

const authStore = useAuthStore()
const { toast } = useToast()
const router = useRouter()

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const registered = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    await authStore.register(values)
    registered.value = true
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed. Please try again.'
    toast({ title: 'Registration failed', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
})

const benefits = [
  { icon: Gift, text: 'Exclusive member discounts & early access' },
  { icon: Truck, text: 'Free shipping on orders over $99' },
  { icon: BadgePercent, text: 'Earn rewards on every purchase' },
  { icon: HeartHandshake, text: 'Priority customer support 24/7' },
]
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left: AI Hero Image Panel -->
    <div class="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-shrink-0">
      <!-- Background Image -->
      <img
        src="/auth-hero.png"
        alt="Lumina premium shopping experience"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />
      <!-- Dark solid overlay (No Gradients) -->
      <div class="absolute inset-0 bg-primary/80" />

      <!-- Content Overlay -->
      <div class="relative z-10 flex flex-col justify-between p-10 w-full">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 border border-white/25 backdrop-blur-sm">
            <span class="font-bold text-lg text-white">L</span>
          </div>
          <span class="font-bold text-xl text-white tracking-tight">Lumina</span>
        </RouterLink>

        <!-- Main Content -->
        <div class="max-w-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/10 border border-white/20 backdrop-blur-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-xs text-white/80 font-medium">Join thousands of shoppers</span>
          </div>
          <h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Start your<br />premium<br />
            <span class="text-white underline decoration-orange-400 decoration-3 underline-offset-4">journey</span>
          </h2>
          <p class="text-white/70 text-sm leading-relaxed mb-8">
            Join Lumina and discover a world of curated premium products, exclusive deals, and seamless checkouts.
          </p>

          <!-- Benefits List -->
          <div class="space-y-3.5">
            <div
              v-for="benefit in benefits"
              :key="benefit.text"
              class="flex items-center gap-3"
            >
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/15">
                <component :is="benefit.icon" :size="15" class="text-white/85" />
              </div>
              <span class="text-white/80 text-sm font-medium">{{ benefit.text }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom tagline -->
        <p class="text-white/40 text-xs">© 2026 Lumina. All rights reserved.</p>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-10 xl:p-12 overflow-y-auto">
      <div class="w-full max-w-[420px] py-6">
        <!-- Mobile Logo -->
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Lumina</span>
        </RouterLink>

        <!-- Success State -->
        <Transition name="fade">
          <div v-if="registered" class="text-center py-10">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary text-white shadow-lg">
              <Check :size="32" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Account Created!</h2>
            <p class="text-muted-foreground mb-8 max-w-xs mx-auto text-sm leading-relaxed">
              We sent a verification link to your email. Please verify your account to start trading.
            </p>
            <RouterLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              <span>Go to Sign In</span>
              <ArrowRight :size="16" />
            </RouterLink>
          </div>
        </Transition>

        <template v-if="!registered">
          <!-- Header -->
          <div class="mb-7">
            <p class="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-3">Get started</p>
            <h1 class="text-3xl xl:text-4xl font-bold text-foreground mb-2 tracking-tight">Create your<br />account</h1>
            <p class="text-muted-foreground text-sm mt-3">
              Already have an account?
              <RouterLink to="/auth/login" class="font-semibold underline underline-offset-2" style="color: oklch(0.45 0.12 295);">
                Sign in
              </RouterLink>
            </p>
          </div>

          <!-- Form -->
          <form @submit="onSubmit" class="space-y-4" novalidate>
            <div class="grid grid-cols-2 gap-3">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">First name</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-first-name"
                      placeholder="Ali"
                      autocomplete="given-name"
                      class="h-11 rounded-xl text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">Last name</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-last-name"
                      placeholder="Hassan"
                      autocomplete="family-name"
                      class="h-11 rounded-xl text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground">Email address</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="h-11 rounded-xl text-sm"
                    style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground">
                  Phone <span class="text-muted-foreground font-normal text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    id="register-phone"
                    type="tel"
                    placeholder="+20 1012 345 678"
                    autocomplete="tel"
                    class="h-11 rounded-xl text-sm"
                    style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground">Password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      id="register-password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      autocomplete="new-password"
                      class="h-11 rounded-xl pr-12 text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    >
                      <component :is="showPassword ? EyeOff : Eye" :size="16" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground">Confirm password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      id="register-confirm-password"
                      :type="showConfirm ? 'text' : 'password'"
                      placeholder="••••••••"
                      autocomplete="new-password"
                      class="h-11 rounded-xl pr-12 text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                    <button
                      type="button"
                      @click="showConfirm = !showConfirm"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <component :is="showConfirm ? EyeOff : Eye" :size="16" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="acceptTerms">
              <FormItem class="flex items-start gap-3 space-y-0 pt-1">
                <FormControl class="mt-0.5">
                  <Checkbox
                    :checked="value"
                    @update:checked="handleChange"
                    id="terms"
                    class="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <div>
                  <FormLabel for="terms" class="text-sm font-normal cursor-pointer text-muted-foreground leading-relaxed">
                    I agree to the
                    <a href="#" class="font-semibold underline underline-offset-2" style="color: oklch(0.45 0.12 295);">Terms of Service</a>
                    and
                    <a href="#" class="font-semibold underline underline-offset-2" style="color: oklch(0.45 0.12 295);">Privacy Policy</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <button
              type="submit"
              id="register-submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl text-white bg-primary font-semibold text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 hover:-translate-y-0.5 mt-2"
            >
              <Loader2 v-if="loading" :size="18" class="animate-spin" />
              <template v-else>
                <span>Create account</span>
                <ArrowRight :size="16" />
              </template>
            </button>
          </form>

          <!-- Social Login -->
          <div class="mt-4">
            <button
              type="button"
              @click="toast({ title: 'Redirecting to Google...', description: 'Starting Google Social Authentication' })"
              class="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-white border border-border text-foreground hover:bg-muted/50 font-semibold text-sm transition-all duration-150 active:scale-98 shadow-sm"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.73l3.88 3c.92-2.77 3.5-4.69 6.88-4.69z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.45c-.28 1.46-1.1 2.69-2.33 3.51l3.62 2.81c2.12-1.95 3.75-4.82 3.75-8.58z"/>
                <path fill="#FBBC05" d="M5.12 10.73c-.23-.69-.36-1.43-.36-2.23s.13-1.54.36-2.23l-3.88-3C.47 5.09 0 6.74 0 8.5s.47 3.41 1.24 5.23l3.88-3z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.1.74-2.51 1.18-4.34 1.18-3.38 0-5.96-1.92-6.88-4.69l-3.88 3C3.2 20.27 7.24 23 12 23z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 300ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
