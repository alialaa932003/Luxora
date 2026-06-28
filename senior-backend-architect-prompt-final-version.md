# Senior Backend Architect Prompt — Production-Grade E-Commerce Platform

You are a Principal Backend Engineer with more than 15 years of experience designing scalable enterprise applications.

Your task is to build the complete backend of a modern, production-ready E-Commerce platform with full REST API coverage.

Do not generate a simple CRUD project. Build it as if it will be used by thousands of concurrent users and maintained by a professional engineering team.

The backend must be clean, modular, scalable, maintainable, secure, and follow modern best practices.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication + Refresh Token Rotation
- Redis (caching, session management, rate limiting)
- Cloudinary (image uploads)
- Nodemailer (transactional email)
- Multer (file handling)
- Bcrypt (password hashing)
- Helmet, CORS, Morgan, Compression
- Express Rate Limit
- Zod (request validation)
- Cookie Parser
- Dotenv
- UUID
- Stripe + PayPal (payment providers)
- Socket.IO (architecture prepared, not implemented)
- Docker + Docker Compose
- Swagger / OpenAPI 3.0
- Winston or Pino (structured logging)

Use the latest stable package versions at all times.

---

## Architecture

Use Feature-Based Clean Architecture. Never place business logic inside controllers. Never create God classes.

```
src/
├── app/
├── config/
├── database/
├── common/
│   ├── middlewares/
│   ├── errors/
│   ├── validators/
│   ├── constants/
│   ├── utils/
│   ├── services/
│   └── repositories/
├── features/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── wishlist/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   ├── reviews/
│   ├── notifications/
│   ├── vendors/
│   ├── admin/
│   ├── banners/
│   ├── coupons/
│   ├── uploads/
│   ├── emails/
│   └── search/
├── shared/
├── routes/
├── server/
└── tests/
```

Every feature must contain:

```
feature/
├── controller.ts
├── service.ts
├── repository.ts
├── model.ts
├── dto.ts
├── validator.ts
├── routes.ts
├── types.ts
├── interfaces.ts
├── constants.ts
└── mapper.ts
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| Controller | Receives HTTP request, calls service, returns HTTP response |
| Service | Orchestrates business logic, calls repositories |
| Repository | All database access; abstracts Mongoose |
| Model | Mongoose schema definition |
| DTO | Input/output data shape contracts |
| Validator | Zod schema for request validation |
| Mapper | Transforms raw DB documents to response DTOs |

---

## API Standards

- All endpoints versioned under `/api/v1/`
- JSON-only request and response bodies
- Consistent response envelope on every endpoint

### Success Response Envelope

```json
{
  "success": true,
  "message": "Human-readable description",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 340,
    "totalPages": 17
  }
}
```

### Error Response Envelope

```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ],
  "code": "VALIDATION_ERROR",
  "statusCode": 422
}
```

### Standard HTTP Status Codes

| Situation | Code |
|---|---|
| Success GET / PUT / PATCH | 200 |
| Created POST | 201 |
| No content DELETE | 204 |
| Bad request / validation | 400 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict | 409 |
| Unprocessable entity | 422 |
| Rate limited | 429 |
| Server error | 500 |

---

## Code Quality Rules

- Dependency Injection where appropriate
- SOLID principles throughout
- DRY — no duplicated logic
- KISS — no over-engineering
- Clean Code — consistent naming, no abbreviations
- Every file has a single responsibility
- No comments anywhere in the code
- No placeholder implementations
- No skipped architecture layers

---

## Security Requirements

- Helmet on all responses
- Rate Limiting (global + per-route)
- CORS with explicit whitelist
- Input sanitization (mongo injection, XSS)
- Password hashing with Bcrypt (cost factor ≥ 12)
- Environment variables — never hardcoded secrets
- Secure HTTP-only cookies for tokens
- Never expose stack traces or DB errors to clients

---

## Error Handling

- Centralized async error handler middleware
- Custom error class hierarchy (`AppError`, `ValidationError`, `AuthError`, `NotFoundError`, `ConflictError`, `PaymentError`)
- All async route handlers wrapped in `asyncHandler` utility

---

## Logging

- Structured JSON logging (Winston or Pino)
- Separate log streams: application, errors, access (HTTP)
- Log levels: debug, info, warn, error
- Never log passwords, tokens, or PII

---

## Performance

- Redis caching on all expensive reads (products, categories, homepage)
- Cache invalidation on write operations
- Database indexes on all query fields
- Lean Mongoose queries where documents not needed
- Pagination on every list endpoint
- Compression middleware
- Avoid N+1 queries — use aggregation pipelines

---

---

# REST API — Complete Specification

---

## 1. AUTH MODULE `/api/v1/auth`

---

### POST /api/v1/auth/register

**Description:** Register a new customer account. Sends confirmation email.

**Request Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Hassan",
  "email": "ali@example.com",
  "password": "Str0ng!Pass",
  "confirmPassword": "Str0ng!Pass",
  "phone": "+201012345678",
  "acceptTerms": true
}
```

**Validation Rules:**
- `firstName`: string, 2–50 chars, required
- `lastName`: string, 2–50 chars, required
- `email`: valid email, unique, required
- `password`: min 8 chars, uppercase + lowercase + number + special char
- `confirmPassword`: must match `password`
- `phone`: valid E.164 format, optional
- `acceptTerms`: must be `true`

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm your account.",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6a7b8c9d0e1",
      "firstName": "Ali",
      "lastName": "Hassan",
      "email": "ali@example.com",
      "role": "customer",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response 409:** Email already registered.

