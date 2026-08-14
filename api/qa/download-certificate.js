import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import dbConnect from '../_utils/db.js';
import QualityCertificate from '../_models/QualityCertificate.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Certificate ID is required' });

    await dbConnect();
    const cert = await QualityCertificate.findOne({ certificateId: id });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    // Generate QR code as Data URI
    const qrDataUri = await QRCode.toDataURL(cert.verificationUrl, { errorCorrectionLevel: 'H', width: 200 });

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>WoolTrace Quality Certificate</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          padding: 40px;
          background: #FFF;
          color: #0B120D;
        }
        .container {
          border: 4px solid #DDFF86;
          border-radius: 12px;
          padding: 40px;
          position: relative;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #16A34A;
          margin-bottom: 10px;
        }
        h1 {
          font-size: 32px;
          text-transform: uppercase;
          margin: 0 0 10px 0;
          letter-spacing: 2px;
        }
        .verified-badge {
          display: inline-block;
          background: #DCFCE7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 14px;
        }
        .cert-id {
          text-align: center;
          color: #666;
          margin-top: 20px;
          font-size: 14px;
        }
        .divider {
          height: 2px;
          background: #F0F0F0;
          margin: 30px 0;
        }
        h2 {
          font-size: 16px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .item label {
          display: block;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .item .val {
          font-size: 16px;
          font-weight: 600;
        }
        .highlight-box {
          background: #FAFFF0;
          border: 1px solid #DDFF86;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
        }
        .highlight-box .box-item {
          text-align: center;
        }
        .highlight-box .box-val {
          font-size: 36px;
          font-weight: 800;
          color: #16A34A;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 40px;
          align-items: center;
        }
        .inspector-info {
          font-size: 14px;
          line-height: 1.6;
        }
        .qr-section {
          text-align: right;
        }
        .qr-section img {
          width: 120px;
          height: 120px;
        }
        .qr-section p {
          font-size: 12px;
          color: #666;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">WOOLTRACE</div>
          <h1>Quality Certificate</h1>
          <div class="verified-badge">✓ VERIFIED BATCH</div>
          <div class="cert-id">Certificate ID: ${cert.certificateId}</div>
        </div>

        <h2>Batch Information</h2>
        <div class="grid">
          <div class="item"><label>Batch ID</label><div class="val">${cert.batchId}</div></div>
          <div class="item"><label>Farmer</label><div class="val">${cert.farmerName}</div></div>
          <div class="item"><label>Origin</label><div class="val">${cert.origin}</div></div>
          <div class="item"><label>Quantity & Type</label><div class="val">${cert.quantity} KG • ${cert.woolType}</div></div>
        </div>

        <div class="divider"></div>

        <h2>Quality Assessment</h2>
        <div class="highlight-box">
          <div class="box-item">
            <label style="font-size:12px;font-weight:800;color:#666;">GRADE</label>
            <div class="box-val">${cert.grade}</div>
          </div>
          <div class="box-item">
            <label style="font-size:12px;font-weight:800;color:#666;">SCORE</label>
            <div class="box-val">${cert.overallScore} <span style="font-size:16px;color:#999;">/100</span></div>
          </div>
        </div>

        <div class="grid">
          <div class="item"><label>Fiber Diameter</label><div class="val">${cert.fiberDiameter || '-'} μm</div></div>
          <div class="item"><label>Cleanliness</label><div class="val">${cert.cleanliness || '-'}%</div></div>
          <div class="item"><label>Moisture</label><div class="val">${cert.moisture || '-'}%</div></div>
          <div class="item"><label>Contamination</label><div class="val">${cert.contamination || '-'}</div></div>
        </div>

        <div class="footer-grid">
          <div class="inspector-info">
            <label style="font-size:12px;font-weight:800;color:#666;text-transform:uppercase;">Inspected By</label><br>
            <strong>${cert.inspectorName}</strong><br>
            <span style="color:#666;">Auth ID: ${cert.inspectorId}</span><br>
            <br>
            <label style="font-size:12px;font-weight:800;color:#666;text-transform:uppercase;">Inspection Date</label><br>
            <strong>${new Date(cert.issuedAt).toLocaleDateString()}</strong>
          </div>
          <div class="qr-section">
            <img src="${qrDataUri}" alt="Verification QR Code" />
            <p>Scan to verify certificate</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', \`attachment; filename=\${cert.certificateId}.pdf\`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to generate PDF' });
  }
}
