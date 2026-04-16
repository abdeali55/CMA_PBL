import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  function handleLogout() {
    logout();
    navigate('/');
  }

  const dashboardPath = user?.role === 'student' ? '/dashboard/student'
    : user?.role === 'alumni' ? '/dashboard/alumni'
    : '/dashboard/admin';

  return (
    <nav className="navbar">
      <Link to={user ? dashboardPath : '/'} className="navbar-brand">
        <div className="logo-icon">🎓</div>
        <span>MentorConnect</span>
      </Link>

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        ) : (
          <>
            <Link to={dashboardPath} className={isActive(dashboardPath)}>Dashboard</Link>
            {user.role === 'student' && (
              <Link to="/find-mentor" className={isActive('/find-mentor')}>Find Mentor</Link>
            )}
            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            <div className="navbar-user">
              <div className="navbar-avatar">{user.name?.[0]}</div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
