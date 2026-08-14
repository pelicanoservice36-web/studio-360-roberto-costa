import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlunos } from '../hooks/useAlunos'
import { usePagamentos } from '../hooks/usePagamentos'

export default function Dashboard() {
  const { user } = useAuth()
  const { alunos, loading: alunosLoading } = useAlunos()
  const { pagamentos, loading: pagamentosLoading } = usePagamentos()

  const loading = alunosLoading || pagamentosLoading

  const alunosAtivos = alunos.filter(a => a.ativo).length
  const totalAlunos = alunos.length
  const pagamentosPendentes = pagamentos.filter(p => p.status === 'pendente').length
  const pagamentosAtrasados = pagamentos.filter(p => p.status === 'atrasado').length
  const pagamentosPagos = pagamentos.filter(p => p.status === 'pago').length
  const totalPagamentos = pagamentos.length || 1

  const ativosPct = totalAlunos ? Math.round((alunosAtivos / totalAlunos) * 100) : 0
  const pagosPct = Math.round((pagamentosPagos / totalPagamentos) * 100)

  const firstName = (user?.email?.split('@')[0] || 'Treinador')
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  const initials = firstName.slice(0, 2).toUpperCase()

  const hour = new Date().getHours()
  const saudacao = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const insight =
    pagamentosAtrasados > 0
      ? `Você tem ${pagamentosAtrasados} pagamento${pagamentosAtrasados > 1 ? 's' : ''} atrasado${pagamentosAtrasados > 1 ? 's' : ''}. Vale mandar uma mensagem pros alunos hoje.`
      : pagamentosPendentes > 0
      ? `${pagamentosPendentes} pagamento${pagamentosPendentes > 1 ? 's' : ''} pendente${pagamentosPendentes > 1 ? 's' : ''} este mês, mas nada atrasado. Segue o plano.`
      : 'Nenhum pagamento pendente no momento. Tudo em dia com seus alunos.'

  return (
    <div className="fade-in">
      <div style={styles.greetRow}>
        <div>
          <p style={styles.greetHi}>{saudacao}</p>
          <h1 style={styles.greetName}>{firstName.split(' ')[0]}</h1>
        </div>
        <div className="avatar-circle" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
          {initials}
        </div>
      </div>

      <div className="insight-card">
        <span className="insight-badge">🧭</span>
        <div>
          <p className="insight-kicker">Resumo de hoje</p>
          <p className="insight-text">{loading ? 'Carregando seus dados...' : insight}</p>
        </div>
      </div>

      <div style={styles.duo}>
        <div className="tile">
          <p className="tile-label">Alunos ativos</p>
          <p className="tile-value">
            {loading ? '—' : alunosAtivos} <small>/ {loading ? '—' : totalAlunos} total</small>
          </p>
          <div className="track">
            <div className="track-fill" style={{ width: `${loading ? 0 : ativosPct}%` }} />
          </div>
        </div>
        <div className="tile">
          <p className="tile-label">Pagamentos em dia</p>
          <p className="tile-value">
            {loading ? '—' : pagamentosPagos} <small>/ {loading ? '—' : pagamentos.length} este mês</small>
          </p>
          <div className="track">
            <div className="track-fill" style={{ width: `${loading ? 0 : pagosPct}%` }} />
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {[
          { icon: '👥', label: 'Total de alunos', value: alunosLoading ? '—' : totalAlunos, tone: 'primary' as const },
          {
            icon: '💰',
            label: 'Pagamentos pendentes',
            value: pagamentosLoading ? '—' : pagamentosPendentes,
            tone: pagamentosPendentes > 0 ? ('warning' as const) : ('primary' as const),
          },
          {
            icon: '⚠️',
            label: 'Pagamentos atrasados',
            value: pagamentosLoading ? '—' : pagamentosAtrasados,
            tone: pagamentosAtrasados > 0 ? ('danger' as const) : ('accent' as const),
          },
        ].map((s) => (
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
        <p className="tile-label" style={{ marginBottom: '1rem' }}>Navegação rápida</p>
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

const toneStyles: Record<'primary' | 'accent' | 'warning' | 'danger', React.CSSProperties> = {
  primary: { background: 'rgba(234, 88, 12, 0.14)', color: 'var(--primary)' },
  accent: { background: 'rgba(16, 185, 129, 0.14)', color: 'var(--accent)' },
  warning: { background: 'rgba(245, 158, 11, 0.14)', color: 'var(--warning)' },
  danger: { background: 'rgba(239, 68, 68, 0.14)', color: 'var(--danger)' },
}

const styles = {
  greetRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.25rem',
  } as React.CSSProperties,
  greetHi: {
    margin: 0,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
  } as React.CSSProperties,
  greetName: {
    margin: '0.15rem 0 0',
    fontSize: '1.9rem',
  } as React.CSSProperties,
  duo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.85rem',
    marginBottom: '1.75rem',
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
