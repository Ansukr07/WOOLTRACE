import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { Gavel, Check, X, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bids = () => {
  const { user } = useAuth();
  const { listings, updateListing, addOrder } = useGlobalState();
  const navigate = useNavigate();

  // Bids on listings owned by this user
  const myListingsWithBids = listings.filter(l => l.sellerId === user.id && l.bids && l.bids.length > 0);

  // Bids placed by this user on other listings
  const myPlacedBids = listings
    .filter(l => l.bids?.some(b => b.buyerId === user.id))
    .map(l => ({
      listing: l,
      bid: l.bids.find(b => b.buyerId === user.id)
    }));

  const handleAcceptBid = (listing, bid) => {
    // 1. Update Bid Status
    const updatedBids = listing.bids.map(b => 
      b.id === bid.id ? { ...b, status: 'Accepted' } : { ...b, status: 'Rejected' }
    );
    
    updateListing(listing.id, { bids: updatedBids, status: 'Sold' });

    // 2. Create Order
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      buyerId: bid.buyerId,
      buyerName: bid.buyerName,
      totalAmount: bid.amount * listing.quantity,
      status: 'Pending', // Pending Escrow Payment
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: listing.id,
          name: listing.title,
          sellerId: listing.sellerId,
          sellerName: listing.sellerName,
          quantity: listing.quantity,
          unitPrice: bid.amount,
          unit: 'kg'
        }
      ]
    };

    addOrder(newOrder);
    alert('Bid accepted! An order has been created pending escrow payment.');
    navigate('/seller/orders');
  };

  const handleRejectBid = (listing, bid) => {
    const updatedBids = listing.bids.map(b => 
      b.id === bid.id ? { ...b, status: 'Rejected' } : b
    );
    updateListing(listing.id, { bids: updatedBids });
  };

  return (
    <div style={{padding: '32px'}}>
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
          Reverse Bidding
        </h1>
        <p style={{color: '#666', fontSize: '16px'}}>Manage offers on your listings and bids you've placed.</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
        {/* Received Bids */}
        <div>
          <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Store size={24} color="#16A34A" /> Received Offers (Selling)
          </h2>
          
          {myListingsWithBids.length === 0 ? (
            <div style={{padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', textAlign: 'center'}}>
              <p style={{color: '#666'}}>No offers received yet.</p>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {myListingsWithBids.map(listing => (
                <div key={listing.id} style={{backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <div>
                      <div style={{fontWeight: '700', fontSize: '18px'}}>{listing.title}</div>
                      <div style={{fontSize: '14px', color: '#666'}}>List Price: ₹{listing.price}/kg • Min Acceptable: ₹{listing.minPrice}/kg</div>
                    </div>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {listing.bids.map(bid => (
                      <div key={bid.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F8F8F3', borderRadius: '8px'}}>
                        <div>
                          <div style={{fontWeight: '700', fontSize: '15px'}}>{bid.buyerName}</div>
                          <div style={{fontSize: '13px', color: '#666'}}>{new Date(bid.date).toLocaleString()}</div>
                        </div>
                        
                        <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                          <div style={{textAlign: 'right'}}>
                            <div style={{fontWeight: '800', fontSize: '20px', color: bid.amount >= listing.minPrice ? '#16A34A' : '#D97706'}}>
                              ₹{bid.amount}/kg
                            </div>
                            <div style={{fontSize: '12px', color: '#666'}}>Total: ₹{(bid.amount * listing.quantity).toLocaleString()}</div>
                          </div>

                          {bid.status === 'Pending' && listing.status === 'Active' ? (
                            <div style={{display: 'flex', gap: '8px'}}>
                              <button 
                                onClick={() => handleAcceptBid(listing, bid)}
                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
                                title="Accept Offer"
                              >
                                <Check size={20} />
                              </button>
                              <button 
                                onClick={() => handleRejectBid(listing, bid)}
                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#FFFFFF', color: '#DC2626', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer'}}
                                title="Reject Offer"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ) : (
                            <div style={{
                              fontWeight: '700', fontSize: '13px', padding: '6px 12px', borderRadius: '20px',
                              backgroundColor: bid.status === 'Accepted' ? '#DCFCE7' : '#FEE2E2',
                              color: bid.status === 'Accepted' ? '#16A34A' : '#DC2626'
                            }}>
                              {bid.status}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placed Bids */}
        <div>
          <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Gavel size={24} color="#D97706" /> My Placed Bids (Buying)
          </h2>

          {myPlacedBids.length === 0 ? (
            <div style={{padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', textAlign: 'center'}}>
              <p style={{color: '#666'}}>You haven't placed any bids yet.</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
              {myPlacedBids.map(({listing, bid}) => (
                <div key={bid.id} style={{backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px'}}>
                  <div style={{fontWeight: '700', fontSize: '16px', marginBottom: '4px'}}>{listing.title}</div>
                  <div style={{fontSize: '13px', color: '#666', marginBottom: '16px'}}>Seller: {listing.sellerName}</div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F8F8F3', borderRadius: '8px'}}>
                    <div>
                      <div style={{fontSize: '12px', color: '#666'}}>My Offer</div>
                      <div style={{fontWeight: '800', fontSize: '18px', color: '#0B120D'}}>₹{bid.amount}/kg</div>
                    </div>
                    <div style={{
                      fontWeight: '700', fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                      backgroundColor: bid.status === 'Accepted' ? '#DCFCE7' : bid.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      color: bid.status === 'Accepted' ? '#16A34A' : bid.status === 'Rejected' ? '#DC2626' : '#D97706'
                    }}>
                      {bid.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Bids;
