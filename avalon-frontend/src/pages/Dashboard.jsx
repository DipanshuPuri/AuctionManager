import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ---------------------------------------------------------------------------
// Dashboard Page – Avalon Frontend
// ---------------------------------------------------------------------------

// Expanded Mock Data with realistic (deflated) pricing
const MOCK_HISTORY = [
  { id: 1, name: 'Vintage 1968 Chronograph', description: 'Rare blue dial variant, original patina', seller: 'Horology Masters', amount: '$4,250', date: 'Oct 12, 2026', image: '/item_watch_history.png' },
  { id: 2, name: '1974 Classic Custom 911', description: 'Restored to original factory specifications', seller: 'Euro Imports', amount: '$18,500', date: 'Sep 28, 2026', image: '/item_porsche_history.png' },
  { id: 10, name: 'Mechanical Skeleton Watch', description: 'Hand-wound, 42h power reserve', seller: 'Swiss Precision', amount: '$2,100', date: 'Sep 15, 2026', image: '/item_skeleton.png' },
  { id: 11, name: 'Abstract Oil Canvas', description: 'Original 21st-century contemporary piece', seller: 'Vogue Gallery', amount: '$3,800', date: 'Aug 30, 2026', image: '/item_abstract.png' },
  { id: 12, name: 'Refurbished Leica M3', description: 'Dual stroke, recently CLA serviced', seller: 'Optics Hub', amount: '$2,450', date: 'Aug 12, 2026', image: '/item_leica.png' },
  { id: 13, name: 'Bauhaus Desk Lamp', description: 'Original 1930s design, rewired', seller: 'MidCentury', amount: '$850', date: 'Jul 22, 2026', image: '/item_lamp.png' },
];

const MOCK_MARKET = [
  { 
    id: 3, 
    name: 'Patek Celestial', 
    description: 'Grand Complication mapping the northern hemisphere sky chart.', 
    badge: '🔥 HOT', 
    time: 'Ending in 2m 14s', 
    bid: '$11,200', 
    bids: 24,
    increment: '$250',
    condition: 'Mint / Box & Papers',
    image: '/item_patek_market.png' 
  },
  { 
    id: 4, 
    name: 'Porsche 356 Speedster', 
    description: 'Barn find, original patina, matching numbers and body panels.', 
    badge: '⏳ RARE', 
    time: 'Accepting Bids', 
    bid: '$28,500', 
    bids: 18,
    increment: '$1,000',
    condition: 'Restoration Project',
    image: '/item_porsche_356.png' 
  },
  { 
    id: 5, 
    name: 'Navitimer 806', 
    description: 'Early 1960s pilot chronograph with bead bezel.', 
    badge: '🔥 HOT', 
    time: 'Ending in 14m', 
    bid: '$6,800', 
    bids: 31,
    increment: '$100',
    condition: 'Excellent / Recently Serviced',
    image: '/item_navitimer_806.png' 
  },
];

