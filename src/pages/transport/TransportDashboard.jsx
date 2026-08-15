import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { Truck, CheckCircle, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransportDashboard = () => {
  const { user, logout, switchRole } = useAuth();
  const { transportJobs, updateTransport } = useGlobalState();
  const navigate = useNavigate();

  const handleUpdateStatus = (jobId, newStatus) => {
    updateTransport(jobId, { status: newStatus });
  };

  return (
    <div style={{padding: '32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
            Transport Dashboard
          </h1>
          <p style={{color: '#666', fontSize: '16px'}}>Manage active logistics and delivery requests.</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn-secondary" onClick={() => { switchRole('FARMER'); navigate('/farmer'); }}>Switch Role</button>
          <button className="btn-secondary" onClick={() => { logout(); }}>Logout</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        {transportJobs.map(job => (
          <div key={job.id} style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0B120D'}}>
                <Truck size={20} color="#16A34A" /> {job.id}
              </div>
              <div style={{fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: job.status === 'Delivered' ? '#DCFCE7' : '#FEE2E2', color: job.status === 'Delivered' ? '#16A34A' : '#DC2626'}}>
                {job.status}
              </div>
            </div>

            <div style={{marginBottom: '16px', color: '#666', fontSize: '14px'}}>
              <div style={{marginBottom: '4px'}}><strong>Order ID:</strong> {job.orderId}</div>
              <div style={{marginBottom: '4px'}}><strong>Requested By:</strong> {job.requesterName}</div>
              <div style={{marginBottom: '4px'}}><strong>Pickup:</strong> {job.pickup}</div>
              <div><strong>Dropoff:</strong> {job.dropoff}</div>
            </div>

            <div style={{display: 'flex', gap: '8px'}}>
              {job.status === 'Pending' && (
                <button onClick={() => handleUpdateStatus(job.id, 'In Transit')} className="btn-primary w-100" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                  <Navigation size={16} /> Start Transit
                </button>
              )}
              {job.status === 'In Transit' && (
                <button onClick={() => handleUpdateStatus(job.id, 'Delivered')} className="btn-primary w-100" style={{backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                  <CheckCircle size={16} /> Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}

        {transportJobs.length === 0 && (
          <div style={{padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', gridColumn: '1 / -1'}}>
            <Truck size={48} color="#E5E5E5" style={{marginBottom: '16px'}} />
            <p style={{color: '#666', fontSize: '16px'}}>No active transport jobs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportDashboard;
