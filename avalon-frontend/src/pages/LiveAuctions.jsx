import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getAuctions } from '../services/auctionService';

// ---------------------------------------------------------------------------
// Live Auctions Page – Avalon Frontend
// ---------------------------------------------------------------------------

const LiveAuctions = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLiveAuctions = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch only "active" status auctions
      const res = await getAuctions(1, 20, 'active');
      setAuctions(res.data.auctions);
    } catch (err) {
      setError('Failed to load live auctions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAuctions();
    
    // Simulate live polling or you could add Supabase realtime here to refresh list
    const interval = setInterval(() => {
      fetchLiveAuctions();
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page" style={{ paddingTop: '6rem' }}>
      <div className="container dashboard-container">
        {/* Header */}
        <div className="fade-in" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.25rem', color: '#e74c3c' }}>
              🔴 Live Auctions
            </h1>
            <p className="text-muted">Real-time bidding on active items</p>
          </div>
          {user?.role === 'seller' && (
            <Link to="/auctions/create" className="btn btn-primary btn-sm">
              + Create Auction
            </Link>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && auctions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner spinner-dark spinner-lg"></div>
            <p className="text-muted" style={{ marginTop: '1rem' }}>Loading live auctions...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</p>
            <h3>No Live Auctions Right Now</h3>
            <p className="text-muted">Check back later for exciting new items.</p>
          </div>
        ) : (
          <div className="market-grid fade-in" style={{ animationDelay: '0.1s' }}>
            {auctions.map((auction) => (
              <Link
                key={auction.id}
                to={`/auctions/${auction.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="market-card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid rgba(231, 76, 60, 0.3)' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(231, 76, 60, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="market-img-wrapper">
                    {auction.image_url ? (
                      <img src={auction.image_url} alt={auction.title} />
                    ) : (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                        fontSize: '3rem',
                      }}>
                        🏛️
                      </div>
                    )}
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(231, 76, 60, 0.15)',
                      color: '#e74c3c',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      animation: 'pulse 2s infinite',
                    }}>
                      🔴 Live
                    </span>
                  </div>
                  <div className="market-info">
                    <h4 className="mb-1" style={{ fontSize: '1.1rem' }}>{auction.title}</h4>
                    <div className="market-meta-grid" style={{ marginTop: '1rem' }}>
                      <div className="meta-item">
                        <span>Current Bid</span>
                        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>${parseFloat(auction.current_price).toLocaleString()}</span>
                      </div>
                      <div className="meta-item">
                        <span>Seller</span>
                        <span>{auction.seller?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="mt-4" style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)',
                      textAlign: 'center',
                    }}>
                      <span className="btn btn-sm" style={{ width: '100%', background: '#e74c3c', color: '#fff', border: 'none' }}>
                        Join Live Bidding →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAuctions;
