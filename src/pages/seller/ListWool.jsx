import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ArrowRight, Box, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const ListWool = () => {
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get('batchId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches, certificates, addListing } = useGlobalState();

  const [selectedBatchId, setSelectedBatchId] = useState(batchIdParam || '');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    minPrice: '',
    allowBidding: true
  });

  // Find user's unlisted batches
  const availableBatches = batches.filter(b => (b.farmerId === user.id || b.ownerId === user.id));

  // Current selected batch
  const selectedBatch = availableBatches.find(b => b.id === selectedBatchId);
  const selectedCert = certificates.find(c => c.batchId === selectedBatchId);

  useEffect(() => {
    if (selectedBatch) {
      setFormData(prev => ({
        ...prev,
        title: prev.title || `Premium ${selectedBatch.type} Wool`,
        description: prev.description || `High quality ${selectedBatch.type} wool from ${selectedBatch.location}. Batch: ${selectedBatch.id}.`
      }));
    }
  }, [selectedBatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const newListing = {
      id: `LST-${Math.floor(Math.random() * 10000)}`,
      batchId: selectedBatch.id,
      sellerId: user.id,
      sellerName: user.name,
      type: 'RAW_WOOL',
      title: formData.title,
      description: formData.description,
      quantity: selectedBatch.quantity,
      price: Number(formData.price),
      minPrice: formData.allowBidding ? Number(formData.minPrice) : Number(formData.price),
      unit: 'kg',
      status: 'Active',
      createdAt: new Date().toISOString(),
      bids: []
    };

    addListing(newListing);
    alert('Wool successfully listed on WoolKart!');
    navigate('/seller/inventory');
  };

  return (
    <div style={{padding: '32px', maxWidth: '800px'}}>
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
          List Wool For Sale
        </h1>
        <p style={{color: '#666', fontSize: '16px'}}>Publish your batch to WoolKart for buyers across India.</p>
      </div>

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
        
        {/* Step 1: Select Batch */}
        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
          <h2 style={{fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Box size={20} /> Select Batch
          </h2>
          
          <select 
            value={selectedBatchId} 
            onChange={e => setSelectedBatchId(e.target.value)}
            required
            style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px'}}
          >
            <option value="">-- Choose a batch from your inventory --</option>
            {availableBatches.map(b => (
              <option key={b.id} value={b.id}>
                {b.id} - {b.type} ({b.quantity} KG)
              </option>
            ))}
          </select>

          {selectedBatch && (
            <div style={{marginTop: '16px', padding: '16px', backgroundColor: '#F8F8F3', borderRadius: '8px', border: '1px solid #E5E5E5'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                <span style={{color: '#666', fontWeight: '600'}}>Quantity Available:</span>
                <span style={{fontWeight: '700', color: '#0B120D'}}>{selectedBatch.quantity} KG</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#666', fontWeight: '600'}}>Quality Certification:</span>
                {selectedCert ? (
                  <span style={{fontWeight: '700', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <ShieldCheck size={16} /> Certified (Grade {selectedCert.grade})
                  </span>
                ) : (
                  <span style={{fontWeight: '700', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <AlertTriangle size={16} /> Pending QA
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Listing Details */}
        {selectedBatch && (
          <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <h2 style={{fontSize: '18px', fontWeight: '700', marginBottom: '16px'}}>Listing Details</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0B120D'}}>Listing Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px'}}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0B120D'}}>Description</label>
                <textarea 
                  required 
                  rows="4"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px', resize: 'vertical'}}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Bidding */}
        {selectedBatch && (
          <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <h2 style={{fontSize: '18px', fontWeight: '700', marginBottom: '16px'}}>Pricing & Sales Type</h2>
            
            <div style={{display: 'flex', gap: '24px', marginBottom: '24px'}}>
              <div style={{flex: 1}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0B120D'}}>Direct Buy Price (₹/kg)</label>
                <div style={{position: 'relative'}}>
                  <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontWeight: '600'}}>₹</span>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    style={{width: '100%', padding: '12px 16px 12px 32px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px'}}
                  />
                </div>
              </div>

              {formData.allowBidding && (
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#0B120D'}}>Minimum Bid Price (₹/kg)</label>
                  <div style={{position: 'relative'}}>
                    <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontWeight: '600'}}>₹</span>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={formData.minPrice}
                      onChange={e => setFormData({...formData, minPrice: e.target.value})}
                      style={{width: '100%', padding: '12px 16px 12px 32px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px'}}
                    />
                  </div>
                </div>
              )}
            </div>

            <label style={{display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                checked={formData.allowBidding}
                onChange={e => setFormData({...formData, allowBidding: e.target.checked})}
                style={{width: '18px', height: '18px', cursor: 'pointer'}}
              />
              <span style={{fontWeight: '600', color: '#0B120D'}}>Allow buyers to negotiate / place reverse bids</span>
            </label>
          </div>
        )}

        {selectedBatch && (
          <button 
            type="submit" 
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
              width: '100%', padding: '16px', backgroundColor: '#0B120D', color: '#DDFF86', 
              border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '16px'
            }}
          >
            PUBLISH TO MARKETPLACE <ArrowRight size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default ListWool;
