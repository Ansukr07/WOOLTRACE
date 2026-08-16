import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Search, Filter, Plus, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const { user } = useAuth();
  const { batches, certificates, listings } = useGlobalState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Find all batches that belong to this user
  // This could be batches they produced (farmer) or bought (seller)
  const myBatches = batches.filter(b => b.farmerId === user.id || b.ownerId === user.id);
  
  // Find which ones are listed
  const listedBatchIds = listings.filter(l => l.sellerId === user.id).map(l => l.batchId);

  const filteredBatches = myBatches.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{padding: '32px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
            My Inventory
          </h1>
          <p style={{color: '#666', fontSize: '16px'}}>Manage your raw wool batches and processed products.</p>
        </div>
        
        <button 
          onClick={() => navigate('/seller/list-wool')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
            backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', 
            borderRadius: '8px', fontWeight: '700', cursor: 'pointer'
          }}
        >
          <Plus size={20} /> ADD TO INVENTORY
        </button>
      </div>

      <div style={{backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
        <div style={{padding: '24px', borderBottom: '1px solid #E5E5E5', display: 'flex', gap: '16px'}}>
          <div style={{flex: 1, position: 'relative'}}>
            <Search size={20} color="#666" style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)'}} />
            <input 
              type="text" 
              placeholder="Search by batch ID or type..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px',
                border: '1px solid #E5E5E5', outline: 'none', fontSize: '15px'
              }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px',
            backgroundColor: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '8px',
            fontWeight: '600', color: '#0B120D', cursor: 'pointer'
          }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        <div style={{padding: '0'}}>
          <table className="stacked-table-mobile" style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#F8F8F3', borderBottom: '1px solid #E5E5E5', textAlign: 'left'}}>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Batch ID</th>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Type</th>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Quantity</th>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Status</th>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Certificate</th>
                <th style={{padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map(batch => {
                const isListed = listedBatchIds.includes(batch.id);
                const cert = certificates.find(c => c.batchId === batch.id);

                return (
                  <tr key={batch.id} style={{borderBottom: '1px solid #E5E5E5'}}>
                    <td data-label="Batch ID" style={{padding: '24px', fontWeight: '600', color: '#0B120D'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Package size={18} color="#16A34A" />
                        {batch.id}
                      </div>
                    </td>
                    <td data-label="Type" style={{padding: '24px', color: '#666'}}>{batch.type}</td>
                    <td data-label="Quantity" style={{padding: '24px', fontWeight: '600'}}>{batch.quantity} KG</td>
                    <td data-label="Status" style={{padding: '24px'}}>
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        backgroundColor: isListed ? '#DDFF86' : '#F8F8F3',
                        color: isListed ? '#0B120D' : '#666'
                      }}>
                        {isListed ? 'Listed on Market' : 'In Storage'}
                      </span>
                    </td>
                    <td data-label="Certificate" style={{padding: '24px'}}>
                      {cert ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '14px', fontWeight: '600'}}>
                          <CheckCircle size={16} /> Grade {cert.grade}
                        </div>
                      ) : (
                        <span style={{color: '#999', fontSize: '14px'}}>Pending QA</span>
                      )}
                    </td>
                    <td data-label="Actions" style={{padding: '24px'}}>
                      {!isListed ? (
                        <button 
                          onClick={() => navigate(`/seller/list-wool?batchId=${batch.id}`)}
                          style={{
                            padding: '8px 16px', backgroundColor: '#0B120D', color: '#FFF',
                            border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          List for Sale
                        </button>
                      ) : (
                        <button style={{
                          padding: '8px 16px', backgroundColor: '#F8F8F3', color: '#0B120D',
                          border: '1px solid #E5E5E5', borderRadius: '4px', fontWeight: '600', cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          Manage Listing
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan="6" style={{padding: '48px', textAlign: 'center', color: '#666'}}>
                    <Package size={48} color="#E5E5E5" style={{marginBottom: '16px'}} />
                    <p>No inventory found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
