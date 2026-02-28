import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, User, Shield, Zap } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import ThemeToggle from './ThemeToggle'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import { lessonsApi } from '../../api/lessons'
import CoinsBadge from '../ui/CoinsBadge'
import ProBadge from '../ui/ProBadge'

function xpForLevel(n: number) { return n * n * 50 }

function SessionsDots({ used, limit }: { used: number; limit: number | null }) {
  if (limit === null) return null  // PRO: unlimited, no dots needed
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
  const queryClient = useQueryClient()
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
      queryClient.clear()
      navigate('/login')
    }
  }

  // XP strip calculation
  const xp = user?.xp ?? 0
  const level = user?.level ?? 1
  const xpStart = xpForLevel(level - 1)
  const xpEnd = xpForLevel(level)
  const xpPercent = Math.min(100, Math.round(((xp - xpStart) / (xpEnd - xpStart)) * 100))

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
          {user && <CoinsBadge coins={user.coins ?? 0} />}
          {user && (
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-accent-500/30 bg-accent-500/10 px-2.5 py-1">
              <Zap className="h-3 w-3 text-accent-500 fill-accent-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-500">Nível</span>
              <span className="text-sm font-bold leading-none text-accent-600 dark:text-accent-400">
                {user.level ?? 1}
              </span>
            </div>
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
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--content-primary)] truncate">
                        {user?.displayName}
                      </p>
                      {user?.plan === 'PRO' && <ProBadge />}
                    </div>
                    <p className="text-xs text-[var(--content-muted)] truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5 text-accent-500 fill-accent-500" />
                      <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">
                        Nível {user?.level ?? 1}
                      </span>
                    </div>
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

      {/* XP progress strip at bottom of header */}
      {user && (
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--border)]">
          <motion.div
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      )}
    </header>
  )
}
