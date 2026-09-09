import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home, LineChart, Target, Building2, PackagePlus, FileText,
  Truck, ShieldCheck, Wallet, MessageSquareWarning,
  Bell, Menu, X, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGlobalState } from '../context/GlobalStateContext';
import UserRoleDropdown from '../components/UserRoleDropdown';
import './FarmerLayout.css';

const FarmerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { marketOffers } = useGlobalState();

  const pendingOffersCount = (marketOffers || []).filter(o => o.status === 'PENDING').length;

  const navItems = [
    { name: 'Overview', path: '/farmer', icon: <Home size={18} /> },
    { name: 'Market intelligence', path: '/farmer/market?tab=overview', icon: <LineChart size={18} /> },
    { name: 'Price & sale timing', path: '/farmer/market?tab=trends', icon: <Target size={18} /> },
    { name: 'Buyer demand', path: '/farmer/market?tab=buyers', icon: <Building2 size={18} /> },
    { name: 'Sell lots & FPO', path: '/farmer/market?tab=lots', icon: <PackagePlus size={18} /> },
    { name: 'Offers & negotiation', path: '/farmer/market?tab=offers', icon: <FileText size={18} />, badge: pendingOffersCount || null },
    { name: 'Trade & payments', path: '/farmer/market?tab=transactions', icon: <Wallet size={18} /> },
    { name: 'Logistics & storage', path: '/farmer/storage', icon: <Truck size={18} /> },
    { name: 'Quality & trust', path: '/farmer/trust', icon: <ShieldCheck size={18} /> },
    { name: 'Disputes', path: '/farmer/market?tab=disputes', icon: <MessageSquareWarning size={18} /> },
  ];
  const isSelected = (item, isActive) => {
    const query = item.path.split('?')[1];
    return query ? location.pathname === '/farmer/market' && location.search.slice(1) === query : isActive;
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar for Desktop */}
      <aside className="farmer-sidebar">
        <div className="sidebar-header">
          <Link to="/farmer" className="logo">
            KHET<span>SETU</span>
          </Link>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#166534', marginTop: '4px' }}>
            Farmer &amp; FPO workspace
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/farmer'}
              className={({ isActive }) => `nav-item ${isSelected(item, isActive) ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.badge && (
                <span style={{
                  marginLeft: 'auto', background: '#DDFF86', color: '#0B120D',
                  fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(11,18,13,0.08)' }}>
            <button 
              className="nav-item logout-btn" 
              onClick={logout} 
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
          <button type="button" className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open farmer navigation">
            <Menu size={24} />
          </button>
          
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <UserRoleDropdown />
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <div className="mobile-nav-content">
              <div className="mobile-nav-header">
                <Link to="/farmer" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
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
                    end={item.path === '/farmer'}
                    className={({ isActive }) => `nav-item ${isSelected(item, isActive) ? 'active' : ''}`}
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
