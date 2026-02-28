import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard'
import PageShell from '../components/layout/PageShell'
import ContinueCard from '../components/dashboard/ContinueCard'
import PathCard from '../components/dashboard/PathCard'
import WeeklyActivity from '../components/dashboard/WeeklyActivity'
import Skeleton from '../components/ui/Skeleton'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 30_000,
  })

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 17 ? 'Boa tarde' : 'Boa noite'

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--content-primary)]">
            {greeting}, {user?.displayName?.split(' ')[0] ?? ''}
          </h1>
          <p className="mt-1 text-sm text-[var(--content-muted)]">
            Pronto para a próxima lição?
          </p>
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
