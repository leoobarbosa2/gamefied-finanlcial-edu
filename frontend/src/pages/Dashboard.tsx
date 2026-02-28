import { useQuery } from '@tanstack/react-query'
import { Flame } from 'lucide-react'
import { dashboardApi } from '../api/dashboard'
import { lessonsApi } from '../api/lessons'
import PageShell from '../components/layout/PageShell'
import ContinueCard from '../components/dashboard/ContinueCard'
import PathCard from '../components/dashboard/PathCard'
import WeeklyActivity from '../components/dashboard/WeeklyActivity'
import Skeleton from '../components/ui/Skeleton'
import XPBar from '../components/ui/XPBar'
import CoinsBadge from '../components/ui/CoinsBadge'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 30_000,
  })

  const { data: dailyLimit } = useQuery({
    queryKey: ['daily-limit'],
    queryFn: lessonsApi.getDailyLimit,
    staleTime: 60_000,
    enabled: !!user,
  })

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 17 ? 'Boa tarde' : 'Boa noite'

  const xp = user?.xp ?? data?.gamification?.xp ?? 0
  const level = user?.level ?? data?.gamification?.level ?? 1
  const coins = user?.coins ?? data?.gamification?.coins ?? 0
  const streak = data?.streak?.currentStreak ?? 0

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Hero card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 flex flex-col gap-4">
          {/* Greeting row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold text-[var(--content-primary)]">
                {greeting}, {user?.displayName?.split(' ')[0] ?? ''}!
              </h1>
              <p className="mt-0.5 text-sm text-[var(--content-muted)]">
                Pronto para a próxima lição?
              </p>
            </div>
            <CoinsBadge coins={coins} size="md" />
          </div>

          {/* Streak + sessions row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-[var(--content-primary)]">{streak}</span>
              <span className="text-xs text-[var(--content-muted)]">dias</span>
            </div>
            {dailyLimit && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: dailyLimit.limit }).map((_, i) => (
                    <span
                      key={i}
                      className={`block h-2 w-2 rounded-full ${
                        i < dailyLimit.used
                          ? dailyLimit.used >= dailyLimit.limit
                            ? 'bg-amber-400'
                            : 'bg-accent-500'
                          : 'bg-[var(--border-strong)]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[var(--content-muted)]">
                  {dailyLimit.used}/{dailyLimit.limit} sessões
                </span>
              </div>
            )}
          </div>

          {/* XP Bar */}
          {isLoading ? (
            <Skeleton className="h-8" />
          ) : (
            <XPBar xp={xp} level={level} />
          )}
        </div>

        {/* Weekly streak */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Esta semana
          </h2>
          {isLoading ? (
            <Skeleton className="h-14" />
          ) : data ? (
            <WeeklyActivity
              weekActivity={data.streak.weekActivity}
              currentStreak={data.streak.currentStreak}
            />
          ) : null}
        </section>

        {/* Continue learning */}
        {(isLoading || data?.continueLesson) && (
          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
              Continue de onde parou
            </h2>
            {isLoading ? (
              <Skeleton className="h-24" />
            ) : data?.continueLesson ? (
              <ContinueCard lesson={data.continueLesson} />
            ) : null}
          </section>
        )}

        {/* Learning paths */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Suas trilhas
          </h2>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data?.recommendedPaths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
