import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { adminApi, type AdminLesson, type AdminPath } from '../../api/admin'
import PageShell from '../../components/layout/PageShell'
import Skeleton from '../../components/ui/Skeleton'

function LessonFormModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial?: Partial<AdminLesson>
  onSave: (data: Partial<AdminLesson>) => void
  onClose: () => void
  saving: boolean
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [estimatedMins, setEstimatedMins] = useState(initial?.estimatedMins ?? 5)
  const [orderIndex, setOrderIndex] = useState(initial?.orderIndex ?? 1)
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold text-[var(--content-primary)]">
          {initial?.title ? 'Editar lição' : 'Nova lição'}
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs text-[var(--content-muted)]">Título</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--content-muted)]">Descrição</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--content-muted)]">Tempo est. (min)</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={estimatedMins}
                onChange={(e) => setEstimatedMins(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--content-muted)]">Ordem</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--content-secondary)]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-accent-500"
            />
            Publicada
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onSave({ title, description, estimatedMins, orderIndex, isPublished })}
            disabled={saving || !title}
            className="flex-1 rounded-xl bg-accent-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--content-secondary)] hover:bg-[var(--surface-overlay)]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPathDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [creatingLesson, setCreatingLesson] = useState(false)
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null)

  // Get path info from admin paths cache
  const { data: paths } = useQuery({
    queryKey: ['admin-paths'],
    queryFn: adminApi.getPaths,
    staleTime: 30_000,
  })
  const path: AdminPath | undefined = paths?.find((p) => p.id === id)

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['admin-lessons', id],
    queryFn: () => adminApi.getLessons(id!),
    enabled: !!id,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<AdminLesson>) => adminApi.createLesson(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', id] }); setCreatingLesson(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: Partial<AdminLesson> }) =>
      adminApi.updateLesson(lessonId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', id] }); setEditingLesson(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lessons', id] }),
  })

  const togglePublish = (lesson: AdminLesson) =>
    updateMutation.mutate({ lessonId: lesson.id, data: { isPublished: !lesson.isPublished } })

  const handleDelete = (lessonId: string) => {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate(lessonId)
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--content-muted)]">
          <Link to="/admin" className="hover:text-[var(--content-primary)] transition-colors">Admin</Link>
          <span>/</span>
          <Link to="/admin/paths" className="hover:text-[var(--content-primary)] transition-colors">Trilhas</Link>
          <span>/</span>
          <span className="text-[var(--content-primary)] font-medium">{path?.title ?? 'Trilha'}</span>
        </div>

        {/* Path summary */}
        {path && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <p className="text-sm font-semibold text-[var(--content-primary)]">{path.title}</p>
            <p className="mt-0.5 text-xs text-[var(--content-muted)]">{path.description}</p>
            <div className="mt-2 flex gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                path.isPublished
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-[var(--surface-overlay)] text-[var(--content-muted)]'
              }`}>
                {path.isPublished ? 'Publicada' : 'Rascunho'}
              </span>
              {path.isPremium && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  PRO
                </span>
              )}
            </div>
          </div>
        )}

        {/* Lessons */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">Lições</h2>
            <button
              onClick={() => setCreatingLesson(true)}
              className="flex items-center gap-1 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Nova lição
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                >
                  <span className="text-xs text-[var(--content-muted)] w-4 shrink-0">#{lesson.orderIndex}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--content-primary)]">{lesson.title}</p>
                    <p className="text-xs text-[var(--content-muted)]">
                      {lesson._count.steps} passos · {lesson.estimatedMins}min
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      lesson.isPublished
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-[var(--surface-overlay)] text-[var(--content-muted)]'
                    }`}>
                      {lesson.isPublished ? 'Pub.' : 'Draft'}
                    </span>
                    <button
                      onClick={() => togglePublish(lesson)}
                      className="rounded-lg p-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
                      title={lesson.isPublished ? 'Despublicar' : 'Publicar'}
                    >
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button
                      onClick={() => setEditingLesson(lesson)}
                      className="rounded-lg p-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
                      title="Editar metadados"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to={`/admin/paths/${id}/lessons/${lesson.id}`}
                      className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      title="Editar conteúdo"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {!lessons?.length && (
                <p className="py-8 text-center text-sm text-[var(--content-muted)]">
                  Nenhuma lição ainda. Clique em "Nova lição" para começar.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {creatingLesson && (
        <LessonFormModal
          onSave={(data) => createMutation.mutate(data)}
          onClose={() => setCreatingLesson(false)}
          saving={createMutation.isPending}
        />
      )}

      {editingLesson && (
        <LessonFormModal
          initial={editingLesson}
          onSave={(data) => updateMutation.mutate({ lessonId: editingLesson.id, data })}
          onClose={() => setEditingLesson(null)}
          saving={updateMutation.isPending}
        />
      )}
    </PageShell>
  )
}