**Response 422:** Validation errors.

---

### POST /api/v1/auth/login

**Description:** Authenticate user with email and password. Returns access token in body, refresh token in HTTP-only cookie.

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "Str0ng!Pass",
  "rememberMe": false
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "64f1b2c3d4e5f6a7b8c9d0e1",
      "firstName": "Ali",
      "lastName": "Hassan",
      "email": "ali@example.com",
      "role": "customer",
      "avatar": "https://res.cloudinary.com/...",
      "isEmailVerified": true
    }
  }
}
```

**Set-Cookie Header:**
```
refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=2592000
```

**Response 401:** Invalid credentials.

**Response 403:** Account locked or email not verified.

---

### POST /api/v1/auth/logout

**Auth:** Bearer token required.

**Request Body:** _(empty)_

**Response 200:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### POST /api/v1/auth/refresh-token

**Description:** Issue new access token using the refresh token cookie. Implements refresh token rotation.

**Cookie Required:** `refreshToken`

**Request Body:** _(empty)_

**Response 200:**
```json
{
  "success": true,
  "message": "Token refreshed.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

**Response 401:** Refresh token missing, invalid, or revoked.

---

### POST /api/v1/auth/verify-email

**Description:** Verify email address using token sent in confirmation email.

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6..."
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

**Response 400:** Token invalid or expired.

---

### POST /api/v1/auth/resend-verification

**Request Body:**
```json
{
  "email": "ali@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Verification email sent if account exists."
}
```

---

### POST /api/v1/auth/forgot-password

**Request Body:**
```json
{
  "email": "ali@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset instructions sent if account exists."
}
```

---

### POST /api/v1/auth/reset-password

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewStr0ng!Pass",
  "confirmPassword": "NewStr0ng!Pass"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login."
}
```

---

### PATCH /api/v1/auth/change-password

**Auth:** Bearer token required.

**Request Body:**
```json
{
  "currentPassword": "OldStr0ng!Pass",
  "newPassword": "NewStr0ng!Pass",
  "confirmPassword": "NewStr0ng!Pass"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

---

### GET /api/v1/auth/google

**Description:** Redirect to Google OAuth consent screen.

**Response:** HTTP 302 redirect to Google. _(Bonus feature)_

---

### GET /api/v1/auth/google/callback

**Description:** Google OAuth callback. Issues tokens and redirects to frontend.

**Response:** HTTP 302 redirect with tokens set in secure cookie. _(Bonus feature)_

---

## 2. USER MANAGEMENT `/api/v1/users`

---

### GET /api/v1/users/me

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "message": "Profile fetched.",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6a7b8c9d0e1",
      "firstName": "Ali",
      "lastName": "Hassan",
      "email": "ali@example.com",
      "phone": "+201012345678",
      "avatar": "https://res.cloudinary.com/...",
      "role": "customer",
      "isEmailVerified": true,
      "address": {
        "addressLine1": "123 Nile Street",
        "city": "Cairo",
        "country": "EG",
        "postalCode": "11511"
      },
      "paymentDetails": {
        "savedCards": []
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T08:00:00.000Z"
    }
  }
}
```

---

### PATCH /api/v1/users/me

**Auth:** Bearer token required.

**Description:** Update profile — name, address, phone, payment details.

**Request Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Hassan",
  "phone": "+201012345678",
  "address": {
    "addressLine1": "123 Nile Street",
    "addressLine2": "Apt 4B",
    "city": "Cairo",
    "state": "Cairo Governorate",
    "postalCode": "11511",
    "country": "EG"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Profile updated.",
  "data": {
    "user": { "...updated user object..." }
  }
}
```

---

### POST /api/v1/users/me/avatar

**Auth:** Bearer token required.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `avatar`: image file (jpg, png, webp; max 5 MB)

**Response 200:**
```json
{
  "success": true,
  "message": "Avatar updated.",
  "data": {
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

---

### DELETE /api/v1/users/me/avatar

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "message": "Avatar removed."
}
```

---

### GET /api/v1/users/me/orders

**Auth:** Bearer token required.

**Description:** Order history for the current user.

**Query Parameters:** `page`, `limit`, `status`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_001",
        "orderNumber": "ORD-20240115-7845",
        "status": "delivered",
        "total": 1295.99,
        "itemCount": 2,
        "createdAt": "2024-01-15T14:00:00.000Z"
      }
    ]
  },
  "meta": { "page": 1, "limit": 10, "total": 24, "totalPages": 3 }
}
```

---

### GET /api/v1/users/me/reviews

**Auth:** Bearer token required.

**Query Parameters:** `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_001",
        "product": {
          "id": "prod_001",
          "name": "iPhone 15 Pro Max",
          "thumbnail": "https://res.cloudinary.com/..."
        },
        "rating": 5,
        "title": "Excellent phone",
        "body": "The camera is outstanding.",
        "createdAt": "2024-01-18T10:00:00.000Z"
      }
    ]
  },
  "meta": { "page": 1, "limit": 10, "total": 8, "totalPages": 1 }
}
```

---

## 3. CATEGORIES MODULE `/api/v1/categories`

---

### GET /api/v1/categories

**Description:** List all categories. Supports nested parent–child structure.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Default: 1 |
| `limit` | number | Default: 20, max: 100 |
| `featured` | boolean | Filter featured categories |
| `parentId` | string | Get children of a specific parent (omit for top-level) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "Electronics",
        "slug": "electronics",
        "image": "https://res.cloudinary.com/...",
        "parent": null,
        "isFeatured": true,
        "productCount": 1240,
        "children": [
          {
            "id": "cat_002",
            "name": "Smartphones",
            "slug": "electronics-smartphones",
            "image": "https://res.cloudinary.com/...",
            "productCount": 340
          }
        ]
      }
    ]
  },
  "meta": { "page": 1, "limit": 20, "total": 12, "totalPages": 1 }
}
```

