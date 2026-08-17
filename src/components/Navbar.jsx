import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { label: 'HOME', href: '#' },
  { label: 'FAQS', href: '#faq' },
  { label: 'REVIEWS', href: '#reviews' },
  { label: 'CONTACT US', href: '#contact' }
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* Mobile menu toggle */}
        <button 
          className="navbar-mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(true)}
          style={{ display: 'none' }}
        >
          <Menu size={24} color="#0B120D" />
        </button>

        <ul className="nav-list">
        {navItems.map((item, index) => (
          <li key={item.label} className={`nav-item ${index === 0 ? 'active' : ''}`}>
            <a href={item.href} className="nav-link">
              <span className="nav-text-main">{item.label}</span>
              <span className="nav-text-hover">{item.label}</span>
            </a>
          </li>
        ))}
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            <span className="nav-text-main">LOGIN</span>
            <span className="nav-text-hover">LOGIN</span>
          </Link>
        </li>
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="landing-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="landing-mobile-content" onClick={(e) => e.stopPropagation()}>
            <div className="landing-mobile-header">
              <span className="logo">WOOL<span style={{ color: '#16A34A' }}>TRACE</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', padding: '8px' }}>
                <X size={24} color="#0B120D" />
              </button>
            </div>
            <div className="landing-mobile-links">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="landing-mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <Link to="/login" className="landing-mobile-link highlight-link" onClick={() => setIsMobileMenuOpen(false)}>
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
