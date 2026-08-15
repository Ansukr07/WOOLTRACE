import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Warehouse, Boxes, Truck, Inbox, ArrowUpRight, AlertTriangle, 
  CheckCircle2, ArrowRight, Clock, PlusCircle, QrCode
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WarehouseDashboard() {
  const { 
    warehouses, batches, warehouseBookings, warehouseRequests, releaseRequests 
  } = useGlobalState();

  const currentWh = warehouses.find(w => w.id === 'WH-01') || warehouses[0];

  // Batches breakdown
  const incomingBatches = batches.filter(b => b.currentStage === 'TRANSPORT' || b.currentStatus?.includes('In Transit'));
  const storedBatches = batches.filter(b => b.currentStage === 'WAREHOUSE');
  const outgoingBatches = releaseRequests.filter(r => r.status === 'Approved');
  const pendingRequests = warehouseRequests.filter(r => r.status === 'Pending');
  const expiringStorage = warehouseBookings.filter(b => b.status === 'Active');

  const occupiedPercent = Math.round((currentWh.occupiedCapacity / currentWh.totalCapacity) * 100);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', margin: '0 0 6px 0' }}>
            Warehouse Overview
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
            Real-time digital storage tracking, incoming arrivals, and bay capacity.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/warehouse/check-in"
            style={{
              textDecoration: 'none',
              background: '#0B120D',
              color: '#DDFF86',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <QrCode size={16} /> Scan & Check-In Batch
          </Link>
        </div>
      </div>

      {/* ── 5. Total Capacity Metric Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Total Capacity */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '4px' }}>
            Total Capacity
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>
            {currentWh.totalCapacity.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>KG</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
            100% Authorized Capacity (ISO Bay)
          </div>
        </div>

        {/* Occupied */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '4px' }}>
            Occupied
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0B120D' }}>
            {currentWh.occupiedCapacity.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>KG</span>
          </div>
          {/* Progress Bar */}
          <div style={{ height: '6px', width: '100%', background: '#F0F0F0', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${occupiedPercent}%`, height: '100%', background: '#0B120D', borderRadius: '10px' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
            {occupiedPercent}% Utilized
          </div>
        </div>

        {/* Available */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '4px' }}>
            Available Space
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#166534' }}>
            {currentWh.availableCapacity.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: '600', color: '#166534' }}>KG</span>
          </div>
          <div style={{ fontSize: '12px', color: '#166534', marginTop: '6px', fontWeight: '600' }}>
            Ready for immediate intake
          </div>
        </div>
      </div>

      {/* Grid: Stored Batches & Incoming Batches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Currently Stored Batches */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Boxes size={18} /> Stored Batches ({storedBatches.length})
            </h3>
            <Link to="/warehouse/inventory" style={{ fontSize: '12px', fontWeight: '700', color: '#0B120D', textDecoration: 'none' }}>
              View Inventory →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {storedBatches.map(b => (
              <div key={b.id} style={{ background: '#F8F8F3', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0B120D' }}>{b.id}</strong>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {b.quantity} KG · {b.woolType} · Farmer: {b.farmerName}
                  </div>
                </div>
                {b.storageLocation ? (
                  <span style={{ background: '#EDEDCE', color: '#0B120D', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                    Zone {b.storageLocation.zone} · {b.storageLocation.rack}
                  </span>
                ) : (
                  <span style={{ background: '#FFAAA4', color: '#0B120D', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    Unassigned Slot
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Batches (Transport Arriving) */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} /> Incoming Batches ({incomingBatches.length})
            </h3>
            <Link to="/warehouse/check-in" style={{ fontSize: '12px', fontWeight: '700', color: '#0B120D', textDecoration: 'none' }}>
              Check-In Portal →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incomingBatches.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                No batches currently enroute.
              </div>
            ) : (
              incomingBatches.map(b => (
                <div key={b.id} style={{ background: '#BED5E5', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0B120D' }}>{b.id}</strong>
                    <div style={{ fontSize: '12px', color: '#333', marginTop: '2px' }}>
                      {b.quantity} KG · Enroute from {b.origin}
                    </div>
                  </div>
                  <Link
                    to={`/warehouse/check-in?id=${b.id}`}
                    style={{
                      textDecoration: 'none',
                      background: '#0B120D',
                      color: '#DDFF86',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    Check In
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid: Pending Requests & Outgoing/Expiring Batches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Pending Storage Requests */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={18} /> Pending Storage Requests ({pendingRequests.length})
            </h3>
            <Link to="/warehouse/requests" style={{ fontSize: '12px', fontWeight: '700', color: '#0B120D', textDecoration: 'none' }}>
              Manage Requests →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingRequests.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                No pending storage requests.
              </div>
            ) : (
              pendingRequests.map(r => (
                <div key={r.id} style={{ background: '#F8F8F3', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0B120D' }}>{r.batchId}</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {r.quantity} KG · {r.storageDuration} · From {r.farmerName}
                    </div>
                  </div>
                  <Link
                    to="/warehouse/requests"
                    style={{
                      textDecoration: 'none',
                      background: '#0B120D',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring / Outgoing Batches */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid rgba(11, 18, 13, 0.10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Storage Duration & Expiry
            </h3>
            <Link to="/warehouse/releases" style={{ fontSize: '12px', fontWeight: '700', color: '#0B120D', textDecoration: 'none' }}>
              Release Portal →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expiringStorage.map(b => (
              <div key={b.id} style={{ background: '#F8F8F3', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0B120D' }}>{b.batchId}</strong>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Expires: {b.expiryDate || '15 Feb 2027'} · {b.quantity} KG
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '4px 8px', borderRadius: '4px' }}>
                  {b.storageDuration || '6 Months'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
