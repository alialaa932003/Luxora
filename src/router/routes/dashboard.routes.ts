import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/views/dashboard/DashboardLayout.vue'),
    meta: { requiresAdmin: true },
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'admin-overview',
        component: () => import('@/views/dashboard/OverviewView.vue'),
        meta: { title: 'Admin Overview', requiresAdmin: true },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/dashboard/UsersView.vue'),
        meta: { title: 'Manage Users', requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/dashboard/ProductsView.vue'),
        meta: { title: 'Manage Products', requiresAdmin: true },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/dashboard/OrdersView.vue'),
        meta: { title: 'Manage Orders', requiresAdmin: true },
      },
      {
        path: 'vendors',
        name: 'admin-vendors',
        component: () => import('@/views/dashboard/VendorsView.vue'),
        meta: { title: 'Manage Vendors', requiresAdmin: true },
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('@/views/dashboard/AnalyticsView.vue'),
        meta: { title: 'Analytics', requiresAdmin: true },
      },
    ],
  },
  {
    path: '/seller',
    component: () => import('@/views/dashboard/SellerLayout.vue'),
    meta: { requiresSeller: true },
    redirect: '/seller/overview',
    children: [
      {
        path: 'overview',
        name: 'seller-overview',
        component: () => import('@/views/dashboard/SellerOverviewView.vue'),
        meta: { title: 'Seller Overview', requiresSeller: true },
      },
      {
        path: 'products',
        name: 'seller-products',
        component: () => import('@/views/dashboard/SellerProductsView.vue'),
        meta: { title: 'My Products', requiresSeller: true },
      },
      {
        path: 'orders',
        name: 'seller-orders',
        component: () => import('@/views/dashboard/SellerOrdersView.vue'),
        meta: { title: 'My Orders', requiresSeller: true },
      },
    ],
  },
]