---

### GET /api/v1/categories/:slug

**Response 200:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_001",
      "name": "Electronics",
      "slug": "electronics",
      "image": "https://res.cloudinary.com/...",
      "parent": null,
      "isFeatured": true,
      "children": [],
      "productCount": 1240,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### POST /api/v1/categories

**Auth:** Admin only.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: string, required
- `parentId`: string (ObjectId), optional — makes this a subcategory
- `isFeatured`: boolean
- `image`: image file

**Response 201:**
```json
{
  "success": true,
  "message": "Category created.",
  "data": {
    "category": { "...category object..." }
  }
}
```

---

### PUT /api/v1/categories/:id

**Auth:** Admin only.

**Content-Type:** `multipart/form-data`

**Request Body:** Same fields as POST, all optional.

**Response 200:**
```json
{
  "success": true,
  "message": "Category updated.",
  "data": {
    "category": { "...updated category object..." }
  }
}
```

---

### DELETE /api/v1/categories/:id

**Auth:** Admin only.

**Response 200:**
```json
{
  "success": true,
  "message": "Category deleted."
}
```

---

## 4. PRODUCT MANAGEMENT `/api/v1/products`

---

### GET /api/v1/products

**Description:** List products with filtering, sorting, and pagination.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Search by name |
| `category` | string | Category slug or id |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `inStock` | boolean | In-stock products only |
| `featured` | boolean | Featured products only |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `rating`, `popularity` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20, max: 100 |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_001",
        "name": "iPhone 15 Pro Max",
        "slug": "apple-iphone-15-pro-max",
        "description": "The most powerful iPhone ever.",
        "price": 1199.99,
        "currency": "USD",
        "thumbnail": "https://res.cloudinary.com/...",
        "images": [
          { "url": "https://res.cloudinary.com/...", "alt": "Front view" }
        ],
        "category": { "id": "cat_002", "name": "Smartphones", "slug": "electronics-smartphones" },
        "rating": {
          "average": 4.8,
          "count": 342
        },
        "stock": 54,
        "isFeatured": true,
        "vendor": { "id": "vendor_001", "storeName": "Apple Official" },
        "createdAt": "2024-01-10T08:00:00.000Z"
      }
    ]
  },
  "meta": { "page": 1, "limit": 20, "total": 1240, "totalPages": 62 }
}
```

---

### GET /api/v1/products/:slug

**Response 200:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod_001",
      "name": "iPhone 15 Pro Max",
      "slug": "apple-iphone-15-pro-max",
      "description": "Full product description...",
      "price": 1199.99,
      "currency": "USD",
      "thumbnail": "https://res.cloudinary.com/...",
      "images": [
        { "url": "https://res.cloudinary.com/...", "alt": "Front view", "order": 1 },
        { "url": "https://res.cloudinary.com/...", "alt": "Back view", "order": 2 }
      ],
      "category": { "id": "cat_002", "name": "Smartphones", "slug": "electronics-smartphones" },
      "vendor": { "id": "vendor_001", "storeName": "Apple Official", "rating": 4.9 },
      "rating": {
        "average": 4.8,
        "count": 342,
        "distribution": { "5": 250, "4": 60, "3": 20, "2": 8, "1": 4 }
      },
      "stock": 54,
      "isFeatured": true,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-20T08:00:00.000Z"
    }
  }
}
```

---

### POST /api/v1/products

**Auth:** Seller or Admin.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `name`: string, required
- `description`: string, required
- `price`: number, required, min 0
- `categoryId`: ObjectId, required
- `stock`: number, min 0, required
- `isFeatured`: boolean
- `images`: image files (max 10, each max 5 MB)

**Response 201:**
```json
{
  "success": true,
  "message": "Product created and pending review.",
  "data": {
    "product": { "...product object..." }
  }
}
```

---

### PUT /api/v1/products/:id

**Auth:** Product owner (Seller) or Admin.

**Content-Type:** `multipart/form-data`

**Request Body:** Same fields as POST, all optional.

**Response 200:**
```json
{
  "success": true,
  "message": "Product updated.",
  "data": {
    "product": { "...updated product object..." }
  }
}
```

---

### DELETE /api/v1/products/:id

**Auth:** Product owner or Admin.

**Description:** Soft delete.

**Response 200:**
```json
{
  "success": true,
  "message": "Product removed."
}
```

---

### POST /api/v1/products/:id/images

**Auth:** Product owner or Admin.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `images`: image files (max 10 total)

**Response 201:**
```json
{
  "success": true,
  "message": "Images uploaded.",
  "data": {
    "images": [
      { "url": "https://res.cloudinary.com/...", "alt": "", "order": 3 }
    ]
  }
}
```

