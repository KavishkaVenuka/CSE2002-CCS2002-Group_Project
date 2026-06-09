"use client"

interface ActivityItemProps {
  item: {
    text: string
    time: string
    type: string
  }
  isLast: boolean
}

const DOT_COLORS: Record<string, string> = {
  green:   "bg-nb-green  border-black",
  blue:    "bg-nb-cyan   border-black",
  amber:   "bg-nb-yellow border-black",
  red:     "bg-nb-red    border-black",
  primary: "bg-nb-green  border-black",
}

export function ActivityItem({ item, isLast }: ActivityItemProps) {
  const dotColor = DOT_COLORS[item.type] ?? "bg-gray-400 border-black"

  return (
    <div className={`p-5 flex gap-3 items-start ${isLast ? "" : "border-r-[2px] border-black"}`}>
      {/* NB dot indicator — square, not circle */}
      <div className={`w-3 h-3 border-[2px] shrink-0 mt-1 ${dotColor}`} />
      <div>
        <p className="font-body font-bold text-sm text-black leading-snug">
          {item.text}
        </p>
        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-1">
          {item.time}
        </p>
      </div>
    </div>
  )
}
