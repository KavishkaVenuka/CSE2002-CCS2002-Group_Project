// app/Providers.tsx
"use client";

import { AuthProvider } from "@/lib/AuthContext";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
