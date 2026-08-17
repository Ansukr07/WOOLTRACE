import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import WoolCloudLoader from '../../components/WoolCloudLoader';
import { Wallet, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransportEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch(`/api/transport/dashboard?transporterId=${user?._id || 'demo'}`);
        if (response.ok) {
          const data = await response.json();
          setEarningsData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user]);

  if (loading) return <WoolCloudLoader text="Loading Earnings..." fullScreen={false} />;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D' }}>Transport Earnings</h1>
        <p style={{ color: '#666' }}>Track your revenue and pending settlements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '32px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={24} color="#FFF" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>Total Earnings</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '800' }}>₹{earningsData?.totalEarnings?.toLocaleString() || 0}</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', border: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#666' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={24} color="#D97706" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>Pending Settlement</span>
          </div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: '#0B120D' }}>₹{earningsData?.pendingEarnings?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#0B120D' }}>Recent Transactions</h2>
        <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
          Detailed transaction history will appear here.
        </div>
      </div>
    </div>
  );
};

export default TransportEarnings;
