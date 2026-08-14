import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qaService } from '../../services/qa/qaService';
import { ClipboardList, CheckCircle } from 'lucide-react';

export default function InspectorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await qaService.getRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (requestId) => {
    try {
      // Mock inspector ID for prototype
      await qaService.updateRequest(requestId, { status: 'ASSIGNED', inspectorId: 'WQI-41' });
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
