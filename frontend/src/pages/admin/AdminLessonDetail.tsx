import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, ChevronDown, ChevronUp, Check, X, Save, Loader2 } from 'lucide-react'
import { adminApi, type AdminStep, type AdminQuestion, type AdminOption } from '../../api/admin'
import PageShell from '../../components/layout/PageShell'
import Skeleton from '../../components/ui/Skeleton'

// ── Deep clone helpers ─────────────────────────────────────────────────────────
function cloneSteps(steps: AdminStep[]): AdminStep[] {
  return steps.map((s) => ({
    ...s,
    content: { ...s.content },
    questions: s.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => ({ ...o })),
    })),
  }))
}

// ── Simple textarea that auto-grows ───────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  multiline = false,
  mono = false,
  placeholder = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  mono?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--content-muted)]">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          className={`w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500 resize-y ${mono ? 'font-mono' : ''}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-accent-500"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

// ── Option row ─────────────────────────────────────────────────────────────────
function OptionRow({
  option,
  onChange,
  onDelete,
  onMarkCorrect,
}: {
  option: AdminOption
  onChange: (id: string, text: string) => void
  onDelete: (id: string) => void
  onMarkCorrect: (id: string) => void
}) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors ${option.isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
      <button
        onClick={() => onMarkCorrect(option.id)}
        title="Marcar como correta"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${option.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-[var(--content-muted)] hover:border-emerald-400'}`}
      >
        {option.isCorrect && <Check className="h-3 w-3 text-white" />}
      </button>
      <input
        className="flex-1 min-w-0 bg-transparent text-sm text-[var(--content-primary)] focus:outline-none"
        value={option.text}
        onChange={(e) => onChange(option.id, e.target.value)}
      />
      <button
        onClick={() => onDelete(option.id)}
        className="shrink-0 rounded-lg p-1 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── New option inline form ─────────────────────────────────────────────────────
function AddOptionRow({ onAdd }: { onAdd: (text: string) => void }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-xs text-[var(--content-muted)] hover:border-accent-500 hover:text-accent-500 transition-colors">
      <Plus className="h-3.5 w-3.5" /> Adicionar alternativa
    </button>
  )
  return (
    <div className="flex gap-1.5">
      <input autoFocus className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="Texto da alternativa…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { onAdd(text.trim()); setText(''); setOpen(false) } if (e.key === 'Escape') setOpen(false) }} />
      <button onClick={() => { if (text.trim()) { onAdd(text.trim()); setText(''); setOpen(false) } }} className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600">OK</button>
      <button onClick={() => setOpen(false)} className="rounded-lg px-2 py-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)]"><X className="h-3.5 w-3.5" /></button>
    </div>
  )
}

// ── Question card ──────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  onChangeQuestion,
  onDeleteQuestion,
  onCreateOption,
  onChangeOption,
  onDeleteOption,
  onMarkCorrect,
}: {
  question: AdminQuestion
  onChangeQuestion: (id: string, field: 'questionText' | 'explanation', value: string) => void
  onDeleteQuestion: (id: string) => void
  onCreateOption: (questionId: string, text: string) => void
  onChangeOption: (id: string, text: string) => void
  onDeleteOption: (id: string) => void
  onMarkCorrect: (questionId: string, optionId: string) => void
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 flex flex-col gap-3">
          <Field label="Pergunta" value={question.questionText} onChange={(v) => onChangeQuestion(question.id, 'questionText', v)} />
          <Field label="Explicação (exibida após responder)" value={question.explanation ?? ''} onChange={(v) => onChangeQuestion(question.id, 'explanation', v)} multiline placeholder="Explique por que a resposta é correta…" />
        </div>
        <button onClick={() => onDeleteQuestion(question.id)} className="mt-6 shrink-0 rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--content-muted)]">
          Alternativas <span className="normal-case font-normal text-[var(--content-muted)]">— círculo = correta</span>
        </p>
        <div className="flex flex-col gap-1.5">
          {question.options.map((opt) => (
            <OptionRow
              key={opt.id}
              option={opt}
              onChange={onChangeOption}
              onDelete={onDeleteOption}
              onMarkCorrect={(id) => onMarkCorrect(question.id, id)}
            />
          ))}
          <AddOptionRow onAdd={(text) => onCreateOption(question.id, text)} />
        </div>
      </div>
    </div>
  )
}

