"use client"

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Structure for individual navigation items
export interface SubNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: ReactNode;
  subItems?: SubNavItem[];
}

export interface GlobalSidebarProps {
  // Content
  platformName: string;
  platformIcon: ReactNode;
  navItems: NavItem[];
  settingsLabel: string;
  settingsIcon: ReactNode;
  settingsHref: string;
  currentPath: string;

  // Theming
  themeClasses: {
    sidebarBackground: string;       // e.g. 'bg-nb-green'

    platformContainer: string;       // header section bg
    platformText: string;            // logo text color

    navItemContainerDefault: string; // default nav bg + border
    navItemContainerActive: string;  // active nav bg + border + shadow
    navItemTextDefault: string;
    navItemTextActive: string;

    settingsContainer: string;
    settingsText: string;
  };
}

export function GlobalSidebar({
  platformName,
  platformIcon,
  navItems,
  settingsLabel,
  settingsIcon,
  settingsHref,
  currentPath,
  themeClasses,
}: GlobalSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('sidebarExpandedItems');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpandedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse sidebar state from localStorage', e);
      }
    }
  }, []);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems((prev) => {
      const next = {
        ...prev,
        [id]: !prev[id],
      };
      localStorage.setItem('sidebarExpandedItems', JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside
      className={`
        sticky top-0 h-screen w-[260px] flex flex-col flex-shrink-0
        border-r-[3px] border-black
        ${themeClasses.sidebarBackground}
      `}
    >
      {/* ── Platform Header ─────────────────────────────────────────── */}
      <div
        className={`
          flex items-center gap-3 px-5 py-5
          border-b-[3px] border-black
          ${themeClasses.platformContainer}
        `}
      >
        <div className="shrink-0 flex items-center justify-center">
          {platformIcon}
        </div>
        <span
          className={`font-display font-black text-xl tracking-tight truncate ${themeClasses.platformText}`}
        >
          {platformName}
        </span>
      </div>

      {/* ── Navigation Links ────────────────────────────────────────── */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href ? (
            currentPath === item.href ||
            (item.href !== '/' && currentPath.startsWith(`${item.href}/`))
          ) : false;

          const hasSubItems = item.subItems && item.subItems.length > 0;

          const hasActiveSubItem = item.subItems?.some(subItem =>
            currentPath === subItem.href || currentPath.startsWith(`${subItem.href}/`)
          );

          const isExpanded = expandedItems[item.id] !== undefined
            ? expandedItems[item.id]
            : hasActiveSubItem;

          return (
            <div key={item.id} className="flex flex-col gap-1">
              {item.href && !hasSubItems ? (
                <Link
                  href={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3
                    font-body font-semibold text-sm
                    border-[2px]
                    transition-all duration-100
                    ${isActive
                      ? `${themeClasses.navItemContainerActive} translate-x-[2px] translate-y-[2px]`
                      : `${themeClasses.navItemContainerDefault} hover:translate-x-[2px] hover:translate-y-[2px]`
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span
                      className={`truncate ${isActive ? themeClasses.navItemTextActive : themeClasses.navItemTextDefault}`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={(e) => toggleExpand(item.id, e)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3
                    font-body font-semibold text-sm
                    border-[2px]
                    transition-all duration-100 cursor-pointer
                    ${isActive || isExpanded
                      ? `${themeClasses.navItemContainerActive} translate-x-[2px] translate-y-[2px]`
                      : `${themeClasses.navItemContainerDefault} hover:translate-x-[2px] hover:translate-y-[2px]`
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span
                      className={`truncate ${isActive || isExpanded ? themeClasses.navItemTextActive : themeClasses.navItemTextDefault}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {hasSubItems && (
                    <div className="shrink-0">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  )}
                </button>
              )}

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="flex flex-col gap-1 ml-4 mt-1 border-l-2 border-black pl-2">
                  {item.subItems!.map((subItem) => {
                    const isSubActive = currentPath === subItem.href || currentPath.startsWith(`${subItem.href}/`);
                    return (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className={`
                          flex items-center gap-3 px-3 py-2
                          font-body font-semibold text-sm
                          border-[2px]
                          transition-all duration-100
                          ${isSubActive
                            ? `${themeClasses.navItemContainerActive} translate-x-[2px] translate-y-[2px]`
                            : `${themeClasses.navItemContainerDefault} hover:translate-x-[2px] hover:translate-y-[2px]`
                          }
                        `}
                      >
                        {subItem.icon && (
                          <div className="shrink-0 flex items-center justify-center">
                            {subItem.icon}
                          </div>
                        )}
                        <span
                          className={`truncate ${isSubActive ? themeClasses.navItemTextActive : themeClasses.navItemTextDefault}`}
                        >
                          {subItem.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Settings Footer ─────────────────────────────────────────── */}
      <div className="p-3 border-t-[3px] border-black">
        <Link
          href={settingsHref}
          className={`
            w-full flex items-center gap-3 px-4 py-3
            font-body font-bold text-sm
            border-[2px] border-black
            nb-interactive
            ${themeClasses.settingsContainer}
          `}
        >
          <div className="shrink-0 flex items-center justify-center">
            {settingsIcon}
          </div>
          <span className={`truncate ${themeClasses.settingsText}`}>
            {settingsLabel}
          </span>
        </Link>
      </div>
    </aside>
  );
}
