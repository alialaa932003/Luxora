<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, Tag, Loader2, Search, Ticket } from 'lucide-vue-next'
import { couponsService } from '@/services/api/coupons.service'
import type { Coupon } from '@/services/api/coupons.service'
import { useToast } from '@/composables/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { toast } = useToast()
const loading = ref(true)
const coupons = ref<Coupon[]>([])
const search = ref('')

// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const actionLoading = ref(false)
const currentCoupon = ref<Partial<Coupon>>({
  code: '',
  type: 'percentage',
  value: 10,
  minimumPurchase: 0,
  usageLimit: 0,
  perUserLimit: 1,
  isActive: true,
})
const hasExpiry = ref(false)
let editId = ''

async function fetchCoupons(showSpinner = true) {
  if (showSpinner) loading.value = true
  try {
    coupons.value = await couponsService.getAll()
  } finally {
    if (showSpinner) loading.value = false
  }
}

onMounted(() => fetchCoupons())

function openCreateModal() {
  modalMode.value = 'create'
  hasExpiry.value = false
  currentCoupon.value = {
    code: '',
    type: 'percentage',
    value: 10,
    minimumPurchase: 0,
    usageLimit: 100,
    perUserLimit: 1,
    isActive: true,
    expiresAt: undefined,
  }
  isModalOpen.value = true
}

function openEditModal(c: Coupon) {
  modalMode.value = 'edit'
  editId = c._id
  currentCoupon.value = { ...c }
  if (c.expiresAt) {
    hasExpiry.value = true
    currentCoupon.value.expiresAt = new Date(c.expiresAt).toISOString().split('T')[0]
  } else {
    hasExpiry.value = false
    currentCoupon.value.expiresAt = undefined
  }
  isModalOpen.value = true
}

async function handleSave() {
  if (!currentCoupon.value.code) {
    toast({ title: 'Validation Error', description: 'Coupon code is required', variant: 'destructive' })
    return
  }
  
  actionLoading.value = true
  try {
    const payload = { ...currentCoupon.value }
    if (!hasExpiry.value) {
      payload.expiresAt = null as any // Pass null to remove existing expiry
    }

    if (modalMode.value === 'create') {
      await couponsService.create(payload)
      toast({ title: 'Success', description: 'Coupon created' })
    } else {
      await couponsService.update(editId, payload)
      toast({ title: 'Success', description: 'Coupon updated' })
    }
    isModalOpen.value = false
    await fetchCoupons(false)
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to save coupon',
      variant: 'destructive'
    })
  } finally {
    actionLoading.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this coupon?')) return
  
  try {
    await couponsService.delete(id)
    toast({ title: 'Success', description: 'Coupon deleted' })
    await fetchCoupons(false)
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Failed to delete coupon',
      variant: 'destructive'
    })
  }
}

function formatValue(c: Partial<Coupon>) {
  if (c.type === 'percentage') return `${c.value}%`
  return `$${c.value}`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Coupons</h1>
        <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
          Manage discount coupons and promo codes · <span class="font-semibold">{{ coupons.length }} total</span>
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
        style="background: oklch(0.51 0.22 291);"
      >
        <Plus :size="16" />
        Create Coupon
      </button>
    </div>

    <!-- Search -->
    <div class="flex flex-col gap-3">
      <div class="relative max-w-sm">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
        <input
          v-model="search"
          placeholder="Search by code..."
          class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291)]"
          style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280);"
        />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
    </div>
    <div v-else-if="coupons.length === 0" class="text-center py-20 bg-white rounded-2xl border" style="border-color: oklch(0.88 0.008 85);">
      <Ticket :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
      <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No coupons found</p>
      <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Get started by creating a new promo code.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="coupon in coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()))"
        :key="coupon._id"
        class="bg-white rounded-2xl p-5 border flex flex-col transition-all duration-300"
        style="border-color: oklch(0.88 0.008 85);"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50 border border-green-100">
              <Ticket :size="20" class="text-green-600" />
            </div>
            <div>
              <h3 class="font-bold text-lg tracking-wide uppercase" style="color: oklch(0.14 0.02 280);">{{ coupon.code }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {{ formatValue(coupon) }} OFF
                </span>
                <span v-if="!coupon.isActive" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                  Inactive
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(coupon)" class="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
              <Edit :size="16" />
            </button>
            <button @click="handleDelete(coupon._id)" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2 text-gray-600">
          <div class="flex justify-between">
            <span class="text-gray-500">Min Purchase</span>
            <span class="font-medium">${{ coupon.minimumPurchase }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Usage</span>
            <span class="font-medium">{{ coupon.usageCount }} / {{ coupon.usageLimit || '∞' }}</span>
          </div>
          <div class="flex justify-between" v-if="coupon.expiresAt">
            <span class="text-gray-500">Expires</span>
            <span class="font-medium text-red-500">{{ new Date(coupon.expiresAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ modalMode === 'create' ? 'Create Coupon' : 'Edit Coupon' }}</DialogTitle>
        <DialogDescription>
          {{ modalMode === 'create' ? 'Add a new promo code.' : 'Update the coupon details.' }}
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="code">Coupon Code</Label>
          <Input id="code" v-model="currentCoupon.code" placeholder="SUMMER20" class="uppercase" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="type">Type</Label>
            <select v-model="currentCoupon.type" id="type" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div class="grid gap-2">
            <Label for="value">Value</Label>
            <Input id="value" type="number" v-model="currentCoupon.value" />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="minPurchase">Minimum Purchase ($)</Label>
          <Input id="minPurchase" type="number" v-model="currentCoupon.minimumPurchase" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="limit">Total Usage Limit</Label>
            <Input id="limit" type="number" v-model="currentCoupon.usageLimit" placeholder="Optional" />
          </div>
          <div class="grid gap-2">
            <Label for="userLimit">Per-User Limit</Label>
            <Input id="userLimit" type="number" v-model="currentCoupon.perUserLimit" />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <input type="checkbox" id="active" v-model="currentCoupon.isActive" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <Label for="active" class="font-normal cursor-pointer">Coupon is active</Label>
        </div>
        <div class="space-y-3 mt-2 pt-4 border-t border-border">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="hasExpiry" v-model="hasExpiry" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <Label for="hasExpiry" class="font-semibold cursor-pointer">Has expiration date</Label>
          </div>
          <div v-if="hasExpiry" class="grid gap-2">
            <Label for="expiresAt">Expiration Date</Label>
            <Input id="expiresAt" type="date" v-model="currentCoupon.expiresAt" />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <button
          @click="isModalOpen = false"
          class="h-9 px-4 rounded-md border text-sm font-medium hover:bg-accent"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="actionLoading"
          class="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center min-w-[100px]"
        >
          <Loader2 v-if="actionLoading" class="w-4 h-4 animate-spin" />
          <span v-else>Save Changes</span>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
