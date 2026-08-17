import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Truck, Calendar, Check, X, FileText, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, vehRes] = await Promise.all([
          fetch(`/api/transport/requests`),
          fetch(`/api/transport/vehicles?transporterId=${user?._id || 'demo'}`)
        ]);
        
        if (reqRes.ok) {
          const data = await reqRes.json();
          const found = data.find(r => r._id === id);
          setRequest(found);
        }
        
        if (vehRes.ok) {
          const vehData = await vehRes.json();
          setVehicles(vehData);
          if (vehData.length > 0) setSelectedVehicle(vehData[0]._id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);

  const handleAccept = async () => {
    if (!selectedVehicle && vehicles.length > 0) {
      alert("Please select a vehicle");
      return;
    }
    
    setAccepting(true);
    try {
      const response = await fetch(`/api/transport/requests/${id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transporterId: user?._id || 'demo',
          vehicleId: selectedVehicle || 'V-DEMO-001'
        })
      });
      
      if (response.ok) {
        navigate('/transport/active');
      } else {
        alert('Failed to accept request');
      }
    } catch (error) {
      console.error(error);
      alert('Error accepting request');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <WoolCloudLoader text="Loading Request Details..." fullScreen={false} />;
  if (!request) return <div style={{ padding: '32px' }}>Request not found.</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/transport/requests')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
        ← Back to Requests
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D' }}>
              Transport Request
            </h1>
            <span style={{ fontSize: '14px', fontWeight: '700', padding: '4px 12px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
              {request.requestId}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span><Package size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Batch: {request.batchId}</span>
            <span><FileText size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Order: {request.orderId || 'N/A'}</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <IndianRupee size={20} /> {request.estimatedFee?.toLocaleString() || 'N/A'}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Estimated Transport Fee</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Route Info */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '20px', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px' }}>
              Route Details
            </h2>
            
            <div style={{ display: 'flex', gap: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FEE2E2', border: '4px solid #DC2626' }}></div>
                <div style={{ width: '2px', height: '60px', backgroundColor: '#E5E5E5', margin: '4px 0' }}></div>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#DCFCE7', border: '4px solid #16A34A' }}></div>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>PICKUP LOCATION</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '4px' }}>{request.pickupLocation}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{request.pickupAddress || 'Address will be revealed after acceptance'}</div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>DESTINATION</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '4px' }}>{request.destination}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{request.destinationAddress || 'Address will be revealed after acceptance'}</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #E5E5E5', display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>EST. DISTANCE</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D' }}>{request.estimatedDistance} KM</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>PREFERRED PICKUP</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D' }}>{request.preferredPickupDate ? new Date(request.preferredPickupDate).toLocaleDateString() : 'As soon as possible'}</div>
              </div>
            </div>
          </div>

          {/* Cargo Info */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D', marginBottom: '20px', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px' }}>
              Cargo Details
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>QUANTITY / WEIGHT</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D' }}>{request.quantity} KG</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>WOOL TYPE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0B120D' }}>{request.woolType || 'Fine Wool'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>CERTIFICATION</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> Verified Batch
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #0B120D', padding: '24px', position: 'sticky', top: '24px' }}>
            {showConfirm ? (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', marginBottom: '16px' }}>Confirm Assignment</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  By accepting this request, you agree to transport {request.quantity} KG of wool from {request.pickupLocation} to {request.destination}.
                </p>
                
                {vehicles.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B120D', marginBottom: '8px' }}>Assign Vehicle</label>
                    <select 
                      value={selectedVehicle} 
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E5E5', fontSize: '14px' }}
                    >
                      <option value="">Select a vehicle...</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.capacity} KG capacity)</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div style={{ padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
                    No registered vehicles found. A temporary vehicle profile will be used for this demo.
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={handleAccept}
                    disabled={accepting}
                    style={{ width: '100%', padding: '14px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: accepting ? 'not-allowed' : 'pointer', fontSize: '15px' }}
                  >
                    {accepting ? 'ACCEPTING...' : 'CONFIRM & ACCEPT'}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(false)}
                    style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#666', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', marginBottom: '16px' }}>Accept Job</h3>
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#F8F8F3', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Base Fare</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0B120D' }}>₹{request.estimatedFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Platform Fee</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0B120D' }}>-₹{(request.estimatedFee * 0.05).toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E5E5E5' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#0B120D' }}>Estimated Earnings</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#16A34A' }}>₹{(request.estimatedFee * 0.95).toFixed(0)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowConfirm(true)}
                  style={{ width: '100%', padding: '16px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  ACCEPT REQUEST <Check size={18} />
                </button>
                
                <button 
                  style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', color: '#DC2626', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <X size={16} /> Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon since CheckCircle isn't imported from lucide-react in the top block
const CheckCircle = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default RequestDetail;
