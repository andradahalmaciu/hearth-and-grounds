# Hearth & Grounds

A full-stack web application for a specialty coffee shop. Customers can browse the menu, make table reservations, and send contact messages — while staff manage everything through a password-protected admin panel.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Environment Variables](#environment-variables)
- [Architecture Decision Records](#architecture-decision-records)

---

## Features

### Public
- **Menu** — Browse all items organised by category (Espresso, Filter, Food, Roastery, Art & Pottery). Items marked unavailable are hidden. Data is served live from the API with a static fallback.
- **Reservations** — Submit a table booking (name, email, phone, date, time, party size, notes). Client-side and server-side validation. Confirmation shown on success.
- **Contact** — Send a message to the café. Stored in the database and readable by admin.
- **About / Home** — Café story, opening hours, location, social links.

### Admin (authenticated)
- **Dashboard** — Overview stats: today's reservations, unread messages, total menu items.
- **Reservations** — List all bookings, filter by date, update status (pending → confirmed → cancelled), **export as CSV**.
- **Menu Items** — Full CRUD: add, edit, toggle availability, delete items. Changes reflect immediately on the public menu.
- **Messages** — View all contact messages, mark as read, sorted most-recent first.

---

## Architecture

```
Browser
  │
  ▼
React SPA (Vite, port 5173)
  │  /api/* proxied to backend
  ▼
Express REST API (TypeScript, port 3001)
  │
  ├── Zod validation (request bodies)
  ├── JWT middleware (protected routes)
  │
  ▼
SQLite database (better-sqlite3)
  │
  ├── menu_items
  ├── reservations
  ├── contact_messages
  └── admin_users
```

The frontend is a single-page React app. All API calls go to `/api/*` — in development these are proxied by Vite to the Express backend on port 3001. In production the frontend is built to static files and served separately (or via the same Express server).

Auth uses **JWT bearer tokens**: the admin logs in via `POST /api/auth/login`, receives a token stored in `localStorage`, and sends it as `Authorization: Bearer <token>` on all protected requests. There is one admin user seeded at startup.

The database is **SQLite** (file-based, zero setup). Schema is initialised automatically on first connection via `CREATE TABLE IF NOT EXISTS`. Seed data (menu items and the default admin user) is inserted once on startup.

---

## Tech Stack

| Concern | Technology | Notes |
|---------|-----------|-------|
| Frontend framework | React 19 + Vite | HMR in dev, optimised bundle in prod |
| Styling | Tailwind CSS | Custom design tokens (espresso, clay, parchment…) |
| Routing | React Router v7 | Client-side SPA routing |
| Backend framework | Express 4 | REST API, TypeScript |
| Language | TypeScript (backend), JavaScript (frontend) | |
| Database | SQLite via better-sqlite3 | File-based, zero config |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless, bearer token |
| Input validation | Zod | Server-side schema validation |
| Unit/integration tests | Vitest + Supertest | 70 tests (45 backend, 25 frontend) |
| E2E tests | Playwright | Full browser automation |
| CI/CD | Azure DevOps Pipelines | Lint → Test → Build |

---

## Project Structure

```
hearth-and-grounds/
├── frontend/                   # React + Vite SPA
│   └── src/
│       ├── pages/              # Route-level components
│       │   ├── Home.jsx
│       │   ├── Menu.jsx        # Public menu with category tabs
│       │   ├── Reserve.jsx     # Reservation form
│       │   ├── About.jsx
│       │   ├── GalleryContact.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx   # Stats overview
│       │       ├── AdminLogin.jsx
│       │       ├── AdminMenu.jsx        # Menu CRUD
│       │       ├── AdminReservations.jsx # Reservations + CSV export
│       │       └── AdminMessages.jsx    # Contact messages
│       ├── components/         # Navbar, Footer
│       ├── services/api.js     # Centralised fetch calls
│       ├── context/            # AuthContext (JWT state)
│       ├── utils/              # Email validation helper
│       └── tests/              # Vitest + Testing Library unit tests
│
├── backend/                    # Express + TypeScript API
│   └── src/
│       ├── routes/             # One file per domain
│       │   ├── auth.ts         # POST /api/auth/login
│       │   ├── menu.ts         # GET/POST/PUT/DELETE /api/menu
│       │   ├── reservations.ts # GET/POST/PATCH + CSV export
│       │   └── contact.ts      # GET/POST/PATCH /api/contact
│       ├── db/schema.ts        # SQLite init, seed, getDb()
│       ├── middleware/auth.ts  # JWT requireAuth middleware
│       ├── utils/              # Email + Zod validation helpers
│       └── types/index.ts      # Shared TypeScript interfaces
│   └── tests/                  # Vitest + Supertest integration tests
│
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   │   ├── 001-tech-stack.md
│   │   ├── 002-authentication.md
│   │   └── 003-data-model.md
│   └── stories/user-stories.md # All user stories (US-01 to US-09)
│
├── azure-pipelines.yml         # CI/CD pipeline (Lint → Test → Build)
├── package.json                # Workspace root — runs both apps concurrently
└── CLAUDE.md                   # AI assistant instructions for this project
```

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd hearth-and-grounds

# Install all dependencies (root + frontend + backend)
npm install
npm install --prefix frontend
npm install --prefix backend
```

The SQLite database and seed data are created automatically on first run — no manual DB setup required.

---

## Running the App

```bash
# Start both frontend and backend in development mode
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

Vite proxies all `/api/*` requests to the backend, so the frontend never needs to know the backend port.

---

## Admin Panel

Navigate to `http://localhost:5173/admin` and log in with the default development credentials:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `hearth2025` |

> **Never use these credentials in production.** Set `JWT_SECRET` via environment variable and change the admin password before deploying.

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Returns JWT on valid credentials |

### Menu
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/menu` | — | List available items grouped by category |
| GET | `/api/menu/all` | ✓ | List all items including unavailable |
| POST | `/api/menu` | ✓ | Create a menu item |
| PUT | `/api/menu/:id` | ✓ | Update a menu item |
| DELETE | `/api/menu/:id` | ✓ | Delete a menu item permanently |

### Reservations
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/reservations` | — | Create a reservation (status: pending) |
| GET | `/api/reservations` | ✓ | List all reservations (`?date=YYYY-MM-DD` to filter) |
| GET | `/api/reservations/export` | ✓ | Download all reservations as CSV (`?date=` optional) |
| PATCH | `/api/reservations/:id` | ✓ | Update status (pending/confirmed/cancelled) |

### Contact
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contact` | — | Submit a contact message |
| GET | `/api/contact` | ✓ | List all messages |
| PATCH | `/api/contact/:id/read` | ✓ | Mark a message as read |

---

## Testing

```bash
# All unit + integration tests (backend + frontend)
npm test

# Backend tests only
npm run test --prefix backend

# Frontend tests only
npm run test --prefix frontend

# E2E tests (requires both apps running)
npm run test:e2e

# Linting (ESLint + TypeScript check)
npm run lint
```

### Test pyramid

| Layer | Count | Framework |
|-------|-------|-----------|
| Backend unit + integration | 45 | Vitest + Supertest (in-memory SQLite) |
| Frontend unit | 25 | Vitest + Testing Library |
| E2E | Playwright | Full browser, requires running app |

Coverage targets: >80% overall, >90% for business logic.

---

## CI/CD

`azure-pipelines.yml` defines a three-stage pipeline triggered on all PRs and pushes to `main`:

1. **Lint** — ESLint (frontend) + TypeScript compiler check (backend)
2. **Test** — All Vitest tests (backend + frontend)
3. **Build** — Vite production build (runs on `main` only), publishes `frontend/dist` as a pipeline artifact

---

## Environment Variables

Set these on the backend before running in production:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | API server port |
| `DB_PATH` | `backend/hearth.db` | Path to the SQLite database file |
| `JWT_SECRET` | dev fallback | Secret used to sign JWTs — **must be overridden in production** |

---

## Architecture Decision Records

Key design decisions are documented in `docs/adr/`:

| ADR | Decision |
|-----|---------|
| [001](docs/adr/001-tech-stack.md) | React + Vite frontend, Express + TypeScript backend, SQLite database |
| [002](docs/adr/002-authentication.md) | JWT bearer tokens, single admin user, bcrypt password hashing |
| [003](docs/adr/003-data-model.md) | Four flat SQLite tables, no ORM, self-initialising schema |
