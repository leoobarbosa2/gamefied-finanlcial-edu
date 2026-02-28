import LoginForm from '../components/auth/LoginForm'
import ThemeToggle from '../components/layout/ThemeToggle'

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-base font-semibold text-[var(--content-primary)]">Finlearn</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[var(--content-primary)]">Bem-vindo de volta</h1>
            <p className="mt-1.5 text-sm text-[var(--content-muted)]">
              Entre para continuar sua jornada de aprendizado
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
