import React, { useState, useEffect } from 'react';
import { qaService } from '../../services/qa/qaService';
import { Award, Search, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const userStr = localStorage.getItem('wooltrace_user');
      const user = userStr ? JSON.parse(userStr) : { id: 'QA-01' };
      
      const data = await qaService.getRequests(); // We will fetch all and filter, or if there is a getCertificates method in qaService.
      // Wait, qaService has `getCertificate(id)` and `getCertificateByBatch(batchId)`. 
      // I should add `getAllCertificates` or just fetch from `/api/qa/certificates`.
      const res = await fetch(`/api/qa/certificates?inspectorId=${user.id}`);
      const result = await res.json();
      if(result.success) {
        setCertificates(result.data);
      } else {
        setCertificates([]);
      }
    } catch (e) {
      console.error(e);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="inspector-page-header">
        <h1>Issued Certificates</h1>
        <p>View and manage all quality certificates issued by you.</p>
      </div>

      <div className="qa-table-container">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading certificates...</div>
        ) : (
          <table className="qa-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Batch ID</th>
                <th>Issue Date</th>
                <th>Grade & Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No certificates issued yet.</td></tr>
              ) : certificates.map(cert => (
                <tr key={cert.certificateId}>
                  <td><strong>{cert.certificateId}</strong></td>
                  <td>{cert.batchId}</td>
                  <td>{new Date(cert.issuedAt).toLocaleDateString()}</td>
                  <td>
                    <strong>{cert.grade}</strong> 
                    <span style={{color: '#666', fontSize: 12, marginLeft: 8}}>{cert.overallScore}/100</span>
                  </td>
                  <td>
                    <span className="status-badge certificate_issued">{cert.status}</span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: 12}}>
                      <button 
                        onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0369A1', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 13 }}
                      >
                        <Eye size={16} /> VIEW
                      </button>
                      <button 
                        onClick={() => window.open(`/api/qa/download-certificate?id=${cert.certificateId}`, '_blank')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 13 }}
                      >
                        <Download size={16} /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
