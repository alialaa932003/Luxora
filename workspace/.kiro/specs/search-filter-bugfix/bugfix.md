# Search and Filter Bugfix Requirements

## Introduction

The product search and filter functionality is completely broken when filters are combined with search queries. Users cannot find products using search terms or apply filters like price range, category, rating, and stock availability. The root cause is in the APIFeatures utility class where filter operations interfere with each other due to improper sequencing and parameter management. This prevents users from finding products, blocking core commerce functionality.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user searches with a query parameter (e.g., `/search?q=laptop`) AND other filters are NOT applied, the system returns search results for that query only

1.2 WHEN a user applies a single filter (e.g., price range, category, rating, or stock filter) AND no search query is provided, the system may return incorrect results or all products due to query object pollution

1.3 WHEN a user searches with a query parameter (e.g., `q=laptop`) AND simultaneously applies filters (price range, category, rating, stock), the system returns incorrect results because the filter() method deletes the query parameter before priceRange() is called, breaking the filter chain

1.4 WHEN the APIFeatures.filter() method is called, the system deletes 'q' and other parameters from queryString, causing subsequent filter methods to operate on incomplete data

1.5 WHEN combined filters are applied, the system does not properly compose multiple filter operations, resulting in lost filter context between method calls

### Expected Behavior (Correct)

2.1 WHEN a user searches with a query parameter (e.g., `/search?q=laptop`), the system SHALL return all products where the name or description contains "laptop", properly paginated

2.2 WHEN a user applies a price range filter (minPrice, maxPrice), the system SHALL return only products with prices within that range

2.3 WHEN a user applies a category filter, the system SHALL return only products belonging to the selected categories

2.4 WHEN a user applies a rating filter, the system SHALL return only products with a rating greater than or equal to the selected minimum rating

2.5 WHEN a user applies a stock filter (inStockOnly=true), the system SHALL return only products with stock quantity greater than zero

2.6 WHEN a user searches with a query parameter (e.g., `q=laptop`) AND simultaneously applies multiple filters (price range, category, rating, stock), the system SHALL return products that match ALL conditions: search query match AND price range AND category AND rating AND stock availability

2.7 WHEN filters are applied in sequence through APIFeatures, the system SHALL preserve all filter parameters throughout the method chain so that each method operates on a complete queryString

2.8 WHEN pagination, sorting, field limiting, and filtering are all applied, the system SHALL correctly compose these operations without losing filter context

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user views the product list page WITHOUT any search query or filters, the system SHALL CONTINUE TO display all products with proper pagination (default page 1, limit 10)

3.2 WHEN a user applies sorting (newest, popularity, price, rating), the system SHALL CONTINUE TO sort results correctly without interference from filter operations

3.3 WHEN a user paginates through filtered results, the system SHALL CONTINUE TO maintain the filter parameters across page navigation

3.4 WHEN individual feature methods (textSearch, filter, sort, limitFields, paginate, priceRange) are called independently without combining filters, the system SHALL CONTINUE TO work correctly as before

3.5 WHEN the product list is accessed from different routes (ProductListView, SearchResultsView, category pages), the system SHALL CONTINUE TO handle route-specific parameters without breaking existing functionality

3.6 WHEN filtering is applied to other resource endpoints (not products), the system SHALL CONTINUE TO work with the existing APIFeatures implementation without regression
