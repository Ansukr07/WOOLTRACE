import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useWoolKart } from '../../context/WoolKartContext';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function MarketCheckout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useWoolKart();
  const { addOrder, requestTransport } = useGlobalState();
  const [step, setStep] = useState(1);
  const [shippingCost] = useState(1250); // Dummy static shipping for demo
  const [taxes] = useState(Math.round(cartTotal * 0.05)); // 5% mock tax

  const totalAmount = cartTotal + shippingCost + taxes;

  const handleCheckout = () => {
    // 1. Create orders (one per item for simplicity, or grouped by seller)
    // For SIH Demo, let's group by seller and create orders.
    const groupedCart = cartItems.reduce((acc, item) => {
      const seller = item.sellerId || 'SELLER-UNKNOWN';
      if (!acc[seller]) acc[seller] = [];
      acc[seller].push(item);
      return acc;
    }, {});

    Object.entries(groupedCart).forEach(([sellerId, items]) => {
      const orderId = `ORD-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const orderTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      
      addOrder({
        id: orderId,
        buyerId: 'BUYER-01', // Dummy logged in buyer
        sellerId,
        items,
        subtotal: orderTotal,
        taxes: Math.round(orderTotal * 0.05),
        shipping: shippingCost,
        total: orderTotal + Math.round(orderTotal * 0.05) + shippingCost,
        status: 'PENDING',
        paymentStatus: 'ESCROW_LOCKED',
        createdAt: new Date().toISOString()
      });

      // Optionally request transport if batch ID exists
      items.forEach(item => {
        if (item.batchId) {
          requestTransport({
            id: `TR-${Math.floor(Math.random() * 10000)}`,
            orderId,
            batchId: item.batchId,
            origin: 'Seller Location', // Mapped from DB
            destination: 'Buyer Location',
            status: 'PENDING'
          });
        }
      });
    });

    clearCart();
    // In SIH demo, just route them back to orders
    alert('Payment Successful! Funds are held in Escrow until delivery.');
    navigate('/seller/orders');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#0B120D' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Your Cart is Empty</h1>
        <button onClick={() => navigate('/seller/market')} style={{ marginTop: '24px', padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
          RETURN TO MARKETPLACE
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', color: '#0B120D' }}>
      <button onClick={() => step === 1 ? navigate('/seller/cart') : setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> {step === 1 ? 'Back to Cart' : 'Back'}
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px' }}>CHECKOUT</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
        
        {/* Left Side: Steps */}
        <div>
          {/* STEP 1: Delivery Address */}
          <div style={{ padding: '24px', border: '1px solid #E5E5E5', borderRadius: '12px', marginBottom: '24px', opacity: step === 1 ? 1 : 0.6 }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '24px', background: '#0B120D', color: '#FFF', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
              DELIVERY ADDRESS
            </h2>
            
            {step === 1 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input type="text" placeholder="Full Name" defaultValue="WoolTrace Buyer" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                <input type="text" placeholder="Mobile Number" defaultValue="9876543210" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                <input type="text" placeholder="Company Name (Optional)" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5', gridColumn: 'span 2' }} />
                <input type="text" placeholder="Address Line 1" defaultValue="123 Textile Park" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5', gridColumn: 'span 2' }} />
                <input type="text" placeholder="City" defaultValue="Bengaluru" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                <input type="text" placeholder="State" defaultValue="Karnataka" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                <input type="text" placeholder="PIN Code" defaultValue="560001" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
                  <button onClick={() => setStep(2)} style={{ padding: '12px 24px', background: '#0B120D', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                    SAVE & CONTINUE
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                <strong>WoolTrace Buyer</strong><br />
                123 Textile Park, Bengaluru<br />
                Karnataka, 560001<br />
                +91 98765 43210
              </div>
            )}
          </div>

          {/* STEP 2: Escrow Payment */}
          <div style={{ padding: '24px', border: '1px solid #E5E5E5', borderRadius: '12px', opacity: step === 2 ? 1 : 0.6 }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '24px', background: '#0B120D', color: '#FFF', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
              SECURE ESCROW PAYMENT
            </h2>

            {step === 2 && (
              <div>
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369A1', fontWeight: '800', marginBottom: '12px' }}>
                    <ShieldCheck size={20} /> WOOLTRACE ESCROW
                  </div>
                  <p style={{ color: '#0C4A6E', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                    Your payment of <strong>₹{totalAmount.toLocaleString()}</strong> will be securely held in the WoolTrace Escrow account. Funds are only released to the seller after the order reaches the agreed delivery stage.
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', fontSize: '12px', fontWeight: '700', color: '#0284C7' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{width: 8, height: 8, borderRadius: 4, background: '#0369A1'}}/> BUYER PAYS</span>
                    <span style={{flex: 1, height: 1, background: '#BAE6FD'}}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.5 }}><div style={{width: 8, height: 8, borderRadius: 4, background: '#0369A1'}}/> SELLER SHIPS</span>
                    <span style={{flex: 1, height: 1, background: '#BAE6FD'}}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.5 }}><div style={{width: 8, height: 8, borderRadius: 4, background: '#0369A1'}}/> BUYER RECEIVES</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                  <label style={{ flex: 1, border: '2px solid #0B120D', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="radio" name="payment" defaultChecked />
                    <span style={{ fontWeight: '700' }}>UPI / Netbanking</span>
                  </label>
                  <label style={{ flex: 1, border: '1px solid #E5E5E5', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', opacity: 0.7 }}>
                    <input type="radio" name="payment" disabled />
                    <span style={{ fontWeight: '700' }}>WoolTrace Wallet</span>
                  </label>
                </div>

                <button onClick={handleCheckout} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}>
                  <Lock size={18} /> PAY ₹{totalAmount.toLocaleString()} TO ESCROW
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div>
          <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px', position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>ORDER SUMMARY</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #E5E5E5', paddingBottom: '24px' }}>
              {cartItems.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{item.quantity} KG x {item.name}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>Seller: {item.sellerName || 'Unknown'}</div>
                  </div>
                  <div style={{ fontWeight: '700' }}>₹{(item.subtotal || 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              <span>Delivery (Transport Module)</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>₹{shippingCost.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5', color: '#666', fontSize: '14px' }}>
              <span>Taxes (5%)</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>₹{taxes.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div style={{ textAlign: 'right', color: '#16A34A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
              <ShieldCheck size={14} /> 100% SECURE ESCROW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
