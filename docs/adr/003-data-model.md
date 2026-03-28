# ADR-003 — Data Model Design

**Date:** 2025-03-11
**Status:** Accepted

---

## Context

The application needs to persist four types of data:

- Menu items (with category, pricing, availability)
- Table reservations (with guest details and booking status)
- Contact messages (with read/unread tracking)
- Admin users (credentials only)

We need to decide how to model these in SQLite and how to manage schema changes over time.

---

## Decision

Use **four flat tables** with no cross-table foreign key relationships (except the implicit admin ownership of all admin-only operations, which is enforced at the API layer rather than the DB layer).

```sql
menu_items       (id, category, name, description, price, available, position, created_at)
reservations     (id, name, email, phone, date, time, party_size, notes, status, created_at)
contact_messages (id, name, email, message, read, created_at)
admin_users      (id, username, password_hash, created_at)
```

Schema is initialised via `CREATE TABLE IF NOT EXISTS` in `backend/src/db/schema.ts` on first connection. Seed data (menu items and default admin user) is inserted once, guarded by a row count check.

No ORM or migration framework is used. Schema changes are applied by modifying `initSchema` and re-seeding (development) or via hand-written SQL migrations (production).

---

## Consequences

**Positive:**
- Simple and readable — all schema in one place (`schema.ts`).
- No ORM overhead; queries are explicit and easy to reason about.
- `CREATE TABLE IF NOT EXISTS` makes the app self-initialising — no separate migration step on first run.
- Flat tables with no joins keep queries straightforward for a CRUD-heavy app.

**Negative / Trade-offs:**
- No formal migration system — schema changes in production require manual SQL scripts.
- `price` is stored as `TEXT` (e.g. `"€4.50"`) rather than a numeric type, which prevents server-side arithmetic (sorting by price, applying discounts). This is acceptable for a display-only menu but would need to change for a real POS system.
- `available` is stored as `INTEGER` (0/1) rather than a `BOOLEAN` type, which is idiomatic for SQLite but slightly less readable in application code.
- No soft-delete support — deleted items are gone permanently.
