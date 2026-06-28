import type { RouteRecordRaw } from 'vue-router'

export const cartRoutes: RouteRecordRaw[] = [
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/cart/CartView.vue'),
    meta: { title: 'Your Cart' },
  },
]

export const checkoutRoutes: RouteRecordRaw[] = [
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutView.vue'),
    meta: { title: 'Checkout', requiresAuth: true },
  },
  {
    path: '/checkout/success',
    name: 'order-success',
    component: () => import('@/views/checkout/OrderSuccessView.vue'),
    meta: { title: 'Order Placed!', requiresAuth: true },
  },
]
