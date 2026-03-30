# ADR-002 — Authentication Approach

**Date:** 2025-03-11
**Status:** Accepted

---

## Context

The admin panel must be protected so that only authorised staff can manage reservations, menu items, and contact messages. The public-facing pages (menu, reservations form, contact form) must remain accessible without any login.

Options considered:

1. **Session-based auth** — server stores session state; browser sends a session cookie.
2. **JWT (stateless)** — server issues a signed token; client stores it and sends it with every request.
3. **Third-party OAuth / SSO** — delegate to Google, GitHub, etc.

---

## Decision

Use **JWT-based authentication** stored in `localStorage`.

- On login (`POST /api/auth/login`), the server validates credentials against a bcrypt-hashed password in SQLite and returns a signed JWT.
- The frontend stores the token in `localStorage` and attaches it as a `Bearer` token in `Authorization` headers for every protected request.
- Protected API routes use an `authenticate` Express middleware that verifies the JWT signature and rejects missing or invalid tokens with `401 Unauthorized`.
- There is a single admin user seeded at startup; no user registration flow is needed.

---

## Consequences

**Positive:**
- Stateless — the backend does not need to maintain session state or a session store.
- Simple to implement and test: a valid token is all that is needed to call protected endpoints.
- Works naturally with `Supertest` integration tests (inject the token in request headers).
- No external dependencies (no Redis, no session table).

**Negative / Trade-offs:**
- Tokens stored in `localStorage` are accessible to JavaScript and vulnerable to XSS. For a production app, `httpOnly` cookies would be safer.
- JWTs cannot be invalidated server-side before expiry without adding a blocklist (not implemented here).
- OAuth/SSO would be more appropriate for a multi-user or enterprise scenario; this design supports only a single admin account.
- Password and default credentials are hardcoded in the seed function — must be changed before any public deployment.