---

### DELETE /api/v1/products/:id/images/:imageId

**Auth:** Product owner or Admin.

**Response 200:**
```json
{
  "success": true,
  "message": "Image deleted.",
  "data": {
    "images": [ "...remaining images..." ]
  }
}
```

---

### GET /api/v1/products/featured

**Response 200:** List of featured products (same shape as items in GET /products).

---

## 5. SEARCH `/api/v1/search`

---

### GET /api/v1/search

**Description:** Search products by name and filter by price, category, and more.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Keyword search, required |
| `category` | string | Filter by category slug |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `minRating` | number | Minimum average rating (1–5) |
| `inStock` | boolean | In-stock only |
| `sort` | string | `relevance`, `price_asc`, `price_desc`, `newest`, `rating` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20 |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "query": "iphone 15",
    "products": [
      { "...product list item..." }
    ],
    "filters": {
      "categories": [
        { "id": "cat_002", "name": "Smartphones", "count": 18 }
      ],
      "priceRange": { "min": 799.99, "max": 1399.99 }
    }
  },
  "meta": { "page": 1, "limit": 20, "total": 24, "totalPages": 2 }
}
```

---

### GET /api/v1/search/suggestions

**Query Parameters:** `q` (string, min 2 chars)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      { "type": "product", "label": "iPhone 15 Pro Max", "slug": "apple-iphone-15-pro-max" },
      { "type": "category", "label": "Smartphones", "slug": "electronics-smartphones" }
    ]
  }
}
```

---

## 6. WISHLIST `/api/v1/wishlist`

---

### GET /api/v1/wishlist

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "wishlist": {
      "items": [
        {
          "id": "item_001",
          "product": {
            "id": "prod_001",
            "name": "iPhone 15 Pro Max",
            "slug": "apple-iphone-15-pro-max",
            "price": 1199.99,
            "thumbnail": "https://res.cloudinary.com/...",
            "stock": 54
          },
          "addedAt": "2024-01-16T12:00:00.000Z"
        }
      ],
      "itemCount": 1
    }
  }
}
```

---

### POST /api/v1/wishlist/items

**Auth:** Bearer token required.

**Request Body:**
```json
{
  "productId": "prod_001"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Added to wishlist.",
  "data": { "itemCount": 2 }
}
```

**Response 409:** Product already in wishlist.

---

### DELETE /api/v1/wishlist/items/:productId

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "message": "Removed from wishlist.",
  "data": { "itemCount": 1 }
}
```

---

### POST /api/v1/wishlist/items/:productId/move-to-cart

**Auth:** Bearer token required.

**Request Body:**
```json
{
  "quantity": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Moved to cart.",
  "data": { "cartItemCount": 3 }
}
```

---

## 7. SHOPPING CART `/api/v1/cart`

---

### GET /api/v1/cart

**Auth:** Optional. Guest cart identified by `guestCartId` cookie.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart_001",
      "items": [
        {
          "id": "cartitem_001",
          "product": {
            "id": "prod_001",
            "name": "iPhone 15 Pro Max",
            "slug": "apple-iphone-15-pro-max",
            "thumbnail": "https://res.cloudinary.com/..."
          },
          "quantity": 2,
          "unitPrice": 1199.99,
          "totalPrice": 2399.98
        }
      ],
      "summary": {
        "subtotal": 2399.98,
        "shipping": 0,
        "tax": 192.00,
        "discount": 0,
        "couponDiscount": 0,
        "total": 2591.98,
        "currency": "USD",
        "itemCount": 2
      },
      "coupon": null
    }
  }
}
```

---

### POST /api/v1/cart/items

**Auth:** Optional (guest or authenticated).

**Request Body:**
```json
{
  "productId": "prod_001",
  "quantity": 1
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Item added to cart.",
  "data": {
    "cart": { "...full cart object..." }
  }
}
```

---

### PATCH /api/v1/cart/items/:itemId

**Auth:** Optional.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Quantity updated.",
  "data": {
    "cart": { "...updated cart object..." }
  }
}
```

---

### DELETE /api/v1/cart/items/:itemId

**Auth:** Optional.

**Response 200:**
```json
{
  "success": true,
  "message": "Item removed from cart.",
  "data": {
    "cart": { "...updated cart object..." }
  }
}
```

---

### DELETE /api/v1/cart

**Auth:** Optional.

**Description:** Clear all items from the cart.

**Response 200:**
```json
{
  "success": true,
  "message": "Cart cleared."
}
```

---

### POST /api/v1/cart/merge

**Auth:** Bearer token required.

**Description:** Merge guest cart into the authenticated user's cart after login.

**Request Body:**
```json
{
  "guestCartId": "guest_cart_uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cart merged.",
  "data": {
    "cart": { "...merged cart object..." }
  }
}
```

---

### POST /api/v1/cart/coupon

**Auth:** Optional.

**Request Body:**
```json
{
  "code": "SAVE20"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Coupon applied.",
  "data": {
    "cart": { "...updated cart with discount applied..." }
  }
}
```

**Response 400:** Coupon invalid, expired, or minimum not met.

---

### DELETE /api/v1/cart/coupon

**Auth:** Optional.

**Response 200:**
```json
{
  "success": true,
  "message": "Coupon removed.",
  "data": {
    "cart": { "...cart without coupon..." }
  }
}
```

