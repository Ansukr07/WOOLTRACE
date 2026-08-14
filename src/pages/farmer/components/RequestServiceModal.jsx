import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0]; // e.g. "2026-08-14"

const RequestServiceModal = ({ provider, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    batch: '',
    name: '',
    email: '',
    mobile: '',
    date: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill name/mobile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wooltrace_user');
    if (stored) {
      const u = JSON.parse(stored);
      setFormData(prev => ({ ...prev, name: u.name || '', mobile: u.mobile || '' }));
    }
  }, []);

  const activeBatches = [
    { id: 'WT-KA-2026-00124', qty: '428 KG', type: 'Medium Wool', grade: 'Grade Pending' },
    { id: 'WT-KA-2026-00109', qty: '505 KG', type: 'Coarse Wool', grade: 'Grade B' },
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.batch) e.batch = 'Please select a batch.';
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Enter a valid email address.';
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s/g, '')))
      e.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (!formData.date) e.date = 'Please choose a preferred date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (!provider) return null;

  /* ── Confirmation ── */
  if (submitted) {
    const displayDate = formData.date
      ? new Date(formData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    return (
      <div className="modal-overlay">
        <div className="modal-content success-modal" style={{ maxWidth: 420 }}>
          <div className="success-icon">✅</div>
          <h3 style={{ margin: '0 0 8px' }}>Service Request Sent!</h3>
          <p style={{ color: '#555', margin: '0 0 16px' }}>Your request has been sent to:<br />
            <strong>{provider.name}</strong>
          </p>
          <div className="summary-box">
            <div><strong>Service:</strong> {provider.categoryLabel}</div>
            <div><strong>Batch:</strong> {formData.batch}</div>
            <div><strong>Preferred Date:</strong> {displayDate}</div>
          </div>
          <p style={{ fontSize: 13, color: '#666', margin: '16px 0' }}>
            The service provider will contact you shortly.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary flex-1" onClick={onClose}>Done</button>
            <button
              className="btn-primary flex-1"
              onClick={() => { onSubmit(formData, provider); }}
            >
              View Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="modal-overlay">
      <div className="modal-content request-modal">
        <div className="modal-header">
          <h3>Request for {provider.categoryLabel} Service</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* 1. Batch */}
          <div className="form-group">
            <label>1. Choose Your Batch <span className="req">*</span></label>
            <select name="batch" value={formData.batch} onChange={handleChange}>
              <option value="">— Select a batch —</option>
              {activeBatches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} · {b.qty} · {b.type} · {b.grade}
                </option>
              ))}
            </select>
            {errors.batch && <span className="error-text"><AlertCircle size={12}/> {errors.batch}</span>}
          </div>

          {/* 2 & 3. Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>2. Your Name <span className="req">*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
              {errors.name && <span className="error-text"><AlertCircle size={12}/> {errors.name}</span>}
            </div>
            <div className="form-group">
              <label>3. Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              {errors.email && <span className="error-text"><AlertCircle size={12}/> {errors.email}</span>}
            </div>
          </div>

          {/* 4 & 5. Mobile + Service */}
          <div className="form-row">
            <div className="form-group">
              <label>4. Mobile Number <span className="req">*</span></label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
              {errors.mobile && <span className="error-text"><AlertCircle size={12}/> {errors.mobile}</span>}
            </div>
            <div className="form-group">
              <label>5. Service</label>
              <input value={provider.categoryLabel} disabled className="disabled-input" readOnly />
            </div>
          </div>

          {/* 6. Date */}
          <div className="form-group">
            <label>6. Preferred Date <span className="req">*</span></label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} min={todayStr} />
            {errors.date && <span className="error-text"><AlertCircle size={12}/> {errors.date}</span>}
          </div>

          {/* 7. Message */}
          <div className="form-group">
            <label>7. Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Tell the service provider anything they should know about your wool batch…"
            />
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', background: 'transparent', padding: 0, marginTop: 8 }}>
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1">Request Service</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestServiceModal;
