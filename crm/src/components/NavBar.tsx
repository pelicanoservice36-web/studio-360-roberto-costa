import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.title}>Studio 360 CRM</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/alunos" style={styles.link}>Alunos</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.userEmail}>{user?.email}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sair
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'var(--primary)',
    color: 'white',
    borderBottom: '1px solid var(--border)',
  } as React.CSSProperties,
  brand: {
    flex: 1,
  } as React.CSSProperties,
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  } as React.CSSProperties,
  links: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
    justifyContent: 'center',
  } as React.CSSProperties,
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  userEmail: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
  } as React.CSSProperties,
  logoutBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background 0.2s',
  } as React.CSSProperties,
}
