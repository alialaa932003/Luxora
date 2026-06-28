# E-Commerce Frontend — Full Implementation Plan

## Overview

Vue 3 + TypeScript + Vite + shadcn-vue premium e-commerce storefront.  
Covers: Home flow, Auth flow, Profile flow, Product/Search flow, Cart & Checkout flow, Order flow, Wishlist — with the folder structure pre-shaped to absorb the **Admin Dashboard** and **Seller Portal** later without restructuring.

---

> [!IMPORTANT]
> **Scope of this plan**: Customer-facing storefront only (no admin/seller portal yet).  
> **Excluded per user**: Refresh token flow, Reset/Forgot password flows.  
> **Future-ready**: Folder structure supports Admin + Seller dashboards.

---

## Design System

| Token | Value |
|---|---|
| Primary | Deep Plum `hsl(270 40% 25%)` |
| Primary Light | Royal Violet `hsl(270 50% 50%)` |
| Accent | Warm Peach `hsl(20 80% 70%)` / Muted Gold `hsl(40 60% 60%)` |
| Surface | Warm White `hsl(40 20% 97%)` |
| Card | Ivory `hsl(40 15% 95%)` |
| Text Primary | `hsl(270 10% 10%)` |
| Text Muted | `hsl(270 5% 50%)` |
| Border | `hsl(270 10% 88%)` |
| Font | Plus Jakarta Sans + Inter |
| Radius | Card: 20px · Button: 12px · Input: 10px |
| Shadows | Layered warm-tinted box-shadows |
| Motion | `cubic-bezier(0.4,0,0.2,1)` 200–300ms |

---

## Project Structure (Future-Proof)

```
src/
├── assets/                  # fonts, images, icons
├── components/
│   ├── ui/                  # shadcn-vue base components (extended)
│   ├── layout/              # Navbar, Footer, AnnouncementBar
│   ├── common/              # shared across all flows
│   │   ├── product/         # ProductCard, ProductGrid, ProductGallery
│   │   ├── feedback/        # ReviewCard, RatingComponent, EmptyState, ErrorComponent
│   │   ├── navigation/      # Breadcrumb, MegaMenu, SearchBar
│   │   ├── commerce/        # CartItem, CartSummary, PriceComponent, QuantitySelector
│   │   └── display/         # ImageCarousel, SkeletonLoaders, Badges, Pagination
│   └── forms/               # reusable form field components
├── views/                   # route-level pages
│   ├── home/
│   ├── auth/
│   ├── product/
│   ├── category/
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── account/             # profile, orders, wishlist, reviews
│   ├── vendor/              # public vendor store page
│   ├── dashboard/           # [FUTURE] admin dashboard
│   └── seller/              # [FUTURE] seller portal
├── composables/             # useCart, useWishlist, useAuth, useSearch …
├── stores/                  # Pinia stores (auth, cart, wishlist, ui, notifications)
├── services/                # API layer (axios instances + per-module service files)
│   ├── api/
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── categories.service.ts
│   │   ├── cart.service.ts
│   │   ├── wishlist.service.ts
│   │   ├── orders.service.ts
│   │   ├── reviews.service.ts
│   │   ├── search.service.ts
│   │   ├── users.service.ts
│   │   ├── notifications.service.ts
│   │   └── vendors.service.ts
│   └── http.ts              # axios instance + interceptors
├── router/
│   ├── index.ts
│   ├── guards.ts            # auth guards
│   └── routes/              # split route files per area
│       ├── home.routes.ts
│       ├── auth.routes.ts
│       ├── product.routes.ts
│       ├── account.routes.ts
│       ├── cart.routes.ts
│       └── checkout.routes.ts
├── types/                   # global TypeScript types/interfaces
│   ├── api.types.ts         # response envelope types
│   ├── auth.types.ts
│   ├── product.types.ts
│   ├── cart.types.ts
│   ├── order.types.ts
│   └── user.types.ts
├── lib/
│   ├── utils.ts             # shadcn cn() util
│   └── validators.ts        # zod schemas for forms
├── middleware/              # route-level middleware
└── main.ts
```

---

## Phase Breakdown

---

## Phase 0 — Project Setup & Design System ⚙️

### Steps

