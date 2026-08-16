import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, MapPin, CheckCircle, Navigation, Camera, Package, Calendar, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const fetchShipment = async () => {
    try {
      const response = await fetch(`/api/transport/shipments?transporterId=${user?._id || 'demo'}`);
      if (response.ok) {
        const data = await response.json();
        const found = data.find(s => s._id === id);
        setShipment(found);
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id, user]);

  const updateStatus = async (newStatus, extraData = {}) => {
    setUpdating(true);
    try {
      const payload = { status: newStatus, timestamp: new Date(), ...extraData };
      const response = await fetch(`/api/transport/shipments/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setShipment(updated);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelivery = () => {
    updateStatus('DELIVERED', {
      proofOfDelivery: {
        notes: deliveryNotes,
        timestamp: new Date()
      }
    });
  };

  if (loading) return <WoolCloudLoader text="Loading Shipment Details..." fullScreen={false} />;
  if (!shipment) return <div style={{ padding: '32px' }}>Shipment not found.</div>;

  const timelineSteps = [
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'ARRIVED', label: 'Arrived at Destination' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const currentStepIndex = timelineSteps.findIndex(s => s.key === shipment.status);
  const isCompleted = (index) => currentStepIndex >= index;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/transport/active')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
        ← Back to Active Shipments
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', marginBottom: '8px' }}>
            Shipment {shipment.shipmentId}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
              {shipment.status.replace('_', ' ')}
            </span>
            <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={14} /> Batch: {shipment.batchId}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tracking Map (Mock) */}
          <div style={{ backgroundColor: '#F8F8F3', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden', height: '300px', position: 'relative' }}>
            {/* Map Placeholder */}
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")', backgroundColor: '#E0E7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
              <MapPin size={48} />
              <p style={{ marginTop: '12px', fontWeight: '700' }}>Planned Route Map</p>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '24px' }}>Shipment Timeline</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {timelineSteps.map((step, index) => {
                const completed = isCompleted(index);
                const isLast = index === timelineSteps.length - 1;
                
                return (
                  <div key={step.key} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: completed ? '#16A34A' : '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {completed ? <CheckCircle size={14} color="#FFF" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFF' }} />}
                      </div>
                      {!isLast && <div style={{ width: '2px', height: '40px', backgroundColor: completed ? '#16A34A' : '#E5E5E5', margin: '4px 0' }} />}
                    </div>
                    <div style={{ paddingTop: '2px', paddingBottom: isLast ? '0' : '32px' }}>
                      <div style={{ fontSize: '14px', fontWeight: completed ? '700' : '500', color: completed ? '#0B120D' : '#9CA3AF' }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column - Actions */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #0B120D', padding: '24px', position: 'sticky', top: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '20px' }}>Update Status</h2>
            
            {shipment.status === 'ACCEPTED' || shipment.status === 'VEHICLE_ASSIGNED' ? (
              <button 
                onClick={() => updateStatus('PICKED_UP')}
                disabled={updating}
                style={{ width: '100%', padding: '16px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Package size={20} /> CONFIRM PICKUP
              </button>
            ) : shipment.status === 'PICKED_UP' ? (
              <button 
                onClick={() => updateStatus('IN_TRANSIT')}
                disabled={updating}
                style={{ width: '100%', padding: '16px', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Navigation size={20} /> START TRANSIT
              </button>
            ) : shipment.status === 'IN_TRANSIT' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => updateStatus('IN_TRANSIT', { location: 'Location Update ' + new Date().toLocaleTimeString() })}
                  disabled={updating}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#F3F4F6', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MapPin size={16} /> Update Location
                </button>
                <button 
                  onClick={() => updateStatus('ARRIVED')}
                  disabled={updating}
                  style={{ width: '100%', padding: '16px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MapPin size={20} /> ARRIVED AT DESTINATION
                </button>
              </div>
            ) : shipment.status === 'ARRIVED' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Delivery Notes (Optional)</label>
                  <textarea 
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="E.g. Left with warehouse manager"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E5E5', minHeight: '80px', fontFamily: 'inherit' }}
                  />
                </div>
                
                <button 
                  onClick={handleDelivery}
                  disabled={updating}
                  style={{ width: '100%', padding: '16px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CheckCircle size={20} /> CONFIRM DELIVERY
                </button>
              </div>
            ) : shipment.status === 'DELIVERED' ? (
              <div style={{ padding: '16px', backgroundColor: '#DCFCE7', borderRadius: '8px', color: '#16A34A', textAlign: 'center', fontWeight: '700' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 8px' }} />
                <div>Delivery Completed Successfully</div>
              </div>
            ) : null}
            
            {/* Quick Contacts */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E5E5E5' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#666', marginBottom: '16px' }}>Quick Contacts</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '10px', backgroundColor: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#0B120D', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Phone size={14} /> Sender
                </button>
                <button style={{ flex: 1, padding: '10px', backgroundColor: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#0B120D', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                  <Phone size={14} /> Receiver
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
