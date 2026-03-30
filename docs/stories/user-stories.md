# User Stories — Hearth and Grounds

---

## US-01 · Browse the Menu

**As a** customer visiting the café website,
**I can** browse all menu items organised by category (espresso, filter, food, roastery, pottery),
**so that** I can decide what I'd like to order before or during my visit.

**Complexity:** S

**Acceptance Criteria:**
1. The menu page displays all available items grouped by category.
2. Each item shows its name, description, and price.
3. Items marked as unavailable (`available = 0`) are hidden or visually indicated.
4. The page loads without requiring a login.
5. Categories with no available items are not shown.

**Dependencies:** none

---

## US-02 · Make a Table Reservation

**As a** customer who wants to visit the café,
**I can** submit a table reservation with my name, email, preferred date, time, and party size,
**so that** I can secure a spot without having to call.

**Complexity:** M

**Acceptance Criteria:**
1. The reservation form collects: name, email, phone (optional), date, time, party size, and notes.
2. Date and time fields prevent selecting dates in the past.
3. Submitting the form creates a reservation with status `pending`.
4. The customer sees a confirmation message after successful submission.
5. Required fields are validated client-side and server-side; errors are displayed inline.
6. No authentication is required to submit a reservation.

**Dependencies:** none

---

## US-03 · Contact the Café

**As a** customer with a question or feedback,
**I can** send a message to the café via a contact form,
**so that** staff can respond without me needing to find an email address.

**Complexity:** S

**Acceptance Criteria:**
1. The contact form collects name, email, and message.
2. All three fields are required; validation errors are shown inline.
3. A success confirmation is displayed after submission.
4. The message is stored in the database and readable by admin.
5. No authentication is required.

**Dependencies:** none

---

## US-04 · Admin Login

**As a** staff member,
**I can** log in to the admin panel with a username and password,
**so that** I can manage reservations, menu items, and contact messages securely.

**Complexity:** S

**Acceptance Criteria:**
1. The `/admin` route shows a login form when the user is not authenticated.
2. Valid credentials return a JWT stored in `localStorage`.
3. Invalid credentials display an appropriate error message without revealing which field is wrong.
4. All protected API endpoints return `401 Unauthorized` without a valid token.
5. Logging out clears the token and redirects to the login screen.

**Dependencies:** none

---

## US-05 · Manage Reservations (Admin)

**As a** staff member,
**I can** view all reservations and update their status (pending → confirmed → cancelled),
**so that** I can manage table availability and communicate booking decisions.

**Complexity:** M

**Acceptance Criteria:**
1. The admin panel lists all reservations with guest name, date, time, party size, and current status.
2. Staff can change the status of any reservation to `confirmed` or `cancelled`.
3. Reservations are sorted by date ascending by default.
4. The list is accessible only to authenticated admin users.
5. Status updates are persisted immediately with no page reload required.

**Dependencies:** US-04

---

## US-06 · Manage Menu Items (Admin)

**As a** staff member,
**I can** add, edit, or remove menu items and toggle their availability,
**so that** the online menu always reflects what is actually on offer.

**Complexity:** M

**Acceptance Criteria:**
1. Admin can create a new menu item with category, name, description, price, and position.
2. Admin can edit any existing item's fields.
3. Admin can toggle an item's availability without deleting it.
4. Admin can delete an item permanently.
5. Changes are reflected on the public menu immediately after saving.
6. All CRUD actions require a valid admin JWT.

**Dependencies:** US-04

---

## US-07 · Read Contact Messages (Admin)

**As a** staff member,
**I can** view all contact messages and mark them as read,
**so that** I can track which enquiries have been handled.

**Complexity:** S

**Acceptance Criteria:**
1. The admin panel lists all contact messages with sender name, email, message text, and timestamp.
2. Unread messages are visually distinguished from read ones.
3. Staff can mark a message as read with a single action.
4. The list is accessible only to authenticated admin users.
5. Messages are sorted by most recent first.

**Dependencies:** US-04

---

## US-08 · View Café Information

**As a** potential customer,
**I can** view the café's story, opening hours, location, and social links,
**so that** I can decide whether to visit and know when and where to go.

**Complexity:** S

**Acceptance Criteria:**
1. The About/Home page displays opening hours, address, and a short description of the café.
2. Social media links open in a new tab.
3. The page is accessible without login.
4. Content is readable on both mobile and desktop viewports.
5. A link or button leads to the reservations page from the homepage.

**Dependencies:** none
