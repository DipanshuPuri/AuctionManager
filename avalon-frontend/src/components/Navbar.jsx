import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Navbar Component – Avalon Frontend
// ---------------------------------------------------------------------------

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          🏛️ Avalon
        </Link>

        {/* Right side */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/auctions" className="btn btn-ghost btn-sm">
                General Auction
              </Link>
              <Link to="/auctions/live" className="btn btn-ghost btn-sm">
                Live Auction
              </Link>
              <Link to="/settings" className="btn btn-ghost btn-sm">
                Settings
              </Link>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
