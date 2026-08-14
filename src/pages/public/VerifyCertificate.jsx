import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { qaService } from '../../services/qa/qaService';
import { ShieldCheck, CheckCircle, ShieldAlert, Check } from 'lucide-react';
import './Verify.css';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCert();
  }, [certificateId]);

  const loadCert = async () => {
    try {
      const data = await qaService.getCertificate(certificateId);
      setCert(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Certificate Details...</div>;
  
  if (!cert) return (
    <div className="verify-page">
      <div className="verify-card error">
        <ShieldAlert size={48} color="#DC2626" />
        <h2>Certificate Not Found</h2>
        <p>This certificate ID does not exist in the WoolTrace registry.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>Return to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-header">
          <ShieldCheck size={40} color="#16A34A" />
          <h1>VERIFIED QUALITY CERTIFICATE</h1>
          <p>Official WoolTrace Authentication</p>
        </div>

        <div className="verify-body">
          <div className="cert-status-banner">
            <CheckCircle size={24} />
            <div>
              <strong>Certificate Status: {cert.status}</strong>
              <span>This digital certificate was cryptographically issued and verified by WoolTrace.</span>
            </div>
          </div>

          <div className="cert-grid">
            <div className="cert-item">
              <label>Certificate ID</label>
              <div className="val">{cert.certificateId}</div>
            </div>
            <div className="cert-item">
              <label>Batch ID</label>
              <div className="val">{cert.batchId}</div>
            </div>
            <div className="cert-item">
              <label>Farmer / Origin</label>
              <div className="val">{cert.farmerName}<br/>{cert.origin}</div>
            </div>
            <div className="cert-item">
              <label>Wool Type & Quantity</label>
              <div className="val">{cert.quantity} KG • {cert.woolType}</div>
            </div>
            <div className="cert-item">
              <label>Inspection Date</label>
              <div className="val">{new Date(cert.issuedAt).toLocaleDateString()}</div>
            </div>
            <div className="cert-item">
              <label>Authorized Inspector</label>
              <div className="val">{cert.inspectorName} ({cert.inspectorId})</div>
            </div>
          </div>

          <div className="grade-box">
            <div>
              <label>Final Grade</label>
              <div className="grade-val">{cert.grade}</div>
            </div>
            <div>
              <label>Overall Score</label>
              <div className="score-val">{cert.overallScore} <span>/ 100</span></div>
            </div>
          </div>

          <div className="trace-timeline">
            <h3>Farm-to-Fabric Traceability</h3>
            <div className="timeline-steps">
              <div className="step active"><div className="circle"><Check size={12}/></div><span>FARM</span></div>
              <div className="line active"></div>
              <div className="step active"><div className="circle"><Check size={12}/></div><span>QUALITY</span></div>
              <div className="line"></div>
              <div className="step"><div className="circle"></div><span>MARKET</span></div>
              <div className="line"></div>
              <div className="step"><div className="circle"></div><span>TRANSPORT</span></div>
              <div className="line"></div>
              <div className="step"><div className="circle"></div><span>WAREHOUSE</span></div>
              <div className="line"></div>
              <div className="step"><div className="circle"></div><span>PROCESSING</span></div>
              <div className="line"></div>
              <div className="step"><div className="circle"></div><span>FABRIC</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
