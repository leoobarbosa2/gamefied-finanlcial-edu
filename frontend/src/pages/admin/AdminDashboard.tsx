import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, CheckCircle2, TrendingUp, ChevronRight, Shield } from 'lucide-react'
import { adminApi } from '../../api/admin'
import PageShell from '../../components/layout/PageShell'
import Skeleton from '../../components/ui/Skeleton'

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getMetrics,
    staleTime: 60_000,
  })

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900/30">
            <Shield className="h-5 w-5 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--content-primary)]">Painel Admin</h1>
            <p className="text-xs text-[var(--content-muted)]">Visão geral da plataforma</p>
          </div>
        </div>

        {/* Metric cards */}
        {isLoading ? (
          <Skeleton className="h-32" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <Users className="h-5 w-5 text-indigo-500" />
              <p className="text-2xl font-bold text-[var(--content-primary)]">{metrics?.totalUsers ?? 0}</p>
              <p className="text-xs text-[var(--content-muted)]">Usuários</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <BookOpen className="h-5 w-5 text-teal-500" />
              <p className="text-2xl font-bold text-[var(--content-primary)]">{metrics?.totalPaths ?? 0}</p>
              <p className="text-xs text-[var(--content-muted)]">Trilhas</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <p className="text-2xl font-bold text-[var(--content-primary)]">{metrics?.totalCompleted ?? 0}</p>
              <p className="text-xs text-[var(--content-muted)]">Lições concluídas</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <p className="text-2xl font-bold text-[var(--content-primary)]">{metrics?.weeklyCompletions ?? 0}</p>
              <p className="text-xs text-[var(--content-muted)]">Esta semana</p>
            </div>
          </div>
        )}

        {/* Popular paths */}
        {metrics && metrics.popularPaths.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
              Trilhas mais populares
            </h2>
            <div className="flex flex-col gap-2">
              {metrics.popularPaths.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                >
                  <span className="text-sm font-bold text-[var(--content-muted)]">#{i + 1}</span>
                  <p className="flex-1 text-sm font-medium text-[var(--content-primary)] truncate">{p.title}</p>
                  <span className="text-sm text-[var(--content-muted)]">{p.completions} conclusões</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Gerenciar
          </h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/admin/paths"
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition-colors hover:bg-[var(--surface-overlay)]"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-medium text-[var(--content-primary)]">Trilhas e Lições</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--content-muted)]" />
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition-colors hover:bg-[var(--surface-overlay)]"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-[var(--content-primary)]">Usuários</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--content-muted)]" />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
