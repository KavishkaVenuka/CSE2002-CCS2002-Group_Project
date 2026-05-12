"use client"

import { ReactNode, useEffect } from "react"
import { Sidebar } from "@/components/customer/Sidebar"

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
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
