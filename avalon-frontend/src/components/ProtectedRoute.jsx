import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// ProtectedRoute – Avalon Frontend
// ---------------------------------------------------------------------------

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark spinner-lg"></div>
        <p>Loading your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div className="fade-in">{children}</div>;
};

export default ProtectedRoute;
