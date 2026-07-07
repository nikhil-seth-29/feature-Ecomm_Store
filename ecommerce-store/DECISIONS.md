# Design Decisions

This document records key architectural and implementation decisions made during the development of this ecommerce store assignment. Each entry follows the context → options → choice → rationale format.

---

## Decision 1: Layered Architecture (Domain → Service → Controller → Route)

**Context:** I needed to organise the codebase in a way that keeps business logic isolated, testable, and easy to reason about — especially since an interviewer will read this code closely.

**Options Considered:**
- Option A: Flat MVC — controllers call the store directly, business logic lives inline. Common in quick Express tutorials.
- Option B: Layered architecture — domain objects hold invariants, services orchestrate use cases, controllers handle HTTP concerns, routes bind them together.

**Choice:** Option B — layered architecture.

**Why:** Business logic (what constitutes a valid discount, when to generate a new code, how cart totals are calculated) has nothing to do with HTTP. Keeping it in the domain and service layers means it can be unit tested without spinning up a server, and changed without touching controllers. The extra files are worth it: a founding engineer role implies the codebase will grow — and flat MVC becomes unmaintainable fast.

---

## Decision 2: Single Global In-Memory Store Singleton vs Dependency Injection

**Context:** State has to live somewhere. The assignment explicitly says no database, so in-memory is correct. The question is how services access it.

**Options Considered:**
- Option A: Dependency injection — InMemoryStore passed into every service constructor. Clean inversion of control.
- Option B: Module-level singleton — store exported from InMemoryStore.ts and imported directly by services.

**Choice:** Option B — singleton, with a reset() method for test isolation.

**Why:** For a single-process in-memory store, DI adds ceremony without meaningful benefit. The real risk with a singleton is test pollution, which is cleanly solved by store.reset() in beforeEach. If this were a production service with a real database, DI would be the right choice — and the architecture makes that refactor straightforward.

---

## Decision 3: Global Order Counter vs Per-User Order Counter

**Context:** "Every Nth order gets a coupon code" is ambiguous — does N refer to a single user's Nth order, or the store's global Nth?

**Options Considered:**
- Option A: Per-user counter — each user independently triggers a discount on their own Nth order.
- Option B: Global counter — total orders across all users; every Nth triggers a code.

**Choice:** Option B — global counter.

**Why:** The assignment describes a store-wide discount system, not a per-customer loyalty programme. A global counter is simpler and matches the described behaviour where an admin sees a single list of generated codes. A per-user loyalty system is a natural extension point if the requirements evolve.

---

## Decision 4: Single Active Discount Code vs Code Pool

**Context:** When the Nth order is hit, a code is generated. Should the system maintain one active code, or accumulate a pool?

**Options Considered:**
- Option A: Code pool — every triggered code is stored; any unused code can be applied.
- Option B: Single active code — only the most recently generated code is active.

**Choice:** Option B — single active code.

**Why:** The assignment says "generate a discount code if the condition is satisfied" (singular). A single active code is simpler to reason about and avoids questions about what happens when multiple unused codes accumulate. The stats.discountCodes list still tracks all codes ever generated for historical admin visibility.

---

## Decision 5: Gross Revenue vs Net Revenue in Stats

**Context:** When a discount is applied, should totalRevenue reflect what the customer paid (net) or the pre-discount order value (gross)?

**Options Considered:**
- Option A: Net revenue — totalRevenue = finalAmount. Simpler, matches what hits the payment processor.
- Option B: Gross revenue with separate discount tracking — totalRevenue = pre-discount total; totalDiscountAmount tracks the value given away; netRevenue is derived.

**Choice:** Option B — gross revenue with separate discount tracking.

**Why:** Tracking gross and discount separately gives more business insight. An admin can see both "how much business did we do" (gross) and "how much did promotions cost us" (discount amount). netRevenue is computed on read so it is always consistent. This mirrors how financial reporting actually works.

---

## Decision 6: Cart Item Quantity Merging

**Context:** If a user calls POST /cart/add twice with the same itemId, should the cart have two line items or should quantities merge?

**Options Considered:**
- Option A: Always append — each addItem call creates a new line item.
- Option B: Merge on duplicate itemId — increment quantity if itemId exists.

**Choice:** Option B — merge quantities.

**Why:** Real carts merge quantities. Having [{itemId: "shoe", qty: 1}, {itemId: "shoe", qty: 1}] instead of [{itemId: "shoe", qty: 2}] is both visually confusing and semantically wrong. The merge happens in the Cart domain object, keeping the logic close to the data it governs.

---

## Decision 7: totalItemsPurchased Counts Units, Not Line Items

**Context:** "Count of items purchased" could mean number of distinct product entries, or total units sold (summing quantities).

**Options Considered:**
- Option A: Line item count — count how many distinct product entries appeared.
- Option B: Unit count — sum of quantity across all line items in all orders.

**Choice:** Option B — sum of quantities.

**Why:** In any retail context, "items purchased" means units sold. If a customer buys 3 units in one checkout, that is 3 items purchased, not 1. The original implementation had this bug (using getItems().length) which was caught and fixed.

---

## Decision 8: TypeScript Strict Mode

**Context:** TypeScript can be configured with varying levels of strictness.

**Options Considered:**
- Option A: Loose TypeScript — skip strict: true, fewer type errors, faster to write.
- Option B: Strict TypeScript — strict: true in tsconfig.json, catching null-reference bugs at compile time.

**Choice:** Option B — strict: true.

**Why:** A founding engineer sets the quality bar for the team. Strict TypeScript catches null dereferences and type mismatches at compile time rather than in production. The small upfront cost in type annotations is paid back immediately in confidence and forces better design.
