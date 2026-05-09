"use client"

import { usePathname } from "next/navigation"
import { GlobalSidebar } from "@/components/ui/GlobalSidebar"
import {
  LayoutDashboard, Send, FileText, ShoppingBag,
  Truck, Receipt, CreditCard, CheckSquare, Boxes,
  Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Send,             label: "Send Requirements", href: "/send-requirements" },
  { icon: FileText,         label: "Quotations", href: "/quotations" },
  { icon: ShoppingBag,      label: "My Orders", href: "/my-orders" },
  { icon: Truck,            label: "Delivery Tracking", href: "/delivery-tracking" },
  { icon: Receipt,          label: "Invoices", href: "/invoices" },
  { icon: CreditCard,       label: "Payments", href: "/payments" },
  { icon: CheckSquare,      label: "Order Confirmation", href: "/order-confirmation" },
]

export function Sidebar() {
  const pathname = usePathname()

  const platformIcon = (
    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
      <Boxes size={22} color="#fff" strokeWidth={1.75} />
    </div>
  )

  const navItems = NAV_ITEMS.map((item) => ({
    id: item.label,
    label: item.label,
    href: item.href,
    icon: <item.icon size={20} strokeWidth={1.75} />,
  }))

  return (
    <GlobalSidebar
      platformName="StockFlow"
      platformIcon={platformIcon}
      navItems={navItems}
      settingsLabel="Settings"
      settingsIcon={<Settings size={20} strokeWidth={1.75} />}
      settingsHref="/dashboard/settings"
      currentPath={pathname || "/dashboard"}
      themeClasses={{
        sidebarBackground: "bg-[#defa08]",
        platformContainer: "bg-white",
        platformText: "text-black",
        navItemContainerDefault: "bg-[#d1dd6c] text-black/70 hover:brightness-95 transition-all",
        navItemContainerActive: "bg-[#d1dd6c] text-black shadow-sm",
        navItemTextDefault: "text-black/70",
        navItemTextActive: "text-black font-semibold",
        settingsContainer: "bg-[#56600c] text-white hover:brightness-110 transition-all",
        settingsText: "text-white font-normal"
      }}
    />
  )
}
