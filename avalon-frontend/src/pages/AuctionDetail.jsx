import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getAuctionById, placeBid, closeAuction } from '../services/auctionService';
import supabase from '../services/supabaseClient';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  const fetchAuction = async () => {
    try {
      const res = await getAuctionById(id);
      setAuction(res.data);
      setBids(res.data.bids || []);
    } catch (err) {
      setError('Auction not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuction(); }, [id]);

  // Supabase realtime subscription for bid_logs
  useEffect(() => {
    if (!supabase || !id) return;
    const channel = supabase
      .channel(`bid_logs_auction_${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bid_logs', filter: `auction_id=eq.${id}` },
        (payload) => {
          const newBid = payload.new;
          setBids((prev) => [{ id: newBid.id, amount: newBid.amount, bidder: { name: 'Live Bidder' }, created_at: newBid.timestamp }, ...prev]);
          setAuction((prev) => prev ? { ...prev, current_price: newBid.amount } : prev);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    setBidding(true);
    try {
      const res = await placeBid({ auction_id: parseInt(id), amount: parseFloat(bidAmount) });
      setBidSuccess('Bid placed successfully!');
      setBidAmount('');
      // Refresh auction data
      await fetchAuction();
    } catch (err) {
      setBidError(err.response?.data?.message || 'Failed to place bid.');
    } finally {
      setBidding(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you sure you want to close this auction?')) return;
    try {
      await closeAuction(id);
      await fetchAuction();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close auction.');
    }
  };

  if (loading) return <div className="auth-page"><div className="spinner spinner-dark spinner-lg"></div></div>;
  if (error) return <div className="auth-page"><div className="auth-card"><h2>Error</h2><p className="text-muted">{error}</p></div></div>;
  if (!auction) return null;

  const isSeller = user && user.id === auction.seller_id;
  const isActive = auction.status === 'active';
  const currentPrice = parseFloat(auction.current_price);

  return (
    <div className="dashboard-page" style={{ paddingTop: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <button onClick={() => navigate('/auctions')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>← Back to Auctions</button>

        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left: Image */}
          <div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              {auction.image_url ? (
                <img src={auction.image_url} alt={auction.title} style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>🏛️</div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: isActive ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.15)', color: isActive ? '#27ae60' : '#e74c3c', textTransform: 'uppercase' }}>{auction.status}</span>
            </div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>{auction.title}</h1>
            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Listed by <strong>{auction.seller?.name || 'Unknown'}</strong></p>
            <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>{auction.description || 'No description provided.'}</p>

            {/* Price Card */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p className="text-muted text-xs" style={{ marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Bid</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>${currentPrice.toLocaleString()}</p>
              <p className="text-muted text-xs" style={{ marginTop: '0.5rem' }}>Starting: ${parseFloat(auction.starting_price).toLocaleString()}</p>
            </div>

            {/* Bid Form (for buyers on active auctions) */}
            {isActive && user && !isSeller && (
              <form onSubmit={handleBid}>
                {bidError && <div className="alert alert-error" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>⚠️ {bidError}</div>}
                {bidSuccess && <div className="alert alert-success" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>✅ {bidSuccess}</div>}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="number" step="0.01" min={currentPrice + 0.01} placeholder={`Min $${(currentPrice + 1).toFixed(2)}`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem' }} required disabled={bidding} />
                  <button type="submit" className="btn btn-primary" disabled={bidding}>{bidding ? 'Placing...' : '⚡ Place Bid'}</button>
                </div>
              </form>
            )}

            {/* Close Auction (for seller) */}
            {isSeller && isActive && (
              <button className="btn btn-secondary btn-block" style={{ marginTop: '1rem', borderColor: '#e74c3c', color: '#e74c3c' }} onClick={handleClose}>🔒 Close Auction</button>
            )}

            {!user && isActive && (
              <p className="text-muted text-sm" style={{ marginTop: '1rem' }}>Please <a href="/login" style={{ color: 'var(--color-primary)' }}>log in</a> to place a bid.</p>
            )}
          </div>
        </div>

        {/* Bid History */}
        <div className="fade-in" style={{ marginTop: '3rem', animationDelay: '0.2s' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>📊 Bid History ({bids.length})</h2>
          {bids.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <p className="text-muted">No bids yet. Be the first!</p>
            </div>
          ) : (
            <div className="ledger-card">
              <div className="history-list">
                {bids.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).map((bid, i) => (
                  <div key={bid.id || i} className="history-row">
                    <div className="history-details">
                      <h4 style={{ marginBottom: '0.25rem' }}>{bid.bidder?.name || bid.bidder?.username || 'Anonymous'}</h4>
                      <p className="text-xs text-muted">{new Date(bid.created_at).toLocaleString()}</p>
                    </div>
                    <div className="history-meta" style={{ textAlign: 'right' }}>
                      <div className="history-amount font-bold" style={{ fontSize: '1.1rem', color: i === 0 ? 'var(--color-primary)' : 'inherit' }}>${parseFloat(bid.amount).toLocaleString()}</div>
                      {i === 0 && <div className="text-xs text-primary">Highest Bid</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
