import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { createAuction } from '../services/auctionService';

// ---------------------------------------------------------------------------
// Create Auction Page – Avalon Frontend
// ---------------------------------------------------------------------------

const CreateAuction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starting_price: '',
    end_time: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('starting_price', formData.starting_price);
      if (formData.end_time) {
        data.append('end_time', new Date(formData.end_time).toISOString());
      }
      if (image) {
        data.append('image', image);
      }

      await createAuction(data);
      setSuccess(true);
      setTimeout(() => navigate('/auctions'), 1500);
    } catch (err) {
      const res = err.response?.data;
      setError(res?.message || 'Failed to create auction.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in">
          <h2>Access Denied</h2>
          <p className="text-muted">Only sellers can create auctions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ paddingTop: '6rem' }}>
      <div className="auth-card auth-card-wide fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Header */}
        <div className="text-center mb-5 fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem', color: 'var(--color-primary)' }}>🏛️ Avalon</h1>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Create Auction</h2>
          <p className="text-muted">List your item for the world to bid on</p>
        </div>

        {/* Success */}
        {success && (
          <div className="alert alert-success">✅ Auction created! Redirecting...</div>
        )}

        {/* Error */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            {/* Title */}
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="title">Auction Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Vintage 1968 Chronograph"
                value={formData.title}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>

            {/* Description */}
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading || success}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Starting Price */}
            <div className="input-group">
              <label htmlFor="starting_price">Starting Price ($)</label>
              <input
                id="starting_price"
                type="number"
                name="starting_price"
                placeholder="100.00"
                step="0.01"
                min="0.01"
                value={formData.starting_price}
                onChange={handleChange}
                disabled={loading || success}
                required
              />
            </div>

            {/* End Time */}
            <div className="input-group">
              <label htmlFor="end_time">End Time (optional)</label>
              <input
                id="end_time"
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                disabled={loading || success}
              />
            </div>

            {/* Image Upload */}
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Auction Image</label>
              {imagePreview ? (
                <div style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1rem',
                }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById('image-input').click()}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: '12px',
                    padding: '3rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</p>
                  <p className="text-muted text-sm">Click to upload an image</p>
                  <p className="text-muted text-xs">JPEG, PNG, WebP, GIF • Max 5MB</p>
                </div>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={loading || success}
              />
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
                Creating auction...
              </>
            ) : success ? (
              '✓ Auction Created'
            ) : (
              '🏛️ Create Auction'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
