interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md'
}

export default function LevelBadge({ level, size = 'sm' }: LevelBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-accent-500 font-bold text-white leading-none ${
        size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-7 w-7 text-xs'
      }`}
    >
      {level}
    </div>
  )
}
