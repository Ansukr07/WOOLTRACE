import mongoose from 'mongoose';

const woolBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  originalQuantity: {
    type: Number,
    min: 0,
    default: function defaultOriginalQuantity() {
      return this.quantity;
    }
  },
  availableQuantity: {
    type: Number,
    min: 0,
    default: function defaultAvailableQuantity() {
      return this.originalQuantity ?? this.quantity ?? 0;
    }
  },
  reservedQuantity: { type: Number, default: 0, min: 0 },
  soldQuantity: { type: Number, default: 0, min: 0 },
  sheepCount: { type: Number, default: 0, min: 0 },
  woolType: { type: String, required: true },
  origin: { type: String },
  shearingDate: { type: Date },
  status: { type: String, default: 'At Farm' },
  qualityStatus: { type: String, default: 'Pending Inspection' },
  images: [{ type: String }],
  storageStatus: { type: String, default: 'Not Stored' },
  storageLocation: { type: mongoose.Schema.Types.Mixed },
  storageSince: { type: Date },
  currentStage: { type: String, default: 'FARM' },
  currentStatus: { type: String, default: 'Harvested at Farm' },
  currentLocation: { type: String },
  qualityGrade: { type: String, default: 'Pending QA' },
  certificateStatus: { type: String, default: 'Uninspected' },
  certificateId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.WoolBatch || mongoose.model('WoolBatch', woolBatchSchema);
