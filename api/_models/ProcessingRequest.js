import mongoose from 'mongoose';

const processingRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String },
  processingUnitId: { type: String },
  processingUnitName: { type: String },
  requestedOperations: [{ type: String }],
  quantity: { type: Number },
  woolType: { type: String },
  grade: { type: String },
  qualityScore: { type: Number },
  origin: { type: String },
  message: { type: String },
  priority: { type: String, default: 'NORMAL' },
  status: { type: String, default: 'REQUESTED' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

processingRequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ProcessingRequest ||
  mongoose.model('ProcessingRequest', processingRequestSchema);
