import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Flame, Trophy, BookOpen, Clock, Target, TrendingUp } from 'lucide-react'
import { userApi } from '../api/user'
import { authApi } from '../api/auth'
import { progressApi } from '../api/progress'
import { useAuthStore } from '../store/authStore'
import PageShell from '../components/layout/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'

function formatStudyTime(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  if (m < 60) return `${m}min`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`
}

export default function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, updateUser, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getMe,
    staleTime: 30_000,
  })

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: progressApi.getMetrics,
    staleTime: 60_000,
  })

  const updateMutation = useMutation({
    mutationFn: (data: { displayName: string }) => userApi.update(data),
    onSuccess: (updated) => {
      updateUser({ displayName: updated.displayName })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setEditing(false)
    },
  })

  const handleLogout = async () => {
    try { await authApi.logout() } finally {
      logout()
      navigate('/login')
    }
  }

  const streak = profile?.streak

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-[var(--content-primary)]">Perfil</h1>

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-2xl font-semibold dark:bg-accent-900/40 dark:text-accent-300">
            {(profile?.displayName ?? user?.displayName ?? 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-base font-semibold"
                />
                <Button
                  size="sm"
                  onClick={() => updateMutation.mutate({ displayName })}
                  loading={updateMutation.isPending}
                >
                  Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-left group"
              >
                <p className="text-lg font-semibold text-[var(--content-primary)] group-hover:text-accent-500 transition-colors">
                  {profile?.displayName ?? user?.displayName}
                </p>
                <p className="text-sm text-[var(--content-muted)]">{profile?.email ?? user?.email}</p>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Estatísticas
          </h2>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* Row 1 */}
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <Flame className="h-5 w-5 text-accent-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {streak?.currentStreak ?? 0}
                </p>
                <p className="text-xs text-[var(--content-muted)]">sequência</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {streak?.longestStreak ?? 0}
                </p>
                <p className="text-xs text-[var(--content-muted)]">recorde</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <BookOpen className="h-5 w-5 text-indigo-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {metrics?.totalCompleted ?? '—'}
                </p>
                <p className="text-xs text-[var(--content-muted)]">concluídas</p>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <Clock className="h-5 w-5 text-purple-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {metrics ? formatStudyTime(metrics.totalTimeSpentSecs) : '—'}
                </p>
                <p className="text-xs text-[var(--content-muted)]">estudo</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <Target className="h-5 w-5 text-teal-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {metrics?.averageScore != null ? `${metrics.averageScore}%` : '—'}
                </p>
                <p className="text-xs text-[var(--content-muted)]">score médio</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <TrendingUp className="h-5 w-5 text-emerald-500 mb-1" />
                <p className="text-xl font-bold text-[var(--content-primary)]">
                  {metrics?.weeklyCompleted ?? '—'}
                </p>
                <p className="text-xs text-[var(--content-muted)]">esta semana</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            Sair da conta
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
