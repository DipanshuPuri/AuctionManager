import { useState } from 'react';
import useAuth from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Settings Page – Avalon Frontend
// ---------------------------------------------------------------------------

const Settings = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    newsletter: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Settings saved successfully! (Mock)');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!user) return null;

  return (
    <div className="dashboard-page" style={{ paddingTop: '6rem' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem' }}>
            ⚙️ Account Settings
          </h1>
          <p className="text-muted">Manage your profile and preferences</p>
        </div>

        {successMsg && (
          <div className="alert alert-success fade-in" style={{ marginBottom: '1.5rem' }}>
            ✅ {successMsg}
          </div>
        )}

        <div className="auth-card fade-in" style={{ animationDelay: '0.1s', textAlign: 'left', padding: '2rem' }}>
          <form onSubmit={handleSave}>
            
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Profile Information</h3>
            
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled // Usually email changes require extra verification
              />
              <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Email cannot be changed directly.</p>
            </div>

            <div className="input-group">
              <label>Account Role</label>
              <input 
                type="text" 
                value={user.role === 'seller' ? 'Premium Seller' : 'Premium Buyer'} 
                disabled 
              />
            </div>

            <h3 style={{ marginTop: '2.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Preferences</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <input 
                type="checkbox" 
                id="notifications" 
                name="notifications" 
                checked={formData.notifications}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '0.75rem', transform: 'scale(1.2)' }}
              />
              <label htmlFor="notifications" style={{ margin: 0, fontWeight: 'normal' }}>
                Receive email notifications for outbids and auction wins
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <input 
                type="checkbox" 
                id="newsletter" 
                name="newsletter" 
                checked={formData.newsletter}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '0.75rem', transform: 'scale(1.2)' }}
              />
              <label htmlFor="newsletter" style={{ margin: 0, fontWeight: 'normal' }}>
                Subscribe to the Avalon weekly digest
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Save Changes
            </button>
          </form>
        </div>
        
        {/* Danger Zone */}
        <div className="fade-in" style={{ animationDelay: '0.2s', marginTop: '2rem', padding: '2rem', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '12px', background: 'rgba(231, 76, 60, 0.05)' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Danger Zone</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn btn-secondary btn-sm" style={{ borderColor: '#e74c3c', color: '#e74c3c' }} onClick={(e) => { e.preventDefault(); alert('Account deletion is disabled in demo mode.'); }}>
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
