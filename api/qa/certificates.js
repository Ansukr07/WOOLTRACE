import dbConnect from '../_utils/db.js';
import QualityCertificate from '../_models/QualityCertificate.js';
import InspectionRequest from '../_models/InspectionRequest.js';
import WoolBatch from '../_models/WoolBatch.js';

export default async function handler(req, res) {
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

      // Generate Certificate ID
      const count = await QualityCertificate.countDocuments();
      const certificateId = `WTC-QA-2026-${String(count + 100).padStart(5, '0')}`;
      
      const verificationUrl = `${req.headers.origin || 'http://localhost:3000'}/verify/${certificateId}`;

      const cert = await QualityCertificate.create({
        certificateId,
        batchId,
        requestId,
        farmerName,
        origin,
        quantity,
        woolType,
        grade,
        overallScore,
        fiberDiameter,
        cleanliness,
        moisture,
        color,
        strength,
        contamination,
        foreignMatter,
        remarks,
        inspectorId,
        verificationUrl
      });

      // Update Inspection Request
      await InspectionRequest.findOneAndUpdate(
        { requestId },
        { status: 'CERTIFICATE_ISSUED' }
      );

      // Update Wool Batch
      await WoolBatch.findOneAndUpdate(
        { batchId },
        { qualityStatus: 'Certified' }
      );

      return res.status(201).json({ success: true, data: cert });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
