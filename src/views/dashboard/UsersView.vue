<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Search, ChevronLeft, ChevronRight, Trash2, ShieldCheck, User, Store } from 'lucide-vue-next'
import { adminService } from '@/services/api/admin.service'
import type { AdminUser, AdminPaginatedResult } from '@/types/admin.types'

const loading = ref(true)
const result = ref<AdminPaginatedResult<AdminUser> | null>(null)
const search = ref('')
const roleFilter = ref('all')
const page = ref(1)
const limit = 10

const actionLoadingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const actionLoading = ref(false)

async function fetchUsers(showSpinner = true) {
  if (showSpinner === true) {
    loading.value = true
  }
  try {
    result.value = await adminService.getUsers({ page: page.value, limit, role: roleFilter.value, search: search.value })
  } finally {
    if (showSpinner === true) {
      loading.value = false
    }
  }
}

onMounted(() => fetchUsers(true))
watch([roleFilter, page], () => fetchUsers(true))

let searchTimeout: ReturnType<typeof setTimeout>
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { page.value = 1; fetchUsers(true) }, 350)
}

async function changeRole(userId: string, newRole: 'customer' | 'seller' | 'admin') {
  const user = result.value?.data.find(u => u.id === userId)
  if (!user) return

  const previousRole = user.role
  // Optimistic UI update
  user.role = newRole

  actionLoadingId.value = userId
  try {
    await adminService.updateUserRole(userId, newRole)
    await fetchUsers(false)
  } catch (error) {
    user.role = previousRole
  } finally {
    actionLoadingId.value = null
  }
}

