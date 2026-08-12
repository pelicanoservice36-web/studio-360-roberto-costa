import { Link } from 'react-router-dom'
import { useAlunos } from '../hooks/useAlunos'
import { usePagamentos } from '../hooks/usePagamentos'

export default function Dashboard() {
  const { alunos, loading: alunosLoading } = useAlunos()
  const { pagamentos, loading: pagamentosLoading } = usePagamentos()

  const alunosAtivos = alunos.filter(a => a.ativo).length
  const pagamentosPendentes = pagamentos.filter(p => p.status === 'pendente').length

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Bem-vindo ao Studio 360 CRM
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.label}>Alunos Ativos</p>
          <p style={styles.value}>{alunosLoading ? '...' : alunosAtivos}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>Pagamentos Pendentes</p>
          <p style={styles.value}>{pagamentosLoading ? '...' : pagamentosPendentes}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Navegação Rápida</h2>
        <div style={styles.linkGrid}>
          <Link to="/alunos" style={styles.quickLink}>
            <span>📋</span>
            <span>Alunos</span>
          </Link>
          <Link to="/alunos/novo" style={styles.quickLink}>
            <span>➕</span>
            <span>Novo Aluno</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  card: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  label: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: 0,
  } as React.CSSProperties,
  value: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'var(--primary)',
    margin: '0.5rem 0 0 0',
  } as React.CSSProperties,
  linkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  quickLink: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--text)',
    transition: 'all 0.2s',
    fontSize: '1.1rem',
  } as React.CSSProperties,
}
