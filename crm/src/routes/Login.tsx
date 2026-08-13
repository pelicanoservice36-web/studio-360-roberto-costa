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
        <div style={styles.brandMark}>360</div>
        <h1 style={styles.title}>Studio 360</h1>
        <p style={styles.subtitle}>Acesse o CRM de alunos</p>

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
            {loading ? 'Entrando...' : 'Entrar'}
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
    background: 'var(--ink)',
    padding: '1.5rem',
  } as React.CSSProperties,
  card: {
    background: 'var(--ink-2)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '2.5rem 2rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '400px',
  } as React.CSSProperties,
  brandMark: {
    display: 'grid',
    placeItems: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '10px',
    background: 'var(--primary)',
    color: 'white',
    fontFamily: 'var(--display)',
    fontWeight: 800,
    fontSize: '1.1rem',
    margin: '0 auto 1rem',
  } as React.CSSProperties,
  title: {
    textAlign: 'center',
    marginBottom: '0.25rem',
    color: 'white',
    fontSize: '2rem',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  subtitle: {
    textAlign: 'center',
    marginBottom: '1.75rem',
    color: 'rgba(255,255,255,0.6)',
  } as React.CSSProperties,
  alert: {
    background: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.8)',
  } as React.CSSProperties,
  input: {
    padding: '0.8rem 0.9rem',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'white',
  } as React.CSSProperties,
  button: {
    padding: '0.85rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontFamily: 'var(--display)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  } as React.CSSProperties,
  hint: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.45)',
  } as React.CSSProperties,
}
