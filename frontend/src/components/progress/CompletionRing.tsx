interface CompletionRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}

export default function CompletionRing({
  percentage,
  size = 48,
  strokeWidth = 3,
  color,
}: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        className="stroke-[var(--surface-overlay)]"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color ? 'transition-all duration-500' : 'stroke-accent-500 transition-all duration-500'}
        style={color ? { stroke: color } : undefined}
        fill="none"
      />
    </svg>
  )
}
