import dbConnect from './_utils/db.js';
import QualityCertificate from './_models/QualityCertificate.js';
import InspectionRequest from './_models/InspectionRequest.js';
import WoolBatch from './_models/WoolBatch.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// ── /api/qa/certificates ──────────────────────────────────────────────────
async function handleCertificates(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { id, batchId, inspectorId } = req.query;
      if (id) {
        const cert = await QualityCertificate.findOne({ certificateId: id });
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
        return res.status(200).json({ success: true, data: cert });
      }
      if (batchId) {
        const cert = await QualityCertificate.findOne({ batchId, status: 'VALID' });
        return res.status(200).json({ success: true, data: cert });
      }
      let query = {};
      if (inspectorId) query.inspectorId = inspectorId;
      const certs = await QualityCertificate.find(query).sort({ issuedAt: -1 });
      return res.status(200).json({ success: true, data: certs });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        batchId, requestId, farmerName, origin, quantity, woolType,
        grade, overallScore, fiberDiameter, cleanliness, moisture,
        color, strength, contamination, foreignMatter, remarks, inspectorId
      } = req.body;
      const count = await QualityCertificate.countDocuments();
      const certificateId = `WTC-QA-2026-${String(count + 100).padStart(5, '0')}`;
      const verificationUrl = `${req.headers.origin || 'http://localhost:3000'}/verify/${certificateId}`;
      const cert = await QualityCertificate.create({
        certificateId, batchId, requestId, farmerName, origin, quantity, woolType,
        grade, overallScore, fiberDiameter, cleanliness, moisture,
        color, strength, contamination, foreignMatter, remarks, inspectorId, verificationUrl
      });
      await InspectionRequest.findOneAndUpdate({ requestId }, { status: 'CERTIFICATE_ISSUED' });
      await WoolBatch.findOneAndUpdate({ batchId }, { qualityStatus: 'Certified' });
      return res.status(201).json({ success: true, data: cert });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// ── /api/qa/requests ──────────────────────────────────────────────────────
async function handleQaRequests(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { id, batchId, inspectorId, farmerId, status } = req.query;
      if (id) {
        const request = await InspectionRequest.findOne({ requestId: id });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        return res.status(200).json({ success: true, data: request });
      }
      let query = {};
      if (inspectorId) query.inspectorId = inspectorId;
      if (farmerId) query.farmerId = farmerId;
      if (batchId) query.batchId = batchId;
      if (status) query.status = status;
      const requests = await InspectionRequest.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: requests });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { batchId, farmerId, farmerName, location, quantity, woolType, preferredDate, message } = req.body;
      const count = await InspectionRequest.countDocuments();
      const requestId = `QA-REQ-2026-${String(count + 100).padStart(5, '0')}`;
      const newRequest = await InspectionRequest.create({
        requestId, batchId, farmerId, farmerName, location, quantity, woolType, preferredDate, message
      });
      await WoolBatch.findOneAndUpdate({ batchId }, { qualityStatus: 'Pending Inspection' });
      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { requestId, status, inspectorId } = req.body;
      if (!requestId) return res.status(400).json({ success: false, message: 'requestId is required' });
      let updateData = {};
      if (status) updateData.status = status;
      if (inspectorId) updateData.inspectorId = inspectorId;
      const updatedReq = await InspectionRequest.findOneAndUpdate({ requestId }, updateData, { new: true });
      return res.status(200).json({ success: true, data: updatedReq });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// ── /api/qa/download-certificate ─────────────────────────────────────────
