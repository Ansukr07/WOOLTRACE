import React, { useState } from 'react';
import { ArrowLeft, Phone, Navigation, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const STATUS_STYLES = {
  Pending:     { bg: '#EDEDCE', color: '#0B120D', icon: <Clock size={13}/> },
  Accepted:    { bg: '#BED5E5', color: '#0B120D', icon: <CheckCircle size={13}/> },
  Scheduled:   { bg: '#DDFF86', color: '#0B120D', icon: <CheckCircle size={13}/> },
  'In Progress': { bg: '#FEF9C3', color: '#713F12', icon: <AlertCircle size={13}/> },
  Completed:   { bg: '#DCFCE7', color: '#166534', icon: <CheckCircle size={13}/> },
  Rejected:    { bg: '#FFAAA4', color: '#0B120D', icon: <XCircle size={13}/> },
};

function RequestDetail({ req, onBack }) {
  const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
  const displayDate = req.formData.date
    ? new Date(req.formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const createdDate = new Date(req.dateCreated).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <button className="back-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={16}/> Back to Requests
        </button>
        <h2 style={{ margin: 0, fontSize: 22 }}>Request Details</h2>
      </div>

      <div className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{req.provider.categoryLabel}</span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: style.bg, color: style.color,
            padding: '5px 12px', borderRadius: 20, fontWeight: 700, fontSize: 13
          }}>
            {style.icon} {req.status}
          </span>
        </div>

        {/* Provider */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{req.provider.name}</div>
          <div style={{ color: '#666', fontSize: 13 }}>Owner: {req.provider.owner}</div>
        </div>

        {/* Booking info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Batch', value: req.formData.batch },
            { label: 'Preferred Date', value: displayDate },
            { label: 'Request Sent', value: createdDate },
            { label: 'Service', value: req.provider.categoryLabel },
          ].map(item => (
            <div key={item.label} style={{ background: '#F8F8F3', padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#666', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Farmer contact */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Your Contact Info</div>
          <div style={{ color: '#333', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Name: {req.formData.name}</span>
            {req.formData.email && <span>Email: {req.formData.email}</span>}
            <span>Mobile: {req.formData.mobile}</span>
          </div>
        </div>

        {/* Message */}
        {req.formData.message && (
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Your Message</div>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{req.formData.message}</p>
          </div>
        )}

        {/* Provider response */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Provider Response</div>
          <div style={{ background: '#F8F8F3', padding: '12px 14px', borderRadius: 8, color: '#666', fontSize: 14 }}>
            Awaiting response from provider…
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <button
            className="btn-primary flex-1"
            onClick={() => window.open(`tel:${req.provider.phone}`)}
          >
            <Phone size={16}/> Call Provider
          </button>
          <button
            className="btn-secondary flex-1"
            onClick={() => window.open(
              `https://www.openstreetmap.org/directions?from=&to=${req.provider.lat},${req.provider.lng}`, '_blank'
            )}
          >
            <Navigation size={16}/> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyRequests({ requests, onBack }) {
  const [detailReq, setDetailReq] = useState(null);

  if (detailReq) {
    return <RequestDetail req={detailReq} onBack={() => setDetailReq(null)} />;
  }

  return (
    <div className="my-requests-view">
      <div>
        <button className="back-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', marginBottom: 8 }}>
          <ArrowLeft size={16}/> Back to Services
        </button>
        <h2 style={{ margin: 0, fontSize: 22 }}>My Service Requests</h2>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>Track the status of your booked services.</p>
      </div>

      {requests.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '48px 24px', color: '#666' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ margin: 0 }}>You have no service requests yet.</p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>Find a nearby provider and request a service.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {requests.map(req => {
            const style = STATUS_STYLES[req.status] || STATUS_STYLES.Pending;
            const displayDate = req.formData.date
              ? new Date(req.formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : '—';
            return (
              <div key={req.id} className="panel" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>{req.provider.categoryLabel}</div>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>{req.provider.name}</div>
                  <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span><strong>Batch:</strong> {req.formData.batch}</span>
                    <span><strong>Date:</strong> {displayDate}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: style.bg, color: style.color,
                    padding: '4px 10px', borderRadius: 14, fontWeight: 700, fontSize: 12,
                    whiteSpace: 'nowrap'
                  }}>
                    {style.icon} {req.status}
                  </span>
                  <button className="btn-view" onClick={() => setDetailReq(req)}>View Details</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