---

## 8. ORDER MANAGEMENT `/api/v1/orders`

---

### POST /api/v1/orders

**Auth:** Bearer token required.

**Description:** Place a new order from current cart.

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "Ali",
    "lastName": "Hassan",
    "phone": "+201012345678",
    "addressLine1": "123 Nile Street",
    "city": "Cairo",
    "postalCode": "11511",
    "country": "EG"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "paymentMethod": "stripe",
  "paymentIntentId": "pi_stripe_abc123",
  "couponCode": "SAVE20",
  "notes": "Please leave at door."
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "order": {
      "id": "ord_001",
      "orderNumber": "ORD-20240115-7845",
      "status": "processing",
      "paymentStatus": "paid",
      "total": 1295.99,
      "currency": "USD"
    }
  }
}
```

---

### GET /api/v1/orders

**Auth:** Bearer token required.

**Query Parameters:** `page`, `limit`, `status`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_001",
        "orderNumber": "ORD-20240115-7845",
        "status": "delivered",
        "paymentStatus": "paid",
        "itemCount": 2,
        "total": 1295.99,
        "createdAt": "2024-01-15T14:00:00.000Z"
      }
    ]
  },
  "meta": { "page": 1, "limit": 10, "total": 24, "totalPages": 3 }
}
```

---

### GET /api/v1/orders/:orderId

**Auth:** Order owner or Admin.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_001",
      "orderNumber": "ORD-20240115-7845",
      "status": "delivered",
      "paymentStatus": "paid",
      "paymentMethod": "stripe",
      "items": [
        {
          "product": {
            "id": "prod_001",
            "name": "iPhone 15 Pro Max",
            "thumbnail": "https://res.cloudinary.com/..."
          },
          "quantity": 1,
          "unitPrice": 1199.99,
          "totalPrice": 1199.99
        }
      ],
      "summary": {
        "subtotal": 1199.99,
        "shipping": 0,
        "tax": 96.00,
        "discount": 0,
        "total": 1295.99,
        "currency": "USD"
      },
      "shippingAddress": { "...address object..." },
      "billingAddress": { "...address object..." },
      "statusHistory": [
        { "status": "placed", "timestamp": "2024-01-15T14:00:00.000Z", "note": "Order confirmed" },
        { "status": "processing", "timestamp": "2024-01-15T16:00:00.000Z", "note": "Payment verified" },
        { "status": "shipped", "timestamp": "2024-01-16T09:00:00.000Z", "note": "Shipped via FedEx. Tracking: FX123456" },
        { "status": "delivered", "timestamp": "2024-01-18T11:00:00.000Z", "note": "Delivered" }
      ],
      "trackingNumber": "FX123456",
      "carrier": "FedEx",
      "coupon": { "code": "SAVE20", "discount": 50.00 },
      "createdAt": "2024-01-15T14:00:00.000Z"
    }
  }
}
```

---

### PATCH /api/v1/orders/:orderId/cancel

**Auth:** Order owner (only when status is `placed` or `processing`) or Admin.

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Order cancelled. Refund will be processed within 3–5 business days.",
  "data": {
    "order": { "status": "cancelled", "refundStatus": "pending" }
  }
}
```

---

## 9. PAYMENT INTEGRATION `/api/v1/payments`

---

### POST /api/v1/payments/stripe/create-intent

**Auth:** Bearer token required.

**Description:** Create a Stripe PaymentIntent before checkout.

**Request Body:**
```json
{
  "cartId": "cart_001",
  "currency": "usd"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_abc123_secret_xyz",
    "paymentIntentId": "pi_abc123",
    "amount": 129599,
    "currency": "usd"
  }
}
```

---

### POST /api/v1/payments/stripe/webhook

**Description:** Stripe webhook. Validates Stripe-Signature header. Updates order payment status on successful events.

**Headers:** `stripe-signature`

**Request Body:** Raw Stripe event payload.

**Response 200:**
```json
{
  "received": true
}
```

---

### POST /api/v1/payments/paypal/create-order

**Auth:** Bearer token required.

**Request Body:**
```json
{
  "cartId": "cart_001",
  "currency": "USD"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "orderId": "paypal_order_abc123",
    "approvalUrl": "https://www.paypal.com/checkoutnow?token=..."
  }
}
```

---

### POST /api/v1/payments/paypal/capture

**Auth:** Bearer token required.

**Request Body:**
```json
{
  "paypalOrderId": "paypal_order_abc123",
  "cartId": "cart_001"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Payment captured.",
  "data": {
    "transactionId": "paypal_txn_xyz",
    "status": "completed"
  }
}
```

---

### POST /api/v1/payments/refund

**Auth:** Admin only.

**Request Body:**
```json
{
  "orderId": "ord_001",
  "reason": "customer_request"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Refund initiated.",
  "data": {
    "refundId": "ref_abc123",
    "status": "pending"
  }
}
```

---

## 10. REVIEWS & RATINGS `/api/v1/products/:productId/reviews`

---

### GET /api/v1/products/:productId/reviews

