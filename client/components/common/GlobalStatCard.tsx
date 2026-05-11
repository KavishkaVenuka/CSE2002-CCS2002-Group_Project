import React from 'react';

export interface GlobalStatCardProps {
  // Zone Content
  iconSvgOrEmoji: React.ReactNode | string; // Spot 1
  introTitle: string;                       // Spot 2
  orderCount: number;                       // Spot 3
  monetaryValue: string | number;           // Spot 4
  footerText: string;                       // Spot 5

  // Theming
  themeClasses: {
    cardBackground: string;
    iconContainerBackground: string;
    titleTextColor: string;
    orderCountContainer: string;
    orderCountText: string;
    monetaryContainer: string;
    monetaryText: string;
    footerContainer: string;
    footerText: string;
  };
}

export const GlobalStatCard: React.FC<GlobalStatCardProps> = ({
  iconSvgOrEmoji,
  introTitle,
  orderCount,
  monetaryValue,
  footerText,
  themeClasses,
}) => {
  return (
    <div
      className={`
        flex flex-col overflow-hidden
        border-[3px] border-black
        shadow-[8px_8px_0px_0px_#000000]
        nb-interactive
        ${themeClasses.cardBackground}
      `}
    >
      {/* ── Zone 1+2: Icon & Title row ──────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b-[2px] border-black">
        {/* Spot 1: Icon */}
        <div
          className={`
            flex shrink-0 items-center justify-center
            w-10 h-10
            border-[2px] border-black
            shadow-[2px_2px_0px_0px_#000000]
            ${themeClasses.iconContainerBackground}
          `}
        >
          {typeof iconSvgOrEmoji === 'string' ? (
            <span className="text-xl leading-none">{iconSvgOrEmoji}</span>
          ) : (
            iconSvgOrEmoji
          )}
        </div>

        {/* Spot 2: Title */}
        <span
          className={`font-display font-black text-base tracking-tight ${themeClasses.titleTextColor}`}
        >
          {introTitle}
        </span>
      </div>

      {/* ── Zone 3+4: Count & Monetary row ─────────────────────────── */}
      <div className="flex items-stretch h-28">
        {/* Spot 3: Order Count */}
        <div
          className={`
            flex shrink-0 w-16 items-center justify-center
            border-r-[2px] border-black
            ${themeClasses.orderCountContainer}
          `}
        >
          <span
            className={`font-display font-black text-3xl ${themeClasses.orderCountText}`}
          >
            {orderCount}
          </span>
        </div>

        {/* Spot 4: Monetary Spotlight */}
        <div
          className={`
            flex flex-1 items-center justify-center px-4
            ${themeClasses.monetaryContainer}
          `}
        >
          <span
            className={`font-display font-black text-4xl tracking-tighter ${themeClasses.monetaryText}`}
          >
            {monetaryValue}
          </span>
        </div>
      </div>

      {/* ── Zone 5: Footer ──────────────────────────────────────────── */}
      <div
        className={`
          flex items-center px-4 py-2
          border-t-[2px] border-black
          ${themeClasses.footerContainer}
        `}
      >
        <span
          className={`font-body text-sm font-semibold ${themeClasses.footerText}`}
        >
          {footerText}
        </span>
      </div>
    </div>
  );
};

export default GlobalStatCard;
