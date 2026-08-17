import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Leaf, LayoutDashboard, Bell, Menu, X, LogOut, Factory, Truck, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserRoleDropdown from '../components/UserRoleDropdown';
import './ProcessingLayout.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'Incoming Shipment Approaching',
    message: 'Batch WT-KA-2026-00124 (428 KG) is in transit from Mysuru Warehouse. ETA: 42 min.',
    time: '12 mins ago',
    type: 'TRANSPORT',
    icon: <Truck size={16} className="text-orange" />,
    unread: true
  },
  {
    id: 'NOTIF-02',
    title: 'Processing Delay Alert',
    message: 'Batch WT-KA-2026-00121 (Carding) delayed by 2h 40m due to equipment calibration.',
    time: '45 mins ago',
    type: 'DELAY',
    icon: <AlertTriangle size={16} className="text-amber" />,
    unread: true
  },
  {
    id: 'NOTIF-03',
    title: 'Warehouse Release Approved',
    message: 'Storage release approved for 500 KG raw fleece from Mysuru Storage Centre.',
    time: '2 hours ago',
    type: 'WAREHOUSE',
    icon: <Package size={16} className="text-blue" />,
    unread: true
  },
  {
    id: 'NOTIF-04',
    title: 'Outbound Delivery Confirmed',
    message: 'Output batch WT-KA-2026-00098-P02 (380 KG) delivered to Bengaluru Apparel Ltd.',
    time: '4 hours ago',
    type: 'DELIVERY',
    icon: <CheckCircle size={16} className="text-green" />,
    unread: false
  }
];

const ProcessingLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const { logout } = useAuth();
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'DASHBOARD', path: '/processing', icon: <LayoutDashboard size={20} />, end: true },
    { name: 'RESOURCE & SUSTAINABILITY', path: '/processing/sustainability', icon: <Leaf size={20} /> }
  ];

  return (
    <div className="processing-layout">
      {/* Sidebar for Desktop */}
      <aside className="processing-sidebar">
        <div className="processing-sidebar-header">
          <Link to="/processing" className="processing-logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="processing-unit-badge">
            <Factory size={12} />
            <span>Processing Unit</span>
          </div>
        </div>
        <nav className="processing-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `processing-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button className="processing-nav-item logout-btn" onClick={logout} style={{ marginTop: 'auto', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>LOGOUT</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="processing-main">
        {/* Top Header */}
        <header className="processing-header">
          <div className="processing-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
          
          <div className="processing-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Interactive Notification Bell */}
            <div className="notif-wrapper" ref={notifRef}>
              <button 
                className={`processing-icon-btn ${showNotifications ? 'active' : ''}`} 
                onClick={toggleNotifications}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="processing-badge">{unreadCount}</span>}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="notif-popover">
                  <div className="notif-header">
                    <div className="notif-title">
                      <strong>Notifications</strong>
                      {unreadCount > 0 && <span className="unread-pill">{unreadCount} new</span>}
                    </div>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications</div>
                    ) : (
                      notifications.map((item) => (
                        <div 
                          key={item.id} 
                          className={`notif-item ${item.unread ? 'unread' : ''}`}
                          onClick={() => markAsRead(item.id)}
                        >
                          <div className="notif-item-icon">
                            {item.icon}
                          </div>
                          <div className="notif-item-content">
                            <div className="notif-item-title">{item.title}</div>
                            <div className="notif-item-msg">{item.message}</div>
                            <div className="notif-item-time">{item.time}</div>
                          </div>
                          {item.unread && <span className="unread-dot"></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <UserRoleDropdown />
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="processing-mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="processing-mobile-nav-content" onClick={e => e.stopPropagation()}>
              <div className="processing-mobile-nav-header">
                <Link to="/processing" className="processing-logo" onClick={() => setIsMobileMenuOpen(false)}>
                  WOOL<span>TRACE</span>
                </Link>
                <button className="processing-icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="processing-mobile-nav-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `processing-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
                <button className="processing-nav-item logout-btn" onClick={logout} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', marginTop: '20px' }}>
                  <LogOut size={20} />
                  <span>LOGOUT</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="processing-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProcessingLayout;