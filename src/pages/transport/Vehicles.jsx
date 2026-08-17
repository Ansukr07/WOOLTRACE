import React, { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`/api/transport/vehicles?transporterId=${user?._id || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [user]);

  if (loading) return <WoolCloudLoader text="Loading Vehicles..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D' }}>My Vehicles</h1>
          <p style={{ color: '#666' }}>Manage your transport fleet.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#0B120D', color: '#DDFF86', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <Truck size={48} color="#E5E5E5" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#666' }}>No vehicles registered yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {vehicles.map(v => (
            <div key={v._id} style={{ padding: '24px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{v.vehicleNumber}</h3>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>{v.status}</span>
              </div>
              <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Type: {v.vehicleType}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Capacity: {v.capacity} KG</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
