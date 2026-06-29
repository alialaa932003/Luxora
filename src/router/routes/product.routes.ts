import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'product-list',
    component: () => import('@/views/product/ProductListView.vue'),
    meta: { title: 'Products' },
  },
  {
    path: '/products/:slug',
    name: 'product-detail',
    component: () => import('@/views/product/ProductDetailView.vue'),
    meta: { title: 'Product' },
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/category/CategoriesListView.vue'),
    meta: { title: 'Categories' },
  },
  {
    path: '/categories/:slug',
    name: 'category',
    component: () => import('@/views/category/CategoryView.vue'),
    meta: { title: 'Category' },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/SearchResultsView.vue'),
    meta: { title: 'Search Results' },
  },
  {
    path: '/vendors/:storeSlug',
    name: 'vendor-store',
    component: () => import('@/views/vendor/VendorStoreView.vue'),
    meta: { title: 'Store' },
  },
]
