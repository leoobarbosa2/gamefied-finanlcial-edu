import { Link } from 'react-router-dom'
import { TrendingUp, Target, Calendar, Wallet, BarChart2, Shield } from 'lucide-react'
import ThemeToggle from '../components/layout/ThemeToggle'
import Button from '../components/ui/Button'

const features = [
  {
    icon: TrendingUp,
    color: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    title: 'Aprenda em 5 minutos',
    description: 'Sessões curtas e objetivas, feitas para se encaixar na sua rotina — não para dominá-la.',
  },
  {
    icon: Target,
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    title: 'Acompanhe seu progresso',
    description: 'Siga trilhas estruturadas e veja exatamente até onde você chegou.',
  },
  {
    icon: Calendar,
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Construa hábitos duradouros',
    description: 'Sequências diárias e lembretes gentis para manter você aprendendo de forma consistente.',
  },
]

const paths = [
  {
    icon: Wallet,
    color: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    label: 'Orçamento Inteligente',
    sublabel: '5 lições',
  },
  {
    icon: BarChart2,
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    label: 'Investimentos para Iniciantes',
    sublabel: '5 lições',
  },
  {
    icon: Shield,
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    label: 'Mais trilhas em breve',
    sublabel: 'Em desenvolvimento',
  },
]

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-base font-semibold text-[var(--content-primary)]">Finlearn</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 dark:border-accent-800/40 dark:bg-accent-900/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            <p className="text-xs font-medium text-accent-600 dark:text-accent-400">
              Educação financeira reinventada
            </p>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--content-primary)] sm:text-5xl">
            Clareza financeira,
            <br />
            uma lição de cada vez.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[var(--content-secondary)]">
            O Finlearn ajuda você a dominar finanças pessoais com sessões curtas e objetivas. Sem jargão, sem sobrecarga — só habilidades práticas que crescem com o tempo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg">Começar a aprender grátis</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </section>

        {/* Paths preview */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-10">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-[var(--content-muted)]">
            Trilhas disponíveis
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {paths.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${p.color}`}>
                  <p.icon className={`h-4 w-4 ${p.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--content-primary)]">{p.label}</p>
                  <p className="text-xs text-[var(--content-muted)]">{p.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6"
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="mb-2 font-semibold text-[var(--content-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--content-muted)]">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] px-6 py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-[var(--content-primary)]">
              Seu futuro financeiro começa hoje
            </h2>
            <p className="mt-3 text-[var(--content-muted)]">
              Junte-se a milhares de pessoas construindo melhores hábitos financeiros — uma lição de 5 minutos por vez.
            </p>
            <Link to="/register" className="mt-6 inline-block">
              <Button size="lg">Criar conta gratuita</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--content-primary)]">Finlearn</span>
          <p className="text-xs text-[var(--content-muted)]">
            Educação financeira para o profissional moderno
          </p>
        </div>
      </footer>
    </div>
  )
}
