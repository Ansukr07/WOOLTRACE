import React from 'react';
import { CheckCircle2, ExternalLink, Phone, FileText, Calendar, X } from 'lucide-react';
import './SchemeDetailModal.css';

const schemeDetails = {
  'SWIS – Sheep & Wool Improvement Scheme': {
    description: 'The Sheep and Wool Improvement Scheme (SWIS) aims to improve sheep productivity and wool quality in India. It provides subsidized health camps, breed improvement services, and modern shearing equipment to registered sheep farmers.',
    eligibility: ['Registered sheep farmer with minimum 20 sheep', 'Member of a state sheep farmers cooperative', 'Aadhaar-linked bank account', 'Valid land record or animal husbandry registration'],
    benefits: ['Free veterinary health camps', 'Subsidized shearing machines (50% subsidy)', 'Breed improvement rams', 'Training in modern wool handling'],
    documents: ['Aadhaar card', 'Bank passbook', 'Animal husbandry registration certificate', 'Cooperative membership certificate'],
    applyUrl: 'https://texmin.nic.in',
    helpline: '1800-258-7150',
    deadline: 'Applications accepted year-round',
  },
  'IWIDP – Integrated Wool Improvement & Development Programme': {
    description: 'The Integrated Wool Improvement and Development Programme (IWIDP) by the Central Wool Development Board (CWDB) supports wool marketing infrastructure, Common Facility Centre (CFC) setup, and farmer training programs across wool-producing states.',
    eligibility: ['Active wool producing farmer or cooperative', 'Located in notified wool-producing district', 'Minimum annual production of 100 kg clean wool'],
    benefits: ['Access to Common Facility Centres (CFC) for grading and processing', 'Subsidized wool testing', 'Market linkage support', 'Annual training programs', 'Quality certification assistance'],
    documents: ['Farmer identity proof', 'Production records', 'Cooperative registration (if applicable)', 'Bank account details'],
    applyUrl: 'https://cwdb.gov.in',
    helpline: '0145-2637543',
    deadline: 'Annual application window: April–June',
  },
  'Pashmina Wool Development Scheme': {
    description: 'A specialized scheme by CWDB focused on Pashmina goat health improvement, procurement of dehairing machines, and international marketing support for Pashmina wool from Ladakh, Himachal Pradesh, and Jammu & Kashmir.',
    eligibility: ['Pashmina goat farmer in designated high-altitude zones', 'Registered with state animal husbandry department', 'J&K, Ladakh, Himachal Pradesh residents only'],
    benefits: ['Subsidized dehairing machines', 'Pashmina goat health camps', 'Direct market linkage with premium buyers', 'Export documentation support', 'GI tag assistance'],
    documents: ['State residency proof', 'Pashmina goat registration', 'Bank account details', 'Animal husbandry department certificate'],
    applyUrl: 'https://cwdb.gov.in/pashmina',
    helpline: '0145-2637543',
    deadline: 'Applications open: August–October',
  },
  'HDP – Human Development Programme': {
    description: 'The Human Development Programme (HDP) by CWDB provides skill development and vocational training for wool artisans, weavers, and herders. It covers modern shearing, carding, spinning, weaving, and dyeing techniques.',
    eligibility: ['Any wool artisan, weaver, or sheep farmer', 'No minimum production requirement', 'Age 18–55 years', 'Priority for women artisans and marginalized communities'],
    benefits: ['Free skill development training (5–30 days)', 'Stipend during training period', 'Tool kit after completion', 'Certificate recognized by CWDB'],
    documents: ['Aadhaar card', 'Age proof', 'Bank account details', 'Community certificate (if applicable)'],
    applyUrl: 'https://cwdb.gov.in/hdp',
    helpline: '0145-2637543',
    deadline: 'Rolling applications — training batches start monthly',
  },
};

export default function SchemeDetailModal({ scheme, onClose }) {
  const details = schemeDetails[scheme.name] || {
    description: 'Details not available.',
    eligibility: [],
    benefits: [],
    documents: [],
    applyUrl: '#',
    helpline: '',
    deadline: '',
  };

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-modal scheme-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="scheme-status">Active</div>
            <h2 className="modal-title">{scheme.name}</h2>
            <p className="modal-subtitle">{scheme.body || 'Government of India'}</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-content">
          <p className="scheme-desc">{details.description}</p>
          
          <div className="scheme-section">
            <h3 className="section-title">Eligibility Criteria</h3>
            <ul className="checklist">
              {details.eligibility.map((item, i) => (
                <li key={i}><CheckCircle2 size={16} className="text-lime" /> <span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="scheme-section">
            <h3 className="section-title">Key Benefits</h3>
            <ul className="checklist">
              {details.benefits.map((item, i) => (
                <li key={i}><CheckCircle2 size={16} className="text-lime" /> <span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="scheme-section">
            <h3 className="section-title">Required Documents</h3>
            <ul className="doc-list">
              {details.documents.map((item, i) => (
                <li key={i}><FileText size={16} /> <span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div className="scheme-meta">
            <div className="meta-item">
              <Calendar size={18} />
              <div>
                <strong>Deadline</strong>
                <p>{details.deadline}</p>
              </div>
            </div>
            <div className="meta-item">
              <Phone size={18} />
              <div>
                <strong>Helpline</strong>
                <p>{details.helpline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer action-footer">
          <a href={`tel:${details.helpline}`} className="secondary-btn">
            <Phone size={18} /> Call Helpline
          </a>
          <a href={details.applyUrl} target="_blank" rel="noreferrer" className="primary-btn">
            Apply Online <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
