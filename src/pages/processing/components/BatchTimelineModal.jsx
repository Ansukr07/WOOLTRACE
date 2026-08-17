import React from 'react';
import { X, Clock, ShieldCheck, Factory, Link } from 'lucide-react';

const BatchTimelineModal = ({ batch, onClose }) => {
  if (!batch) return null;

  const timelineSteps = [
    { stage: 'FARM', title: 'Farm Sheared & Registered', location: batch.origin || 'Mysuru, Karnataka', date: '10 Aug 2026', completed: true, actor: batch.farmerName || 'Rajesh Gowda' },
    { stage: 'QUALITY', title: 'Quality Certified (Grade A)', location: 'Karnataka QA Hub', date: '12 Aug 2026', completed: true, certId: 'CERT-KA-2026-00891', score: batch.qualityScore || 87, actor: 'Inspector Suresh Verma' },
    { stage: 'WAREHOUSE', title: 'Warehouse Stored', location: batch.origin || 'Mysuru Warehouse', date: '13 Aug 2026', completed: true, actor: 'Warehouse Operator' },
    { stage: 'TRANSPORT', title: 'Transport Dispatched to Mill', location: 'Transit Route', date: '14 Aug 2026', completed: true, actor: 'Rapid Farm Logistics' },
    { stage: 'PROCESSING', title: 'Received at Processing Unit', location: 'WoolCraft Processing Centre', date: '15 Aug 2026', completed: true, actor: 'Processing Unit Admin' },
    { stage: 'PROCESSING', title: `Processing Operation: ${batch.operation || 'Spinning'}`, location: 'WoolCraft Processing Centre', date: '15 Aug 2026', completed: ['PROCESSING', 'COMPLETED', 'READY_TO_SHIP', 'DISPATCHED', 'DELIVERED'].includes(batch.status), active: batch.status === 'PROCESSING', actor: batch.operatorName || 'Factory Operator' },
    { stage: 'PROCESSING', title: 'Processing Completed & Output Created', location: 'WoolCraft Processing Centre', date: '15 Aug 2026', completed: ['COMPLETED', 'READY_TO_SHIP', 'DISPATCHED', 'DELIVERED'].includes(batch.status), actor: 'Factory Supervisor' },
    { stage: 'OUTGOING', title: 'Ready to Ship / Dispatched', location: batch.destination || 'Bengaluru Textile Unit', date: batch.dispatchedAt || 'Pending Dispatch', completed: ['DISPATCHED', 'DELIVERED'].includes(batch.status), active: batch.status === 'READY_TO_SHIP', actor: 'Transport Freight Partner' },
    { stage: 'DELIVERY', title: 'Delivered to Final Destination', location: batch.destination || 'Bengaluru Textile Unit', date: batch.deliveredAt || 'Pending Delivery', completed: batch.status === 'DELIVERED', actor: 'Destination Recipient' }
  ];

  return (
    <div className="processing-modal-overlay" onClick={onClose}>
      <div 
        className="processing-modal scrollable-timeline-modal" 
        style={{ 
          maxWidth: '880px', 
          width: '92%', 
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ background: '#0F172A', color: 'white', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Factory size={20} className="text-emerald-400" />
            <h3>Batch Operational Traceability & Timeline</h3>
          </div>
          <button className="modal-close-btn" style={{ color: 'white' }} onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body scrollable-modal-body" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 130px)' }}>
          {/* Left Panel: Batch Details & Parent/Child Traceability */}
          <div className="batch-timeline-meta" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="meta-card" style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>BATCH ID</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{batch.batchId}</div>
              
              {batch.parentBatchId && (
                <div style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Link size={12} /> Parent Raw Batch: {batch.parentBatchId}
                </div>
              )}

              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '10px', marginTop: '14px', fontSize: '13px' }}>
                <div>Quantity: <strong>{batch.quantity} KG</strong></div>
                <div>Grade: <strong>{batch.grade || 'A'}</strong></div>
                <div>Wool Type: <strong>{batch.woolType || 'Merino Cross'}</strong></div>
                <div>Status: <strong style={{ color: '#16A34A' }}>{batch.status}</strong></div>
              </div>
            </div>

            {/* Read-Only Quality Certificate Block */}
            <div className="immutable-quality-card" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: '700', fontSize: '13px' }}>
                <ShieldCheck size={16} />
                <span>IMMUTABLE QUALITY CERTIFICATION</span>
              </div>
              <p style={{ fontSize: '12px', color: '#166534', marginTop: '4px', margin: '4px 0 0 0' }}>
                Farmer ownership and original inspector certification records are cryptographically verified and immutable from the Processing Unit side.
              </p>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#14532D', display: 'flex', justifyContent: 'space-between' }}>
                <span>Quality Score: <strong>{batch.qualityScore || 87}/100</strong></span>
                <span>Certified Grade: <strong>Grade A</strong></span>
              </div>
            </div>

            {/* Parent / Child Yield breakdown */}
            <div className="parent-child-box" style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#7E22CE', marginBottom: '6px' }}>
                Parent/Child Processing Output
              </div>
              <div style={{ fontSize: '12px', color: '#581C87', lineHeight: '1.6' }}>
                Source: <strong>WT-KA-2026-00124</strong> (428 KG Raw Wool)<br />
                ↳ Output P01: <strong>WT-KA-2026-00124-P01</strong> (390 KG Processed Wool)<br />
                ↳ Output P02: <strong>WT-KA-2026-00124-P02</strong> (365 KG Fine Yarn)
              </div>
            </div>
          </div>

          {/* Right Panel: Step-by-Step Supply Chain Timeline (Scrollable) */}
          <div className="batch-timeline-steps" style={{ flex: '1 1 300px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', position: 'sticky', top: '0', background: 'white', padding: '4px 0', zIndex: 5 }}>
              <Clock size={16} /> Operational Lifecycle Steps
            </h4>
            
            <div className="timeline-container" style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px dashed #CBD5E1' }}>
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="timeline-item" style={{ marginBottom: '20px', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-31px',
                    top: '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: step.completed ? '#16A34A' : step.active ? '#EA580C' : '#CBD5E1',
                    border: '3px solid white',
                    boxShadow: '0 0 0 2px ' + (step.completed ? '#16A34A' : step.active ? '#EA580C' : '#E2E8F0')
                  }} />

                  <div style={{ fontSize: '13px', fontWeight: '700', color: step.completed ? '#0F172A' : '#64748B' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    📍 {step.location} &bull; 👤 {step.actor}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                    {step.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '14px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 12px 12px', flexShrink: 0 }}>
          <button className="btn-secondary" onClick={onClose}>Close Timeline</button>
        </div>
      </div>
    </div>
  );
};

export default BatchTimelineModal;