import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, ChevronDown, Check, LogOut, Globe,
  Warehouse, ShieldCheck, ShoppingCart, Truck, Sprout, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UserRoleDropdown.css';

const ROLES_LIST = [
  {
    role: 'FARMER',
    name: 'Rajesh Gowda',
    email: 'farmer@khetsetu.in',
    label: 'Farmer & FPO',
    sub: 'Prices, lots, offers and settlements',
    path: '/farmer',
    icon: Sprout,
    badgeColor: '#166534',
    badgeBg: '#DCFCE7'
  },
  {
    role: 'WAREHOUSE',
    name: 'K. Somanna',
    email: 'storage@khetsetu.in',
    label: 'Storage Partner',
    sub: 'Capacity, check-in and releases',
    path: '/storage',
    icon: Warehouse,
    badgeColor: '#0B120D',
    badgeBg: '#DDFF86'
  },
  {
    role: 'QUALITY_INSPECTOR',
    name: 'Dr. Anita Desai',
    email: 'quality@khetsetu.in',
    label: 'Quality Partner',
    sub: 'Grading and quality certificates',
    path: '/quality',
    icon: ShieldCheck,
    badgeColor: '#0B120D',
    badgeBg: '#BED5E5'
  },
  {
    role: 'SELLER',
    name: 'Shree Foods Pvt. Ltd.',
    email: 'buyer@khetsetu.in',
    label: 'Buyer',
    sub: 'Demand, offers and procurement orders',
    path: '/buyer',
    icon: ShoppingCart,
    badgeColor: '#0B120D',
    badgeBg: '#EDEDCE'
  },
  {
    role: 'TRANSPORT',
    name: 'Rapid Farm Logistics',
    email: 'logistics@khetsetu.in',
    label: 'Logistics Partner',
    sub: 'Collection, dispatch and tracking',
    path: '/logistics',
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
            Switch workspace preview
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

          {/* Account actions */}
          <div className="dropdown-footer-actions">
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => { setIsOpen(false); navigate('/settings/notifications'); }}
            >
              <span>Notification settings</span>
              <Bell size={13} />
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
