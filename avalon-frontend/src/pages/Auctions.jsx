import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getAuctions } from '../services/auctionService';

const Auctions = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const fetchAuctions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAuctions(page, 9, statusFilter);
      setAuctions(res.data.auctions);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to load auctions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuctions(); }, [statusFilter]);

  const badgeStyle = (status) => {
    const map = { active: '#27ae60', closed: '#e74c3c', upcoming: '#3498db' };
    return { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: `${map[status]}22`, color: map[status], textTransform: 'uppercase' };
  };

  return (
    <div className="dashboard-page" style={{ paddingTop: '6rem' }}>
      <div className="container dashboard-container">
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem' }}>🏛️ Auction House</h1>
            <p className="text-muted">Discover extraordinary items and place your bids</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: 'var(--font-size-sm)' }}>
              <option value="">All Auctions</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            {user?.role === 'seller' && <Link to="/auctions/create" className="btn btn-primary btn-sm">+ Create Auction</Link>}
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner spinner-dark spinner-lg"></div><p className="text-muted" style={{ marginTop: '1rem' }}>Loading...</p></div>
        ) : auctions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><p style={{ fontSize: '3rem' }}>🏛️</p><h3>No auctions found</h3></div>
        ) : (
          <>
            <div className="market-grid fade-in">
              {auctions.map((a) => (
                <Link key={a.id} to={`/auctions/${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="market-card" style={{ cursor: 'pointer' }}>
                    <div className="market-img-wrapper">
                      {a.image_url ? <img src={a.image_url} alt={a.title} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', fontSize: '3rem' }}>🏛️</div>}
                      <span style={badgeStyle(a.status)}>{a.status}</span>
                    </div>
                    <div className="market-info">
                      <h4 className="mb-1" style={{ fontSize: '1.1rem' }}>{a.title}</h4>
                      <p className="text-muted text-xs mb-4" style={{ minHeight: '2.5em', overflow: 'hidden' }}>{a.description || 'No description.'}</p>
                      <div className="market-meta-grid">
                        <div className="meta-item"><span>Current Bid</span><span className="text-primary">${parseFloat(a.current_price).toLocaleString()}</span></div>
                        <div className="meta-item"><span>Seller</span><span>{a.seller?.name || 'Unknown'}</span></div>
                      </div>
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', marginTop: '1rem' }}>
                        <span className="btn btn-primary btn-sm" style={{ width: '100%' }}>View Auction →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-secondary'}`} onClick={() => fetchAuctions(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Auctions;
