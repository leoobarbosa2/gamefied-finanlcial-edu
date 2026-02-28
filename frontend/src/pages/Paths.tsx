import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { pathsApi } from '../api/paths'
import { useAuthStore } from '../store/authStore'
import PageShell from '../components/layout/PageShell'
import PathCard from '../components/dashboard/PathCard'
import Skeleton from '../components/ui/Skeleton'
import UpgradeDialog from '../components/ui/UpgradeDialog'

export default function Paths() {
  const { user } = useAuthStore()
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

  const { data: paths, isLoading } = useQuery({
    queryKey: ['paths'],
    queryFn: pathsApi.getAll,
    staleTime: 60_000,
  })

  const isFreePlan = user?.plan === 'FREE'

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--content-primary)]">Trilhas de Aprendizado</h1>
          <p className="mt-1 text-sm text-[var(--content-muted)]">
            Programas estruturados para desenvolver habilidades financeiras passo a passo
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paths?.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                isPremiumLocked={isFreePlan && path.isPremium}
                onPremiumLocked={() => setUpgradeDialogOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
      />
    </PageShell>
  )
}
