import React, { useEffect, useMemo, useState } from 'react';
import {
  Sprout, ShieldCheck, Store, Truck, Warehouse, Cog,
  CheckCircle2, Clock, MapPin, User, QrCode
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { qaService } from '../services/qa/qaService';
import { buildWoolProvenanceEvents, getCurrentStageFromEvents } from '../services/traceability/woolProvenanceService';
import './TraceabilityTimeline.css';

const STAGES = [
  { id: 'FARM', label: 'Farm', icon: Sprout },
  { id: 'QUALITY', label: 'Quality', icon: ShieldCheck },
  { id: 'MARKET', label: 'Market', icon: Store },
  { id: 'TRANSPORT', label: 'Transport', icon: Truck },
  { id: 'WAREHOUSE', label: 'Warehouse', icon: Warehouse },
  { id: 'PROCESSING', label: 'Processing', icon: Cog },
  { id: 'DELIVERED', label: 'Delivery', icon: CheckCircle2 },
];

const isWoolBatch = (batch = {}) => (
  batch.cropId === 'WOOL' ||
  /wool|fleece/i.test(`${batch.cropName || ''} ${batch.woolType || ''} ${batch.variety || ''}`)
);

const getBatchKey = (batch = {}) => batch.batchId || batch.id;

const getStorageLocationText = (storageLocation) => {
  if (!storageLocation) return null;
  if (typeof storageLocation === 'string') return storageLocation;
  return [
    storageLocation.zone ? `Zone ${storageLocation.zone}` : null,
    storageLocation.rack ? `Rack ${storageLocation.rack}` : null,
    storageLocation.section ? `Sec ${storageLocation.section}` : null,
    storageLocation.position ? `Pos ${storageLocation.position}` : null
  ].filter(Boolean).join(' - ');
};

export default function TraceabilityTimeline({ batchId, hideEvents = false, onShowQR, publicView = false, batchOverride = null }) {
  const {
    batches, certificates, listings, orders, transportJobs,
    warehouseBookings, processingRecords, processingRequests,
    woolLots, marketOffers, marketTransactions, transactions
  } = useGlobalState();
  const [qaRequests, setQaRequests] = useState([]);
  const [backendCertificate, setBackendCertificate] = useState(null);

  const batch = batchOverride || batches.find(b => b.id === batchId || b.batchId === batchId);
  const batchKey = getBatchKey(batch) || batchId;
  const woolBatch = isWoolBatch(batch);

  useEffect(() => {
    let isMounted = true;
    if (!batchKey || !woolBatch) {
      setQaRequests([]);
      setBackendCertificate(null);
      return () => {
        isMounted = false;
      };
    }

    Promise.all([
      qaService.getRequests({ batchId: batchKey }),
      qaService.getCertificateByBatch(batchKey)
    ])
      .then(([requests, certificate]) => {
        if (!isMounted) return;
        setQaRequests(Array.isArray(requests) ? requests : []);
        setBackendCertificate(certificate || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setQaRequests([]);
        setBackendCertificate(null);
      });

    return () => {
      isMounted = false;
    };
  }, [batchKey, woolBatch]);

  const events = useMemo(() => buildWoolProvenanceEvents({
    batch,
    certificates: backendCertificate ? [backendCertificate, ...(certificates || [])] : certificates,
    qaRequests,
    woolLots,
    listings,
    orders,
    transportJobs,
    warehouseBookings,
    processingRecords,
    processingRequests,
    marketOffers,
    marketTransactions,
    transactions,
    publicView
  }), [
    batch,
    backendCertificate,
    certificates,
    qaRequests,
    woolLots,
    listings,
    orders,
    transportJobs,
    warehouseBookings,
    processingRecords,
    processingRequests,
    marketOffers,
    marketTransactions,
    transactions,
    publicView
  ]);

  if (!batch) return null;

  const currentStage = woolBatch ? getCurrentStageFromEvents(events) : (batch.currentStage || 'FARM');
  const completedStages = new Set(events.map(event => event.stage).filter(Boolean));
  const storageLocationText = getStorageLocationText(batch.storageLocation);

  const getStageStatus = (stageId) => {
    if (!completedStages.has(stageId)) return 'upcoming';
    return stageId === currentStage ? 'current' : 'completed';
  };

  const processingRequest = (processingRequests || []).find(r => r.batchId === batchKey);
  const batchProcessingRecords = (processingRecords || []).filter(r => r.batchId === batchKey);
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

  return (
    <div className="trace-card">
      <div className="trace-card-header">
        <div>
          <span className="trace-eyebrow">Traceability chain</span>
          <h3>Batch journey</h3>
        </div>
        <div className="trace-header-actions">
          <div className="trace-current-stage">{currentStage}</div>
          {onShowQR && (
            <button onClick={onShowQR} className="trace-qr-button">
              <QrCode size={14} /> Batch QR
            </button>
          )}
        </div>
      </div>

      <div className="trace-stage-list">
        {STAGES.map((s) => {
          const status = getStageStatus(s.id);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={s.id} className={`trace-stage ${status}`}>
              <div className="trace-stage-marker">{isCompleted ? <CheckCircle2 size={15} /> : <span />}</div>
              <div className="trace-stage-copy">
                <span>{s.label}</span>
                <small>{isCompleted ? 'Completed' : isCurrent ? 'Current stage' : 'Pending'}</small>
              </div>
              {isCurrent && <span className="trace-current-label">Now</span>}
            </div>
          );
        })}
      </div>

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
                {batch.currentLocation || 'Certified Agri Storage Centre'}
              </div>
            </div>
          </div>
          {storageLocationText && (
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
              <span>{storageLocationText}</span>
            </div>
          )}
        </div>
      )}

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

      {!hideEvents && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0B120D' }}>
              Trace Event History ({events.length})
            </h4>
            <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
              {publicView ? 'Public Provenance' : 'Immutable Ledger'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {events.map((evt, idx) => (
              <div key={evt.id || idx} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: idx === events.length - 1 ? '#0B120D' : '#BED5E5',
                    marginTop: '6px',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 0 2px rgba(11, 18, 13, 0.2)'
                  }} />
                  {idx < events.length - 1 && (
                    <div style={{ width: '2px', flex: 1, minHeight: '44px', backgroundColor: 'rgba(11, 18, 13, 0.12)' }} />
                  )}
                </div>

                <div style={{ paddingBottom: '20px', flex: 1 }}>
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
                      {evt.status && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="#0B120D" /> {evt.status}
                        </span>
                      )}
                      {evt.metadata?.certificateId && (
                        <a
                          href={`/verify/${evt.metadata.certificateId}`}
                          style={{ color: '#0B120D', fontWeight: '700', textDecoration: 'underline' }}
                        >
                          Certificate {evt.metadata.certificateId}
                        </a>
                      )}
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
