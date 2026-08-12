import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAlunos } from '../../hooks/useAlunos'
import { Aluno } from '../../types/database'

export default function AlunoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { alunos, createAluno, updateAluno } = useAlunos()
  const [form, setForm] = useState<Partial<Aluno>>({
    nome: '',
    email: '',
    telefone: '',
    plano: '',
    valor_mensalidade: undefined,
    data_inicio: new Date().toISOString().split('T')[0],
    ativo: true,
    observacoes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const aluno = alunos.find(a => a.id === id)
      if (aluno) setForm(aluno)
    }
  }, [id, alunos])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (id) {
        await updateAluno(id, form)
      } else {
        await createAluno(form as Omit<Aluno, 'id' | 'created_at'>)
      }
      navigate('/alunos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aluno')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h1>{id ? 'Editar Aluno' : 'Novo Aluno'}</h1>

      {error && <div style={styles.alert}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Nome *</label>
            <input
              type="text"
              name="nome"
              value={form.nome || ''}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={form.telefone || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Plano</label>
            <input
              type="text"
              name="plano"
              value={form.plano || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Valor Mensalidade</label>
            <input
              type="number"
              name="valor_mensalidade"
              step="0.01"
              value={form.valor_mensalidade || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Data de Início</label>
            <input
              type="date"
              name="data_inicio"
              value={form.data_inicio || ''}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo !== false}
              onChange={handleChange}
            />
            {' '}Aluno Ativo
          </label>
        </div>

        <div>
          <label style={styles.label}>Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes || ''}
            onChange={handleChange}
            rows={4}
            style={{ ...styles.input, minHeight: '100px' }}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar Aluno'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/alunos')}
            style={styles.cancelBtn}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
  } as React.CSSProperties,
  alert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: 'var(--text)',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  } as React.CSSProperties,
  submitBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  } as React.CSSProperties,
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--bg-secondary)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  } as React.CSSProperties,
}
