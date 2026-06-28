import type { RouteRecordRaw } from 'vue-router'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/account',
    component: () => import('@/views/account/AccountLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/account/profile',
    children: [
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('@/views/account/ProfileView.vue'),
        meta: { title: 'My Profile', requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'account-orders',
        component: () => import('@/views/account/OrderListView.vue'),
        meta: { title: 'My Orders', requiresAuth: true },
      },
      {
        path: 'orders/:orderId',
        name: 'account-order-detail',
        component: () => import('@/views/account/OrderDetailView.vue'),
        meta: { title: 'Order Details', requiresAuth: true },
      },
      {
        path: 'wishlist',
        name: 'account-wishlist',
        component: () => import('@/views/account/WishlistView.vue'),
        meta: { title: 'My Wishlist', requiresAuth: true },
      },
      {
        path: 'reviews',
        name: 'account-reviews',
        component: () => import('@/views/account/MyReviewsView.vue'),
        meta: { title: 'My Reviews', requiresAuth: true },
      },
      {
        path: 'security',
        name: 'account-security',
        component: () => import('@/views/account/SecurityView.vue'),
        meta: { title: 'Security', requiresAuth: true },
      },
    ],
  },
]
