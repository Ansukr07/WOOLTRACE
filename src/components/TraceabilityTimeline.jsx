import React from 'react';
import { Box, ShieldCheck, Store, Truck, Warehouse, CheckCircle } from 'lucide-react';

const TraceabilityTimeline = ({ batchId }) => {
  // In a real app, this would fetch from GlobalStateContext using the batchId
  // We'll mock the lookup logic inline for this component
  const { batches, certificates, listings, orders, transportJobs, warehouseBookings } = require('../../context/GlobalStateContext').useGlobalState();
  
  const batch = batches.find(b => b.id === batchId);
  if (!batch) return null;

  const cert = certificates.find(c => c.batchId === batchId);
  const listing = listings.find(l => l.batchId === batchId);
  const order = listing ? orders.find(o => o.items?.some(i => i.productId === listing.id)) : null;
  const transport = order ? transportJobs.find(t => t.orderId === order.id) : null;
  const warehouse = order ? warehouseBookings.find(w => w.orderId === order.id) : null;

  const steps = [
    {
      id: 'FARM',
      icon: <Box size={20} />,
      title: 'Farm Origin',
      desc: `Shorn at ${batch.location} by ${batch.farmerName}.`,
      date: new Date(batch.createdAt).toLocaleDateString(),
      status: 'completed'
    },
    {
      id: 'QUALITY',
      icon: <ShieldCheck size={20} />,
      title: 'Quality Inspection',
      desc: cert ? `Inspected by ${cert.inspectorName}. Grade ${cert.grade}.` : 'Pending inspection.',
      date: cert ? new Date(cert.issuedAt).toLocaleDateString() : null,
      status: cert ? 'completed' : 'pending'
    },
    {
      id: 'MARKET',
      icon: <Store size={20} />,
      title: 'Marketplace Listed',
      desc: listing ? `Listed by ${listing.sellerName} on WoolKart.` : 'Not yet listed.',
      date: listing ? new Date(listing.createdAt).toLocaleDateString() : null,
      status: listing ? 'completed' : cert ? 'pending' : 'upcoming'
    },
    {
      id: 'SOLD',
      icon: <CheckCircle size={20} />,
      title: 'Batch Sold',
      desc: order ? `Purchased by ${order.buyerName}.` : 'Waiting for buyers.',
      date: order ? new Date(order.createdAt).toLocaleDateString() : null,
      status: order ? 'completed' : listing ? 'pending' : 'upcoming'
    },
    {
      id: 'TRANSPORT',
      icon: <Truck size={20} />,
      title: 'Transportation',
      desc: transport ? `Handled by Transporter (${transport.status}).` : 'Not requested.',
      date: transport ? new Date(transport.createdAt).toLocaleDateString() : null,
      status: transport ? (transport.status === 'Delivered' ? 'completed' : 'active') : order ? 'pending' : 'upcoming'
    },
    {
      id: 'WAREHOUSE',
      icon: <Warehouse size={20} />,
      title: 'Warehouse Storage',
      desc: warehouse ? `Stored securely.` : 'Not in storage.',
      date: warehouse ? new Date(warehouse.createdAt).toLocaleDateString() : null,
      status: warehouse ? 'completed' : transport?.status === 'Delivered' ? 'pending' : 'upcoming'
    }
  ];

  return (
    <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
      <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#0B120D'}}>
        Traceability Timeline
      </h3>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '0'}}>
        {steps.map((step, index) => (
          <div key={step.id} style={{display: 'flex', gap: '16px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: step.status === 'completed' ? '#16A34A' : step.status === 'active' ? '#D97706' : '#F8F8F3',
                color: step.status === 'completed' || step.status === 'active' ? '#FFFFFF' : '#999',
                border: step.status === 'upcoming' ? '1px dashed #CCC' : 'none',
                zIndex: 2
              }}>
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '2px', flex: 1, minHeight: '40px', margin: '4px 0',
                  backgroundColor: step.status === 'completed' ? '#16A34A' : '#E5E5E5'
                }} />
              )}
            </div>
            
            <div style={{paddingBottom: '32px', flex: 1, opacity: step.status === 'upcoming' ? 0.5 : 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h4 style={{fontSize: '15px', fontWeight: '700', color: '#0B120D', marginBottom: '4px'}}>{step.title}</h4>
                  <p style={{fontSize: '13px', color: '#666', lineHeight: '1.5'}}>{step.desc}</p>
                </div>
                {step.date && <span style={{fontSize: '12px', color: '#999', fontWeight: '600'}}>{step.date}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraceabilityTimeline;
