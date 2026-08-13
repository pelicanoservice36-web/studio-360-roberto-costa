import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAlunos } from '../../hooks/useAlunos'
import { useHistoricoTreino } from '../../hooks/useHistoricoTreino'
import { usePagamentos } from '../../hooks/usePagamentos'
import { useFrequencia } from '../../hooks/useFrequencia'
import { Aluno } from '../../types/database'

type Tab = 'historico' | 'pagamentos' | 'frequencia'

export default function AlunoDetail() {
  const { id } = useParams()
  const { alunos } = useAlunos()
  const { historico, addSessao } = useHistoricoTreino(id)
  const { pagamentos, addPagamento, updatePagamento } = usePagamentos(id)
  const { frequencia, addCheckin } = useFrequencia(id)

  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [tab, setTab] = useState<Tab>('historico')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const found = alunos.find(a => a.id === id)
    if (found) setAluno(found)
  }, [id, alunos])

  if (!aluno) return <p>Aluno não encontrado.</p>

  const handleAddSessao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const observacoesEl = form.querySelector('textarea[name="observacoes"]') as HTMLTextAreaElement | null
    if (!observacoesEl) {
      setErrors({ sessao: 'Campo observações não encontrado' })
      return
    }
    const observacoes = observacoesEl.value
    try {
      await addSessao({
        aluno_id: aluno.id,
        trainer_id: null,
        data_sessao: new Date().toISOString().split('T')[0],
        observacoes,
      })
      form.reset()
    } catch (err) {
      setErrors({ sessao: err instanceof Error ? err.message : 'Erro ao adicionar sessão' })
    }
  }

  const handleAddPagamento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const valorEl = form.querySelector('input[name="valor"]') as HTMLInputElement | null
    const dataEl = form.querySelector('input[name="data_vencimento"]') as HTMLInputElement | null
    if (!valorEl || !dataEl) {
      setErrors({ pagamento: 'Campos obrigatórios não encontrados' })
      return
    }
    const valor = parseFloat(valorEl.value)
    if (isNaN(valor) || valor <= 0) {
      setErrors({ pagamento: 'Valor inválido' })
      return
    }
    const data_vencimento = dataEl.value
    try {
      await addPagamento({
        aluno_id: aluno.id,
        competencia: new Date().toISOString().split('T')[0],
        valor,
        status: 'pendente',
        data_vencimento,
        data_pagamento: null,
      })
      form.reset()
    } catch (err) {
      setErrors({ pagamento: err instanceof Error ? err.message : 'Erro ao adicionar pagamento' })
    }
  }

  const handleCheckin = async () => {
    try {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const hora_checkin = `${hours}:${minutes}:${seconds}`
      await addCheckin({
        aluno_id: aluno.id,
        data_checkin: now.toISOString().split('T')[0],
        hora_checkin,
      })
    } catch (err) {
      setErrors({ checkin: err instanceof Error ? err.message : 'Erro ao fazer check-in' })
    }
  }

  const handleMarkAsPaid = async (pagamentoId: string) => {
    try {
      await updatePagamento(pagamentoId, {
        status: 'pago',
        data_pagamento: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setErrors({ pagamento: err instanceof Error ? err.message : 'Erro ao atualizar pagamento' })
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <Link to="/alunos" style={styles.backLink}>← Voltar</Link>
          <h1 style={{ margin: '0.5rem 0 0 0' }}>{aluno.nome}</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{aluno.email || 'Email não informado'}</p>
        </div>
        <Link to={`/alunos/${aluno.id}/editar`} style={styles.editBtn}>Editar</Link>
      </div>

      <div style={styles.info}>
        <div><strong>Telefone:</strong> {aluno.telefone || '-'}</div>
        <div><strong>Plano:</strong> {aluno.plano || '-'}</div>
        <div><strong>Valor:</strong> {aluno.valor_mensalidade ? `R$ ${aluno.valor_mensalidade}` : '-'}</div>
        <div><strong>Status:</strong> {aluno.ativo ? '✓ Ativo' : '✗ Inativo'}</div>
      </div>

      <div style={styles.tabs}>
        {(['historico', 'pagamentos', 'frequencia'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tab,
              ...(tab === t ? styles.tabActive : {}),
            }}
          >
            {t === 'historico' ? 'Treino' : t === 'pagamentos' ? 'Pagamentos' : 'Frequência'}
          </button>
        ))}
      </div>

      {tab === 'historico' && (
        <div style={styles.section}>
          <h2>Histórico de Treino</h2>
          {errors.sessao && <div style={styles.alert}>{errors.sessao}</div>}
          <form onSubmit={handleAddSessao} style={styles.formSmall}>
            <textarea
              name="observacoes"
              placeholder="Notas da sessão..."
              style={styles.input}
              rows={3}
            />
            <button type="submit" style={styles.btn}>Adicionar Sessão</button>
          </form>
          {historico.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma sessão registrada.</p>
          ) : (
            <div>
              {historico.map(s => (
                <div key={s.id} style={styles.item}>
                  <strong>{s.data_sessao}</strong>
                  <p>{s.observacoes || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'pagamentos' && (
        <div style={styles.section}>
          <h2>Pagamentos</h2>
          {errors.pagamento && <div style={styles.alert}>{errors.pagamento}</div>}
          <form onSubmit={handleAddPagamento} style={styles.formGrid}>
            <input
              type="number"
              name="valor"
              placeholder="Valor"
              step="0.01"
              required
              style={styles.input}
            />
            <input
              type="date"
              name="data_vencimento"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.btn}>Adicionar Pagamento</button>
          </form>
          {pagamentos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum pagamento registrado.</p>
          ) : (
            <table style={styles.table} className="table-plain">
              <thead>
                <tr>
                  <th>Data Vencimento</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map(p => (
                  <tr key={p.id}>
                    <td>{p.data_vencimento}</td>
                    <td>R$ {p.valor}</td>
                    <td>
                      <span style={p.status === 'pago' ? styles.badgeSuccess : styles.badgeWarning}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.status !== 'pago' && (
                        <button
                          onClick={() => handleMarkAsPaid(p.id)}
                          style={styles.linkBtn}
                        >
                          Marcar como Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'frequencia' && (
        <div style={styles.section}>
          <h2>Frequência</h2>
          {errors.checkin && <div style={styles.alert}>{errors.checkin}</div>}
          <button onClick={handleCheckin} style={styles.btn}>
            ✓ Check-in Hoje
          </button>
          {frequencia.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum check-in registrado.</p>
          ) : (
            <table style={styles.table} className="table-plain">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Hora</th>
                </tr>
              </thead>
              <tbody>
                {frequencia.map(f => (
                  <tr key={f.id}>
                    <td>{f.data_checkin}</td>
                    <td>{f.hora_checkin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border)',
  } as React.CSSProperties,
  backLink: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  } as React.CSSProperties,
  editBtn: {
    background: 'var(--primary)',
    color: 'white',
    padding: '0.7rem 1.4rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: 'var(--shadow-sm)',
  } as React.CSSProperties,
  info: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    padding: '1.25rem 1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
  } as React.CSSProperties,
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    background: 'var(--bg-secondary)',
    padding: '0.35rem',
    borderRadius: '999px',
    width: 'fit-content',
    maxWidth: '100%',
    overflowX: 'auto',
  } as React.CSSProperties,
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '0.55rem 1.1rem',
    cursor: 'pointer',
    borderRadius: '999px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  tabActive: {
    color: 'white',
    background: 'var(--primary)',
  } as React.CSSProperties,
  section: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
  } as React.CSSProperties,
  alert: {
    background: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  } as React.CSSProperties,
  formSmall: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  input: {
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  btn: {
    padding: '0.75rem 1.5rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  } as React.CSSProperties,
  linkBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    background: 'var(--success)',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
  } as React.CSSProperties,
  item: {
    background: 'var(--bg-secondary)',
    padding: '1rem 1.1rem',
    borderRadius: '10px',
    marginBottom: '0.75rem',
    borderLeft: '3px solid var(--primary)',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
  badgeSuccess: {
    background: 'rgba(16, 185, 129, 0.14)',
    color: 'var(--success)',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
  } as React.CSSProperties,
  badgeWarning: {
    background: 'rgba(245, 158, 11, 0.14)',
    color: 'var(--warning)',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
  } as React.CSSProperties,
}
