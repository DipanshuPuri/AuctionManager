import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Login Page – Avalon Frontend
// ---------------------------------------------------------------------------

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      const res = err.response?.data;
      setError(res?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Header */}
        <div className="text-center mb-5 fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem', color: 'var(--color-primary)' }}>🏛️ Avalon</h1>
          <h2 style={{ fontSize: 'var(--font-size-3xl)' }}>Welcome Back</h2>
          <p className="subtitle" style={{ margin: '0' }}>Log in to your account</p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg fade-in"
            style={{ animationDelay: '0.4s', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer fade-in" style={{ animationDelay: '0.5s' }}>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
