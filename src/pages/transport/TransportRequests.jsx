import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Calendar, ArrowRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const TransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/transport/requests?status=AVAILABLE');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  if (loading) return <WoolCloudLoader text="Loading Transport Requests..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D' }}>
            Available Requests
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Find and accept new wool transport jobs.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search origin, destination..." 
              style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #E5E5E5', width: '250px' }}
            />
            <Search size={18} color="#999" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Package size={32} color="#9CA3AF" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>NO TRANSPORT REQUESTS</h3>
          <p style={{ color: '#6B7280' }}>There are currently no available transport jobs. Check back later.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map(req => (
            <div key={req._id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => navigate(`/transport/requests/${req._id}`)} className="hover-card">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D' }}>{req.requestId}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
                      {req.quantity} KG
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#F3F4F6', color: '#4B5563' }}>
                      {req.woolType || 'Wool'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={14} /> Batch: {req.batchId}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#16A34A' }}>₹{req.estimatedFee?.toLocaleString() || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Estimated Fee</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#F8F8F3', padding: '16px', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>PICKUP</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#DC2626" /> {req.pickupLocation}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>{req.estimatedDistance} KM</div>
                  <div style={{ width: '100px', height: '2px', backgroundColor: '#E5E5E5', position: 'relative' }}>
                    <Truck size={14} color="#9CA3AF" style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>DESTINATION</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    {req.destination} <MapPin size={16} color="#16A34A" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> 
                  Requested: {new Date(req.createdAt).toLocaleDateString()}
                </div>
                <button style={{ backgroundColor: '#0B120D', color: '#DDFF86', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  VIEW DETAILS <ArrowRight size={16} />
                </button>
              </div>

            </div>
          ))}
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

export default TransportRequests;
