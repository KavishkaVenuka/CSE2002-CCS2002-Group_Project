"use client"

import { ReactNode } from 'react';
import Link from 'next/link';

// Structure for individual navigation items
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
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
  return (
    <aside
      className={`
        h-full w-[260px] flex flex-col flex-shrink-0
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
          const isActive =
            currentPath === item.href ||
            (item.href !== '/' && currentPath.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3
                font-body font-semibold text-sm
                border-[2px]
                transition-all duration-100
                ${isActive
                  ? `${themeClasses.navItemContainerActive} translate-x-[2px] translate-y-[2px]`
                  : `${themeClasses.navItemContainerDefault} hover:translate-x-[2px] hover:translate-y-[2px]`
                }
              `}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span
                className={`truncate ${isActive ? themeClasses.navItemTextActive : themeClasses.navItemTextDefault}`}
              >
                {item.label}
              </span>
            </Link>
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
