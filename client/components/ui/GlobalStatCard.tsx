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
    <div className={`flex flex-col border-[3px] border-black shadow-[6px_6px_0px_0px_#000] nb-interactive overflow-hidden w-full ${themeClasses.cardBackground}`}>
      {/* Top Row: Spot 1 (Icon) & Spot 2 (Title) */}
      <div className="flex items-center gap-3 p-4 border-b-[2px] border-black">
        {/* Spot 1: Icon Receptacle */}
        <div className={`flex shrink-0 items-center justify-center w-12 h-12 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] ${themeClasses.iconContainerBackground}`}>
          {typeof iconSvgOrEmoji === 'string' ? (
            <span className="text-2xl leading-none">{iconSvgOrEmoji}</span>
          ) : (
            iconSvgOrEmoji
          )}
        </div>
        {/* Spot 2: Title Text */}
        <div className={`flex-1 font-display font-black text-sm uppercase tracking-tight leading-tight ${themeClasses.titleTextColor}`}>
          {introTitle}
        </div>
      </div>

      {/* Middle Row: Spot 3 (Order Count) & Spot 4 (Monetary Spotlight) */}
      <div className="flex items-stretch h-24">
        {/* Spot 3: Order Count */}
        <div className={`flex shrink-0 w-16 items-center justify-center border-r-[2px] border-black ${themeClasses.orderCountContainer}`}>
          <span className={`font-display font-black text-3xl ${themeClasses.orderCountText}`}>
            {orderCount}
          </span>
        </div>
        {/* Spot 4: Monetary Spotlight (Primary Focal Point) */}
        <div className={`flex flex-1 items-center justify-center p-4 ${themeClasses.monetaryContainer}`}>
          <span className={`font-display font-black text-4xl tracking-tight ${themeClasses.monetaryText}`}>
            {monetaryValue}
          </span>
        </div>
      </div>

      {/* Bottom Row: Spot 5 (Footer Text) */}
      <div className={`flex items-center justify-center w-full py-2 px-4 border-t-[2px] border-black ${themeClasses.footerContainer}`}>
        <span className={`font-body font-bold text-sm text-center ${themeClasses.footerText}`}>
          {footerText}
        </span>
      </div>
    </div>
  );
};

export default GlobalStatCard;
