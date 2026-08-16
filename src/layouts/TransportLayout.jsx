import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  List, 
  Truck, 
  History, 
  Wallet,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TransportLayout.css';

const TransportLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'DASHBOARD', path: '/transport', icon: <Home size={20} /> },
    { name: 'REQUESTS', path: '/transport/requests', icon: <List size={20} /> },
    { name: 'ACTIVE', path: '/transport/active', icon: <MapPin size={20} /> },
    { name: 'HISTORY', path: '/transport/history', icon: <History size={20} /> },
    { name: 'VEHICLES', path: '/transport/vehicles', icon: <Truck size={20} /> },
    { name: 'EARNINGS', path: '/transport/earnings', icon: <Wallet size={20} /> },
    { name: 'PROFILE', path: '/transport/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="transport-layout">
      {/* Sidebar for Desktop */}
      <aside className="transport-sidebar">
        <div className="sidebar-header">
          <Link to="/transport" className="logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="role-badge">TRANSPORT</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/transport'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
          
          <div style={{marginTop: 'auto', borderTop: '1px solid #E5E5E5', paddingTop: '16px'}}>
            <button className="nav-item logout-btn" onClick={handleLogout} style={{border: 'none', background: 'none', width: '100%', textAlign: 'left', color: '#DC2626'}}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="transport-main">
        {/* Top Header */}
        <header className="transport-header">
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          
          <div className="header-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile-menu">
              <div className="avatar">
                <Truck size={20} />
              </div>
              <div className="user-info">
                <span className="name">{user?.name || 'Transport Partner'}</span>
                <span className="role">Verified Transporter ✓</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/transport" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
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
                    end={item.path === '/transport'}
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
        <main className="transport-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TransportLayout;