**Query Parameters:** `page`, `limit`, `sort` (`newest`, `highest`, `lowest`)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_001",
        "user": {
          "id": "user_001",
          "firstName": "Ali",
          "avatar": "https://res.cloudinary.com/..."
        },
        "rating": 5,
        "title": "Excellent phone",
        "body": "The camera is outstanding and performance is top-notch.",
        "images": ["https://res.cloudinary.com/..."],
        "verifiedPurchase": true,
        "createdAt": "2024-01-18T10:00:00.000Z"
      }
    ],
    "summary": {
      "average": 4.8,
      "count": 342,
      "distribution": { "5": 250, "4": 60, "3": 20, "2": 8, "1": 4 }
    }
  },
  "meta": { "page": 1, "limit": 10, "total": 342, "totalPages": 35 }
}
```

---

### POST /api/v1/products/:productId/reviews

**Auth:** Customer who has purchased the product.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `rating`: number 1–5, required
- `title`: string, max 100 chars, required
- `body`: string, max 2000 chars, required
- `images`: image files, max 5

**Response 201:**
```json
{
  "success": true,
  "message": "Review submitted and pending moderation.",
  "data": {
    "review": { "...review object..." }
  }
}
```

---

### PUT /api/v1/reviews/:reviewId

**Auth:** Review owner only.

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "body": "Updated review body."
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Review updated.",
  "data": {
    "review": { "...updated review object..." }
  }
}
```

---

### DELETE /api/v1/reviews/:reviewId

**Auth:** Review owner or Admin.

**Response 200:**
```json
{
  "success": true,
  "message": "Review deleted."
}
```

---

## 11. COUPONS (Bonus) `/api/v1/coupons`

---

### POST /api/v1/coupons/validate

**Auth:** Optional.

**Request Body:**
```json
{
  "code": "SAVE20",
  "cartTotal": 1199.99
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": "coup_001",
      "code": "SAVE20",
      "type": "percentage",
      "value": 20,
      "minimumPurchase": 100,
      "maximumDiscount": 200,
      "discountAmount": 200,
      "expiresAt": "2024-12-31T23:59:59.000Z"
    }
  }
}
```

**Response 400:** Coupon invalid, expired, or minimum not met.

---

## 12. VENDORS / SELLERS MODULE `/api/v1/vendors`

---

### POST /api/v1/vendors/register

**Auth:** Authenticated customer.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `storeName`: string, required
- `storeDescription`: string
- `businessEmail`: string
- `businessPhone`: string
- `logo`: image file
- `banner`: image file

**Response 201:**
```json
{
  "success": true,
  "message": "Seller application submitted. Under review.",
  "data": {
    "vendor": {
      "id": "vendor_001",
      "storeName": "My Tech Store",
      "status": "pending",
      "submittedAt": "2024-01-20T10:00:00.000Z"
    }
  }
}
```

---

### GET /api/v1/vendors/me

**Auth:** Seller only.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "vendor_001",
      "storeName": "My Tech Store",
      "storeDescription": "...",
      "businessEmail": "store@example.com",
      "logo": "https://res.cloudinary.com/...",
      "banner": "https://res.cloudinary.com/...",
      "status": "approved",
      "rating": { "average": 4.7, "count": 120 },
      "productCount": 24,
      "totalSales": 312,
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  }
}
```

---

### PATCH /api/v1/vendors/me

**Auth:** Seller only.

**Content-Type:** `multipart/form-data`

**Request Body:** Any vendor profile fields (all optional).

**Response 200:**
```json
{
  "success": true,
  "message": "Store profile updated.",
  "data": {
    "vendor": { "...updated vendor object..." }
  }
}
```

---

### GET /api/v1/vendors/me/products

**Auth:** Seller only.

**Query Parameters:** `page`, `limit`, `status`, `search`

**Response 200:** Paginated list of this vendor's products.

---

### GET /api/v1/vendors/me/orders

**Auth:** Seller only.

**Description:** Orders containing this vendor's products.

**Query Parameters:** `page`, `limit`, `status`

**Response 200:** Paginated order list.

---

### GET /api/v1/vendors/me/stats

**Auth:** Seller only.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRevenue": 45230.00,
      "totalOrders": 312,
      "totalProducts": 24,
      "pendingOrders": 8,
      "averageRating": 4.7,
      "revenueByMonth": [
        { "month": "2024-01", "revenue": 12400.00 },
        { "month": "2024-02", "revenue": 14800.00 }
      ],
      "topProducts": [
        { "id": "prod_001", "name": "iPhone 15 Pro Max", "sales": 42, "revenue": 50399.58 }
      ]
    }
  }
}
```

---

### GET /api/v1/vendors/:storeSlug

**Description:** Public store profile page.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "vendor_001",
      "storeName": "Apple Official",
      "storeSlug": "apple-official",
      "storeDescription": "...",
      "logo": "https://res.cloudinary.com/...",
      "banner": "https://res.cloudinary.com/...",
      "rating": { "average": 4.9, "count": 1200 },
      "productCount": 48,
      "isVerified": true,
      "joinedAt": "2023-06-01T00:00:00.000Z"
    }
  }
}
```

---

### GET /api/v1/vendors/:storeSlug/products

**Query Parameters:** Same as GET /products.

**Response 200:** Paginated products for this vendor.

---

## 13. NOTIFICATIONS `/api/v1/notifications`

---

### GET /api/v1/notifications

**Auth:** Bearer token required.

**Query Parameters:** `page`, `limit`, `unreadOnly`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "order_shipped",
        "title": "Your order has shipped",
        "body": "Order ORD-20240115-7845 is on its way.",
        "data": { "orderId": "ord_001", "trackingNumber": "FX123456" },
        "isRead": false,
        "createdAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "unreadCount": 3
  },
  "meta": { "page": 1, "limit": 20, "total": 15, "totalPages": 1 }
}
```

