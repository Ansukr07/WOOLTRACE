import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qaService } from '../../services/qa/qaService';
import { ClipboardList, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';

export default function InspectorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [metrics, setMetrics] = useState({
    pending: 0, completed: 0, issued: 0, rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await qaService.getRequests();
      setRequests(data);
      
      // Calculate dashboard metrics from backend response
      const pending = data.filter(r => r.status === 'PENDING_ASSIGNMENT' || r.status === 'ASSIGNED' || r.status === 'SCHEDULED' || r.status === 'IN_PROGRESS').length;
      const completed = data.filter(r => r.status === 'CERTIFICATE_ISSUED' || r.status === 'REJECTED').length;
      const issued = data.filter(r => r.status === 'CERTIFICATE_ISSUED').length;
      const rejected = data.filter(r => r.status === 'REJECTED').length;
      
      setMetrics({ pending, completed, issued, rejected });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (requestId) => {
    try {
      const userStr = localStorage.getItem('wooltrace_user');
      const user = userStr ? JSON.parse(userStr) : { id: 'QA-01' };
      
      await qaService.updateRequest(requestId, { status: 'ASSIGNED', inspectorId: user.id });
      loadRequests();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="inspector-page-header">
        <h1>Inspection Requests</h1>
        <p>Manage and process wool quality inspection requests.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Pending & In Progress</div>
          <div style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {metrics.pending}
            <Clock size={28} color="#F59E0B" />
          </div>
        </div>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Completed Inspections</div>
          <div style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {metrics.completed}
            <ClipboardList size={28} color="#3B82F6" />
          </div>
        </div>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Certificates Issued</div>
          <div style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {metrics.issued}
            <FileText size={28} color="#10B981" />
          </div>
        </div>
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Rejected Batches</div>
          <div style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {metrics.rejected}
            <XCircle size={28} color="#EF4444" />
          </div>
        </div>
      </div>

      <div className="qa-table-container">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading requests...</div>
        ) : (
          <table className="qa-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Date Requested</th>
                <th>Farmer</th>
                <th>Location</th>
                <th>Batch Info</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No requests found.</td></tr>
              ) : requests.map(req => (
                <tr key={req.requestId}>
                  <td><strong>{req.requestId}</strong></td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>{req.farmerName}</td>
                  <td>{req.location}</td>
                  <td>
                    <div>{req.batchId}</div>
                    <small style={{ color: '#666' }}>{req.quantity} KG • {req.woolType}</small>
                  </td>
                  <td>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {req.status === 'PENDING_ASSIGNMENT' && (
                      <button className="btn-qa" onClick={() => handleAssign(req.requestId)}>
                        Accept Assignment
                      </button>
                    )}
                    {req.status === 'ASSIGNED' && (
                      <button className="btn-qa" onClick={() => navigate(`/inspector/inspection/${req.requestId}`)}>
                        Start Inspection
                      </button>
                    )}
                    {req.status === 'CERTIFICATE_ISSUED' && (
                      <span style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={16} /> Certified
                      </span>
                    )}
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
