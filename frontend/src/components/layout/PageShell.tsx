import { type ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 pt-20 pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