---

### PATCH /api/v1/notifications/:id/read

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

### PATCH /api/v1/notifications/read-all

**Auth:** Bearer token required.

**Response 200:**
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

## 14. ADMIN PANEL `/api/v1/admin`

All admin routes require `role: admin` enforced via `requireRole('admin')` middleware.

---

### GET /api/v1/admin/dashboard

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRevenue": { "value": 1234567.89, "change": 12.5 },
      "totalOrders": { "value": 8432, "change": 8.2 },
      "totalUsers": { "value": 45230, "change": 5.1 },
      "totalProducts": { "value": 3420, "change": 2.3 },
      "pendingOrders": 124,
      "pendingVendors": 7,
      "pendingReviews": 43
    },
    "recentOrders": [],
    "topProducts": [],
    "revenueChart": [
      { "date": "2024-01-01", "revenue": 42300.00, "orders": 312 }
    ]
  }
}
```

---

### GET /api/v1/admin/users

**Query Parameters:** `page`, `limit`, `role`, `status` (`active`, `suspended`, `deleted`), `search`

**Response 200:** Paginated full user list.

---

### PATCH /api/v1/admin/users/:id/status

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Policy violation"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "User status updated."
}
```

---

### DELETE /api/v1/admin/users/:id

**Description:** Soft delete user account.

**Response 200:**
```json
{
  "success": true,
  "message": "User account deleted."
}
```

---

### GET /api/v1/admin/products

**Query Parameters:** `page`, `limit`, `status` (`pending`, `approved`, `rejected`), `category`, `vendor`, `search`

**Response 200:** Paginated product list with full detail.

---

### PATCH /api/v1/admin/products/:id/status

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Product status updated."
}
```

---

### GET /api/v1/admin/categories

**Query Parameters:** `page`, `limit`, `search`

**Response 200:** Paginated category list (same shape as public endpoint, includes soft-deleted).

---

### GET /api/v1/admin/orders

**Query Parameters:** `page`, `limit`, `status`, `paymentStatus`, `dateFrom`, `dateTo`, `search`

**Response 200:** Paginated full order list.

---

### PATCH /api/v1/admin/orders/:id/status

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "FX123456",
  "carrier": "FedEx",
  "note": "Dispatched via FedEx Express"
}
```

**Response 200:** Updated order object.

---

### GET /api/v1/admin/vendors

**Query Parameters:** `page`, `limit`, `status` (`pending`, `approved`, `rejected`, `suspended`)

**Response 200:** Paginated vendor list.

---

### PATCH /api/v1/admin/vendors/:id/status

**Request Body:**
```json
{
  "status": "approved",
  "note": "All documents verified."
}
```

**Response 200:** Updated vendor status.

---

### GET /api/v1/admin/reviews

**Query Parameters:** `page`, `limit`, `status` (`pending`, `approved`, `rejected`)

**Response 200:** Paginated review list with product and user details.

---

### PATCH /api/v1/admin/reviews/:id/status

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Review status updated."
}
```

---

### GET /api/v1/admin/coupons

**Query Parameters:** `page`, `limit`, `status` (`active`, `expired`, `disabled`), `search`

**Response 200:** Paginated coupon list.

---

### POST /api/v1/admin/coupons

**Request Body:**
```json
{
  "code": "SUMMER30",
  "type": "percentage",
  "value": 30,
  "minimumPurchase": 150,
  "maximumDiscount": 300,
  "usageLimit": 500,
  "perUserLimit": 1,
  "expiresAt": "2024-08-31T23:59:59.000Z",
  "isActive": true
}
```

**Response 201:** Created coupon object.

---

### PUT /api/v1/admin/coupons/:id

**Request Body:** Same fields as POST, all optional.

**Response 200:** Updated coupon object.

---

### DELETE /api/v1/admin/coupons/:id

**Response 200:** Deletion confirmation.

---

## 15. BANNERS & HOMEPAGE CMS `/api/v1`

---

### GET /api/v1/homepage

**Description:** Single cached endpoint returning all homepage sections.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "heroBanners": [
      {
        "id": "ban_001",
        "title": "Summer Sale",
        "subtitle": "Up to 50% off on electronics",
        "image": { "desktop": "https://...", "mobile": "https://..." },
        "cta": { "label": "Shop Now", "url": "/products?sale=summer" },
        "order": 1
      }
    ],
    "featuredCategories": [],
    "featuredProducts": [],
    "promotionalBanners": [],
    "announcements": [
      {
        "id": "ann_001",
        "message": "Free shipping on orders over $100",
        "type": "info"
      }
    ]
  }
}
```

---

### GET /api/v1/banners

**Query Parameters:** `placement` (`hero`, `promotional`, `announcement`)

**Response 200:** List of active banners for the requested placement.

---

### POST /api/v1/admin/banners

**Auth:** Admin only.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `title`: string, required
- `subtitle`: string
- `ctaLabel`: string
- `ctaUrl`: string
- `placement`: enum `hero | promotional | announcement`
- `order`: number
- `isActive`: boolean
- `startDate`: ISO date string
- `endDate`: ISO date string
- `desktopImage`: image file
- `mobileImage`: image file

