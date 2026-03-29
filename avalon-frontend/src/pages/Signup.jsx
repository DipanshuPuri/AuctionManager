import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

// ---------------------------------------------------------------------------
// Signup Page – Avalon Frontend
// ---------------------------------------------------------------------------

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    setLoading(true);

    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const res = err.response?.data;

      if (res?.errors) {
        setFieldErrors(res.errors);
      } else {
        setError(res?.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field) =>
    fieldErrors.find((e) => e.field === field)?.message;

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Header */}
        <div className="text-center mb-5 fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem', color: 'var(--color-primary)' }}>🏛️ Avalon</h1>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '1.5rem' }}>Create Account</h2>
        </div>

        {/* Success message */}
        {success && (
          <div className="alert alert-success">
            ✅ Account created! Redirecting to login...
          </div>
        )}

        {/* Global error */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            {/* Name */}
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={getFieldError('name') ? 'input-error' : ''}
                disabled={loading || success}
                required
              />
              {getFieldError('name') && (
                <span className="error-text">{getFieldError('name')}</span>
              )}
            </div>

            {/* Username */}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="johndoe123"
                value={formData.username}
                onChange={handleChange}
                className={getFieldError('username') ? 'input-error' : ''}
                disabled={loading || success}
                required
              />
              {getFieldError('username') && (
                <span className="error-text">{getFieldError('username')}</span>
              )}
            </div>

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
                className={getFieldError('email') ? 'input-error' : ''}
                disabled={loading || success}
                required
              />
              {getFieldError('email') && (
                <span className="error-text">{getFieldError('email')}</span>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={getFieldError('password') ? 'input-error' : ''}
                disabled={loading || success}
                required
              />
              {getFieldError('password') && (
                <span className="error-text">{getFieldError('password')}</span>
              )}
            </div>

            {/* Role */}
            <div className="input-group">
              <label htmlFor="role">I want to</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading || success}
              >
                <option value="buyer">Buy items</option>
                <option value="seller">Sell items</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg fade-in"
            style={{ animationDelay: '0.3s', marginTop: '1rem' }}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : success ? (
              '✓ Account Created'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer fade-in" style={{ animationDelay: '0.4s' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
