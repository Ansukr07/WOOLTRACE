import React, { useRef } from 'react';
import { X, Award, Download, Printer, Share2, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import './CertificateModal.css';

const CertificateModal = ({ module, quizResult, lang = 'en', onClose }) => {
  const certRef = useRef(null);
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('wooltrace_user')) || {}; }
    catch { return {}; }
  })();

  const farmerName = user.name || 'Farmer';
  const certId = `WT-CERT-${module.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = quizResult?.date
    ? new Date(quizResult.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const verifyUrl = `https://wooltrace.in/verify/${certId}`;

  const handlePrint = () => {
    const printContent = certRef.current;
    const win = window.open('', '_blank', 'width=900,height=650');
    win.document.write(`
      <html>
        <head>
          <title>WoolTrace Certificate — ${module.title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8F8F3; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `WoolTrace Certificate — ${module.title}`,
          text: `${farmerName} has completed the "${module.title}" course on WoolTrace Academy with a score of ${quizResult?.score}%!`,
          url: verifyUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(verifyUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="cert-backdrop" onClick={onClose}>
      <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cert-modal-header">
          <div>
            <h2>Completion Certificate</h2>
            <p>Download, print, or share your achievement</p>
          </div>
          <button className="cert-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Certificate Card */}
        <div className="cert-card-wrap">
          <div className="cert-card" ref={certRef}>
            {/* Top bar */}
            <div className="cert-topbar">
              <span className="cert-brand">WOOL<strong>TRACE</strong></span>
              <span className="cert-tagline">From Farm to Fabric</span>
            </div>

            {/* Body */}
            <div className="cert-body">
              <div className="cert-award-icon">
                <Award size={40} />
              </div>
              <p className="cert-presented">This certifies that</p>
              <h1 className="cert-name">{farmerName}</h1>
              <p className="cert-completed">has successfully completed</p>
              <h2 className="cert-course">{module.title}</h2>
              <p className="cert-meta">
                WoolTrace Farmer Academy &nbsp;•&nbsp; {module.level} Level &nbsp;•&nbsp; {module.duration}
              </p>

              {quizResult && (
                <div className="cert-score-chip">
                  <CheckCircle size={15} />
                  Quiz Score: {quizResult.score}%
                </div>
              )}

              <div className="cert-divider" />

              <div className="cert-footer-row">
                <div className="cert-footer-left">
                  <span className="cert-date-label">Date of Completion</span>
                  <strong className="cert-date">{dateStr}</strong>
                  <span className="cert-id">ID: {certId}</span>
                </div>

                <div className="cert-qr-wrap">
                  <QRCode
                    value={verifyUrl}
                    size={72}
                    bgColor="transparent"
                    fgColor="#0B120D"
                  />
                  <span className="cert-qr-label">Scan to verify</span>
                </div>

                <div className="cert-signature">
                  <div className="cert-sig-line" />
                  <span>WoolTrace Academy</span>
                  <span className="cert-sig-sub">Authorised Certification</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="cert-actions">
          <button className="cert-action-btn cert-print-btn" onClick={handlePrint}>
            <Printer size={17} />
            Print Certificate
          </button>
          <button className="cert-action-btn cert-share-btn" onClick={handleShare}>
            <Share2 size={17} />
            Share
          </button>
        </div>

        <p className="cert-verify-note">
          Verify this certificate at: <a href={verifyUrl} target="_blank" rel="noreferrer">{verifyUrl}</a>
        </p>
      </div>
    </div>
  );
};

export default CertificateModal;
