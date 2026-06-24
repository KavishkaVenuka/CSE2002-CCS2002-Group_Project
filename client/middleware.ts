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
