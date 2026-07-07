# Search and Filter Bugfix - Design Document

## Problem Statement

The APIFeatures class in `BackEnd/utils/apiFeatures.js` has a broken method chain where:

1. `filter()` deletes query parameters that `priceRange()` needs
2. `textSearch()` is called after `filter()`, causing text search to be applied incorrectly
3. Multiple filters cannot be composed together because parameters are lost in the chain

This causes search queries and price/category/rating/stock filters to fail when used individually or combined.

## Root Cause Analysis

The current method chain order and implementation have these issues:

1. **Parameter Loss**: The `filter()` method deletes all query string parameters that aren't recognized, including `minPrice` and `maxPrice` that `priceRange()` needs
2. **Wrong Method Order**: `textSearch()` is called after `filter()`, so the search operation doesn't have access to the original search parameters
3. **No Parameter Preservation**: There's no mechanism to preserve the original query parameters before they get modified

## Solution Architecture

### Design Overview

We'll fix the APIFeatures class by:

1. **Preserving original query parameters** in the constructor
2. **Updating filter() to preserve price and search parameters**
3. **Fixing priceRange() to read from original parameters**
4. **Reordering the method chain** to call textSearch before filter

### Key Changes

#### 1. APIFeatures Constructor - Preserve Original Query String

Add an immutable reference to the original query string before any modifications:

```javascript
constructor(query, queryString) {
  this.query = query;
  this.queryString = queryString;
  this.originalQueryString = { ...queryString };  // NEW: preserve original
}
```

**Why**: This ensures we always have access to unmodified query parameters, allowing methods like `priceRange()` to access `minPrice` and `maxPrice` even after `filter()` has processed the queryString.

#### 2. Filter Method - Update Excluded Fields

Update the excludedFields array to include all parameters that other methods need:

```javascript
filter() {
  const queryObj = { ...this.queryString };
  
  // Exclude parameters that are handled by other methods
  const excludedFields = [
    'page', 'sort', 'limit', 'fields',  // API control fields
    'q',                                  // text search parameter
    'minPrice', 'maxPrice',               // price range parameters
    'category'                            // potentially handled separately
  ];
  
  excludedFields.forEach((el) => delete queryObj[el]);
  
  // Apply Mongoose operator syntax ($gte, $gt, $lte, $lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
  this.query = this.query.find(JSON.parse(queryStr));
  return this;
}
```

**Why**: By explicitly excluding parameters used by other methods, we prevent parameter loss and ensure each method has access to its needed parameters.

#### 3. Price Range Method - Read from Original Query String

Update `priceRange()` to read from `originalQueryString` instead of the modified `queryString`:

```javascript
priceRange() {
  if (this.originalQueryString.minPrice || this.originalQueryString.maxPrice) {
    const priceFilter = {};
    
    if (this.originalQueryString.minPrice) {
      priceFilter.$gte = Number(this.originalQueryString.minPrice);
    }
    
    if (this.originalQueryString.maxPrice) {
      priceFilter.$lte = Number(this.originalQueryString.maxPrice);
    }
    
    this.query = this.query.find({ price: priceFilter });
  }
  return this;
}
```

**Why**: By reading from `originalQueryString`, we ensure price parameters aren't lost even if `filter()` has removed them from `queryString`.

#### 4. ProductController - Reorder Method Chain

Update the APIFeatures chain in `ProductController.getProducts()` to call methods in the correct order:

```javascript
const features = new APIFeatures(
  Product.find(filter).populate(...),
  req.query
)
  .textSearch('name', req.query.q)      // FIRST: Apply text search
  .filter()                              // SECOND: Apply other filters
  .sort()
  .limitFields()
  .paginate()
  .priceRange();                         // LAST: Apply price range
```

**Why**: Text search should be applied first so the search query is properly applied. Price range should be applied last to ensure all other filters are in place first.

## Method Chain Execution Flow

```
APIFeatures Constructor
  ↓
textSearch()        - Searches in 'name' field
  ↓
filter()            - Applies category, rating, stock filters
  ↓
sort()              - Sorts results
  ↓
limitFields()       - Limits returned fields
  ↓
paginate()          - Handles pagination (page, limit)
  ↓
priceRange()        - Applies price range filter
  ↓
Query Execution
```

## Acceptance Criteria

1. **Text search works independently**: Querying `?q=laptop` returns products matching "laptop"
2. **Price filtering works independently**: Querying `?minPrice=50&maxPrice=200` returns products in that price range
3. **Category filtering works independently**: Querying `?category=electronics` returns products in that category
4. **Rating filtering works independently**: Querying `?rating[gte]=3` returns products with rating >= 3
5. **Stock filtering works independently**: Querying `?stock[gt]=0` returns products with stock > 0
6. **Text search + price filter work together**: `?q=laptop&minPrice=50&maxPrice=200` returns matching products in price range
7. **Multiple filters work together**: `?q=laptop&category=electronics&minPrice=50&maxPrice=200&rating[gte]=3` works
8. **Pagination works with filters**: `?q=laptop&page=2&limit=10` returns correct page of results
9. **Sorting works with filters**: `?q=laptop&sort=-price` sorts filtered results correctly
10. **No regressions**: All existing functionality continues to work

## Testing Strategy

### Unit Tests
- Test each method independently with various parameter combinations
- Test parameter preservation through the chain
- Test Mongoose query operators are applied correctly

### Integration Tests
- Test complete filter chains with real database queries
- Test search + multiple filters together
- Test pagination and sorting with filters
- Test edge cases (empty results, invalid parameters, etc.)

### Regression Tests
- Verify existing functionality without filters still works
- Verify default behavior (no parameters) returns all products
- Verify error handling for invalid queries

## Implementation Order

1. Update APIFeatures constructor to preserve originalQueryString
2. Update filter() method to preserve price and search parameters
3. Update priceRange() method to read from originalQueryString
4. Update ProductController to reorder method chain
5. Run end-to-end tests to verify all filters work

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking existing API behavior | High | Write comprehensive tests before and after changes |
| Performance impact from preserved parameters | Low | Shallow copy of queryString is minimal overhead |
| Incomplete filter parameter coverage | Medium | Add new excluded fields as needed after testing |
| Database query syntax errors | Medium | Test with real MongoDB queries during implementation |

## Success Metrics

✅ All filter combinations produce correct results
✅ Search queries work with and without additional filters
✅ No regression in pagination or sorting
✅ No console errors or warnings
✅ API response metadata (total count) is accurate
✅ Tests pass for all acceptance criteria
