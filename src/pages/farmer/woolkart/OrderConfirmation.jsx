import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useWoolKart } from '../../../context/WoolKartContext';
import './WoolKartStyles.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useWoolKart();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return <Navigate to="/farmer/woolkart" replace />;
  }

  return (
    <div className="woolkart-container" style={{backgroundColor: '#F8F8F3', padding: '32px'}}>
      <div className="order-confirmation">
        <div className="success-icon">
          <Check size={40} strokeWidth={3} />
        </div>
        <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>ORDER CONFIRMED</h1>
        <p style={{color: '#666', marginBottom: '32px'}}>Your order has been successfully placed.</p>

        <div style={{backgroundColor: '#F8F8F3', borderRadius: '12px', padding: '24px', textAlign: 'left', marginBottom: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E5E5E5'}}>
            <div>
              <div style={{fontSize: '13px', color: '#666'}}>Order ID</div>
              <div style={{fontWeight: '700', fontSize: '16px'}}>{order.id}</div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '13px', color: '#666'}}>Total Paid</div>
              <div style={{fontWeight: '800', fontSize: '16px', color: '#0B120D'}}>₹{order.total.toLocaleString()}</div>
            </div>
          </div>

          <div style={{marginBottom: '16px'}}>
            <div style={{fontSize: '13px', color: '#666', marginBottom: '8px'}}>Items</div>
            {order.items.map(item => (
              <div key={item.productId} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                <div style={{fontWeight: '600'}}>{item.quantity}x {item.name}</div>
                <div>₹{item.subtotal.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E5E5'}}>
            <div style={{fontSize: '13px', color: '#666', marginBottom: '4px'}}>Estimated delivery</div>
            <div style={{fontWeight: '700', color: '#16A34A'}}>{order.estimatedDelivery}</div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
          <button className="btn-secondary" onClick={() => navigate('/farmer/woolkart')}>
            CONTINUE SHOPPING
          </button>
          <button className="btn-primary" onClick={() => alert('Order tracking feature coming soon!')}>
            TRACK ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