// ── Step card ──────────────────────────────────────────────────────────────────
function StepCard({
  step,
  onChangeContent,
  onDeleteStep,
  onCreateQuestion,
  onChangeQuestion,
  onDeleteQuestion,
  onCreateOption,
  onChangeOption,
  onDeleteOption,
  onMarkCorrect,
}: {
  step: AdminStep
  onChangeContent: (stepId: string, key: string, value: string) => void
  onDeleteStep: (id: string) => void
  onCreateQuestion: (stepId: string) => void
  onChangeQuestion: (id: string, field: 'questionText' | 'explanation', value: string) => void
  onDeleteQuestion: (id: string) => void
  onCreateOption: (questionId: string, text: string) => void
  onChangeOption: (id: string, text: string) => void
  onDeleteOption: (id: string) => void
  onMarkCorrect: (questionId: string, optionId: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const content = step.content as Record<string, string>
  const typeLabel = { READ: 'Leitura', QUIZ: 'Quiz', REFLECT: 'Reflexão' }
  const typeColor = {
    READ: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    QUIZ: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    REFLECT: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-sm font-bold text-[var(--content-muted)] w-5 shrink-0">#{step.orderIndex}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColor[step.stepType]}`}>{typeLabel[step.stepType]}</span>
        <div className="flex-1" />
        <button onClick={() => setCollapsed((v) => !v)} className="rounded-lg p-1.5 text-[var(--content-muted)] hover:bg-[var(--surface-overlay)]">
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        <button onClick={() => onDeleteStep(step.id)} className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="border-t border-[var(--border)] px-4 pb-4 pt-3 flex flex-col gap-4">
          {step.stepType === 'READ' && (
            <>
              <Field label="Título" value={content.heading ?? ''} onChange={(v) => onChangeContent(step.id, 'heading', v)} />
              <Field label="Conteúdo (markdown)" value={content.body ?? ''} onChange={(v) => onChangeContent(step.id, 'body', v)} multiline mono placeholder="Escreva o conteúdo em markdown…" />
            </>
          )}
          {step.stepType === 'REFLECT' && (
            <Field label="Pergunta de reflexão" value={content.prompt ?? ''} onChange={(v) => onChangeContent(step.id, 'prompt', v)} multiline placeholder="Escreva a pergunta de reflexão…" />
          )}
          {step.stepType === 'QUIZ' && (
            <div className="flex flex-col gap-3">
              {step.questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  onChangeQuestion={onChangeQuestion}
                  onDeleteQuestion={onDeleteQuestion}
                  onCreateOption={onCreateOption}
                  onChangeOption={onChangeOption}
                  onDeleteOption={onDeleteOption}
                  onMarkCorrect={onMarkCorrect}
                />
              ))}
              <button onClick={() => onCreateQuestion(step.id)} className="flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] px-4 py-2.5 text-sm text-[var(--content-muted)] hover:border-accent-500 hover:text-accent-500 transition-colors">
                <Plus className="h-4 w-4" /> Adicionar pergunta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Add step panel ─────────────────────────────────────────────────────────────
function AddStepPanel({ onAdd }: { onAdd: (type: string, order: number) => void }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'READ' | 'QUIZ' | 'REFLECT'>('READ')
  const [order, setOrder] = useState(1)

  if (!open) return (
    <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--content-muted)] hover:border-accent-500 hover:text-accent-500 transition-colors w-full">
      <Plus className="h-4 w-4" /> Adicionar passo
    </button>
  )

  return (
    <div className="rounded-xl border border-accent-500 bg-[var(--surface-raised)] p-4">
      <p className="mb-3 text-sm font-semibold text-[var(--content-primary)]">Novo passo</p>
      <div className="flex gap-2 flex-wrap items-center">
        {(['READ', 'QUIZ', 'REFLECT'] as const).map((t) => (
          <button key={t} onClick={() => setType(t)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${type === t ? 'bg-accent-500 text-white' : 'bg-[var(--surface-overlay)] text-[var(--content-secondary)] hover:bg-[var(--border)]'}`}>
            {t === 'READ' ? 'Leitura' : t === 'QUIZ' ? 'Quiz' : 'Reflexão'}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-[var(--content-muted)]">Ordem:</label>
          <input type="number" min={1} className="w-16 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => { onAdd(type, order); setOpen(false) }} className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600">Criar</button>
        <button onClick={() => setOpen(false)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--content-muted)] hover:bg-[var(--surface-overlay)]">Cancelar</button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AdminLessonDetail() {
  const { lessonId, pathId } = useParams<{ lessonId: string; pathId: string }>()
  const queryClient = useQueryClient()
  const qKey = ['admin-steps', lessonId]

  // Server state
  const { data: serverSteps, isLoading } = useQuery({
    queryKey: qKey,
    queryFn: () => adminApi.getSteps(lessonId!),
    enabled: !!lessonId,
    staleTime: 30_000,
  })

  // Local draft state
  const [draft, setDraft] = useState<AdminStep[]>([])
  const [dirtySteps, setDirtySteps] = useState<Set<string>>(new Set())
  const [dirtyQuestions, setDirtyQuestions] = useState<Set<string>>(new Set())
  const [dirtyOptions, setDirtyOptions] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  // Sync draft when server data loads (or after a save)
  useEffect(() => {
    if (serverSteps) {
      setDraft(cloneSteps(serverSteps))
      setDirtySteps(new Set())
      setDirtyQuestions(new Set())
      setDirtyOptions(new Set())
    }
  }, [serverSteps])

  const isDirty = dirtySteps.size > 0 || dirtyQuestions.size > 0 || dirtyOptions.size > 0

  // ── Draft mutators ───────────────────────────────────────────────────────────

  const changeContent = useCallback((stepId: string, key: string, value: string) => {
    setDraft((prev) => prev.map((s) => s.id === stepId ? { ...s, content: { ...s.content, [key]: value } } : s))
    setDirtySteps((prev) => new Set(prev).add(stepId))
  }, [])

  const changeQuestion = useCallback((questionId: string, field: 'questionText' | 'explanation', value: string) => {
    setDraft((prev) => prev.map((s) => ({
      ...s,
      questions: s.questions.map((q) => q.id === questionId ? { ...q, [field]: value } : q),
    })))
    setDirtyQuestions((prev) => new Set(prev).add(questionId))
  }, [])

  const changeOption = useCallback((optionId: string, text: string) => {
    setDraft((prev) => prev.map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => o.id === optionId ? { ...o, text } : o),
      })),
    })))
    setDirtyOptions((prev) => new Set(prev).add(optionId))
  }, [])

  const markCorrect = useCallback((questionId: string, optionId: string) => {
    setDraft((prev) => prev.map((s) => ({
      ...s,
      questions: s.questions.map((q) => {
        if (q.id !== questionId) return q
        return {
          ...q,
          options: q.options.map((o) => {
            const wasCorrect = o.isCorrect
            const nowCorrect = o.id === optionId
            if (wasCorrect !== nowCorrect) {
              setDirtyOptions((prev2) => new Set(prev2).add(o.id))
            }
            return { ...o, isCorrect: nowCorrect }
          }),
        }
      }),
    })))
  }, [])

  // ── Save all dirty items in parallel ────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true)
    try {
      const patches: Promise<unknown>[] = []

      for (const stepId of dirtySteps) {
        const step = draft.find((s) => s.id === stepId)
        if (step) patches.push(adminApi.updateStep(stepId, { content: step.content }))
      }

      for (const qId of dirtyQuestions) {
        const question = draft.flatMap((s) => s.questions).find((q) => q.id === qId)
        if (question) patches.push(adminApi.updateQuestion(qId, { questionText: question.questionText, explanation: question.explanation ?? undefined }))
      }

      for (const oId of dirtyOptions) {
        const option = draft.flatMap((s) => s.questions).flatMap((q) => q.options).find((o) => o.id === oId)
        if (option) patches.push(adminApi.updateOption(oId, { text: option.text, isCorrect: option.isCorrect }))
      }

      await Promise.all(patches)
      await queryClient.invalidateQueries({ queryKey: qKey })
    } finally {
      setSaving(false)
    }
  }

  // ── Immediate operations (creates & deletes) ─────────────────────────────────

  const handleCreateStep = async (type: string, order: number) => {
    const defaultContent: Record<string, Record<string, unknown>> = {
      READ: { heading: '', body: '' }, QUIZ: {}, REFLECT: { prompt: '' },
    }
    await adminApi.createStep(lessonId!, { stepType: type, orderIndex: order, content: defaultContent[type] ?? {} })
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  const handleDeleteStep = async (id: string) => {
    if (!confirm('Remover este passo? Isso apagará perguntas e alternativas.')) return
    await adminApi.deleteStep(id)
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  const handleCreateQuestion = async (stepId: string) => {
    await adminApi.createQuestion(stepId, { questionText: 'Nova pergunta', explanation: '' })
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Remover esta pergunta e suas alternativas?')) return
    await adminApi.deleteQuestion(id)
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  const handleCreateOption = async (questionId: string, text: string) => {
    await adminApi.createOption(questionId, { text, isCorrect: false })
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  const handleDeleteOption = async (id: string) => {
    await adminApi.deleteOption(id)
    queryClient.invalidateQueries({ queryKey: qKey })
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb + save bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-[var(--content-muted)] flex-1 min-w-0">
            <Link to="/admin" className="hover:text-[var(--content-primary)] transition-colors shrink-0">Admin</Link>
            <span>/</span>
            <Link to="/admin/paths" className="hover:text-[var(--content-primary)] transition-colors shrink-0">Trilhas</Link>
            {pathId && (
              <>
                <span>/</span>
                <Link to={`/admin/paths/${pathId}`} className="hover:text-[var(--content-primary)] transition-colors shrink-0">Trilha</Link>
              </>
            )}
            <span>/</span>
            <span className="text-[var(--content-primary)] font-medium truncate">Editor de Passos</span>
          </div>

          {isDirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Salvando…' : `Salvar alterações (${dirtySteps.size + dirtyQuestions.size + dirtyOptions.size})`}
            </button>
          )}
        </div>

        {isDirty && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
            Você tem alterações não salvas. Clique em "Salvar alterações" para confirmar.
          </div>
        )}

        <div>
          <h1 className="text-base font-semibold text-[var(--content-primary)]">Editor de Passos</h1>
          <p className="mt-0.5 text-xs text-[var(--content-muted)]">
            Edite os campos e clique em "Salvar alterações". Adicionar/remover passos e alternativas é imediato.
          </p>
        </div>

        {/* Steps */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {draft.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                onChangeContent={changeContent}
                onDeleteStep={handleDeleteStep}
                onCreateQuestion={handleCreateQuestion}
                onChangeQuestion={changeQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onCreateOption={handleCreateOption}
                onChangeOption={changeOption}
                onDeleteOption={handleDeleteOption}
                onMarkCorrect={markCorrect}
              />
            ))}

            {!isLoading && draft.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--content-muted)]">Nenhum passo ainda. Adicione um abaixo.</p>
            )}

            <AddStepPanel onAdd={handleCreateStep} />
          </div>
        )}
      </div>
    </PageShell>
  )
}
