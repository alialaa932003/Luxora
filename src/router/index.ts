import { createRouter, createWebHistory } from 'vue-router'
import { homeRoutes } from './routes/home.routes'
import { authRoutes } from './routes/auth.routes'
import { productRoutes } from './routes/product.routes'
import { cartRoutes, checkoutRoutes } from './routes/cart.routes'
import { accountRoutes } from './routes/account.routes'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    ...homeRoutes,
    ...authRoutes,
    ...productRoutes,
    ...cartRoutes,
    ...checkoutRoutes,
    ...accountRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '404 - Not Found' },
    },
  ],
})

setupGuards(router)

export default router
