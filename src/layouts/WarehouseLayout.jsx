import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, QrCode, Boxes, Inbox, ArrowUpRight, 
  LogOut, RefreshCw, User, Warehouse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGlobalState } from '../context/GlobalStateContext';
import './WarehouseLayout.css';

export default function WarehouseLayout() {
  const { user, logout, switchRole } = useAuth();
  const { warehouseRequests, releaseRequests } = useGlobalState();
  const navigate = useNavigate();

  const pendingStorageCount = warehouseRequests.filter(r => r.status === 'Pending').length;
  const pendingReleaseCount = releaseRequests.filter(r => r.status === 'Pending').length;

  const handleRoleSwitch = () => {
    switchRole('FARMER');
    navigate('/farmer');
  };

  const navItems = [
    { name: 'Dashboard', path: '/warehouse', icon: <LayoutDashboard size={18} />, end: true },
    { name: 'Check-In & Scan', path: '/warehouse/check-in', icon: <QrCode size={18} /> },
    { name: 'Inventory & Slots', path: '/warehouse/inventory', icon: <Boxes size={18} /> },
    { 
      name: 'Storage Requests', 
      path: '/warehouse/requests', 
      icon: <Inbox size={18} />, 
      badge: pendingStorageCount > 0 ? pendingStorageCount : null 
    },
    { 
      name: 'Release Requests', 
      path: '/warehouse/releases', 
      icon: <ArrowUpRight size={18} />, 
      badge: pendingReleaseCount > 0 ? pendingReleaseCount : null 
    },
  ];

  return (
    <div className="warehouse-layout">
      {/* Sidebar */}
      <aside className="warehouse-sidebar">
        <div className="warehouse-sidebar-header">
          <Link to="/warehouse" className="warehouse-logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="warehouse-role-tag">
            Warehouse Operator Portal
          </div>
        </div>

        <nav className="warehouse-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `warehouse-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge && (
                <span style={{
                  background: '#DDFF86',
                  color: '#0B120D',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(11,18,13,0.08)' }}>
            <button
              onClick={handleRoleSwitch}
              className="warehouse-nav-item"
              style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <RefreshCw size={18} />
              <span>Switch to Farmer</span>
            </button>

            <button
              onClick={() => { logout(); }}
              className="warehouse-nav-item"
              style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#DC2626' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="warehouse-main">
        <header className="warehouse-top-header">
          <div className="warehouse-hub-name">
            <Warehouse size={20} color="#0B120D" />
            <span>Mysuru Wool Storage Centre (WH-01)</span>
          </div>

          <div className="warehouse-header-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F8F3', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(11,18,13,0.08)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0B120D', color: '#DDFF86', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                WH
              </div>
              <div style={{ fontSize: '13px' }}>
                <strong>K. Somanna</strong>
                <span style={{ display: 'block', fontSize: '11px', color: '#666' }}>Superintendent</span>
              </div>
            </div>
          </div>
        </header>

        <main className="warehouse-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
