"use client"

import { usePathname } from "next/navigation"
import { GlobalSidebar } from "@/components/common/GlobalSidebar"
import {
  LayoutDashboard, Send, FileText, ShoppingBag,
  Truck, Receipt, CreditCard, CheckSquare, Boxes,
  Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/dashboard" },
  { icon: Send,            label: "Send Requirements", href: "/send-requirements" },
  { icon: FileText,        label: "Quotations",        href: "/quotations" },
  { icon: ShoppingBag,     label: "My Orders",         href: "/my-orders" },
  { icon: Truck,           label: "Delivery Tracking", href: "/delivery-tracking" },
  { icon: Receipt,         label: "Invoices",          href: "/invoices" },
  { icon: CreditCard,      label: "Payments",          href: "/payments" },
  { icon: CheckSquare,     label: "Order Confirmation",href: "/order-confirmation" },
]

export function Sidebar() {
  const pathname = usePathname()

  const platformIcon = (
    <div className="w-10 h-10 bg-black border-[2px] border-black shadow-[2px_2px_0px_0px_#4ADE80] flex items-center justify-center">
      <Boxes size={20} color="#4ADE80" strokeWidth={2} />
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
      settingsHref="/dashboard/settings"
      currentPath={pathname || "/dashboard"}
      themeClasses={{
        sidebarBackground:       "bg-nb-green",
        platformContainer:       "bg-nb-green",
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
