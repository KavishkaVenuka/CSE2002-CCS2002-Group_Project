"use client"

import { usePathname } from "next/navigation"
import { GlobalSidebar } from "@/components/common/GlobalSidebar"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  FileEdit,
  FileCheck,
  Truck,
  Receipt,
  CreditCard,
  Settings,
  Boxes,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/supplier-dashboard" },
  { icon: ClipboardList,   label: "Requirements",     href: "/customer-requirements" },
  { icon: FileEdit,        label: "Create Quotation", href: "/create-quotations" },
  { icon: FileCheck,       label: "Quotation Status", href: "/quotation-status" },
  { icon: Package,         label: "Orders",           href: "/orders" },
  { icon: Truck,           label: "Deliver & Dispatch",href: "/deliver&dispatch" },
  { icon: Receipt,         label: "Invoice Submission",href: "/invoice-submission" },
  { icon: CreditCard,      label: "Payment Status",   href: "/payment-status" },
]

export function Sidebar() {
  const pathname = usePathname()

  const platformIcon = (
    <div className="w-10 h-10 bg-black border-[2px] border-black shadow-[2px_2px_0px_0px_#22D3EE] flex items-center justify-center">
      <Boxes size={20} color="#22D3EE" strokeWidth={2} />
    </div>
  )

  const navItems = NAV_ITEMS.map((item) => ({
    id: item.label,
    label: item.label,
    href: item.href,
    icon: <item.icon size={18} strokeWidth={2} />,
  }))

  return (
    <GlobalSidebar
      platformName="StockFlow"
      platformIcon={platformIcon}
      navItems={navItems}
      settingsLabel="Settings"
      settingsIcon={<Settings size={18} strokeWidth={2} />}
      settingsHref="/settings"
      currentPath={pathname || "/supplier-dashboard"}
      themeClasses={{
        sidebarBackground:       "bg-nb-cyan",
        platformContainer:       "bg-nb-cyan",
        platformText:            "text-black",
        navItemContainerDefault: "group border-transparent text-black hover:bg-black hover:text-white hover:border-black hover:shadow-[2px_2px_0px_0px_#000]",
        navItemContainerActive:  "bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]",
        navItemTextDefault:      "text-black group-hover:text-white",
        navItemTextActive:       "text-white font-bold",
        settingsContainer:       "bg-black text-white",
        settingsText:            "text-white",
      }}
    />
  )
}