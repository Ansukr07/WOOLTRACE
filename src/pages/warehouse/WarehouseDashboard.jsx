import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { Warehouse, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarehouseDashboard = () => {
  const { user, logout, switchRole } = useAuth();
  const { warehouseBookings, updateWarehouse } = useGlobalState();
  const navigate = useNavigate();

  const handleUpdateStatus = (bookingId, newStatus) => {
    updateWarehouse(bookingId, { status: newStatus });
  };

  return (
    <div style={{padding: '32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
            Warehouse Dashboard
          </h1>
          <p style={{color: '#666', fontSize: '16px'}}>Manage storage, deposits, and dispatch.</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn-secondary" onClick={() => { switchRole('FARMER'); navigate('/farmer'); }}>Switch Role</button>
          <button className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        {warehouseBookings.map(booking => (
          <div key={booking.id} style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0B120D'}}>
                <Warehouse size={20} color="#D97706" /> {booking.id}
              </div>
              <div style={{fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: booking.status === 'Stored' ? '#DCFCE7' : '#FEF3C7', color: booking.status === 'Stored' ? '#16A34A' : '#D97706'}}>
                {booking.status}
              </div>
            </div>

            <div style={{marginBottom: '16px', color: '#666', fontSize: '14px'}}>
              <div style={{marginBottom: '4px'}}><strong>Order ID:</strong> {booking.orderId}</div>
              <div style={{marginBottom: '4px'}}><strong>Client Name:</strong> {booking.clientName}</div>
              <div style={{marginBottom: '4px'}}><strong>Duration:</strong> {booking.duration} Days</div>
              <div><strong>Space Required:</strong> {booking.volume} cu.m</div>
            </div>

            <div style={{display: 'flex', gap: '8px'}}>
              {booking.status === 'Pending' && (
                <button onClick={() => handleUpdateStatus(booking.id, 'Stored')} className="btn-primary w-100" style={{backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                  <Package size={16} /> Accept Deposit
                </button>
              )}
              {booking.status === 'Stored' && (
                <button onClick={() => handleUpdateStatus(booking.id, 'Dispatched')} className="btn-primary w-100" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                  <CheckCircle size={16} /> Mark Dispatched
                </button>
              )}
            </div>
          </div>
        ))}

        {warehouseBookings.length === 0 && (
          <div style={{padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', gridColumn: '1 / -1'}}>
            <Warehouse size={48} color="#E5E5E5" style={{marginBottom: '16px'}} />
            <p style={{color: '#666', fontSize: '16px'}}>No active storage bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDashboard;
