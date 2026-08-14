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
  ShoppingCart
} from 'lucide-react';
import './FarmerLayout.css';

const FarmerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('wooltrace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wooltrace_user');
    navigate('/farmer/login');
  };

  const navItems = [
    { name: 'HOME', path: '/farmer', icon: <Home size={20} /> },
    { name: 'MARKET', path: '/farmer/market', icon: <LineChart size={20} /> },
    { name: 'MY WOOL', path: '/farmer/my-wool', icon: <Box size={20} /> },
    { name: 'SERVICES', path: '/farmer/services', icon: <Wrench size={20} /> },
    { name: 'WOOLKART', path: '/farmer/woolkart', icon: <ShoppingCart size={20} /> },
    { name: 'LEARN', path: '/farmer/academy', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="farmer-layout">
      {/* Sidebar for Desktop */}
      <aside className="farmer-sidebar">
        <div className="sidebar-header">
          <Link to="/farmer" className="logo">
            WOOL<span>TRACE</span>
          </Link>
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
          <button className="nav-item logout-btn" onClick={handleLogout} style={{marginTop: 'auto', border: 'none', background: 'none', width: '100%', textAlign: 'left'}}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
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
                <span className="name">{user ? user.name : 'Farmer'}</span>
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
