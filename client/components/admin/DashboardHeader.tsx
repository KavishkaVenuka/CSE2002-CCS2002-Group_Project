"use client";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-20 bg-white border-b-[3px] border-black flex items-center justify-between px-8 sticky top-0 z-40 flex-shrink-0">
      {/* Page title */}
      <h1 className="font-display font-black text-2xl text-black uppercase tracking-tight">
        {title}
      </h1>

      {/* Right side area (empty for now based on requirements, but ready for future actions) */}
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
}