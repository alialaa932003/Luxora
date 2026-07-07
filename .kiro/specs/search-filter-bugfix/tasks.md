# Search and Filter Bugfix - Tasks

## Overview

Fix the APIFeatures filter chain so that search queries and filters (price, category, rating, stock) work correctly both independently and when combined.

The bug occurs because:
1. The `filter()` method deletes query parameters that other methods need
2. The `textSearch()` method is called after `filter()`, losing the search parameters
3. There's no mechanism to preserve original query parameters through the method chain

---

## Task 1: Fix APIFeatures Class Constructor

**Description**: Add originalQueryString preservation to prevent parameter loss

**Status**: not_started

**Subtasks**:
- [x] Open `BackEnd/utils/apiFeatures.js`
- [x] Locate the constructor method
- [x] Add `this.originalQueryString = { ...queryString }` to preserve original query parameters
- [x] Verify the property is created as a shallow copy (not a reference)

**Expected Output**: 
- Constructor stores a copy of original query parameters before any modifications
- originalQueryString property contains all original query parameters
- Verified that changes to queryString don't affect originalQueryString

**Dependencies**: None (independent starting point)

**Verification Checklist**:
- [x] Constructor creates the originalQueryString property
- [x] Shallow copy is used (so each instance has its own copy)
- [x] Property is accessible in other methods

---

## Task 2: Fix filter() Method to Preserve Parameters

**Description**: Update filter() to not delete price and search parameters that other methods need

**Status**: not_started

**Subtasks**:
- [ ] Open `BackEnd/utils/apiFeatures.js`
- [x] Locate the `filter()` method
- [x] Review the current excludedFields array
- [x] Add the following to excludedFields (if not present): 'q', 'minPrice', 'maxPrice', 'category'
- [x] Verify that filter() doesn't delete these parameters from queryString
- [x] Test that other filter parameters are still removed correctly

**Expected Output**: 
- filter() method preserves 'q', 'minPrice', 'maxPrice', 'category' in queryString
- Other dynamic filter parameters are still processed correctly
- Mongoose operator syntax ($gte, $gt, $lte, $lt) is still applied

**Dependencies**: Task 1 (requires originalQueryString property exists)

**Verification Checklist**:
- [x] excludedFields array includes 'q', 'minPrice', 'maxPrice'
- [x] filter() doesn't break when these parameters are present
- [x] Dynamic filters (like category filters) still work

---

## Task 3: Fix priceRange() Method to Use Original Query String

**Description**: Update priceRange() to read from originalQueryString instead of queryString

**Status**: not_started

**Subtasks**:
- [ ] Open `BackEnd/utils/apiFeatures.js`
- [x] Locate the `priceRange()` method
- [x] Find all references to `this.queryString.minPrice` and `this.queryString.maxPrice`
- [x] Replace with `this.originalQueryString.minPrice` and `this.originalQueryString.maxPrice`
- [x] Ensure type conversion (Number()) is preserved
- [x] Verify the method returns 'this' for method chaining

**Expected Output**: 
- priceRange() reads minPrice and maxPrice from originalQueryString
- Price filter is correctly applied to MongoDB query
- Method chaining works (returns 'this')

**Dependencies**: Task 1 (requires originalQueryString property)

**Verification Checklist**:
- [x] priceRange() reads from originalQueryString
- [x] Number() type conversion is applied
- [x] Price filters are correctly formatted ($gte, $lte)

---

## Task 4: Fix ProductController Method Chain Order

**Description**: Reorder APIFeatures chain in ProductController to call textSearch before filter

**Status**: not_started

**Subtasks**:
- [x] Open `BackEnd/controllers/productController.js`
- [x] Locate the `getProducts()` method
- [x] Find the APIFeatures chain (the .filter().sort().paginate() sequence)
- [x] Move the `.textSearch('name', req.query.q)` call to BEFORE `.filter()`
- [x] Ensure the final order is: textSearch → filter → sort → limitFields → paginate → priceRange
- [x] Verify the method chain syntax is correct and has no syntax errors

