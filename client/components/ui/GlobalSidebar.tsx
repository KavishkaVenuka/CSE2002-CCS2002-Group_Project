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
  platformIcon: ReactNode;      // Spot 1
  navItems: NavItem[];          // Spot 2
  settingsLabel: string;
  settingsIcon: ReactNode;      // Spot 3
  settingsHref: string;
  currentPath: string;          // To determine active link state
  
  // Theming & Colors (Adapting to the 3 Dashboards)
  themeClasses: {
    sidebarBackground: string;
    
    // Spot 1 Theme
    platformContainer: string;
    platformText: string;
    
    // Spot 2 Theme
    navItemContainerDefault: string;
    navItemContainerActive: string;
    navItemTextDefault: string;
    navItemTextActive: string;
    
    // Spot 3 Theme
    settingsContainer: string; // Must stand out
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
    <aside className={`h-full w-[264px] flex flex-col p-4 border-r-[3px] border-black ${themeClasses.sidebarBackground}`}>
      {/* Spot 1: Platform Header */}
      <div className={`flex items-center px-4 py-3 gap-4 mb-6 border-[2px] border-black ${themeClasses.platformContainer}`}>
        <div className="shrink-0 flex items-center justify-center">
          {platformIcon}
        </div>
        <span className={`font-display font-black text-base tracking-tight truncate ${themeClasses.platformText}`}>
          {platformName}
        </span>
      </div>

      {/* Spot 2: Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check for active state: exact match, or if it's a root path, handle appropriately
          const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(`${item.href}/`));
          
          const containerClass = isActive 
            ? themeClasses.navItemContainerActive 
            : themeClasses.navItemContainerDefault;
          const textClass = isActive 
            ? themeClasses.navItemTextActive 
            : themeClasses.navItemTextDefault;

          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={`flex items-center px-4 py-3 gap-4 transition-all duration-100 ${containerClass}`}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span className={`font-body font-semibold text-sm truncate ${textClass}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Spot 3: Settings / Footer Bar */}
      <div className="mt-auto pt-4 border-t-[2px] border-black">
        <Link 
          href={settingsHref}
          className={`flex items-center px-4 py-3 gap-4 border-[2px] border-black transition-all duration-100 nb-interactive ${themeClasses.settingsContainer}`}
        >
          <div className="shrink-0 flex items-center justify-center">
            {settingsIcon}
          </div>
          <span className={`font-body font-bold text-sm truncate ${themeClasses.settingsText}`}>
            {settingsLabel}
          </span>
        </Link>
      </div>
    </aside>
  );
}
