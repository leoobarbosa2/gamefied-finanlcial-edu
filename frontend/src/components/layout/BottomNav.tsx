import { NavLink } from 'react-router-dom'
import { Home, BookOpen, User } from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Início' },
  { to: '/paths', icon: BookOpen, label: 'Trilhas' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-6 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-accent-500'
                  : 'text-[var(--content-muted)] hover:text-[var(--content-secondary)]'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="hidden xs:block">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
