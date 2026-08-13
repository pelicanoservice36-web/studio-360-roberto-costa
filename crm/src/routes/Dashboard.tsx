import { Link } from 'react-router-dom'
import { useAlunos } from '../hooks/useAlunos'
import { usePagamentos } from '../hooks/usePagamentos'

export default function Dashboard() {
  const { alunos, loading: alunosLoading } = useAlunos()
  const { pagamentos, loading: pagamentosLoading } = usePagamentos()

  const alunosAtivos = alunos.filter(a => a.ativo).length
  const pagamentosPendentes = pagamentos.filter(p => p.status === 'pendente').length

  const stats = [
    { icon: '🏋️', label: 'Alunos Ativos', value: alunosLoading ? '—' : alunosAtivos, tone: 'accent' as const },
    { icon: '👥', label: 'Total de Alunos', value: alunosLoading ? '—' : alunos.length, tone: 'primary' as const },
    {
      icon: '💰',
      label: 'Pagamentos Pendentes',
      value: pagamentosLoading ? '—' : pagamentosPendentes,
      tone: pagamentosPendentes > 0 ? ('warning' as const) : ('primary' as const),
    },
  ]

  return (
    <div>
      <p style={styles.eyebrow}>Studio 360</p>
      <h1 style={styles.title}>Olá 👋</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Aqui está o resumo dos seus alunos hoje.
      </p>

      <div style={styles.grid} className="fade-in">
        {stats.map((s) => (
          <div key={s.label} style={styles.card}>
            <span style={{ ...styles.iconBadge, ...toneStyles[s.tone] }}>{s.icon}</span>
            <div>
              <p style={styles.value}>{s.value}</p>
              <p style={styles.label}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={styles.sectionTitle}>Navegação Rápida</h2>
        <div style={styles.linkGrid}>
          <Link to="/alunos" style={styles.quickLink}>
            <span style={{ ...styles.iconBadge, ...toneStyles.primary }}>📋</span>
            <span>Ver Alunos</span>
          </Link>
          <Link to="/alunos/novo" style={styles.quickLink}>
            <span style={{ ...styles.iconBadge, ...toneStyles.accent }}>➕</span>
            <span>Novo Aluno</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

const toneStyles: Record<'primary' | 'accent' | 'warning', React.CSSProperties> = {
  primary: { background: 'rgba(234, 88, 12, 0.14)', color: 'var(--primary)' },
  accent: { background: 'rgba(16, 185, 129, 0.14)', color: 'var(--accent)' },
  warning: { background: 'rgba(245, 158, 11, 0.14)', color: 'var(--warning)' },
}

const styles = {
  eyebrow: {
    fontFamily: 'var(--display)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '0.8rem',
    color: 'var(--primary)',
    fontWeight: 700,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.15rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem 1.5rem',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  } as React.CSSProperties,
  iconBadge: {
    display: 'grid',
    placeItems: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '12px',
    fontSize: '1.4rem',
    flexShrink: 0,
  } as React.CSSProperties,
  label: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0,
  } as React.CSSProperties,
  value: {
    fontSize: '1.75rem',
    fontFamily: 'var(--display)',
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
    lineHeight: 1.1,
  } as React.CSSProperties,
  linkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '1.1rem 1.25rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    textDecoration: 'none',
    color: 'var(--text)',
    transition: 'all 0.15s',
    fontWeight: 600,
    boxShadow: 'var(--shadow-sm)',
  } as React.CSSProperties,
}
