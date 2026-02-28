export default function ProBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-amber-100 font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      ✦ PRO
    </span>
  )
}
