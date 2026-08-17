import React, { useState } from 'react';
import { Truck, Send, X, Calendar, MapPin } from 'lucide-react';

const DispatchModal = ({ batch, onConfirm, onClose }) => {
  const [destination, setDestination] = useState(batch?.destination || 'Bengaluru Textile Unit');
  const [transportPartner, setTransportPartner] = useState('Rapid Farm Logistics');
  const [expectedDispatch, setExpectedDispatch] = useState('2026-08-16T09:00');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(batch.batchId || batch.id, destination, transportPartner, expectedDispatch, notes);
  };

  return (
    <div className="processing-modal-overlay">
      <div className="processing-modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3><Truck size={18} /> DISPATCH BATCH</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px' }}>
            <div className="modal-info-box" style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
              <div style={{ margin: '4px 0' }}><strong>Batch ID:</strong> {batch?.batchId}</div>
              <div style={{ margin: '4px 0' }}><strong>Quantity:</strong> <span style={{ color: '#16A34A', fontWeight: '700' }}>{batch?.quantity} KG</span> ({batch?.woolType || 'Processed Wool'})</div>
              <div style={{ margin: '4px 0' }}><strong>Status:</strong> <span style={{ color: '#9333EA', fontWeight: '600' }}>READY TO SHIP</span></div>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}><MapPin size={14} /> Destination Facility</label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }}
              >
                <option value="Bengaluru Textile Unit">Bengaluru Textile Unit (142.5 KM)</option>
                <option value="Mysuru Weaving Guild">Mysuru Weaving Guild (8.4 KM)</option>
                <option value="Coimbatore Textile Park">Coimbatore Textile Park (210.0 KM)</option>
                <option value="Tirupur Spinning Mills">Tirupur Spinning Mills (185.2 KM)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}><Truck size={14} /> Transport Partner</label>
              <select 
                value={transportPartner} 
                onChange={(e) => setTransportPartner(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }}
              >
                <option value="Rapid Farm Logistics">Rapid Farm Logistics (Verified Partner)</option>
                <option value="VRL Logistics Wool Division">VRL Logistics Wool Division</option>
                <option value="KSRTC Cargo Freight">KSRTC Cargo Freight</option>
                <option value="Self-Arranged Factory Transport">Self-Arranged Factory Transport</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}><Calendar size={14} /> Expected Dispatch Date & Time</label>
              <input 
                type="datetime-local" 
                value={expectedDispatch}
                onChange={(e) => setExpectedDispatch(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Dispatch Notes / Handling Instructions</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Moisture-proof sealed packaging, handle with care..."
                rows="3"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderRadius: '0 0 12px 12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-purple" style={{ background: '#9333EA', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <Send size={16} /> Confirm Dispatch & Notify Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchModal;