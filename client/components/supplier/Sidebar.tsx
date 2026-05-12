"use client"

import { usePathname } from "next/navigation"
import { GlobalSidebar } from "@/components/ui/GlobalSidebar"
import {
  LayoutDashboard, FileText, ShoppingBag,
  Truck, Receipt, ClipboardList, PlusCircle,
  Settings, Boxes
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",            href: "/supplier-dashboard" },
  { icon: FileText,        label: "Customer Requirements",href: "/customer-requirements" },
  { icon: PlusCircle,      label: "Create Quotation",     href: "/create-quotation" },
  { icon: ClipboardList,   label: "Quotation Status",     href: "/quotation-status" },
  { icon: ShoppingBag,     label: "Orders",               href: "/orders" },
  { icon: Truck,           label: "Delivery & Dispatch",  href: "/delivery&dispatch" },
  { icon: Receipt,         label: "Invoice Submission",   href: "/invoice-submission" },
  { icon: Receipt,         label: "Payment Status",       href: "/payment" },
]

export function Sidebar() {
  const pathname = usePathname()

  const platformIcon = (
    <div className="w-10 h-10 bg-black flex items-center justify-center border-[2px] border-white shadow-[2px_2px_0px_0px_#fff]">
      <Boxes size={22} className="text-[#A5E6DC]" strokeWidth={2.5} />
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
      platformName="Supplier Hub"
      platformIcon={platformIcon}
      navItems={navItems}
      settingsLabel="Settings"
      settingsIcon={<Settings size={18} strokeWidth={2.5} />}
      settingsHref="/supplier-dashboard/settings"
      currentPath={pathname || "/supplier-dashboard"}
      themeClasses={{
        sidebarBackground:        "bg-[#A5E6DC]",
        platformContainer:        "bg-black",
        platformText:             "text-[#A5E6DC]",
        navItemContainerDefault:  "text-black hover:bg-black/5 border-[2px] border-transparent transition-all duration-100",
        navItemContainerActive:   "bg-black text-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] translate-x-[2px] translate-y-[2px]",
        navItemTextDefault:       "text-black font-bold",
        navItemTextActive:        "text-white font-black",
        settingsContainer:        "bg-black text-[#A5E6DC] hover:bg-nb-black hover:text-white shadow-[3px_3px_0px_0px_#000]",
        settingsText:             "text-[#A5E6DC] font-black",
      }}
    />
  )
}
