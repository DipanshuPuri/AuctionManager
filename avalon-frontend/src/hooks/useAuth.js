import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// useAuth Hook – Avalon Frontend
// ---------------------------------------------------------------------------
// Convenience wrapper around AuthContext.
//
// Usage:
//   const { user, loading, saveUser, logout } = useAuth();
// ---------------------------------------------------------------------------

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  return context;
};

export default useAuth;
