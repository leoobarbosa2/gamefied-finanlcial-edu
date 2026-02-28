import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as LucideIcons from 'lucide-react'
import { type LucideProps, ArrowLeft } from 'lucide-react'
import { pathsApi } from '../api/paths'
import { lessonsApi } from '../api/lessons'
import { useAuthStore } from '../store/authStore'
import PageShell from '../components/layout/PageShell'
import LessonCard from '../components/dashboard/LessonCard'
import ProgressBar from '../components/progress/ProgressBar'
import Skeleton from '../components/ui/Skeleton'
import DailyLimitDialog from '../components/lesson/DailyLimitDialog'

type IconName = keyof typeof LucideIcons

const colorConfig: Record<string, { bg: string; icon: string; progress: string }> = {
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/20',    icon: 'text-teal-600 dark:text-teal-400',    progress: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', progress: 'bg-indigo-500' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: 'text-amber-600 dark:text-amber-400',   progress: 'bg-amber-500' },
  rose:   { bg: 'bg-rose-50 dark:bg-rose-900/20',     icon: 'text-rose-600 dark:text-rose-400',     progress: 'bg-rose-500' },
}

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const pascalName = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as IconName
  const Icon = LucideIcons[pascalName] as React.ComponentType<LucideProps> | undefined
  if (!Icon) return <LucideIcons.BookOpen {...props} />
  return <Icon {...props} />
}

export default function PathDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuthStore()
  const [limitDialogOpen, setLimitDialogOpen] = useState(false)

  const { data: path, isLoading } = useQuery({
    queryKey: ['path', slug],
    queryFn: () => pathsApi.getOne(slug!),
    enabled: !!slug,
    staleTime: 30_000,
  })

  const { data: dailyLimit } = useQuery({
    queryKey: ['daily-limit'],
    queryFn: () => lessonsApi.getDailyLimit(),
    staleTime: 60_000,
  })

  const totalLessons = path?.lessons.length ?? 0
  const completedLessons = path?.lessons.filter((l) => l.status === 'COMPLETED').length ?? 0
  const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-32" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        </div>
      </PageShell>
    )
  }

  if (!path) {
    return (
      <PageShell>
        <div className="py-16 text-center text-[var(--content-muted)]">Trilha não encontrada.</div>
      </PageShell>
    )
  }

  const colors = colorConfig[path.colorToken] ?? colorConfig.teal
  const isLimitReached = dailyLimit ? !dailyLimit.canLearn : false

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Back link */}
        <Link
          to="/paths"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas as trilhas
        </Link>

        {/* Path header */}
        <div className="flex gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.bg}`}>
            <DynamicIcon name={path.iconName} className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-[var(--content-primary)]">{path.title}</h1>
            <p className="mt-1 text-sm text-[var(--content-muted)]">{path.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={completionPct} className="flex-1" size="sm" color={colors.progress} />
              <span className="shrink-0 text-xs font-medium text-[var(--content-muted)]">
                {completedLessons}/{totalLessons}
              </span>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Lições
          </h2>
          <div className="flex flex-col gap-2">
            {path.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                pathSlug={path.slug}
                dailyLocked={isLimitReached}
                onDailyLocked={() => setLimitDialogOpen(true)}
              />
            ))}
          </div>
        </div>
      </div>

      <DailyLimitDialog
        open={limitDialogOpen}
        onClose={() => setLimitDialogOpen(false)}
        resetAt={dailyLimit?.resetAt}
        currentStreak={user?.streak?.currentStreak ?? 0}
      />
    </PageShell>
  )
}
