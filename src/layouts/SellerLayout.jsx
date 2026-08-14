import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Store, 
  List, 
  Package, 
  ShoppingCart, 
  Gavel, 
  Wallet,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Repeat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './SellerLayout.css';

const SellerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'HOME', path: '/seller', icon: <Home size={20} /> },
    { name: 'MARKETPLACE', path: '/seller/market', icon: <Store size={20} /> },
    { name: 'BIDS', path: '/seller/bids', icon: <Gavel size={20} /> },
    { name: 'ORDERS', path: '/seller/orders', icon: <ShoppingCart size={20} /> },
    { name: 'CART', path: '/seller/cart', icon: <Package size={20} /> },
    { name: 'WISHLIST', path: '/seller/wishlist', icon: <List size={20} /> },
    { name: 'WALLET', path: '/seller/wallet', icon: <Wallet size={20} /> },
    { name: 'PROFILE', path: '/seller/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="seller-layout">
      {/* Sidebar for Desktop */}
      <aside className="seller-sidebar">
        <div className="sidebar-header">
          <Link to="/seller" className="logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="role-badge">SELLER / BUYER</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/seller'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.name === 'BIDS' && (
                <span style={{
                  position: 'absolute', right: '16px', background: '#DC2626', color: '#FFF', 
                  fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px'
                }}>4</span>
              )}
            </NavLink>
          ))}
          
          <div style={{marginTop: 'auto', borderTop: '1px solid #E5E5E5', paddingTop: '16px'}}>
            <button 
              className="nav-item action-btn" 
              onClick={() => { switchRole('FARMER'); navigate('/farmer'); }} 
              style={{border: 'none', background: 'none', width: '100%', textAlign: 'left', color: '#666'}}
            >
              <Repeat size={20} />
              <span>Switch to Farmer</span>
            </button>
            <button className="nav-item logout-btn" onClick={handleLogout} style={{border: 'none', background: 'none', width: '100%', textAlign: 'left', color: '#DC2626'}}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="seller-main">
        {/* Top Header */}
        <header className="seller-header">
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">5</span>
            </button>
            <div className="user-profile-menu">
              <div className="avatar">
                <Store size={20} />
              </div>
              <div className="user-info">
                <span className="name">{user?.name || 'Seller'}</span>
                <span className="role">Verified Seller ✓</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/seller" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                  WOOL<span>TRACE</span>
                </Link>
                <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="mobile-nav-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/seller'}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="seller-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
