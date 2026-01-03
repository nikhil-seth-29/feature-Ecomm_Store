# 🛒 Ecommerce Store – Backend + Frontend (Dockerized)

This repository implements a simplified ecommerce store with cart, checkout, and discount code functionality, built as part of a backend-focused assignment.

The system is fully Dockerized, uses an in-memory store, and includes API-level verification steps so reviewers can easily validate correctness.

## 📌 Problem Summary

- Users can add items to a cart  
- Users can checkout to place an order  
- Every Nth order (N = 3) generates a 10% discount coupon  

**Discount code:**
- Applies to the entire order  
- Can be used only once  

**Admin APIs:**
- Generate discount codes  
- View purchase & discount statistics  

UI provided as a stretch goal  
No database (in-memory store only)

## 🧱 Tech Stack

**Backend**
- Node.js  
- TypeScript  
- Express  
- In-memory repository pattern  
- Jest (unit tests)  

**Frontend**
- React (minimal UI for demonstration)  

**Infrastructure**
- Docker  
- Docker Compose  

## 📂 Project Structure
\`\`\`
ecommerce-store/
│
├── backend/
│   ├── src/
│   │   ├── domain/        # Business logic (Cart, Discount, Order)
│   │   ├── services/      # Use cases
│   │   ├── controllers/   # HTTP adapters
│   │   ├── routes/        # Express routes
│   │   └── repositories/  # In-memory store
│   ├── tests/             # Unit tests
│   └── Dockerfile
│
├── frontend/
│   ├── src/               # React UI
│   └── Dockerfile
│
└── docker-compose.yml
\`\`\`

## 🚀 Running the Application

### Prerequisites
- Docker  
- Docker Compose  

### Start services
From repository root:

\`\`\`bash
docker-compose up --build
\`\`\`

**Backend** will run on: \`http://localhost:3001\`  
**Frontend** will run on: \`http://localhost:3000\`

## 🧪 API Verification (Step-by-Step)

These steps allow full verification using terminal only (no UI or Postman required).  
They work perfectly inside GitHub Codespaces.

### STEP 1️⃣ Add item to cart
\`\`\`bash
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "itemId": "item1",
    "price": 100,
    "quantity": 1
  }'
\`\`\`
**Expected response:**
\`\`\`json
{"status":"OK"}
\`\`\`

### STEP 2️⃣ Checkout – Order #1 (no discount)
\`\`\`bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1"
  }'
\`\`\`
**Expected:**
\`\`\`json
{
  "total": 100,
  "discount": 0,
  "finalAmount": 100
}
\`\`\`

### STEP 3️⃣ Checkout – Order #2 (no discount)

Repeat add item + checkout:

\`\`\`bash
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "itemId": "item1",
    "price": 100,
    "quantity": 1
  }'

curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1"
  }'
\`\`\`

**Expected:**
\`\`\`json
{
  "total": 100,
  "discount": 0,
  "finalAmount": 100
}
\`\`\`

### STEP 4️⃣ Checkout – Order #3 (discount is GENERATED)

Repeat again:

\`\`\`bash
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "itemId": "item1",
    "price": 100,
    "quantity": 1
  }'

curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1"
  }'
\`\`\`

➡️ Discount is generated internally at this point.

### STEP 5️⃣ Verify discount code (Admin API)
\`\`\`bash
curl http://localhost:3001/admin/stats
\`\`\`

**Example response:**
\`\`\`json
{
  "totalItemsPurchased": 3,
  "totalPurchaseAmount": 300,
  "totalDiscountAmount": 0,
  "discountCodes": [
    "DISCOUNT-1704xxxxxxx"
  ]
}
\`\`\`

📌 Copy the discount code.

### STEP 6️⃣ Apply discount (valid only once)

Add item:

\`\`\`bash
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "itemId": "item1",
    "price": 100,
    "quantity": 1
  }'
\`\`\`

Checkout with discount:

\`\`\`bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "discountCode": "DISCOUNT-PASTE-HERE"
  }'
\`\`\`

**Expected:**
\`\`\`json
{
  "total": 100,
  "discount": 10,
  "finalAmount": 90
}
\`\`\`

### STEP 7️⃣ Verify discount cannot be reused

Repeat checkout with same code:

\`\`\`bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "discountCode": "DISCOUNT-PASTE-HERE"
  }'
\`\`\`

**Expected:**
\`\`\`json
{
  "total": 100,
  "discount": 0,
  "finalAmount": 100
}
\`\`\`

✅ Discount is single-use only.

## 📊 Admin Statistics
\`\`\`bash
curl http://localhost:3001/admin/stats
\`\`\`

**Example:**
\`\`\`json
{
  "totalItemsPurchased": 5,
  "totalPurchaseAmount": 490,
  "totalDiscountAmount": 10,
  "discountCodes": ["DISCOUNT-1704xxxxxxx"]
}
\`\`\`

## 🧪 Running Unit Tests
\`\`\`bash
cd backend
npm test
\`\`\`

## ✅ Assignment Requirements – Coverage

| Requirement               | Status |
|----------------------------|--------|
| Add to cart API            | ✅     |
| Checkout API               | ✅     |
| Nth order discount         | ✅ (N = 3) |
| Single-use discount        | ✅     |
| Admin stats API            | ✅     |
| In-memory store            | ✅     |
| Dockerized                 | ✅     |
| Unit tests                 | ✅     |
| UI (stretch goal)          | ✅     |

## 📝 Notes

- Discount logic is implemented in the domain layer  
- Business logic is isolated from HTTP & infrastructure  
- Designed for clarity, testability, and extensibility  

## 👤 Author

Built by Nikhil Seth as part of the Assignment!