const MOCK_ACTIVE_BIDS = [
  { 
    id: 6, 
    name: '1965 Shelby Cobra Prototype', 
    status: 'You are High Bidder', 
    currentBid: '$12,500', 
    yourBid: '$12,500', 
    time: '4h 12m left', 
    image: '/item_porsche_history.png' 
  },
  { 
    id: 7, 
    name: 'Original 1st Print Spider-Man', 
    status: 'Outbid', 
    currentBid: '$3,200', 
    yourBid: '$2,800', 
    time: '1h 05m left', 
    image: '/item_abstract.png' 
  },
  { 
    id: 8, 
    name: 'Custom Mechanical Chronograph', 
    status: 'You are High Bidder', 
    currentBid: '$850', 
    yourBid: '$850', 
    time: '12m left', 
    image: '/item_watch_history.png' 
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        
        {/* 1. Profile Banner (Enhanced) */}
        <div className="profile-banner fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="profile-banner-inner">
            <img src="/avatar_mock.png" alt="Profile" className="profile-img" />
            <div className="profile-info">
              <h1 className="profile-name">{user.username || 'Jon Smith'}</h1>
              <span className="profile-role">
                {user.role === 'seller' ? '🏷️ Verified Seller' : '🛒 Premium Buyer'}
              </span>
              
              <div className="profile-grid-info">
                <div className="info-item">
                  <span className="info-label">Account Tier</span>
                  <span className="info-value">Gold Membership</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Status</span>
                  <span className="info-value text-primary">Verified</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">March 2026</span>
                </div>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <span className="stat-label">Active Bids</span>
                <span className="stat-value">4</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Volume</span>
                <span className="stat-value">$32,250</span>
              </div>
              <button 
                className="btn btn-secondary btn-logout" 
                onClick={handleLogout}
                style={{ marginLeft: '1rem', alignSelf: 'flex-start', borderColor: 'var(--color-border)' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          
          {/* 2. At A Glance (Market Live) - Moved to secondary position */}
          <div className="dashboard-market-section fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="dashboard-section-title">
              <span style={{ fontSize: '1.5rem' }}>🔥</span> At a Glance
            </h2>
            <div className="market-grid">
              {MOCK_MARKET.map((item) => (
                <div key={item.id} className="market-card">
                  <div className="market-img-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className={`market-badge ${item.badge.includes('HOT') ? 'badge-hot' : 'badge-rare'}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="market-info">
                    <h4 className="mb-1" style={{ fontSize: '1.25rem' }}>{item.name}</h4>
                    <p className="text-muted text-xs mb-4" style={{ minHeight: '3em' }}>{item.description}</p>
                    
                    <div className="market-meta-grid">
                      <div className="meta-item">
                        <span>Current Bid</span>
                        <span className="text-primary">{item.bid}</span>
                      </div>
                      <div className="meta-item">
                        <span>Bid Count</span>
                        <span>{item.bids} Bids</span>
                      </div>
                      <div className="meta-item">
                        <span>Bid Increment</span>
                        <span>{item.increment}</span>
                      </div>
                      <div className="meta-item">
                        <span>Condition</span>
                        <span>{item.condition}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex" style={{ justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">{item.time}</span>
                      <button className="btn btn-primary btn-sm">Place Bid</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Active Bids - New Section */}
          <div className="dashboard-active-bids-section fade-in" style={{ animationDelay: '0.25s' }}>
            <h2 className="dashboard-section-title">
              <span style={{ fontSize: '1.5rem' }}>🎯</span> Active Bids
            </h2>
            <div className="ledger-card">
              <div className="history-list">
                {MOCK_ACTIVE_BIDS.map((item) => (
                  <div key={item.id} className="history-row">
                    <img src={item.image} alt={item.name} className="history-img" />
                    <div className="history-details">
                      <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                      <p className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Outbid' ? 'text-error' : 'text-primary'}`} style={{ marginBottom: '0.25rem' }}>
                        {item.status}
                      </p>
                      <p className="text-xs text-muted">Auction ends in {item.time}</p>
                    </div>
                    <div className="history-meta" style={{ textAlign: 'right' }}>
                      <div className="history-amount font-bold" style={{ fontSize: '1.1rem' }}>{item.currentBid}</div>
                      <div className="text-xs text-muted mt-1">Your bid: {item.yourBid}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. History - Moved to bottom */}
          <div className="dashboard-ledger-section fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="dashboard-section-title">
              <span style={{ fontSize: '1.5rem' }}>📜</span> History
            </h2>
            <div className="ledger-card">
              <div className="history-list">
                {MOCK_HISTORY.map((item) => (
                  <div key={item.id} className="history-row">
                    <img src={item.image} alt={item.name} className="history-img" />
                    <div className="history-details">
                      <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                      <p className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>{item.description}</p>
                      <p className="text-xs text-primary">Authenticated transfer with {item.seller}</p>
                    </div>
                    <div className="history-meta" style={{ textAlign: 'right' }}>
                      <div className="history-amount font-bold" style={{ fontSize: '1.1rem' }}>{item.amount}</div>
                      <div className="history-date text-xs text-muted mt-1">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-ghost btn-sm" style={{ textDecoration: 'underline' }}>View Full History</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
