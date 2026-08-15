import connectToDatabase from './_utils/db.js';
import ProcessingRequest from './_models/ProcessingRequest.js';
import ProcessingRecord from './_models/ProcessingRecord.js';

// ── /api/processing/requests ──────────────────────────────────────────────
async function handleRequests(req, res) {
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
      const request = await ProcessingRequest.create({ requestId, ...req.body });
      return res.status(201).json({ success: true, data: request });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { requestId, ...updates } = req.body;
      const updated = await ProcessingRequest.findOneAndUpdate(
        { requestId }, { ...updates, updatedAt: new Date() }, { new: true }
      );
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// ── /api/processing/records ───────────────────────────────────────────────
async function handleRecords(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { id, batchId, processingRequestId, status } = req.query;
      let query = {};
      if (id) query.recordId = id;
      if (batchId) query.batchId = batchId;
      if (processingRequestId) query.processingRequestId = processingRequestId;
      if (status) query.status = status;
      if (id) {
        const record = await ProcessingRecord.findOne(query);
        return res.status(200).json({ success: true, data: record });
      }
      const records = await ProcessingRecord.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: records });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { inputQuantity, outputQuantity } = req.body;
      if (outputQuantity !== undefined && Number(outputQuantity) > Number(inputQuantity)) {
        return res.status(400).json({ success: false, error: 'Output quantity cannot exceed input quantity.' });
      }
      if (outputQuantity !== undefined && Number(outputQuantity) < 0) {
        return res.status(400).json({ success: false, error: 'Output quantity cannot be negative.' });
      }
      const count = await ProcessingRecord.countDocuments();
      const recordId = `REC-2026-${String(count + 1).padStart(5, '0')}`;
      const record = await ProcessingRecord.create({ recordId, startTime: new Date(), ...req.body });
      return res.status(201).json({ success: true, data: record });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { recordId, outputQuantity, inputQuantity, ...updates } = req.body;
      if (outputQuantity !== undefined) {
        const existing = await ProcessingRecord.findOne({ recordId });
        const inQty = inputQuantity || existing?.inputQuantity || 0;
        if (Number(outputQuantity) > Number(inQty)) {
          return res.status(400).json({ success: false, error: 'Output quantity cannot exceed input quantity.' });
        }
        if (Number(outputQuantity) < 0) {
          return res.status(400).json({ success: false, error: 'Output quantity cannot be negative.' });
        }
        updates.outputQuantity = outputQuantity;
        updates.wasteQuantity = Number(inQty) - Number(outputQuantity);
      }
      if (inputQuantity !== undefined) updates.inputQuantity = inputQuantity;
      if (updates.status === 'COMPLETED') updates.completionTime = new Date();
      const updated = await ProcessingRecord.findOneAndUpdate(
        { recordId }, { ...updates, updatedAt: new Date() }, { new: true }
      );
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

// ── Main dispatcher ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  const url = req.url || '';
  if (url.includes('/records')) return handleRecords(req, res);
  if (url.includes('/requests')) return handleRequests(req, res);
  return res.status(404).json({ message: 'Not found' });
}
