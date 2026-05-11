"use client"

const ACT_COLORS: Record<string, { bg: string; label: string }> = {
  green: { bg: "#4ADE80", label: "Success" },
  blue:  { bg: "#22D3EE", label: "Info" },
  amber: { bg: "#FACC15", label: "Warning" },
  red:   { bg: "#EF4444", label: "Danger" },
}

interface ActivityItemProps {
  item: {
    text: string
    time: string
    type: string
  }
  isLast: boolean
}

export function ActivityItem({ item, isLast }: ActivityItemProps) {
  const dot = ACT_COLORS[item.type] ?? { bg: "#000000", label: "" }

  return (
    <div
      className={`
        flex gap-3 items-start
        p-5
        ${!isLast ? "border-r-[2px] border-black" : ""}
        hover:bg-nb-yellow transition-colors duration-100
      `}
    >
      {/* Accent dot — stays round via allow-rounded */}
      <div
        className="w-2 h-2 flex-shrink-0 mt-1.5 allow-rounded"
        style={{ background: dot.bg }}
      />

      <div className="min-w-0">
        <p className="font-body text-sm text-black leading-snug font-medium">
          {item.text}
        </p>
        <p className="font-mono text-xs text-gray-500 mt-1">
          {item.time}
        </p>
      </div>
    </div>
  )
}
