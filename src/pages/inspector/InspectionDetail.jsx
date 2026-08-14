import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { qaService } from '../../services/qa/qaService';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    fiberDiameter: '',
    cleanliness: '',
    moisture: '',
    color: 'Natural White',
    strength: 'Good',
    contamination: 'Low',
    foreignMatter: 'Low',
    overallScore: '',
    grade: '',
    remarks: ''
  });

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await qaService.getRequestById(id);
      setRequest(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!form.grade || !form.overallScore) {
      alert("Please select a grade and overall score.");
      return;
    }
    const confirmApprove = window.confirm(`Approve Quality Certificate?\n\nYou are about to approve the quality certificate for Batch ${request.batchId} with Grade ${form.grade} and Score ${form.overallScore}/100.`);
    if (!confirmApprove) return;

    try {
      await qaService.issueCertificate({
        batchId: request.batchId,
        requestId: request.requestId,
        farmerName: request.farmerName,
        origin: request.location,
        quantity: request.quantity,
        woolType: request.woolType,
        inspectorId: 'WQI-41',
        ...form
      });
      alert('Certificate generated successfully!');
      navigate('/inspector');
    } catch (e) {
      console.error(e);
      alert('Error generating certificate');
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    try {
      await qaService.updateRequest(id, { status: 'REJECTED' });
      alert('Batch rejected.');
      navigate('/inspector');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!request) return <div style={{ padding: 40 }}>Request not found.</div>;

  return (
    <div>
      <button 
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontWeight: 700 }}
        onClick={() => navigate('/inspector')}
      >
        <ArrowLeft size={16} /> Back to Requests
      </button>

      <div className="inspector-page-header">
        <h1>Quality Inspection Form</h1>
        <p>Record quality parameters and finalize grading decision.</p>
      </div>

      <div className="inspection-detail-card">
        <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #EEE', paddingBottom: 12 }}>Request Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 30 }}>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Request ID</label><div><strong>{request.requestId}</strong></div></div>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Batch ID</label><div><strong>{request.batchId}</strong></div></div>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Farmer</label><div>{request.farmerName}</div></div>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Location</label><div>{request.location}</div></div>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Quantity & Type</label><div>{request.quantity} KG • {request.woolType}</div></div>
          <div><label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Preferred Date</label><div>{new Date(request.preferredDate).toLocaleDateString()}</div></div>
        </div>

        <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #EEE', paddingBottom: 12 }}>Quality Assessment</h3>
        <div className="qa-form-grid">
          <div className="qa-form-group">
            <label>Fiber Diameter (μm)</label>
            <input type="number" placeholder="e.g. 28" value={form.fiberDiameter} onChange={e => setForm({...form, fiberDiameter: e.target.value})} />
          </div>
          <div className="qa-form-group">
            <label>Cleanliness (%)</label>
            <input type="number" placeholder="e.g. 92" value={form.cleanliness} onChange={e => setForm({...form, cleanliness: e.target.value})} />
          </div>
          <div className="qa-form-group">
            <label>Moisture (%)</label>
            <input type="number" placeholder="e.g. 8" value={form.moisture} onChange={e => setForm({...form, moisture: e.target.value})} />
          </div>
          <div className="qa-form-group">
            <label>Color</label>
            <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
          </div>
          <div className="qa-form-group">
            <label>Strength</label>
            <select value={form.strength} onChange={e => setForm({...form, strength: e.target.value})}>
              <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
            </select>
          </div>
          <div className="qa-form-group">
            <label>Contamination</label>
            <select value={form.contamination} onChange={e => setForm({...form, contamination: e.target.value})}>
              <option>None</option><option>Low</option><option>Moderate</option><option>High</option>
            </select>
          </div>
          <div className="qa-form-group">
            <label>Overall Score (out of 100)</label>
            <input type="number" max="100" placeholder="e.g. 87" value={form.overallScore} onChange={e => setForm({...form, overallScore: e.target.value})} />
          </div>
          <div className="qa-form-group">
            <label>Final Grade</label>
            <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
              <option value="">-- Select Grade --</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>
          <div className="qa-form-group full">
            <label>Inspector Remarks</label>
            <textarea rows="3" placeholder="Enter observations about the wool quality..." value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})}></textarea>
          </div>
        </div>

        <div className="decision-panel">
          <button className="btn-approve" onClick={handleApprove}>
            <CheckCircle size={20} /> Approve & Issue Certificate
          </button>
          <button className="btn-reject" onClick={handleReject}>
            <XCircle size={20} /> Reject Batch
          </button>
        </div>
      </div>
    </div>
  );
}