async function handleDownloadCertificate(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: 'Certificate ID is required' });
    await dbConnect();
    const cert = await QualityCertificate.findOne({ certificateId: id });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    const qrBuffer = await QRCode.toBuffer(cert.verificationUrl || `http://localhost:3000/verify/${cert.certificateId}`, { errorCorrectionLevel: 'H', width: 150 });
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${cert.certificateId}.pdf`);
    doc.pipe(res);
    doc.fillColor('#16A34A').fontSize(24).font('Helvetica-Bold').text('WOOLTRACE', { align: 'center' });
    doc.fillColor('#0B120D').fontSize(16).text('WOOL QUALITY CERTIFICATE', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').text('Certificate Details', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('Certificate ID: ', { continued: true }).font('Helvetica').text(cert.certificateId);
    doc.font('Helvetica-Bold').text('Batch ID: ', { continued: true }).font('Helvetica').text(cert.batchId);
    doc.font('Helvetica-Bold').text('Producer/Farmer: ', { continued: true }).font('Helvetica').text(cert.farmerName || 'Registered Farmer');
    doc.font('Helvetica-Bold').text('Wool Type: ', { continued: true }).font('Helvetica').text(cert.woolType || 'Medium Wool');
    doc.font('Helvetica-Bold').text('Quantity: ', { continued: true }).font('Helvetica').text(`${cert.quantity} KG`);
    doc.font('Helvetica-Bold').text('Origin: ', { continued: true }).font('Helvetica').text(cert.origin || 'N/A');
    doc.font('Helvetica-Bold').text('Inspection Date: ', { continued: true }).font('Helvetica').text(new Date(cert.issuedAt).toLocaleDateString());
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Grade: ', { continued: true }).font('Helvetica').text(cert.grade);
    doc.font('Helvetica-Bold').text('Quality Score: ', { continued: true }).font('Helvetica').text(`${cert.overallScore}/100`);
    doc.font('Helvetica-Bold').text('Inspector: ', { continued: true }).font('Helvetica').text(`${cert.inspectorName || 'Auth Inspector'} (${cert.inspectorId})`);
    doc.font('Helvetica-Bold').text('Status: ', { continued: true }).fillColor('#16A34A').text('✓ VERIFIED').fillColor('#0B120D');
    doc.font('Helvetica-Bold').text('Issue Date: ', { continued: true }).font('Helvetica').text(new Date(cert.issuedAt).toLocaleDateString());
    doc.moveDown(2);
    doc.font('Helvetica-Bold').text('Basic Quality Parameters', { underline: true });
    doc.moveDown(0.5);
    const startY = doc.y;
    doc.font('Helvetica-Bold').text('Parameter', 50, startY);
    doc.text('Result', 250, startY);
    doc.moveTo(50, startY + 15).lineTo(500, startY + 15).stroke();
    let currentY = startY + 25;
    const addRow = (param, result) => { doc.font('Helvetica').text(param, 50, currentY); doc.text(result, 250, currentY); currentY += 20; };
    addRow('Cleanliness', cert.cleanliness ? `${cert.cleanliness}/100` : 'N/A');
    addRow('Fiber Diameter', cert.fiberDiameter ? `${cert.fiberDiameter} microns` : 'N/A');
    addRow('Moisture', cert.moisture ? `${cert.moisture}%` : 'Normal');
    addRow('Color', cert.color || 'Natural');
    addRow('Contamination', cert.contamination || 'Low');
    doc.moveDown(3);
    doc.y = currentY + 40;
    doc.font('Helvetica-Bold').text('Verification', 50, doc.y, { underline: true });
    doc.moveDown(0.5);
    doc.image(qrBuffer, 50, doc.y, { width: 100 });
    doc.font('Helvetica').text("Scan to verify this certificate and view the wool batch's traceability.", 160, doc.y + 20, { width: 300 });
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Certificate Status: ${cert.status}`, 160, doc.y);
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Issued by: WoolTrace Quality Assurance', 160, doc.y);
    doc.y = 750;
    doc.fontSize(10).font('Helvetica-Oblique').text(`Certificate ID: ${cert.certificateId} | This certificate is digitally generated and can be verified through WoolTrace.`, 50, 750, { align: 'center', width: 500 });
    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'Failed to generate PDF' });
  }
}

// ── Main dispatcher ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  const url = req.url || '';
  if (url.includes('/download-certificate')) return handleDownloadCertificate(req, res);
  if (url.includes('/certificates'))        return handleCertificates(req, res);
  if (url.includes('/requests'))            return handleQaRequests(req, res);
  return res.status(404).json({ message: 'Not found' });
}
