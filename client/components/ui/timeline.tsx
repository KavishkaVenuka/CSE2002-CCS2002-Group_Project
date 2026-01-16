import React from 'react';

interface TimelineContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function TimelineContainer({ children, className = '' }: TimelineContainerProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            {children}
        </div>
    );
}

interface TimelineItemProps {
    date?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    node?: React.ReactNode;
    isLast?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function TimelineItem({
    date,
    title,
    description,
    node,
    isLast = false,
    className = '',
    children
}: TimelineItemProps) {
    return (
        <div className={`flex group ${className}`}>
            {/* Left Side (Date/Time) */}
            <div className="w-24 flex-shrink-0 text-right pr-4 pt-1">
                {date}
            </div>

            {/* Center (Line and Node) */}
            <div className="relative flex flex-col items-center">
                {/* Node (Dot/Icon) */}
                <div className="z-10 bg-white dark:bg-[#0f1218] rounded-full flex items-center justify-center">
                    {node || <div className="h-4 w-4 rounded-full bg-blue-500" />}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                    <div className="w-0.5 bg-gray-200 dark:bg-neutral-700 flex-grow my-1 absolute top-4 bottom-0" />
                )}
            </div>

            {/* Right Side (Content) */}
            <div className="flex-grow pl-4 pb-8 pt-0.5">
                {title && <div className="font-semibold text-gray-900 dark:text-gray-100">{title}</div>}
                {description && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</div>}
                {children}
            </div>
        </div>
    );
}
