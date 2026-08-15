import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, CheckSquare, User, Bell, Menu, X, LogOut, Factory } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProcessingLayout.css';

const ProcessingLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'DASHBOARD', path: '/processing', icon: <LayoutDashboard size={20} />, end: true }
  ];

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'PU';

  return (
    <div className="processing-layout">
      {/* Sidebar for Desktop */}
      <aside className="processing-sidebar">
        <div className="processing-sidebar-header">
          <Link to="/processing" className="processing-logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="processing-unit-badge">
            <Factory size={12} />
            <span>Processing Unit</span>
          </div>
        </div>
        <nav className="processing-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `processing-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button className="processing-nav-item logout-btn" onClick={handleLogout} style={{ marginTop: 'auto', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>LOGOUT</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="processing-main">
        {/* Top Header */}
        <header className="processing-header">
          <div className="processing-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          
          <div className="processing-header-right">
            <button className="processing-icon-btn">
              <Bell size={20} />
              <span className="processing-badge">3</span>
            </button>
            <div className="processing-user-profile-menu">
              <div className="processing-avatar">
                {initials}
              </div>
              <div className="processing-user-info">
                <span className="processing-name">{user ? user.name : 'Processing Unit'}</span>
                <span className="processing-role">Verified Processing Unit ✓</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="processing-mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="processing-mobile-nav-content" onClick={e => e.stopPropagation()}>
              <div className="processing-mobile-nav-header">
                <Link to="/processing" className="processing-logo" onClick={() => setIsMobileMenuOpen(false)}>
                  WOOL<span>TRACE</span>
                </Link>
                <button className="processing-icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="processing-mobile-nav-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `processing-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
                <button className="processing-nav-item logout-btn" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', marginTop: '20px' }}>
                  <LogOut size={20} />
                  <span>LOGOUT</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="processing-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProcessingLayout;
