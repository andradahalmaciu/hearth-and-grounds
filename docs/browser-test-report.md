# Browser Test Report — UI Verification
**Date:** 2026-03-28
**Tester:** Claude Code (Playwright MCP)
**App version:** feat/US-09 — Export Reservations as CSV
**Base URL:** http://localhost:5173

---

## Summary

| Result | Count |
|--------|-------|
| Tests passed | 8 |
| Tests failed | 0 |
| Console errors | 0 |
| Console warnings | 1 (harmless — React DevTools suggestion) |

---

## Test Cases

### 1. Admin Login Page
**Steps:** Navigate to `/admin`
**Expected:** Login form renders with username and password fields
**Result:** ✅ Pass — Form rendered correctly with H&G branding

---

### 2. Admin Login — Valid Credentials
**Steps:** Enter `admin` / `hearth2025`, click Sign In
**Expected:** Redirect to `/admin/dashboard`
**Result:** ✅ Pass — Redirected successfully

---

### 3. Admin Dashboard — Stats Display
**Steps:** Observe dashboard after login
**Expected:** Stats cards show Today's Reservations, Unread Messages, Menu Items with real values
**Result:** ✅ Pass — Displayed: 0 reservations today, 0 unread messages, 39 menu items. Date shown correctly as Saturday, 28 March 2026.

---

### 4. Admin Reservations — Page Load
**Steps:** Click Reservations in sidebar
**Expected:** Page loads with date filter, Show All button, and Export CSV button
**Result:** ✅ Pass — All controls present. Empty state message shown correctly for today's date.

---

### 5. Export CSV — Button Present and Functional (US-09)
**Steps:** Click Export CSV button on Reservations page
**Expected:** File downloads as `reservations-YYYY-MM-DD.csv` with correct CSV headers
**Result:** ✅ Pass
- File downloaded: `reservations-2026-03-28.csv`
- First line: `id,name,email,phone,date,time,party_size,status,notes,created_at`
- No JavaScript errors thrown

---

### 6. Public Reservation Form — Renders
**Steps:** Navigate to `/reserve`
**Expected:** Form with name, email, phone, date, time, party size, notes fields
**Result:** ✅ Pass — All fields present, time slot dropdown populated with 11 options (09:00–19:00), party size 1–10

---

### 7. Public Reservation Form — Successful Submission
**Steps:** Fill name (Andrada Halmaciu), email (andrada@example.com), date (2026-12-20), time (14:00), party size (2), click Reserve My Table
**Expected:** Confirmation screen with booking details
**Result:** ✅ Pass — "Booking Confirmed / See you then." displayed with correct details

---

### 8. Console Error Check
**Steps:** Reviewed all console messages across the full session
**Expected:** 0 errors
**Result:** ✅ Pass — 0 errors. 1 warning (React DevTools install suggestion from the React library itself — not application code)

---

## Screenshot

Reservation confirmation screen captured at end of session:

![Reservation confirmation](../reserve-confirmation.png)

---

## Notes

- The `Export CSV` button correctly names the file with the active date filter (e.g. `reservations-2026-03-28.csv`) when a date is selected, or `reservations.csv` when Show All is active
- All protected admin routes correctly require authentication (verified via API integration tests — see `backend/tests/reservations.test.ts`)
- Form validation prevents submission without required fields (name, email, date, time)
