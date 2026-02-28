import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, ChevronRight, Pencil, Trash2, Lock } from 'lucide-react'
import { adminApi, type AdminPath } from '../../api/admin'
import PageShell from '../../components/layout/PageShell'
import Skeleton from '../../components/ui/Skeleton'

interface PathFormData {
  title: string
  slug: string
  description: string
  iconName: string
  colorToken: string
  isPremium: boolean
  isPublished: boolean
}

const defaultForm: PathFormData = {
  title: '',
  slug: '',
  description: '',
  iconName: 'book-open',
  colorToken: 'teal',
  isPremium: false,
  isPublished: false,
}

function PathFormModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial?: Partial<PathFormData>
  onSave: (data: PathFormData) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<PathFormData>({ ...defaultForm, ...initial })
  const set = (k: keyof PathFormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold text-[var(--content-primary)]">
          {initial?.title ? 'Editar trilha' : 'Nova trilha'}
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs text-[var(--content-muted)]">Título</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--content-muted)]">Slug</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--content-muted)]">Descrição</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--content-muted)]">Ícone (lucide)</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={form.iconName}
                onChange={(e) => set('iconName', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--content-muted)]">Cor</label>
              <select
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
                value={form.colorToken}
                onChange={(e) => set('colorToken', e.target.value)}
              >
                <option value="teal">teal</option>
                <option value="indigo">indigo</option>
                <option value="amber">amber</option>
                <option value="rose">rose</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--content-secondary)]">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => set('isPublished', e.target.checked)}
                className="accent-accent-500"
              />
              Publicada
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--content-secondary)]">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={(e) => set('isPremium', e.target.checked)}
                className="accent-accent-500"
              />
              Premium (PRO)
            </label>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title || !form.slug}
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

export default function AdminPaths() {
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<AdminPath | null>(null)

  const { data: paths, isLoading } = useQuery({
    queryKey: ['admin-paths'],
    queryFn: adminApi.getPaths,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: adminApi.createPath,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-paths'] }); setCreating(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminPath> }) => adminApi.updatePath(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-paths'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deletePath,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-paths'] }),
  })

  const togglePublish = (path: AdminPath) =>
    updateMutation.mutate({ id: path.id, data: { isPublished: !path.isPublished } })

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-sm text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Link>
            <span className="text-[var(--content-muted)]">/</span>
            <h1 className="text-base font-semibold text-[var(--content-primary)]">Trilhas</h1>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-xl bg-accent-500 px-3 py-2 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {paths?.map((path) => (
              <div
                key={path.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--content-primary)]">{path.title}</p>
                    {path.isPremium && <Lock className="h-3 w-3 shrink-0 text-amber-500" />}
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        path.isPublished
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-[var(--surface-overlay)] text-[var(--content-muted)]'
                      }`}
                    >
                      {path.isPublished ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--content-muted)]">{path.totalLessons} lições</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePublish(path)}
                    className="rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
                  >
                    {path.isPublished ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => setEditing(path)}
                    className="rounded-lg p-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    to={`/admin/paths/${path.id}`}
                    className="rounded-lg p-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)] transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(path.id)}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {creating && (
        <PathFormModal
          onSave={(data) => createMutation.mutate(data)}
          onClose={() => setCreating(false)}
          saving={createMutation.isPending}
        />
      )}

      {editing && (
        <PathFormModal
          initial={editing}
          onSave={(data) => updateMutation.mutate({ id: editing.id, data })}
          onClose={() => setEditing(null)}
          saving={updateMutation.isPending}
        />
      )}
    </PageShell>
  )
}
