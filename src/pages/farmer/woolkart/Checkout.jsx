import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useWoolKart } from '../../../context/WoolKartContext';
import './WoolKartStyles.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, addOrder } = useWoolKart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = cartItems.length > 0 ? 250 : 0;
  const taxes = cartTotal * 0.05;
  const finalTotal = cartTotal + deliveryFee + taxes;

  const [address, setAddress] = useState({
    name: 'Suresh Kumar',
    mobile: '9876543210',
    address: 'Farm Plot 42, Green Valley',
    city: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    pincode: '570001'
  });

  if (cartItems.length === 0) {
    return (
      <div className="woolkart-container" style={{padding: '60px', textAlign: 'center'}}>
        <h2>Checkout Unavailable</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>Your cart is empty.</p>
        <button className="btn-primary" onClick={() => navigate('/farmer/woolkart')}>
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate API call for payment
    setTimeout(() => {
      const orderId = `WK-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...cartItems],
        total: finalTotal,
        status: 'Confirmed',
        estimatedDelivery: '4-6 days'
      };
      
      addOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      navigate(`/farmer/woolkart/order-confirmation/${orderId}`);
    }, 2000);
  };

  return (
    <div className="woolkart-container" style={{backgroundColor: '#F8F8F3'}}>
      <div className="checkout-steps">
        <button className="back-btn" onClick={() => step === 1 ? navigate('/farmer/woolkart/cart') : setStep(step - 1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Step 1: Address */}
        <div className={`checkout-step ${step !== 1 ? 'opacity-50' : ''}`}>
          <div className="step-header">
            <div className="step-number">1</div>
            <div className="step-title">DELIVERY ADDRESS</div>
          </div>
          
          {step === 1 ? (
            <div>
              <div className="spec-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" value={address.mobile} onChange={e => setAddress({...address, mobile: e.target.value})} />
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Complete Address</label>
                  <input type="text" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Village / City</label>
                  <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary" style={{marginTop: '16px'}} onClick={() => setStep(2)}>
                CONTINUE TO SUMMARY
              </button>
            </div>
          ) : (
            <div style={{color: '#666'}}>
              {address.name}, {address.address}, {address.city}, {address.state} - {address.pincode}
            </div>
          )}
        </div>

        {/* Step 2: Order Summary */}
        <div className={`checkout-step ${step !== 2 ? 'opacity-50' : ''}`}>
          <div className="step-header">
            <div className="step-number">2</div>
            <div className="step-title">ORDER SUMMARY</div>
          </div>
          
          {step === 2 && (
            <div>
              {cartItems.map(item => (
                <div key={item.productId} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E5E5'}}>
                  <div>
                    <div style={{fontWeight: '700'}}>{item.name}</div>
                    <div style={{fontSize: '13px', color: '#666'}}>Seller: {item.sellerName}</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontWeight: '700'}}>₹{item.subtotal.toLocaleString()}</div>
                    <div style={{fontSize: '13px', color: '#666'}}>Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
              
              <div style={{marginTop: '24px', backgroundColor: '#F8F8F3', padding: '16px', borderRadius: '8px'}}>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>₹{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="summary-row" style={{fontWeight: '800', fontSize: '18px', color: '#0B120D', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E5E5E5'}}>
                  <span>Total Amount:</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="btn-primary" style={{marginTop: '24px'}} onClick={() => setStep(3)}>
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Payment */}
        <div className={`checkout-step ${step !== 3 ? 'opacity-50' : ''}`}>
          <div className="step-header">
            <div className="step-number">3</div>
            <div className="step-title">SECURE PAYMENT</div>
          </div>
          
          {step === 3 && (
            <div>
              <div style={{marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: '600'}}>
                <ShieldCheck size={20} />
                Your payment information is securely processed.
              </div>
              
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <input type="radio" checked={paymentMethod === 'UPI'} readOnly />
                  <div style={{fontWeight: '700'}}>UPI Payment</div>
                </div>
                
                {paymentMethod === 'UPI' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Enter UPI ID</label>
                      <input type="text" placeholder="example@upi" />
                    </div>
                  </div>
                )}
                
                <div 
                  className={`payment-option ${paymentMethod === 'CARD' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <input type="radio" checked={paymentMethod === 'CARD'} readOnly />
                  <div style={{fontWeight: '700'}}>Credit / Debit Card</div>
                </div>
                
                {paymentMethod === 'CARD' && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div style={{display: 'flex', gap: '16px'}}>
                      <div className="form-group" style={{flex: 1}}>
                        <label>Expiry (MM/YY)</label>
                        <input type="text" placeholder="MM/YY" />
                      </div>
                      <div className="form-group" style={{flex: 1}}>
                        <label>CVV</label>
                        <input type="password" placeholder="***" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div 
                  className={`payment-option ${paymentMethod === 'WALLET' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('WALLET')}
                >
                  <input type="radio" checked={paymentMethod === 'WALLET'} readOnly />
                  <div>
                    <div style={{fontWeight: '700'}}>WoolTrace Wallet</div>
                    <div style={{fontSize: '13px', color: '#666', marginTop: '2px'}}>Available balance: ₹12,400</div>
                  </div>
                </div>
              </div>
              
              <button 
                className="btn-primary w-100" 
                style={{marginTop: '32px', padding: '16px', fontSize: '18px', display: 'flex', justifyContent: 'center'}}
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : `PAY ₹${finalTotal.toLocaleString()}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
