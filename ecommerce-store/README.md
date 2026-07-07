# Ecommerce Store

A clean, well-tested implementation of a backend-first ecommerce store with cart, checkout, and a discount code system.

**Stack:** Node.js · TypeScript (strict) · Express · Jest · React · Docker

---

## Architecture
backend/src/
├── domain/ # Business rules — Cart, Discount, Order (no framework deps)
├── services/ # Use-case orchestration — CartService, CheckoutService, AdminService
├── controllers/ # HTTP adapters — parse request, call service, send response
├── routes/ # Express route bindings
├── repositories/ # InMemoryStore singleton with reset() for test isolation
└── config/ # STORE_CONFIG — NTH_ORDER and DISCOUNT_PERCENTAGE live here
The layering is deliberate: business logic has zero knowledge of HTTP; domain objects have zero knowledge of the store. See `DECISIONS.md` for full reasoning.

---

## Running the App

### Docker (recommended)

```bash
docker-compose up --build
```

- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### Without Docker

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm start
```

### Tests

```bash
cd backend && npm test
```

---

## API Reference

### Cart

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | /cart/add | {userId, itemId, price, quantity} | Add item (merges quantity if itemId exists) |
| GET | /cart/:userId | — | View cart contents and total |

### Checkout

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | /checkout | {userId, discountCode?} | Place order; optionally redeem discount |

Response:
```json
{
  "total": 100,
  "discount": 10,
  "finalAmount": 90,
  "appliedCode": "DISCOUNT-1234567890",
  "newDiscountGenerated": false
}
```

### Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | /admin/stats | Full store statistics |
| POST | /admin/discount | Manually generate a discount code |
| POST | /admin/reset | Reset all state (dev/test only) |

Stats response:
```json
{
  "totalOrders": 4,
  "totalItemsPurchased": 5,
  "totalRevenue": 400,
  "totalDiscountAmount": 10,
  "netRevenue": 390,
  "discountCodes": ["DISCOUNT-1234567890"],
  "activeDiscountCode": "DISCOUNT-1234567890",
  "activeCodeUsed": true
}
```

---

## Full Discount Lifecycle (curl)

```bash
# 1. Add item
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","itemId":"item1","price":100,"quantity":1}'

# 2. Place orders 1 and 2 (no code generated yet)
curl -s -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" -d '{"userId":"u1"}'
# repeat add + checkout once more

# 3. Order 3 — triggers code generation
curl -s -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" -d '{"userId":"u1"}'
# response: "newDiscountGenerated": true

# 4. Get the code
curl http://localhost:3001/admin/stats

# 5. Apply the code
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","discountCode":"DISCOUNT-PASTE-HERE"}'
# response: "discount": 10, "finalAmount": 90

# 6. Reuse attempt — single-use enforcement
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","discountCode":"DISCOUNT-PASTE-HERE"}'
# response: "discount": 0
```

---

## Tests
backend/tests/
├── Cart.test.ts — totals, quantities, merging, immutability
├── Discount.test.ts — lifecycle, single-use, edge cases
├── CartService.test.ts — input validation, user isolation
├── CheckoutService.test.ts — full flow, stats accuracy, multi-user
└── AdminService.test.ts — stats correctness, generation, reset
All tests use `store.reset()` in `beforeEach` — zero state pollution.

---

## Requirements Coverage

| Requirement | Status |
|---|---|
| Add to cart API | done |
| View cart API | done |
| Checkout API | done |
| Discount code validation | done |
| Nth order discount generation | done (N=3, configurable) |
| Single-use enforcement | done |
| Admin: generate discount | done |
| Admin: stats | done |
| Input validation | done |
| In-memory store | done |
| Unit tests (40+ cases) | done |
| Docker + Compose | done |
| Frontend UI | done |
| Postman collection | done |
| DECISIONS.md | done |

---

## Design Decisions

See [DECISIONS.md](./DECISIONS.md).

---

Built by Nikhil Seth — Neustack Engineering Manager assignment.
