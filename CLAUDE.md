# CLAUDE.md — Hearth and Grounds

This file provides Claude Code with context about the project structure, conventions, and development workflow.

## Project Overview

**Hearth and Grounds** is a specialty coffee shop web app. It has a public-facing site (menu, reservations, contact) and a password-protected admin panel for staff.

### Key domains
- **Menu** — categorised items (espresso, filter, food, roastery, pottery); managed by admin
- **Reservations** — customers book tables; admin reviews and updates status
- **Contact** — customers send messages; admin marks them as read
- **Auth** — single admin user, JWT-based, bcrypt password hashing

---

## Repository Layout

```
hearth-and-grounds/
├── frontend/          React 19 + Vite + Tailwind CSS
├── backend/           Express + TypeScript + SQLite
├── docs/
│   ├── adr/           Architecture Decision Records
│   └── stories/       User stories (markdown)
├── package.json       Root workspace — runs both apps via concurrently
└── CLAUDE.md          This file
```

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Frontend framework | React 19 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v7 |
| Backend framework | Express 4 |
| Language | TypeScript (backend), JavaScript (frontend) |
| Database | SQLite via better-sqlite3 |
| Auth | JWT + bcryptjs |
| Input validation | Zod (backend) |
| Unit/integration tests | Vitest + Supertest |
| E2E tests | Playwright |

---

## Development Commands

```bash
npm run dev          # Start frontend (port 5173) + backend (port 3001) concurrently
npm test             # Run all Vitest tests (backend + frontend)
npm run test:e2e     # Run Playwright E2E tests
npm run lint         # TypeScript check (backend) + ESLint (frontend)
npm run build        # Production build of frontend
```

---

## Backend Conventions

- All routes live in `backend/src/routes/` — one file per domain (`auth.ts`, `menu.ts`, `reservations.ts`, `contact.ts`)
- DB access goes through `backend/src/db/schema.ts` — always use `getDb()`, never instantiate `Database` directly
- Request bodies are validated with Zod schemas before any business logic
- Protected routes require the `authenticate` middleware (JWT bearer token)
- The SQLite DB is seeded with menu items and a default admin user on first run

## Frontend Conventions

- Pages live in `frontend/src/pages/`; shared UI in `frontend/src/components/`
- API calls are centralised in `frontend/src/services/`
- Auth state is managed via `frontend/src/context/` (React Context + localStorage token)

---

## API Endpoints (summary)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Admin login, returns JWT |
| GET | `/api/menu` | — | List all menu items |
| POST | `/api/menu` | ✓ | Create menu item |
| PUT | `/api/menu/:id` | ✓ | Update menu item |
| DELETE | `/api/menu/:id` | ✓ | Delete menu item |
| GET | `/api/reservations` | ✓ | List reservations |
| POST | `/api/reservations` | — | Create reservation |
| PUT | `/api/reservations/:id` | ✓ | Update reservation status |
| GET | `/api/contact` | ✓ | List contact messages |
| POST | `/api/contact` | — | Submit contact message |
| PUT | `/api/contact/:id/read` | ✓ | Mark message as read |

---

## Testing Approach

- **Unit tests** — Vitest, co-located or in `tests/` subdirectories
- **Integration tests** — Supertest against the Express app (in-memory SQLite for isolation)
- **E2E tests** — Playwright, in `tests/` at the repo root

---

## Environment Variables

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `3001` | Backend port |
| `DB_PATH` | `backend/hearth.db` | SQLite file |
| `JWT_SECRET` | dev fallback | Must be overridden in production |

---

## Default Admin Credentials (dev only)

- Username: `admin`
- Password: `hearth2025`

---

## Z-Cora Agents

Z-Cora is the Zartis Claude Code plugin (installed at `~/git/claude-plugin`). It follows a **plan-first** workflow: Analyse → Plan → Approve → Implement → Verify. Never jumps straight to code.

| Agent | Command | When to use |
|-------|---------|-------------|
| `product-manager` | `/z-idea-to-prd`, `/z-prd-to-stories` | Writing PRDs, breaking epics into user stories |
| `business-analyst` | `/z-create-story-map` | Story maps, user journeys, acceptance criteria |
| `system-architect` | `/z-system-architect` | Data model changes, new dependencies, API design, auth decisions |
| `senior-developer` | `/z-implement-story [id]`, `/z-bug-fix [id]` | Feature implementation with unit tests, bug fixes with root cause analysis |
| `qa-specialist` | `/z-test-story [id]`, `/z-generate-gherkin` | Integration tests, Gherkin scenarios, test pyramid validation |
| `codebase-scout` | `/z-discovery` | Exploring unfamiliar code, finding patterns, impact analysis before changes |
| `license-guardian` | `/z-check-license [pkg]`, `/z-dependency-audit` | OSS license compliance, security audit of dependencies |

### Key commands for this project

```
/z-system-architect        # Architecture consultation — use before any data model or API change
/z-implement-story [id]    # Plan + implement an ADO story with unit tests
/z-test-story [id]         # Add integration tests after implementation
/z-bug-fix [id]            # Fix a bug with root cause analysis, tests, and PR
/z-dependency-audit        # Audit backend/frontend dependencies for vulnerabilities
```

### Test pyramid enforced by Z-Cora

- 70% unit tests — written during `/z-implement-story`
- 20% integration tests — added by `/z-test-story`
- 10% E2E tests — Playwright, in `tests/` at repo root
- Quality gate: >80% overall coverage, >90% for business logic
