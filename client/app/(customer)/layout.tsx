"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/customer/Sidebar"
import { isTokenExpired } from "@/lib/auth"

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const router = useRouter()

  // ── Client-side auth guard ────────────────────────────────────────────
  // Even if browser shows a cached page via the back button, this effect
  // runs immediately and redirects unauthenticated / expired users to login.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")

      if (!storedUser || !storedToken) {
        router.replace("/login")
        return
      }

      // Check raw token expiry
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("supplierToken")
        router.replace("/login")
        return
      }

      // Also validate token embedded in user object
      const parsed = JSON.parse(storedUser)
      const userToken = parsed?.token || storedToken
      if (isTokenExpired(userToken)) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("supplierToken")
        router.replace("/login")
        return
      }

      // Guard correct role
      if (parsed?.role && parsed.role !== "Customer") {
        router.replace("/login")
      }
    } catch {
      // Corrupted storage — force logout
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("supplierToken")
      router.replace("/login")
    }
  }, [router])

  // Load Neo Brutalism fonts
  useEffect(() => {
    const id = "nb-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id   = id
    link.rel  = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
    document.head.appendChild(link)
  }, [])

  return (
    <div className="flex h-screen bg-nb-bg overflow-hidden font-body selection:bg-nb-yellow">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
