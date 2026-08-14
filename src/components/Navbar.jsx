import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  { label: 'HOME', href: '#' },
  { label: 'FAQS', href: '#faq' },
  { label: 'REVIEWS', href: '#reviews' },
  { label: 'CONTACT US', href: '#contact' }
];

const Navbar = () => {
  return (
    <nav className="navbar">
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
  );
};

export default Navbar;
