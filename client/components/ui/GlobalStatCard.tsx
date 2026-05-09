import React from 'react';

export interface GlobalStatCardProps {
  // Zone Content
  iconSvgOrEmoji: React.ReactNode | string; // Spot 1
  introTitle: string;                       // Spot 2
  orderCount: number;                       // Spot 3
  monetaryValue: string | number;           // Spot 4
  footerText: string;                       // Spot 5
  
  // Theming & Colors (Adapting to the 3 Dashboards)
  themeClasses: {
    cardBackground: string;
    iconContainerBackground: string;
    titleTextColor: string;
    orderCountContainer: string;
    orderCountText: string;
    monetaryContainer: string;      // Must stand out
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
    <div className={`p-6 rounded-3xl flex flex-col gap-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 w-full ${themeClasses.cardBackground}`}>
      {/* Top Row: Spot 1 (Icon) & Spot 2 (Title) */}
      <div className="flex items-center gap-4">
        {/* Spot 1: Icon Receptacle */}
        <div className={`flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl ${themeClasses.iconContainerBackground}`}>
          {typeof iconSvgOrEmoji === 'string' ? (
            <span className="text-2xl leading-none">{iconSvgOrEmoji}</span>
          ) : (
            iconSvgOrEmoji
          )}
        </div>
        {/* Spot 2: Title Text */}
        <div className={`flex-1 text-base md:text-lg font-semibold tracking-tight ${themeClasses.titleTextColor}`}>
          {introTitle}
        </div>
      </div>

      {/* Middle Row: Spot 3 (Order Count) & Spot 4 (Monetary Spotlight) */}
      <div className="flex items-stretch gap-4 h-24">
        {/* Spot 3: Order Count */}
        <div className={`flex shrink-0 w-14 items-center justify-center rounded-2xl ${themeClasses.orderCountContainer}`}>
          <span className={`text-xl md:text-2xl font-bold ${themeClasses.orderCountText}`}>
            {orderCount}
          </span>
        </div>
        {/* Spot 4: Monetary Spotlight (Primary Focal Point) */}
        <div className={`flex flex-1 items-center justify-center rounded-2xl p-4 ${themeClasses.monetaryContainer}`}>
          <span className={`text-3xl md:text-4xl font-extrabold tracking-tighter ${themeClasses.monetaryText}`}>
            {monetaryValue}
          </span>
        </div>
      </div>

      {/* Bottom Row: Spot 5 (Footer Text) */}
      <div className={`flex items-center justify-center w-full py-1 px-4 rounded-2xl ${themeClasses.footerContainer}`}>
        <span className={`text-sm md:text-base font-medium text-center ${themeClasses.footerText}`}>
          {footerText}
        </span>
      </div>
    </div>
  );
};

export default GlobalStatCard;
