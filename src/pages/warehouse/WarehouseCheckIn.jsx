import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, Search, CheckCircle2, Box, Truck, ShieldCheck, 
  Warehouse, ArrowRight, AlertCircle, Sparkles, MapPin, Check
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WarehouseCheckIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { batches, certificates, transportJobs, warehouseBookings, checkInBatch, assignStorageLocation } = useGlobalState();

  const defaultId = searchParams.get('id') || 'WT-KA-2026-00130';
  const [inputBatchId, setInputBatchId] = useState(defaultId);
  const [activeBatch, setActiveBatch] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Storage Location Assignment State
  const [zone, setZone] = useState('A');
  const [rack, setRack] = useState('R-12');
  const [section, setSection] = useState('04');
  const [position, setPosition] = useState('B');

  useEffect(() => {
    if (inputBatchId) {
      handleLookup(inputBatchId);
    }
  }, [inputBatchId, batches]);

  const handleLookup = (id) => {
    const found = batches.find(b => 
      (b.id || '').toLowerCase() === id.toLowerCase() ||
      (b.batchId || '').toLowerCase() === id.toLowerCase()
    );
    setActiveBatch(found || null);
    setCheckInSuccess(false);
  };

  const handleSimulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setInputBatchId('WT-KA-2026-00130');
      handleLookup('WT-KA-2026-00130');
    }, 800);
  };

  const handleConfirmCheckIn = () => {
    if (!activeBatch) return;

    // Trigger check-in in global state (appends digital trace event and updates stage to WAREHOUSE)
    checkInBatch(activeBatch.id || activeBatch.batchId, 'WH-01', 'K. Somanna');

    // Automatically slot storage location
    assignStorageLocation(activeBatch.id || activeBatch.batchId, {
      zone,
      rack,
      section,
      position
    });

    setCheckInSuccess(true);
  };

  const cert = activeBatch ? certificates.find(c => c.batchId === activeBatch.id || c.batchId === activeBatch.batchId) : null;
  const transport = activeBatch ? transportJobs.find(t => t.batchId === activeBatch.id || t.batchId === activeBatch.batchId) : null;
  const booking = activeBatch ? warehouseBookings.find(w => w.batchId === activeBatch.id || w.batchId === activeBatch.batchId) : null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <QrCode size={28} /> Warehouse Batch Check-In
        </h1>
        <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
          Scan batch QR code or enter Batch ID upon transport delivery to verify and intake wool.
        </p>
      </div>

      {/* QR Scanner & Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(11, 18, 13, 0.10)',
        marginBottom: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder="Enter Batch ID (e.g. WT-KA-2026-00130)..."
              value={inputBatchId}
              onChange={(e) => setInputBatchId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                border: '1px solid rgba(11, 18, 13, 0.15)',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={() => handleLookup(inputBatchId)}
            style={{
              background: '#0B120D',
              color: '#DDFF86',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Lookup Batch
          </button>

          <button
            onClick={handleSimulateQRScan}
            disabled={isScanning}
            style={{
              background: '#EDEDCE',
              border: '1px solid rgba(11, 18, 13, 0.12)',
              color: '#0B120D',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <QrCode size={16} /> {isScanning ? 'Scanning QR...' : 'Simulate Camera QR Scan'}
          </button>
        </div>

        {/* Quick Batch Pill Selection for testing */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#888' }}>
            Quick Select for Demo:
          </span>
          {batches.map(b => (
            <button
              key={b.id || b.batchId}
              onClick={() => {
                setInputBatchId(b.id || b.batchId);
                handleLookup(b.id || b.batchId);
              }}
              style={{
                background: (activeBatch?.id === b.id || activeBatch?.batchId === b.batchId) ? '#0B120D' : '#F8F8F3',
                color: (activeBatch?.id === b.id || activeBatch?.batchId === b.batchId) ? '#DDFF86' : '#0B120D',
                border: '1px solid rgba(11, 18, 13, 0.12)',
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {b.id || b.batchId} ({b.currentStage})
            </button>
          ))}
        </div>
      </div>

      {/* Success View */}
      {checkInSuccess && (
        <div style={{
          background: '#DCFCE7',
          border: '1px solid #16A34A',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
          textAlign: 'center'
        }}>
          <CheckCircle2 size={48} color="#166534" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#166534', margin: '0 0 6px 0' }}>
            Warehouse Check-In Confirmed!
          </h2>
          <p style={{ color: '#166534', fontSize: '15px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
            Batch <strong>{activeBatch?.id || activeBatch?.batchId}</strong> ({activeBatch?.quantity} KG) has been intake-verified and slotted into <strong>Zone {zone} · Rack {rack} · Section {section} · Position {position}</strong>.
            The tracking timeline has automatically advanced: <code>Transport → Warehouse</code>.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate(`/farmer/track?id=${activeBatch?.id || activeBatch?.batchId}`)}
              style={{
                background: '#0B120D',
                color: '#DDFF86',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              View in Farm-to-Fabric Tracker <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/warehouse/inventory')}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(11, 18, 13, 0.2)',
                color: '#0B120D',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              View Warehouse Inventory
            </button>
          </div>
        </div>
      )}

      {/* Batch Details Card for Check-In */}
      {activeBatch && !checkInSuccess && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid rgba(11, 18, 13, 0.10)',
          padding: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EEE', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#777', letterSpacing: '0.08em' }}>
                Batch Intake Verification
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', margin: '4px 0 0 0' }}>
                {activeBatch.id || activeBatch.batchId}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                background: activeBatch.currentStage === 'WAREHOUSE' ? '#DCFCE7' : '#BED5E5',
                color: '#0B120D',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '800'
              }}>
                Stage: {activeBatch.currentStage || 'TRANSPORT'}
              </span>
              <span style={{
                background: '#EDEDCE',
                color: '#0B120D',
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '800'
              }}>
                Grade {activeBatch.qualityGrade || 'A'}
              </span>
            </div>
          </div>

          {/* 7 Required Verification Metadata Attributes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            background: '#F8F8F3',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>1. Batch ID</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B120D' }}>{activeBatch.id || activeBatch.batchId}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>2. Quantity</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B120D' }}>{activeBatch.quantity} KG ({activeBatch.woolType})</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>3. Farmer / Origin</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B120D' }}>{activeBatch.farmerName} ({activeBatch.origin})</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>4. Quality Grade</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#166534' }}>Grade {activeBatch.qualityGrade || 'A'} (Certified)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>5. Certificate Status</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#166534' }}>
                ✓ {cert?.certificateId || 'WTC-QA-2026-00124'} Valid
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>6. Transport Status</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B120D' }}>
                Delivered by Rapid Farm Logistics (KA-09-EA-4412)
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777' }}>7. Storage Booking</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0B120D' }}>
                {booking?.id || 'WB-2026-0042'} (Approved)
              </div>
            </div>
          </div>

          {/* Storage Slotting Assignment Input */}
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D', marginBottom: '14px' }}>
            Assign Physical Storage Slot (Zone / Rack / Section / Position)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Zone</label>
              <select 
                value={zone} 
                onChange={(e) => setZone(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <option value="A">Zone A (Climate)</option>
                <option value="B">Zone B (Standard)</option>
                <option value="C">Zone C (High Density)</option>
                <option value="D">Zone D (Quarantine)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Rack</label>
              <input 
                type="text" 
                value={rack} 
                onChange={(e) => setRack(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Section</label>
              <input 
                type="text" 
                value={section} 
                onChange={(e) => setSection(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '4px' }}>Position</label>
              <select 
                value={position} 
                onChange={(e) => setPosition(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <option value="A">Position A (Top)</option>
                <option value="B">Position B (Middle)</option>
                <option value="C">Position C (Lower)</option>
                <option value="Floor">Floor Pallet</option>
              </select>
            </div>
          </div>

          {/* Check-In CTA */}
          <button
            onClick={handleConfirmCheckIn}
            style={{
              width: '100%',
              background: '#0B120D',
              color: '#DDFF86',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'opacity 0.2s'
            }}
          >
            <Check size={20} /> Confirm Warehouse Check-In
          </button>
        </div>
      )}
    </div>
  );
}
