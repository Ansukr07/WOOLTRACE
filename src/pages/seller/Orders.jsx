import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ShoppingCart, Search, Filter, Download, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const { orders } = useGlobalState();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Find all orders where user is either buyer or seller
  const myOrders = orders.filter(o => 
    o.buyerId === user.id || o.sellerId === user.id || o.items?.some(i => i.sellerId === user.id)
  );

  // Status mapping for tabs
  const tabMapping = {
    'ALL': 'ALL',
    'PENDING': 'Pending',
    'PAYMENT': 'Payment Secured',
    'CONFIRMED': 'Confirmed',
    'PROCESSING': 'Processing',
    'READY TO SHIP': 'Ready to Ship',
    'IN TRANSIT': 'In Transit',
    'DELIVERED': 'Delivered',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'REFUNDED': 'Refunded'
  };

  const filteredOrders = myOrders.filter(order => {
    const matchesTab = activeTab === 'ALL' || (order.status || '').toUpperCase() === tabMapping[activeTab]?.toUpperCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.buyerName || order.buyerId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(i => (i.batchId || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.items?.some(i => (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesTab && matchesSearch;
  });

  // Calculate Metrics
  const totalOrders = myOrders.length;
  const pendingCount = myOrders.filter(o => ['Pending', 'Confirmed', 'Processing', 'Ready to Ship'].includes(o.status)).length;
  const inTransitCount = myOrders.filter(o => ['Transport Requested', 'In Transit'].includes(o.status)).length;
  const completedCount = myOrders.filter(o => ['Completed', 'Delivered'].includes(o.status)).length;
  const totalSales = myOrders
    .filter(o => o.sellerId === user.id || o.items?.some(i => i.sellerId === user.id))
    .reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

  // Tab counts
  const getTabCount = (tab) => {
    if (tab === 'ALL') return totalOrders;
    return myOrders.filter(o => (o.status || '').toUpperCase() === tabMapping[tab]?.toUpperCase()).length;
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>ORDERS</h1>
          <p style={{ color: '#666' }}>Manage your sales, shipments and order fulfillment.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '12px 24px', background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} /> FILTER
          </button>
          <button style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> EXPORT ORDERS
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>TOTAL ORDERS</div>
          <div style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {totalOrders}
            <ShoppingCart size={24} color="#666" />
          </div>
        </div>
        <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>PENDING</div>
          <div style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {pendingCount}
            <Clock size={24} color="#F59E0B" />
          </div>
        </div>
        <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>IN TRANSIT</div>
          <div style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {inTransitCount}
            <Truck size={24} color="#0369A1" />
          </div>
        </div>
        <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>COMPLETED</div>
          <div style={{ fontSize: '28px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {completedCount}
            <CheckCircle size={24} color="#16A34A" />
          </div>
        </div>
        <div style={{ background: '#F8F8F3', border: '1px solid #0B120D', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>TOTAL SALES</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>
            ₹{totalSales.toLocaleString()}
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {Object.keys(tabMapping).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', padding: '8px 0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                color: activeTab === tab ? '#0B120D' : '#666',
                borderBottom: activeTab === tab ? '2px solid #0B120D' : '2px solid transparent'
              }}
            >
              {tab} <span style={{ background: activeTab === tab ? '#0B120D' : '#E5E5E5', color: activeTab === tab ? '#FFF' : '#666', padding: '2px 6px', borderRadius: '10px', fontSize: '11px', marginLeft: '6px' }}>{getTabCount(tab)}</span>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: '300px', marginBottom: '8px' }}>
          <Search size={18} color="#666" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search order ID, buyer, batch ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      {/* ORDERS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredOrders.length > 0 ? (
          <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="stacked-table-mobile" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8F8F3', borderBottom: '1px solid #E5E5E5' }}>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Order</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Buyer</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Product & Batch</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Amount</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Status</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666' }}>Date</th>
                  <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: '#666', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const firstItem = order.items?.[0] || {};
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                      <td data-label="Order ID" style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>{order.id}</td>
                      <td data-label="Buyer" style={{ padding: '16px', fontSize: '14px' }}>{order.buyerName || order.buyerId || 'Guest'}</td>
                      <td data-label="Product" style={{ padding: '16px', fontSize: '14px' }}>
                        <div style={{ fontWeight: '600' }}>{firstItem.name || 'Wool Product'}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Batch: {firstItem.batchId || 'N/A'} • {firstItem.quantity} {firstItem.unit || 'KG'}</div>
                      </td>
                      <td data-label="Amount" style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>₹{(order.totalAmount || order.total || 0).toLocaleString()}</td>
                      <td data-label="Status" style={{ padding: '16px', fontSize: '14px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700',
                          background: ['Completed', 'Delivered'].includes(order.status) ? '#DCFCE7' : '#F0F9FF',
                          color: ['Completed', 'Delivered'].includes(order.status) ? '#16A34A' : '#0369A1'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td data-label="Date" style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td data-label="Action" style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => navigate(`/seller/orders/${order.id}`)}
                          style={{ padding: '8px 16px', background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
                        >
                          VIEW ORDER
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '64px', textAlign: 'center', background: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <Package size={48} color="#E5E5E5" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>NO ORDERS FOUND</h3>
            <p style={{ color: '#666' }}>There are no orders matching your current filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Orders;