- [ ] Install dependencies: `vue-router`, `pinia`, `axios`, `@vueuse/core`, `lucide-vue-next`, `zod`, `@tanstack/vue-query`
- [ ] Install & configure **shadcn-vue** (New York style)
- [ ] Install shadcn-vue components: `button`, `input`, `badge`, `card`, `dialog`, `sheet`, `dropdown-menu`, `tabs`, `accordion`, `skeleton`, `toast`, `avatar`, `separator`, `select`, `checkbox`, `radio-group`, `label`, `form`, `pagination`, `tooltip`, `popover`, `scroll-area`
- [ ] Configure `vite.config.ts` — path aliases `@/`
- [ ] Create `tailwind.config.ts` with custom design tokens (CSS vars mapped to theme)
- [ ] Set up `src/assets/css/globals.css` — design system tokens, typography, base reset
- [ ] Configure `src/lib/utils.ts` — `cn()` helper
- [ ] Set up `src/router/index.ts` with scroll behavior
- [ ] Set up Pinia with `src/stores/`
- [ ] Configure Axios instance `src/services/http.ts` with interceptors + auth header injection
- [ ] Set up `@tanstack/vue-query` for server state
- [ ] Set up global error handler
- [ ] Set up `App.vue` with `<RouterView>`, `<Toaster>`, global layout slot

---

## Phase 1 — Layout Components 🏗️

### Components

#### [NEW] `src/components/layout/AppNavbar.vue`
- Logo, search bar (triggers search sheet/modal), nav links, mega menu trigger
- Cart icon with item count badge (reactive from cart store)
- Wishlist icon with count
- User avatar / login button
- Mobile hamburger → Sheet menu
- Sticky with backdrop blur on scroll

#### [NEW] `src/components/layout/AppFooter.vue`
- Multi-column links
- Newsletter signup (calls newsletter API / local composable)
- Social links
- Trust badges

#### [NEW] `src/components/layout/AnnouncementBar.vue`
- Dismissible top banner for promotions

#### [NEW] `src/components/layout/MegaMenu.vue`
- Fetches categories from store
- Hover-activated full-width dropdown with category images

---

## Phase 2 — Shared UI Component Library 🧩

All components extend shadcn-vue primitives, never rewrite from scratch.

### Navigation
- [ ] `Breadcrumb.vue` — extends shadcn separator
- [ ] `SearchBar.vue` — triggers suggestions from `/api/v1/search/suggestions`
- [ ] `SearchSheet.vue` — full-screen mobile search overlay

### Product Display
- [ ] `ProductCard.vue` — image, title, price, rating, wishlist toggle, quick-add, badges
- [ ] `ProductGrid.vue` — responsive grid wrapper with skeleton state
- [ ] `ProductGallery.vue` — main image + thumbnail strip + zoom
- [ ] `CategoryCard.vue` — image card with editorial typography
- [ ] `BrandCard.vue`
- [ ] `CollectionCard.vue`

### Commerce
- [ ] `PriceComponent.vue` — formatted price, original/sale, currency
- [ ] `RatingComponent.vue` — star rating display + distribution bar
- [ ] `QuantitySelector.vue` — +/- with min/max validation
- [ ] `CartItem.vue` — product row in cart sidebar/page
- [ ] `CartSummary.vue` — subtotal, shipping, tax, coupon, total
- [ ] `WishlistButton.vue` — heart toggle with optimistic update

### Feedback & State
- [ ] `ReviewCard.vue` — user avatar, rating, verified badge, images
- [ ] `SkeletonCard.vue`, `SkeletonGrid.vue`, `SkeletonProductDetail.vue`
- [ ] `EmptyState.vue` — icon + message + CTA
- [ ] `ErrorComponent.vue` — error boundary display
- [ ] `Badges.vue` — Sale, New, Out of Stock, Featured, Verified badges

### Layout Controls
- [ ] `FilterSidebar.vue` — category tree, price range slider, rating filter, stock toggle
- [ ] `SortDropdown.vue` — extends shadcn Select
- [ ] `Pagination.vue` — extends shadcn Pagination

### UI Primitives (extended from shadcn)
- [ ] `AppButton.vue` — primary/secondary/ghost/destructive + loading state
- [ ] `AppInput.vue` — with label, error, prefix/suffix icon slots
- [ ] `AppDialog.vue` — extended Dialog with standard header/footer slots
- [ ] `AppSheet.vue` — extended Sheet
- [ ] `AppDropdown.vue` — extended DropdownMenu
- [ ] `AppTabs.vue` — extended Tabs
- [ ] `AppAccordion.vue` — extended Accordion
- [ ] `ImageCarousel.vue` — embla carousel or CSS scroll snap
- [ ] `CheckoutSteps.vue` — stepper component

---

## Phase 3 — Authentication Flow 🔐

### Routes
- `/auth/login` → `LoginView.vue`
- `/auth/register` → `RegisterView.vue`
- `/auth/verify-email` → `VerifyEmailView.vue`

### Components / Views
- [ ] `LoginView.vue` — email/password form, "remember me", link to register
- [ ] `RegisterView.vue` — firstName, lastName, email, phone, password, confirmPassword, acceptTerms
- [ ] `VerifyEmailView.vue` — token from query param, auto-submits, shows result