async function confirmDelete(userId: string) {
  actionLoading.value = true
  try {
    await adminService.deleteUser(userId)
    deletingId.value = null
    await fetchUsers(false)
  } finally {
    actionLoading.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(u: AdminUser) {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin:    { bg: 'oklch(0.51 0.22 291 / 0.10)', text: 'oklch(0.51 0.22 291)' },
  seller:   { bg: 'oklch(0.85 0.12 50 / 0.15)', text: 'oklch(0.55 0.16 50)' },
  customer: { bg: 'oklch(0.88 0.008 85)', text: 'oklch(0.42 0.015 285)' },
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: oklch(0.14 0.02 280);">Users</h1>
        <p class="text-sm mt-0.5" style="color: oklch(0.52 0.015 285);">
          Manage all registered users · <span class="font-semibold">{{ result?.total ?? 0 }} total</span>
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2" style="color: oklch(0.65 0.015 285);" />
        <input
          v-model="search"
          @input="onSearchInput"
          placeholder="Search by name or email…"
          class="w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2"
          style="background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.14 0.02 280); --tw-ring-color: oklch(0.51 0.22 291 / 0.25);"
        />
      </div>
      <!-- Role filter -->
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="r in ['all', 'customer', 'seller', 'admin']"
          :key="r"
          @click="roleFilter = r; page = 1"
          class="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-150 border"
          :style="roleFilter === r
            ? 'background: oklch(0.51 0.22 291); color: #fff; border-color: oklch(0.51 0.22 291);'
            : 'background: #fff; border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);'"
        >{{ r }}</button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden" style="background: #fff; border-color: oklch(0.88 0.008 85);">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: oklch(0.88 0.008 85); border-top-color: oklch(0.51 0.22 291);" />
      </div>

      <div v-else-if="!result?.data.length" class="text-center py-20">
        <User :size="40" class="mx-auto mb-3" style="color: oklch(0.75 0.015 285);" />
        <p class="font-semibold" style="color: oklch(0.14 0.02 280);">No users found</p>
        <p class="text-sm mt-1" style="color: oklch(0.52 0.015 285);">Try adjusting your filters</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid oklch(0.88 0.008 85); background: oklch(0.975 0.005 85);">
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">User</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Role</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style="color: oklch(0.52 0.015 285);">Orders</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style="color: oklch(0.52 0.015 285);">Spent</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style="color: oklch(0.52 0.015 285);">Joined</th>
              <th class="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wide" style="color: oklch(0.52 0.015 285);">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in result?.data"
              :key="user.id"
              class="transition-colors"
              style="border-bottom: 1px solid oklch(0.93 0.004 85);"
            >
              <!-- User info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                      style="background: oklch(0.51 0.22 291);">
                      {{ getInitials(user) }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold truncate" style="color: oklch(0.14 0.02 280);">{{ user.firstName }} {{ user.lastName }}</p>
                    <div class="flex items-center gap-1.5">
                      <p class="text-xs truncate" style="color: oklch(0.52 0.015 285);">{{ user.email }}</p>
                      <ShieldCheck v-if="user.isEmailVerified" :size="11" style="color: oklch(0.52 0.12 160); flex-shrink: 0;" />
                    </div>
                  </div>
                </div>
              </td>

              <!-- Role (editable via dropdown list) -->
              <td class="px-6 py-4">
                <select
                  :value="user.role"
                  @change="changeRole(user.id, ($event.target as HTMLSelectElement).value as any)"
                  :disabled="actionLoadingId === user.id"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[oklch(0.51_0.22_291)] transition-colors pr-7 appearance-none"
                  style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 8px center;"
                  :style="{ backgroundColor: ROLE_COLORS[user.role]?.bg, color: ROLE_COLORS[user.role]?.text, borderColor: ROLE_COLORS[user.role]?.text + '20' }"
                >
                  <option v-for="r in ['customer', 'seller', 'admin']" :key="r" :value="r"
                    style="background: #fff; color: oklch(0.14 0.02 280);">
                    {{ r }}
                  </option>
                </select>
              </td>

              <!-- Orders -->
              <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">{{ user.totalOrders }}</span>
              </td>

              <!-- Spent -->
              <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-sm font-medium" style="color: oklch(0.14 0.02 280);">${{ user.totalSpent.toFixed(2) }}</span>
              </td>

              <!-- Joined -->
              <td class="px-6 py-4 hidden lg:table-cell text-sm" style="color: oklch(0.52 0.015 285);">{{ formatDate(user.createdAt) }}</td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div v-if="deletingId === user.id" class="flex items-center gap-1.5">
                    <span class="text-xs" style="color: oklch(0.57 0.24 27);">Delete?</span>
                    <button @click="confirmDelete(user.id)" :disabled="actionLoading"
                      class="text-xs px-2 py-1 rounded-lg font-semibold"
                      style="background: oklch(0.57 0.24 27); color: #fff;">Yes</button>
                    <button @click="deletingId = null" class="text-xs px-2 py-1 rounded-lg font-semibold border"
                      style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);">No</button>
                  </div>
                  <button
                    v-else
                    @click="deletingId = user.id"
                    class="w-8 h-8 rounded-xl flex items-center justify-center transition-colors border"
                    style="border-color: oklch(0.88 0.008 85); color: oklch(0.57 0.24 27);"
                    title="Delete user"
                  >
                    <Trash2 :size="13" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-4" style="border-top: 1px solid oklch(0.88 0.008 85);">
          <p class="text-sm" style="color: oklch(0.52 0.015 285);">
            Showing {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, result?.total ?? 0) }} of {{ result?.total ?? 0 }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="page--"
              :disabled="page === 1"
              class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors disabled:opacity-40"
              style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
            >
              <ChevronLeft :size="16" />
            </button>
            <span class="text-sm font-semibold px-3" style="color: oklch(0.14 0.02 280);">{{ page }} / {{ result?.totalPages }}</span>
            <button
              @click="page++"
              :disabled="page === result?.totalPages"
              class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors disabled:opacity-40"
              style="border-color: oklch(0.88 0.008 85); color: oklch(0.52 0.015 285);"
            >
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
