import connectToDatabase from '../_utils/db.js';
import ProcessingRequest from '../_models/ProcessingRequest.js';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { id, batchId, processingUnitId, farmerId, status } = req.query;
      let query = {};
      if (id) query.requestId = id;
      if (batchId) query.batchId = batchId;
      if (processingUnitId) query.processingUnitId = processingUnitId;
      if (farmerId) query.farmerId = farmerId;
      if (status) query.status = status;

      if (id) {
        const req_ = await ProcessingRequest.findOne(query);
        return res.status(200).json({ success: true, data: req_ });
      }

      const requests = await ProcessingRequest.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: requests });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const count = await ProcessingRequest.countDocuments();
      const requestId = `PR-2026-${String(count + 1).padStart(5, '0')}`;

      const request = await ProcessingRequest.create({
        requestId,
        ...req.body
      });
      return res.status(201).json({ success: true, data: request });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { requestId, ...updates } = req.body;
      const updated = await ProcessingRequest.findOneAndUpdate(
        { requestId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
