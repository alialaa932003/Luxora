import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const cartSheetOpen = ref(false)
  const searchOverlayOpen = ref(false)
  const mobileMenuOpen = ref(false)
  const notificationsSheetOpen = ref(false)

  function toggleCartSheet() { cartSheetOpen.value = !cartSheetOpen.value }
  function openCartSheet() { cartSheetOpen.value = true }
  function closeCartSheet() { cartSheetOpen.value = false }

  function toggleSearchOverlay() { searchOverlayOpen.value = !searchOverlayOpen.value }
  function openSearchOverlay() { searchOverlayOpen.value = true }
  function closeSearchOverlay() { searchOverlayOpen.value = false }

  function toggleMobileMenu() { mobileMenuOpen.value = !mobileMenuOpen.value }
  function closeMobileMenu() { mobileMenuOpen.value = false }

  function toggleNotificationsSheet() { notificationsSheetOpen.value = !notificationsSheetOpen.value }
  function closeNotificationsSheet() { notificationsSheetOpen.value = false }

  return {
    cartSheetOpen, searchOverlayOpen, mobileMenuOpen, notificationsSheetOpen,
    toggleCartSheet, openCartSheet, closeCartSheet,
    toggleSearchOverlay, openSearchOverlay, closeSearchOverlay,
    toggleMobileMenu, closeMobileMenu,
    toggleNotificationsSheet, closeNotificationsSheet,
  }
})
