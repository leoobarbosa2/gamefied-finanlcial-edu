import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '../../utils/cn'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import { lessonsApi } from '../../api/lessons'

function SessionsDots({ used, limit }: { used: number; limit: number }) {
  const full = used >= limit
  return (
    <div className="group relative hidden sm:flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: limit }).map((_, i) => (
          <span
            key={i}
            className={`block h-2 w-2 rounded-full transition-colors ${
              i < used
                ? full
                  ? 'bg-amber-400'
                  : 'bg-accent-500'
                : 'bg-[var(--border-strong)]'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${full ? 'text-amber-500' : 'text-[var(--content-muted)]'}`}>
        {used}/{limit}
      </span>
      {/* Tooltip */}
      <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-xs text-[var(--content-secondary)] shadow-lg opacity-0 transition-opacity group-hover:opacity-100 z-50">
        {full
          ? `Você completou as ${limit} lições de hoje. Novas sessões disponíveis à meia-noite.`
          : `Sessões de hoje: ${used} de ${limit} lições concluídas.`}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-t border-l border-[var(--border)] bg-[var(--surface-raised)]" />
      </div>
    </div>
  )
}

const navLinks = [
  { to: '/dashboard', label: 'Início' },
  { to: '/paths', label: 'Trilhas' },
]

export default function TopBar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const isAdmin = user?.role === 'ADMIN'

  const { data: dailyLimit } = useQuery({
    queryKey: ['daily-limit'],
    queryFn: () => lessonsApi.getDailyLimit(),
    staleTime: 60_000,
    enabled: !!user,
  })

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        {/* Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-base font-semibold tracking-tight text-[var(--content-primary)]"
          >
            Finlearn
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--surface-overlay)] text-[var(--content-primary)]'
                      : 'text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-raised)]'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--surface-overlay)] text-[var(--content-primary)]'
                      : 'text-[var(--content-muted)] hover:text-[var(--content-primary)] hover:bg-[var(--surface-raised)]'
                  )
                }
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {dailyLimit && (
            <SessionsDots used={dailyLimit.used} limit={dailyLimit.limit} />
          )}
          <ThemeToggle />

          {/* Avatar menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menu do perfil"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-sm font-semibold dark:bg-accent-900/40 dark:text-accent-300 transition-colors hover:bg-accent-200 dark:hover:bg-accent-800/40"
            >
              {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <p className="text-sm font-medium text-[var(--content-primary)] truncate">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-[var(--content-muted)] truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--content-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--content-primary)]"
                    >
                      <User className="h-4 w-4" />
                      Perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--content-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--content-primary)]"
                      >
                        <Shield className="h-4 w-4" />
                        Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--content-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--content-primary)]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
