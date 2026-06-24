# Access Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add client-side route protection so all 34 dashboard pages are gated by authentication and role — unauthenticated users redirect to `/login`, wrong-role users redirect to their own dashboard.

**Architecture:** Next.js middleware intercepts every protected route server-side (via a `stockflow-auth` cookie), redirecting unauthorized requests before any page code runs. An `AuthProvider` React context reads `localStorage` client-side and provides `user/role/logout` to all components, with a 60-second polling interval that auto-logs-out on token expiry.

**Tech Stack:** Next.js 15 (App Router), TypeScript, React Context, JWT (base64 decode only — no secret verification on client)

## Global Constraints

- Path alias: `@/*` maps to `./*` (project root)
- Roles are strings: `"Admin"`, `"Supplier"`, `"Customer"` (backend-defined)
- JWT is stored in `localStorage` under key `"token"` and also inside `JSON.parse(localStorage.user).token`
- Cookie name: `stockflow-auth`, JSON value `{ token, role }`, Path `/`, SameSite `Lax`, not HttpOnly, Max-Age 604800
- No backend changes — client-only
- No individual page edits for access control — all protection via middleware + layouts

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/auth.ts` | Create | JWT decode, expiry check, cookie helpers, role constants, route-role map |
| `middleware.ts` | Create | Edge-runtime route interceptor — reads cookie, enforces role, redirects |
| `lib/AuthContext.tsx` | Create | React context + provider + `useAuth()` hook |
| `app/Providers.tsx` | Create | Thin client wrapper so root layout stays a server component |
| `app/(admin)/layout.tsx` | Create | Admin route group layout with `AdminSidebar` |
| `app/login/page.tsx` | Modify | Set auth cookie on login, support `?redirect` query param |
| `app/layout.tsx` | Modify | Wrap children in `<Providers>` |
| `lib/api.ts` | Modify | Add expiry check to `getToken()`, clear stale tokens |

---

### Task 1: Auth Utilities (`lib/auth.ts`)

**Files:**
- Create: `lib/auth.ts`

**Interfaces:**
- Consumes: nothing (leaf module)
- Produces:
  - `ROLES: { ADMIN: "Admin", SUPPLIER: "Supplier", CUSTOMER: "Customer" }`
  - `COOKIE_NAME: "stockflow-auth"`
  - `parseJwt(token: string): { exp?: number; [key: string]: unknown } | null`
  - `isTokenExpired(token: string): boolean`
  - `getRoleDashboard(role: string): string`
  - `getRouteRequiredRole(pathname: string): string | null`
  - `setAuthCookie(token: string, role: string): void`
  - `clearAuthCookie(): void`

- [ ] **Step 1: Create `lib/auth.ts` with role constants and JWT helpers**

```typescript
// lib/auth.ts

export const ROLES = {
  ADMIN: "Admin",
  SUPPLIER: "Supplier",
  CUSTOMER: "Customer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const COOKIE_NAME = "stockflow-auth";

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.SUPPLIER]: "/supplier-dashboard",
  [ROLES.CUSTOMER]: "/dashboard",
};

// Route group prefix → required role
const ROUTE_ROLE_MAP: Record<string, string> = {
  "/(admin)": ROLES.ADMIN,
  "/(supplier)": ROLES.SUPPLIER,
  "/(customer)": ROLES.CUSTOMER,
};

/**
 * Base64-decode a JWT payload. Returns null on any failure.
 * Does NOT verify the signature — backend does that on API calls.
 */
export function parseJwt(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Returns true if the token is expired or cannot be decoded.
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now();
}

/**
 * Maps a role string to its home dashboard path.
 * Falls back to "/login" for unknown roles.
 */
export function getRoleDashboard(role: string): string {
  return ROLE_DASHBOARD_MAP[role] || "/login";
}

/**
 * Given a Next.js pathname, returns the required role if it falls
 * under a protected route group, or null if it's public.
 *
 * Next.js strips route-group parentheses from the URL, so we match
 * by the URL paths that belong to each group:
 *   /admin-dashboard, /stock-management, /finance&funds, /admin-payments,
 *   /settings, /customers/*, /suppliers/* → Admin
 *   /supplier-dashboard, /customer-requirements, /create-quotation,
 *   /quotation-status, /orders, /delivery&dispatch, /invoice-submission,
 *   /payment → Supplier
 *   /dashboard, /send-requirements, /quotations, /my-orders,
 *   /delivery-tracking, /invoices, /payments, /customer-settings → Customer
 */

