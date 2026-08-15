import React from 'react';
import { 
  Sprout, ShieldCheck, Store, Truck, Warehouse, Cog, Shirt, 
  CheckCircle2, Clock, MapPin, User, Calendar, QrCode
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

const STAGES = [
  { id: 'FARM', label: 'Farm', icon: Sprout },
  { id: 'QUALITY', label: 'Quality', icon: ShieldCheck },
  { id: 'MARKET', label: 'Market', icon: Store },
  { id: 'TRANSPORT', label: 'Transport', icon: Truck },
  { id: 'WAREHOUSE', label: 'Warehouse', icon: Warehouse },
  { id: 'PROCESSING', label: 'Processing', icon: Cog },
  { id: 'FABRIC', label: 'Fabric', icon: Shirt },
];

const STAGE_ORDER = ['FARM', 'QUALITY', 'MARKET', 'TRANSPORT', 'WAREHOUSE', 'PROCESSING', 'FABRIC'];

export default function TraceabilityTimeline({ batchId, hideEvents = false, onShowQR }) {
  const { 
    batches, certificates, listings, orders, transportJobs, 
    warehouseBookings, processingRecords, processingRequests 
  } = useGlobalState();
  
  const batch = batches.find(b => b.id === batchId || b.batchId === batchId);
  if (!batch) return null;

  const currentStageIndex = STAGE_ORDER.indexOf(batch.currentStage || 'FARM');

  const getStageStatus = (stageId) => {
    const idx = STAGE_ORDER.indexOf(stageId);
    if (idx < currentStageIndex) return 'completed';
    if (idx === currentStageIndex) return 'current';
    return 'upcoming';
  };

  // Integration with processing records from upstream pull
  const processingRequest = (processingRequests || []).find(r => r.batchId === batchId);
  const batchProcessingRecords = (processingRecords || []).filter(r => r.batchId === batchId);
  const hasCompletedProcessing = batchProcessingRecords.some(r => r.status === 'COMPLETED');

  const getProcessingDesc = () => {
    if (!processingRequest) return 'Not yet sent for processing.';
    if (processingRequest.status === 'COMPLETED' || hasCompletedProcessing) {
      const ops = batchProcessingRecords.filter(r => r.status === 'COMPLETED');
      const lastOp = ops[ops.length - 1];
      return lastOp
        ? ops.map(o => o.operation).join(', ') + ' completed. Output: ' + lastOp.outputQuantity + ' KG.'
        : 'Processed by ' + processingRequest.processingUnitName + '.';
    }
    if (processingRequest.status === 'IN_PROGRESS' || batchProcessingRecords.length > 0) {
      return 'Processing at ' + processingRequest.processingUnitName + '.';
    }
    if (['ACCEPTED', 'RECEIVED'].includes(processingRequest.status)) {
      return 'Accepted by ' + processingRequest.processingUnitName + '.';
    }
    return 'Requested to ' + (processingRequest.processingUnitName || 'processing unit') + '.';
  };

  const events = batch.events || [];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid rgba(11, 18, 13, 0.10)',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      {/* Header with Current Stage Prominence */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(11, 18, 13, 0.08)'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>
            Traceability Chain
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Farm-to-Fabric Journey
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#DDFF86',
            color: '#0B120D',
            padding: '6px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0B120D', animation: 'pulse 1.5s infinite' }}></span>
            Stage: {batch.currentStage || 'FARM'}
          </div>
          {onShowQR && (
            <button
              onClick={onShowQR}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8F8F3',
                border: '1px solid rgba(11, 18, 13, 0.12)',
                color: '#0B120D',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <QrCode size={14} /> Batch QR
            </button>
          )}
        </div>
      </div>

      {/* Visual Farm-to-Fabric Stepper (7 Stages) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        alignItems: 'center',
        margin: '24px 0 28px 0',
        padding: '16px 8px',
        background: '#F8F8F3',
        borderRadius: '12px'
      }}>
        {STAGES.map((s, idx) => {
          const status = getStageStatus(s.id);
          const Icon = s.icon;
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCompleted ? '#0B120D' : isCurrent ? '#DDFF86' : '#FFFFFF',
                color: isCompleted ? '#DDFF86' : isCurrent ? '#0B120D' : '#999',
                border: isCurrent ? '2px solid #0B120D' : isCompleted ? 'none' : '1px dashed #CCC',
                boxShadow: isCurrent ? '0 0 0 4px rgba(221, 255, 134, 0.4)' : 'none',
                fontWeight: '800',
                fontSize: '13px',
                zIndex: 2,
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isCurrent ? '800' : '600',
                color: isCurrent ? '#0B120D' : isCompleted ? '#0B120D' : '#888',
                marginTop: '8px'
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Storage Slot Info Box if in Warehouse */}
      {batch.storageLocation && (
        <div style={{
          background: '#EDEDCE',
          border: '1px solid rgba(11, 18, 13, 0.12)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Warehouse size={18} color="#0B120D" />
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#555' }}>
                Warehouse Storage Allocation
              </span>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0B120D' }}>
                {batch.currentLocation || 'Mysuru Wool Storage Centre'}
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(11, 18, 13, 0.10)',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            <span>Zone: <strong>{batch.storageLocation.zone}</strong></span>
            <span>·</span>
            <span>Rack: <strong>{batch.storageLocation.rack}</strong></span>
            <span>·</span>
            <span>Sec: <strong>{batch.storageLocation.section}</strong></span>
            <span>·</span>
            <span>Pos: <strong>{batch.storageLocation.position}</strong></span>
          </div>
        </div>
      )}

      {/* Processing Integration Summary */}
      {processingRequest && (
        <div style={{
          background: '#F8F8F3',
          border: '1px solid rgba(11, 18, 13, 0.10)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '24px',
          fontSize: '13px'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#666' }}>
            Mill Processing Record
          </span>
          <div style={{ fontWeight: '700', color: '#0B120D', marginTop: '2px' }}>
            {getProcessingDesc()}
          </div>
        </div>
      )}

      {/* Detailed Event History */}
      {!hideEvents && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0B120D' }}>
              Trace Event History ({events.length})
            </h4>
            <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>Immutable Ledger</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {events.slice().reverse().map((evt, idx) => (
              <div key={evt.id || idx} style={{ display: 'flex', gap: '16px' }}>
                {/* Line & Bullet */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#0B120D' : '#BED5E5',
                    marginTop: '6px',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 0 2px rgba(11, 18, 13, 0.2)'
                  }} />
                  {idx < events.length - 1 && (
                    <div style={{ width: '2px', flex: 1, minHeight: '44px', backgroundColor: 'rgba(11, 18, 13, 0.12)' }} />
                  )}
                </div>

                {/* Event Card */}
                <div style={{
                  paddingBottom: '20px',
                  flex: 1
                }}>
                  <div style={{
                    background: '#F8F8F3',
                    border: '1px solid rgba(11, 18, 13, 0.08)',
                    borderRadius: '10px',
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: '#0B120D',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {evt.stage}
                        </span>
                        <strong style={{ fontSize: '14px', color: '#0B120D' }}>{evt.title}</strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                        {evt.timestamp}
                      </span>
                    </div>

                    <p style={{ margin: '6px 0', fontSize: '13px', color: '#333', lineHeight: '1.5' }}>
                      {evt.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#666' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="#0B120D" /> {evt.location}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} color="#0B120D" /> {evt.actor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
