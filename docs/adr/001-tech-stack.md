# ADR-001 — Technology Stack

**Date:** 2025-03-11
**Status:** Accepted

---

## Context

Hearth and Grounds needs a web application with a public-facing site and a protected admin panel. The project is a training exercise, so the stack must be:

- Approachable for developers familiar with JavaScript/TypeScript
- Sufficient to demonstrate integration testing, browser verification, and REST API patterns
- Lightweight enough to run locally without Docker or external services

---

## Decision

**Frontend:** React 19 + Vite + Tailwind CSS + React Router v7

**Backend:** Node.js + Express 4 + TypeScript

**Database:** SQLite via `better-sqlite3`

**Auth:** JWT (jsonwebtoken) + bcrypt password hashing (bcryptjs)

**Validation:** Zod on the backend

**Testing:** Vitest + Supertest (unit/integration), Playwright (E2E)

---

## Consequences

**Positive:**
- Single language (JavaScript/TypeScript) across the full stack reduces context switching.
- SQLite requires zero infrastructure — the database is a local file, making local setup and CI trivial.
- Vite provides fast HMR for a good developer experience.
- Tailwind CSS enables rapid UI iteration without maintaining a separate stylesheet.
- Zod provides runtime type safety at API boundaries, catching bad input before it reaches the database.

**Negative / Trade-offs:**
- SQLite is not suitable for production workloads with concurrent writes; a migration to PostgreSQL would be needed for a real deployment.
- The frontend is plain JavaScript rather than TypeScript, which reduces type safety on the client side.
- Express requires manual wiring of middleware and validation; a framework like Fastify or NestJS would provide more structure at scale.
- No ORM — raw SQL in schema.ts means migrations must be managed manually.
