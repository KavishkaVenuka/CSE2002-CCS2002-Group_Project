"use client";

import { usePathname, useRouter } from "next/navigation";
import { GlobalSidebar, NavItem } from "@/components/common/GlobalSidebar";
import { clearAuthCookie } from "@/lib/auth";
import {
    LayoutDashboard,
    Package,
    Wallet,
    CreditCard,
    Users,
    Truck,
    Settings,
    ShieldCheck,
    FileText,
    Send
} from "lucide-react";

export function AdminSidebar() {
    const currentPath = usePathname() || "";
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        clearAuthCookie();
        router.replace("/login");
    };

    const navItems: NavItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: "/admin-dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: "stock",
            label: "Stock Management",
            href: "/stock-management",
            icon: <Package size={20} />,
        },
        {
            id: "finance",
            label: "Finance & Funds",
            href: "/finance&funds",
            icon: <Wallet size={20} />,
        },
        {
            id: "payments",
            label: "Payments",
            href: "/admin-payments",
            icon: <CreditCard size={20} />,
        },
        {
            id: "customers",
            label: "Customers",
            href: "/customers",
            icon: <Users size={20} />,
            subItems: [
                { id: "cust-req", label: "Requirements", href: "/customers/requirements", icon: <FileText size={16} /> },
                { id: "cust-quo", label: "Quotations", href: "/customers/quotations", icon: <Send size={16} /> },
                { id: "cust-create-quo", label: "Create Quotation", href: "/customers/create-quotation", icon: <Send size={16} /> },
                { id: "cust-orders", label: "Orders", href: "/customers/orders", icon: <Package size={16} /> },
                { id: "cust-delivery", label: "Delivery Tracking", href: "/customers/delivery-tracking", icon: <Truck size={16} /> },
                { id: "cust-inv", label: "Invoices", href: "/customers/invoices", icon: <FileText size={16} /> },
                { id: "cust-pay", label: "Payments", href: "/customers/payments", icon: <CreditCard size={16} /> },
            ]
        },
        {
            id: "suppliers",
            label: "Suppliers",
            href: "/suppliers",
            icon: <Truck size={20} />,
            subItems: [
                { id: "sup-req", label: "Customer Requirement Requests", href: "/suppliers/customer-requirements-requests", icon: <FileText size={16} /> },
                { id: "sup-quo", label: "Supplier Quotations", href: "/suppliers/supplier-quotations", icon: <Send size={16} /> },
                { id: "sup-orders", label: "Purchase Orders", href: "/suppliers/purchase-orders", icon: <Package size={16} /> },
                { id: "sup-delivery", label: "Delivery Tracking", href: "/suppliers/delivery-tracking", icon: <Truck size={16} /> },
                { id: "sup-inv", label: "Invoices", href: "/suppliers/invoices", icon: <FileText size={16} /> },
                { id: "sup-pay", label: "Payments", href: "/suppliers/payments", icon: <CreditCard size={16} /> },
            ]
        },
    ];

    const themeClasses = {
        // Sidebar background (Base)
        sidebarBackground: "bg-[#F5F0E8]",

        // Platform Header Section
        platformContainer: "bg-black",
        platformText: "text-white",

        // Navigation Items
        navItemContainerDefault: "bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none",
        navItemContainerActive: "bg-[#A5E6DC] border-black shadow-none", // Teal for active
        navItemTextDefault: "text-black",
        navItemTextActive: "text-black font-black",

        // Settings Footer
        settingsContainer: "bg-[#FACC15] hover:bg-black hover:text-[#FACC15] transition-colors", // Yellow to black
        settingsText: "text-inherit font-black",

        // Logout
        logoutContainer: "bg-white hover:bg-red-50 text-nb-red transition-colors",
        logoutText: "text-inherit font-black",
    };

    return (
        <GlobalSidebar
            platformName="Admin Portal"
            platformIcon={<ShieldCheck size={28} className="text-white" />}
            navItems={navItems}
            settingsLabel="Settings"
            settingsIcon={<Settings size={20} />}
            settingsHref="/settings"
            currentPath={currentPath}
            themeClasses={themeClasses}
            onLogout={handleLogout}
            logoutLabel="Logout"
        />
    );
}