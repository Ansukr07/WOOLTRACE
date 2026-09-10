import dbConnect from './_utils/db.js';
import WoolBatch from './_models/WoolBatch.js';
import { handleCors } from './_utils/http.js';

function toNonNegativeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
}

function normalizeBatchRecord(batch = {}) {
  const record = typeof batch.toObject === 'function' ? batch.toObject() : batch;
  const quantity = toNonNegativeNumber(record.quantity);
  const originalQuantity = toNonNegativeNumber(record.originalQuantity, quantity);
  const reservedQuantity = toNonNegativeNumber(record.reservedQuantity);
  const soldQuantity = toNonNegativeNumber(record.soldQuantity);
  const availableQuantity = toNonNegativeNumber(
    record.availableQuantity,
    Math.max(0, originalQuantity - reservedQuantity - soldQuantity)
  );

  return {
    ...record,
    id: record.batchId || record.id,
    batchId: record.batchId || record.id,
    quantity,
    originalQuantity,
    availableQuantity,
    reservedQuantity,
    soldQuantity,
    sheepCount: toNonNegativeNumber(record.sheepCount),
    status: record.status || 'At Farm',
    qualityStatus: record.qualityStatus || 'Pending Inspection',
    images: record.images || [],
    shearingDate: record.shearingDate || record.harvestDate || record.createdAt,
    storageStatus: record.storageStatus || 'Not Stored',
    storageLocation: record.storageLocation,
    storageSince: record.storageSince,
    currentStage: record.currentStage || 'FARM',
    currentStatus: record.currentStatus || record.status || 'Harvested at Farm',
    currentLocation: record.currentLocation || record.origin || 'Registered Farm',
    qualityGrade: record.qualityGrade || 'Pending QA',
    certificateStatus: record.certificateStatus || 'Uninspected',
    certificateId: record.certificateId || null,
    updatedAt: record.updatedAt || record.createdAt || new Date().toISOString()
  };
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { farmerId, id } = req.query;
      let query = {};
      if (farmerId) query.farmerId = farmerId;
      if (id) query.batchId = id;
      
      if (id) {
        const batch = await WoolBatch.findOne(query).lean();
        return res.status(200).json({ success: true, data: batch ? normalizeBatchRecord(batch) : null });
      }

      const batches = await WoolBatch.find(query).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: batches.map(normalizeBatchRecord) });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        farmerId,
        farmerName,
        quantity,
        woolType,
        origin,
        shearingDate,
        images,
        sheepCount,
        storageStatus,
        storageLocation,
        storageSince,
        currentStage,
        currentStatus,
        currentLocation,
        qualityGrade,
        certificateStatus,
        certificateId
      } = req.body;
      const normalizedQuantity = toNonNegativeNumber(quantity);
      if (normalizedQuantity <= 0) {
        return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
      }
      
      const count = await WoolBatch.countDocuments();
      const batchId = req.body.batchId || req.body.id || `WT-KA-2026-${String(count + 125).padStart(5, '0')}`;

      const batch = await WoolBatch.create({
        batchId,
        farmerId: farmerId || 'FARMER-01',
        farmerName: farmerName || 'Rajesh Kumar',
        quantity: normalizedQuantity,
        originalQuantity: toNonNegativeNumber(req.body.originalQuantity, normalizedQuantity),
        availableQuantity: toNonNegativeNumber(req.body.availableQuantity, normalizedQuantity),
        reservedQuantity: toNonNegativeNumber(req.body.reservedQuantity),
        soldQuantity: toNonNegativeNumber(req.body.soldQuantity),
        sheepCount: toNonNegativeNumber(sheepCount),
        woolType,
        origin,
        shearingDate,
        images,
        storageStatus,
        storageLocation,
        storageSince,
        currentStage,
        currentStatus,
        currentLocation: currentLocation || origin,
        qualityGrade,
        certificateStatus,
        certificateId,
        updatedAt: new Date()
      });

      return res.status(201).json({ success: true, data: normalizeBatchRecord(batch) });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
