# Access Control Fix — StockFlow Client

**Date:** 2026-06-24
**Status:** Approved
**Scope:** Client-side route protection for all 3 dashboards (~28 pages)

---

## Problem

The StockFlow Next.js client has **zero access control**. Every dashboard page (admin, supplier, customer) is accessible to anyone who types the URL directly. There is:

- No `middleware.ts`
- No `AuthContext` / `AuthProvider` / `useAuth` hook
- No route guards, `ProtectedRoute`, or role-checking components
- No admin layout file (the `(admin)` route group has no `layout.tsx`)
- Individual pages read tokens from `localStorage` for API calls, but never check whether the user should be on that page at all

A customer can access `/admin-dashboard`. An unauthenticated user can access `/supplier-dashboard`. The API calls will fail (backend validates tokens), but the full UI renders with empty/error states — exposing structure, navigation, and component layout to unauthorized users.

---

## Existing Auth Flow

1. User submits credentials to `POST /api/users/login`
2. Backend returns `{ token: "jwt...", user: { role: "Customer" | "Supplier" | "Admin", ... } }`
3. Login page stores `token` and `user` in `localStorage`
4. Login page redirects based on `data.user.role`:
   - `Admin` → `/admin-dashboard`
   - `Supplier` → `/supplier-dashboard`
   - `Customer` → `/dashboard`
5. Sidebar components have a `handleLogout()` that clears localStorage and redirects to `/login`
6. API client (`lib/api.ts`) reads token from `localStorage.user.token` or `localStorage.token`

**Roles:** `Admin`, `Supplier`, `Customer` (strings, set by backend)

---

## Solution: Middleware + AuthContext (Approach A)

### Architecture

```
Browser Request
     │
     ▼
┌─────────────────────────────────┐
│  middleware.ts (Edge Runtime)    │
│  • Reads stockflow-auth cookie  │
│  • Decodes JWT, checks expiry   │
│  • Enforces route-to-role map   │
│  • Redirects if unauthorized    │
└──────────────┬──────────────────┘
               │ (allowed)
               ▼
┌─────────────────────────────────┐
│  AuthProvider (Client Context)  │
│  • Reads user from localStorage │
│  • Provides user/role/logout    │
│  • Periodic expiry check (60s)  │
│  • Auto-logout on expiry        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Page Component renders         │
│  • Guaranteed authenticated     │
│  • Guaranteed correct role      │
└─────────────────────────────────┘
```

### Route-to-Role Mapping

| Route Pattern            | Allowed Role | If Unauthorized         |
| ------------------------ | ------------ | ----------------------- |
| `/(admin)/*`             | `Admin`      | Redirect to own dash    |
| `/(supplier)/*`          | `Supplier`   | Redirect to own dash    |
| `/(customer)/*`          | `Customer`   | Redirect to own dash    |
| `/login`                 | Public       | If logged in → own dash |
| `/signup`                | Public       | If logged in → own dash |
| `/`                      | Public       | No restriction          |

### Role-to-Dashboard Mapping

| Role       | Home Dashboard       |
| ---------- | -------------------- |
| `Admin`    | `/admin-dashboard`   |
| `Supplier` | `/supplier-dashboard`|
| `Customer` | `/dashboard`         |

---

## New Files (4)

### 1. `client/middleware.ts` — Next.js Middleware

**Purpose:** Intercept all protected route requests server-side, before any page code runs.

**Behavior:**
- Route matcher config: `/(admin)/:path*`, `/(supplier)/:path*`, `/(customer)/:path*`, `/login`, `/signup`
- Reads `stockflow-auth` cookie → parses JSON → extracts `token` and `role`
- Decodes JWT payload (base64) to check `exp` claim against current time
- **No token or expired:** Redirect to `/login?redirect={original_url}`
- **Valid token, wrong role:** Redirect to user's correct dashboard
- **Valid token, correct role:** Allow request to proceed
- **Logged-in user on /login or /signup:** Redirect to their dashboard

