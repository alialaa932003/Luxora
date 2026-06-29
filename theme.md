# Premium Modern E-Commerce Design System (Revamped)

Act as an award-winning Product Designer, Creative Director, UX Specialist, and Senior Frontend Engineer.

Do not create a generic e-commerce template.

Design the experience as if it were built by a world-class product design team for a modern marketplace startup.

The website should immediately communicate:

* Trust
* Quality
* Simplicity
* Premium Experience
* Community
* Modern Shopping

The UI should feel like a product people enjoy browsing, not just buying from.

---

# Design Inspiration

Take inspiration from the design quality of:

* Apple
* Airbnb
* Stripe
* Framer
* Linear
* Vercel
* Notion
* Arc Browser
* Raycast
* COS
* Zara
* Nike
* Aesop
* Pinterest
* Etsy (design only, not functionality)

Create something original instead of copying any existing website.

---

# Overall Feeling

The interface should feel:

* Premium
* Elegant
* Modern
* Creative
* Editorial
* Friendly
* Minimal
* Warm
* Trustworthy
* Highly polished

Every page should feel intentionally designed.

Avoid anything that looks like a standard admin dashboard or a basic online store template.

---

# Color Palette & Styling

Avoid common startup colors such as default blue, sky blue, or generic indigo. Instead use a premium palette:

### Primary Brand Color (Saturated & Light Purple)
*   **Primary Purple:** `oklch(0.51 0.22 291)` / `#7C3AED` — Vibrant, rich, saturated purple. Used for solid backgrounds, active tabs, text highlights, and primary CTAs.
*   **Primary Light Purple:** `oklch(0.58 0.23 291)` / `#8B5CF6` — Used for hover states and secondary elements.
*   **Primary Accent / Selected Bg:** `oklch(0.94 0.03 291)` / `rgba(124, 58, 237, 0.1)` — Soft, light purple highlight background for selected categories or active states.

### Accents
*   **Soft Coral / Warm Peach:** `oklch(0.85 0.12 50)` — Used for notifications, warnings, or special highlight indicators (like the live university badge).
*   **Sage Green:** `oklch(0.72 0.08 160)` — Used for positive states like "In Stock".

### Neutrals
*   **Warm Cream Background:** `#FAF7F2` — A cozy, warm white/ivory background that makes the page feel premium and human.
*   **Card Background:** Pure white `#ffffff` or clean elevated ivory.
*   **Text Primary:** `oklch(0.14 0.02 280)` — Deep charcol-stone color.
*   **Text Muted:** `oklch(0.52 0.015 285)` — Soft stone grey.
*   **Border:** `oklch(0.88 0.008 85)` / `#EBE5D9` — Extremely subtle warm-grey borders.

> [!WARNING]
> **No Gradients:** Linear, radial, or mesh gradients are completely removed from backgrounds, banners, and buttons. Fills must be solid colors or light transparent overlays, and boundaries should rely on thin, elegant borders.

---

# Typography

Use modern fonts:

* Plus Jakarta Sans (headings)
* Inter (body copy)

Typography should create a luxury editorial feeling.
Large headings, comfortable line heights, excellent hierarchy, and beautiful letter-spacing.

---

# Layout

The layout should feel open and breathable:
*   Generous spacing.
*   Strong visual hierarchy.
*   Consistent grid system.
*   Perfect alignment.

---

# Revamped Core Components

### 1. App Navigation Bar (Navbar)
*   **Structure:**
    *   Left: Logo "CampusMarket" in bold text next to a solid purple tile icon with a white "L" or emblem.
    *   Center: Integrated inline search bar (rounded-full, thin border, search icon, light background input text).
    *   Right: Icon links for Search (if not inline), Wishlist (heart), Notifications (bell), and Cart (shopping bag). All indicators/count-badges must be solid primary purple circles with white text.
    *   Sign In button, and a prominent solid primary purple action button: "Sell an item".
*   **Style:** Pure white or transparent background with a shadow on scroll. No gradients.

### 2. Marketing Hero Section
*   **Structure:**
    *   Left Content:
        *   A pill badge with an orange-red dot: `Now serving 120+ universities`.
        *   Headline: "The marketplace built for students." (vibrant purple highlight for the word "students").
        *   Description: "Find textbooks, laptops and dorm essentials from verified students at your university..."
        *   Search Box: Integrated input field with search icon and a solid primary purple "Search" button.
        *   Features Checklist: Triple bullet points with checkmark icons (Verified .edu accounts only, Student-to-student, Average reply under 1 hour).
    *   Right Image Container:
        *   A large photo showing students with rounded-3xl corners.
        *   Floating cards:
            *   "3 new listings near you in the last hour" (top right, white bg, thin shadow).
            *   "Saved this month $847,200" (bottom left, white bg, green icon).
*   **Style:** Solid cream `#FAF7F2` background. No gradients.

### 3. Product Card
*   **Structure:**
    *   Image: Rounded container (`rounded-3xl`) taking up most of the card height.
    *   Top-Left Badges: "Like New" (white bg, thin border, black text) and "Featured" (solid primary purple bg, white text).
    *   Top-Right Button: Wishlist toggle (circular white background, black heart icon).
    *   Details: Category label in small uppercase muted text. Title on the left, Price on the right. Original price (slashed) underneath the current price.
    *   Seller details: Bottom row containing user avatar, school name (e.g. `Stanford University`), and time (e.g. `2d ago`).
*   **Style:** Clean border, no hover action overlay on card image.

### 4. Marketplace & Sidebar (ProductListView)
*   **Top Banner:** Clean solid banner panel (no gradient) saying "Find your next campus essential".
*   **Sidebar filters:**
    *   Category list on left with counts on right. Selected category has a solid light-purple pill background (`bg-primary/10 text-primary font-semibold`).
    *   Price range input boxes.
    *   Rating filters and stock toggle.

### 5. Single Product Page (ProductDetailView)
*   **Structure:**
    *   Back to marketplace link.
    *   Left column: Large product image with rounded-3xl corners.
    *   Right column: Category badge, condition badge, title, price, description.
    *   Details Grid: Card grid for University, Faculty, Condition, and Pickup location.
    *   Primary button: "Request to buy" / "Add to Cart" in solid purple.
    *   Secondary buttons: "Save" (heart) and "Share" icon button.
    *   Seller Profile Card: Avatar, name, university, rating stars, and "View profile" button.

---

# Reusable UI Patterns

*   **Buttons:** Solid primary purple `bg-primary` with hover `bg-primary-hover` (light purple), white text, soft shadow, no gradient.
*   **Inputs:** Fully rounded-xl, comfortable padding, focus state with solid purple border ring.
*   **Badges:** Solid purple for featured/new, white with borders for condition.
*   **Transitions:** Clean `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`.
