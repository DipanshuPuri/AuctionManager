import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';
import LiveAuctions from './pages/LiveAuctions';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Auction routes (public listing, detail) */}
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auctions/live" element={<LiveAuctions />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/create"
          element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