const ADMIN_PATHS = [
  "/admin-dashboard",
  "/stock-management",
  "/finance&funds",
  "/admin-payments",
  "/settings",
  "/customers",
  "/suppliers",
];

const SUPPLIER_PATHS = [
  "/supplier-dashboard",
  "/customer-requirements",
  "/create-quotation",
  "/quotation-status",
  "/orders",
  "/delivery&dispatch",
  "/invoice-submission",
  "/payment",
];

const CUSTOMER_PATHS = [
  "/dashboard",
  "/send-requirements",
  "/quotations",
  "/my-orders",
  "/delivery-tracking",
  "/invoices",
  "/payments",
  "/customer-settings",
];

export function getRouteRequiredRole(pathname: string): string | null {
  // Check admin paths first (most specific — /customers and /suppliers are admin-only)
  for (const prefix of ADMIN_PATHS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return ROLES.ADMIN;
    }
  }
  for (const prefix of SUPPLIER_PATHS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return ROLES.SUPPLIER;
    }
  }
  for (const prefix of CUSTOMER_PATHS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return ROLES.CUSTOMER;
    }
  }
  return null;
}

/**
 * Set the auth cookie from client-side JS.
 * The cookie carries { token, role } so middleware (Edge Runtime) can read it.
 */
export function setAuthCookie(token: string, role: string): void {
  const value = JSON.stringify({ token, role });
  const secure = window.location.protocol === "https:";
  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    "path=/",
    "samesite=lax",
    `max-age=604800`,
    secure ? "secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

/**
 * Clear the auth cookie.
 */
export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit lib/auth.ts 2>&1 | head -20`

Expected: no errors (or only errors from missing external module references, which is fine since this file has no imports)

- [ ] **Step 3: Commit**

```bash
git add lib/auth.ts
git commit -m "feat(auth): add shared auth utilities — JWT decode, expiry check, cookie helpers, role constants

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Next.js Middleware (`middleware.ts`)

**Files:**
- Create: `middleware.ts` (project root, i.e. `client/middleware.ts`)

**Interfaces:**
- Consumes: concepts from `lib/auth.ts` (but middleware can't import from `lib/` in Edge Runtime with all setups, so we inline the minimal helpers needed: `parseJwt`, `isTokenExpired`, role maps). We duplicate the small pure functions rather than risk Edge Runtime import issues.
- Produces: HTTP redirects (no code interface — this is a route interceptor)

**Important:** Next.js middleware runs in the Edge Runtime. It can read cookies from the request object via `request.cookies.get()`. It cannot access `localStorage`. The `stockflow-auth` cookie is its only data source.

**Important:** Next.js strips route-group parentheses (`(admin)`, `(supplier)`, `(customer)`) from URLs. The middleware `config.matcher` must use the actual URL paths, not the filesystem route-group names. Since each route group contains pages at distinct URL paths (e.g., `/admin-dashboard`, `/supplier-dashboard`, `/dashboard`), we match on those paths.

- [ ] **Step 1: Create `middleware.ts`**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "stockflow-auth";

const ROLES = {
  ADMIN: "Admin",
  SUPPLIER: "Supplier",
  CUSTOMER: "Customer",
} as const;

const ROLE_DASHBOARD: Record<string, string> = {
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.SUPPLIER]: "/supplier-dashboard",
  [ROLES.CUSTOMER]: "/dashboard",
};

// ── URL-path prefixes belonging to each role ──────────────────────────
const ADMIN_PREFIXES = [
  "/admin-dashboard",
  "/stock-management",
  "/finance&funds",
  "/admin-payments",
  "/settings",
  "/customers",
  "/suppliers",
];

const SUPPLIER_PREFIXES = [
  "/supplier-dashboard",
  "/customer-requirements",
  "/create-quotation",
  "/quotation-status",
  "/orders",
  "/delivery&dispatch",
  "/invoice-submission",
  "/payment",
];

const CUSTOMER_PREFIXES = [
  "/dashboard",
  "/send-requirements",
  "/quotations",
  "/my-orders",
  "/delivery-tracking",
  "/invoices",
  "/payments",
  "/customer-settings",
];

function requiredRole(pathname: string): string | null {
  for (const p of ADMIN_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return ROLES.ADMIN;
  }
  for (const p of SUPPLIER_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return ROLES.SUPPLIER;
  }
  for (const p of CUSTOMER_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return ROLES.CUSTOMER;
  }
  return null;
}

function parseJwt(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 < Date.now();
}

function readCookie(req: NextRequest): { token: string; role: string } | null {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed?.token && parsed?.role) return parsed;
  } catch {}
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = readCookie(req);
  const hasValidToken = auth && !isExpired(auth.token);

  // ── Public auth pages: redirect logged-in users to their dashboard ──
  if (pathname === "/login" || pathname === "/signup") {
    if (hasValidToken) {
      const dest = ROLE_DASHBOARD[auth.role] || "/";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // ── Protected pages ─────────────────────────────────────────────────
  const needed = requiredRole(pathname);
  if (!needed) {
    // Not a protected path — let it through (/, static assets, etc.)
    return NextResponse.next();
  }

  // Not authenticated → redirect to login with ?redirect
  if (!hasValidToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but wrong role → redirect to their own dashboard
  if (auth.role !== needed) {
    const dest = ROLE_DASHBOARD[auth.role] || "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Correct role — allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth pages (redirect if already logged in)
    "/login",
    "/signup",
    // Admin pages
    "/admin-dashboard/:path*",
    "/stock-management/:path*",
    "/finance&funds/:path*",
    "/admin-payments/:path*",
    "/settings/:path*",
    "/customers/:path*",
    "/suppliers/:path*",
    // Supplier pages
    "/supplier-dashboard/:path*",
    "/customer-requirements/:path*",
    "/create-quotation/:path*",
    "/quotation-status/:path*",
    "/orders/:path*",
    "/delivery&dispatch/:path*",
    "/invoice-submission/:path*",
    "/payment/:path*",
    // Customer pages
    "/dashboard/:path*",
    "/send-requirements/:path*",
    "/quotations/:path*",
    "/my-orders/:path*",
    "/delivery-tracking/:path*",
    "/invoices/:path*",
    "/payments/:path*",
    "/customer-settings/:path*",
  ],
};
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit middleware.ts 2>&1 | head -20`

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): add Next.js middleware for route protection — cookie-based role enforcement

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Auth Context Provider (`lib/AuthContext.tsx`)

**Files:**
- Create: `lib/AuthContext.tsx`

**Interfaces:**
- Consumes:
  - `isTokenExpired(token: string): boolean` from `lib/auth.ts`
  - `clearAuthCookie(): void` from `lib/auth.ts`
  - `getRoleDashboard(role: string): string` from `lib/auth.ts`
- Produces:
  - `AuthProvider` component (wraps children)
  - `useAuth()` hook returning `{ user: any; role: string | null; token: string | null; isAuthenticated: boolean; isLoading: boolean; logout: () => void }`

- [ ] **Step 1: Create `lib/AuthContext.tsx`**

```tsx
// lib/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired, clearAuthCookie } from "@/lib/auth";

interface AuthState {
  user: Record<string, unknown> | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

/** How often (ms) to poll for token expiry while the tab is open. */
const EXPIRY_CHECK_INTERVAL = 60_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    // Clear all auth storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("supplierToken");
    clearAuthCookie();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  // ── Bootstrap: read localStorage once on mount ─────────────────────
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const supplierToken = localStorage.getItem("supplierToken");
      const tkn = storedToken || supplierToken || null;

      if (storedUser && tkn) {
        // Check expiry immediately
        if (isTokenExpired(tkn)) {
          logout();
          return;
        }
        const parsed = JSON.parse(storedUser);
        // Also check the token inside the user object
        const userToken = parsed?.token || tkn;
        if (isTokenExpired(userToken)) {
          logout();
          return;
        }
        setUser(parsed);
        setToken(userToken);
      }
    } catch {
      // Corrupted storage — clear everything
      logout();
      return;
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Periodic expiry check ──────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const id = setInterval(() => {
      if (isTokenExpired(token)) {
        logout();
      }
    }, EXPIRY_CHECK_INTERVAL);

    return () => clearInterval(id);
  }, [token, logout]);

  const role = (user as Record<string, unknown>)?.role as string | null ?? null;

  const value: AuthState = {
    user,
    role,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access the auth context. Must be used inside `<AuthProvider>`.
 */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit lib/AuthContext.tsx 2>&1 | head -20`

Expected: no errors (or only unrelated existing errors)

- [ ] **Step 3: Commit**

```bash
git add lib/AuthContext.tsx
git commit -m "feat(auth): add AuthProvider context with expiry polling and useAuth hook

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Providers Wrapper + Root Layout Integration

**Files:**
- Create: `app/Providers.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `AuthProvider` from `lib/AuthContext.tsx`
- Produces: `Providers` component that wraps children (used by root layout)

- [ ] **Step 1: Create `app/Providers.tsx`**

```tsx
// app/Providers.tsx
"use client";

import { AuthProvider } from "@/lib/AuthContext";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

- [ ] **Step 2: Modify `app/layout.tsx` to wrap children in Providers**

The current file (`app/layout.tsx`):

```tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockFlow",
  description: "StockFlow — Procurement & supply chain management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
```

Change it to:

```tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Providers from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockFlow",
  description: "StockFlow — Procurement & supply chain management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
```

The only change: import `Providers` and wrap `{children}` inside `<Providers>`. The `<Toaster>` stays outside since it doesn't need auth context.

- [ ] **Step 3: Verify it compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit app/Providers.tsx app/layout.tsx 2>&1 | head -20`

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/Providers.tsx app/layout.tsx
git commit -m "feat(auth): add Providers wrapper and integrate AuthProvider into root layout

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Login Page — Set Cookie + Redirect Support

**Files:**
- Modify: `app/login/page.tsx`

**Interfaces:**
- Consumes: `setAuthCookie(token: string, role: string): void` from `lib/auth.ts`
- Produces: Sets `stockflow-auth` cookie on successful login; respects `?redirect` query param

- [ ] **Step 1: Add imports at the top of `app/login/page.tsx`**

Add `useSearchParams` to the existing `next/navigation` import (line 3), and add a new import for `setAuthCookie`:

Current line 3:
```tsx
import { useRouter } from "next/navigation"
```

Change to:
```tsx
import { useRouter, useSearchParams } from "next/navigation"
```

Add new import after line 6 (after the lucide import):
```tsx
import { setAuthCookie } from "@/lib/auth"
```

- [ ] **Step 2: Read search params inside the component**

After line 9 (`const router = useRouter()`), add:

```tsx
  const searchParams = useSearchParams()
```

- [ ] **Step 3: Set cookie after localStorage writes and use redirect param**

Current login success handler (lines 43-54):
```tsx
      // Handle successful login: store token and user details
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect based on role
      if (data.user?.role === "Supplier") {
        router.push("/supplier-dashboard")
      } else if (data.user?.role === "Admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
```

Change to:
```tsx
      // Handle successful login: store token and user details
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Set auth cookie so middleware can enforce route protection
      setAuthCookie(data.token, data.user.role)

      // Redirect to original page if ?redirect param exists, else role-based default
      const redirectTo = searchParams.get("redirect")
      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo)
      } else if (data.user?.role === "Supplier") {
        router.push("/supplier-dashboard")
      } else if (data.user?.role === "Admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
```

- [ ] **Step 4: Wrap the page export in a Suspense boundary**

`useSearchParams()` requires a `<Suspense>` boundary in Next.js App Router. Rename the existing component and create a wrapper:

At the very end of the file, rename the component from `LoginPage` to `LoginPageContent`, then add:

```tsx
import { Suspense } from "react"

// ... (existing component renamed to LoginPageContent)

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
```

Concretely: change `export default function LoginPage()` on line 8 to `function LoginPageContent()`, add the `Suspense` import at the top, and add the wrapper export at the bottom.

- [ ] **Step 5: Verify it compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit app/login/page.tsx 2>&1 | head -20`

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat(auth): set auth cookie on login and support ?redirect query param

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Update API Client — Expiry Check in `getToken()`

**Files:**
- Modify: `lib/api.ts`

**Interfaces:**
- Consumes: `isTokenExpired(token: string): boolean` and `clearAuthCookie(): void` from `lib/auth.ts`
- Produces: `getToken()` now returns `""` for expired tokens and clears storage

- [ ] **Step 1: Add import at the top of `lib/api.ts`**

After line 2, add:
```typescript
import { isTokenExpired, clearAuthCookie } from "@/lib/auth";
```

- [ ] **Step 2: Modify `getToken()` to check expiry**

Current `getToken()` (lines 4-15):
```typescript
function getToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const user = JSON.parse(window.localStorage.getItem("user") || "{}");
    if (user.token) return user.token;
  } catch (e) {}
  return (
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("supplierToken") ||
    ""
  );
}
```

Change to:
```typescript
function getToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const user = JSON.parse(window.localStorage.getItem("user") || "{}");
    if (user.token) {
      if (isTokenExpired(user.token)) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("supplierToken");
        clearAuthCookie();
        return "";
      }
      return user.token;
    }
  } catch (e) {}
  const token =
    window.localStorage.getItem("token") ||
    window.localStorage.getItem("supplierToken") ||
    "";
  if (token && isTokenExpired(token)) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("supplierToken");
    clearAuthCookie();
    return "";
  }
  return token;
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit lib/api.ts 2>&1 | head -20`

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add lib/api.ts
git commit -m "feat(auth): add JWT expiry check to getToken — auto-clear stale tokens

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Admin Layout + Sidebar Logout Cookie Clearance

**Files:**
- Create: `app/(admin)/layout.tsx`
- Modify: `components/admin/Sidebar.tsx`
- Modify: `components/customer/Sidebar.tsx`
- Modify: `components/supplier/Sidebar.tsx`

**Interfaces:**
- Consumes: `AdminSidebar` from `components/admin/Sidebar.tsx`, `clearAuthCookie` from `lib/auth.ts`
- Produces: Admin layout wrapping all admin pages with sidebar

- [ ] **Step 1: Create `app/(admin)/layout.tsx`**

Model it after the existing supplier and customer layouts:

```tsx
// app/(admin)/layout.tsx
"use client"

import { ReactNode, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/Sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Load Neo Brutalism fonts (same as supplier/customer layouts)
  useEffect(() => {
    const id = "nb-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap"
    document.head.appendChild(link)
  }, [])

  return (
    <div className="flex h-screen bg-nb-bg overflow-hidden font-body selection:bg-nb-yellow">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update admin sidebar logout to also clear the auth cookie**

In `components/admin/Sidebar.tsx`, the current `handleLogout` (lines 22-26):
```tsx
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };
```

Change to:
```tsx
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("supplierToken");
        clearAuthCookie();
        router.push("/login");
    };
