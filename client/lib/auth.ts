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
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
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
