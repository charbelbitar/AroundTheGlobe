import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/"><span>A</span>roundTheGlobe</Link>

      <nav className="main-nav" aria-label="Primary navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/flights">Flights</NavLink>
        {user?.role === 'user' && (
          <Link to="/bookings">My Bookings</Link>
        )}
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>

      <div className="header-actions">
        {user ? (
          <>
            <span className="welcome">Hi, {user.firstname}</span>
            <button className="link-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="link-button" to="/login">Login</Link>
            <Link className="button button-small" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