```

Add import at the top of the file:
```tsx
import { clearAuthCookie } from "@/lib/auth";
```

- [ ] **Step 3: Update customer sidebar logout to also clear the auth cookie**

In `components/customer/Sidebar.tsx`, the current `handleLogout` (lines 24-28):
```tsx
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }
```

Change to:
```tsx
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("supplierToken")
    clearAuthCookie()
    router.push("/login")
  }
```

Add import at the top:
```tsx
import { clearAuthCookie } from "@/lib/auth"
```

- [ ] **Step 4: Update supplier sidebar logout to also clear the auth cookie**

In `components/supplier/Sidebar.tsx`, the current `handleLogout` (lines 26-30):
```tsx
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("supplierToken")
    localStorage.removeItem("user")
    router.push("/login")
  }
```

Change to:
```tsx
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("supplierToken")
    localStorage.removeItem("user")
    clearAuthCookie()
    router.push("/login")
  }
```

Add import at the top:
```tsx
import { clearAuthCookie } from "@/lib/auth"
```

- [ ] **Step 5: Verify all modified files compile**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npx tsc --noEmit 2>&1 | head -30`

Expected: no new errors

- [ ] **Step 6: Commit**

```bash
git add "app/(admin)/layout.tsx" components/admin/Sidebar.tsx components/customer/Sidebar.tsx components/supplier/Sidebar.tsx
git commit -m "feat(auth): add admin layout, clear auth cookie on logout in all sidebars

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Smoke Test — End-to-End Verification

**Files:** None (manual testing task)

- [ ] **Step 1: Start the dev server**

Run: `cd /home/kavishka/Dev/CSE2002-CCS2002-Group_Project/client && npm run dev`

Expected: Server starts without errors on `http://localhost:3000`

