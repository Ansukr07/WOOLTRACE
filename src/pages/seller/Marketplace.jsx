import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Filter, ChevronDown, Check, Star, Layers, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWoolKart } from '../../context/WoolKartContext';
import { useAuth } from '../../context/AuthContext';

export default function Marketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listings, certificates, woolLots, submitOffer } = useGlobalState();
  const { addToCart } = useWoolKart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [offerQty, setOfferQty] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const categories = [
    { id: 'ALL', name: 'ALL' },
    { id: 'RAW_WOOL_LOTS', name: 'TRACEABLE WOOL LOTS' },
    { id: 'RAW_WOOL', name: 'RAW FLEECE' },
    { id: 'YARN', name: 'WOOL YARN' },
    { id: 'FABRIC', name: 'WOOL FABRIC' },
    { id: 'PRODUCTS', name: 'WOOL PRODUCTS' }
  ];

  const displayListings = [
    ...listings,
    {
      id: 'LST-002',
      batchId: 'WT-RJ-2026-00842',
      sellerId: 'SELLER-02',
      sellerName: 'Desert Wool Co.',
      type: 'YARN',
      title: 'Handspun Carpet Yarn',
      description: 'Coarse yarn perfect for hand-knotted carpets. Natural beige.',
      quantity: 150,
      price: 650,
      unit: 'kg',
      status: 'Active',
      location: 'Bikaner, Rajasthan',
      rating: 4.6,
      verified: true
    },
    {
      id: 'LST-003',
      batchId: 'WT-HP-2026-00411',
      sellerId: 'SELLER-03',
      sellerName: 'Himalayan Weavers',
      type: 'RAW_WOOL',
      title: 'Fine Himalayan Wool',
      description: 'Extremely fine wool from high-altitude sheep.',
      quantity: 80,
      price: 1200,
      unit: 'kg',
      status: 'Active',
      location: 'Kullu, Himachal Pradesh',
      rating: 4.9,
      verified: true
    }
  ];

  const filteredListings = displayListings.filter(l => {
    const matchesCategory = selectedCategory === 'ALL' || l.type === selectedCategory;
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredLots = (woolLots || []).filter(lot => {
    const matchesSearch = lot.woolType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lot.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lot.origin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenOfferModal = (lot) => {
    setSelectedLotForOffer(lot);
    setOfferedPrice(lot.askingPrice);
    setOfferQty(lot.availableQuantity);
    setShowOfferModal(true);
  };

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    submitOffer({
      lotId: selectedLotForOffer.id,
      lotNumber: selectedLotForOffer.lotNumber,
      sellerId: selectedLotForOffer.sellerId,
      sellerName: selectedLotForOffer.sellerName,
      buyerId: user?.id || 'BUYER-01',
      buyerName: user?.name || 'Verified Textile Buyer',
      buyerType: 'PROCESSOR',
      woolType: selectedLotForOffer.woolType,
      qualityGrade: selectedLotForOffer.qualityGrade,
      offeredPricePerKg: Number(offeredPrice),
      quantityKg: Number(offerQty),
      totalGrossAmount: Number(offeredPrice) * Number(offerQty),
      paymentTerms: '100% WoolTrace Digital Escrow Vault',
      deliveryTerms: 'Buyer pickup from storage depot',
      note: offerNote || 'Commercial procurement offer.'
    });

    setShowOfferModal(false);
    setToastMsg(`✓ Digital offer of ₹${offeredPrice}/KG submitted on Lot ${selectedLotForOffer.lotNumber}!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div style={{ padding: '32px', background: '#F8F8F3', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#0B120D', color: '#DDFF86', padding: '12px 20px',
          borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div style={{ background: '#0B120D', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: '#DDFF86' }}>
          SOURCE VERIFIED WOOL DIRECT FROM PRODUCERS
        </h1>
        <p style={{ fontSize: '16px', color: '#E5E5E5', marginBottom: '28px', maxWidth: '650px', margin: '0 auto 28px' }}>
          Discover traceable wool lots, certified quality fleeces, and artisan batches backed by WoolTrace Digital Identity and Escrow Protection.
        </p>

        <div style={{ display: 'flex', gap: '12px', maxWidth: '650px', margin: '0 auto 20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="text" 
              placeholder="Search lots, varieties, origin, QA certificates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '8px', border: 'none', fontSize: '15px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', fontWeight: '700' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFF' }}><Check size={16} color="#DDFF86" /> Traceability Verified</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFF' }}><Check size={16} color="#DDFF86" /> 100% Escrow Vault</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFF' }}><Check size={16} color="#DDFF86" /> Multi-Batch FPO Lots</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '20px', 
              fontWeight: '700', 
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedCategory === cat.id ? '#0B120D' : '#FFFFFF',
              color: selectedCategory === cat.id ? '#FFF' : '#0B120D',
              border: selectedCategory === cat.id ? 'none' : '1px solid rgba(11,18,13,0.12)'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Verified Traceable Wool Lots Section ── */}
      {(selectedCategory === 'ALL' || selectedCategory === 'RAW_WOOL_LOTS') && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0B120D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} color="#166534" />
              <span>Available Farm & FPO Lots ({filteredLots.length})</span>
            </h2>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Backed by Digital Traceability Passport</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredLots.map(lot => (
              <div key={lot.id} style={{
                background: '#FFFFFF', border: '1px solid rgba(11,18,13,0.12)', borderRadius: '14px',
                padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(11,18,13,0.04)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{
                        background: lot.isFpoAggregate ? '#DDFF86' : '#EDEDCE',
                        color: '#0B120D', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800'
                      }}>
                        {lot.isFpoAggregate ? 'FPO BULK AGGREGATE' : 'FARMER DIRECT LOT'}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '8px 0 2px 0', color: '#0B120D' }}>
                        {lot.woolType}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        Origin: {lot.origin} · Seller: <strong>{lot.sellerName}</strong>
                      </div>
                    </div>

                    <span style={{
                      background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800'
                    }}>
                      Grade {lot.qualityGrade}
                    </span>
                  </div>

                  <div style={{ background: '#F8F8F3', borderRadius: '8px', padding: '12px', margin: '12px 0', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Available Volume:</span>
                      <strong>{lot.availableQuantity} KG</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Asking Price:</span>
                      <strong style={{ color: '#166534', fontSize: '15px' }}>₹{lot.askingPrice}/KG</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>QA Certificate:</span>
                      <a href={lot.traceabilityUrl} target="_blank" rel="noreferrer" style={{ color: '#2563EB', fontWeight: '700' }}>
                        ✓ {lot.certificateId}
                      </a>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 14px 0' }}>
                    {lot.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={lot.traceabilityUrl}
                    style={{
                      flex: 1, textAlign: 'center', padding: '10px', background: '#F8F8F3',
                      border: '1px solid rgba(11,18,13,0.15)', borderRadius: '8px',
                      fontSize: '12px', fontWeight: '700', color: '#0B120D', textDecoration: 'none'
                    }}
                  >
                    Traceability Passport
                  </a>
                  <button
                    onClick={() => handleOpenOfferModal(lot)}
                    style={{
                      flex: 1, padding: '10px', background: '#0B120D', color: '#DDFF86',
                      border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    Make Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Products Grid */}
      {(selectedCategory !== 'RAW_WOOL_LOTS') && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0B120D', marginBottom: '16px' }}>
            Processed Yarn, Fabrics & Goods ({filteredListings.length})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredListings.map(listing => {
              const cert = certificates.find(c => c.batchId === listing.batchId);
              
              return (
                <div key={listing.id} style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', background: '#EDEDCE', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0B120D' }}>{listing.title}</span>
                    {cert && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#16A34A', color: '#FFF', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> VERIFIED
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#666', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>{listing.type}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{listing.title}</h3>
                    
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#0B120D', marginBottom: '12px' }}>
                      ₹{listing.price} <span style={{ fontSize: '13px', color: '#666', fontWeight: '400' }}>/ {listing.unit}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button onClick={() => navigate(`/seller/product/${listing.id}`)} style={{ flex: 1, padding: '10px', background: '#FFF', border: '1px solid #0B120D', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                        DETAILS
                      </button>
                      <button onClick={() => {
                        addToCart({
                          id: listing.id,
                          name: listing.title,
                          price: listing.price,
                          sellerName: listing.sellerName,
                          batchId: listing.batchId
                        }, 10);
                        alert(`${listing.title} added to cart!`);
                      }} style={{ flex: 1, padding: '10px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Make Digital Offer */}
      {showOfferModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,18,13,0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Make Digital Offer on Lot</h3>
              <button onClick={() => setShowOfferModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              Submitting offer to <strong>{selectedLotForOffer?.sellerName}</strong> for <strong>{selectedLotForOffer?.woolType}</strong>.
            </p>

            <form onSubmit={handleSubmitOffer}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Offered Price (₹ / KG)</label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  required
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Quantity (KG)</label>
                <input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(e.target.value)}
                  required
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Delivery & Notes</label>
                <textarea
                  rows="3"
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder="Specify pickup depot or mill delivery preference..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowOfferModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #0B120D', background: 'transparent', fontWeight: '700' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#0B120D', color: '#DDFF86', fontWeight: '800' }}>Submit Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}