**Expected Output**: 
- APIFeatures method chain is in the correct order
- textSearch is called before filter
- priceRange is called after paginate
- All methods are still chained correctly

**Dependencies**: Task 2 (depends on corrected filter method)

**Verification Checklist**:
- [x] textSearch is before filter in the chain
- [x] priceRange is after paginate in the chain
- [x] No syntax errors in the chain
- [x] All methods are present

---

## Task 5: Verify All Filters Work End-to-End

**Description**: Test that all filter combinations work correctly in the actual application

**Status**: not_started

**Subtasks**:
- [x] Test search query alone: `GET /api/products?q=laptop`
  - [x] Verify results contain products matching "laptop"
  - [x] Verify result count is accurate
- [x] Test price filter alone: `GET /api/products?minPrice=50&maxPrice=200`
  - [x] Verify all results are within price range
  - [x] Verify result count includes all matching products
- [x] Test category filter alone: `GET /api/products?category=electronics`
  - [x] Verify all results are in that category
  - [ ] Verify result count is accurate
- [x] Test rating filter alone: `GET /api/products?rating[gte]=3`
  - [x] Verify all results have rating >= 3
- [x] Test stock filter alone: `GET /api/products?stock[gt]=0`
  - [x] Verify all results have stock > 0
- [x] Test search + price filter: `GET /api/products?q=laptop&minPrice=50&maxPrice=200`
  - [x] Verify results match search AND are in price range
  - [x] Verify accuracy of combined filter
- [x] Test multiple filters combined: `GET /api/products?q=laptop&category=electronics&minPrice=50&maxPrice=200&rating[gte]=3`
  - [x] Verify all filters are applied
  - [ ] Verify result count is accurate
- [x] Test pagination with filters: `GET /api/products?q=laptop&page=2&limit=10`
  - [x] Verify correct page of filtered results is returned
  - [x] Verify page count is accurate
- [x] Test sorting with filters: `GET /api/products?q=laptop&sort=-price`
  - [x] Verify results are sorted by price descending
  - [x] Verify sorting is applied to filtered results
- [x] Check for console errors and warnings
- [x] Verify API response structure is correct

**Expected Output**: 
- All filter combinations work correctly
- Results are accurate with proper counts
- Pagination and sorting work with filters
- No console errors or warnings
- API response structure is unchanged

**Dependencies**: Task 4 (requires all fixes to be in place)

**Verification Checklist**:
- [x] All individual filters work
- [x] Combined filters work together
- [x] Pagination preserves filters
- [x] Sorting preserves filters
- [x] No errors in browser console or server logs
- [x] Result counts are accurate

---

## Task Dependency Graph

```
Task 1: Fix Constructor
   ↓
Task 2: Fix filter() ←── depends on Task 1
Task 3: Fix priceRange() ←── depends on Task 1
   ↓
Task 4: Fix ProductController ←── depends on Task 2
   ↓
Task 5: End-to-End Verification ←── depends on Task 4
```

## Recommended Execution Order

Execute tasks in this sequence: **1 → 2 → 3 → 4 → 5**

- Task 1 is a prerequisite for Tasks 2 and 3
- Task 2 is a prerequisite for Task 4
- Task 4 is a prerequisite for Task 5
- Tasks 2 and 3 can be done in parallel after Task 1 is complete

## Success Criteria

When all tasks are completed:

✅ All filter parameters are preserved through the method chain
✅ Text search works independently
✅ Price range filter works independently
✅ Category filter works independently
✅ Rating filter works independently
✅ Stock filter works independently
✅ Text search works with single filters
✅ Text search works with multiple filters
✅ Multiple filters compose correctly together
✅ Pagination works with all filter combinations
✅ Sorting works with all filter combinations
✅ No regressions in existing functionality
✅ API responses have correct total counts
✅ No console errors or warnings
✅ Database queries execute correctly

## Notes

- All file modifications are in the backend (`BackEnd/` directory)
- No frontend changes are needed for this bugfix
- The fix maintains backward compatibility (API responses unchanged)
- No new dependencies are introduced
- Tests should use real database queries where possible (not mocks)
