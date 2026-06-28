<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, ArrowRight, Loader2 } from '@lucide/vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { loginSchema } from '@/lib/validators'

const authStore = useAuthStore()
const { toast } = useToast()
const router = useRouter()
const route = useRoute()

const showPassword = ref(false)
const loading = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '', rememberMe: false },
})

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    await authStore.login(values)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? { name: 'home' })
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid email or password'
    toast({ title: 'Sign in failed', description: msg, variant: 'destructive' })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex gradient-hero">
    <!-- Left decorative panel (desktop) -->
    <div class="hidden lg:flex lg:flex-1 relative overflow-hidden">
      <div class="absolute inset-0 gradient-primary" />
      <div class="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
        <div class="blob absolute w-96 h-96 bg-white/10 top-1/4 left-1/4" />
        <div class="relative z-10 max-w-sm text-center">
          <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <span class="font-bold text-2xl text-white">L</span>
          </div>
          <h2 class="text-4xl font-bold mb-4 leading-tight">Welcome back to Lumina</h2>
          <p class="text-white/70 text-lg leading-relaxed">
            Your premium shopping destination. Sign in to access your cart, wishlist, and orders.
          </p>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Logo (mobile) -->
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Lumina</span>
        </RouterLink>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">Sign in</h1>
          <p class="text-muted-foreground">
            New to Lumina?
            <RouterLink to="/auth/register" class="text-primary font-semibold hover:underline">
              Create an account
            </RouterLink>
          </p>
        </div>

        <form @submit="onSubmit" class="space-y-5">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="text-sm font-medium">Email address</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="h-12 rounded-xl border-border bg-background px-4 text-sm focus-visible:ring-primary/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <div class="flex items-center justify-between">
                <FormLabel class="text-sm font-medium">Password</FormLabel>
              </div>
              <FormControl>
                <div class="relative">
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="h-12 rounded-xl border-border bg-background px-4 pr-12 text-sm focus-visible:ring-primary/30"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <component :is="showPassword ? EyeOff : Eye" :size="18" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="rememberMe">
            <FormItem class="flex items-center gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  :checked="value"
                  @update:checked="handleChange"
                  id="rememberMe"
                  class="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <FormLabel for="rememberMe" class="text-sm font-normal cursor-pointer text-muted-foreground">
                Keep me signed in
              </FormLabel>
            </FormItem>
          </FormField>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 h-12 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 mt-2"
          >
            <Loader2 v-if="loading" :size="18" class="animate-spin" />
            <template v-else>
              Sign in <ArrowRight :size="16" />
            </template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
