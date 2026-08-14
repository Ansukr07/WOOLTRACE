import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useWoolKart } from '../../../context/WoolKartContext';
import './WoolKartStyles.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useWoolKart();

  const deliveryFee = cartItems.length > 0 ? 250 : 0;
  const taxes = cartTotal * 0.05; // 5% GST mock
  const finalTotal = cartTotal + deliveryFee + taxes;

  // Group items by seller
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.sellerName]) {
      acc[item.sellerName] = [];
    }
    acc[item.sellerName].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div className="woolkart-container" style={{padding: '60px', textAlign: 'center'}}>
        <h2>Your WoolKart is empty.</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>Explore wool products and supplies.</p>
        <button className="btn-primary" onClick={() => navigate('/farmer/woolkart')}>
          EXPLORE WOOLKART
        </button>
      </div>
    );
  }

  return (
    <div className="woolkart-container" style={{backgroundColor: '#F8F8F3'}}>
      <div className="woolkart-header" style={{padding: '24px 32px'}}>
        <h1 style={{fontSize: '24px', margin: 0}}>YOUR WOOLKART CART</h1>
      </div>

      <div className="cart-container">
        {/* Left: Cart Items */}
        <div className="cart-items-section">
          {Object.entries(groupedItems).map(([sellerName, items]) => (
            <div key={sellerName} style={{marginBottom: '32px'}}>
              <h3 style={{fontSize: '14px', color: '#666', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '800'}}>
                SELLER: {sellerName}
              </h3>
              
              {items.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">₹{item.unitPrice.toLocaleString()}/{item.unit}</div>
                    </div>
                    
                    <div style={{fontWeight: '700', fontSize: '15px', color: '#0B120D', marginTop: '4px'}}>
                      Subtotal: ₹{item.subtotal.toLocaleString()}
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-selector" style={{margin: 0}}>
                        <button 
                          className="qty-btn" 
                          style={{width: '32px', height: '32px', fontSize: '16px'}}
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >-</button>
                        <input 
                          type="text" 
                          className="qty-input"
                          style={{width: '40px', height: '32px', fontSize: '14px'}}
                          value={item.quantity}
                          readOnly
                        />
                        <button 
                          className="qty-btn" 
                          style={{width: '32px', height: '32px', fontSize: '16px'}}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >+</button>
                      </div>
                      
                      <button 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px', background: 'none',
                          border: 'none', color: '#DC2626', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                        }}
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 size={14} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-box">
            <h2 style={{fontSize: '18px', fontWeight: '800', marginBottom: '24px'}}>CART SUMMARY</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span style={{fontWeight: '600', color: '#0B120D'}}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span style={{fontWeight: '600', color: '#0B120D'}}>₹{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Taxes (Estimated):</span>
              <span style={{fontWeight: '600', color: '#0B120D'}}>₹{taxes.toLocaleString()}</span>
            </div>
            
            <div className="summary-row total">
              <span>TOTAL:</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
            
            <button className="btn-checkout" onClick={() => navigate('/farmer/woolkart/checkout')}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
