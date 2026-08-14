import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, CheckCircle, Clock, Truck, Package, ShieldCheck, 
  MapPin, Star, FileText, Download, Building
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrder, addTransaction, requestTransport } = useGlobalState();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <button onClick={() => navigate('/seller/orders')} style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer' }}>Back to Orders</button>
      </div>
    );
  }

  const isSeller = order.sellerId === user.id || order.items?.some(i => i.sellerId === user.id);
  const isBuyer = order.buyerId === user.id;
  const firstItem = order.items?.[0] || {};

  // Timeline States Map
  const timelineSteps = [
    { label: 'Order Placed', statusKey: ['Pending', 'Payment Secured', 'Confirmed', 'Processing', 'Ready to Ship', 'Transport Requested', 'In Transit', 'Delivered', 'Completed'] },
    { label: 'Payment Secured', statusKey: ['Payment Secured', 'Confirmed', 'Processing', 'Ready to Ship', 'Transport Requested', 'In Transit', 'Delivered', 'Completed'] },
    { label: 'Confirmed', statusKey: ['Confirmed', 'Processing', 'Ready to Ship', 'Transport Requested', 'In Transit', 'Delivered', 'Completed'] },
    { label: 'Preparing', statusKey: ['Processing', 'Ready to Ship', 'Transport Requested', 'In Transit', 'Delivered', 'Completed'] },
    { label: 'Ready to Ship', statusKey: ['Ready to Ship', 'Transport Requested', 'In Transit', 'Delivered', 'Completed'] },
    { label: 'In Transit', statusKey: ['In Transit', 'Delivered', 'Completed'] },
    { label: 'Delivered', statusKey: ['Delivered', 'Completed'] },
    { label: 'Released', statusKey: ['Completed'] }
  ];

  const getStepStatus = (step) => {
    if (step.statusKey.includes(order.status)) return 'COMPLETED';
    // If the current order status is exactly the step before this one in the flow, mark as active
    // For simplicity, just return PENDING if not completed
    return 'PENDING';
  };

  // State Machine Handlers
  const handleAcceptOrder = () => {
    updateOrder(order.id, { status: 'Confirmed' });
    setShowConfirmModal(false);
  };

  const handleMarkProcessing = () => {
    updateOrder(order.id, { status: 'Processing' });
  };

  const handleMarkReady = () => {
    updateOrder(order.id, { status: 'Ready to Ship' });
  };

  const handleRequestTransport = () => {
    const newTransportJob = {
      id: `TRJ-${Math.floor(Math.random() * 10000)}`,
      orderId: order.id,
      requesterId: user.id,
      requesterName: user.name,
      pickup: 'Seller Location',
      dropoff: 'Buyer Location',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    requestTransport(newTransportJob);
    updateOrder(order.id, { status: 'In Transit', transportJobId: newTransportJob.id });
    setShowTransportModal(false);
  };

  const handleReleaseEscrow = () => {
    const sellerId = firstItem.sellerId || order.sellerId || 'FARMER-01';
    addTransaction({
      id: `TXN-${Math.floor(Math.random() * 100000)}`,
      userId: sellerId,
      orderId: order.id,
      batchId: firstItem.batchId,
      type: 'Sale',
      amount: order.totalAmount || order.total,
      status: 'Released',
      description: `Order #${order.id}`,
      createdAt: new Date().toISOString()
    });
    updateOrder(order.id, { status: 'Completed', paymentStatus: 'RELEASED' });
    alert('Escrow payment released to seller!');
  };

  // Only allow buyer to mark delivered for the sake of the demo
  const handleMarkDelivered = () => {
    updateOrder(order.id, { status: 'Delivered' });
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D', paddingBottom: '100px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/seller/orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#666' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px' }}>ORDER DETAIL</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>{order.id}</h1>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', background: '#F8F8F3', border: '1px solid #E5E5E5' }}>
            STATUS: <span style={{ color: '#0369A1' }}>{order.status.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '32px', marginBottom: '32px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '800px' }}>
          {timelineSteps.map((step, idx) => {
            const status = getStepStatus(step);
            return (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: status === 'COMPLETED' ? '#16A34A' : '#F8F8F3',
                    color: status === 'COMPLETED' ? '#FFF' : '#E5E5E5',
                    border: status === 'COMPLETED' ? 'none' : '2px solid #E5E5E5'
                  }}>
                    {status === 'COMPLETED' ? <CheckCircle size={18} /> : <div style={{width: '8px', height: '8px', borderRadius: '4px', background: '#E5E5E5'}} />}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: status === 'COMPLETED' ? '#0B120D' : '#666', textAlign: 'center', maxWidth: '80px' }}>
                    {step.label}
                  </div>
                </div>
                {idx < timelineSteps.length - 1 && (
                  <div style={{ flex: 1, height: '4px', background: getStepStatus(timelineSteps[idx + 1]) === 'COMPLETED' ? '#16A34A' : '#E5E5E5', marginTop: '-24px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* PRODUCT & BATCH INFO */}
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} /> ORDERED PRODUCT
            </h2>
            
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ width: '120px', height: '120px', background: '#F8F8F3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={48} color="#E5E5E5" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>{firstItem.name || 'Premium Wool'}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '700' }}>QUANTITY</div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>{firstItem.quantity} {firstItem.unit || 'KG'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '700' }}>PRICE</div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>₹{firstItem.unitPrice || firstItem.price}/{firstItem.unit || 'KG'}</div>
                  </div>
                </div>
                
                <div style={{ padding: '12px', background: '#F8F8F3', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#666' }}>WOOLTRACE BATCH</div>
                    <div style={{ fontWeight: '700' }}>{firstItem.batchId || 'WT-KA-2026-00124'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#16A34A', background: '#DCFCE7', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Grade A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRACEABILITY */}
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} /> FARM-TO-FABRIC TRACEABILITY
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {['FARM', 'QUALITY', 'CERTIFICATE', 'MARKET', 'ORDER'].map((t) => (
                <div key={t} style={{ padding: '8px 12px', background: '#F0F9FF', color: '#0369A1', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> {t}
                </div>
              ))}
              {['TRANSPORT', 'WAREHOUSE', 'FABRIC'].map((t) => (
                <div key={t} style={{ padding: '8px 12px', background: '#F8F8F3', color: '#666', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E5E5E5' }}>
                   {t}
                </div>
              ))}
            </div>
            <button style={{ marginTop: '24px', padding: '10px 20px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
              VIEW FULL TRACEABILITY
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* BUYER / SELLER INFO */}
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#666' }}>{isSeller ? 'BUYER INFO' : 'SELLER INFO'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8F8F3', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '800' }}>{isSeller ? (order.buyerName || 'ABC Textiles') : (firstItem.sellerName || 'Wool Farmer')}</div>
                <div style={{ fontSize: '13px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                  <CheckCircle size={12} /> Verified
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #E5E5E5', paddingTop: '12px' }}>
              <span style={{ color: '#666' }}>Rating</span>
              <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>4.8 <Star size={12} fill="#F59E0B" color="#F59E0B" /></span>
            </div>
          </div>

          {/* ESCROW / PAYMENT */}
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#666' }}>PAYMENT & ESCROW</h2>
            
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>₹{(order.totalAmount || order.total || 0).toLocaleString()}</div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: order.paymentStatus === 'RELEASED' ? '#DCFCE7' : '#F0F9FF', color: order.paymentStatus === 'RELEASED' ? '#16A34A' : '#0369A1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', marginBottom: '24px' }}>
              <ShieldCheck size={16} /> 
              {order.paymentStatus === 'RELEASED' ? 'FUNDS RELEASED' : 'SECURED IN ESCROW'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Order Value</span>
                <span style={{ fontWeight: '700' }}>₹{(order.totalAmount || order.total || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Platform Fee</span>
                <span style={{ fontWeight: '700', color: '#DC2626' }}>-₹{(order.totalAmount * 0.02 || 0).toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', background: '#E5E5E5' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                <span>Net Settlement</span>
                <span>₹{(order.totalAmount * 0.98 || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <p style={{ fontSize: '12px', color: '#666', marginTop: '24px', lineHeight: '1.5' }}>
              Funds will be released according to the WoolTrace order settlement workflow after delivery confirmation.
            </p>
          </div>

          {/* DOCUMENTS */}
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#666' }}>DOCUMENTS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Order Invoice', 'Quality Certificate', 'Escrow Receipt'].map(doc => (
                <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8F8F3', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
                    <FileText size={16} color="#666" /> {doc}
                  </div>
                  <Download size={16} color="#0B120D" style={{ cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* FIXED ACTION BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', gap: '16px', zIndex: 100, marginLeft: '240px' }}>
        
        {isSeller && (order.status === 'Payment Secured' || order.status === 'Pending') && (
          <>
            <button style={{ padding: '12px 24px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>REJECT ORDER</button>
            <button onClick={() => setShowConfirmModal(true)} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>ACCEPT ORDER</button>
          </>
        )}

        {isSeller && order.status === 'Confirmed' && (
          <button onClick={handleMarkProcessing} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>MARK AS PROCESSING</button>
        )}

        {isSeller && order.status === 'Processing' && (
          <button onClick={handleMarkReady} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>MARK READY TO SHIP</button>
        )}

        {isSeller && order.status === 'Ready to Ship' && (
          <button onClick={() => setShowTransportModal(true)} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} /> REQUEST TRANSPORT
          </button>
        )}
        
        {isBuyer && order.status === 'In Transit' && (
          <button onClick={handleMarkDelivered} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> CONFIRM DELIVERY
          </button>
        )}

        {isBuyer && order.status === 'Delivered' && (
          <button onClick={handleReleaseEscrow} style={{ padding: '12px 24px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} /> RELEASE ESCROW PAYMENT
          </button>
        )}

        {order.status === 'Completed' && (
          <span style={{ padding: '12px 24px', background: '#F8F8F3', color: '#16A34A', borderRadius: '8px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> ORDER COMPLETED & SETTLED
          </span>
        )}
      </div>

      {/* MODALS */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>ACCEPT ORDER?</h2>
            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Buyer:</span>
                <span style={{ fontWeight: '700' }}>{order.buyerName || 'ABC Textiles'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Product:</span>
                <span style={{ fontWeight: '700' }}>{firstItem.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Total:</span>
                <span style={{ fontWeight: '700' }}>₹{(order.totalAmount || order.total || 0).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowConfirmModal(false)} style={{ flex: 1, padding: '12px', background: '#F8F8F3', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
              <button onClick={handleAcceptOrder} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>ACCEPT</button>
            </div>
          </div>
        </div>
      )}

      {showTransportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} /> REQUEST TRANSPORT
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
              This will create a transport job for the Logistics module to pick up the batch {firstItem.batchId}.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowTransportModal(false)} style={{ flex: 1, padding: '12px', background: '#F8F8F3', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
              <button onClick={handleRequestTransport} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>REQUEST</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetail;
