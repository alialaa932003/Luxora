# E-Commerce Frontend — Full Implementation Plan & Design Enhancement

## Overview

Vue 3 + TypeScript + Vite + shadcn-vue premium e-commerce storefront.  
Covers: Home flow, Auth flow, Profile flow, Product/Search flow, Cart & Checkout flow, Order flow, Wishlist — with the folder structure pre-shaped to absorb the **Admin Dashboard** and **Seller Portal** later without restructuring.

---

> [!IMPORTANT]
> **Scope of this plan**: Customer-facing storefront only (no admin/seller portal yet).  
> **Excluded per user**: Refresh token flow, Reset/Forgot password flows.  
> **Future-ready**: Folder structure supports Admin + Seller dashboards.
> **Design Refinement (New)**: Update primary brand color to a more saturated, slightly lighter purple (`oklch(0.51 0.22 291)` / `#7C3AED`), completely eliminate background gradients in favor of high-end solid panels, and revamp the Navbar, Hero, Product Card, and Product Details views based on the new campus marketplace design reference.

---

## Design System

| Token | Old Value | New Value |
|---|---|---|
| Primary | Deep Plum `oklch(0.32 0.09 295)` | Saturated Purple `oklch(0.51 0.22 291)` / `#7C3AED` |
| Primary Light | Royal Violet `oklch(0.48 0.12 295)` | Saturated Light Purple `oklch(0.58 0.23 291)` / `#8B5CF6` |
| Primary Accent | Muted Lavender `oklch(0.94 0.015 295)` | Light Purple Pill `oklch(0.94 0.03 291)` / `rgba(124, 58, 237, 0.1)` |
| Accent | Warm Peach `oklch(0.88 0.06 50)` | Soft Coral `oklch(0.85 0.12 50)` |
| Surface | Warm White `hsl(40 20% 97%)` / `#FAF7F1` | Warm Ivory `#FAF7F2` |
| Card | White / Ivory | Elevated ivory card with clean border |
| Gradients | Linear/Radial gradients in buttons/heros | **REMOVED** — Solid fills and clean borders only |
| Radius | Card: 20px · Button: 12px · Input: 10px | Card: 24px (rounded-3xl) · Button: 16px (rounded-2xl) |
| Shadows | Layered warm-tinted box-shadows | Minimal soft shadows with clean borders |

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
│   │   ├── feedback/        # ReviewCard, RatingComponent, EmptyState, ErrorComponent, ReviewSubmitDialog
│   │   ├── navigation/      # Breadcrumb, MegaMenu, SearchBar
│   │   ├── commerce/        # CartItem, CartSummary, PriceComponent, QuantitySelector
│   │   └── display/         # ImageCarousel, SkeletonLoaders, Badges, Pagination, FilterSidebar, SortDropdown
│   └── forms/               # reusable form field components
├── views/                   # route-level pages
│   ├── home/
│   │   ├── HomeView.vue
│   │   └── sections/        # HeroSection, FeaturedCategoriesSection, FeaturedProductsSection, etc.
│   ├── auth/
│   ├── product/             # ProductListView, ProductDetailView
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
├── router/
├── types/                   # global TypeScript types/interfaces
├── lib/
│   ├── utils.ts             # shadcn cn() util
│   └── dummyData.ts         # mock data including realistic unsplash images
├── main.ts
```

---

## Phase Breakdown

### Phase 0 — Project Setup & Design System ⚙️
*   Configure Tailwind v4 CSS variables in `src/style.css` to use the new light, highly saturated purple color tokens (`oklch(0.51 0.22 291)` and `oklch(0.58 0.23 291)`).
*   Remove all `.gradient-primary`, `.gradient-hero`, and other gradient utilities, replacing them with solid brand fills (`bg-primary`, `bg-background`).
*   Configure global border radius (`--radius: 1rem`) to support elegant rounded components.

### Phase 1 — Layout Components (Revamped Navbar) 🏗️
*   **AppNavbar.vue:** Update to match the new campus marketplace layout.
    *   Left side: Clean logo `CampusMarket` with a solid purple block icon.
    *   Center: Rounded search bar input with a search icon and a clean text input.
    *   Right side: Wishlist, Notifications, Cart icons with small circular counts, "Sign In" button, and a prominent solid primary purple action button: "Sell an item".
    *   No gradients, thin border underneath, soft scroll shadow.

### Phase 2 — Product & Catalog Components (Revamped Cards) 🧩
*   **ProductCard.vue:** Make card design editorial and clean.
    *   Image: Rounded container `rounded-2xl` or `rounded-3xl` taking 75% height.
    *   Badges: Floating on top-left of image (white background with gray border "Like New", solid purple "Featured").
    *   Wishlist: Floating on top-right of image (circular white background with heart icon).
    *   Details: Category label in small uppercase muted text. Title on the left, Price on the right. Original price slashed below current price.
    *   Seller details: Bottom row containing user avatar, school name (e.g. `Stanford University`), and time (e.g. `2d ago`).
    *   Remove hover cart button overlay from card image.
*   **FilterSidebar.vue:** Update filters layout.
    *   Category list on left with count on right. Selected category has a solid light-purple pill background (`bg-primary/10 text-primary font-semibold`).
    *   Price input boxes, rating filters, and stock toggle (no gradients, simple toggles).
*   **ProductGallery.vue:** Premium grid with main image + thumbnail row.

### Phase 3 — Authentication Flow 🔐
*   Add **Google Social Sign-In** mock buttons on `LoginView.vue` and `RegisterView.vue` for modern authentication support.

### Phase 4 — Home Page (Revamped Hero) 🏠
*   **HeroSection.vue:** Completely redesign.
    *   Background: Solid light off-white cream (`#FAF7F2`) with no gradients.
    *   Left: Tag badge with red pulsing dot `Now serving 120+ universities`. Headline: "The marketplace built for students." with "students." highlighted in primary purple. Description text.
    *   Search: Large input search box with search icon and a solid purple "Search" button.
    *   Features list: Checklist with checkmark icons (Verified .edu accounts only, Student-to-student, Average reply under 1 hour).
    *   Right: Large student hero photography with rounded corners (`rounded-[2rem]`) and floating cards: "3 new listings near you in the last hour" and "Saved this month $847,200".