### Store: `src/stores/auth.store.ts`
- `user`, `token`, `isAuthenticated` state
- `login()`, `register()`, `logout()`, `fetchMe()` actions
- Persisted via `localStorage` (token only)

### Service: `src/services/api/auth.service.ts`
- `login`, `register`, `logout`, `verifyEmail`, `resendVerification`, `changePassword`

### Guards: `src/router/guards.ts`
- `requireAuth` — redirects to login
- `requireGuest` — redirects authenticated users away from login/register

---

## Phase 4 — Home Page 🏠

### Route: `/` → `HomeView.vue`

### Sections (each its own component)
- [ ] `HeroSection.vue` — premium marketing hero with product imagery, search, CTAs, floating badges, gradient bg
- [ ] `AnnouncementBar.vue` (already in Phase 1)
- [ ] `FeaturedCategoriesSection.vue` — uses `CategoryCard` grid, fetches `/api/v1/categories?featured=true`
- [ ] `FeaturedProductsSection.vue` — horizontal scroll + grid, fetches `/api/v1/products/featured`
- [ ] `PromoBannerSection.vue` — editorial banner with CTA
- [ ] `TrendingProductsSection.vue` — fetches `sort=popularity`
- [ ] `BrandsSection.vue` — brand logo strip/carousel
- [ ] `NewsletterSection.vue` — email signup with animated input
- [ ] `TrustBadgesSection.vue` — free shipping, returns, support icons

---

## Phase 5 — Product Browsing & Search 🔍

### Routes
- `/products` → `ProductListView.vue` (all products with filters)
- `/categories/:slug` → `CategoryView.vue`
- `/products/:slug` → `ProductDetailView.vue`
- `/search` → `SearchResultsView.vue`

### Views
- [ ] `ProductListView.vue` — FilterSidebar + SortDropdown + ProductGrid + Pagination
- [ ] `CategoryView.vue` — category hero banner + ProductListView embedded
- [ ] `SearchResultsView.vue` — query from URL param, filter chips, results or EmptyState
- [ ] `ProductDetailView.vue`
  - `ProductGallery.vue` — image grid + zoom
  - Sticky purchase panel — price, quantity, add to cart, wishlist
  - Tabs: Description / Specifications / Reviews
  - `ReviewCard` list + `RatingComponent` summary
  - Related products carousel

---

## Phase 6 — Cart & Checkout Flow 🛒

### Routes
- `/cart` → `CartView.vue`
- `/checkout` → `CheckoutView.vue` (multi-step)
- `/checkout/success` → `OrderSuccessView.vue`

### Cart
- [ ] `CartView.vue` — full page cart with `CartItem` list + `CartSummary`
- [ ] Cart drawer (Sheet) triggered from Navbar — `CartSheet.vue`
- [ ] Coupon code input + validation (calls `/api/v1/cart/coupon`)
- [ ] Guest cart — `guestCartId` in localStorage, merge on login

### Checkout (multi-step with `CheckoutSteps.vue`)
- [ ] Step 1 — Shipping Address form (Zod validated)
- [ ] Step 2 — Payment Method selection (Stripe, PayPal, COD)
- [ ] Step 3 — Order Review + Place Order
- [ ] `OrderSuccessView.vue` — order number, confirmation message, CTA to orders

### Store: `src/stores/cart.store.ts`
- `items`, `summary`, `coupon`, `guestCartId`
- All cart CRUD actions + merge on login

---

## Phase 7 — Account (Profile) Flow 👤

### Routes (all require auth via `requireAuth` guard)
- `/account` → redirects to `/account/profile`
- `/account/profile` → `ProfileView.vue`
- `/account/orders` → `OrderListView.vue`
- `/account/orders/:orderId` → `OrderDetailView.vue`
- `/account/wishlist` → `WishlistView.vue`
- `/account/reviews` → `MyReviewsView.vue`
- `/account/security` → `SecurityView.vue` (change password)

### Layout: `AccountLayout.vue`
- Sidebar nav with avatar, links, logout

### Views
- [ ] `ProfileView.vue` — name, phone, address form + avatar upload
- [ ] `OrderListView.vue` — paginated table with status badges + link to detail
- [ ] `OrderDetailView.vue` — full order, status timeline, tracking info, cancel button
- [ ] `WishlistView.vue` — ProductCard grid from wishlist + move-to-cart
- [ ] `MyReviewsView.vue` — list of user's submitted reviews
- [ ] `SecurityView.vue` — change password form

### Store: `src/stores/wishlist.store.ts`
- `items`, `itemCount`
- `add()`, `remove()`, `moveToCart()` actions with optimistic UI

---

