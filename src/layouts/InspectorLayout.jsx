import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserRoleDropdown from '../components/UserRoleDropdown';
import './Inspector.css';

const InspectorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="inspector-layout">
      <aside className="inspector-sidebar">
        <div className="sidebar-brand">
          <ShieldCheck size={24} color="#DDFF86" />
          <span>WoolTrace QA</span>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${location.pathname === '/inspector' ? 'active' : ''}`}
            onClick={() => navigate('/inspector')}
          >
            <ClipboardList size={18} />
            Inspection Requests
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="inspector-profile-mini">
            <div className="avatar">A</div>
            <div>
              <strong>Dr. Anita Desai</strong>
              <span>QA Lead · WQI-41</span>
            </div>
          </div>
          <button className="nav-item logout" onClick={() => logout()}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="inspector-main" style={{ display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '64px',
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(11,18,13,0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 24px'
        }}>
          <UserRoleDropdown />
        </header>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InspectorLayout;
