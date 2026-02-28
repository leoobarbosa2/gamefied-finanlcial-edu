import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function LoginForm() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await authApi.login(form)
      setAuth(result.user, result.accessToken)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
      <Button type="submit" loading={loading} className="mt-1 w-full" size="lg">
        Entrar
      </Button>
      <p className="text-center text-sm text-[var(--content-muted)]">
        Não tem conta?{' '}
        <Link to="/register" className="text-accent-500 hover:underline font-medium">
          Criar uma
        </Link>
      </p>
    </form>
  )
}
