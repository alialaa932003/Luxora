<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2, Check, Gift, Truck, BadgePercent, HeartHandshake } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { registerSchema } from '@/lib/validators'

const authStore = useAuthStore();
const { toast } = useToast();
const router = useRouter();

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const registered = ref(false)
const sellerRegistered = ref(false)

const activeRole = ref<'customer' | 'seller'>('customer')

const sellerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, { message: 'You must accept the terms' }),
  storeName: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  storeDescription: z.string().min(10, 'Description must be at least 10 characters').optional().or(z.literal('')),
  businessEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  businessPhone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const activeSchema = computed(() => {
  if (activeRole.value === 'customer') {
    return toTypedSchema(registerSchema)
  }
  return toTypedSchema(sellerSchema)
})

const form = useForm({
  validationSchema: activeSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false as unknown as true,
    storeName: '',
    storeDescription: '',
    businessEmail: '',
    businessPhone: '',
  } as any,
});

const onSubmit = form.handleSubmit(async (formValues) => {
  const values = formValues as any;
  loading.value = true;
  try {
    if (activeRole.value === 'customer') {
      const res = await authStore.register(values)
      if (res.data?.verificationUrl) {
        window.open(res.data.verificationUrl, '_blank')
      }
      registered.value = true
    } else {
      // Single request — role + store info all go together
      await authStore.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
        acceptTerms: values.acceptTerms,
        role: 'seller',
        storeName: values.storeName,
        storeDescription: values.storeDescription || undefined,
        businessEmail: values.businessEmail || undefined,
        businessPhone: values.businessPhone || undefined,
      })
      if (res.data?.verificationUrl) {
        window.open(res.data.verificationUrl, '_blank')
      }
      sellerRegistered.value = true
    }
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Registration failed. Please try again.";
    toast({
      title: "Registration failed",
      description: msg,
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
});

const onGoogleLogin = async (response: any) => {
  if (!response.credential) return;
  
  loading.value = true;
  try {
    await authStore.googleLogin({ credential: response.credential, role: activeRole.value });
    
    if (activeRole.value === 'seller') {
      sellerRegistered.value = true;
    } else {
      registered.value = true;
    }
  } catch (err: unknown) {
    toast({
      title: "Google Sign-in failed",
      description: (err as any)?.response?.data?.message || "An error occurred",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const benefits = [
  { icon: Gift, text: "Exclusive member discounts & early access" },
  { icon: Truck, text: "Free shipping on orders over $99" },
  { icon: BadgePercent, text: "Earn rewards on every purchase" },
  { icon: HeartHandshake, text: "Priority customer support 24/7" },
];
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <div
      class="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden shrink-0"
    >
      <img
        src="/auth-hero.png"
        alt="Luxora premium shopping experience"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-primary/80" />

      <div class="relative z-10 flex flex-col justify-between p-10 w-full">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 border border-white/25 backdrop-blur-sm"
          >
            <span class="font-bold text-lg text-white">L</span>
          </div>
          <span class="font-bold text-xl text-white tracking-tight"
            >Luxora</span
          >
        </RouterLink>

        <div class="max-w-xs">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
            />
            <span class="text-xs text-white/80 font-medium"
              >Join thousands of shoppers</span
            >
          </div>
          <h2
            class="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4"
          >
            Start your<br />premium<br />
            <span
              class="text-white underline decoration-orange-400 decoration-3 underline-offset-4"
              >journey</span
            >
          </h2>
          <p class="text-white/70 text-sm leading-relaxed mb-8">
            Join Luxora and discover a world of curated premium products,
            exclusive deals, and seamless checkouts.
          </p>

          <div class="space-y-3.5">
            <div
              v-for="benefit in benefits"
              :key="benefit.text"
              class="flex items-center gap-3"
            >
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/15"
              >
                <component
                  :is="benefit.icon"
                  :size="15"
                  class="text-white/85"
                />
              </div>
              <span class="text-white/80 text-sm font-medium">{{
                benefit.text
              }}</span>
            </div>
          </div>
        </div>

        <p class="text-white/40 text-xs">© 2026 Luxora. All rights reserved.</p>
      </div>
    </div>

    <div
      class="flex-1 flex items-center justify-center p-6 lg:p-10 xl:p-12 overflow-y-auto"
    >
      <div class="w-full max-w-105 py-6">
        <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
          <div
            class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"
          >
            <span class="text-white font-bold">L</span>
          </div>
          <span class="font-bold text-xl text-foreground">Luxora</span>
        </RouterLink>

        <Transition name="fade">
          <div v-if="registered" class="text-center py-10">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary text-white shadow-lg"
            >
              <Check :size="32" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">
              Account Created!
            </h2>
            <p
              class="text-muted-foreground mb-8 max-w-xs mx-auto text-sm leading-relaxed"
            >
              We sent a verification link to your email. Please verify your
              account to start trading.
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

        <!-- Seller Success State -->
        <Transition name="fade">
          <div v-if="sellerRegistered" class="text-center py-10">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-500 text-white shadow-lg">
              <Check :size="32" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Application Submitted!</h2>
            <p class="text-muted-foreground mb-8 max-w-xs mx-auto text-sm leading-relaxed">
              Your application to become a seller has been submitted successfully. An administrator will review your store details and approve your account shortly!
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

        <template v-if="!registered && !sellerRegistered">
          <!-- Header -->
          <div class="mb-7">
            <p
              class="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-3"
            >
              Get started
            </p>
            <h1
              class="text-3xl xl:text-4xl font-bold text-foreground mb-2 tracking-tight"
            >
              Create your<br />account
            </h1>
            <p class="text-muted-foreground text-sm mt-3">
              Already have an account?
              <RouterLink
                to="/auth/login"
                class="font-semibold underline underline-offset-2"
                style="color: oklch(0.45 0.12 295)"
              >
                Sign in
              </RouterLink>
            </p>
          </div>

          <!-- Role Selector Tabs -->
          <div class="flex p-1 bg-muted rounded-xl mb-6 border border-input" style="background: oklch(0.96 0.008 85);">
            <button
              type="button"
              @click="activeRole = 'customer'"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :style="activeRole === 'customer' ? 'background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1); color: oklch(0.14 0.02 280);' : 'color: oklch(0.52 0.015 285);'"
            >
              Customer
            </button>
            <button
              type="button"
              @click="activeRole = 'seller'"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :style="activeRole === 'seller' ? 'background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1); color: oklch(0.14 0.02 280);' : 'color: oklch(0.52 0.015 285);'"
            >
              Seller Partner
            </button>
          </div>

          <!-- Form -->
          <form @submit="onSubmit" class="space-y-4" novalidate>
            <div class="grid grid-cols-2 gap-3">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground"
                    >First name</FormLabel
                  >
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-first-name"
                      placeholder="Ali"
                      autocomplete="given-name"
                      class="h-11 rounded-xl text-sm"
                      style="
                        background: oklch(0.975 0.006 85);
                        border-color: oklch(0.88 0.008 85);
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground"
                    >Last name</FormLabel
                  >
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-last-name"
                      placeholder="Hassan"
                      autocomplete="family-name"
                      class="h-11 rounded-xl text-sm"
                      style="
                        background: oklch(0.975 0.006 85);
                        border-color: oklch(0.88 0.008 85);
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground"
                  >Email address</FormLabel
                >
                <FormControl>
                  <Input
                    v-bind="componentField"
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="h-11 rounded-xl text-sm"
                    style="
                      background: oklch(0.975 0.006 85);
                      border-color: oklch(0.88 0.008 85);
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground">
                  Phone
                  <span class="text-muted-foreground font-normal text-xs"
                    >(optional)</span
                  >
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    id="register-phone"
                    type="tel"
                    placeholder="+20 1012 345 678"
                    autocomplete="tel"
                    class="h-11 rounded-xl text-sm"
                    style="
                      background: oklch(0.975 0.006 85);
                      border-color: oklch(0.88 0.008 85);
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-sm font-semibold text-foreground"
                  >Password</FormLabel
                >
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      id="register-password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      autocomplete="new-password"
                      class="h-11 rounded-xl pr-12 text-sm"
                      style="
                        background: oklch(0.975 0.006 85);
                        border-color: oklch(0.88 0.008 85);
                      "
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      :aria-label="
                        showPassword ? 'Hide password' : 'Show password'
                      "
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
                <FormLabel class="text-sm font-semibold text-foreground"
                  >Confirm password</FormLabel
                >
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      id="register-confirm-password"
                      :type="showConfirm ? 'text' : 'password'"
                      placeholder="••••••••"
                      autocomplete="new-password"
                      class="h-11 rounded-xl pr-12 text-sm"
                      style="
                        background: oklch(0.975 0.006 85);
                        border-color: oklch(0.88 0.008 85);
                      "
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

            <!-- Seller Specific Fields -->
            <div v-if="activeRole === 'seller'" class="space-y-4 pt-4 border-t border-dashed border-input mt-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Store Information</h3>

              <FormField v-slot="{ componentField }" name="storeName">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">Store Name</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-store-name"
                      placeholder="My Premium Store"
                      class="h-11 rounded-xl text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="businessEmail">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">
                    Business Email <span class="text-muted-foreground font-normal text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-business-email"
                      type="email"
                      placeholder="partners@mystore.com"
                      class="h-11 rounded-xl text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="businessPhone">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">
                    Business Phone <span class="text-muted-foreground font-normal text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      id="register-business-phone"
                      type="tel"
                      placeholder="+20 100 000 0000"
                      class="h-11 rounded-xl text-sm"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85);"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="storeDescription">
                <FormItem>
                  <FormLabel class="text-sm font-semibold text-foreground">
                    Store Description <span class="text-muted-foreground font-normal text-xs">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      v-bind="componentField"
                      id="register-store-description"
                      placeholder="Describe what you plan to sell on Lumina..."
                      rows="3"
                      class="w-full p-3 rounded-xl text-sm border focus:ring-1 focus:outline-none"
                      style="background: oklch(0.975 0.006 85); border-color: oklch(0.88 0.008 85); resize: none;"
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ value, handleChange, errorMessage }" name="acceptTerms">
              <FormItem class="flex items-start gap-3 space-y-0 pt-1">
                <FormControl class="mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    :checked="value"
                    @change="handleChange(!value)"
                    class="size-4 rounded border border-input accent-primary cursor-pointer"
                  />
                </FormControl>
                <div>
                  <FormLabel
                    for="acceptTerms"
                    class="text-sm font-normal cursor-pointer text-muted-foreground leading-relaxed"
                  >
                    I agree to the
                    <a
                      href="#"
                      class="font-semibold underline underline-offset-2"
                      style="color: oklch(0.45 0.12 295)"
                      >Terms of Service</a
                    >
                    and
                    <a
                      href="#"
                      class="font-semibold underline underline-offset-2"
                      style="color: oklch(0.45 0.12 295)"
                      >Privacy Policy</a
                    >
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
                <span>{{ activeRole === 'customer' ? 'Create account' : 'Apply as Seller Partner' }}</span>
                <ArrowRight :size="16" />
              </template>
            </button>
          </form>

          <div class="mt-4">
            <GoogleLogin :callback="onGoogleLogin">
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl bg-white border border-border text-foreground hover:bg-muted/50 font-semibold text-sm transition-all duration-150 active:scale-98 shadow-sm"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.73l3.88 3c.92-2.77 3.5-4.69 6.88-4.69z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.45c-.28 1.46-1.1 2.69-2.33 3.51l3.62 2.81c2.12-1.95 3.75-4.82 3.75-8.58z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.12 10.73c-.23-.69-.36-1.43-.36-2.23s.13-1.54.36-2.23l-3.88-3C.47 5.09 0 6.74 0 8.5s.47 3.41 1.24 5.23l3.88-3z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.81c-1.1.74-2.51 1.18-4.34 1.18-3.38 0-5.96-1.92-6.88-4.69l-3.88 3C3.2 20.27 7.24 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </GoogleLogin>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
