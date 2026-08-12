import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Studio 360 CRM</h1>
        <p style={styles.subtitle}>Acesse sua conta</p>

        {error && <div style={styles.alert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.hint}>
          Entre em contato com o administrador para criar uma nova conta.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--bg-secondary)',
  } as React.CSSProperties,
  card: {
    background: 'var(--bg)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  } as React.CSSProperties,
  title: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: 'var(--primary)',
    fontSize: '2rem',
  } as React.CSSProperties,
  subtitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: 'var(--text-muted)',
  } as React.CSSProperties,
  alert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  label: {
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: 'var(--text)',
  } as React.CSSProperties,
  input: {
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
  } as React.CSSProperties,
  button: {
    padding: '0.75rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s',
  } as React.CSSProperties,
  hint: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  } as React.CSSProperties,
}
