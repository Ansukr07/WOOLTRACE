import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';
import { Package, MapPin, CheckCircle, Calendar } from 'lucide-react';

const TransportHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/transport/shipments?transporterId=${user?._id || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          // Filter only completed/delivered shipments
          const completed = data.filter(s => s.status === 'DELIVERED');
          setHistory(completed);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <WoolCloudLoader text="Loading Transport History..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D' }}>Transport History</h1>
        <p style={{ color: '#666' }}>View your completed and delivered shipments.</p>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <CheckCircle size={48} color="#E5E5E5" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#666' }}>No completed shipments found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map(shipment => (
            <div key={shipment._id} style={{ padding: '24px', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{shipment.shipmentId}</h3>
                <div style={{ fontSize: '14px', color: '#666', display: 'flex', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Batch: {shipment.batchId}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Delivered: {new Date(shipment.deliveryTime || shipment.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>DELIVERED</span>
                <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '8px', color: '#0B120D' }}>₹{shipment.transportFee || 0}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransportHistory;
