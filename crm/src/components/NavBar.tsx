import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      {/* Top bar: brand + user, visible on all sizes */}
      <header style={styles.topBar}>
        <div style={styles.topBarInner}>
          <Link to="/" style={styles.brand}>
            <span style={styles.brandMark}>360</span>
            <span style={styles.brandTxt}>Studio&nbsp;360 CRM</span>
          </Link>

          <nav style={styles.linksDesktop} className="navbar-links-desktop">
            <Link to="/" style={navLinkStyle(isActive('/'))}>Dashboard</Link>
            <Link to="/alunos" style={navLinkStyle(isActive('/alunos'))}>Alunos</Link>
          </nav>

          <div style={styles.userDesktop} className="navbar-user-desktop">
            <span style={styles.userEmail}>{user?.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Bottom tab bar: mobile only, app-like navigation */}
      <nav style={styles.bottomBar} className="navbar-bottom-bar">
        <Link to="/" style={tabStyle(isActive('/'))}>
          <span style={styles.tabIcon}>🏠</span>
          <span>Início</span>
        </Link>
        <Link to="/alunos" style={tabStyle(isActive('/alunos'))}>
          <span style={styles.tabIcon}>👥</span>
          <span>Alunos</span>
        </Link>
        <Link to="/alunos/novo" style={tabStyle(isActive('/alunos/novo'))}>
          <span style={styles.tabIcon}>➕</span>
          <span>Novo</span>
        </Link>
        <button onClick={handleLogout} style={{ ...tabStyle(false), background: 'transparent' }}>
          <span style={styles.tabIcon}>🚪</span>
          <span>Sair</span>
        </button>
      </nav>
    </>
  )
}

const navLinkStyle = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--primary-light)' : 'rgba(255,255,255,0.75)',
  textDecoration: 'none',
  fontFamily: 'var(--display)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontWeight: 600,
  fontSize: '0.95rem',
  paddingBottom: '0.3rem',
  borderBottom: active ? '2px solid var(--primary-light)' : '2px solid transparent',
  transition: 'color 0.15s',
})

const tabStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.15rem',
  flex: 1,
  padding: '0.5rem 0',
  color: active ? 'var(--primary-light)' : 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  fontSize: '0.7rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 0,
})

const styles = {
  topBar: {
    background: 'var(--ink)',
    color: 'white',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,
  topBarInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '1rem',
  } as React.CSSProperties,
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: 'white',
    textDecoration: 'none',
  } as React.CSSProperties,
  brandMark: {
    display: 'grid',
    placeItems: 'center',
    width: '2.1rem',
    height: '2.1rem',
    borderRadius: '8px',
    background: 'var(--primary)',
    fontFamily: 'var(--display)',
    fontWeight: 800,
    fontSize: '0.85rem',
    flexShrink: 0,
  } as React.CSSProperties,
  brandTxt: {
    fontFamily: 'var(--display)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    fontSize: '1.05rem',
  } as React.CSSProperties,
  linksDesktop: {
    display: 'flex',
    gap: '1.75rem',
  } as React.CSSProperties,
  userDesktop: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,
  userEmail: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
  } as React.CSSProperties,
  logoutBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
  } as React.CSSProperties,
  bottomBar: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--ink)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom))',
    zIndex: 20,
  } as React.CSSProperties,
  tabIcon: {
    fontSize: '1.2rem',
    lineHeight: 1,
  } as React.CSSProperties,
}
