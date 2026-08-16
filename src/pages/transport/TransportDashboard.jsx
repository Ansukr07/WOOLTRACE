import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Package, ArrowRight, Wallet, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const TransportDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeShipments: 0,
    availableRequests: 0,
    completedDeliveries: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/transport/dashboard?transporterId=${user?._id || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchDashboard();
  }, [user]);

  if (loading) return <WoolCloudLoader text="Loading Dashboard..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D' }}>
          Transport Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your wool shipments, deliveries and transport requests.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Active Shipments */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>ACTIVE SHIPMENTS</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#3B82F6" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>{stats.activeShipments}</p>
        </div>

        {/* Available Requests */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>AVAILABLE REQUESTS</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} color="#D97706" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>{stats.availableRequests}</p>
        </div>

        {/* Completed */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>COMPLETED DELIVERIES</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} color="#16A34A" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>{stats.completedDeliveries}</p>
        </div>
        
        {/* Total Earnings */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>TOTAL EARNINGS</h3>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="#9333EA" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>₹{stats.totalEarnings.toLocaleString()}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Pending: ₹{stats.pendingEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Quick Actions */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9FAFB' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D' }}>Quick Actions</h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => navigate('/transport/requests')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={16} color="#3B82F6" />
                </div>
                <span style={{ fontWeight: '600', color: '#0B120D' }}>Find New Loads</span>
              </div>
              <ArrowRight size={16} color="#666" />
            </button>

            <button onClick={() => navigate('/transport/active')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} color="#D97706" />
                </div>
                <span style={{ fontWeight: '600', color: '#0B120D' }}>Manage Active Shipments</span>
              </div>
              <ArrowRight size={16} color="#666" />
            </button>
            
            <button onClick={() => navigate('/transport/vehicles')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} color="#9333EA" />
                </div>
                <span style={{ fontWeight: '600', color: '#0B120D' }}>My Vehicles</span>
              </div>
              <ArrowRight size={16} color="#666" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
