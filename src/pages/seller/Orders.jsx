import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ShoppingCart, Truck, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const { orders, updateOrder, requestTransport } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');

  // Find all orders where user is either buyer or seller
  const myOrders = orders.filter(o => 
    o.buyerId === user.id || o.items?.some(i => i.sellerId === user.id)
  );

  const filteredOrders = activeTab === 'ALL' 
    ? myOrders 
    : myOrders.filter(o => o.status.toUpperCase() === activeTab);

  const handleRequestTransport = (order) => {
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
    updateOrder(order.id, { status: 'Transport Requested', transportJobId: newTransportJob.id });
    alert('Transport request submitted successfully!');
  };

  return (
    <div style={{padding: '32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
            Order Management
          </h1>
          <p style={{color: '#666', fontSize: '16px'}}>Track and fulfill your marketplace orders.</p>
        </div>
      </div>

      <div style={{display: 'flex', gap: '8px', marginBottom: '24px'}}>
        {['ALL', 'PENDING', 'CONFIRMED', 'TRANSPORT REQUESTED', 'DELIVERED'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px', 
              backgroundColor: activeTab === tab ? '#0B120D' : '#F8F8F3',
              color: activeTab === tab ? '#DDFF86' : '#666',
              border: activeTab === tab ? 'none' : '1px solid #E5E5E5',
              borderRadius: '20px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        {filteredOrders.map(order => {
          const isSeller = order.items?.some(i => i.sellerId === user.id);
          const isBuyer = order.buyerId === user.id;

          return (
            <div key={order.id} style={{backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5', paddingBottom: '16px', marginBottom: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{backgroundColor: '#F8F8F3', padding: '12px', borderRadius: '8px', color: '#0B120D'}}>
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <div style={{fontWeight: '700', fontSize: '18px', color: '#0B120D'}}>Order {order.id}</div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                      {new Date(order.createdAt).toLocaleDateString()} • {isSeller ? 'Sale' : 'Purchase'}
                    </div>
                  </div>
                </div>
                
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '24px', fontWeight: '800', color: '#0B120D'}}>₹{order.totalAmount}</div>
                  <div style={{fontSize: '12px', fontWeight: '800', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px'}}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div style={{marginBottom: '24px'}}>
                <h3 style={{fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#666', textTransform: 'uppercase'}}>Order Items</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F8F8F3', borderRadius: '8px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <Package size={16} color="#666" />
                        <div>
                          <div style={{fontWeight: '600', color: '#0B120D'}}>{item.name}</div>
                          <div style={{fontSize: '13px', color: '#666'}}>Seller: {item.sellerName}</div>
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontWeight: '700', color: '#0B120D'}}>{item.quantity} {item.unit}</div>
                        <div style={{fontSize: '13px', color: '#666'}}>₹{item.unitPrice}/{item.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5'}}>
                <button style={{padding: '10px 20px', backgroundColor: '#F8F8F3', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}>
                  View Invoice
                </button>
                
                {isSeller && order.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleRequestTransport(order)}
                    style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}}
                  >
                    <Truck size={18} /> Request Transport
                  </button>
                )}

                {isBuyer && order.status === 'Delivered' && (
                  <button 
                    style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}}
                  >
                    <CheckCircle size={18} /> Release Escrow Payment
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div style={{padding: '48px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <ShoppingCart size={48} color="#E5E5E5" style={{marginBottom: '16px'}} />
            <p style={{color: '#666', fontSize: '16px'}}>No orders found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
