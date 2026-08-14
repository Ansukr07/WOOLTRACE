import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const navItems = ['HOME', 'MARKET', 'TRACE', 'ABOUT', 'NEWS'];

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li key={item} className={`nav-item ${index === 0 ? 'active' : ''}`}>
            <a href="#" className="nav-link">
              <span className="nav-text-main">{item}</span>
              <span className="nav-text-hover">{item}</span>
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
