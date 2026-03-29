import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

// ---------------------------------------------------------------------------
// Auth Context – Avalon Frontend
// ---------------------------------------------------------------------------
// Provides auth state (user, token, loading) and actions (login, logout,
// fetchCurrentUser) to the entire component tree.
//
// Wrap <App /> with <AuthProvider> in main.jsx to enable.
//
// Usage in any component:
//   const { user, token, loading, login, logout } = useAuth();
// ---------------------------------------------------------------------------

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // ---- Fetch current user from API ----
  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data.data);
      return data.data;
    } catch {
      // Token is invalid / expired — clean up
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  // ---- On mount: if token exists, load user profile ----
  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchCurrentUser();
      }
      setLoading(false);
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Login: call API, store token + user ----
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    // authService.login() already saves token to localStorage
    setToken(data.data.token);
    setUser(data.data.user);
    return data;
  };

  // ---- Logout: clear everything ----
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // ---- Context value ----
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
