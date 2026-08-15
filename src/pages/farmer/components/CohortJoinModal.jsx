import React, { useState } from 'react';
import { Users, MapPin, Clock, CheckCircle2, X } from 'lucide-react';
import './CohortJoinModal.css';

export default function CohortJoinModal({ cohort, onClose }) {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    language: 'Hindi',
    village: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-modal cohort-modal" onClick={(e) => e.stopPropagation()}>
        {step === 'form' ? (
          <>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{cohort.village || 'Village Learning Group'}</h2>
                <p className="modal-subtitle">{cohort.state || 'State'}</p>
              </div>
              <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>
            
            <div className="modal-content">
              <div className="cohort-chips">
                <div className="chip"><Users size={14}/> {cohort.learners || 0} Learners</div>
                <div className="chip"><CheckCircle2 size={14}/> {cohort.attendance || '0%'} Attendance</div>
                <div className="chip"><Clock size={14}/> {cohort.next || 'TBD'}</div>
              </div>
              
              <div className="cohort-focus">
                <strong>Current Focus:</strong> {cohort.focus || 'General'}
              </div>

              <form className="join-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select name="language" required value={formData.language} onChange={handleChange}>
                    {['English', 'Hindi', 'Gujarati', 'Rajasthani', 'Kashmiri', 'Marathi', 'Bengali', 'Punjabi', 'Telugu', 'Kannada', 'Tamil', 'Urdu'].map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Village/District</label>
                  <input type="text" name="village" required value={formData.village} onChange={handleChange} placeholder="Enter your village or district" />
                </div>
                <button type="submit" className="join-submit-btn">Join Group</button>
              </form>
            </div>
          </>
        ) : (
          <div className="success-content">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={64} className="success-icon" />
            </div>
            <h2 className="success-title">You've joined!</h2>
            <p className="success-message">Welcome to the <strong>{cohort.village}</strong> learning group.</p>
            
            <div className="success-details">
              <div className="success-detail-row">
                <Clock size={16} />
                <span><strong>Next session:</strong> {cohort.next}</span>
              </div>
              <div className="success-detail-row">
                <MapPin size={16} />
                <span><strong>Location:</strong> {cohort.village}, {cohort.state}</span>
              </div>
            </div>

            <button className="done-btn" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