### Phase 5 — Product Browsing & Search 🔍
*   **ProductListView.vue / CategoryView.vue / SearchResultsView.vue:** Update to use a clean solid banner instead of gradients. Integrate the upgraded `FilterSidebar` on the left and the new `ProductCard` grid on the right.
*   **ProductDetailView.vue:** Redesign to match the premium detail page.
    *   Back to marketplace breadcrumbs link.
    *   Left column: Large rounded product image (`rounded-3xl`).
    *   Right column: Category badge, condition badge, title, price, description.
    *   Details Grid: Cards displaying University, Faculty, Condition, and Pickup location with clean borders and icons.
    *   Primary action button "Request to buy" / "Add to Cart" with solid purple background (no gradient).
    *   Secondary action buttons: "Save" (heart) and "Share".
    *   Seller Profile Card: Avatar, store name, university, rating stars, and "View profile" button.

### Phase 6 — Cart & Checkout Flow 🛒
*   Add Coupon code validation and interactive input box in `CartSummary.vue` and `CheckoutView.vue`.
*   Mock payment gateways (Stripe Elements fields, PayPal check out buttons) in checkout step 2.

### Phase 7 — Account Flow 👤
*   **OrderDetailView.vue:** Include a visual tracking stepper status timeline (Pending -> Confirmed -> Shipped -> Delivered) to visualize order status.
*   **Write a Review Flow:** Add review submission popup allowing star rating selection, title, body, and mock review posting.

---

## Checked & Missing Customer Flows (Revamped Checklist)

We checked the codebase and implementation status against the **Senior Backend Architect API contract** and identified the following missing customer-facing flows (not admin/vendor portals):

1.  **[ ] Write/Submit Product Review Flow:**
    *   *Backend spec:* `POST /api/v1/reviews/product/:productId`
    *   *Codebase state:* Description/Specs/Reviews tabs are present on the details page, but there is no mechanism for an authenticated customer to submit a rating and review for a purchased product.
    *   *Enhancement:* Create a `ReviewSubmitDialog.vue` component that opens on the product details page or the order details page.
2.  **[ ] Order Status Tracking Timeline:**
    *   *Backend spec:* `GET /api/v1/orders/:id` contains order status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
    *   *Codebase state:* Order Detail View shows raw text status.
    *   *Enhancement:* Create a visual horizontal tracker/timeline inside `OrderDetailView.vue` to show progress status.
3.  **[ ] Coupon Discovery & Application:**
    *   *Backend spec:* `/api/v1/cart/coupon`
    *   *Codebase state:* Cart store supports `applyCoupon`, but checkout views lack clear UI fields to input code and display discount values.
    *   *Enhancement:* Add a promo code input widget to `CartSummary.vue` and Checkout summary.
4.  **[ ] Google OAuth Social Sign-In:**
    *   *Backend spec:* `GET /api/v1/auth/google` redirect and callback.
    *   *Codebase state:* Only email/password forms exist.
    *   *Enhancement:* Integrate a mock Google sign-in button into the auth layouts to guide customers.
5.  **[ ] Product Image Lightbox:**
    *   *Codebase state:* Static image grid with thumbnail tabs.
    *   *Enhancement:* Allow clicking on the main product image in `ProductGallery.vue` to open a full-screen image lightbox modal.
6.  **[ ] Stripe & PayPal Mock Fields:**
    *   *Backend spec:* `POST /api/v1/payments/stripe/initiate`
    *   *Codebase state:* Payment methods are radio inputs.
    *   *Enhancement:* Add a credit card form matching Stripe elements styles when "Credit Card" is selected, and a mock PayPal checkout button when "PayPal" is selected.

---

## Verification Plan

### Design & Color Verification
- Verify `style.css` variables load the saturated purple (`oklch(0.51 0.22 291)`) and cream bg (`#FAF7F1`).
- Audit components for class names like `gradient-primary` or `gradient-hero` and ensure they utilize solid background colors.
- Check navbar for inline search input and "Sell an item" primary button.
- Check product cards: rounded design, top-left badges, bottom seller avatar/school row, price layout.

### Customer Flows Verification
- Open Review submission dialog, input rating & review details, check mock submission toast.
- Navigate to order detail page, view the status tracking timeline.
- Verify coupon discount displays on Cart and Checkout totals.
- Verify checkout payment step shows credit card forms.
