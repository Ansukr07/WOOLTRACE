import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
              <strong>Anznup QA</strong>
              <span>Auth ID: WQI-41</span>
            </div>
          </div>
          <button className="nav-item logout" onClick={() => logout()}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="inspector-main">
        <Outlet />
      </main>
    </div>
  );
};

export default InspectorLayout;