## Phase 8 — Vendor Public Page 🏪

### Route
- `/vendors/:storeSlug` → `VendorStoreView.vue`

### View
- [ ] `VendorStoreView.vue` — banner, logo, store stats, verified badge + products grid

---

## Phase 9 — Notifications 🔔

- [ ] `NotificationsSheet.vue` — triggered from Navbar bell icon
- [ ] Shows paginated notifications from `/api/v1/notifications`
- [ ] Mark as read / mark all read
- Unread badge count in Navbar

---

## Phase 10 — Polish & Cross-Cutting Concerns ✨

- [ ] Page transitions (Vue `<Transition>` with fade/slide)
- [ ] `useHead()` / meta tags per route (vue-meta or `@vueuse/head`)
- [ ] Skeleton loaders on all data-fetch views
- [ ] `ErrorComponent.vue` for API failures
- [ ] `EmptyState.vue` throughout
- [ ] 404 page `NotFoundView.vue`
- [ ] Toast notifications for all actions (shadcn Sonner/Toast)
- [ ] Responsive audit — mobile menu, drawers, touch-friendly targets
- [ ] Accessibility — `aria-label`, focus rings, keyboard nav
- [ ] Image lazy loading (`loading="lazy"` + IntersectionObserver)
- [ ] Performance — `defineAsyncComponent` for heavy views, `suspense` boundaries
- [ ] Route-level code splitting (already automatic in Vue Router lazy imports)

---

## API Service Layer Pattern

Every service file follows the same pattern:

```ts
// src/services/api/products.service.ts
import { http } from '../http'
import type { Product, ProductListParams } from '@/types/product.types'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'

export const productsService = {
  getAll: (params: ProductListParams) =>
    http.get<PaginatedResponse<Product[]>>('/products', { params }),
  getBySlug: (slug: string) =>
    http.get<ApiResponse<{ product: Product }>>(`/products/${slug}`),
  getFeatured: () =>
    http.get<ApiResponse<{ products: Product[] }>>('/products/featured'),
}
```

---

## Pinia Stores Overview

| Store | State | Key Actions |
|---|---|---|
| `auth.store.ts` | user, token, isAuthenticated | login, register, logout, fetchMe |
| `cart.store.ts` | items, summary, coupon, guestCartId | addItem, removeItem, updateQty, applyCoupon, mergeCart |
| `wishlist.store.ts` | items, itemCount | add, remove, moveToCart |
| `ui.store.ts` | cartSheetOpen, searchOpen, mobileMenuOpen | toggle actions |
| `notifications.store.ts` | notifications, unreadCount | fetchAll, markRead, markAllRead |

---

## shadcn-vue Components Used

| shadcn Component | Extended As |
|---|---|
| `Button` | `AppButton` |
| `Input` | `AppInput` |
| `Card` | `ProductCard`, `CategoryCard` etc. |
| `Dialog` | `AppDialog` |
| `Sheet` | `CartSheet`, `SearchSheet`, `AppSheet` |
| `DropdownMenu` | `SortDropdown`, `AppDropdown` |
| `Tabs` | `AppTabs` (product detail tabs) |
| `Accordion` | Filter groups in `FilterSidebar` |
| `Skeleton` | `SkeletonCard`, `SkeletonGrid` |
| `Badge` | `Badges` variants |
| `Pagination` | `Pagination.vue` |
| `Avatar` | User avatar in Navbar, ReviewCard |
| `Separator` | Layout dividers |
| `Select` | `SortDropdown`, country selects |
| `Checkbox` | Filter checkboxes |
| `Form` + `Label` | All forms |
| `Toast` / `Sonner` | Action feedback |
| `Tooltip` | Icon tooltips |
| `Popover` | SearchBar suggestions |
| `ScrollArea` | Cart sheet, mega menu |

---

## Verification Plan

### After each phase
- Dev server runs without errors (`npm run dev`)
- TypeScript compiles clean (`vue-tsc --noEmit`)
- All routes load without white screen
- API calls hit correct endpoints (verified via Network tab)
- UI matches theme tokens (no plain blue, correct fonts)

### Manual UI checks
- Responsive at 375px, 768px, 1280px, 1920px
- Hover animations smooth (no jank)
- Cart count updates optimistically
- Wishlist heart toggles without page reload
- Forms validate before submitting
- Loading skeletons appear before data
- Empty states show when list is empty
- Error state shows on API failure

---

## Open Questions

> [!NOTE]
> 1. Should the Stripe payment step be a real Stripe Elements integration or a mocked UI? (Backend is ready per spec)
> 2. For guest checkout — should it redirect to login or allow full checkout without account?
> 3. Should the search bar suggestions dropdown appear inline in the Navbar or as a full overlay?

