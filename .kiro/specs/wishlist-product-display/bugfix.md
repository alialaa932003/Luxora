# Wishlist Product Display Bugfix

## Introduction

When users navigate to the wishlist page with saved items, the ProductGrid component fails to render, resulting in a placeholder message instead of displaying the wishlist products. The wishlist store correctly tracks and fetches product data from the backend, but the WishlistView template does not render the products even when items exist. This prevents users from viewing, interacting with, or purchasing their saved wishlist items.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user navigates to `/account/wishlist` AND the wishlist contains items THEN the system displays placeholder text "Wishlist products would display here when connected to a live backend" instead of rendering product cards

1.2 WHEN the ProductGrid component is imported in WishlistView.vue AND items exist in wishlistStore.items THEN the system does not render the ProductGrid component in the template

1.3 WHEN wishlistStore.itemCount is greater than zero THEN the system renders a paragraph element with muted text instead of the product grid UI

### Expected Behavior (Correct)

2.1 WHEN a user navigates to `/account/wishlist` AND the wishlist contains items THEN the system SHALL render a ProductGrid component displaying all wishlist products

2.2 WHEN wishlistStore.items array contains WishlistItem objects with complete product details THEN the system SHALL pass this data to ProductGrid and display product cards with images, prices, and action buttons

2.3 WHEN wishlistStore.itemCount is greater than zero THEN the system SHALL display the ProductGrid component instead of placeholder text

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user navigates to `/account/wishlist` AND the wishlist is empty (itemCount = 0) THEN the system SHALL CONTINUE TO display the EmptyState component with the message "Your wishlist is empty"

3.2 WHEN the wishlist store is loaded or refreshed THEN the system SHALL CONTINUE TO fetch wishlist items from the backend `/wishlist` endpoint

3.3 WHEN a user returns to the wishlist page with items already added THEN the system SHALL CONTINUE TO show the correct itemCount in the page heading

3.4 WHEN the page title is set on mount THEN the system SHALL CONTINUE TO display "Wishlist - Luxora" in the browser tab
