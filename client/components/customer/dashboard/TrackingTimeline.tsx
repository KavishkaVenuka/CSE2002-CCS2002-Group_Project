import React from 'react';
import { TimelineContainer, TimelineItem } from '@/components/ui/timeline';

const STATUS_COLOR_MAP: Record<string, string> = {
  DELIVERED: 'bg-indigo-500',
  'OUT_FOR_DELIVERY': 'bg-indigo-500',
  SHIPPED: 'bg-indigo-500',
  PENDING: 'bg-gray-700',
  PROCESSING: 'bg-gray-700'
};

interface TrackingEvent {
  id: string;
  status: string; // DELIVERED, SHIPPED, etc.
  title: string;
  description?: string;
  date: string;
  time: string;
}

interface TrackingTimelineProps {
  data?: TrackingEvent[];
}

export default function TrackingTimeline({ data = [] }: TrackingTimelineProps) {
  // Fallback/Mock data if none provided, to match the image for demonstration if empty
  const timelineData = data.length > 0 ? data : [
    {
      id: '1',
      status: 'DELIVERED',
      title: 'Order #12345',
      description: 'Delivered',
      date: 'Oct 26',
      time: '10:00 AM'
    },
    {
      id: '2',
      status: 'OUT_FOR_DELIVERY',
      title: 'Order #12345',
      description: 'Out for Delivery',
      date: 'Oct 25',
      time: '2:00 PM'
    },
    {
      id: '3',
      status: 'SHIPPED',
      title: 'Order #12345',
      description: 'Shipped',
      date: 'Oct 24',
      time: '9:00 AM'
    }
  ];

  return (
    <div className="bg-[#0f1218] p-6 rounded-3xl shadow-2xl border border-gray-800 w-full">
      <h2 className="text-xl font-bold mb-6 text-white">Delivery Tracking Timeline</h2>

      <TimelineContainer>
        {timelineData.map((item, index) => {
          const isLast = index === timelineData.length - 1;
          const nodeColor = STATUS_COLOR_MAP[item.status] || 'bg-gray-700';

          return (
            <TimelineItem
              key={item.id}
              isLast={isLast}
              date={
                <div className="flex flex-col items-end">
                  <span className="font-bold text-gray-200 whitespace-nowrap">{item.date}</span>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{item.time}</span>
                </div>
              }
              node={
                <div className={`h-4 w-4 rounded-full ${nodeColor} ring-4 ring-[#0f1218]`} />
              }
            >
              <div className="flex flex-col">
                <span className="font-bold text-gray-100 text-lg">{item.title}</span>
                <span className="text-base text-gray-400 font-medium">{item.description}</span>
                {/* Visual filler for "10% Other (15%)" from image if needed, but leaving generic for now */}
              </div>
            </TimelineItem>
          );
        })}
      </TimelineContainer>
    </div>
  );
}