**Route matching config:**
```typescript
export const config = {
  matcher: [
    '/(admin)/:path*',
    '/(supplier)/:path*',
    '/(customer)/:path*',
    '/login',
    '/signup',
  ],
}
```

### 2. `client/lib/auth.ts` — Shared Auth Utilities

**Purpose:** Centralized auth helper functions used by both middleware and client code.

**Exports:**
- `ROLES` constant: `{ ADMIN: 'Admin', SUPPLIER: 'Supplier', CUSTOMER: 'Customer' }`
- `parseJwt(token: string): JwtPayload | null` — base64-decodes the JWT payload section, returns parsed JSON or null on failure
- `isTokenExpired(token: string): boolean` — decodes JWT, checks if `exp * 1000 < Date.now()`, returns true if expired or decode fails
- `getRoleDashboard(role: string): string` — maps role string to home dashboard path
- `ROUTE_ROLE_MAP` constant: maps route group prefixes to required roles
- `setAuthCookie(token: string, role: string): void` — sets `stockflow-auth` cookie with JSON value `{ token, role }`, Path `/`, SameSite `Lax`, Max-Age 7 days
- `clearAuthCookie(): void` — clears the `stockflow-auth` cookie

### 3. `client/lib/AuthContext.tsx` — React Context Provider

**Purpose:** Provide authentication state to all client components.

**AuthProvider component:**
- On mount: reads `user` from `localStorage`, parses it, sets state
- Checks token expiry on mount and every 60 seconds via `setInterval`
- If token is expired → calls `logout()`
- Exposes context value: `{ user, role, token, isAuthenticated, isLoading, logout }`

**`logout()` function:**
- Clears `localStorage` keys: `token`, `user`, `supplierToken`
- Calls `clearAuthCookie()`
- Redirects to `/login` via `router.push`

**`useAuth()` hook:**
- Convenience hook wrapping `useContext(AuthContext)`
- Throws if used outside `AuthProvider`

### 4. `client/app/(admin)/layout.tsx` — Admin Layout

**Purpose:** The admin route group currently has no layout file. All 18 admin pages import `AdminSidebar` directly into each page component. This layout will wrap all admin pages consistently, matching the pattern of the supplier and customer layouts.

**Structure:**
- `"use client"` directive
- Loads Neo Brutalism fonts (same pattern as supplier/customer layouts)
- Renders `<AdminSidebar />` + `{children}` in flex layout
- No auth logic here — middleware handles it

**Follow-up task (not blocking access control):** After the layout is created, each of the 18 admin pages should have their individual `<AdminSidebar />` import and rendering removed, since the layout now provides it. This is a separate cleanup task to avoid a large diff in the access control PR.

---

## Modified Files (3)

### 5. `client/app/login/page.tsx`

**Changes:**
- Import `setAuthCookie` from `@/lib/auth`
- After `localStorage.setItem("token", data.token)` and `localStorage.setItem("user", ...)`, add: `setAuthCookie(data.token, data.user.role)`
- Read `redirect` query param from URL: if present, navigate there instead of default dashboard
- Import `useSearchParams` from `next/navigation`

### 6. `client/app/layout.tsx`

**Changes:**
- Import `AuthProvider` from `@/lib/AuthContext`
- Wrap `{children}` with `<AuthProvider>{children}</AuthProvider>`
- This must be a client component boundary or use a separate client wrapper since the root layout is a server component

**Approach for server/client boundary:**
- Create a thin `client/app/Providers.tsx` client component that wraps children in `AuthProvider`
- Root layout imports and uses `<Providers>{children}</Providers>`
- Root layout stays as a server component (important for metadata)

### 7. `client/lib/api.ts`

**Changes:**
- Import `isTokenExpired`, `clearAuthCookie` from `@/lib/auth`
- In `getToken()`: after retrieving the token, check `isTokenExpired(token)`. If expired, clear localStorage + cookie, return empty string
- This prevents API calls with expired tokens from even being attempted

---

## Redirect Flows

### Unauthenticated user visits protected page

```
User visits /admin-dashboard
  → middleware reads cookie → empty
  → redirect to /login?redirect=%2Fadmin-dashboard
  → user logs in
  → login reads ?redirect param
  → navigates to /admin-dashboard
```

