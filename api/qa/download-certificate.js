import PDFDocument from 'pdfkit';
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

    // Generate QR code as Buffer
    const qrBuffer = await QRCode.toBuffer(cert.verificationUrl || `http://localhost:3000/verify/${cert.certificateId}`, { errorCorrectionLevel: 'H', width: 150 });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${cert.certificateId}.pdf`);

    doc.pipe(res);

    // Header
    doc.fillColor('#16A34A').fontSize(24).font('Helvetica-Bold').text('WOOLTRACE', { align: 'center' });
    doc.fillColor('#0B120D').fontSize(16).text('WOOL QUALITY CERTIFICATE', { align: 'center' });
    doc.moveDown(2);

    // Main details
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

    // Quality Parameters Table
    doc.font('Helvetica-Bold').text('Basic Quality Parameters', { underline: true });
    doc.moveDown(0.5);
    
    const startY = doc.y;
    doc.font('Helvetica-Bold').text('Parameter', 50, startY);
    doc.text('Result', 250, startY);
    
    doc.moveTo(50, startY + 15).lineTo(500, startY + 15).stroke();
    
    let currentY = startY + 25;
    const addRow = (param, result) => {
      doc.font('Helvetica').text(param, 50, currentY);
      doc.text(result, 250, currentY);
      currentY += 20;
    };

    addRow('Cleanliness', cert.cleanliness ? `${cert.cleanliness}/100` : 'N/A');
    addRow('Fiber Diameter', cert.fiberDiameter ? `${cert.fiberDiameter} microns` : 'N/A');
    addRow('Moisture', cert.moisture ? `${cert.moisture}%` : 'Normal');
    addRow('Color', cert.color || 'Natural');
    addRow('Contamination', cert.contamination || 'Low');
    
    doc.moveDown(3);

    // Footer and QR
    doc.y = currentY + 40;
    doc.font('Helvetica-Bold').text('Verification', 50, doc.y, { underline: true });
    doc.moveDown(0.5);
    
    doc.image(qrBuffer, 50, doc.y, { width: 100 });
    
    doc.font('Helvetica').text('Scan to verify this certificate and view the wool batch\'s traceability.', 160, doc.y + 20, { width: 300 });
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Certificate Status: ${cert.status}`, 160, doc.y);
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Issued by: WoolTrace Quality Assurance', 160, doc.y);
    
    doc.y = 750;
    doc.fontSize(10).font('Helvetica-Oblique').text(`Certificate ID: ${cert.certificateId} | This certificate is digitally generated and can be verified through WoolTrace.`, 50, 750, { align: 'center', width: 500 });

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to generate PDF' });
    }
  }
}
