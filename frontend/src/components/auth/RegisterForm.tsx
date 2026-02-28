import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function RegisterForm() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '', displayName: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.displayName.trim()) e.displayName = 'Nome é obrigatório'
    if (!form.email.includes('@')) e.email = 'Informe um e-mail válido'
    if (form.password.length < 8) e.password = 'A senha deve ter pelo menos 8 caracteres'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const result = await authApi.register(form)
      setAuth(result.user, result.accessToken)
      navigate('/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 409) {
        setErrors({ email: 'Este e-mail já está em uso' })
      } else {
        setErrors({ general: 'Algo deu errado. Por favor, tente novamente.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nome"
        type="text"
        autoComplete="name"
        value={form.displayName}
        onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
        error={errors.displayName}
        required
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        error={errors.email}
        required
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        error={errors.password}
        hint="Mínimo de 8 caracteres"
        required
      />
      {errors.general && <p className="text-sm text-[var(--error)]">{errors.general}</p>}
      <Button type="submit" loading={loading} className="mt-1 w-full" size="lg">
        Criar conta
      </Button>
      <p className="text-center text-sm text-[var(--content-muted)]">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-accent-500 hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </form>
  )
}