- [ ] **Step 2: Verify unauthenticated redirect**

Open a browser with no cookies/localStorage (incognito). Navigate to `http://localhost:3000/admin-dashboard`.

Expected: Redirected to `/login?redirect=%2Fadmin-dashboard`

- [ ] **Step 3: Verify login sets cookie**

Log in with valid credentials. After redirect:

Check browser DevTools → Application → Cookies: `stockflow-auth` cookie should exist with JSON value containing `token` and `role`.

- [ ] **Step 4: Verify wrong-role redirect**

While logged in as Customer, navigate to `http://localhost:3000/admin-dashboard`.

Expected: Redirected to `/dashboard` (customer's home)

While logged in as Customer, navigate to `http://localhost:3000/supplier-dashboard`.

Expected: Redirected to `/dashboard` (customer's home)

- [ ] **Step 5: Verify logout clears cookie**

Click the Logout button in the sidebar.

Expected: Redirected to `/login`. Cookie `stockflow-auth` should be deleted. localStorage `token` and `user` should be cleared.

- [ ] **Step 6: Verify already-logged-in redirect from /login**

While logged in, navigate to `http://localhost:3000/login`.

Expected: Redirected to your role's dashboard.

- [ ] **Step 7: Verify redirect param after login**

Clear all auth state. Navigate to `http://localhost:3000/supplier-dashboard`.

Expected: Redirected to `/login?redirect=%2Fsupplier-dashboard`.

Log in as a Supplier.

Expected: Redirected to `/supplier-dashboard` (not the default dashboard).
