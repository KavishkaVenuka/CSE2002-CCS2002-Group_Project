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
    <aside className={`h-full w-[298px] flex flex-col p-4 rounded-r-[32px] shadow-2xl ${themeClasses.sidebarBackground}`}>
      {/* Spot 1: Platform Header */}
      <div className={`flex items-center px-4 py-4 gap-4 rounded-full mb-8 ${themeClasses.platformContainer}`}>
        <div className="shrink-0 flex items-center justify-center">
          {platformIcon}
        </div>
        <span className={`font-bold text-lg tracking-wide truncate ${themeClasses.platformText}`}>
          {platformName}
        </span>
      </div>

      {/* Spot 2: Navigation Links */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
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
              className={`flex items-center px-6 py-4 gap-5 rounded-full transition-all duration-300 ease-in-out ${containerClass}`}
            >
              <div className="shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span className={`font-medium text-base truncate ${textClass}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Spot 3: Settings / Footer Bar */}
      <div className="mt-auto pt-8">
        <Link 
          href={settingsHref}
          className={`flex items-center px-4 py-4 gap-4 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-1 ${themeClasses.settingsContainer}`}
        >
          <div className="shrink-0 flex items-center justify-center">
            {settingsIcon}
          </div>
          <span className={`font-bold text-base truncate ${themeClasses.settingsText}`}>
            {settingsLabel}
          </span>
        </Link>
      </div>
    </aside>
  );
}