**Response 201:** Created banner object.

---

### PUT /api/v1/admin/banners/:id

**Auth:** Admin only.

**Request Body:** Same fields as POST, all optional.

**Response 200:** Updated banner object.

---

### DELETE /api/v1/admin/banners/:id

**Auth:** Admin only.

**Response 200:** Deletion confirmation.

---

---

# DATABASE SCHEMA DESIGN

---

## Users Collection

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  avatar: { url: String, publicId: String },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  accountLockedUntil: Date,
  isActive: { type: Boolean, default: true },
  deletedAt: Date,
  address: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `email` (unique), `passwordResetToken`, `emailVerificationToken`

---

## Categories Collection

```javascript
{
  _id: ObjectId,
  name: String,
  slug: { type: String, unique: true },
  image: { url: String, publicId: String },
  parent: { type: ObjectId, ref: 'Category', default: null },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `slug` (unique), `parent`, `isFeatured`

---

## Products Collection

```javascript
{
  _id: ObjectId,
  vendor: { type: ObjectId, ref: 'Vendor' },
  name: String,
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  thumbnail: { url: String, publicId: String },
  images: [{ url: String, publicId: String, alt: String, order: Number }],
  category: { type: ObjectId, ref: 'Category' },
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `slug` (unique), `category`, `vendor`, `status`, `isFeatured`, text index on `name + description`

---

## Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: { type: String, unique: true },
  user: { type: ObjectId, ref: 'User' },
  items: [{
    product: { type: ObjectId, ref: 'Product' },
    vendor: { type: ObjectId, ref: 'Vendor' },
    name: String,
    thumbnail: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  shippingAddress: {
    firstName: String, lastName: String, phone: String,
    addressLine1: String, city: String, postalCode: String, country: String
  },
  billingAddress: { "...same structure as shippingAddress..." },
  summary: {
    subtotal: Number, shipping: Number, tax: Number,
    discount: Number, total: Number, currency: String
  },
  coupon: { code: String, discount: Number },
  status: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'placed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentTransactionId: String,
  trackingNumber: String,
  carrier: String,
  statusHistory: [{ status: String, timestamp: Date, note: String }],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `orderNumber` (unique), `user`, `status`, `paymentStatus`, `createdAt`

---

## Reviews Collection

```javascript
{
  _id: ObjectId,
  product: { type: ObjectId, ref: 'Product' },
  user: { type: ObjectId, ref: 'User' },
  order: { type: ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  body: String,
  images: [{ url: String, publicId: String }],
  verifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `product`, `user`, `status`, compound `{ product, user }` (unique — one review per purchase)

---

## Coupons Collection

```javascript
{
  _id: ObjectId,
  code: { type: String, unique: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'fixed'] },
  value: Number,
  minimumPurchase: { type: Number, default: 0 },
  maximumDiscount: Number,
  usageLimit: Number,
  usageCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

---

---

# ENVIRONMENT CONFIGURATION

```env
NODE_ENV=development

PORT=5000
API_VERSION=v1

MONGODB_URI=mongodb://localhost:27017/ecommerce_db
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

COOKIE_SECRET=your_cookie_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@yourstore.com

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

# DOCKER CONFIGURATION

## Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server/index.js"]
```

## docker-compose.yml

```yaml
version: '3.9'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

---

# SWAGGER / OPENAPI

Every endpoint must be documented with:

- Full path and HTTP method
- Summary and description
- Authentication requirement (`bearerAuth`)
- All query parameters with type, description, and whether required
- Request body schema (JSON or multipart)
- All possible responses: 200, 201, 400, 401, 403, 404, 409, 422, 429, 500
- Response body schema matching the contracts above

Serve Swagger UI at `/api/v1/docs`.

---

# TESTING ARCHITECTURE

```
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── validators/
├── integration/
│   ├── auth.test.ts
│   ├── products.test.ts
│   ├── orders.test.ts
│   └── payments.test.ts
└── e2e/
    └── checkout.test.ts
```

- Framework: Jest + Supertest
- In-memory MongoDB for unit and integration tests
- Mock Redis and Cloudinary in test environment
- Separate `.env.test` configuration

---

# DEVELOPMENT TOOLING

- ESLint + Prettier for consistent code style
- Husky + lint-staged: run linting on staged files before every commit
- Conventional Commits: `feat(auth): add refresh token rotation`

---

# IMPORTANT RULES — NON-NEGOTIABLE

1. No comments anywhere in the code.
2. No placeholder or stub implementations — every line must be production-ready.
3. Never skip any architecture layer.
4. Business logic belongs exclusively in services.
5. Controllers only receive requests and return responses.
6. Repository is the only layer allowed to touch Mongoose.
7. No God classes or God files.
8. No duplicated logic anywhere.
9. Every public endpoint must have Zod validation.
10. Never expose raw MongoDB errors, stack traces, or internal paths to API consumers.
11. Redis cache must be invalidated correctly on every write operation.
12. Every list endpoint must support pagination — never return unbounded results.
13. Payment processing must use the provider pattern — adding a new provider must not require touching existing business logic.
14. Only implement what is in these requirements. Do not add extra features, fields, or complexity that was not asked for.
15. The result must look like it was written by a Principal Engineer at a top-tier technology company, not a tutorial project.

---

*Generate the project incrementally, feature by feature, while maintaining a consistent architecture throughout the entire codebase.*
