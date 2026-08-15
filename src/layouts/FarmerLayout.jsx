import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LineChart, 
  Box, 
  Wrench, 
  BookOpen, 
  Bell, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShoppingCart,
  QrCode,
  Warehouse,
  RefreshCw,
  Compass,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './FarmerLayout.css';

const FarmerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleRoleSwitch = (newRole, path) => {
    switchRole(newRole);
    navigate(path);
  };

  const navItems = [
    { name: 'HOME', path: '/farmer', icon: <Home size={18} /> },
    { name: 'TRACK WOOL', path: '/farmer/track', icon: <QrCode size={18} /> },
    { name: 'WAREHOUSES', path: '/farmer/warehouses', icon: <Warehouse size={18} /> },
    { name: 'MY WOOL', path: '/farmer/my-wool', icon: <Box size={18} /> },
    { name: 'MARKET', path: '/farmer/market', icon: <LineChart size={18} /> },
    { name: 'SERVICES', path: '/farmer/services', icon: <Wrench size={18} /> },
    { name: 'WOOLKART', path: '/farmer/woolkart', icon: <ShoppingCart size={18} /> },
    { name: 'LEARN', path: '/farmer/academy', icon: <BookOpen size={18} /> },
    { name: 'WALLET', path: '/farmer/wallet', icon: <Wallet size={18} /> },
  ];

  return (
    <div className="farmer-layout">
      {/* Sidebar for Desktop */}
      <aside className="farmer-sidebar">
        <div className="sidebar-header">
          <Link to="/farmer" className="logo">
            WOOL<span>TRACE</span>
          </Link>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#166534', marginTop: '4px' }}>
            Farmer Portal ✓
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/farmer'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(11,18,13,0.08)' }}>
            <button 
              className="nav-item" 
              onClick={() => handleRoleSwitch('WAREHOUSE', '/warehouse')} 
              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#0B120D' }}
            >
              <RefreshCw size={18} />
              <span>Warehouse Portal</span>
            </button>

            <button 
              className="nav-item logout-btn" 
              onClick={handleLogout} 
              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="farmer-main">
        {/* Top Header */}
        <header className="farmer-header">
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-profile-menu">
              <div className="avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="name">{user ? user.name : 'Rajesh Gowda'}</span>
                <span className="role">Verified Farmer ✓</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/farmer" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
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
                    end={item.path === '/farmer'}
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
        <main className="farmer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
