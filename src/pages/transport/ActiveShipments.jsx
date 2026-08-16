import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Calendar, ArrowRight, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const ActiveShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(`/api/transport/shipments?transporterId=${user?._id || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          const active = data.filter(s => s.status !== 'DELIVERED' && s.status !== 'CANCELLED');
          setShipments(active);
        }
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipments();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return { bg: '#EFF6FF', text: '#3B82F6' };
      case 'VEHICLE_ASSIGNED': return { bg: '#E0E7FF', text: '#4F46E5' };
      case 'PICKUP_SCHEDULED': return { bg: '#FEF3C7', text: '#D97706' };
      case 'PICKED_UP': return { bg: '#FFEDD5', text: '#EA580C' };
      case 'IN_TRANSIT': return { bg: '#E0F2FE', text: '#0284C7' };
      case 'ARRIVED': return { bg: '#DCFCE7', text: '#16A34A' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ');
  };

  if (loading) return <WoolCloudLoader text="Loading Active Shipments..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D' }}>
            Active Shipments
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Manage your currently active transport jobs and update their statuses.
          </p>
        </div>
      </div>

      {shipments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Activity size={32} color="#9CA3AF" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>NO ACTIVE SHIPMENTS</h3>
          <p style={{ color: '#6B7280' }}>You don't have any ongoing transport jobs right now.</p>
          <button onClick={() => navigate('/transport/requests')} style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Find New Requests
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {shipments.map(shipment => {
            const statusStyle = getStatusColor(shipment.status);
            
            return (
              <div key={shipment._id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => navigate(`/transport/shipment/${shipment._id}`)} className="hover-card">
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D' }}>{shipment.shipmentId}</span>
                      <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px', backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                        {getStatusText(shipment.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Batch: {shipment.batchId}</span>
                      {shipment.orderId && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Order: {shipment.orderId}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#F8F8F3', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>PICKUP</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color="#DC2626" /> View map inside
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9CA3AF' }}>
                    <div style={{ width: '100px', height: '2px', backgroundColor: '#E5E5E5', position: 'relative' }}>
                      <Truck size={14} color="#0B120D" style={{ position: 'absolute', top: '-6px', left: ['ACCEPTED', 'VEHICLE_ASSIGNED', 'PICKUP_SCHEDULED'].includes(shipment.status) ? '10%' : ['PICKED_UP', 'IN_TRANSIT'].includes(shipment.status) ? '50%' : '90%', transform: 'translateX(-50%)' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>DESTINATION</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      View map inside <MapPin size={16} color="#16A34A" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> 
                    Last Updated: {new Date(shipment.updatedAt).toLocaleString()}
                  </div>
                  <button style={{ backgroundColor: '#FFFFFF', color: '#0B120D', border: '1px solid #0B120D', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    MANAGE SHIPMENT <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-card:hover {
          border-color: #0B120D !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}} />
    </div>
  );
};

export default ActiveShipments;
