import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';
import { User, Shield, MapPin, Truck } from 'lucide-react';

const TransportProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Simulate fetching profile details
    setTimeout(() => {
      setProfile({
        name: user?.name || 'Transport Partner',
        email: user?.email || 'transport@wooltrace.com',
        phone: user?.mobile || '+91 98765 43210',
        operatingStates: ['Karnataka', 'Tamil Nadu', 'Kerala'],
        rating: 4.8,
        completedDeliveries: 124,
        status: 'Verified Transporter'
      });
      setLoading(false);
    }, 800);
  }, [user]);

  if (loading) return <WoolCloudLoader text="Loading Profile..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D' }}>Transport Profile</h1>
        <p style={{ color: '#666' }}>Manage your account settings and preferences.</p>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '32px', display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#DDFF86', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Truck size={48} color="#0B120D" />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D' }}>{profile?.name}</h2>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
              <Shield size={14} /> {profile?.status}
            </span>
          </div>
          
          <div style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '4px' }}>Email: {profile?.email}</div>
            <div>Phone: {profile?.phone}</div>
          </div>

          <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>RATING</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>⭐ {profile?.rating}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>DELIVERIES</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>{profile?.completedDeliveries}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} /> Service Areas
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {profile?.operatingStates.map(state => (
            <div key={state} style={{ padding: '8px 16px', backgroundColor: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '24px', fontSize: '14px', fontWeight: '600', color: '#0B120D' }}>
              {state}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportProfile;
