import API from './api';

// ---------------------------------------------------------------------------
// Auth Service – Avalon Frontend
// ---------------------------------------------------------------------------
// All auth-related API calls. login() automatically stores the JWT in
// localStorage so the axios interceptor can attach it to future requests.
// ---------------------------------------------------------------------------

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {Promise} – { success, message, data: { id, name, email, role } }
 */
export const signup = async (data) => {
  const res = await API.post('/auth/signup', data);
  return res.data;
};

/**
 * Authenticate and store JWT token.
 * @param {{ email: string, password: string }} data
 * @returns {Promise} – { success, message, data: { token, user } }
 */
export const login = async (data) => {
  const res = await API.post('/auth/login', data);

  // Persist token so the axios interceptor picks it up automatically
  if (res.data?.data?.token) {
    localStorage.setItem('token', res.data.data.token);
  }

  return res.data;
};

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid token in localStorage.
 * @returns {Promise} – { success, data: { id, name, email, role, ... } }
 */
export const getCurrentUser = async () => {
  const res = await API.get('/auth/me');
  return res.data;
};

/**
 * Log out — clear stored token.
 */
export const logout = () => {
  localStorage.removeItem('token');
};
