import React, { useState } from 'react';
import { 
  Inbox, Check, X, ShieldCheck, AlertCircle, FileText, 
  Calendar, Clock, User, ArrowRight
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WarehouseRequests() {
  const { warehouseRequests, respondStorageRequest } = useGlobalState();
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);

  const handleAccept = (reqId) => {
    respondStorageRequest(reqId, 'ACCEPT');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;

    respondStorageRequest(rejectingRequestId, 'REJECT', rejectionReason);
    setRejectingRequestId(null);
    setRejectionReason('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Inbox size={28} /> Farmer Storage Inquiries & Requests
        </h1>
        <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
          Review incoming wool batch reservation requests, verify volume requirements, and approve bookings.
        </p>
      </div>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {warehouseRequests.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid rgba(11, 18, 13, 0.10)'
          }}>
            <Inbox size={48} color="#999" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0B120D', margin: '0 0 8px 0' }}>
              No Storage Requests
            </h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              There are currently no pending or historical storage requests in the queue.
            </p>
          </div>
        ) : (
          warehouseRequests.map((req) => (
            <div
              key={req.id}
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
                    <span style={{ fontSize: '12px', fontWeight: '800', background: '#0B120D', color: '#DDFF86', padding: '2px 8px', borderRadius: '4px' }}>
                      {req.id}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', margin: 0 }}>
                      Batch: {req.batchId}
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    Submitted: {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: req.status === 'Approved' ? '#DCFCE7' : req.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                    color: req.status === 'Approved' ? '#166534' : req.status === 'Rejected' ? '#991B1B' : '#92400E'
                  }}>
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Request Metadata Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                background: '#F8F8F3',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Farmer Name</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D' }}>{req.farmerName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Quantity & Wool Type</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D' }}>{req.quantity} KG ({req.woolType})</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Duration & Start Date</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D' }}>{req.storageDuration} (from {req.startDate})</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Storage Type</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D' }}>{req.storageType}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Estimated Value</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#166534' }}>₹{req.estimatedCost?.toLocaleString()}</div>
                </div>
              </div>

              {req.additionalMessage && (
                <div style={{ background: '#EDEDCE', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#0B120D' }}>
                  <strong>Farmer Message:</strong> "{req.additionalMessage}"
                </div>
              )}

              {req.rejectionReason && (
                <div style={{ background: '#FEE2E2', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#991B1B' }}>
                  <strong>Rejection Reason:</strong> {req.rejectionReason}
                </div>
              )}

              {/* Actions if Pending */}
              {req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleAccept(req.id)}
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
                    <Check size={16} /> Accept Request
                  </button>

                  <button
                    onClick={() => setRejectingRequestId(req.id)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #DC2626',
                      color: '#DC2626',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <X size={16} /> Reject Request
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reject Modal with Mandatory Reason */}
      {rejectingRequestId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setRejectingRequestId(null)}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
              Decline Storage Request
            </h3>
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px 0' }}>
              Please provide a clear reason for rejecting Request #{rejectingRequestId}. The farmer will receive this feedback.
            </p>

            <form onSubmit={handleConfirmReject}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>
                  Rejection Reason *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Bay currently fully booked for designated dates, minimum batch volume not met..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CCC',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingRequestId(null)}
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
