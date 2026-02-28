import { Coins } from 'lucide-react'

interface CoinsBadgeProps {
  coins: number
  size?: 'sm' | 'md'
}

export default function CoinsBadge({ coins, size = 'sm' }: CoinsBadgeProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1">
      <Coins className={size === 'sm' ? 'h-3.5 w-3.5 text-amber-500' : 'h-4 w-4 text-amber-500'} />
      <span
        className={`font-semibold text-amber-600 dark:text-amber-400 ${
          size === 'sm' ? 'text-xs' : 'text-sm'
        }`}
      >
        {coins}
      </span>
    </div>
  )
}
