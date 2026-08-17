import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, ChevronDown, Check, LogOut, Globe, Sparkles, 
  ExternalLink, Warehouse, ShieldCheck, ShoppingCart, Truck, Factory, Sprout, Wallet 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UserRoleDropdown.css';

const ROLES_LIST = [
  {
    role: 'FARMER',
    name: 'Rajesh Gowda',
    email: 'farmer@wooltrace.com',
    label: 'Farmer Portal',
    sub: 'Harvest, shearing & traceability',
    path: '/farmer',
    icon: Sprout,
    badgeColor: '#166534',
    badgeBg: '#DCFCE7'
  },
  {
    role: 'WAREHOUSE',
    name: 'K. Somanna',
    email: 'warehouse@wooltrace.com',
    label: 'Warehouse Partner',
    sub: 'Storage, slotting & QR check-in',
    path: '/warehouse',
    icon: Warehouse,
    badgeColor: '#0B120D',
    badgeBg: '#DDFF86'
  },
  {
    role: 'QUALITY_INSPECTOR',
    name: 'Dr. Anita Desai',
    email: 'inspector@wooltrace.com',
    label: 'Quality Inspector',
    sub: 'Lab testing & grade certificates',
    path: '/inspector',
    icon: ShieldCheck,
    badgeColor: '#0B120D',
    badgeBg: '#BED5E5'
  },
  {
    role: 'SELLER',
    name: 'Himalayan Wool Co.',
    email: 'seller@wooltrace.com',
    label: 'Buyer / Marketplace',
    sub: 'WoolKart bidding & orders',
    path: '/seller',
    icon: ShoppingCart,
    badgeColor: '#0B120D',
    badgeBg: '#EDEDCE'
  },
  {
    role: 'PROCESSING_UNIT',
    name: 'Bikaner Wool Mill',
    email: 'processing@wooltrace.com',
    label: 'Processing Mill',
    sub: 'Scouring, carding & spinning',
    path: '/processing',
    icon: Factory,
    badgeColor: '#1E3A8A',
    badgeBg: '#DBEAFE'
  },
  {
    role: 'TRANSPORT',
    name: 'Rapid Farm Logistics',
    email: 'transport@wooltrace.com',
    label: 'Transport Operator',
    sub: 'Fleet dispatch & GPS tracking',
    path: '/transport',
    icon: Truck,
    badgeColor: '#92400E',
    badgeBg: '#FEF3C7'
  }
];

export default function UserRoleDropdown() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleConfig = ROLES_LIST.find(r => r.role === user?.role) || ROLES_LIST[0];

  const handleRoleSelect = (targetRole) => {
    switchRole(targetRole.role);
    setIsOpen(false);
    navigate(targetRole.path);
  };

  return (
    <div className="user-role-dropdown-container" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button 
        type="button"
        className="profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="avatar-circle" style={{ background: currentRoleConfig.badgeBg, color: currentRoleConfig.badgeColor }}>
          <User size={18} />
        </div>
        <div className="profile-text-wrap">
          <span className="profile-name">{user?.name || currentRoleConfig.name}</span>
          <span className="profile-role-badge" style={{ color: currentRoleConfig.badgeColor }}>
            {currentRoleConfig.label}
          </span>
        </div>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="role-dropdown-menu">
          {/* Header Info */}
          <div className="dropdown-user-header">
            <div className="avatar-large" style={{ background: currentRoleConfig.badgeBg, color: currentRoleConfig.badgeColor }}>
              <User size={24} />
            </div>
            <div>
              <div className="user-title">{user?.name || currentRoleConfig.name}</div>
              <div className="user-email">{user?.email || currentRoleConfig.email}</div>
              <div className="active-pill" style={{ background: currentRoleConfig.badgeBg, color: currentRoleConfig.badgeColor }}>
                ● Active: {currentRoleConfig.label}
              </div>
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Role Switcher Section */}
          <div className="role-section-label">
            <Sparkles size={13} color="#166534" /> Switch Stakeholder Portal:
          </div>

          <div className="roles-list-group">
            {ROLES_LIST.map((r) => {
              const isSelected = (user?.role || 'FARMER') === r.role;
              const Icon = r.icon;

              return (
                <button
                  key={r.role}
                  type="button"
                  className={`role-option-item ${isSelected ? 'active-role' : ''}`}
                  onClick={() => handleRoleSelect(r)}
                >
                  <div className="role-icon-box" style={{ background: r.badgeBg, color: r.badgeColor }}>
                    <Icon size={16} />
                  </div>
                  <div className="role-item-details">
                    <div className="role-item-title">
                      {r.label}
                      {isSelected && <span className="current-indicator">Current</span>}
                    </div>
                    <div className="role-item-sub">{r.sub}</div>
                  </div>
                  {isSelected && <Check size={16} className="check-icon" />}
                </button>
              );
            })}
          </div>

          <div className="dropdown-divider" />

          {/* Quick External Links */}
          <div className="dropdown-footer-actions">
            <button 
              type="button"
              className="footer-link-btn" 
              onClick={() => { setIsOpen(false); navigate('/track/WT-KA-2026-00124'); }}
            >
              <span>Public Passport View</span>
              <ExternalLink size={13} />
            </button>

            <button 
              type="button"
              className="footer-link-btn logout" 
              onClick={() => { setIsOpen(false); logout(); }}
            >
              <span>Logout</span>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
