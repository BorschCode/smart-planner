import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>Smart Tracker</h2>

      <nav style={styles.nav}>
        <NavLink to="/habits" style={navStyle}>
          Habits
        </NavLink>

        <NavLink to="/profile" style={navStyle}>
          Profile
        </NavLink>
      </nav>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </aside>
  );
}

const navStyle = ({ isActive }) => ({
  padding: '10px 12px',
  textDecoration: 'none',
  color: isActive ? '#2563eb' : '#374151',
  fontWeight: isActive ? 600 : 400,
});

const styles = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    padding: 16,
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    marginBottom: 24,
    fontSize: 18,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flexGrow: 1,
  },
  logout: {
    marginTop: 'auto',
    padding: 10,
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};
