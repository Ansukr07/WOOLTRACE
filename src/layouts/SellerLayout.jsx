import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserRoleDropdown from '../components/UserRoleDropdown';
import './SellerLayout.css';

const SellerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/buyer', icon: <Home size={20} /> },
    { name: 'Produce marketplace', path: '/buyer/marketplace', icon: <Store size={20} /> },
    { name: 'Offers & negotiations', path: '/buyer/bids', icon: <Gavel size={20} /> },
    { name: 'Orders', path: '/buyer/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Payments', path: '/buyer/payments', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="seller-layout">
      {/* Sidebar for Desktop */}
      <aside className="seller-sidebar">
        <div className="sidebar-header">
          <Link to="/buyer" className="logo">
            KHET<span>SETU</span>
          </Link>
          <div className="role-badge">Verified buyer workspace</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/buyer'}
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
            <button className="nav-item logout-btn" onClick={logout} style={{border: 'none', background: 'none', width: '100%', textAlign: 'left', color: '#DC2626'}}>
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
          
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">5</span>
            </button>
            <UserRoleDropdown />
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/buyer" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                  KHET<span>SETU</span>
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
                    end={item.path === '/buyer'}
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
