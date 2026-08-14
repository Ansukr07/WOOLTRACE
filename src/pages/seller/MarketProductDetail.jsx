import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Heart, Info, Star, Package, MapPin } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWoolKart } from '../../context/WoolKartContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';

export default function MarketProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, certificates } = useGlobalState();
  const { addToCart } = useWoolKart();
  const [quantity, setQuantity] = useState(10);
  const [addedMsg, setAddedMsg] = useState('');

  // Fallback mock data if listing not found
  const listing = listings.find(l => l.id === id) || {
    id: 'LST-002',
    batchId: 'WT-RJ-2026-00842',
    sellerId: 'SELLER-02',
    sellerName: 'Desert Wool Co.',
    type: 'YARN',
    title: 'Handspun Carpet Yarn',
    description: 'Premium Grade A wool sourced from Himalayan sheep farms. Washed, sorted and suitable for yarn production, weaving and textile manufacturing.',
    quantity: 150,
    price: 650,
    minPrice: 600, // Implies bidding is open
    unit: 'kg',
    status: 'Active',
    location: 'Bikaner, Rajasthan',
    rating: 4.6,
    verified: true
  };

  const cert = certificates.find(c => c.batchId === listing.batchId);
  const isBiddable = listing.minPrice && listing.minPrice < listing.price;

  const handleAddToCart = () => {
    addToCart({
      id: listing.id,
      name: listing.title,
      price: listing.price,
      sellerName: listing.sellerName,
      batchId: listing.batchId
    }, quantity);
    
    setAddedMsg(`${quantity} ${(listing.unit || 'kg').toUpperCase()} ${listing.title || 'Product'} added to your cart.`);
    setTimeout(() => setAddedMsg(''), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/seller/checkout');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      <button onClick={() => navigate('/seller/market')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Back to Marketplace
      </button>

      {addedMsg && (
        <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} /> ✓ {addedMsg}
          <button 
            style={{ marginLeft: 'auto', padding: '8px 16px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => navigate('/seller/cart')}
          >
            VIEW CART
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        {/* Left: Images */}
        <div>
          <div style={{ height: '400px', background: '#F8F8F3', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid #E5E5E5' }}>
            <img src={`https://placehold.co/800x600/EDEDCE/0B120D?text=${(listing.title || 'Product').replace(/ /g, '+')}`} alt={listing.title || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {cert && (
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#16A34A', color: '#FFF', padding: '8px 16px', borderRadius: '24px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} /> QUALITY VERIFIED
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <div style={{ width: '80px', height: '80px', background: '#F8F8F3', borderRadius: '8px', border: '2px solid #0B120D', cursor: 'pointer' }}><img src={`https://placehold.co/100/EDEDCE/0B120D?text=1`} alt="" style={{width: '100%', height: '100%'}}/></div>
            <div style={{ width: '80px', height: '80px', background: '#F8F8F3', borderRadius: '8px', border: '1px solid #E5E5E5', cursor: 'pointer' }}><img src={`https://placehold.co/100/EDEDCE/0B120D?text=2`} alt="" style={{width: '100%', height: '100%'}}/></div>
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{listing.type}</div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{listing.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: '700' }}><Star size={16} /> {listing.rating || '4.8'}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {listing.location || 'India'}</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}><Heart size={28} /></button>
          </div>

          <div style={{ fontSize: '36px', fontWeight: '800', color: '#0B120D', marginBottom: '24px' }}>
            ₹{listing.price || 0} <span style={{ fontSize: '16px', color: '#666', fontWeight: '400' }}>/ {listing.unit || 'kg'}</span>
          </div>

          <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Available Quantity</div>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>{listing.quantity} {(listing.unit || 'kg').toUpperCase()}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Minimum Order (MOQ)</div>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>10 {(listing.unit || 'kg').toUpperCase()}</div>
              </div>
              {cert && (
                <>
                  <div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Quality Grade</div>
                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>{cert.grade} <ShieldCheck size={16} /></div>
                  </div>
                  <div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Quality Score</div>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>{cert.qualityScore}/100</div>
                  </div>
                </>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700' }}>Select Quantity ({(listing.unit || 'kg').toUpperCase()}):</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', border: '1px solid #0B120D', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(Math.max(10, quantity - 10))} style={{ padding: '12px 16px', background: '#FFF', border: 'none', cursor: 'pointer', fontWeight: '800' }}>-</button>
                  <div style={{ padding: '12px 24px', fontWeight: '800', borderLeft: '1px solid #0B120D', borderRight: '1px solid #0B120D', background: '#F8F8F3', minWidth: '80px', textAlign: 'center' }}>{quantity}</div>
                  <button onClick={() => setQuantity(Math.min(listing.quantity || 100, quantity + 10))} style={{ padding: '12px 16px', background: '#FFF', border: 'none', cursor: 'pointer', fontWeight: '800' }}>+</button>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>
                  Subtotal: ₹{(quantity * (listing.price || 0)).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={handleAddToCart} style={{ padding: '16px', background: '#FFF', border: '1px solid #0B120D', color: '#0B120D', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
                ADD TO CART
              </button>
              <button onClick={handleBuyNow} style={{ padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
                BUY NOW
              </button>
            </div>
            
            {isBiddable && (
              <>
                <div style={{ textAlign: 'center', margin: '16px 0', color: '#666', fontWeight: '700' }}>OR</div>
                <div style={{ background: '#FFF', border: '1px solid #D97706', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#D97706', fontWeight: '800', fontSize: '14px' }}>OPEN FOR BIDDING</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>Current highest: ₹425/kg</div>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/seller/bids/${listing.batchId}`)} style={{ width: '100%', padding: '12px', background: '#FFF', color: '#D97706', border: '1px solid #D97706', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' }}>
                    PLACE BID
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Market Intelligence Reference */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '16px', borderRadius: '8px' }}>
            <Info color="#0284C7" />
            <div style={{ fontSize: '14px' }}>
              <strong style={{ color: '#0369A1' }}>MARKET REFERENCE</strong>
              <p style={{ margin: '4px 0 0 0', color: '#0C4A6E' }}>Listing price is ₹15/kg above the latest available market modal price (₹410/kg). Source: AGMARKNET via CEDA.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Bottom Content */}
      <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Product Details</h2>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '32px', maxWidth: '800px' }}>
          {listing.description}
        </p>

        {listing.batchId && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginBottom: '24px' }}>WOOLTRACE BATCH</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F8F8F3', padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Batch ID:</span> <strong>{listing.batchId}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Origin:</span> <strong>{listing.location}</strong></div>
                {cert && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Certificate:</span> <strong style={{ color: '#16A34A' }}>{cert.id}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Fiber Diameter:</span> <strong>{cert.micron}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>Clean Yield:</span> <strong>{cert.yield}</strong></div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginBottom: '24px' }}>TRACE THIS WOOL</h3>
              <div style={{ background: '#FFF', border: '1px solid #E5E5E5', padding: '24px', borderRadius: '12px' }}>
                <TraceabilityTimeline batchId={listing.batchId} />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '48px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginBottom: '24px' }}>LISTED BY</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F8F3', padding: '24px', borderRadius: '12px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', background: '#E5E5E5', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={32} color="#666" />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '18px' }}>{listing.sellerName}</div>
                <div style={{ color: '#16A34A', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                  ✓ VERIFIED SELLER
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>{listing.location}</div>
              </div>
            </div>
            <button style={{ padding: '8px 16px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>VIEW SELLER</button>
          </div>
        </div>

      </div>
    </div>
  );
}
