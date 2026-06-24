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
  }, [logout]);

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
