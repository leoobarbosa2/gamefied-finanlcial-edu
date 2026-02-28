import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Crown } from 'lucide-react'
import { adminApi, type AdminUser } from '../../api/admin'
import PageShell from '../../components/layout/PageShell'
import Skeleton from '../../components/ui/Skeleton'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminUsers() {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
    staleTime: 30_000,
  })

  const planMutation = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: 'FREE' | 'PRO' }) => adminApi.updateUserPlan(id, plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const togglePlan = (user: AdminUser) => {
    const next = user.plan === 'FREE' ? 'PRO' : 'FREE'
    planMutation.mutate({ id: user.id, plan: next })
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex items-center gap-1 text-sm text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin
          </Link>
          <span className="text-[var(--content-muted)]">/</span>
          <h1 className="text-base font-semibold text-[var(--content-primary)]">Usuários</h1>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-sm font-semibold dark:bg-accent-900/30 dark:text-accent-300">
                  {user.displayName[0]?.toUpperCase() ?? 'U'}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-[var(--content-primary)]">{user.displayName}</p>
                    {user.role === 'ADMIN' && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-[var(--content-muted)]">{user.email}</p>
                  <p className="text-xs text-[var(--content-muted)]">{formatDate(user.createdAt)}</p>
                </div>

                {/* Plan toggle */}
                <button
                  onClick={() => togglePlan(user)}
                  disabled={planMutation.isPending}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                    user.plan === 'PRO'
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                      : 'bg-[var(--surface-overlay)] text-[var(--content-muted)] hover:bg-[var(--border)]'
                  }`}
                >
                  {user.plan === 'PRO' && <Crown className="h-3 w-3" />}
                  {user.plan}
                </button>
              </div>
            ))}
            {!users?.length && (
              <p className="py-8 text-center text-sm text-[var(--content-muted)]">Nenhum usuário encontrado.</p>
            )}
          </div>
        )}
      </div>
    </PageShell>
  )
}