### Wrong-role access

```
Customer visits /supplier-dashboard
  → middleware reads cookie → { role: "Customer" }
  → /(supplier)/* requires "Supplier" → mismatch
  → redirect to /dashboard (Customer's home)
```

### Token expires while user is on page

```
User is on /admin-dashboard, token expires
  → AuthContext interval check fires (every 60s)
  → isTokenExpired() returns true
  → logout() called
  → localStorage cleared, cookie cleared
  → redirect to /login
```

### Already-logged-in user visits /login

```
Logged-in Admin visits /login
  → middleware reads cookie → { role: "Admin" }, token valid
  → redirect to /admin-dashboard
```

---

## Cookie Specification

| Property   | Value                                    |
| ---------- | ---------------------------------------- |
| Name       | `stockflow-auth`                         |
| Value      | JSON: `{ "token": "...", "role": "..." }`|
| Path       | `/`                                      |
| SameSite   | `Lax`                                    |
| HttpOnly   | `false` (must be readable by Edge middleware and writable from client JS) |
| Secure     | `true` in production, `false` in dev     |
| Max-Age    | `604800` (7 days)                        |

---

## Security Considerations

- **Client-side JWT decode only — no secret verification.** The middleware decodes the JWT payload (base64) to read `role` and `exp`, but does NOT verify the signature. This is intentional: the backend validates the full JWT signature on every API call. The middleware is a UX guard, not a security boundary.
- **Cookie is NOT HttpOnly** because it must be writable from client-side JS (login page) and readable by Edge middleware. The real auth token in the cookie is the same one already stored in `localStorage`, so this doesn't introduce new XSS surface.
- **Backend remains the true security boundary.** Even if a user manipulates the cookie to change their role, all API endpoints validate the JWT token independently. They will only return data appropriate to the token's actual role.

---

## Pages Protected by This Change

### Admin Dashboard (13 pages)
1. `/admin-dashboard`
2. `/stock-management`
3. `/finance&funds`
4. `/admin-payments`
5. `/settings`
6. `/customers/requirements`
7. `/customers/quotations`
8. `/customers/create-quotation`
9. `/customers/orders`
10. `/customers/delivery-tracking`
11. `/customers/invoices`
12. `/customers/payments`
13. `/suppliers/customer-requirements-requests`
14. `/suppliers/supplier-quotations`
15. `/suppliers/purchase-orders`
16. `/suppliers/delivery-tracking`
17. `/suppliers/invoices`
18. `/suppliers/payments`

### Supplier Dashboard (8 pages)
1. `/supplier-dashboard`
2. `/customer-requirements`
3. `/create-quotation`
4. `/quotation-status`
5. `/orders`
6. `/delivery&dispatch`
7. `/invoice-submission`
8. `/payment`

### Customer Dashboard (8 pages)
1. `/dashboard`
2. `/send-requirements`
3. `/quotations`
4. `/my-orders`
5. `/delivery-tracking`
6. `/invoices`
7. `/payments`
8. `/customer-settings`

**Total: 34 pages protected by 4 new files + 3 file modifications. No individual page edits required.**

---

## Implementation Order

1. Create `lib/auth.ts` (shared utilities — no dependencies)
2. Create `middleware.ts` (depends on auth utilities concept, but standalone file)
3. Create `lib/AuthContext.tsx` (depends on auth.ts)
4. Create `app/(admin)/layout.tsx` (standalone, fixes missing layout)
5. Modify `app/login/page.tsx` (set cookie on login)
6. Create `app/Providers.tsx` and modify `app/layout.tsx` (wrap with AuthProvider)
7. Modify `lib/api.ts` (add expiry check to getToken)

---

## Testing Strategy

- **Manual testing:** Log in as each role, verify correct dashboard access, verify wrong-role redirect, verify unauthenticated redirect
- **Edge cases:** Expired token, corrupted cookie, missing localStorage, direct URL navigation
- **Verify no regression:** Confirm all existing pages still render correctly, API calls still work, sidebar logout still functions
