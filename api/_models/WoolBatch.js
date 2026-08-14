import mongoose from 'mongoose';

const woolBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String },
  quantity: { type: Number, required: true },
  woolType: { type: String, required: true },
  origin: { type: String },
  shearingDate: { type: Date },
  status: { type: String, default: 'At Farm' },
  qualityStatus: { type: String, default: 'Pending Inspection' },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.WoolBatch || mongoose.model('WoolBatch', woolBatchSchema);
