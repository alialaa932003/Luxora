<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, ArrowRight, Loader2, Check } from '@lucide/vue'
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
</script>

<template>
  <div class="min-h-screen flex gradient-hero">
    <!-- Left decorative panel -->
    <div class="hidden lg:flex lg:flex-1 relative overflow-hidden">
      <div class="absolute inset-0 gradient-primary" />
      <div class="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
        <div class="blob absolute w-96 h-96 bg-white/10 top-1/4 left-1/4" />
        <div class="relative z-10 max-w-sm text-center">
          <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span class="font-bold text-2xl text-white">L</span>
          </div>
          <h2 class="text-4xl font-bold mb-4 leading-tight">Join thousands of shoppers</h2>
          <p class="text-white/70 text-lg leading-relaxed">
            Discover curated products, track your orders, and enjoy a premium shopping experience.
          </p>
          <div class="mt-10 space-y-3 text-left">
            <div v-for="benefit in ['Free shipping on orders over $99', 'Exclusive member discounts', 'Wishlist & order tracking', 'Priority customer support']" :key="benefit" class="flex items-center gap-3 text-white/80">
              <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check :size="11" />
              </div>
              {{ benefit }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form panel -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
      <div class="w-full max-w-md py-8">
        <!-- Logo (mobile) -->
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Lumina</span>
        </RouterLink>

        <!-- Success state -->
        <Transition name="fade">
          <div v-if="registered" class="text-center py-12">
            <div class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
              <Check :size="28" class="text-white" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Account Created!</h2>
            <p class="text-muted-foreground mb-8 max-w-xs mx-auto">
              Please check your email to verify your account before signing in.
            </p>
            <RouterLink
              to="/auth/login"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-all"
            >
              Go to Sign In <ArrowRight :size="16" />
            </RouterLink>
          </div>
        </Transition>

        <template v-if="!registered">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-foreground mb-2">Create account</h1>
            <p class="text-muted-foreground">
              Already have an account?
              <RouterLink to="/auth/login" class="text-primary font-semibold hover:underline">
                Sign in
              </RouterLink>
            </p>
          </div>

          <form @submit="onSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel class="text-sm font-medium">First name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Ali" autocomplete="given-name" class="h-11 rounded-xl text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel class="text-sm font-medium">Last name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Hassan" autocomplete="family-name" class="h-11 rounded-xl text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-medium">Email address</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="email" placeholder="you@example.com" autocomplete="email" class="h-11 rounded-xl text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel class="text-sm font-medium">Phone <span class="text-muted-foreground font-normal">(optional)</span></FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="tel" placeholder="+201012345678" autocomplete="tel" class="h-11 rounded-xl text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input v-bind="componentField" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" autocomplete="new-password" class="h-11 rounded-xl pr-12 text-sm" />
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors" :aria-label="showPassword ? 'Hide' : 'Show'">
                      <component :is="showPassword ? EyeOff : Eye" :size="17" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel class="text-sm font-medium">Confirm password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input v-bind="componentField" :type="showConfirm ? 'text' : 'password'" placeholder="••••••••" autocomplete="new-password" class="h-11 rounded-xl pr-12 text-sm" />
                    <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <component :is="showConfirm ? EyeOff : Eye" :size="17" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="acceptTerms">
              <FormItem class="flex items-start gap-3 space-y-0">
                <FormControl class="mt-0.5">
                  <Checkbox :checked="value" @update:checked="handleChange" id="terms" class="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                </FormControl>
                <div>
                  <FormLabel for="terms" class="text-sm font-normal cursor-pointer text-muted-foreground leading-relaxed">
                    I agree to the
                    <a href="#" class="text-primary hover:underline font-medium">Terms of Service</a>
                    and
                    <a href="#" class="text-primary hover:underline font-medium">Privacy Policy</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 h-12 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 mt-2"
            >
              <Loader2 v-if="loading" :size="18" class="animate-spin" />
              <template v-else>
                Create account <ArrowRight :size="16" />
              </template>
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 300ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
