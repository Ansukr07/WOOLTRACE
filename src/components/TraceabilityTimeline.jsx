import React from 'react';
import { Box, ShieldCheck, Store, Truck, Warehouse, CheckCircle, Factory, Scissors } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

const TraceabilityTimeline = ({ batchId }) => {
  const { batches, certificates, listings, orders, transportJobs, warehouseBookings, processingRecords, processingRequests } = useGlobalState();
  
  const batch = batches.find(b => b.id === batchId);
  if (!batch) return null;

  const cert = certificates.find(c => c.batchId === batchId);
  const listing = listings.find(l => l.batchId === batchId);
  const order = listing ? orders.find(o => o.items?.some(i => i.productId === listing.id)) : null;
  const transport = order ? transportJobs.find(t => t.orderId === order.id) : null;
  const warehouse = order ? warehouseBookings.find(w => w.orderId === order.id) : null;

  const processingRequest = (processingRequests || []).find(r => r.batchId === batchId);
  const batchProcessingRecords = (processingRecords || []).filter(r => r.batchId === batchId);
  const hasCompletedProcessing = batchProcessingRecords.some(r => r.status === 'COMPLETED');

  const processingDesc = () => {
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

  const processingStatus = () => {
    if (!processingRequest) return 'upcoming';
    if (processingRequest.status === 'COMPLETED' || hasCompletedProcessing) return 'completed';
    if (['IN_PROGRESS', 'ACCEPTED', 'RECEIVED', 'REQUESTED'].includes(processingRequest.status)) return 'active';
    return 'upcoming';
  };

  const processingDate = () => {
    if (!processingRequest) return null;
    if (hasCompletedProcessing) {
      const last = batchProcessingRecords.filter(r => r.status === 'COMPLETED').slice(-1)[0];
      return last && last.completionTime ? new Date(last.completionTime).toLocaleDateString() : null;
    }
    return new Date(processingRequest.updatedAt || processingRequest.createdAt).toLocaleDateString();
  };

  const pStatus = processingStatus();
  const outputIds = batchProcessingRecords.filter(r => r.outputBatchId).map(r => r.outputBatchId).join(', ');

  const steps = [
    { id: 'FARM', icon: <Box size={20} />, title: 'Farm Origin', desc: 'Shorn at ' + batch.location + ' by ' + batch.farmerName + '.', date: new Date(batch.createdAt).toLocaleDateString(), status: 'completed' },
    { id: 'QUALITY', icon: <ShieldCheck size={20} />, title: 'Quality Inspection', desc: cert ? 'Inspected by ' + cert.inspectorName + '. Grade ' + cert.grade + '.' : 'Pending inspection.', date: cert ? new Date(cert.issuedAt).toLocaleDateString() : null, status: cert ? 'completed' : 'pending' },
    { id: 'MARKET', icon: <Store size={20} />, title: 'Marketplace Listed', desc: listing ? 'Listed by ' + listing.sellerName + ' on WoolKart.' : 'Not yet listed.', date: listing ? new Date(listing.createdAt).toLocaleDateString() : null, status: listing ? 'completed' : cert ? 'pending' : 'upcoming' },
    { id: 'SOLD', icon: <CheckCircle size={20} />, title: 'Batch Sold', desc: order ? 'Purchased by ' + order.buyerName + '.' : 'Waiting for buyers.', date: order ? new Date(order.createdAt).toLocaleDateString() : null, status: order ? 'completed' : listing ? 'pending' : 'upcoming' },
    { id: 'TRANSPORT', icon: <Truck size={20} />, title: 'Transportation', desc: transport ? 'Handled by Transporter (' + transport.status + ').' : 'Not requested.', date: transport ? new Date(transport.createdAt).toLocaleDateString() : null, status: transport ? (transport.status === 'Delivered' ? 'completed' : 'active') : order ? 'pending' : 'upcoming' },
    { id: 'WAREHOUSE', icon: <Warehouse size={20} />, title: 'Warehouse Storage', desc: warehouse ? 'Stored securely.' : 'Not in storage.', date: warehouse ? new Date(warehouse.createdAt).toLocaleDateString() : null, status: warehouse ? 'completed' : (transport && transport.status === 'Delivered') ? 'pending' : 'upcoming' },
    { id: 'PROCESSING', icon: <Factory size={20} />, title: 'Wool Processing', desc: processingDesc(), date: processingDate(), status: pStatus },
    { id: 'FABRIC', icon: <Scissors size={20} />, title: 'Yarn / Fabric', desc: hasCompletedProcessing ? 'Output: ' + (outputIds || 'batch ready') + '.' : 'Awaiting processing completion.', date: null, status: hasCompletedProcessing ? 'pending' : 'upcoming' }
  ];

  const dotBg = (s) => s === 'completed' ? '#0B120D' : s === 'active' ? '#D97706' : '#F8F8F3';
  const lineBg = (s) => s === 'completed' ? '#0B120D' : '#E5E5E5';

  return (
    <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
      <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#0B120D'}}>Traceability Timeline</h3>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {steps.map((step, index) => (
          <div key={step.id} style={{display: 'flex', gap: '16px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: dotBg(step.status), color: (step.status === 'completed' || step.status === 'active') ? '#FFF' : '#999', border: step.status === 'upcoming' ? '1px dashed #CCC' : step.status === 'pending' ? '2px solid #E5E5E5' : 'none', zIndex: 2, flexShrink: 0}}>
                {step.icon}
              </div>
              {index < steps.length - 1 && <div style={{width: '2px', flex: 1, minHeight: '40px', margin: '4px 0', backgroundColor: lineBg(step.status)}} />}
            </div>
            <div style={{paddingBottom: '32px', flex: 1, opacity: step.status === 'upcoming' ? 0.45 : 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h4 style={{fontSize: '15px', fontWeight: '700', color: step.status === 'upcoming' ? '#6B7280' : '#0B120D', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {step.title}
                    {step.id === 'PROCESSING' && step.status === 'active' && <span style={{fontSize: '10px', fontWeight: '800', background: '#DDFF86', color: '#0B120D', padding: '2px 8px', borderRadius: '20px'}}>CURRENT</span>}
                    {step.status === 'completed' && <span style={{fontSize: '10px', fontWeight: '800', color: '#0B120D', opacity: 0.5}}>✓</span>}
                  </h4>
                  <p style={{fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0}}>{step.desc}</p>
                </div>
                {step.date && <span style={{fontSize: '12px', color: '#999', fontWeight: '600', flexShrink: 0, marginLeft: '8px'}}>{step.date}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraceabilityTimeline;
