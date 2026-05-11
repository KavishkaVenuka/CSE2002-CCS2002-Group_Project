"use client"

import { ReactNode } from "react"
import { Sidebar } from "@/components/customer/Sidebar"

interface CustomerLayoutProps {
  children: ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-nb-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  )
}
