import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Home (Landing Page) – Avalon Frontend
// ---------------------------------------------------------------------------

const Home = () => {
  // Force scroll to top on mount to prevent browser auto-scroll offset on reload
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ padding: 0 }}>
      {/* =========================================================
          HERO SECTION (Dark)
          ========================================================= */}
      <section className="section section-dark hero-section">
        <div className="container fade-in">
          <h1 className="hero-title">AVALON</h1>
          <p className="hero-subtitle">Real-Time Auction Manager</p>
          <p className="hero-description">
            Discover extraordinary items and bid with confidence. Avalon delivers a premium, 
            low-latency auction environment where every millisecond counts.
          </p>
          <div className="flex-center gap-3 mt-5">
            <Link to="/login" className="btn btn-primary btn-lg">
              Login
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-bg)', borderColor: 'rgba(255,255,255,0.2)' }}>
              View Live Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          PIPELINE / HOW IT WORKS (Light)
          ========================================================= */}
      <section className="section section-light">
        <div className="container text-center" style={{ marginBottom: '4rem' }}>
          <p className="text-sm font-semibold text-muted mb-2" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Actionable Steps
          </p>
          <h2 style={{ fontSize: 'var(--font-size-4xl)', color: 'var(--color-primary)' }}>The Bidding Journey</h2>
          <p className="text-muted mt-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            From registration to ownership. We have streamlined the entire auction experience 
            so you can focus entirely on winning.
          </p>
        </div>

        <div className="container" style={{ position: 'relative' }}>
          <div className="pipeline-track">
            {/* Step 1 */}
            <div className="pipeline-card fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="pipeline-icon-wrapper">🔍</div>
              <h3>Discover</h3>
              <p>Browse curated catalogs of exclusive items. Filter by category, set up watchlists, and prepare your strategy before the auction goes live.</p>
            </div>
            
            <div className="pipeline-arrow fade-in" style={{ animationDelay: '0.2s' }}>&rsaquo;</div>
            
            {/* Step 2 */}
            <div className="pipeline-card fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="pipeline-icon-wrapper">🏦</div>
              <h3>Register</h3>
              <p>Verify your identity to secure a bidding paddle. All participants undergo bank-grade checks to maintain a high-trust environment.</p>
            </div>

            <div className="pipeline-arrow fade-in" style={{ animationDelay: '0.4s' }}>&rsaquo;</div>

            {/* Step 3 */}
            <div className="pipeline-card fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="pipeline-icon-wrapper">⚡</div>
              <h3>Bid Live</h3>
              <p>Experience real-time action. Place competitive bids instantly with our zero-delay WebSocket infrastructure.</p>
            </div>

            <div className="pipeline-arrow fade-in" style={{ animationDelay: '0.6s' }}>&rsaquo;</div>

            {/* Step 4 */}
            <div className="pipeline-card fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="pipeline-icon-wrapper">🏆</div>
              <h3>Claim Victory</h3>
              <p>Win your lot and complete transactions securely via our trusted escrow partners. Track shipping straight to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES / BUILT DIFFERENT (Dark)
          ========================================================= */}
      <section className="section section-dark">
        <div className="container text-center" style={{ marginBottom: '4rem' }}>
          <p className="text-sm font-semibold text-muted mb-2" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            The Avalon Advantage
          </p>
          <h2 style={{ fontSize: 'var(--font-size-4xl)', color: 'var(--color-primary)' }}>Engineered for High-Stakes</h2>
          <p className="text-muted mt-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            When fractions of a second decide the winner, professionals trust Avalon&apos;s robust bidding engine over conventional platforms.
          </p>
        </div>

        <div className="container" style={{ marginTop: '3rem' }}>
          <div className="grid-cols-1 md:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card feature-card fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="icon">🌍</div>
              <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-lg)' }}>Global Market Access</h3>
              <p className="text-sm text-muted">
                Connect directly with high-intent buyers and rare commodities worldwide. Our extensive reach guarantees highly competitive final hammer prices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card feature-card fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="icon">🛡️</div>
              <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-lg)' }}>Bank-Grade Security</h3>
              <p className="text-sm text-muted">
                Every user undergoes verified identity checks. Winning funds are held in cryptographically secure escrows until the physical transfer is validated.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card feature-card fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="icon">⏱️</div>
              <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--font-size-lg)' }}>Sub-Millisecond Execution</h3>
              <p className="text-sm text-muted">
                Our WebSocket microservices guarantee you never miss a bid. Dynamic anti-sniping automatically extends the clock so the fairest price always prevails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA (Light)
          ========================================================= */}
      <section className="section section-light" style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Join the next generation of <br /><span className="text-primary">digital auctions.</span>
          </h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 3rem auto' }}>
            Whether you are liquidating high-value assets or hunting for exclusive items, 
            Avalon is your ultimate real-time arena.
          </p>
          <div className="flex-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-lg" style={{ color: 'var(--color-text)', borderColor: 'var(--color-text)' }}>
              Sign up
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER (Dark)
          ========================================================= */}
      <footer className="footer section-dark">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1 */}
            <div className="footer-brand">
              <h3>🏛️ Avalon</h3>
              <p className="text-sm text-muted mb-4">
                The premier real-time auction platform designed for secure, competitive, 
                and lightning-fast bidding.
              </p>
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>🐦</button>
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>💻</button>
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>🔗</button>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>EXPLORE</p>
              <div className="footer-nav">
                <Link to="#">Browse Catalog</Link>
                <Link to="#">Sell an Item</Link>
                <Link to="#">Live Auctions</Link>
                <Link to="#">Trust & Safety</Link>
                <Link to="#">Support</Link>
              </div>
            </div>

            {/* Col 3: (Removed System Status) */}
            <div></div>
          </div>

          <div className="footer-bottom">
            <div>&copy; 2026 Avalon Auction Manager. All rights reserved.</div>
            <div className="flex gap-4">
              <Link to="#">Terms</Link>
              <Link to="#">Privacy</Link>
              <Link to="#">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
