"use client"

import { ReactNode, useEffect } from "react"
import { T, font } from "@/lib/tokens"
import { Sidebar } from "@/components/customer/Sidebar"

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  // Load distinctive fonts
  useEffect(() => {
    const id = "stockflow-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id   = id
    link.rel  = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
    document.head.appendChild(link)
  }, [])

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: T.surface,
      fontFamily: font,
      color: T.t1,
      overflow: "hidden",
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
