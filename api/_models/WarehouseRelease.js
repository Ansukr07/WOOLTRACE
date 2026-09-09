import mongoose from 'mongoose';

const warehouseReleaseSchema = new mongoose.Schema({
  releaseId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  warehouseId: String,
  warehouseName: String,
  originalStoredQty: { type: Number, required: true },
  releasedQty: { type: Number, required: true },
  remainingQty: { type: Number, required: true },
  requestedBy: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  approvedBy: String,
  approvedAt: Date
}, { timestamps: true });

export default mongoose.models.WarehouseRelease || mongoose.model('WarehouseRelease', warehouseReleaseSchema);
