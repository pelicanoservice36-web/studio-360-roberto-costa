import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlunos } from '../../hooks/useAlunos'

export default function AlunosList() {
  const { alunos, loading, deleteAluno } = useAlunos()
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = alunos.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este aluno?')) return
    setDeleting(id)
    try {
      await deleteAluno(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h1>Alunos</h1>
        <Link to="/alunos/novo" style={styles.button}>
          + Novo Aluno
        </Link>
      </div>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando alunos...</p>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState} className="fade-in">
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
          <p style={{ color: 'var(--text-muted)' }}>
            {search ? 'Nenhum aluno encontrado para essa busca.' : 'Nenhum aluno cadastrado ainda.'}
          </p>
        </div>
      ) : (
        <table style={styles.table} className="table-responsive fade-in">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((aluno) => (
              <tr key={aluno.id}>
                <td data-label="Nome"><strong>{aluno.nome}</strong></td>
                <td data-label="Email">{aluno.email || '-'}</td>
                <td data-label="Telefone">{aluno.telefone || '-'}</td>
                <td data-label="Plano">{aluno.plano || '-'}</td>
                <td data-label="Status">
                  <span style={aluno.ativo ? styles.badgeActive : styles.badgeInactive}>
                    {aluno.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td data-label="" style={{ whiteSpace: 'nowrap' }}>
                  <Link to={`/alunos/${aluno.id}`} style={styles.linkBtn}>
                    Ver
                  </Link>
                  <Link to={`/alunos/${aluno.id}/editar`} style={styles.linkBtn}>
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(aluno.id)}
                    disabled={deleting === aluno.id}
                    style={styles.deleteBtn}
                  >
                    {deleting === aluno.id ? 'Deletando...' : 'Deletar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  button: {
    background: 'var(--primary)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    boxShadow: 'var(--shadow-sm)',
  } as React.CSSProperties,
  searchBox: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  searchInput: {
    width: '100%',
    maxWidth: '320px',
    padding: '0.75rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '1rem',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    background: 'var(--bg-secondary)',
    borderRadius: '10px',
    border: '1px dashed var(--border)',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  } as React.CSSProperties,
  badgeActive: {
    background: 'rgba(16, 185, 129, 0.14)',
    color: 'var(--success)',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '700',
  } as React.CSSProperties,
  badgeInactive: {
    background: 'rgba(148, 163, 184, 0.14)',
    color: 'var(--text-muted)',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '700',
  } as React.CSSProperties,
  linkBtn: {
    marginRight: '0.5rem',
    padding: '0.4rem 0.8rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--primary)',
    textDecoration: 'none',
    borderRadius: '999px',
    border: '1px solid var(--primary)',
    cursor: 'pointer',
    display: 'inline-block',
  } as React.CSSProperties,
  deleteBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    background: 'var(--danger)',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    cursor: 'pointer',
  } as React.CSSProperties,
}
