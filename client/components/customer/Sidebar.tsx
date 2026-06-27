"use client"

import { usePathname, useRouter } from "next/navigation"
import { GlobalSidebar } from "@/components/common/GlobalSidebar"
import { clearAuthCookie } from "@/lib/auth"
import {
  LayoutDashboard, Send, FileText, ShoppingBag,
  Truck, Receipt, CreditCard, Boxes,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/dashboard" },
  { icon: Send,            label: "Send Requirements", href: "/send-requirements" },
  { icon: FileText,        label: "Quotations",        href: "/quotations" },
  { icon: ShoppingBag,     label: "My Orders",         href: "/my-orders" },
  { icon: Truck,           label: "Delivery Tracking", href: "/delivery-tracking" },
  { icon: Receipt,         label: "Invoices",          href: "/invoices" },
  { icon: CreditCard,      label: "Payments",          href: "/payments" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("supplierToken")
    clearAuthCookie()
    router.push("/login")
  }

  const platformIcon = (
    <div className="w-10 h-10 bg-black flex items-center justify-center border-[2px] border-black shadow-[2px_2px_0px_0px_#fff]">
      <Boxes size={22} color="#defa08" strokeWidth={2.5} />
    </div>
  )

  const navItems = NAV_ITEMS.map((item) => ({
    id: item.label,
    label: item.label,
    href: item.href,
    icon: <item.icon size={18} strokeWidth={2.5} />,
  }))

  return (
    <GlobalSidebar
      platformName="StockFlow"
      platformIcon={platformIcon}
      navItems={navItems}
      currentPath={pathname || "/dashboard"}
      onLogout={handleLogout}
      logoutLabel="Logout"
      themeClasses={{
        sidebarBackground: "bg-[#defa08]",
        platformContainer: "bg-black",
        platformText: "text-[#defa08]",
        navItemContainerDefault: "text-black hover:bg-black/10 border-[2px] border-transparent transition-all duration-100",
        navItemContainerActive: "bg-black text-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]",
        navItemTextDefault: "text-black font-bold",
        navItemTextActive: "text-white font-black",
        logoutContainer: "bg-white hover:bg-red-50 text-nb-red transition-colors",
        logoutText: "text-inherit font-black",
      }}
    />
  )
}

