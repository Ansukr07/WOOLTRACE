import React, { useState } from 'react';
import { 
  ArrowUpRight, Check, PackageCheck, AlertTriangle, 
  Boxes, ArrowRight, ShieldCheck, Plus, X, Building2, Truck
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WarehouseReleases() {
  const { batches, releaseRequests, requestBatchRelease, approveBatchRelease } = useGlobalState();

  const [isInitiatingRelease, setIsInitiatingRelease] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'WT-KA-2026-00124');
  const [releaseQuantity, setReleaseQuantity] = useState(200);
  const [requestedBy, setRequestedBy] = useState('Himalayan Wool Co. (Buyer)');
  const [destination, setDestination] = useState('Mysuru Spinning Mill No. 2');

  const selectedBatch = batches.find(b => b.id === selectedBatchId || b.batchId === selectedBatchId);
  const storedBatches = batches.filter(b => b.currentStage === 'WAREHOUSE');

  const maxStoredQty = selectedBatch ? selectedBatch.quantity : 0;
  const remainingQty = Math.max(0, maxStoredQty - Number(releaseQuantity));

  const handleBatchSelect = (e) => {
    const bId = e.target.value;
    setSelectedBatchId(bId);
    const b = batches.find(item => item.id === bId || item.batchId === bId);
    if (b) {
      setReleaseQuantity(Math.min(200, b.quantity));
    }
  };

  const handleCreateReleaseRequest = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    requestBatchRelease(selectedBatch.id || selectedBatch.batchId, Number(releaseQuantity), requestedBy, destination);
    setIsInitiatingRelease(false);
  };

  const handleApprove = (releaseId) => {
    approveBatchRelease(releaseId, 'K. Somanna (Warehouse Superintendent)');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowUpRight size={28} /> Warehouse Batch Releases
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
            Authorize full or partial releases for processing, mill dispatch, and buyer transit.
          </p>
        </div>
        <button
          onClick={() => setIsInitiatingRelease(true)}
          style={{
            background: '#0B120D',
            color: '#DDFF86',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} /> Request Batch Release
        </button>
      </div>

      {/* Release Queue List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {releaseRequests.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid rgba(11, 18, 13, 0.10)'
          }}>
            <PackageCheck size={48} color="#999" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0B120D', margin: '0 0 8px 0' }}>
              No Release Requests Pending
            </h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              All stored wool inventory is safely secured in allocated bays.
            </p>
          </div>
        ) : (
          releaseRequests.map((rel) => (
            <div
              key={rel.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(11, 18, 13, 0.10)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #EEE', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', background: '#0B120D', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                      {rel.id}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', margin: 0 }}>
                      Batch: {rel.batchId}
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    Requested by: <strong>{rel.requestedBy || rel.buyerName}</strong> · {new Date(rel.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: rel.status === 'Approved' ? '#DCFCE7' : '#FEF3C7',
                    color: rel.status === 'Approved' ? '#166534' : '#92400E'
                  }}>
                    {rel.status === 'Approved' ? '✓ Released & Dispatched' : 'Pending Approval'}
                  </span>
                </div>
              </div>

              {/* Partial Release Breakdown Box (Exact Prompt Requirement) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: '#EDEDCE',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', fontWeight: '700' }}>Stored in Bay</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
                    {rel.originalStoredQty} KG
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', fontWeight: '700' }}>Release Amount</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#DC2626' }}>
                    - {rel.releasedQty} KG
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', fontWeight: '700' }}>Remaining in Storage</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#166534' }}>
                    = {rel.remainingQty} KG
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#666' }}>
                <div>
                  <strong>Dispatch Destination:</strong> {rel.destination}
                </div>

                {rel.status === 'Pending' && (
                  <button
                    onClick={() => handleApprove(rel.id)}
                    style={{
                      background: '#0B120D',
                      color: '#DDFF86',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Check size={16} /> Approve & Dispatch Release
                  </button>
                )}

                {rel.status === 'Approved' && (
                  <div style={{ color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Approved by {rel.approvedBy}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Release Request Modal ── */}
      {isInitiatingRelease && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setIsInitiatingRelease(false)}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
                Create Wool Batch Release Request
              </h3>
              <button onClick={() => setIsInitiatingRelease(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReleaseRequest}>
              {/* Select Stored Batch */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>
                  Select Stored Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={handleBatchSelect}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {batches.map(b => (
                    <option key={b.id || b.batchId} value={b.id || b.batchId}>
                      {b.id || b.batchId} — Stored: {b.quantity} KG ({b.woolType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Qty */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>
                  Release Quantity (KG)
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxStoredQty}
                  value={releaseQuantity}
                  onChange={(e) => setReleaseQuantity(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </div>

              {/* Live Calculation Preview */}
              <div style={{
                background: '#F8F8F3',
                border: '1px solid rgba(11, 18, 13, 0.10)',
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Currently Stored:</span>
                  <strong>{maxStoredQty} KG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', color: '#DC2626' }}>
                  <span>To Release:</span>
                  <strong>- {releaseQuantity} KG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '800', color: '#166534', paddingTop: '6px', borderTop: '1px dashed #CCC' }}>
                  <span>Remaining Balance:</span>
                  <strong>{remainingQty} KG</strong>
                </div>
              </div>

              {/* Requested By & Destination */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>
                  Requester (Buyer / Farmer)
                </label>
                <input
                  type="text"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>
                  Processing Destination / Mill
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#0B120D',
                    color: '#DDFF86',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Submit Release Request
                </button>
                <button
                  type="button"
                  onClick={() => setIsInitiatingRelease(false)}
                  style={{
                    padding: '12px 20px',
                    background: '#F8F8F3',
                    border: '1px solid #CCC',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
