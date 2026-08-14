import dbConnect from '../_utils/db.js';
import InspectionRequest from '../_models/InspectionRequest.js';
import WoolBatch from '../_models/WoolBatch.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { id, inspectorId, farmerId, status } = req.query;

      if (id) {
        const request = await InspectionRequest.findOne({ requestId: id });
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
        return res.status(200).json({ success: true, data: request });
      }

      let query = {};
      if (inspectorId) query.inspectorId = inspectorId;
      if (farmerId) query.farmerId = farmerId;
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
      
      // Generate request ID
      const count = await InspectionRequest.countDocuments();
      const requestId = `QA-REQ-2026-${String(count + 100).padStart(5, '0')}`;

      const newRequest = await InspectionRequest.create({
        requestId,
        batchId,
        farmerId,
        farmerName,
        location,
        quantity,
        woolType,
        preferredDate,
        message
      });

      // Update the Batch status
      await WoolBatch.findOneAndUpdate(
        { batchId },
        { qualityStatus: 'Pending Inspection' }
      );

      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // PUT - Update a request (assign, approve, etc.)
  if (req.method === 'PUT') {
    try {
      const { requestId, status, inspectorId } = req.body;
      if (!requestId) return res.status(400).json({ success: false, message: 'requestId is required' });

      let updateData = {};
      if (status) updateData.status = status;
      if (inspectorId) updateData.inspectorId = inspectorId;

      const updatedReq = await InspectionRequest.findOneAndUpdate(
        { requestId },
        updateData,
        { new: true }
      );

      return res.status(200).json({ success: true, data: updatedReq });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
